import type { VerticalConfig } from "../types.js";

export const moveisPlaynados: VerticalConfig = {
  id: "moveis-planejados",
  schemaOrgType: "FurnitureStore",
  pages: [
    { slug: "", title: "Início", template: "home" },
    { slug: "servicos", title: "Serviços", template: "services" },
    { slug: "projetos", title: "Projetos", template: "gallery" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "contato", title: "Contato", template: "contact" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "montserrat-open-sans",
      display: "Montserrat",
      body: "Open Sans",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@300;400;600&display=swap",
    },
    {
      id: "raleway-source-sans",
      display: "Raleway",
      body: "Source Sans 3",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap",
    },
  ],
  palettes: [
    {
      id: "walnut-cream",
      primary: "#7b5e45",
      secondary: "#f9f5f0",
      accent: "#c4a882",
      background: "#ffffff",
      text: "#222222",
    },
    {
      id: "slate-ivory",
      primary: "#3d5a6c",
      secondary: "#f8f9fa",
      accent: "#d4a853",
      background: "#ffffff",
      text: "#222222",
    },
  ],
  signatureElement: "project-gallery",
  designPrinciples: [
    "Portfolio gallery IS the product — images must be large, high-res, full-bleed",
    "Warm, tactile palette: wood tones, cream, off-white — never cold corporate grays",
    "Whitespace signals premium: resist filling every pixel",
    "Project cards: environment (kitchen/bedroom/office) + dimensions + timeline",
    "Typography: geometric sans (Montserrat, Raleway) for headlines — clean, architectural",
    "Material callouts: show wood species, hardware finish, glass type — buyers research this",
    "Studio address and showroom CTA — physical visit is part of the sales funnel",
  ],
  conversionPatterns: [
    "Gallery filtered by environment (cozinha, quarto, sala, escritório) reduces scroll fatigue",
    "Each project: m² price range + timeline + 'Ver projeto completo' — sets expectations",
    "3D render offer: 'Receba o projeto do seu espaço em 48h' drives WhatsApp contacts",
    "Social proof: Instagram feed embed or real testimonials with photos of the space",
    "Price anchor: 'Projetos a partir de R$X mil' — pre-qualifies high-intent leads",
    "Showroom visit CTA: 'Visite nosso showroom' + address + maps link",
    "Guarantee: delivery timeline guarantee with compensation clause = trust builder",
  ],
  animationHints: [
    "Gallery entrance: stagger fade-in with subtle scale (0.97 → 1.0) per card",
    "Image hover: zoom-in 1.05 scale with overlay showing project details",
    "Filter tabs: smooth height transition when gallery items filter",
    "Scroll parallax: hero background image at 0.5x scroll speed (CSS only, subtle)",
    "Before/after room transformation: horizontal slide reveal",
    "prefers-reduced-motion: static gallery, no parallax, no hover zoom",
  ],
  mobilePatterns: [
    "Gallery: 1-column on mobile (full-width), 2-column on tablet, 3 on desktop",
    "Project detail: swipeable photo carousel — critical for mobile browsing",
    "Filter tabs: horizontal scroll row of chips, not dropdown",
    "WhatsApp CTA: 'Solicitar orçamento via WhatsApp' — full width sticky button",
    "Showroom address: tap-to-maps link — physical location is a conversion point",
  ],
};
