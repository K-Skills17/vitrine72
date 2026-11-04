/**
 * Reference Site Analyzer
 *
 * Visits each reference site URL, takes a screenshot, sends it to Claude Vision,
 * and generates detailed styleNotes automatically.
 *
 * Run ONCE after adding new URLs to reference-sites.ts:
 *   node scripts/analyze-references.mjs
 *
 * Output: prints updated ReferenceSite entries to stdout.
 * Copy the styleNotes into reference-sites.ts.
 *
 * Requirements:
 *   npm install playwright @anthropic-ai/sdk
 *   npx playwright install chromium
 *   ANTHROPIC_API_KEY env var set
 */

import { chromium } from "playwright";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Paste your site URLs here ────────────────────────────────────────────────
// Add all 25 estetica reference URLs. The script will visit each, screenshot it,
// and have Claude describe the aesthetic in detail.

const SITES_TO_ANALYZE = [
  // { id: "est-01", url: "https://your-first-site.com.br", vertical: "estetica" },
  // { id: "est-02", url: "https://your-second-site.com.br", vertical: "estetica" },
  // ... add all 25 here
];

// ─── Analysis ─────────────────────────────────────────────────────────────────

async function screenshotPage(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    // Wait for fonts and images to settle
    await page.waitForTimeout(2000);
    const screenshot = await page.screenshot({ type: "png", fullPage: false });
    return screenshot;
  } finally {
    await browser.close();
  }
}

async function analyzeSite(site, screenshotBuffer) {
  const base64 = screenshotBuffer.toString("base64");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/png", data: base64 },
          },
          {
            type: "text",
            text: `Analise este screenshot de um site de ${site.vertical} brasileiro (URL: ${site.url}).

Responda em JSON com exatamente este formato:
{
  "mood": "<luxurious|warm|minimal|bold|clinical|playful|natural|vibrant|classic|artisan>",
  "colorScheme": "<light|dark|colorful>",
  "primaryColor": "<hex da cor mais dominante>",
  "accentColor": "<hex da cor de destaque/botão>",
  "backgroundColor": "<hex do fundo principal>",
  "fontPersonality": "<elegant|modern|friendly|bold|clean>",
  "layoutVariant": <1, 2, ou 3>,
  "styleNotes": "<Parágrafo detalhado em português descrevendo: (1) a linguagem de copywriting usada nos títulos e textos, (2) como os serviços são descritos, (3) o tom da CTA, (4) elementos visuais marcantes, (5) o que deve ser imitado ao gerar um site neste estilo. Seja específico e acionável para um modelo de linguagem seguir.>"
}

layoutVariant:
  1 = hero padrão → serviços → avaliações → sobre → faq → contato
  2 = grid de serviços em destaque logo acima do fold
  3 = seção "sobre/história" como âncora central da narrativa

Responda APENAS com JSON válido.`,
          },
        ],
      },
    ],
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const cleaned = rawText.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleaned);
}

async function main() {
  if (SITES_TO_ANALYZE.length === 0) {
    console.error("No sites to analyze. Add your URLs to the SITES_TO_ANALYZE array.");
    process.exit(1);
  }

  console.log(`Analyzing ${SITES_TO_ANALYZE.length} reference sites...\n`);

  const results = [];

  for (const site of SITES_TO_ANALYZE) {
    process.stdout.write(`→ ${site.id}: ${site.url} ... `);

    try {
      const screenshot = await screenshotPage(site.url);
      const analysis = await analyzeSite(site, screenshot);

      results.push({
        id: site.id,
        url: site.url,
        vertical: site.vertical,
        ...analysis,
      });

      console.log(`✓ (${analysis.mood}, ${analysis.colorScheme})`);
    } catch (err) {
      console.error(`✗ Failed: ${err.message}`);
      results.push({
        id: site.id,
        url: site.url,
        vertical: site.vertical,
        mood: "warm",
        colorScheme: "light",
        primaryColor: "#1565c0",
        accentColor: "#ff6f00",
        backgroundColor: "#ffffff",
        fontPersonality: "friendly",
        layoutVariant: 1,
        styleNotes: `ANALYZE MANUALLY — screenshot failed: ${err.message}`,
      });
    }

    // Respect rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Output as TypeScript-ready entries
  console.log("\n\n─── PASTE INTO reference-sites.ts ───\n");

  for (const r of results) {
    console.log(`  {
    id: "${r.id}",
    url: "${r.url}",
    vertical: "${r.vertical}",
    mood: "${r.mood}",
    colorScheme: "${r.colorScheme}",
    primaryColor: "${r.primaryColor}",
    accentColor: "${r.accentColor}",
    backgroundColor: "${r.backgroundColor}",
    fontPersonality: "${r.fontPersonality}",
    layoutVariant: ${r.layoutVariant},
    styleNotes: "${r.styleNotes.replace(/"/g, '\\"')}",
  },`);
  }
}

main();
