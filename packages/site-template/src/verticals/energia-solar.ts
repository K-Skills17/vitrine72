import type { VerticalConfig } from "../types.js";

export const energiaSolar: VerticalConfig = {
  id: "energia-solar",
  schemaOrgType: "LocalBusiness",
  pages: [
    { slug: "", title: "Início", template: "home" },
    { slug: "como-funciona", title: "Como funciona", template: "services" },
    { slug: "economia", title: "Quanto você economiza", template: "savings-estimator" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "contato", title: "Fale conosco", template: "contact" },
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
      id: "solar-blue",
      primary: "#1a73e8",
      secondary: "#f4f9ff",
      accent: "#f9a825",
      background: "#ffffff",
      text: "#1a1a1a",
    },
    {
      id: "forest-sun",
      primary: "#2e7d32",
      secondary: "#f9fbe7",
      accent: "#f9a825",
      background: "#ffffff",
      text: "#1a1a1a",
    },
  ],
  signatureElement: "savings-estimator",
  designPrinciples: [
    "ROI is the only message that matters — every section answers 'how much will I save?'",
    "Clean tech aesthetic: white backgrounds, blue/green primary, bold numbers",
    "Data visualization: savings calculator or animated counter drives engagement",
    "Trust signals: ABSOLAR certification, instalações realizadas count, warranty terms",
    "Before/after electricity bill comparison is more persuasive than any copy",
    "Diagrams of how solar works (simple 3-step flow) reduce sales objections",
    "Typography: modern sans-serif (Inter, Plus Jakarta) — this is a tech purchase",
  ],
  conversionPatterns: [
    "Savings estimator input (monthly bill amount) → estimated savings output is the primary lead magnet",
    "Lead form: just 3 fields (name, phone, monthly bill) — every extra field costs conversions",
    "Show payback period prominently ('recupera o investimento em X anos')",
    "Competitor comparison: solar vs CEMIG bill projection over 10 years",
    "Financing options visible: '12x sem juros' removes the price objection immediately",
    "Case study: real customer, real address, real savings — anonymized if needed",
    "WhatsApp: 'Solicitar simulação gratuita' — not 'fale conosco'",
  ],
  animationHints: [
    "Counter animation: installed capacity (kWp) and savings (R$) count up on scroll",
    "Savings estimator: smooth number transition when user changes input value",
    "Step-by-step process: icons animate in sequentially (stagger 0.15s)",
    "Sun/energy particle effect: subtle, CSS-only, behind hero section",
    "Avoid: solar panel rotating, sun spinning — looks cheap",
    "prefers-reduced-motion: disable counter animation, show final value immediately",
  ],
  mobilePatterns: [
    "Savings calculator: full-width slider input, not number field — easier on mobile",
    "Process steps: vertical timeline on mobile, horizontal on desktop",
    "Certificate logos: horizontal scroll row on mobile",
    "Lead form: floating WhatsApp button + inline form — give both options",
    "Hero: bold headline + 'Simule sua economia' button + trust badges — no video",
  ],
};
