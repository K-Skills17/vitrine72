import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyOpsToken, OPS_COOKIE } from "@/lib/ops-auth";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

function opsAuth(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  return verifyOpsToken(cookieStore.get(OPS_COOKIE)?.value);
}

// GET — list all reference sites
export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!opsAuth(cookieStore)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("reference_sites")
    .select("*")
    .order("vertical", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sites: data ?? [] });
}

// ─── Screenshot helper ────────────────────────────────────────────────────────

/**
 * Fetches a 1440px-wide screenshot via thum.io (free, no API key).
 * Returns base64 PNG or null if the fetch fails.
 */
async function fetchScreenshot(url: string): Promise<string | null> {
  try {
    const thumbUrl = `https://image.thum.io/get/width/1440/crop/900/noanimate/${encodeURIComponent(url)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const res = await fetch(thumbUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Vitrine72Bot/1.0)" },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch {
    return null;
  }
}

/** Extract URLs from a free-form text block */
function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s,\n"']+/gi;
  return [...new Set(text.match(urlRegex) ?? [])];
}

// ─── POST — analyze URLs + text, save ────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!opsAuth(cookieStore)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json() as { text: string; vertical: string };
  const { text, vertical } = body;

  if (!text?.trim() || !vertical?.trim()) {
    return NextResponse.json({ error: "text and vertical are required" }, { status: 400 });
  }

  const urls = extractUrls(text);
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // ── Analyze each URL individually with a screenshot ──────────────────────
  type Entry = {
    url: string;
    styleGroup: string;
    mood: string;
    colorScheme: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontPersonality: string;
    layoutVariant: number;
    styleNotes: string;
    screenshotUrl: string | null;
  };

  const entries: Entry[] = [];

  if (urls.length > 0) {
    // Process URLs with screenshots (up to 5 to stay within timeout)
    for (const url of urls.slice(0, 5)) {
      const screenshotBase64 = await fetchScreenshot(url);
      const screenshotUrl = screenshotBase64
        ? `https://image.thum.io/get/width/1440/crop/900/noanimate/${encodeURIComponent(url)}`
        : null;

      const userContext = text.replace(url, "").trim();

      const analysisPrompt = `Você é um analista de design web especializado em sites brasileiros de ${vertical}.

Analise este site (URL: ${url}) e gere uma entrada de referência de estilo.
${userContext ? `\nContexto adicional do usuário: ${userContext}` : ""}

styleGroup deve ser UM de: "dark-luxury" | "clean-clinical" | "conversion-driven" | "editorial-expert" | "vibrant-boutique"
mood: "luxurious" | "warm" | "minimal" | "bold" | "clinical" | "playful" | "natural" | "vibrant" | "classic" | "artisan"
colorScheme: "light" | "dark" | "colorful"
fontPersonality: "elegant" | "modern" | "friendly" | "bold" | "clean"
layoutVariant: 1 (hero→serviços→avaliações→sobre→faq→contato) | 2 (serviços em destaque acima do fold) | 3 (sobre/história como âncora central)

styleNotes deve ser um parágrafo detalhado (120-180 palavras) em PORTUGUÊS descrevendo:
(1) a linguagem de copywriting dos títulos — tom, estilo, exemplos de frases
(2) como os serviços são descritos — técnico, emocional, resultado
(3) o tom e as palavras exatas das CTAs
(4) elementos visuais marcantes — cores, espaçamento, tipografia, fotografia
(5) o que um modelo de linguagem DEVE imitar ao gerar um site neste estilo

Responda APENAS com JSON válido:
{
  "styleGroup": "...",
  "mood": "...",
  "colorScheme": "...",
  "primaryColor": "#rrggbb",
  "accentColor": "#rrggbb",
  "backgroundColor": "#rrggbb",
  "fontPersonality": "...",
  "layoutVariant": 1,
  "styleNotes": "..."
}`;

      let result: Entry;
      try {
        const messageContent: Anthropic.MessageParam["content"] = screenshotBase64
          ? [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: screenshotBase64 },
              },
              { type: "text", text: analysisPrompt },
            ]
          : analysisPrompt;

        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          messages: [{ role: "user", content: messageContent }],
        });

        const raw = response.content
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("");
        const cleaned = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
        const parsed = JSON.parse(cleaned);

        result = { url, screenshotUrl, ...parsed };
      } catch {
        // Fallback entry if analysis fails
        result = {
          url,
          screenshotUrl,
          styleGroup: "vibrant-boutique",
          mood: "warm",
          colorScheme: "light",
          primaryColor: "#1565c0",
          accentColor: "#ff6f00",
          backgroundColor: "#ffffff",
          fontPersonality: "friendly",
          layoutVariant: 1,
          styleNotes: `ANALISAR MANUALMENTE — falha ao processar ${url}. Screenshot: ${screenshotBase64 ? "obtido" : "indisponível"}.`,
        };
      }

      entries.push(result);
    }
  }

  // ── If no URLs found, analyze the raw text as a style description ─────────
  if (entries.length === 0 && text.trim()) {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Você é um analista de design web para sites brasileiros de ${vertical}.

O usuário descreveu um estilo de site sem fornecer uma URL. Gere uma entrada de referência baseada nesta descrição:

"${text}"

Responda APENAS com JSON válido (os mesmos campos de antes, use "https://sem-url.example.com" como url).
Inclua todos os campos: url, styleGroup, mood, colorScheme, primaryColor, accentColor, backgroundColor, fontPersonality, layoutVariant, styleNotes.`,
      }],
    });

    const raw = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const cleaned = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    try {
      entries.push({ ...JSON.parse(cleaned), screenshotUrl: null });
    } catch {
      return NextResponse.json({ error: "Claude returned invalid JSON" }, { status: 422 });
    }
  }

  // ── Save all entries to Supabase ──────────────────────────────────────────
  const prefix = vertical.slice(0, 3).toLowerCase().replace(/[^a-z]/g, "x");
  const rows = entries.map((e, i) => ({
    id: `${prefix}-db-${Date.now()}-${i}`,
    url: e.url ?? "https://unknown.example.com",
    vertical,
    style_group: e.styleGroup,
    mood: e.mood,
    color_scheme: e.colorScheme,
    primary_color: e.primaryColor,
    accent_color: e.accentColor,
    background_color: e.backgroundColor,
    font_personality: e.fontPersonality,
    layout_variant: e.layoutVariant,
    style_notes: e.styleNotes,
    screenshot_url: e.screenshotUrl,
  }));

  const supabase = createServiceClient();
  const { data: saved, error } = await supabase.from("reference_sites").insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    saved,
    meta: {
      urlsFound: urls.length,
      screenshotsObtained: entries.filter((e) => e.screenshotUrl).length,
    },
  });
}
