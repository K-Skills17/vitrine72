import type { TreatmentCategory, TreatmentSummary } from "@/types/treatment";

/**
 * Demonstration content. Every entry is `pending-professional-review` and
 * must be approved by the responsible professional before real use.
 */

export const categories: TreatmentCategory[] = [
  {
    id: "estetica-facial",
    name: "Estética facial",
    description: "Proporção, contorno e expressão, tratados com leitura individual do rosto.",
  },
  {
    id: "qualidade-da-pele",
    name: "Qualidade da pele",
    description: "Textura, viço, manchas e hidratação profunda, com foco na saúde da pele.",
  },
  {
    id: "rejuvenescimento",
    name: "Rejuvenescimento",
    description: "Sinais do tempo abordados de forma gradual, preservando a naturalidade.",
  },
  {
    id: "estetica-corporal",
    name: "Estética corporal",
    description: "Indicações corporais definidas caso a caso, a partir da avaliação presencial.",
  },
];

export const treatmentSummaries: TreatmentSummary[] = [
  {
    slug: "toxina-botulinica",
    name: "Toxina botulínica",
    messageName: "toxina botulínica",
    categories: ["estetica-facial", "rejuvenescimento"],
    summary: "Suaviza a contração dos músculos responsáveis por linhas de expressão dinâmicas.",
    reviewStatus: "pending-professional-review",
  },
  {
    slug: "bioestimuladores-de-colageno",
    name: "Bioestimuladores de colágeno",
    messageName: "bioestimuladores de colágeno",
    categories: ["rejuvenescimento", "qualidade-da-pele"],
    summary: "Estimulam a produção natural de colágeno para melhorar firmeza e sustentação ao longo do tempo.",
    reviewStatus: "pending-professional-review",
  },
  {
    slug: "preenchimento-facial",
    name: "Preenchimento facial",
    messageName: "preenchimento facial",
    categories: ["estetica-facial"],
    summary: "Repõe volume e define contornos com ácido hialurônico, respeitando a anatomia de cada rosto.",
    reviewStatus: "pending-professional-review",
  },
  {
    slug: "skinbooster",
    name: "Skinbooster",
    messageName: "skinbooster",
    categories: ["qualidade-da-pele"],
    summary: "Hidratação injetável que trabalha a qualidade e o viço da pele.",
    reviewStatus: "pending-professional-review",
  },
  {
    slug: "laser-dermatologico",
    name: "Laser dermatológico",
    messageName: "laser dermatológico",
    categories: ["qualidade-da-pele", "rejuvenescimento"],
    summary: "Tecnologias de luz para textura, manchas e uniformidade, com parâmetros ajustados a cada pele.",
    reviewStatus: "pending-professional-review",
  },
  {
    slug: "qualidade-da-pele",
    name: "Tratamentos para qualidade da pele",
    messageName: "tratamentos para qualidade da pele",
    categories: ["qualidade-da-pele"],
    summary: "Protocolos combinados para textura, poros, oleosidade e luminosidade.",
    reviewStatus: "pending-professional-review",
  },
];

export function getTreatmentSummary(slug: string): TreatmentSummary | undefined {
  return treatmentSummaries.find((t) => t.slug === slug);
}

export const treatmentPath = (slug: string) => `/tratamentos/${slug}`;
