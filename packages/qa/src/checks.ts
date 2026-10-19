/**
 * Automated QA checks for generated client sites.
 * All checks return CheckResult. The report aggregates them.
 * Blocks preview_sent status until all pass.
 */

import * as fs from "fs";
import * as path from "path";
import type { GeneratedSiteConfig } from "@vitrine72/site-template";

export interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

export interface QAResult {
  passed: boolean;
  checks: CheckResult[];
  blockingIssues: string[];
  lighthousePerformance: number | null;
  lighthouseAccessibility: number | null;
  lighthouseSeo: number | null;
}

// ─── Thresholds ───────────────────────────────────────────────────────────────
const THRESHOLDS = {
  lighthousePerformance: 85,
  lighthouseAccessibility: 90,
  lightheouseSeo: 95,
  minPhotos: 8,
};

// ─── Static file checks ──────────────────────────────────────────────────────

export function checkRobotsTxt(siteDir: string): CheckResult {
  const robotsPath = path.join(siteDir, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    return { name: "robots.txt", passed: false, message: "Missing robots.txt" };
  }
  const content = fs.readFileSync(robotsPath, "utf-8");
  const hasGptBot = content.includes("GPTBot");
  const hasSitemap = content.includes("Sitemap:");
  if (!hasGptBot || !hasSitemap) {
    return {
      name: "robots.txt",
      passed: false,
      message: `robots.txt missing ${!hasGptBot ? "GPTBot" : "Sitemap"} directive`,
    };
  }
  return { name: "robots.txt", passed: true, message: "OK" };
}

export function checkLlmsTxt(siteDir: string): CheckResult {
  const llmsPath = path.join(siteDir, "llms.txt");
  if (!fs.existsSync(llmsPath)) {
    return { name: "llms.txt", passed: false, message: "Missing llms.txt" };
  }
  const content = fs.readFileSync(llmsPath, "utf-8");
  if (content.length < 100) {
    return { name: "llms.txt", passed: false, message: "llms.txt appears empty" };
  }
  return { name: "llms.txt", passed: true, message: "OK" };
}

export function checkSitemapXml(siteDir: string): CheckResult {
  const sitemapPath = path.join(siteDir, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    return { name: "sitemap.xml", passed: false, message: "Missing sitemap.xml" };
  }
  const content = fs.readFileSync(sitemapPath, "utf-8");
  if (!content.includes("<urlset") || !content.includes("<loc>")) {
    return { name: "sitemap.xml", passed: false, message: "sitemap.xml invalid" };
  }
  return { name: "sitemap.xml", passed: true, message: "OK" };
}

export function checkSiteConfig(siteDir: string): CheckResult {
  const configPath = path.join(siteDir, "site-config.json");
  if (!fs.existsSync(configPath)) {
    return { name: "site-config.json", passed: false, message: "Missing site-config.json" };
  }
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as GeneratedSiteConfig;
    if (!config.businessName || !config.address || !config.phone) {
      return {
        name: "NAP check",
        passed: false,
        message: "Missing name, address or phone in site-config",
      };
    }
    return { name: "NAP check", passed: true, message: "OK" };
  } catch {
    return { name: "site-config.json", passed: false, message: "Invalid JSON" };
  }
}

export function checkNoBannedPhrases(siteDir: string): CheckResult {
  const configPath = path.join(siteDir, "site-config.json");
  if (!fs.existsSync(configPath)) {
    return { name: "banned-phrases", passed: false, message: "No site-config to check" };
  }

  let bannedPhrases: string[] = [];
  try {
    bannedPhrases = (
      require("../../../config/banned-phrases.json") as { phrases: string[] }
    ).phrases;
  } catch {
    return { name: "banned-phrases", passed: true, message: "No banned phrases config" };
  }

  const content = fs.readFileSync(configPath, "utf-8").toLowerCase();
  const found = bannedPhrases.filter((p) => content.includes(p.toLowerCase()));

  if (found.length > 0) {
    return {
      name: "banned-phrases",
      passed: false,
      message: `Banned phrases found: ${found.join(", ")}`,
    };
  }
  return { name: "banned-phrases", passed: true, message: "OK" };
}

