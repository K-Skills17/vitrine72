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
};
