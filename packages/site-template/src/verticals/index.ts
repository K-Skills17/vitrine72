import { estetica } from "./estetica.js";
import { moveisPlaynados } from "./moveis-planejados.js";
import { energiaSolar } from "./energia-solar.js";
import { servicosUrgentes } from "./servicos-urgentes.js";
import { fisioterapiaPilates } from "./fisioterapia-pilates.js";
import { buffetEventos } from "./buffet-eventos.js";
import { generico } from "./generico.js";
import type { VerticalConfig, VerticalId } from "../types.js";

export const VERTICALS: Record<VerticalId, VerticalConfig> = {
  estetica,
  "moveis-planejados": moveisPlaynados,
  "energia-solar": energiaSolar,
  "servicos-urgentes": servicosUrgentes,
  "fisioterapia-pilates": fisioterapiaPilates,
  "buffet-eventos": buffetEventos,
  generico,
};

export function getVertical(id: string): VerticalConfig {
  return VERTICALS[id as VerticalId] ?? VERTICALS.generico;
}

export * from "../types.js";
