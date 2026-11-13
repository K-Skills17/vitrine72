import type { TreatmentDetail } from "@/types/treatment";

/**
 * Treatment page content. DEMONSTRATION copy, `pending-professional-review`
 * (see the matching summary in treatments.ts). Written to the rules in
 * docs/CONTENT_GUIDELINES.md: no promises, no certain durations or session
 * counts, every "para quem" ends with the evaluation caveat, aftercare is
 * general guidance only.
 */

const EVALUATION_CAVEAT = "A indicação é sempre definida em avaliação presencial com o profissional responsável.";

const GENERAL_AFTERCARE_NOTE = "Orientações específicas são passadas pelo profissional após o procedimento.";

export const treatmentDetails: TreatmentDetail[] = [
  {
    slug: "toxina-botulinica",
    intro:
      "A toxina botulínica atua na contração de músculos específicos da face. É uma das formas mais estudadas de suavizar linhas que aparecem com o movimento, como as da testa e ao redor dos olhos.",
    whatItIs: [
      "É uma substância aplicada em pequenas quantidades, em pontos definidos a partir da avaliação da sua expressão. Ela reduz temporariamente a força de contração do músculo tratado.",
      "O objetivo não é paralisar o rosto, e sim suavizar o movimento que marca a pele, preservando a expressão.",
    ],
    concerns: [
      "Linhas de expressão na testa",
      "Linhas entre as sobrancelhas",
      "Linhas ao redor dos olhos",
      "Em alguns casos, ajustes na posição das sobrancelhas",
    ],
    candidacy: [
      "Pode ser considerada para quem nota linhas que aparecem ou se aprofundam com a expressão.",
      "Gestação, amamentação, algumas condições neuromusculares e o uso de certos medicamentos podem contraindicar o tratamento.",
      EVALUATION_CAVEAT,
    ],
    process: [
      { title: "Avaliação", body: "Conversa sobre histórico e expectativas e análise da expressão em movimento." },
      { title: "Planejamento", body: "Definição dos pontos e das quantidades, explicados antes da aplicação." },
      { title: "Aplicação", body: "Procedimento em consultório, com agulhas finas e duração curta." },
      { title: "Retorno", body: "Reavaliação programada para observar a resposta e, se necessário, ajustar." },
    ],
    aftercare: [
      "Evitar massagear ou pressionar a área tratada nas primeiras horas.",
      "Evitar atividade física intensa no mesmo dia, salvo orientação diferente.",
      GENERAL_AFTERCARE_NOTE,
    ],
    faq: [
      {
        q: "O efeito é imediato?",
        a: "Não. A ação costuma aparecer de forma gradual nos dias seguintes. O tempo exato varia de pessoa para pessoa, e o retorno serve justamente para acompanhar essa resposta.",
      },
      {
        q: "Quanto tempo dura?",
        a: "O efeito é temporário e a duração varia conforme o organismo, a área tratada e a dose. O profissional explica o que esperar no seu caso durante a avaliação.",
      },
      {
        q: "Vou ficar com a expressão travada?",
        a: "O planejamento busca suavizar o movimento, não eliminá-lo. As doses são definidas para preservar a sua expressão, e isso é discutido com você antes.",
      },
    ],
    responsibleProfessionalId: "rafael-teixeira",
    related: ["preenchimento-facial", "bioestimuladores-de-colageno"],
  },
  {
    slug: "bioestimuladores-de-colageno",
    intro:
      "Os bioestimuladores estimulam o próprio organismo a produzir colágeno. A mudança é gradual e trabalha a firmeza e a sustentação da pele ao longo do tempo.",
    whatItIs: [
      "São substâncias aplicadas em camadas específicas da pele que estimulam a produção natural de colágeno na região tratada.",
      "Diferente de um preenchimento, o foco não é dar volume imediato, e sim melhorar gradualmente a qualidade e a sustentação da pele.",
    ],
    concerns: [
      "Perda de firmeza no rosto",
      "Flacidez leve a moderada",
      "Pele mais fina com o passar do tempo",
      "Em alguns casos, áreas do corpo, conforme avaliação",
    ],
    candidacy: [
      "Pode ser considerado para quem percebe perda de firmeza e prefere uma mudança progressiva.",
      "Algumas condições de saúde, infecções na área e doenças autoimunes podem exigir cuidado ou contraindicar.",
      EVALUATION_CAVEAT,
    ],
    process: [
      { title: "Avaliação", body: "Análise da qualidade da pele, da sustentação e do seu histórico de tratamentos." },
      { title: "Plano por etapas", body: "Quando indicado, o tratamento costuma ser feito em sessões espaçadas. O número de sessões é definido no seu plano." },
      { title: "Aplicação", body: "Procedimento em consultório, com anestesia local quando indicada." },
      { title: "Acompanhamento", body: "Retornos para avaliar a resposta da pele, que é gradual." },
    ],
    aftercare: [
      "Pode haver orientação de massagem na área em casa, conforme o produto utilizado.",
      "Inchaço leve ou sensibilidade local podem ocorrer nos primeiros dias.",
      GENERAL_AFTERCARE_NOTE,
    ],
    faq: [
      {
        q: "Quando aparece o resultado?",
        a: "A produção de colágeno é um processo gradual, que acontece ao longo de semanas e meses. Por isso a avaliação de resposta é feita nos retornos, não logo após a aplicação.",
      },
      {
        q: "Bioestimulador é o mesmo que preenchimento?",
        a: "Não. O preenchimento repõe volume em pontos específicos. O bioestimulador estimula o colágeno e atua na qualidade e na firmeza da pele. Às vezes os dois são combinados, sempre conforme avaliação.",
      },
    ],
    responsibleProfessionalId: "rafael-teixeira",
    related: ["preenchimento-facial", "skinbooster"],
  },
  {
    slug: "preenchimento-facial",
    intro:
      "O preenchimento com ácido hialurônico repõe volume e define contornos em pontos específicos do rosto, respeitando a anatomia e a proporção de cada pessoa.",
    whatItIs: [
      "O ácido hialurônico é uma substância presente naturalmente na pele. No preenchimento, ele é aplicado em pontos definidos para restaurar volume ou sustentar estruturas.",
      "O planejamento parte da proporção do rosto como um todo, e não de uma área isolada.",
    ],
    concerns: [
      "Perda de volume em maçãs do rosto ou têmporas",
      "Sulcos mais marcados",
      "Contorno de mandíbula e queixo",
      "Hidratação e contorno dos lábios",
    ],
    candidacy: [
      "Pode ser considerado para quem percebe perda de volume ou deseja ajustes discretos de contorno.",
      "Infecções ativas na área, gestação e alguns históricos de procedimentos podem contraindicar ou adiar o tratamento.",
      EVALUATION_CAVEAT,
    ],
    process: [
      { title: "Avaliação", body: "Análise da proporção facial, em repouso e em movimento, e conversa sobre o que você deseja." },
      { title: "Planejamento", body: "Definição de áreas, produto e quantidade, com explicação de cada escolha." },
      { title: "Aplicação", body: "Procedimento em consultório, com anestesia tópica ou local quando indicada." },
      { title: "Retorno", body: "Reavaliação para observar a acomodação do produto." },
    ],
    aftercare: [
      "Inchaço e pequenos hematomas podem ocorrer nos primeiros dias.",
      "Evitar calor intenso e atividade física no mesmo dia, salvo orientação diferente.",
      GENERAL_AFTERCARE_NOTE,
    ],
    faq: [
      {
        q: "O resultado fica artificial?",
        a: "O planejamento é feito para respeitar a anatomia e a proporção do seu rosto. Mudanças graduais e quantidades discutidas com você ajudam a manter a naturalidade.",
      },
      {
        q: "Quanto tempo dura?",
        a: "O ácido hialurônico é absorvido gradualmente pelo organismo. A duração varia conforme a área, o produto e cada pessoa, e é explicada na avaliação.",
      },
    ],
    responsibleProfessionalId: "rafael-teixeira",
    related: ["toxina-botulinica", "bioestimuladores-de-colageno"],
  },
  {
    slug: "skinbooster",
    intro:
      "O skinbooster é uma forma de hidratação injetável que trabalha a qualidade da pele: viço, textura e aspecto de pele descansada.",
    whatItIs: [
      "Consiste na aplicação de ácido hialurônico de baixa densidade em microdoses distribuídas pela área tratada.",
      "Não tem o objetivo de mudar contornos ou dar volume. O foco é a hidratação profunda e a qualidade da pele.",
    ],
    concerns: [
      "Pele desidratada ou sem viço",
      "Textura irregular e linhas finas",
      "Pescoço, colo e mãos, conforme avaliação",
    ],
    candidacy: [
      "Pode ser considerado para quem deseja melhorar a qualidade da pele sem alterar volumes.",
      "Infecções ativas, algumas doenças de pele e a gestação podem contraindicar ou adiar.",
      EVALUATION_CAVEAT,
    ],
    process: [
      { title: "Avaliação", body: "Análise da pele e da rotina de cuidados atual." },
      { title: "Plano", body: "Quando indicado, sessões espaçadas. A quantidade é definida no seu plano." },
      { title: "Aplicação", body: "Microdoses em consultório, com anestesia tópica." },
      { title: "Acompanhamento", body: "Ajustes do plano e da rotina em casa entre as sessões." },
    ],
    aftercare: [
      "Pequenas pápulas ou vermelhidão podem aparecer e costumam diminuir nos dias seguintes.",
      "Evitar maquiagem nas primeiras horas, salvo orientação diferente.",
      GENERAL_AFTERCARE_NOTE,
    ],
    faq: [
      {
        q: "Skinbooster muda o formato do rosto?",
        a: "Não. Ele trabalha a hidratação e a qualidade da pele. Mudanças de contorno ou volume são objetivo de outros tratamentos.",
      },
      {
        q: "Posso combinar com outros tratamentos?",
        a: "Em alguns casos, sim. A combinação e a ordem são definidas no plano, conforme a avaliação.",
      },
    ],
    responsibleProfessionalId: "livia-campos",
    related: ["qualidade-da-pele", "laser-dermatologico"],
  },
  {
    slug: "laser-dermatologico",
    intro:
      "As tecnologias de laser e luz trabalham textura, manchas e uniformidade da pele. Os parâmetros são ajustados ao tipo de pele e ao objetivo de cada plano.",
    whatItIs: [
      "Existem diferentes tipos de laser e de luz, cada um com uma ação específica na pele. A escolha da tecnologia e dos parâmetros depende da avaliação dermatológica.",
      "Alguns tratamentos exigem preparo prévio da pele e cuidados com o sol antes e depois das sessões.",
    ],
    concerns: [
      "Manchas e tom irregular",
      "Textura e poros aparentes",
      "Marcas de acne, conforme avaliação",
      "Vasinhos e vermelhidão, conforme avaliação",
    ],
    candidacy: [
      "Pode ser considerado para quem busca melhorar a uniformidade e a textura da pele.",
      "Exposição solar recente, alguns fototipos, medicamentos fotossensibilizantes e a gestação podem exigir adaptação ou contraindicar.",
      EVALUATION_CAVEAT,
    ],
    process: [
      { title: "Avaliação dermatológica", body: "Análise do tipo de pele, histórico de exposição solar e medicamentos em uso." },
      { title: "Preparo", body: "Quando necessário, cuidados de preparo da pele antes da primeira sessão." },
      { title: "Sessões", body: "Aplicação em consultório, com proteção ocular e parâmetros definidos para a sua pele." },
      { title: "Acompanhamento", body: "Reavaliação entre as sessões e ajuste dos parâmetros." },
    ],
    aftercare: [
      "Proteção solar rigorosa antes e depois das sessões.",
      "Vermelhidão e sensibilidade podem ocorrer nos dias seguintes, conforme a tecnologia.",
      GENERAL_AFTERCARE_NOTE,
    ],
    faq: [
      {
        q: "Posso fazer laser no verão?",
        a: "Depende da tecnologia e da sua exposição ao sol. Algumas opções exigem afastamento do sol; outras podem ser adaptadas. Isso é definido na avaliação.",
      },
      {
        q: "Quantas sessões são necessárias?",
        a: "Varia conforme o objetivo, a tecnologia e a resposta da pele. O plano é explicado na avaliação e revisto nos retornos.",
      },
    ],
    responsibleProfessionalId: "helena-moraes",
    related: ["qualidade-da-pele", "skinbooster"],
  },
  {
    slug: "qualidade-da-pele",
    intro:
      "Protocolos que combinam procedimentos em consultório e cuidados em casa para textura, poros, oleosidade e luminosidade.",
    whatItIs: [
      "Não é um procedimento único, e sim um plano. Pode incluir limpeza profunda, peelings, tecnologias e uma rotina de cuidados em casa, conforme a avaliação.",
      "O foco é a saúde da pele no longo prazo, com ajustes ao longo do acompanhamento.",
    ],
    concerns: [
      "Oleosidade e poros aparentes",
      "Textura irregular",
      "Pele opaca ou sem luminosidade",
      "Sensibilidade, conforme avaliação",
    ],
    candidacy: [
      "Pode ser considerado para quem quer cuidar da pele de forma contínua, com orientação profissional.",
      "Algumas condições de pele exigem tratamento médico antes de qualquer protocolo estético.",
      EVALUATION_CAVEAT,
    ],
    process: [
      { title: "Avaliação", body: "Análise da pele, da rotina atual e dos produtos que você já usa." },
      { title: "Plano", body: "Combinação de etapas em consultório e cuidados em casa, explicada por escrito." },
      { title: "Sessões", body: "Procedimentos em consultório no ritmo definido no plano." },
      { title: "Acompanhamento", body: "Revisão periódica da rotina e do plano." },
    ],
    aftercare: [
      "Proteção solar diária.",
      "Seguir a rotina em casa combinada no plano, sem introduzir novos ativos por conta própria.",
      GENERAL_AFTERCARE_NOTE,
    ],
    faq: [
      {
        q: "Preciso mudar todos os meus produtos?",
        a: "Não necessariamente. Na avaliação revisamos o que você já usa e indicamos ajustes apenas quando fazem sentido.",
      },
      {
        q: "Em quanto tempo noto diferença?",
        a: "A resposta da pele é gradual e varia de pessoa para pessoa. Os retornos servem para acompanhar a evolução e ajustar o plano.",
      },
    ],
    responsibleProfessionalId: "livia-campos",
    related: ["skinbooster", "laser-dermatologico"],
  },
];

export function getTreatmentDetail(slug: string): TreatmentDetail | undefined {
  return treatmentDetails.find((t) => t.slug === slug);
}
