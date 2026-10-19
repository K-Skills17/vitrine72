#!/usr/bin/env ts-node
/**
 * Usage: pnpm deploy <projectId> [--production]
 * Deploys the generated site to Vercel preview (or production with --production flag).
 * Production deploy respects the go-live guard (day 8).
 */

import * as path from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../apps/web/.env.local") });

const VERCEL_API = "https://api.vercel.com";

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
    console.error("VERCEL_API_TOKEN not configured (NEEDS #2)");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: project } = await supabase
    .from("projects")
    .select("id, status, golive_earliest_at, vertical")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    console.error("Project not found");
    process.exit(1);
  }

  // Production guard
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

  const siteDir = path.resolve(__dirname, `../generated/${projectId}`);
  if (!fs.existsSync(siteDir)) {
    console.error("Generated site not found. Run generate first.");
    process.exit(1);
  }

  const configPath = path.join(siteDir, "site-config.json");
  const siteConfig = JSON.parse(fs.readFileSync(configPath, "utf-8")) as {
    slug: string;
    businessName: string;
  };

  const projectName = `vitrine72-${siteConfig.slug}`;

  console.log(`Deploying ${siteConfig.businessName} to Vercel…`);

  // Create deployment via Vercel API
  const teamQuery = vercelTeam ? `?teamId=${vercelTeam}` : "";
  const deployRes = await fetch(`${VERCEL_API}/v13/deployments${teamQuery}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      target: isProduction ? "production" : "preview",
      source: "cli",
    }),
  });

  const deployData = await deployRes.json();

  if (!deployRes.ok) {
    console.error("Vercel API error:", JSON.stringify(deployData, null, 2));
    process.exit(1);
  }

  const deploymentId = deployData.id as string;
  const deploymentUrl = deployData.url as string;

  console.log(`✓ Deployment created: ${deploymentId}`);
  console.log(`  URL: https://${deploymentUrl}`);

  // Update DB
  if (isProduction) {
    await supabase
      .from("generated_sites")
      .update({ production_url: `https://${deploymentUrl}`, vercel_deployment_id: deploymentId })
      .eq("project_id", projectId);

    await supabase
      .from("projects")
      .update({ status: "live", preview_url: `https://${deploymentUrl}` })
      .eq("id", projectId);

    await supabase.from("audit_log").insert({
      project_id: projectId,
      actor: "deploy-script",
      action: "site_went_live",
      from_status: "approved",
      to_status: "live",
      metadata: { deploymentId, url: deploymentUrl },
    });
  } else {
    await supabase
      .from("generated_sites")
      .update({ preview_url: `https://${deploymentUrl}`, vercel_deployment_id: deploymentId })
      .eq("project_id", projectId);

    await supabase
      .from("projects")
      .update({ status: "preview_sent", preview_url: `https://${deploymentUrl}` })
      .eq("id", projectId);

    await supabase.from("audit_log").insert({
      project_id: projectId,
      actor: "deploy-script",
      action: "preview_sent",
      from_status: "qa",
      to_status: "preview_sent",
      metadata: { deploymentId, url: deploymentUrl },
    });
  }

  console.log(`\n✓ Done. ${isProduction ? "Site is live" : "Preview ready"}: https://${deploymentUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
