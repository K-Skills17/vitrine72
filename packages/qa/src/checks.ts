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

// ─── AI optimization checks ───────────────────────────────────────────────────

export function checkAiCatalog(siteDir: string): CheckResult {
  const catalogPath = path.join(siteDir, "ai-catalog.json");
  if (!fs.existsSync(catalogPath)) {
    return { name: "ai-catalog", passed: false, message: "Missing ai-catalog.json" };
  }
  try {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8")) as Record<string, unknown>;
    const required = ["schema", "businessName", "location", "contact", "services", "hours"];
    const missing = required.filter((k) => !catalog[k]);
    if (missing.length > 0) {
      return { name: "ai-catalog", passed: false, message: `ai-catalog.json missing fields: ${missing.join(", ")}` };
    }
    const services = catalog["services"] as unknown[];
    if (!Array.isArray(services) || services.length === 0) {
      return { name: "ai-catalog", passed: false, message: "ai-catalog.json has no services" };
    }
    return { name: "ai-catalog", passed: true, message: `OK (${services.length} services)` };
  } catch {
    return { name: "ai-catalog", passed: false, message: "ai-catalog.json is not valid JSON" };
  }
}

export function checkWebMcp(siteDir: string): CheckResult {
  const mcpPath = path.join(siteDir, "webmcp.json");
  if (!fs.existsSync(mcpPath)) {
    return { name: "webmcp", passed: false, message: "Missing webmcp.json" };
  }
  try {
    const mcp = JSON.parse(fs.readFileSync(mcpPath, "utf-8")) as Record<string, unknown>;
    if (!mcp["tools"] || !Array.isArray(mcp["tools"]) || (mcp["tools"] as unknown[]).length < 3) {
      return { name: "webmcp", passed: false, message: "webmcp.json must have at least 3 tool definitions" };
    }
    if (!mcp["catalogEndpoint"]) {
      return { name: "webmcp", passed: false, message: "webmcp.json missing catalogEndpoint" };
    }
    return { name: "webmcp", passed: true, message: `OK (${(mcp["tools"] as unknown[]).length} tools)` };
  } catch {
    return { name: "webmcp", passed: false, message: "webmcp.json is not valid JSON" };
  }
}

export function checkLlmsTxtDepth(siteDir: string, config: GeneratedSiteConfig): CheckResult {
  const llmsPath = path.join(siteDir, "llms.txt");
  if (!fs.existsSync(llmsPath)) {
    return { name: "llms-txt-depth", passed: false, message: "Missing llms.txt" };
  }
  const content = fs.readFileSync(llmsPath, "utf-8");
  if (content.length < 300) {
    return { name: "llms-txt-depth", passed: false, message: `llms.txt too thin (${content.length} chars, min 300)` };
  }
  const hasServices = content.toLowerCase().includes("serviço") || content.toLowerCase().includes("service");
  const hasContact = content.includes(config.phone) || content.toLowerCase().includes("whatsapp");
  const hasLocation = config.neighborhoods.some((n) => content.toLowerCase().includes(n.toLowerCase()));
  if (!hasServices || !hasContact || !hasLocation) {
    return {
      name: "llms-txt-depth",
      passed: false,
      message: `llms.txt missing: ${[!hasServices && "services", !hasContact && "contact", !hasLocation && "location"].filter(Boolean).join(", ")}`,
    };
  }
  return { name: "llms-txt-depth", passed: true, message: `OK (${content.length} chars)` };
}

// ─── UI/UX & performance checks ───────────────────────────────────────────────

export function checkAnimationProfile(config: GeneratedSiteConfig): CheckResult {
  const profile = config.animationProfile;
  if (!profile) {
    return { name: "animation-profile", passed: false, message: "animationProfile not set in config" };
  }
  return { name: "animation-profile", passed: true, message: `Profile: ${profile} (${config.photos.length} photos)` };
}

export function checkSignatureElement(config: GeneratedSiteConfig): CheckResult {
  // generico vertical has no signature element by design — skip
  if (config.vertical === "generico") {
    return { name: "signature-element", passed: true, message: "Not required for generico vertical" };
  }
  if (!config.signatureElementEnabled) {
    // If photos meet the threshold, the element is intentionally hidden by the vertical (e.g. requires specific paired photos)
    if (config.photos.length >= 6) {
      return { name: "signature-element", passed: true, message: `Intentionally hidden by vertical (${config.photos.length} photos OK)` };
    }
    return {
      name: "signature-element",
      passed: false,
      message: `Not enough photos to enable signature element (have ${config.photos.length}, need 6)`,
    };
  }
  return { name: "signature-element", passed: true, message: "Enabled" };
}