export function checkNoPlaceholders(siteDir: string): CheckResult {
  const configPath = path.join(siteDir, "site-config.json");
  if (!fs.existsSync(configPath)) {
    return { name: "placeholders", passed: false, message: "No site-config" };
  }

  const content = fs.readFileSync(configPath, "utf-8");
  const placeholderPattern = /__PLACEHOLDER_[A-Z_]+__/g;
  const found = content.match(placeholderPattern);

  if (found && found.length > 0) {
    return {
      name: "placeholders",
      passed: false,
      message: `Placeholder tokens found: ${[...new Set(found)].join(", ")}`,
    };
  }
  return { name: "placeholders", passed: true, message: "OK" };
}

export function checkMinPhotos(config: GeneratedSiteConfig): CheckResult {
  const count = config.photos?.length ?? 0;
  if (count < THRESHOLDS.minPhotos) {
    return {
      name: "min-photos",
      passed: false,
      message: `Only ${count} photos (min ${THRESHOLDS.minPhotos})`,
    };
  }
  return { name: "min-photos", passed: true, message: `${count} photos OK` };
}

export function checkJsonLd(siteDir: string): CheckResult {
  const configPath = path.join(siteDir, "site-config.json");
  if (!fs.existsSync(configPath)) {
    return { name: "json-ld", passed: false, message: "No site-config" };
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as {
      jsonLd?: unknown[];
    };

    if (!config.jsonLd || !Array.isArray(config.jsonLd)) {
      return { name: "json-ld", passed: false, message: "Missing jsonLd array" };
    }

    const localBusiness = config.jsonLd.find(
      (item: unknown) =>
        typeof item === "object" &&
        item !== null &&
        "@type" in item
    );

    if (!localBusiness) {
      return { name: "json-ld", passed: false, message: "No @type in JSON-LD" };
    }

    return { name: "json-ld", passed: true, message: "OK" };
  } catch {
    return { name: "json-ld", passed: false, message: "JSON-LD parse error" };
  }
}

export function checkNoProvisionalCopy(siteDir: string): CheckResult {
  // data-copy="provisional" must not appear in generated client sites
  const htmlFiles = findFiles(siteDir, ".html");
  const tsxFiles = findFiles(siteDir, ".tsx");
  const allFiles = [...htmlFiles, ...tsxFiles];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (content.includes('data-copy="provisional"')) {
      return {
        name: "no-provisional-copy",
        passed: false,
        message: `Provisional copy found in ${path.relative(siteDir, file)}`,
      };
    }
  }

  return { name: "no-provisional-copy", passed: true, message: "OK" };
}

// ─── Aggregate ────────────────────────────────────────────────────────────────

export async function runAllChecks(
  siteDir: string,
  config: GeneratedSiteConfig,
  lighthouseResults?: {
    performance: number;
    accessibility: number;
    seo: number;
  }
): Promise<QAResult> {
  const checks: CheckResult[] = [
    checkRobotsTxt(siteDir),
    checkLlmsTxt(siteDir),
    checkSitemapXml(siteDir),
    checkSiteConfig(siteDir),
    checkNoBannedPhrases(siteDir),
    checkNoPlaceholders(siteDir),
    checkMinPhotos(config),
    checkJsonLd(siteDir),
    checkNoProvisionalCopy(siteDir),
  ];

  // Lighthouse checks
  const lhPerf = lighthouseResults?.performance ?? null;
  const lhA11y = lighthouseResults?.accessibility ?? null;
  const lhSeo = lighthouseResults?.seo ?? null;

  if (lhPerf !== null) {
    checks.push({
      name: "lighthouse-performance",
      passed: lhPerf >= THRESHOLDS.lighthousePerformance,
      message: `${lhPerf} (min ${THRESHOLDS.lighthousePerformance})`,
    });
  }
  if (lhA11y !== null) {
    checks.push({
      name: "lighthouse-accessibility",
      passed: lhA11y >= THRESHOLDS.lighthouseAccessibility,
      message: `${lhA11y} (min ${THRESHOLDS.lighthouseAccessibility})`,
    });
  }
  if (lhSeo !== null) {
    checks.push({
      name: "lighthouse-seo",
      passed: lhSeo >= THRESHOLDS.lightheouseSeo,
      message: `${lhSeo} (min ${THRESHOLDS.lightheouseSeo})`,
    });
  }

  const blockingIssues = checks
    .filter((c) => !c.passed)
    .map((c) => `${c.name}: ${c.message}`);

  return {
    passed: blockingIssues.length === 0,
    checks,
    blockingIssues,
    lighthousePerformance: lhPerf,
    lighthouseAccessibility: lhA11y,
    lighthouseSeo: lhSeo,
  };
}

function findFiles(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(full, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}
