import type { VerticalConfig } from "../types.js";

// NEEDS #18: palettes and font pairs need operator approval
export const estetica: VerticalConfig = {
  id: "estetica",
  schemaOrgType: "HealthAndBeautyBusiness",
  pages: [
    { slug: "", title: "Início", template: "home" },
    { slug: "servicos", title: "Serviços", template: "services" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "faq", title: "Perguntas frequentes", template: "faq" },
    { slug: "contato", title: "Contato", template: "contact" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "playfair-lato",
      display: "Playfair Display",
      body: "Lato",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap",
    },
    {
      id: "cormorant-nunito",
      display: "Cormorant Garamond",
      body: "Nunito Sans",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Nunito+Sans:wght@300;400;600&display=swap",
    },
  ],
  palettes: [
    {
      id: "rose-gold",
      primary: "#c9a882",
      secondary: "#f7f0e8",
      accent: "#8b5e52",
      background: "#ffffff",
      text: "#2d2d2d",
    },
    {
      id: "sage-linen",
      primary: "#7a9e8e",
      secondary: "#f5f5f0",
      accent: "#c4956a",
      background: "#ffffff",
      text: "#2d2d2d",
    },
  ],
  signatureElement: "before-after-slider",
  signatureElementHidden: "Only shown when client supplies paired before/after photos",
  designPrinciples: [
    "Use generous whitespace — luxury feels uncrowded",
    "Photography is the hero: full-bleed images, no text over cluttered backgrounds",
    "Soft reveal animations (fade-up, 0.4s ease) reinforce calm and premium feel",
    "Rounded cards (border-radius: 16px+) and soft shadows — avoid sharp corners",
    "Before/after transformations are the #1 conversion driver — feature them prominently",
    "Color palette must feel spa-like: warm neutrals, rose golds, sage greens",
    "Typography: serif display headlines pair with light sans body for luxury contrast",
  ],
  conversionPatterns: [
    "WhatsApp CTA visible within 100px of page top on mobile — clients book via WhatsApp",
    "Price anchoring: show 'a partir de R$X' to pre-qualify and reduce low-intent contacts",
    "Social proof block: Google rating badge + 3 short real reviews above the fold",
    "Results gallery with real client names and transformation descriptions, not stock photos",
    "FAQ answers objections about pain, safety, and results — not generic questions",
    "Sticky WhatsApp button bottom-right on mobile, always visible",
  ],
  animationHints: [
    "Entrance: stagger fade-up (y: 20px → 0, opacity 0 → 1, 0.5s, each 0.1s apart)",
    "Before/after slider: CSS clip-path transition on drag, hardware-accelerated",
    "Image gallery: subtle zoom-in on hover (scale 1.03, overflow hidden)",
    "Section transitions: fade in on scroll-into-view using IntersectionObserver",
    "Avoid: flash effects, bouncing, or anything that feels clinical",
    "prefers-reduced-motion: disable all transforms, keep opacity fades only",
  ],
  mobilePatterns: [
    "Single-column layout, min tap target 48px for all CTAs",
    "Hero image stacked above text on mobile — not side by side",
    "WhatsApp button: fixed bottom bar on mobile, not floating circle",
    "Service cards: horizontal scroll carousel on mobile, grid on desktop",
    "Gallery: 2-column grid on mobile (not 3) with full-bleed on tap",
  ],
};
