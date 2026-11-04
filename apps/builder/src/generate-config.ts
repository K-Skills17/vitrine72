import Anthropic from "@anthropic-ai/sdk";
import type { IntakeData, Research } from "./supabase.js";
import type { ReferenceSite } from "./reference-sites.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Palettes ─────────────────────────────────────────────────────────────────

const PALETTES: Record<string, SiteConfig["palette"]> = {
  "dark-elegance":   { id: "dark-elegance",   primary: "#c5a368", secondary: "#1e1e1e", accent: "#c5a368", background: "#111111", text: "#ffffff" },
  "rose-gold":       { id: "rose-gold",        primary: "#b76e79", secondary: "#fff5f5", accent: "#8b5e3c", background: "#ffffff", text: "#1a1a1a" },
  "deep-plum":       { id: "deep-plum",        primary: "#5b2d6a", secondary: "#f8f4ff", accent: "#c5a368", background: "#ffffff", text: "#1a1a1a" },
  "sage-green":      { id: "sage-green",       primary: "#2d6a4f", secondary: "#f4f9f4", accent: "#d4a853", background: "#ffffff", text: "#1a1a1a" },
  "midnight-teal":   { id: "midnight-teal",    primary: "#0d5c63", secondary: "#f0f8f8", accent: "#f4a261", background: "#ffffff", text: "#1a1a1a" },
  "clean-blue":      { id: "clean-blue",       primary: "#1565c0", secondary: "#f5f8ff", accent: "#ff6f00", background: "#ffffff", text: "#1a1a1a" },
  "warm-terracotta": { id: "warm-terracotta",  primary: "#c0522c", secondary: "#fff5ef", accent: "#2d6a4f", background: "#ffffff", text: "#1a1a1a" },
  "coral-energy":    { id: "coral-energy",     primary: "#ff6b35", secondary: "#fff4ee", accent: "#2d4a6e", background: "#ffffff", text: "#1a1a1a" },
  "dark-teal":       { id: "dark-teal",        primary: "#7fffd4", secondary: "#0d1f1f", accent: "#7fffd4", background: "#0a1a1a", text: "#ffffff" },
  "dark-plum":       { id: "dark-plum",        primary: "#c77dff", secondary: "#1a0a2e", accent: "#ff6b9d", background: "#1a0a2e", text: "#ffffff" },
  "classic-gold":    { id: "classic-gold",     primary: "#8b6914", secondary: "#fffdf5", accent: "#d4af37", background: "#fdfcfb", text: "#1a1a1a" },
};

// ─── Font pairs ───────────────────────────────────────────────────────────────

