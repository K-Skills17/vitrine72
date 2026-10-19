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
};
