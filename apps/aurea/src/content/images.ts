import type { ImageRef } from "@/types/image";

/**
 * Every photograph on the site, keyed by purpose. Numbers match the shot
 * list in docs/ASSETS.md. To add a photo: put the file under
 * public/images/<folder>/ and set `src` (and `focal` if needed).
 */
export const images = {
  homeHero: {
    slot: "01",
    subject: "Retrato, mulher 35–45, perfil três quartos, luz de janela",
    src: null,
    alt: "Mulher em perfil sob luz natural suave, pele com textura real",
    focal: "50% 35%",
  },
  homeIntro: {
    slot: "02",
    subject: "Detalhe arquitetônico: travertino com luz rasante",
    src: null,
    alt: "Parede de travertino iluminada por luz lateral",
  },
  clinicReception: {
    slot: "07",
    subject: "Recepção: balcão de pedra e carvalho",
    src: null,
    alt: "Recepção da clínica com balcão de pedra clara e madeira",
  },
  clinicDetail: {
    slot: "10",
    subject: "Detalhe: cerâmica, linho e sombra de planta",
    src: null,
    alt: "Detalhe de cerâmica e toalha de linho com sombra de planta",
  },
} satisfies Record<string, ImageRef>;
