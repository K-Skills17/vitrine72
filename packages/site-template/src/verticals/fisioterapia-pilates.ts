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
};
