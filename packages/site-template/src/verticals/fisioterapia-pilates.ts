import type { VerticalConfig } from "../types.js";

export const fisioterapiaPilates: VerticalConfig = {
  id: "fisioterapia-pilates",
  schemaOrgType: "Physiotherapy",
  pages: [
    { slug: "", title: "Início", template: "home" },
    { slug: "programas", title: "Programas", template: "programs" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "faq", title: "Perguntas", template: "faq" },
    { slug: "agendar", title: "Agendar", template: "booking" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "lato-lato",
      display: "Lato",
      body: "Lato",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
    },
    {
      id: "poppins-lato",
      display: "Poppins",
      body: "Lato",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lato:wght@300;400&display=swap",
    },
  ],
  palettes: [
    {
      id: "calm-teal",
      primary: "#00796b",
      secondary: "#e0f2f1",
      accent: "#ff7043",
      background: "#ffffff",
      text: "#212121",
    },
    {
      id: "soft-blue",
      primary: "#1976d2",
      secondary: "#e3f2fd",
      accent: "#43a047",
      background: "#ffffff",
      text: "#212121",
    },
  ],
  signatureElement: "programs-booking",
  designPrinciples: [
    "Calm, clean, clinical-adjacent — but warmer than a hospital: teal, sage, soft blue",
    "Credentials front and center: CREFITO registration, specializations, COFFITO membership",
    "Patient outcome photography: person active and smiling, not clinical/medical",
    "Program structure clarity: who it's for, what it includes, how many sessions",
    "Online booking or WhatsApp scheduling must be friction-free — 2 taps max",
    "Typography: round sans (Poppins, Lato) — approachable, not intimidating",
    "FAQ must address health plan coverage (convênios) — top objection in this niche",
  ],
  conversionPatterns: [
    "Booking CTA: 'Agendar avaliação gratuita' converts better than 'Entre em contato'",
    "Program cards: condition treated + sessions + outcome — not feature lists",
    "Health plan logos: show accepted planos de saúde — removes biggest barrier",
    "Therapist bio with photo and CREFITO number builds trust over anything else",
    "Before/after patient testimonials (with name and condition) — privacy-sensitive but powerful",
    "Location + hours prominent: 'Atendemos Pinheiros, Perdizes, Vila Madalena'",
    "First session offer: 'Avaliação inicial gratuita' — reduces commitment barrier",
  ],
  animationHints: [
    "Gentle fade-up on scroll (y: 15px, 0.4s ease) — calm matches the brand tone",
    "Program card hover: subtle border color transition and slight lift (shadow)",
    "Therapist photo: soft circular crop with fade-in",
    "Stats counter: patient count, years experience — count-up on viewport enter",
    "Avoid: fast transitions, bouncing, anything energetic — this is a calm, recovery brand",
    "prefers-reduced-motion: fade only, no movement",
  ],
  mobilePatterns: [
    "Booking button: sticky bottom bar 'Agendar consulta via WhatsApp'",
    "Program list: vertical cards, full width, condition icon + name + CTA",
    "Therapist bio: photo top, text below — not side by side on mobile",
    "Health plan logos: 2-column grid, not horizontal scroll",
    "FAQ: accordion — space-efficient for long answers about planos and coverage",
  ],
};
