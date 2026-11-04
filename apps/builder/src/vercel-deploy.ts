/**
 * Deploys a generated site-config.json to Vercel using the Deployments API.
 * No git repo required — uploads all client-site template files directly.
 *
 * Flow:
 *  1. Walk the template directory, read all source files
 *  2. Inject the generated site-config.json
 *  3. Upload missing files to Vercel (cached by SHA1)
 *  4. Create a deployment
 *  5. Poll until READY
 *  6. Return the preview URL
 */

import { createHash } from "crypto";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import type { SiteConfig } from "./generate-config.js";

const VERCEL_API = "https://api.vercel.com";
const TEMPLATE_DIR = join(process.cwd(), "template");

// Files/dirs to exclude when uploading
const EXCLUDE = new Set([
  "node_modules",
  ".next",
  ".git",
  "tsconfig.tsbuildinfo",
  ".DS_Store",
  "scripts",          // our notify-deploy script isn't needed in API deployments
]);

type VercelFile = {
  file: string;   // relative path
  sha: string;    // SHA1 of content
  size: number;
  content: Buffer;
};

function walkDir(dir: string, base: string): VercelFile[] {
  const results: VercelFile[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDE.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".gitignore") continue;

    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, base));
    } else {
      const content = readFileSync(full);
      const sha = createHash("sha1").update(content).digest("hex");
      const relPath = relative(base, full).replace(/\\/g, "/");
      results.push({ file: relPath, sha, size: content.length, content });
    }
  }
  return results;
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function uploadFile(file: VercelFile, token: string, teamId?: string): Promise<void> {
  const qs = teamId ? `?teamId=${teamId}` : "";
  const res = await fetch(`${VERCEL_API}/v2/files${qs}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
      "x-vercel-digest": file.sha,
      "Content-Length": String(file.size),
    },
    body: file.content,
  });

  if (!res.ok && res.status !== 200) {
    // 200 = file already exists (cached), that's fine
    const body = await res.text();
    if (!body.includes("already exists") && res.status !== 409) {
      throw new Error(`File upload failed for ${file.file}: ${res.status} ${body.slice(0, 200)}`);
    }
  }
}

export async function deployToVercel(params: {
  projectId: string;
  config: SiteConfig;
  vercelToken: string;
  vercelTeamId?: string;
  supabaseUrl: string;
}): Promise<{ deploymentId: string; previewUrl: string }> {
  const { projectId, config, vercelToken, vercelTeamId, supabaseUrl } = params;

  const teamQuery = vercelTeamId ? `?teamId=${vercelTeamId}` : "";

  // 1. Walk template, build file list
  console.log("[vercel] Reading template files...");
  const templateFiles = walkDir(TEMPLATE_DIR, TEMPLATE_DIR);

  // 2. Inject generated site-config.json
  const configJson = JSON.stringify(config, null, 2);
  const configBuffer = Buffer.from(configJson, "utf8");
  const configSha = createHash("sha1").update(configBuffer).digest("hex");

  const files: VercelFile[] = templateFiles.map((f) =>
    f.file === "site-config.json"
      ? { file: "site-config.json", sha: configSha, size: configBuffer.length, content: configBuffer }
      : f
  );

  // 3. Upload all files
  console.log(`[vercel] Uploading ${files.length} files...`);
  await Promise.all(files.map((f) => uploadFile(f, vercelToken, vercelTeamId)));

  // 4. Determine or create Vercel project name
  const projectName = `v72-${projectId.slice(0, 8)}`;

  // 5. Create deployment
  console.log(`[vercel] Creating deployment for project '${projectName}'...`);

  const deployBody = {
    name: projectName,
    files: files.map(({ file, sha, size }) => ({ file, sha, size })),
    projectSettings: {
      framework: "nextjs",
      installCommand: "npm install",
      buildCommand: "next build",
      outputDirectory: ".next",
    },
    env: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    },
    target: "preview",
  };

  let deployRes = await fetch(`${VERCEL_API}/v13/deployments${teamQuery}`, {
    method: "POST",
    headers: authHeaders(vercelToken),
    body: JSON.stringify(deployBody),
  });

  // Handle "missing files" — upload them and retry once
  if (deployRes.status === 400) {
    const errorBody = await deployRes.json() as { error?: { code?: string; missingFiles?: string[] } };
    if (errorBody.error?.code === "missing_files" && errorBody.error.missingFiles?.length) {
      console.log(`[vercel] Re-uploading ${errorBody.error.missingFiles.length} missing files...`);
      const missing = new Set(errorBody.error.missingFiles);
      const toUpload = files.filter((f) => missing.has(f.sha));
      await Promise.all(toUpload.map((f) => uploadFile(f, vercelToken, vercelTeamId)));

      deployRes = await fetch(`${VERCEL_API}/v13/deployments${teamQuery}`, {
        method: "POST",
        headers: authHeaders(vercelToken),
        body: JSON.stringify(deployBody),
      });
    }
  }

  if (!deployRes.ok) {
    const body = await deployRes.text();
    throw new Error(`Deployment creation failed: ${deployRes.status} ${body.slice(0, 400)}`);
  }

  const deployment = await deployRes.json() as { id: string; url: string; readyState?: string };
  const deploymentId = deployment.id;
  let previewUrl = `https://${deployment.url}`;

  // 6. Poll until READY
  console.log(`[vercel] Deployment ${deploymentId} created. Waiting for build...`);
  previewUrl = await pollUntilReady(deploymentId, vercelToken, vercelTeamId);

  return { deploymentId, previewUrl };
}

async function pollUntilReady(
  deploymentId: string,
  token: string,
  teamId?: string,
  maxWaitMs = 10 * 60 * 1000 // 10 minutes
): Promise<string> {
  const start = Date.now();
  const qs = teamId ? `?teamId=${teamId}` : "";

  while (Date.now() - start < maxWaitMs) {
    await sleep(10_000); // poll every 10s

    const res = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn(`[vercel] Poll returned ${res.status}, retrying...`);
      continue;
    }

    const data = await res.json() as { readyState: string; url: string; errorMessage?: string };

    console.log(`[vercel] Build state: ${data.readyState}`);

    if (data.readyState === "READY") {
      return `https://${data.url}`;
    }

    if (data.readyState === "ERROR" || data.readyState === "CANCELED") {
      throw new Error(`Deployment failed with state ${data.readyState}: ${data.errorMessage ?? "unknown"}`);
    }
  }

  throw new Error(`Deployment timed out after ${maxWaitMs / 1000}s`);
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
