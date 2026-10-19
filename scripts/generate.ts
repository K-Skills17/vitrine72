#!/usr/bin/env ts-node
/**
 * Usage: pnpm generate <projectId>
 * Reads intake + research from Supabase, generates the site.
 */

import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { generateSite } from "../packages/site-template/src/generator";
import { runResearch } from "../packages/site-template/src/research";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../apps/web/.env.local") });

async function main() {
  const projectId = process.argv[2];
  if (!projectId) {
    console.error("Usage: pnpm generate <projectId>");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch intake
  const { data: project } = await supabase
    .from("projects")
    .select("*, intake_submissions(*)")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    console.error(`Project ${projectId} not found`);
    process.exit(1);
  }

  const intake = (project.intake_submissions as { data: Record<string, unknown> }[])?.[0]?.data ?? {};

  // Research pass
  console.log("Running research pass…");
  const gbpData = await runResearch({
    businessName: intake.businessName as string,
    address: intake.exactAddress as string,
    city: (intake.city as string) ?? "São Paulo",
  });

  if (gbpData) {
    // Store research
    await supabase.from("research").upsert({
      project_id: projectId,
      gbp_place_id: gbpData.placeId,
      rating: gbpData.rating,
      review_count: gbpData.reviewCount,
      reviews: gbpData.reviews,
      competitors: gbpData.competitors,
      customer_phrases: gbpData.customerPhrases,
      raw: {},
    });
  }

  const outputDir = path.resolve(__dirname, `../generated/${projectId}`);
  console.log(`Generating site → ${outputDir}`);

  const config = await generateSite({
    projectId,
    intake,
    gbpData,
    outputDir,
  });

  // Store generated site record
  const { data: genSite } = await supabase
    .from("generated_sites")
    .insert({
      project_id: projectId,
      slug: config.slug,
      vertical: config.vertical,
      layout_variant: config.layoutVariant,
      build_path: outputDir,
    })
    .select("id")
    .single();

  // Update project
  await supabase
    .from("projects")
    .update({ status: "qa", vertical: config.vertical })
    .eq("id", projectId);

  await supabase.from("audit_log").insert({
    project_id: projectId,
    actor: "generate-script",
    action: "site_generated",
    from_status: "in_production",
    to_status: "qa",
    metadata: { slug: config.slug, genSiteId: genSite?.id },
  });

  console.log(`✓ Site generated: ${config.businessName} (${config.vertical})`);
  console.log(`  Output: ${outputDir}`);
  console.log(`  Next step: pnpm qa ${projectId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
