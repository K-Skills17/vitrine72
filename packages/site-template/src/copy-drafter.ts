/**
 * AI copy drafting using Anthropic API.
 * Falls back to template copy with visible placeholders if no key.
 */

import type { CopyBlocks, GeneratedSiteConfig, VerticalConfig } from "./types.js";

const BANNED_PHRASES: string[] = (() => {
  try {
    return (
      require("../../config/banned-phrases.json") as { phrases: string[] }
    ).phrases;
  } catch {
    return [];
  }
})();

const SYSTEM_PROMPT = `Você é um redator especialista em sites locais brasileiros. Suas regras:

1. Escreva apenas em pt-BR.
2. Use apenas fatos fornecidos no contexto (intake, pesquisa, avaliações). NUNCA invente números, clientes, anos ou resultados.
3. Use as frases reais dos clientes nas avaliações quando disponíveis.
4. Páginas de serviço: responda primeiro O QUÊ, para QUEM, ONDE, e PREÇO se fornecido.
5. NUNCA use estas frases banidas: ${BANNED_PHRASES.join(", ")}.
6. Sem superlativos sem prova (melhor, maior, mais, etc.).
7. Sem jargões corporativos.
8. Copy conciso e direto.`;

export async function draftCopy(
  config: GeneratedSiteConfig,
  vertical?: VerticalConfig
): Promise<CopyBlocks> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.startsWith("PLACEHOLDER")) {
    return generateFallbackCopy(config);
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    const contextSummary = buildContextSummary(config, vertical);

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Dados do negócio:\n${contextSummary}\n\nGere o JSON com os campos: heroHeadline, heroSubheadline, aboutText, serviceDescriptions (objeto com key=serviceName, value=descrição 2 parágrafos), faqAnswers (objeto com key=pergunta, value=resposta). Para cada bloco de texto, registre em sourceFacts quais dados foram usados.`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return generateFallbackCopy(config);

    const parsed = JSON.parse(jsonMatch[0]) as Partial<CopyBlocks>;

    // Validate: check for banned phrases
    const allText = JSON.stringify(parsed).toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (allText.includes(phrase.toLowerCase())) {
        console.warn(`Banned phrase detected: "${phrase}". Falling back.`);
        return generateFallbackCopy(config);
      }
    }

    return {
      heroHeadline: parsed.heroHeadline ?? `__PLACEHOLDER_HERO_HEADLINE__`,
      heroSubheadline: parsed.heroSubheadline ?? `__PLACEHOLDER_HERO_SUB__`,
      aboutText: parsed.aboutText ?? `__PLACEHOLDER_ABOUT__`,
      serviceDescriptions: parsed.serviceDescriptions ?? {},
      faqAnswers: parsed.faqAnswers ?? {},
      sourceFacts: parsed.sourceFacts ?? {},
    };
  } catch (err) {
    console.error("Anthropic API error:", err);
    return generateFallbackCopy(config);
  }
}

function buildContextSummary(config: GeneratedSiteConfig, vertical?: VerticalConfig): string {
  const lines = [
    `Negócio: ${config.businessName}`,
    `Endereço: ${config.address}`,
    `Bairros: ${config.neighborhoods.join(", ")}`,
    `Horários: ${config.hours}`,
    `Serviços: ${config.services.map((s) => `${s.name}${s.price ? ` (${s.price})` : ""}`).join(", ")}`,
    `Ação principal: ${config.primaryAction}`,
  ];

  if (vertical?.designPrinciples?.length) {
    lines.push(`\nPrincípios de design para este nicho (aplicar na copy):\n${vertical.designPrinciples.map((p) => `- ${p}`).join("\n")}`);
  }
  if (vertical?.conversionPatterns?.length) {
    lines.push(`\nPadrões de conversão do nicho (referência para CTAs e estrutura):\n${vertical.conversionPatterns.map((p) => `- ${p}`).join("\n")}`);
  }

  if (config.gbpData) {
    lines.push(
      `Google: ${config.gbpData.rating} estrelas, ${config.gbpData.reviewCount} avaliações`
    );
    if (config.gbpData.customerPhrases.length > 0) {
      lines.push(
        `Frases dos clientes: ${config.gbpData.customerPhrases.slice(0, 5).join(", ")}`
      );
    }
    if (config.gbpData.reviews.length > 0) {
      lines.push(
        `Avaliações recentes: ${config.gbpData.reviews
          .slice(0, 3)
          .map((r) => `"${r.text.slice(0, 100)}"`)
          .join("; ")}`
      );
    }
  }

  return lines.join("\n");
}

function generateFallbackCopy(config: GeneratedSiteConfig): CopyBlocks {
  return {
    heroHeadline: `__PLACEHOLDER_HERO_HEADLINE__ — ${config.businessName}`,
    heroSubheadline: `__PLACEHOLDER_HERO_SUBHEADLINE__`,
    aboutText: `__PLACEHOLDER_ABOUT_TEXT__`,
    serviceDescriptions: Object.fromEntries(
      config.services.map((s) => [
        s.name,
        `__PLACEHOLDER_SERVICE_DESC_${s.name.toUpperCase().replace(/\s+/g, "_")}__`,
      ])
    ),
    faqAnswers: Object.fromEntries(
      config.faqs.map((f) => [f.q, `__PLACEHOLDER_FAQ_ANSWER__`])
    ),
    sourceFacts: {},
  };
}
