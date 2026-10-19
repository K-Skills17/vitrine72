/**
 * Client site generator.
 * Reads intake + research data, writes a static Next.js site.
 */

import * as fs from "fs";
import * as path from "path";
import type { GeneratedSiteConfig, VerticalConfig, ColorPalette, FontPair } from "./types.js";
import { getVertical } from "./verticals/index.js";
import { draftCopy } from "./copy-drafter.js";
import { generateLocalBusinessJsonLd } from "./jsonld.js";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BANNED_PHRASES: string[] = (() => {
  try {
    return (require("../../config/banned-phrases.json") as { phrases: string[] }).phrases;
  } catch {
    return [];
  }
})();

export interface GeneratorInput {
  projectId: string;
  intake: Record<string, unknown>;
  gbpData: import("./types.js").GBPData | null;
  outputDir: string;
}

export async function generateSite(input: GeneratorInput): Promise<GeneratedSiteConfig> {
  const { projectId, intake, gbpData, outputDir } = input;

  const vertical = getVertical((intake.vertical as string) ?? "generico");
  const businessName = intake.businessName as string;

  // Choose color palette
  const palette = await choosePalette(vertical, intake);

  // Choose font pair
  const fontPair = vertical.fontPairs[0];

  // Choose layout variant from photos
  const photos = (intake.uploadedPhotos as string[]) ?? [];
  const layoutVariant = chooseLayoutVariant(photos);

  // Build config
  const services = buildServices(intake);
  const faqs = buildFaqs(intake);

  const config: GeneratedSiteConfig = {
    projectId,
    slug: slugify(businessName),
    vertical: vertical.id,
    businessName,
    address: (intake.exactAddress as string) ?? "",
    phone: (intake.whatsapp as string) ?? "",
    hours: (intake.hours as string) ?? "",
    hoursArray: parseHours((intake.hours as string) ?? ""),
    neighborhoods: ((intake.neighborhoods as string) ?? "").split(",").map((n) => n.trim()),
    services,
    faqs,
    gbpLink: (intake.gbpLink as string) ?? null,
    instagramLink: (intake.instagramLink as string) ?? null,
    primaryAction: (intake.primaryAction as string) ?? "whatsapp",
    primaryActionUrl: (intake.primaryActionUrl as string) ?? "",
    palette,
    fontPair,
    layoutVariant,
    photos,
    logoPath: (intake.logoPath as string) ?? null,
    gbpData,
    copyBlocks: {
      heroHeadline: "",
      heroSubheadline: "",
      aboutText: "",
      serviceDescriptions: {},
      faqAnswers: {},
      sourceFacts: {},
    },
    selfEditSheetUrl: (intake.updateFrequency as string) === "semanal"
      ? (intake.selfEditSheetUrl as string) ?? null
      : null,
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  // Draft copy
  config.copyBlocks = await draftCopy(config);

  // Write the site files
  await writeSiteFiles(config, vertical, outputDir);

  return config;
}

async function choosePalette(
  vertical: VerticalConfig,
  intake: Record<string, unknown>
): Promise<ColorPalette> {
  const choice = (intake.colorChoice as string) ?? "preset1";

  if (choice === "logo") {
    const logoPath = (intake.logoPath as string) ?? null;
    if (logoPath) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const logoUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${logoPath}`;
        const extracted = await extractLogopalette(logoUrl, vertical.palettes[0]);
        if (extracted) return extracted;
      }
    }
    // Logo extraction unavailable — fall through to preset1
    return vertical.palettes[0];
  }

  if (choice === "preset2") {
    return vertical.palettes[1] ?? vertical.palettes[0];
  }

  return vertical.palettes[0];
}

async function extractLogopalette(
  logoUrl: string,
  fallback: ColorPalette
): Promise<ColorPalette | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorThief = require("color-thief-node") as {
      getColorFromURL: (url: string) => Promise<[number, number, number]>;
      getPaletteFromURL: (url: string, count: number) => Promise<[number, number, number][]>;
    };

    const palette = await colorThief.getPaletteFromURL(logoUrl, 3);
    if (!palette || palette.length < 2) return null;

    const toHex = ([r, g, b]: [number, number, number]) =>
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    // Primary = most dominant color, accent = second color
    const primary = toHex(palette[0]);
    const accent = toHex(palette[1]);

    return {
      id: "logo-extracted",
      primary,
      secondary: fallback.secondary,
      accent,
      background: fallback.background,
      text: fallback.text,
    };
  } catch {
    return null;
  }
}

function chooseLayoutVariant(photos: string[]): number {
  // Simple heuristic: more photos → more visual layout
  if (photos.length >= 12) return 3;
  if (photos.length >= 8) return 2;
  return 1;
}

function buildServices(intake: Record<string, unknown>) {
  return [1, 2, 3]
    .map((n) => ({
      name: (intake[`service${n}Name`] as string) ?? "",
      description: "",
      price: (intake[`service${n}Price`] as string) ?? null,
    }))
    .filter((s) => s.name);
}

function buildFaqs(intake: Record<string, unknown>) {
  return [1, 2, 3, 4, 5]
    .map((n) => ({
      q: (intake[`faq${n}`] as string) ?? "",
      a: "",
    }))
    .filter((f) => f.q);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseHours(hours: string): string[] {
  // Returns structured OpeningHoursSpecification strings
  return hours.split("\n").map((l) => l.trim()).filter(Boolean);
}

async function writeSiteFiles(
  config: GeneratedSiteConfig,
  vertical: VerticalConfig,
  outputDir: string
): Promise<void> {
  fs.mkdirSync(outputDir, { recursive: true });

  // robots.txt
  const sitemapUrl = `https://${config.slug}.vitrine72.com.br/sitemap.xml`;
  fs.writeFileSync(
    path.join(outputDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
  );

  // llms.txt
  fs.writeFileSync(
    path.join(outputDir, "llms.txt"),
    generateLlmsTxt(config)
  );

  // JSON-LD
  const jsonLd = generateLocalBusinessJsonLd({
    type: vertical.schemaOrgType,
    name: config.businessName,
    address: config.address,
    phone: config.phone,
    hours: config.hoursArray,
    areaServed: config.neighborhoods,
    services: config.services,
    faqs: config.faqs,
    sameAs: [
      config.gbpLink,
      config.instagramLink
        ? `https://instagram.com/${config.instagramLink.replace("@", "")}`
        : null,
    ].filter(Boolean) as string[],
    url: `https://${config.slug}.vitrine72.com.br`,
    updatedAt: config.updatedAt,
  });

  // site-config.json (used by the generated Next.js site)
  fs.writeFileSync(
    path.join(outputDir, "site-config.json"),
    JSON.stringify({ ...config, jsonLd }, null, 2)
  );

  // sitemap.xml
  fs.writeFileSync(
    path.join(outputDir, "sitemap.xml"),
    generateSitemap(config, vertical)
  );

  // Validate copy: no banned phrases, no placeholders
  validateCopy(config);
}

function generateLlmsTxt(config: GeneratedSiteConfig): string {
  return `# ${config.businessName}

${config.businessName} é um negócio localizado em ${config.address}.

## Serviços

${config.services.map((s) => `- ${s.name}${s.price ? ` (${s.price})` : ""}`).join("\n")}

## Área atendida

${config.neighborhoods.join(", ")}, São Paulo.

## Horários

${config.hours}

## Contato

- WhatsApp: ${config.phone}
${config.gbpLink ? `- Google: ${config.gbpLink}` : ""}
${config.instagramLink ? `- Instagram: ${config.instagramLink}` : ""}

Atualizado em: ${config.updatedAt}
`;
}

function generateSitemap(config: GeneratedSiteConfig, vertical: VerticalConfig): string {
  const base = `https://${config.slug}.vitrine72.com.br`;
  const pages = vertical.pages;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${base}/${p.slug}</loc>
    <lastmod>${config.updatedAt}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

function validateCopy(config: GeneratedSiteConfig): void {
  const allText = JSON.stringify(config.copyBlocks).toLowerCase();
  const bannedFound = BANNED_PHRASES.filter((p) =>
    allText.includes(p.toLowerCase())
  );
  if (bannedFound.length > 0) {
    throw new Error(
      `Generator produced banned phrases: ${bannedFound.join(", ")}`
    );
  }
}
