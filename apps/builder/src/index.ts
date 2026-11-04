/**
 * Vitrine72 Site Builder
 * Railway service — polls Supabase for intake_complete projects and builds them.
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 *   VERCEL_TOKEN
 *   VITRINE72_PLATFORM_URL         e.g. https://www.vitrini72.com.br
 *   BUILD_WEBHOOK_SECRET
 *
 * Optional:
 *   VERCEL_TEAM_ID                 if deploying to a Vercel team
 *   POLL_INTERVAL_MS               default 60000 (1 minute)
 */

import { fetchIntakeCompleteProjects } from "./supabase.js";
import { processProject } from "./worker.js";

const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL_MS ?? "60000");

// Validate required env vars on startup
const REQUIRED = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ANTHROPIC_API_KEY",
  "VERCEL_TOKEN",
  "VITRINE72_PLATFORM_URL",
  "BUILD_WEBHOOK_SECRET",
];

for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(`[builder] Missing required env var: ${key}`);
    process.exit(1);
  }
}

console.log("[builder] Starting. Poll interval:", POLL_INTERVAL, "ms");

async function poll(): Promise<void> {
  try {
    const projects = await fetchIntakeCompleteProjects(5);

    if (projects.length === 0) {
      console.log("[builder] No projects to build.");
      return;
    }

    console.log(`[builder] Found ${projects.length} project(s) to build.`);

    // Process one at a time to avoid rate-limiting Claude/Vercel
    for (const project of projects) {
      await processProject(project.id);
    }
  } catch (err) {
    console.error("[builder] Poll cycle error:", err);
  }
}

async function run(): Promise<void> {
  while (true) {
    await poll();
    await sleep(POLL_INTERVAL);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run();
