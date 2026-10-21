#!/usr/bin/env ts-node
/**
 * Usage: pnpm deploy <projectId> [--production]
 *
 * Flow:
 *   1. Read generated/${projectId}/site-config.json
 *   2. Copy apps/client-site template → /tmp/v72-deploy-${projectId}/
 *   3. Inject site-config.json into the copy
 *   4. pnpm install + next build
 *   5. vercel deploy --prebuilt [--prod]
 *   6. Update Supabase with URL + status
 */

import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../apps/web/.env.local") });

const REPO_ROOT = path.resolve(__dirname, "..");

async function main() {
  const projectId = process.argv[2];
  const isProduction = process.argv.includes("--production");

  if (!projectId) {
    console.error("Usage: pnpm deploy <projectId> [--production]");
    process.exit(1);
  }

  const vercelToken = process.env.VERCEL_API_TOKEN;
  const vercelTeam = process.env.VERCEL_TEAM_SLUG;

  if (!vercelToken || vercelToken.startsWith("PLACEHOLDER")) {
    console.error("VERCEL_API_TOKEN not configured");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Load project from DB
  const { data: project } = await supabase
    .from("projects")
    .select("id, status, golive_earliest_at, vertical")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    console.error("Project not found");
    process.exit(1);
  }

  // 2. Production guard
  if (isProduction) {
    if (project.golive_earliest_at) {
      const goLiveDate = new Date(project.golive_earliest_at);
      if (new Date() < goLiveDate) {
        console.error(
          `Cannot go live before ${goLiveDate.toISOString()} (8-day hold after payment)`
        );
        process.exit(1);
      }
    }
    if (project.status !== "approved") {
      console.error("Project must be in 'approved' status before going live");
      process.exit(1);
    }
  }

  // 3. Verify site-config.json exists
  const siteDir = path.resolve(REPO_ROOT, `generated/${projectId}`);
  if (!fs.existsSync(siteDir)) {
    console.error("Generated site not found. Run 'pnpm generate' first.");
    process.exit(1);
  }

  const configPath = path.join(siteDir, "site-config.json");
  if (!fs.existsSync(configPath)) {
    console.error(`site-config.json not found in ${siteDir}`);
    process.exit(1);
  }

  const siteConfig = JSON.parse(fs.readFileSync(configPath, "utf-8")) as {
    slug: string;
    businessName: string;
  };

  const projectName = `v72-${siteConfig.slug}`;
  console.log(`\nDeploying ${siteConfig.businessName} (${projectName})…\n`);

  // 4. Set up deploy directory in system temp
  const deployDir = path.join(os.tmpdir(), `v72-deploy-${projectId}`);
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true });
  }

  const templateDir = path.resolve(REPO_ROOT, "apps/client-site");
  if (!fs.existsSync(templateDir)) {
    console.error("apps/client-site template not found");
    process.exit(1);
  }

  // 5. Copy template (exclude node_modules and .next)
  console.log("Copying template…");
  copyDirExcluding(templateDir, deployDir, ["node_modules", ".next", ".vercel"]);

  // 6. Inject site-config.json
  fs.copyFileSync(configPath, path.join(deployDir, "site-config.json"));
  console.log("Injected site-config.json");

  // 7. Install + build
  console.log("\nInstalling dependencies…");
  execSync("pnpm install --frozen-lockfile", {
    cwd: deployDir,
    stdio: "inherit",
  });

  console.log("\nBuilding Next.js app…");
  execSync("pnpm build", {
    cwd: deployDir,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    },
  });

  // 8. Deploy via Vercel CLI
  const teamFlag = vercelTeam ? `--scope ${vercelTeam}` : "";
  const prodFlag = isProduction ? "--prod" : "";

  console.log("\nDeploying to Vercel…");
  const deployOutput = execSync(
    `vercel deploy --prebuilt --token ${vercelToken} ${teamFlag} ${prodFlag} --name ${projectName} --yes`,
    {
      cwd: deployDir,
      encoding: "utf-8",
    }
  ).trim();

  // Last non-empty line is the deployment URL
  const deploymentUrl = deployOutput
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("https://"))
    .pop();

  if (!deploymentUrl) {
    console.error("Could not parse deployment URL from Vercel output:\n", deployOutput);
    process.exit(1);
  }

  console.log(`\n✓ Deployed: ${deploymentUrl}`);

  // 9. Update Supabase
  const fromStatus = isProduction ? "approved" : project.status;
  const toStatus = isProduction ? "live" : "preview_sent";
  const urlField = isProduction ? "production_url" : "preview_url";

  await supabase
    .from("generated_sites")
    .update({ [urlField]: deploymentUrl })
    .eq("project_id", projectId);

  await supabase
    .from("projects")
    .update({ status: toStatus, preview_url: deploymentUrl })
    .eq("id", projectId);

  await supabase.from("audit_log").insert({
    project_id: projectId,
    actor: "deploy-script",
    action: isProduction ? "site_went_live" : "preview_sent",
    from_status: fromStatus,
    to_status: toStatus,
    metadata: { url: deploymentUrl },
  });

  // 10. Clean up temp dir
  fs.rmSync(deployDir, { recursive: true });

  console.log(
    `\n✓ Done. ${isProduction ? "Site is live" : "Preview ready"}: ${deploymentUrl}\n`
  );
}

function copyDirExcluding(src: string, dest: string, exclude: string[]) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirExcluding(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
