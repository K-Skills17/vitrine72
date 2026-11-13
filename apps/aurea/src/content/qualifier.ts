import { treatmentSummaries } from "@/content/treatments";

/**
 * Qualification gate shown before every WhatsApp hand-off (same model as
 * the apps/demo sites). Answers only go into the WhatsApp message the
 * visitor sends themselves; nothing is stored or sent to analytics.
 */

export type QualifierStep =
  | { id: "name"; type: "text"; label: string; placeholder: string }
  | { id: "service" | "timing" | "budget"; type: "choice"; label: string; options: string[] };

export type QualifierAnswers = Partial<Record<QualifierStep["id"], string>>;

export const UNDECIDED_SERVICE = "Ainda não sei, quero orientação";

export const qualifierSteps: QualifierStep[] = [
  { id: "name", type: "text", label: "Qual é o seu primeiro nome?", placeholder: "Ex.: Ana" },
  {
    id: "service",
    type: "choice",
    label: "O que você gostaria de avaliar?",
    options: [...treatmentSummaries.map((t) => t.name), UNDECIDED_SERVICE],
  },
  {
    id: "timing",
    type: "choice",
    label: "Quando pretende fazer a avaliação?",
    options: ["Esta semana", "Este mês", "Nos próximos 3 meses", "Só estou pesquisando"],
  },
  {
    id: "budget",
    type: "choice",
    label: "Qual investimento você considera para o seu plano?",
    options: ["Até R$500", "R$500–1.500", "R$1.500–3.000", "Acima de R$3.000"],
  },
];

/** Answers that mark a lead as low fit. Only tracked; the visitor still reaches WhatsApp. */
export const lowFitAnswers = ["Só estou pesquisando", "Até R$500"];

export const qualifierCopy = {
  title: "Antes de abrir o WhatsApp",
  intro: "Quatro perguntas rápidas para a equipe já chegar preparada na conversa.",
  next: "Continuar",
  back: "Voltar",
  close: "Fechar",
} as const;
