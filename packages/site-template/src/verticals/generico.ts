import type { VerticalConfig } from "../types.js";

export const generico: VerticalConfig = {
  id: "generico",
  schemaOrgType: "LocalBusiness",
  pages: [
    { slug: "", title: "Início", template: "home" },
    { slug: "servicos", title: "Serviços", template: "services" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "faq", title: "Perguntas", template: "faq" },
    { slug: "contato", title: "Contato", template: "contact" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "inter-inter",
      display: "Inter",
      body: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap",
    },
    {
      id: "plus-jakarta-inter",
      display: "Plus Jakarta Sans",
      body: "Inter",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@300;400;600&display=swap",
    },
  ],
  palettes: [
    {
      id: "clean-blue",
      primary: "#1565c0",
      secondary: "#f5f8ff",
      accent: "#ff6f00",
      background: "#ffffff",
      text: "#1a1a1a",
    },
    {
      id: "clean-green",
      primary: "#2e7d32",
      secondary: "#f5f8f5",
      accent: "#ff6f00",
      background: "#ffffff",
      text: "#1a1a1a",
    },
  ],
  signatureElement: null,
  designPrinciples: [
    "Clear value proposition in the hero — what you do, for whom, and where, in one sentence",
    "Clean, trustworthy aesthetic: white background, strong primary color, clear hierarchy",
    "Services section must answer: what is included, what it costs, how to get started",
    "Social proof visible within first scroll: Google rating or real testimonial",
    "Contact friction must be near zero: one tap to WhatsApp on mobile",
    "Typography: modern neutral sans (Inter, Plus Jakarta) — professional and readable",
    "No generic business photography — real photos of the team, work, or location only",
  ],
  conversionPatterns: [
    "Hero CTA: specific action verb ('Solicitar orçamento', 'Agendar visita') — not 'Saiba mais'",
    "Service pricing or 'a partir de' anchor — price transparency improves lead quality",
    "Google rating badge with review count near the top — trust before scroll",
    "FAQ answers the 3 most common sales objections for the category",
    "Local signals: neighborhood + city in hero or subheadline for local SEO",
    "WhatsApp lead: pre-filled message 'Olá, vi seu site e gostaria de...' reduces friction",
  ],
  animationHints: [
    "Standard entrance: fade-up (y: 24px → 0, opacity 0 → 1, 0.45s ease-out)",
    "Stagger delay: 0.1s between sibling elements in the same section",
    "CTA button: subtle pulse or glow on first render (once only, not looping)",
    "Icon/stat counters: count-up animation when scrolled into view",
    "Avoid: parallax, complex keyframes, or anything that slows perceived load",
    "prefers-reduced-motion: opacity transition only, no y movement",
  ],
  mobilePatterns: [
    "Hero: headline + subheadline + single CTA button — remove all secondary content",
    "Navigation: hamburger menu or bottom tab bar — never horizontal overflow",
    "Service cards: vertical stack, full width, icon + title + 'Ver mais' chevron",
    "WhatsApp sticky button: bottom-right, 56px, always visible",
    "Images: max-width 100%, lazy-loaded, WebP with JPEG fallback",
  ],
};
