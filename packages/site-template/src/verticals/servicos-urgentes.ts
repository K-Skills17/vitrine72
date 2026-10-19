import type { VerticalConfig } from "../types.js";

export const servicosUrgentes: VerticalConfig = {
  id: "servicos-urgentes",
  schemaOrgType: "LocalBusiness",
  pages: [
    { slug: "", title: "Início", template: "home-urgent" },
    { slug: "servicos", title: "Serviços", template: "services" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "faq", title: "Dúvidas frequentes", template: "faq" },
    { slug: "contato", title: "Contato", template: "contact" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "roboto-roboto",
      display: "Roboto",
      body: "Roboto",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
    },
    {
      id: "oswald-roboto",
      display: "Oswald",
      body: "Roboto",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Roboto:wght@300;400;500&display=swap",
    },
  ],
  palettes: [
    {
      id: "urgent-red",
      primary: "#c62828",
      secondary: "#fff3e0",
      accent: "#ff6f00",
      background: "#ffffff",
      text: "#1a1a1a",
    },
    {
      id: "trustworthy-blue",
      primary: "#1565c0",
      secondary: "#e8f4fd",
      accent: "#ff6f00",
      background: "#ffffff",
      text: "#1a1a1a",
    },
  ],
  signatureElement: "sticky-call-bar",
};
