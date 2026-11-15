import Anthropic from "@anthropic-ai/sdk";
import type { IntakeData, Research } from "./supabase.js";
import type { ReferenceSite } from "./reference-sites.js";
import { FONT_PAIRS, PALETTES, resolveFontPair, resolvePalette, type FontPair, type Palette } from "./design-presets.js";
import { isRegulatedVertical, loadBannedPhrases } from "./qa.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Visual profiles per style group ─────────────────────────────────────────
// These drive actual structural/component differences — not just copy tone.

const STYLE_GROUP_PROFILES: Record<string, {
  heroStyle: string;
  cardStyle: string;
  aboutStyle: string;
}> = {
  "dark-luxury":       { heroStyle: "minimal-dark",          cardStyle: "card-dark",     aboutStyle: "about-centered" },
  "clean-clinical":    { heroStyle: "split-text-left",       cardStyle: "card-bordered", aboutStyle: "about-split" },
  "conversion-driven": { heroStyle: "fullscreen-photo",      cardStyle: "card-shadow",   aboutStyle: "about-credentials" },
  "editorial-expert":  { heroStyle: "editorial-asymmetric",  cardStyle: "card-minimal",  aboutStyle: "about-credentials" },
  "vibrant-boutique":  { heroStyle: "split-text-left",       cardStyle: "card-bordered", aboutStyle: "about-split" },
};

const DEFAULT_PROFILE = { heroStyle: "fullscreen-photo", cardStyle: "card-shadow", aboutStyle: "about-split" };

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
  palette: Palette;
  fontPair: FontPair;
  layoutVariant: number;
  heroStyle: string;
  cardStyle: string;
  aboutStyle: string;
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

  // Councils for regulated professions restrict testimonials and ratings in
  // advertising, so reviews are off for those verticals unless the client
  // explicitly confirms they may show them (intake.show_reviews).
  const showReviews = !isRegulatedVertical(vertical) || intake.show_reviews === true;
  const gbpData = research && showReviews ? {
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
Responda APENAS com um objeto JSON válido, sem markdown, sem explicações.

Regras de texto:
- Português brasileiro natural, frases curtas, substantivos concretos, sem superlativos.
- Use apenas fatos fornecidos. Nunca invente números, anos de experiência, prêmios, registros profissionais, depoimentos ou avaliações.
- Nunca use estas expressões: ${loadBannedPhrases().join("; ")}.${isRegulatedVertical(vertical) ? `
- Este é um setor regulado por conselho profissional: não prometa resultados, não use "garantido", "100%", "sem dor", "sem risco", "antes e depois" ou "resultado definitivo". Indicações são sempre definidas em avaliação.` : ""}`,
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

  // Unknown or retired ids resolve to the closest checked preset
  const palette = resolvePalette(generated.paletteId);
  const fontPair = resolveFontPair(generated.fontPairId);

  // Visual profile from style group — drives component structure, not just colors
  const visualProfile = STYLE_GROUP_PROFILES[referenceSite.styleGroup] ?? DEFAULT_PROFILE;

  // Build primaryAction URL
  const primaryAction = intake.primary_action ?? "whatsapp";
  const cleanPhone = phone.replace(/\D/g, "");
  const intlPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  const primaryActionUrl = primaryAction === "whatsapp"
    ? `https://wa.me/${intlPhone}?text=${encodeURIComponent(`Olá! Vi o site da ${businessName} e gostaria de mais informações.`)}`
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
    heroStyle: visualProfile.heroStyle,
    cardStyle: visualProfile.cardStyle,
    aboutStyle: visualProfile.aboutStyle,
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