const FONT_PAIRS: Record<string, SiteConfig["fontPair"]> = {
  "playfair-lato":       { id: "playfair-lato",       display: "Playfair Display", body: "Lato",      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" },
  "cormorant-raleway":   { id: "cormorant-raleway",   display: "Cormorant Garamond", body: "Raleway", googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Raleway:wght@300;400;600;700&display=swap" },
  "montserrat-opensans": { id: "montserrat-opensans", display: "Montserrat",      body: "Open Sans",  googleFontsUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@300;400;600&display=swap" },
  "inter-inter":         { id: "inter-inter",         display: "Inter",            body: "Inter",      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" },
  "dm-serif-dm-sans":    { id: "dm-serif-dm-sans",    display: "DM Serif Display", body: "DM Sans",   googleFontsUrl: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" },
  "josefin-lato":        { id: "josefin-lato",        display: "Josefin Sans",     body: "Lato",      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap" },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type SiteConfig = {
  projectId: string;
  slug: string;
  vertical: string;
  businessName: string;
  address: string;
  phone: string;
  hours: string;
  hoursArray: string[];
  neighborhoods: string[];
  services: Array<{ name: string; description: string; price: string | null }>;
  faqs: Array<{ q: string; a: string }>;
  gbpLink: string | null;
  instagramLink: string | null;
  primaryAction: string;
  primaryActionUrl: string;
  palette: {
    id: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fontPair: {
    id: string;
    display: string;
    body: string;
    googleFontsUrl: string;
  };
  layoutVariant: number;
  photos: string[];
  logoPath: string | null;
  gbpData: {
    placeId: string;
    rating: number;
    reviewCount: number;
    reviews: Array<{ author: string; rating: number; text: string; date: string }>;
    competitors: Array<{ name: string; rating: number; reviewCount: number; hasWebsite: boolean }>;
    customerPhrases: string[];
  } | null;
  copyBlocks: {
    heroHeadline: string;
    heroSubheadline: string;
    aboutText: string;
    serviceDescriptions: Record<string, string>;
    faqAnswers: Record<string, string>;
    sourceFacts: Record<string, unknown>;
  };
  selfEditSheetUrl: null;
  updatedAt: string;
  animationProfile: string;
  signatureElementEnabled: boolean;
  jsonLd: Record<string, unknown>;
};

type ClaudeOutput = {
  paletteId: string;
  fontPairId: string;
  animationProfile: "minimal" | "standard" | "rich";
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  serviceDescriptions: Record<string, string>;
  faqAnswers: Record<string, string>;
};

// ─── Main function ─────────────────────────────────────────────────────────────

export async function generateSiteConfig(params: {
  projectId: string;
  intake: IntakeData;
  research: Research | null;
  photos: string[];
  logoPath: string | null;
  referenceSite: ReferenceSite;
}): Promise<SiteConfig> {
  const { projectId, intake, research, photos, logoPath, referenceSite } = params;

  const businessName = intake.business_name || intake.name || "Negócio";
  const phone = intake.whatsapp || intake.phone || "";
  const vertical = intake.vertical || referenceSite.vertical || "generico";
  const services = intake.services ?? [];
  const faqs = intake.faqs ?? [];
  const neighborhoods = intake.neighborhoods ?? [];

  const gbpData = research ? {
    placeId: research.gbp_place_id ?? "",
    rating: research.rating ?? 0,
    reviewCount: research.review_count ?? 0,
    reviews: (research.reviews ?? []).slice(0, 5) as Array<{ author: string; rating: number; text: string; date: string }>,
    competitors: (research.competitors ?? []) as Array<{ name: string; rating: number; reviewCount: number; hasWebsite: boolean }>,
    customerPhrases: research.customer_phrases ?? [],
  } : null;

  // Build the prompt
  const prompt = buildPrompt({ intake, research, referenceSite, services, faqs, neighborhoods, businessName });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: `Você é um especialista em copywriting para pequenos negócios locais brasileiros.
Você gera conteúdo para sites de empresas do setor de ${vertical} em São Paulo.
Responda APENAS com um objeto JSON válido, sem markdown, sem explicações.`,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  let generated: ClaudeOutput;
  try {
    // Strip markdown code fences if present
    const cleaned = rawText.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
    generated = JSON.parse(cleaned) as ClaudeOutput;
  } catch {
    throw new Error(`Claude returned invalid JSON: ${rawText.slice(0, 200)}`);
  }

  // Validate and fallback palette/font
  const palette = PALETTES[generated.paletteId] ?? PALETTES["rose-gold"]!;
  const fontPair = FONT_PAIRS[generated.fontPairId] ?? FONT_PAIRS["playfair-lato"]!;

  // Build primaryAction URL
  const primaryAction = intake.primary_action ?? "whatsapp";
  const cleanPhone = phone.replace(/\D/g, "");
  const intlPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  const primaryActionUrl = primaryAction === "whatsapp"
    ? `https://wa.me/${intlPhone}?text=${encodeURIComponent("Olá, vi seu site e gostaria de mais informações.")}`
    : `tel:+${intlPhone}`;

  // Slug from business name
  const slug = businessName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const config: SiteConfig = {
    projectId,
    slug,
    vertical,
    businessName,
    address: intake.address ?? "",
    phone,
    hours: intake.hours ?? "",
    hoursArray: intake.hours_array ?? (intake.hours ? [intake.hours] : []),
    neighborhoods,
    services: services.map((s) => ({
      name: s.name,
      description: generated.serviceDescriptions[s.name] ?? s.description ?? "",
      price: s.price ?? null,
    })),
    faqs: faqs.map((f) => ({
      q: f.q,
      a: generated.faqAnswers[f.q] ?? f.a ?? "",
    })),
    gbpLink: intake.gbp_link ?? null,
    instagramLink: intake.instagram_link ?? null,
    primaryAction,
    primaryActionUrl,
    palette,
    fontPair,
    layoutVariant: referenceSite.layoutVariant,
    photos,
    logoPath,
    gbpData,
    copyBlocks: {
      heroHeadline: generated.heroHeadline,
      heroSubheadline: generated.heroSubheadline,
      aboutText: generated.aboutText,
      serviceDescriptions: generated.serviceDescriptions,
      faqAnswers: generated.faqAnswers,
      sourceFacts: {},
    },
    selfEditSheetUrl: null,
    updatedAt: new Date().toISOString().slice(0, 10),
    animationProfile: generated.animationProfile ?? "standard",
    signatureElementEnabled: false,
    jsonLd: {},
  };

  return config;
}

function buildPrompt(params: {
  intake: IntakeData;
  research: Research | null;
  referenceSite: ReferenceSite;
  services: Array<{ name: string; description?: string; price?: string }>;
  faqs: Array<{ q: string; a: string }>;
  neighborhoods: string[];
  businessName: string;
}): string {
  const { intake, research, referenceSite, services, faqs, neighborhoods, businessName } = params;

  const availablePalettes = Object.keys(PALETTES).join(", ");
  const availableFonts = Object.keys(FONT_PAIRS).join(", ");

  const reviewSummary = research?.reviews?.slice(0, 3)
    .map((r) => `- "${r.text}" (${r.author}, ${r.rating}★)`)
    .join("\n") ?? "Nenhuma avaliação disponível.";

  const customerPhrases = research?.customer_phrases?.slice(0, 5).join(", ") ?? "";

  return `Gere o conteúdo para o site de "${businessName}", um negócio de ${intake.vertical ?? "serviços"} em ${intake.city ?? "São Paulo"}.

DADOS DO NEGÓCIO:
- Nome: ${businessName}
- Endereço: ${intake.address ?? "não informado"}
- Bairros atendidos: ${neighborhoods.join(", ") || "não informados"}
- Telefone/WhatsApp: ${intake.whatsapp ?? intake.phone ?? "não informado"}
- Horários: ${intake.hours ?? "não informados"}

SERVIÇOS (${services.length}):
${services.map((s) => `- ${s.name}${s.price ? ` (${s.price})` : ""}`).join("\n") || "não informados"}

PERGUNTAS FREQUENTES:
${faqs.map((f) => `- ${f.q}`).join("\n") || "não informadas"}

AVALIAÇÕES GOOGLE:
${reviewSummary}
${customerPhrases ? `Palavras que clientes usam: ${customerPhrases}` : ""}

REFERÊNCIA ESTÉTICA (use para definir o tom e estilo):
- Mood: ${referenceSite.mood}
- Esquema de cores: ${referenceSite.colorScheme}
- Personalidade tipográfica: ${referenceSite.fontPersonality}
- Notas de estilo: ${referenceSite.styleNotes}

PALETAS DISPONÍVEIS: ${availablePalettes}
FONTES DISPONÍVEIS: ${availableFonts}

Retorne EXATAMENTE este JSON (sem markdown):
{
  "paletteId": "<uma das paletas disponíveis que combine com o mood da referência>",
  "fontPairId": "<um dos pares de fontes disponíveis que combine com a personalidade tipográfica>",
  "animationProfile": "<minimal|standard|rich — rich para negócios vibrantes, minimal para clínicos>",
  "heroHeadline": "<manchete principal — máximo 8 palavras, impactante, reflete o mood da referência>",
  "heroSubheadline": "<subtítulo — 1-2 frases, menciona cidade/bairro, proposta de valor>",
  "aboutText": "<3-4 frases sobre o negócio — tom conforme a referência, menciona especialidade e bairro>",
  "serviceDescriptions": {
    ${services.map((s) => `"${s.name}": "<1-2 frases descrevendo este serviço — tom da referência>"`).join(",\n    ")}
  },
  "faqAnswers": {
    ${faqs.map((f) => `"${f.q}": "<resposta completa e útil>"`).join(",\n    ")}
  }
}`;
}
