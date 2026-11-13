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
  clinicReception: {
    slot: "07",
    subject: "Recepção: balcão de pedra e carvalho",
    src: null,
    alt: "Recepção da clínica com balcão de pedra clara e madeira",
  },
  clinicConsultation: {
    slot: "08",
    subject: "Sala de consulta: mesa e duas cadeiras, luz do dia",
    src: null,
    alt: "Sala de consulta com mesa e duas cadeiras sob luz natural",
  },
  clinicTreatmentRoom: {
    slot: "09",
    subject: "Sala de procedimentos em tons quentes",
    src: null,
    alt: "Sala de procedimentos com poltrona clínica em ambiente de tons quentes",
  },
  clinicDetail: {
    slot: "10",
    subject: "Detalhe: cerâmica, linho e sombra de planta",
    src: null,
    alt: "Detalhe de cerâmica e toalha de linho com sombra de planta",
  },
  proHelena: { slot: "12", subject: "Retrato profissional: médica, fundo neutro", src: null, alt: "Retrato ilustrativo da Dra. Helena Moraes, profissional fictícia" },
  proRafael: { slot: "13", subject: "Retrato profissional: médico, fundo neutro", src: null, alt: "Retrato ilustrativo do Dr. Rafael Teixeira, profissional fictício" },
  proLivia: { slot: "14", subject: "Retrato profissional: biomédica, fundo neutro", src: null, alt: "Retrato ilustrativo de Lívia Campos, profissional fictícia" },
  "toxina-botulinica": { slot: "15", subject: "Testa e olhar, expressão relaxada, sem procedimento", src: null, alt: "Detalhe do olhar e da testa de uma mulher em expressão relaxada" },
  "bioestimuladores-de-colageno": { slot: "16", subject: "Contorno do rosto em luz lateral", src: null, alt: "Perfil do rosto de uma mulher em luz lateral suave" },
  "preenchimento-facial": { slot: "17", subject: "Perfil: lábios e queixo, natural", src: null, alt: "Perfil de lábios e queixo em luz natural" },
  skinbooster: { slot: "18", subject: "Textura de pele hidratada, macro", src: null, alt: "Detalhe da textura de uma pele hidratada" },
  "laser-dermatologico": { slot: "19", subject: "Pele em luz natural, uniformidade", src: null, alt: "Rosto em luz natural com pele uniforme" },
  "qualidade-da-pele": { slot: "20", subject: "Mão tocando a bochecha, pele real", src: null, alt: "Mão tocando levemente a bochecha, com textura de pele real" },
} satisfies Record<string, ImageRef>;
