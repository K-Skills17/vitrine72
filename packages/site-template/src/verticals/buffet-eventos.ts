import type { VerticalConfig } from "../types.js";

export const buffetEventos: VerticalConfig = {
  id: "buffet-eventos",
  schemaOrgType: "EventVenue",
  pages: [
    { slug: "", title: "Início", template: "home" },
    { slug: "cardapio", title: "Cardápio", template: "menu" },
    { slug: "galeria", title: "Galeria", template: "gallery" },
    { slug: "sobre", title: "Sobre", template: "about" },
    { slug: "orcamento", title: "Pedir orçamento", template: "inquiry" },
  ],
  layoutVariants: [1, 2, 3],
  fontPairs: [
    {
      id: "playfair-raleway",
      display: "Playfair Display",
      body: "Raleway",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Raleway:wght@300;400;600&display=swap",
    },
    {
      id: "gfs-didot-lato",
      display: "GFS Didot",
      body: "Lato",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=GFS+Didot&family=Lato:wght@300;400;700&display=swap",
    },
  ],
  palettes: [
    {
      id: "gold-navy",
      primary: "#1a237e",
      secondary: "#fdf6e3",
      accent: "#c9a228",
      background: "#ffffff",
      text: "#212121",
    },
    {
      id: "champagne-rose",
      primary: "#8d6e63",
      secondary: "#fce4ec",
      accent: "#c9a228",
      background: "#ffffff",
      text: "#212121",
    },
  ],
  signatureElement: "gallery-inquiry",
};
