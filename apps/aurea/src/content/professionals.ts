import { images } from "@/content/images";
import type { Professional } from "@/types/professional";

/**
 * FICTIONAL professionals for the demonstration. Names, roles, bios and
 * registrations are invented and labelled as such wherever they appear.
 * Replace with real, verified professionals before any real use.
 */
export const professionals: Professional[] = [
  {
    id: "helena-moraes",
    name: "Dra. Helena Moraes",
    role: "Médica dermatologista · Responsável técnica",
    specialties: ["Dermatologia", "Laser e tecnologias", "Qualidade da pele"],
    bio: "Conduz as avaliações dermatológicas e define os parâmetros de laser e tecnologias. Acompanha os planos de longo prazo e os retornos.",
    registration: "CRM/UF 000000 · RQE 0000 — demonstração",
    image: images.proHelena,
    isFictional: true,
  },
  {
    id: "rafael-teixeira",
    name: "Dr. Rafael Teixeira",
    role: "Médico · Estética facial",
    specialties: ["Toxina botulínica", "Preenchimento", "Bioestimuladores"],
    bio: "Responsável pelos tratamentos injetáveis. Trabalha com planejamento por etapas e leitura da proporção de cada rosto.",
    registration: "CRM/UF 000000 — demonstração",
    image: images.proRafael,
    isFictional: true,
  },
  {
    id: "livia-campos",
    name: "Lívia Campos",
    role: "Biomédica esteta",
    specialties: ["Skinbooster", "Protocolos de qualidade da pele"],
    bio: "Acompanha os protocolos de qualidade da pele e as orientações de cuidado em casa entre as sessões.",
    registration: "CRBM 00000 — demonstração",
    image: images.proLivia,
    isFictional: true,
  },
];

export function getProfessional(id: string): Professional | undefined {
  return professionals.find((p) => p.id === id);
}
