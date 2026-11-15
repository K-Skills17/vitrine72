/**
 * Builder QA. Every result here comes from a check that actually ran;
 * nothing is assumed to pass. A failed check keeps the project in `qa`
 * (the platform does not email the client) and lists the reasons for the
 * operator. See .claude/skills/editorial-web-build/SKILL.md §0.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { paletteContrastIssues, type Palette } from "./design-presets.js";

export type CheckStatus = "pass" | "fail";

export type QaResult = {
  passed: boolean;
  checks: Record<string, CheckStatus>;
  blocking_issues: string[];
};

/** Subset of SiteConfig the checks need; keeps this module testable. */
export type QaInput = {
  businessName: string;
  vertical: string;
  phone: string;
  palette: Palette;
  copyBlocks: {
    heroHeadline: string;
    heroSubheadline: string;
    aboutText: string;
    serviceDescriptions: Record<string, string>;
    faqAnswers: Record<string, string>;
  };
};

// ─── Regulated verticals ──────────────────────────────────────────────────────

/** Verticals whose professional councils restrict claims and testimonials. */
const REGULATED_KEYWORDS = ["estetica", "fisio", "odonto", "dent", "medic", "clinic", "nutri", "psico", "advoca", "saude"];

export function isRegulatedVertical(vertical: string): boolean {
  const v = normalize(vertical);
  return REGULATED_KEYWORDS.some((k) => v.includes(k));
}

/** Outcome promises that regulated professionals may not advertise. */
const PROMISE_PATTERNS = [
  /garant/i,
  /100\s?%/,
  /sem dor/i,
  /sem risco/i,
  /resultados? (imediato|definitivo|permanente)/i,
  /antes e depois/i,
];

// ─── Banned phrases ───────────────────────────────────────────────────────────

/** Looks for config/banned-phrases.json in the Docker image and in the monorepo. */
export function loadBannedPhrases(): string[] {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [resolve(here, "../config/banned-phrases.json"), resolve(here, "../../../config/banned-phrases.json")];
  const path = candidates.find((p) => existsSync(p));
  if (!path) throw new Error(`banned-phrases.json not found (looked in ${candidates.join(", ")})`);
  return (JSON.parse(readFileSync(path, "utf8")) as { phrases: string[] }).phrases;
}

export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// ─── Checks ───────────────────────────────────────────────────────────────────

function allCopy(input: QaInput): Array<[string, string]> {
  const { copyBlocks: c } = input;
  return [
    ["heroHeadline", c.heroHeadline],
    ["heroSubheadline", c.heroSubheadline],
    ["aboutText", c.aboutText],
    ...Object.entries(c.serviceDescriptions).map(([k, v]) => [`service "${k}"`, v] as [string, string]),
    ...Object.entries(c.faqAnswers).map(([k, v]) => [`faq "${k}"`, v] as [string, string]),
  ];
}

export function checkConfig(input: QaInput, bannedPhrases: string[]): QaResult {
  const checks: Record<string, CheckStatus> = {};
  const issues: string[] = [];
  const record = (name: string, found: string[]) => {
    checks[name] = found.length === 0 ? "pass" : "fail";
    issues.push(...found);
  };

  const copy = allCopy(input);

  record(
    "required_fields",
    [
      !input.businessName.trim() && "Business name is empty.",
      !input.copyBlocks.heroHeadline.trim() && "Hero headline is empty.",
      !input.copyBlocks.heroSubheadline.trim() && "Hero subheadline is empty.",
      !input.copyBlocks.aboutText.trim() && "About text is empty.",
    ].filter((x): x is string => Boolean(x)),
  );

  const digits = input.phone.replace(/\D/g, "");
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  record("phone_format", /^[1-9][0-9]\d{8,9}$/.test(local) ? [] : [`Phone "${input.phone}" is not a valid Brazilian number.`]);

  const words = input.copyBlocks.heroHeadline.trim().split(/\s+/).filter(Boolean).length;
  record("headline_length", words <= 12 ? [] : [`Hero headline has ${words} words (max 12).`]);

  const banned = bannedPhrases.map(normalize);
  record(
    "banned_phrases",
    copy.flatMap(([where, text]) =>
      banned.filter((p) => normalize(text).includes(p)).map((p) => `Banned phrase "${p}" in ${where}.`),
    ),
  );

  record(
    "placeholders",
    copy
      .filter(([, text]) => /PLACEHOLDER|lorem ipsum|TODO|\[[^\]]+\]|<[^>]+>/i.test(text))
      .map(([where]) => `Placeholder or markup left in ${where}.`),
  );

  if (isRegulatedVertical(input.vertical)) {
    record(
      "regulated_claims",
      copy.flatMap(([where, text]) =>
        PROMISE_PATTERNS.filter((re) => re.test(text)).map((re) => `Outcome promise (${re.source}) in ${where}: not allowed for ${input.vertical}.`),
      ),
    );
  }

  record("palette_contrast", paletteContrastIssues(input.palette));

  return { passed: issues.length === 0, checks, blocking_issues: issues };
}

/** Routes the client-site template generates. */
export const TEMPLATE_ROUTES = ["/", "/servicos", "/sobre", "/faq", "/contato"];

const decodeEntities = (html: string) =>
  html.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

/** Fetches every route of the deployed preview and checks it renders this business. */
export async function checkDeployment(
  previewUrl: string,
  businessName: string,
  fetchImpl: typeof fetch = fetch,
): Promise<QaResult> {
  const checks: Record<string, CheckStatus> = {};
  const issues: string[] = [];

  for (const route of TEMPLATE_ROUTES) {
    const name = `route ${route}`;
    try {
      const res = await fetchImpl(new URL(route, previewUrl), { redirect: "follow" });
      if (res.status === 401 || res.status === 403) {
        checks[name] = "fail";
        issues.push(`${route}: preview is protected (HTTP ${res.status}); could not verify. Check it manually.`);
        continue;
      }
      if (!res.ok) {
        checks[name] = "fail";
        issues.push(`${route}: HTTP ${res.status}.`);
        continue;
      }
      const html = decodeEntities(await res.text());
      if (!html.includes(businessName)) {
        checks[name] = "fail";
        issues.push(`${route}: page does not contain the business name.`);
        continue;
      }
      checks[name] = "pass";
    } catch (err) {
      checks[name] = "fail";
      issues.push(`${route}: request failed (${(err as Error).message}).`);
    }
  }

  return { passed: issues.length === 0, checks, blocking_issues: issues };
}

export function mergeResults(...results: QaResult[]): QaResult {
  return {
    passed: results.every((r) => r.passed),
    checks: Object.assign({}, ...results.map((r) => r.checks)),
    blocking_issues: results.flatMap((r) => r.blocking_issues),
  };
}
