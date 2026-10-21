import type { VerticalConfig } from "../types.js";

export const buffetEventos: VerticalConfig = {
  id: "buffet-eventos",
  schemaOrgType: "EventVenue",
  pages: [
    { slug: "", title: "Início", template: "home" },
    { slug: "cardapio", title: "Cardápio", template: "menu" },
    { slug: "galeria", title: "Galeria", template: "gallery" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "orcamento", title: "Pedir orçamento", template: "inquiry" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "playfair-raleway",
      display: "Playfair Display",
      body: "Raleway",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Raleway:wght@300;400;600&display=swap",
    },
    {
      id: "gfs-didot-lato",
      display: "GFS Didot",
      body: "Lato",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=GFS+Didot&family=Lato:wght@300;400;700&display=swap",
    },
  ],
  palettes: [
    {
      id: "gold-navy",
      primary: "#1a237e",
      secondary: "#fdf6e3",
      accent: "#c9a228",
      background: "#ffffff",
      text: "#212121",
    },
    {
      id: "champagne-rose",
      primary: "#8d6e63",
      secondary: "#fce4ec",
      accent: "#c9a228",
      background: "#ffffff",
      text: "#212121",
    },
  ],
  signatureElement: "gallery-inquiry",
  designPrinciples: [
    "Visual impact first: full-bleed hero with real event photography — never stock",
    "Emotion > information: the design should make visitors imagine their event happening here",
    "Luxury tone: gold accents, serif headlines, generous whitespace, dark overlays on images",
    "Gallery is the product: real events, real food, real décor — quantity and quality matter",
    "Pricing transparency: 'pacotes a partir de R$X por pessoa' reduces low-intent inquiries",
    "Capacity and event types clear: 50 to 500 people, casamentos, formaturas, corporativo",
    "Typography: Playfair Display for elegance — this is an emotional, high-ticket purchase",
  ],
  conversionPatterns: [
    "Inquiry form: event type, date, guest count, name, phone — just 5 fields for a quote",
    "Gallery filtered by event type (casamento, formatura, corporativo, social)",
    "Testimonials with event type, guest count, and date — specificity builds credibility",
    "Menu highlights: hero dishes with photography, not just a text list",
    "Packages pricing table: bronze/prata/ouro or equivalent — anchor the premium",
    "Availability calendar or 'datas disponíveis' CTA reduces friction",
    "Video of past event (30s) on gallery page is the single highest-converting element",
  ],
  animationHints: [
    "Hero: Ken Burns effect on image (subtle zoom 1.0 → 1.05 over 8s) — cinematic feel",
    "Gallery entrance: stagger fade-in (0.6s, 0.08s between items) — feels curated",
    "Image hover: dark overlay with event details slides up from bottom",
    "Testimonial carousel: smooth horizontal slide with fade crossfade",
    "Menu section: items fade in as you scroll the page",
    "Avoid: fast, techy, or geometric animations — this is emotional and warm",
    "prefers-reduced-motion: static Ken Burns (no zoom), immediate gallery display",
  ],
  mobilePatterns: [
    "Gallery: masonry or 2-column grid, full-bleed images — critical for visual selling",
    "Inquiry form: sticky 'Solicitar orçamento' floating button opens modal form",
    "Event type selector: large tappable chips (casamento, formatura, corporativo)",
    "Hero: portrait-oriented crop for event photo on mobile — avoid landscape with tiny subjects",
    "Menu: swipeable category tabs + card list, not dropdown",
  ],
};
