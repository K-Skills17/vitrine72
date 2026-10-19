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
};
