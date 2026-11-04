import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyOpsToken, OPS_COOKIE } from "@/lib/ops-auth";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

function opsAuth(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  const token = cookieStore.get(OPS_COOKIE)?.value;
  return verifyOpsToken(token);
}

// GET — list all reference sites
export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!opsAuth(cookieStore)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("reference_sites")
    .select("*")
    .order("vertical", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sites: data ?? [] });
}

// POST — analyze free-form text + URLs, extract entries, save
export async function POST(req: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!opsAuth(cookieStore)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { text: string; vertical: string };
  const { text, vertical } = body;

  if (!text?.trim() || !vertical?.trim()) {
    return NextResponse.json({ error: "text and vertical are required" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a web design analyst for a Brazilian service site builder. Analyze the URLs and descriptions in the text below and generate reference site entries.

VERTICAL: ${vertical}

USER INPUT:
${text}

For each distinct URL or described site in the input, generate one entry. Use your knowledge of the websites, plus any context the user provided.

styleGroup must be one of: "dark-luxury" | "clean-clinical" | "conversion-driven" | "editorial-expert" | "vibrant-boutique"
mood: "luxurious" | "warm" | "minimal" | "bold" | "clinical" | "playful" | "natural" | "vibrant" | "classic" | "artisan"
colorScheme: "light" | "dark" | "colorful"
fontPersonality: "elegant" | "modern" | "friendly" | "bold" | "clean"
layoutVariant: 1 (hero→services→reviews→about→faq→contact) | 2 (services-first grid) | 3 (story/about-first)

styleNotes must be a detailed paragraph (100-150 words) in PORTUGUESE describing:
(1) the copywriting language used in headlines and body text
(2) how services are described (technical, emotional, results-focused?)
(3) CTA tone and phrasing examples
(4) notable visual/aesthetic elements
(5) what a language model should imitate when generating a site in this style

Respond ONLY with a valid JSON array, no markdown:
[
  {
    "url": "https://...",
    "styleGroup": "...",
    "mood": "...",
    "colorScheme": "...",
    "primaryColor": "#rrggbb",
    "accentColor": "#rrggbb",
    "backgroundColor": "#rrggbb",
    "fontPersonality": "...",
    "layoutVariant": 1,
    "styleNotes": "..."
  }
]`;

  let entries: Array<{
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
  }>;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const cleaned = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    entries = JSON.parse(cleaned);

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: "Claude returned no entries" }, { status: 422 });
    }
  } catch (err) {
    return NextResponse.json({ error: `Analysis failed: ${String(err)}` }, { status: 500 });
  }

  // Build rows with generated IDs
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
  }));

  const supabase = createServiceClient();
  const { data: saved, error } = await supabase
    .from("reference_sites")
    .insert(rows)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved });
}