export function checkColorContrast(config: GeneratedSiteConfig): CheckResult {
  // Rough WCAG AA check: luminance ratio of text vs background
  const textHex = config.palette.text;
  const bgHex = config.palette.background;
  const ratio = approximateContrastRatio(textHex, bgHex);
  if (ratio < 4.5) {
    return {
      name: "color-contrast",
      passed: false,
      message: `Text/background contrast ratio ~${ratio.toFixed(1)} (WCAG AA requires 4.5)`,
    };
  }
  return { name: "color-contrast", passed: true, message: `Contrast ratio ~${ratio.toFixed(1)} OK` };
}

function hexToRelativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const linearize = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function approximateContrastRatio(hex1: string, hex2: string): number {
  const l1 = hexToRelativeLuminance(hex1);
  const l2 = hexToRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Conversion & content quality checks ─────────────────────────────────────

const GENERIC_HERO_PHRASES = [
  "bem-vindo",
  "welcome",
  "olá",
  "sua empresa",
  "nossa empresa",
  "estamos aqui",
  "somos uma empresa",
  "conheça nossos",
  "saiba mais",
  "__placeholder",
];

export function checkHeroHeadline(config: GeneratedSiteConfig): CheckResult {
  const h = config.copyBlocks?.heroHeadline ?? "";
  if (!h || h.length < 20) {
    return {
      name: "hero-headline",
      passed: false,
      message: `Hero headline too short or missing (${h.length} chars, min 20)`,
    };
  }
  const lower = h.toLowerCase();
  const generic = GENERIC_HERO_PHRASES.find((p) => lower.includes(p));
  if (generic) {
    return {
      name: "hero-headline",
      passed: false,
      message: `Hero headline is generic: contains "${generic}"`,
    };
  }
  return { name: "hero-headline", passed: true, message: `OK (${h.length} chars)` };
}

export function checkHeroSubheadline(config: GeneratedSiteConfig): CheckResult {
  const sub = config.copyBlocks?.heroSubheadline ?? "";
  if (!sub || sub.length < 30) {
    return {
      name: "hero-subheadline",
      passed: false,
      message: `Hero subheadline too short or missing (${sub.length} chars, min 30)`,
    };
  }
  if (sub.toLowerCase().includes("__placeholder")) {
    return { name: "hero-subheadline", passed: false, message: "Hero subheadline is a placeholder" };
  }
  return { name: "hero-subheadline", passed: true, message: `OK (${sub.length} chars)` };
}

export function checkLocalSignals(config: GeneratedSiteConfig): CheckResult {
  const hasNeighborhood = (config.neighborhoods ?? []).length > 0;
  const hasAddressInCopy =
    config.address &&
    (
      JSON.stringify(config.copyBlocks ?? {}).toLowerCase().includes(
        config.address.split(",")[0].toLowerCase()
      ) ||
      (config.neighborhoods ?? []).some((n) =>
        JSON.stringify(config.copyBlocks ?? {}).toLowerCase().includes(n.toLowerCase())
      )
    );

  if (!hasNeighborhood && !hasAddressInCopy) {
    return {
      name: "local-signals",
      passed: false,
      message: "No neighborhood or address found — site will not rank for local searches",
    };
  }
  return {
    name: "local-signals",
    passed: true,
    message: `${(config.neighborhoods ?? []).length} neighborhood(s) defined`,
  };
}

export function checkPrimaryCTA(config: GeneratedSiteConfig): CheckResult {
  const url = config.primaryActionUrl ?? "";
  const isWhatsApp = url.startsWith("https://wa.me/") || url.startsWith("https://api.whatsapp.com/");
  const isTel = url.startsWith("tel:");
  if (!isWhatsApp && !isTel) {
    return {
      name: "primary-cta",
      passed: false,
      message: `primaryActionUrl is not a WhatsApp or tel link: "${url}"`,
    };
  }
  return { name: "primary-cta", passed: true, message: `CTA: ${config.primaryAction}` };
}

export function checkServicesComplete(config: GeneratedSiteConfig): CheckResult {
  const services = config.services ?? [];
  if (services.length < 2) {
    return {
      name: "services-complete",
      passed: false,
      message: `Only ${services.length} service(s) defined (min 2)`,
    };
  }
  const empty = services.filter(
    (s) => !s.description || s.description.trim().length < 10 || s.description.includes("__placeholder")
  );
  if (empty.length > 0) {
    return {
      name: "services-complete",
      passed: false,
      message: `${empty.length} service(s) have empty/placeholder descriptions: ${empty.map((s) => s.name).join(", ")}`,
    };
  }
  return { name: "services-complete", passed: true, message: `${services.length} services OK` };
}

export function checkFAQsPresent(config: GeneratedSiteConfig): CheckResult {
  const faqs = config.faqs ?? [];
  if (faqs.length < 2) {
    return {
      name: "faqs-present",
      passed: false,
      message: `Only ${faqs.length} FAQ(s) (min 2 required for SEO)`,
    };
  }
  const answers = config.copyBlocks?.faqAnswers ?? {};
  const emptyAnswers = faqs.filter((f) => {
    const a = answers[f.q] ?? "";
    return a.length < 20 || a.includes("__placeholder");
  });
  if (emptyAnswers.length > 0) {
    return {
      name: "faqs-present",
      passed: false,
      message: `${emptyAnswers.length} FAQ answer(s) are empty or placeholders`,
    };
  }
  return { name: "faqs-present", passed: true, message: `${faqs.length} FAQs with answers OK` };
}

export function checkReviewsUsed(config: GeneratedSiteConfig): CheckResult {
  if (!config.gbpData || config.gbpData.reviewCount === 0) {
    return { name: "reviews-used", passed: true, message: "No GBP data — skipped" };
  }
  if (config.gbpData.reviewCount >= 5 && config.gbpData.rating >= 4) {
    // If we have good reviews, at least 1 must appear in copy (check sourceFacts or about text)
    const reviewAuthors = config.gbpData.reviews.map((r) => r.author.split(" ")[0].toLowerCase());
    const allCopy = JSON.stringify(config.copyBlocks ?? {}).toLowerCase();
    const usedInCopy =
      reviewAuthors.some((a) => allCopy.includes(a)) ||
      (config.copyBlocks?.sourceFacts &&
        Object.values(config.copyBlocks.sourceFacts).flat().some((f) =>
          typeof f === "string" && f.toLowerCase().includes("avalia")
        ));

    if (!usedInCopy) {
      return {
        name: "reviews-used",
        passed: false,
        message: `Business has ${config.gbpData.reviewCount} reviews (${config.gbpData.rating}★) but none are referenced in copy — missed conversion opportunity`,
      };
    }
  }
  return {
    name: "reviews-used",
    passed: true,
    message: `GBP: ${config.gbpData.rating}★ (${config.gbpData.reviewCount} reviews) used`,
  };
}

export function checkAboutText(config: GeneratedSiteConfig): CheckResult {
  const about = config.copyBlocks?.aboutText ?? "";
  if (!about || about.length < 80) {
    return {
      name: "about-text",
      passed: false,
      message: `About text too short or missing (${about.length} chars, min 80)`,
    };
  }
  if (about.toLowerCase().includes("__placeholder")) {
    return { name: "about-text", passed: false, message: "About text is a placeholder" };
  }
  return { name: "about-text", passed: true, message: `OK (${about.length} chars)` };
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
    // Technical
    checkRobotsTxt(siteDir),
    checkLlmsTxt(siteDir),
    checkSitemapXml(siteDir),
    checkSiteConfig(siteDir),
    checkNoBannedPhrases(siteDir),
    checkNoPlaceholders(siteDir),
    checkMinPhotos(config),
    checkJsonLd(siteDir),
    checkNoProvisionalCopy(siteDir),
    // AI optimization
    checkAiCatalog(siteDir),
    checkWebMcp(siteDir),
    checkLlmsTxtDepth(siteDir, config),
    // UI/UX & performance
    checkAnimationProfile(config),
    checkSignatureElement(config),
    checkColorContrast(config),
    // Conversion & content quality
    checkHeroHeadline(config),
    checkHeroSubheadline(config),
    checkLocalSignals(config),
    checkPrimaryCTA(config),
    checkServicesComplete(config),
    checkFAQsPresent(config),
    checkReviewsUsed(config),
    checkAboutText(config),
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
