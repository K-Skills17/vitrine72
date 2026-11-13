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
    src: "/images/hero/retrato-luz-janela.jpg",
    alt: "Retrato de mulher olhando por sobre o ombro, iluminada pela luz de uma janela",
    focal: "50% 38%",
  },
  homeIntro: {
    slot: "02",
    subject: "Detalhe editorial com luz rasante",
    src: "/images/editorial/eucalipto-luz-rasante.jpg",
    alt: "Ramo de eucalipto em um pequeno vaso de cerâmica sobre linho, sob luz natural lateral",
    focal: "50% 62%",
  },
  clinicSpace: {
    slot: "11",
    subject: "Corredor com painel de mármore iluminado",
    src: "/images/clinic/corredor-marmore.jpg",
    alt: "Sala de espera clara com painel de mármore iluminado e uma paciente sentada em poltrona",
    focal: "50% 64%",
  },
  clinicDetail: {
    slot: "10",
    subject: "Detalhe: cerâmica, linho e sombra de planta",
    src: null,
    alt: "Detalhe de cerâmica e toalha de linho com sombra de planta",
  },
} satisfies Record<string, ImageRef>;
