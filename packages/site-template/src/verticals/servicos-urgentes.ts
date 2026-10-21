import type { VerticalConfig } from "../types.js";

export const servicosUrgentes: VerticalConfig = {
  id: "servicos-urgentes",
  schemaOrgType: "LocalBusiness",
  pages: [
    { slug: "", title: "Início", template: "home-urgent" },
    { slug: "servicos", title: "Serviços", template: "services" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "faq", title: "Dúvidas frequentes", template: "faq" },
    { slug: "contato", title: "Contato", template: "contact" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "roboto-roboto",
      display: "Roboto",
      body: "Roboto",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
    },
    {
      id: "oswald-roboto",
      display: "Oswald",
      body: "Roboto",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Roboto:wght@300;400;500&display=swap",
    },
  ],
  palettes: [
    {
      id: "urgent-red",
      primary: "#c62828",
      secondary: "#fff3e0",
      accent: "#ff6f00",
      background: "#ffffff",
      text: "#1a1a1a",
    },
    {
      id: "trustworthy-blue",
      primary: "#1565c0",
      secondary: "#e8f4fd",
      accent: "#ff6f00",
      background: "#ffffff",
      text: "#1a1a1a",
    },
  ],
  signatureElement: "sticky-call-bar",
  designPrinciples: [
    "Speed is the message — the design must communicate urgency without chaos",
    "Phone number and WhatsApp must be the LARGEST text element on mobile",
    "High-contrast CTA buttons (red/orange on white) — no pastel or subtle colors",
    "Trust signals dominate: CREA/license number, years active, service area map",
    "No hero videos or heavy animations — load speed is conversion speed",
    "Bold sans-serif fonts only (Roboto, Oswald) — this is not a luxury niche",
    "Above the fold: service name, phone number, 'Atendimento 24h' — nothing else",
  ],
  conversionPatterns: [
    "Sticky call/WhatsApp bar pinned to bottom of screen — never hidden on scroll",
    "Response time promise ('em até 30 min') near the CTA increases conversion 40%+",
    "Price range visible ('a partir de R$150') — reduces abandoned contacts",
    "Service area explicit: list neighborhoods/cidades served to avoid wasted calls",
    "Emergency badge: '24h / 7 dias' badge on hero — primary search intent is urgency",
    "Real photos of work done (leaking pipe fixed, electrical panel) > stock photos",
    "Short FAQ: 'Cobram visita?' 'Emitem nota?' 'Aceitam cartão?' — address real barriers",
  ],
  animationHints: [
    "No entrance animations — page must feel instant (performance > aesthetics here)",
    "Pulse animation only on the main call CTA (subtle ring pulse, 2s loop)",
    "Sticky bar: slide-up animation on first appearance (0.2s ease-out)",
    "Avoid all scroll-triggered animations — users in emergencies scroll fast",
    "prefers-reduced-motion: no exceptions needed — animations are already minimal",
  ],
  mobilePatterns: [
    "Dial link (tel:) must be the primary tap action — 60%+ of conversions are calls",
    "Click-to-call button: full width, min 56px height, always visible",
    "Service list: single column with icon + name + 'Solicitar' button per row",
    "Address/coverage map: simple static map or text list — no interactive map",
    "No horizontal scroll, no carousels — linear scroll only",
  ],
};
