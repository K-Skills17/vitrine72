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
};
