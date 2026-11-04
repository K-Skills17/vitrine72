/**
 * Post-build script: notifies the Vitrine72 platform that this client site
 * has been deployed and is ready for review.
 *
 * Required env vars (set in Vercel project settings for this client site):
 *   VITRINE72_PLATFORM_URL   — e.g. https://www.vitrini72.com.br
 *   BUILD_WEBHOOK_SECRET     — shared secret from platform settings
 *
 * Automatically available from Vercel:
 *   VERCEL_URL               — the deployment preview URL (no https://)
 *   VERCEL_ENV               — "production" | "preview" | "development"
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(resolve(__dirname, "../site-config.json"), "utf8")
);

const projectId = config.projectId;
const platformUrl = process.env.VITRINE72_PLATFORM_URL;
const secret = process.env.BUILD_WEBHOOK_SECRET;
const vercelUrl = process.env.VERCEL_URL;

if (!platformUrl || !secret) {
  console.log("[notify-deploy] VITRINE72_PLATFORM_URL or BUILD_WEBHOOK_SECRET not set — skipping.");
  process.exit(0);
}

if (!vercelUrl) {
  console.log("[notify-deploy] VERCEL_URL not set (local build?) — skipping.");
  process.exit(0);
}

if (!projectId || projectId === "dev-placeholder") {
  console.log("[notify-deploy] projectId is placeholder — skipping.");
  process.exit(0);
}

const previewUrl = `https://${vercelUrl}`;
const endpoint = `${platformUrl}/api/ops/projects/${projectId}/deploy`;

console.log(`[notify-deploy] Notifying platform for project ${projectId}...`);
console.log(`[notify-deploy] Preview URL: ${previewUrl}`);

try {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-build-secret": secret,
    },
    body: JSON.stringify({ preview_url: previewUrl }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`[notify-deploy] Platform returned ${res.status}:`, data);
    // Don't fail the build — the site is still deployed
    process.exit(0);
  }

  console.log(`[notify-deploy] Done. Project status: ${data.status}`);
} catch (err) {
  console.error("[notify-deploy] Failed to reach platform:", err.message);
  // Don't fail the build
  process.exit(0);
}
