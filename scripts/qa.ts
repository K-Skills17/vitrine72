#!/usr/bin/env ts-node
/**
 * Usage: pnpm qa <projectId> [--url <previewUrl>]
 * Runs all QA checks on the generated site.
 * If --url is provided, also runs Lighthouse against that URL.
 */

import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";
import { runAllChecks } from "../packages/qa/src/checks";
import type { GeneratedSiteConfig } from "../packages/site-template/src/types";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../apps/web/.env.local") });

async function runLighthouse(url: string): Promise<{
  performance: number;
  accessibility: number;
  seo: number;
} | null> {
  const tmpDir = path.resolve(__dirname, "../.lhci-tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  try {
    execSync(
      `pnpm lhci collect --url="${url}" --numberOfRuns=1 --output=json --outputPath="${path.join(tmpDir, "lhci.json")}"`,
      { stdio: "pipe" }
    );
    const raw = JSON.parse(fs.readFileSync(path.join(tmpDir, "lhci.json"), "utf-8")) as {
      lhr: {
        categories: {
          performance?: { score: number };
          accessibility?: { score: number };
          seo?: { score: number };
        };
      };
    };
    const c = raw.lhr.categories;
    return {
      performance: Math.round((c.performance?.score ?? 0) * 100),
      accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
      seo: Math.round((c.seo?.score ?? 0) * 100),
    };
  } catch (err) {
    console.warn("Lighthouse run failed:", (err as Error).message.slice(0, 200));
    return null;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  const projectId = process.argv[2];
  if (!projectId) {
    console.error("Usage: pnpm qa <projectId> [--url <previewUrl>]");
    process.exit(1);
  }

  const urlFlagIdx = process.argv.indexOf("--url");
  const previewUrl = urlFlagIdx !== -1 ? process.argv[urlFlagIdx + 1] : null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const siteDir = path.resolve(__dirname, `../generated/${projectId}`);
  if (!fs.existsSync(siteDir)) {
    console.error(`Generated site not found at ${siteDir}. Run generate first.`);
    process.exit(1);
  }

  const configPath = path.join(siteDir, "site-config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as GeneratedSiteConfig;

  console.log("Running QA checks…");

  let lighthouseResults: { performance: number; accessibility: number; seo: number } | undefined;
  if (previewUrl) {
    console.log(`Running Lighthouse against ${previewUrl}…`);
    lighthouseResults = (await runLighthouse(previewUrl)) ?? undefined;
    if (lighthouseResults) {
      console.log(
        `Lighthouse: perf=${lighthouseResults.performance} a11y=${lighthouseResults.accessibility} seo=${lighthouseResults.seo}`
      );
    } else {
      console.warn("Lighthouse failed; proceeding without scores.");
    }
  } else {
    console.log("NOTE: Pass --url <previewUrl> to include Lighthouse scores.");
  }

  const result = await runAllChecks(siteDir, config, lighthouseResults);

  // Store QA report
  const { data: genSite } = await supabase
    .from("generated_sites")
    .select("id")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (genSite) {
    await supabase.from("qa_reports").insert({
      project_id: projectId,
      generated_site_id: genSite.id,
      passed: result.passed,
      lighthouse_performance: result.lighthousePerformance,
      lighthouse_accessibility: result.lighthouseAccessibility,
      lighthouse_seo: result.lighthouseSeo,
      checks: result.checks,
      blocking_issues: result.blockingIssues,
    });
  }

  // Print results
  for (const check of result.checks) {
    const icon = check.passed ? "✓" : "✗";
    const color = check.passed ? "\x1b[32m" : "\x1b[31m";
    console.log(`${color}${icon}\x1b[0m ${check.name}: ${check.message}`);
  }

  if (result.passed) {
    console.log("\n\x1b[32m✓ All QA checks passed. Ready for preview_sent.\x1b[0m");
  } else {
    console.log(
      `\n\x1b[31m✗ ${result.blockingIssues.length} blocking issue(s). Fix before sending preview.\x1b[0m`
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
