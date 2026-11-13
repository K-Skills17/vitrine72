import { ADDONS, ANCHOR_PACKAGE, CORE_OFFER, DOWNSELL, MAINTENANCE, RULES } from "@vitrine72/core";
import portfolio from "@/../../config/portfolio.json";

/**
 * Homepage copy and data. Every price, deadline and rule comes from
 * @vitrine72/core so the page can't drift from checkout.
 */

export const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

export const checkout = {
  core: `/api/checkout?sku=${CORE_OFFER.sku}`,
  anchor: `/api/checkout?sku=${ANCHOR_PACKAGE.sku}`,
  downsell: `/api/checkout?sku=${DOWNSELL.sku}`,
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || null;
export const whatsappUrl = (text: string) =>
  `https://wa.me/${whatsappNumber ?? ""}?text=${encodeURIComponent(text)}`;

export const nav = [
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Processo", href: "#processo" },
  { label: "Preço", href: "#preco" },
  { label: "Dúvidas", href: "#duvidas" },
];

export const hero = {
  kicker: `Prévia em ${CORE_OFFER.previewBusinessDays} dias úteis · No ar a partir do dia ${RULES.goLiveMinDays}`,
  title: "Sites que trazem clientes para negócios locais.",
  lead: `Site profissional de até ${CORE_OFFER.pages} páginas, feito para o celular, com WhatsApp e Google Meu Negócio. Você recebe a prévia em ${CORE_OFFER.previewBusinessDays} dias úteis e aprova antes de publicar.`,
  cta: "Quero meu site",
  price: `${brl(CORE_OFFER.pricePix)} no Pix`,
  priceNote: `ou ${brl(CORE_OFFER.priceCard)} em até ${CORE_OFFER.installmentsMax}x no cartão`,
  secondary: "Ver trabalhos",
};

interface ClientSite {
  slug: string;
  name: string;
  url: string;
  vertical: string;
  screenshotUrl: string;
  enabled: boolean;
}

const VERTICAL_LABELS: Record<string, string> = {
  estetica: "Estética",
  odontologia: "Odontologia",
  trancas: "Tranças e beleza afro",
  "loja-online": "Loja online",
  "fisioterapia-pilates": "Fitness e pilates",
};

/** Real client sites from config/portfolio.json (enabled only). */
export const clientSites = (portfolio.sites as ClientSite[])
  .filter((s) => s.enabled)
  .map((s) => ({
    name: s.name,
    url: s.url,
    domain: s.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    vertical: VERTICAL_LABELS[s.vertical] ?? s.vertical,
    screenshot: s.screenshotUrl.startsWith("PLACEHOLDER") ? null : s.screenshotUrl,
  }));

export const work = {
  kicker: "Trabalhos",
  title: "Veja o padrão antes de pagar.",
  lead: "Os sites abaixo são demonstrações completas, construídas com o mesmo processo e o mesmo padrão dos projetos de clientes.",
  featured: {
    name: "ÁUREA",
    type: "Clínica de estética",
    scope: "Projeto multipágina · sob consulta",
    body: "Páginas por tratamento, perguntas de qualificação antes do WhatsApp e atendimento com IA que aceita fotos. Um exemplo do que fazemos em projetos maiores.",
    desktop: "/work/aurea-desktop.webp",
    mobile: "/work/aurea-mobile.webp",
    cta: "Falar sobre um projeto assim",
  },
  items: [
    {
      name: "Clínica Aurora",
      type: "Estética",
      scope: `Pacote site até ${CORE_OFFER.pages} páginas`,
      url: "https://estetica.vitrini72.com.br",
      desktop: "/work/estetica-desktop.webp",
      mobile: "/work/estetica-mobile.webp",
    },
    {
      name: "Atelier Madeira",
      type: "Móveis planejados",
      scope: `Pacote site até ${CORE_OFFER.pages} páginas`,
      url: "https://planejados.vitrini72.com.br",
      desktop: "/work/planejados-desktop.webp",
      mobile: "/work/planejados-mobile.webp",
    },
  ],
  demoNote: "Demonstrações: nomes, números e depoimentos dos sites de exemplo são fictícios.",
  clientsTitle: "Clientes no ar",
};

export const timeline = {
  kicker: "Processo",
  title: "Do pagamento ao site no ar, com prazo em cada etapa.",
  steps: [
    { marker: "Hora 0", title: "Pagamento", body: "Pix ou cartão pelo link seguro. O formulário de briefing chega no seu e-mail em seguida." },
    { marker: "~15 min", title: "Briefing", body: "Você envia os dados do negócio, fotos e preferências. O prazo começa quando você termina o formulário." },
    { marker: `${CORE_OFFER.previewBusinessDays} dias úteis`, title: "Prévia", body: "Você recebe o site pronto para revisar, no celular e no computador." },
    { marker: `${RULES.revisionWindowHours} h`, title: "Revisão", body: `${RULES.maxRevisionRounds} rodada de ajustes incluída. Você pede, nós ajustamos.` },
    { marker: `Dia ${RULES.goLiveMinDays}+`, title: "No ar", body: `Depois da sua aprovação, publicamos no seu domínio, a partir do dia ${RULES.goLiveMinDays} após o pagamento.` },
  ],
};

export const included = {
  kicker: "Incluso",
  title: "Tudo o que um negócio local precisa para ser encontrado e chamado.",
  items: [
    { title: `Até ${CORE_OFFER.pages} páginas`, body: "Início, serviços, sobre, perguntas frequentes e contato." },
    { title: "Feito para o celular", body: "Pensado primeiro para a tela onde seus clientes procuram você." },
    { title: "Botão de WhatsApp", body: "Contato direto, sempre visível, sem formulário no meio." },
    { title: "Pronto para o Google", body: "Estrutura técnica, títulos e dados organizados para buscas locais." },
    { title: "Dados estruturados", body: "Informações do negócio em formato que Google e assistentes de IA conseguem ler." },
    { title: "Domínio no seu nome", body: "Registrado no seu CPF ou CNPJ. É seu, para sempre." },
  ],
};

export const pricing = {
  kicker: "Preço",
  title: "Preço fechado, sem mensalidade obrigatória.",
  plans: [
    {
      id: "core",
      name: CORE_OFFER.label,
      pix: CORE_OFFER.pricePix,
      card: CORE_OFFER.priceCard,
      installments: CORE_OFFER.installmentsMax,
      features: [`Até ${CORE_OFFER.pages} páginas`, "Feito para o celular e com WhatsApp", "Domínio no seu nome", `${RULES.maxRevisionRounds} rodada de revisão`],
      cta: "Quero só o site",
      href: checkout.core,
      highlight: false,
    },
    {
      id: "anchor",
      name: ANCHOR_PACKAGE.label,
      pix: ANCHOR_PACKAGE.pricePix,
      card: ANCHOR_PACKAGE.priceCard,
      installments: ANCHOR_PACKAGE.installmentsMax,
      features: [
        `Até ${CORE_OFFER.pages} páginas`,
        "Google Meu Negócio configurado",
        "Agente IA de agendamento",
        "Domínio no seu nome",
        `${RULES.maxRevisionRounds} rodada de revisão`,
      ],
      cta: "Quero o pacote completo",
      href: checkout.anchor,
      highlight: true,
    },
  ],
  extrasTitle: "Opcionais",
  extras: [
    { label: `${MAINTENANCE.label} (${MAINTENANCE.editsPerCycle} edições por ciclo)`, price: `${brl(MAINTENANCE.pricePerCycle)} / ${MAINTENANCE.cycleWeeks * 7} dias` },
    { label: ADDONS.GBP_SETUP.label, price: brl(ADDONS.GBP_SETUP.price) },
    { label: ADDONS.EXTRA_PAGES.label, price: brl(ADDONS.EXTRA_PAGES.price) },
    { label: ADDONS.CATALOG.label, price: brl(ADDONS.CATALOG.price) },
    { label: `${ADDONS.AI_AGENT_SETUP.label} (requer manutenção ativa)`, price: brl(ADDONS.AI_AGENT_SETUP.price) },
  ],
  downsell: { text: "Começando agora?", link: `${DOWNSELL.label} por ${brl(DOWNSELL.price)}`, href: checkout.downsell },
  cardNote: "Juros do parcelamento por conta do comprador.",
};

export const rules = {
  kicker: "Regras claras",
  title: "O que está combinado desde o primeiro dia.",
  items: [
    { figure: `${RULES.maxRevisionRounds}`, unit: "rodada", title: "de revisão incluída", body: `Você tem ${RULES.revisionWindowHours} h após a prévia para pedir ajustes.` },
    { figure: `${CORE_OFFER.previewBusinessDays}`, unit: "dias úteis", title: "contados do briefing", body: "O prazo começa quando você termina o formulário, não no pagamento." },
    { figure: `${RULES.goLiveMinDays}`, unit: "º dia", title: "mínimo para ir ao ar", body: "Publicação após a sua aprovação, a partir do dia 8 após o pagamento." },
    { figure: "100", unit: "%", title: "do domínio é seu", body: "Registrado no seu CPF ou CNPJ, mesmo se você cancelar qualquer plano." },
  ],
};

export const faq = {
  kicker: "Dúvidas",
  title: "Perguntas frequentes",
  items: [
    {
      q: `O prazo de ${CORE_OFFER.previewBusinessDays} dias úteis começa quando?`,
      a: "Quando você termina de preencher o formulário de briefing com todas as informações e fotos. Não começa no pagamento.",
    },
    {
      q: "Quando o site vai ao ar?",
      a: `Depois que você aprova a prévia, publicamos no seu domínio. A publicação acontece a partir do dia ${RULES.goLiveMinDays} após a confirmação do pagamento.`,
    },
    {
      q: "Quantas páginas vêm no site?",
      a: `Até ${CORE_OFFER.pages} páginas. Você pode adicionar um bloco de até ${ADDONS.EXTRA_PAGES.pagesPerBlock} páginas extras por ${brl(ADDONS.EXTRA_PAGES.price)}.`,
    },
    {
      q: "Posso escolher as cores e o estilo do site?",
      a: "Sim. No briefing você escolhe entre paletas e estilos pensados para o seu segmento, ou parte das cores da sua logo.",
    },
    {
      q: "Posso alterar o site depois que ele estiver no ar?",
      a: `Com o plano de manutenção (${brl(MAINTENANCE.pricePerCycle)} a cada ${MAINTENANCE.cycleWeeks * 7} dias), você tem ${MAINTENANCE.editsPerCycle} pequenas edições por ciclo. Alterações maiores têm valor separado.`,
    },
    { q: "Quem fica com o domínio?", a: "Você. O domínio é registrado no seu CPF ou CNPJ." },
    {
      q: "Posso pedir mais de uma rodada de revisão?",
      a: `Está incluída ${RULES.maxRevisionRounds} rodada por projeto. Rodadas adicionais são tratadas como edições avulsas, com valor separado.`,
    },
    {
      q: "Como funciona o pagamento?",
      a: `Pix ou cartão de crédito em até ${CORE_OFFER.installmentsMax}x. No Pix há desconto. Os juros do parcelamento são por conta do comprador.`,
    },
  ],
};

export const finalCta = {
  title: `Seu site no ar a partir do dia ${RULES.goLiveMinDays}.`,
  lead: `Prévia em ${CORE_OFFER.previewBusinessDays} dias úteis depois do briefing. Preço fechado.`,
  cta: `Começar por ${brl(CORE_OFFER.pricePix)} no Pix`,
  whatsapp: "Tirar dúvidas no WhatsApp",
  whatsappText: "Olá! Vim pelo site da Vitrini72 e tenho uma dúvida sobre o site para o meu negócio.",
};
