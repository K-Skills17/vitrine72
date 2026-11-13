/**
 * Copy for /clinica, /profissionais, /contato and /privacidade.
 * Demonstration content, pending professional (and, for privacy, LGPD) review.
 */

export const clinicPage = {
  eyebrow: "A clínica",
  title: "Um espaço pensado para o tempo da consulta.",
  lead: "A estrutura da ÁUREA foi desenhada em torno de uma ideia simples: a avaliação precisa de calma, privacidade e luz. Tudo o que vem depois depende dela.",
  spacesTitle: "Os ambientes",
  spaces: [
    { key: "clinicReception", title: "Recepção", body: "Chegada sem espera em pé e atendimento discreto, com horários organizados para evitar salas cheias." },
    { key: "clinicConsultation", title: "Sala de consulta", body: "Uma mesa, duas cadeiras e luz natural. É onde a conversa e a avaliação acontecem, sem pressa." },
    { key: "clinicTreatmentRoom", title: "Salas de procedimento", body: "Salas reservadas, preparadas para cada tipo de tratamento, com materiais organizados por protocolo." },
  ],
  standardsEyebrow: "Cuidados",
  standardsTitle: "O que acontece antes de qualquer procedimento.",
  standards: [
    { title: "Avaliação e prontuário", body: "Cada atendimento começa com histórico, exame e registro em prontuário, revisado a cada retorno." },
    { title: "Consentimento informado", body: "Antes de um procedimento, você recebe por escrito o que será feito, os cuidados e os possíveis efeitos, e tira suas dúvidas." },
    { title: "Produtos regularizados", body: "Produtos e equipamentos utilizados com registro na Anvisa, com rastreabilidade de lote registrada no prontuário." },
    { title: "Materiais de uso único", body: "Agulhas, cânulas e materiais descartáveis abertos na sua frente e descartados após o uso." },
  ],
} as const;

export const professionalsPage = {
  eyebrow: "Profissionais",
  title: "Cada plano tem um responsável identificado.",
  lead: "Os tratamentos são conduzidos por profissionais habilitados, cada um dentro da sua área de atuação. Você sabe desde a avaliação quem acompanha o seu plano.",
  fictionalNote: "Profissionais fictícios para demonstração. Nomes, registros e imagens são ilustrativos.",
  leadsLabel: "Responsável por",
} as const;

export const contactPage = {
  eyebrow: "Contato",
  title: "Fale com a equipe.",
  lead: "O caminho mais rápido é o WhatsApp: tiramos dúvidas gerais e agendamos sua avaliação. Indicações de tratamento são feitas apenas em consulta.",
  whatsappTitle: "WhatsApp",
  whatsappBody: "Antes de abrir a conversa, fazemos quatro perguntas rápidas para a equipe já chegar preparada.",
  visitTitle: "Visite",
  hoursTitle: "Horários",
  otherTitle: "Outros canais",
} as const;
