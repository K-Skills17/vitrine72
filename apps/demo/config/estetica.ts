import type { NicheConfig } from "../lib/niche";

const estetica: NicheConfig = {
  niche: "estetica",
  brandName: "Clínica Aurora Estética",
  tagline: "Sua beleza, com segurança e resultados reais",
  heroHeadline: "Só clientes certos chegam até você — no WhatsApp",
  heroSubheadline:
    "A Clínica Aurora filtra curiosos antes de abrir a conversa. Você fala com quem realmente quer fazer o procedimento.",
  whatsappNumber: "5511953542831",
  primaryColor: "#c97ea2",
  primaryLight: "#f3d6e8",
  primaryDark: "#8a4870",
  accentColor: "#e8a87c",
  bgColor: "#fdf8fb",
  surfaceColor: "#ffffff",
  textColor: "#1e1a1d",
  mutedColor: "#7a6275",
  fontDisplay: "Playfair Display",
  fontBody: "Inter",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap",

  services: [
    {
      id: "harmonizacao",
      name: "Harmonização Facial",
      description:
        "Equilíbrio natural entre os traços do rosto com técnicas minimamente invasivas.",
      emoji: "✨",
      qualifierPreselect: "Harmonização facial",
    },
    {
      id: "botox",
      name: "Botox",
      description:
        "Suavização de linhas de expressão com resultado natural e duradouro.",
      emoji: "💉",
      qualifierPreselect: "Botox",
    },
    {
      id: "preenchimento",
      name: "Preenchimento",
      description:
        "Volume e contorno precisos para lábios, maçãs do rosto e outras áreas.",
      emoji: "💋",
      qualifierPreselect: "Preenchimento",
    },
    {
      id: "bioestimulador",
      name: "Bioestimulador",
      description:
        "Estimula a produção natural de colágeno para pele mais firme e jovem.",
      emoji: "🌿",
      qualifierPreselect: "Bioestimulador",
    },
    {
      id: "limpeza",
      name: "Limpeza de Pele",
      description:
        "Limpeza profunda e hidratação para pele saudável e radiante.",
      emoji: "🫧",
      qualifierPreselect: "Limpeza de pele",
    },
  ],

  howItWorks: [
    {
      step: "1",
      title: "Você clica em 'Falar no WhatsApp'",
      description:
        "Aparece uma tela rápida com 3 perguntinhas — sem digitar nada, só tocar.",
    },
    {
      step: "2",
      title: "Você responde em menos de 30 segundos",
      description:
        "Qual procedimento, quando pretende fazer e qual investimento está planejando.",
    },
    {
      step: "3",
      title: "A mensagem chega pronta para você",
      description:
        "O WhatsApp abre com tudo preenchido. Você já sabe o interesse e o perfil do cliente antes de responder.",
    },
  ],

  faqs: [
    {
      q: "Quais procedimentos a Clínica Aurora oferece?",
      a: "Realizamos harmonização facial, botox, preenchimento, bioestimuladores e limpeza de pele. Todos os procedimentos são realizados por profissionais certificados e com materiais de primeira linha.",
    },
    {
      q: "Os procedimentos são seguros?",
      a: "Sim. Usamos apenas produtos com registro na ANVISA e seguimos rigorosos protocolos de biossegurança. Cada sessão inclui avaliação individual antes do procedimento.",
    },
    {
      q: "Quanto tempo dura o resultado?",
      a: "Depende do procedimento: botox dura de 4 a 6 meses, preenchimentos de 1 a 2 anos, e bioestimuladores têm resultados progressivos por até 2 anos.",
    },
    {
      q: "Preciso agendar consulta antes?",
      a: "Sim, fazemos uma avaliação prévia gratuita para indicar o melhor tratamento para o seu caso. Entre em contato pelo WhatsApp para agendar.",
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Aceitamos PIX, cartão de crédito em até 12x e dinheiro. Consulte as condições no momento do agendamento.",
    },
  ],

  qualifier: {
    steps: [
      {
        id: "name",
        type: "text",
        label: "Qual é o seu primeiro nome?",
        placeholder: "Ex: Ana",
      },
      {
        id: "service",
        type: "choice",
        label: "O que você quer fazer?",
        options: [
          "Harmonização facial",
          "Botox",
          "Preenchimento",
          "Bioestimulador",
          "Limpeza de pele",
          "Outro",
        ],
      },
      {
        id: "timing",
        type: "choice",
        label: "Quando pretende fazer?",
        options: [
          "Esta semana",
          "Este mês",
          "Nos próximos 3 meses",
          "Só pesquisando",
        ],
      },
      {
        id: "budget",
        type: "choice",
        label: "Quanto pretende investir?",
        options: [
          "Até R$500",
          "R$500–1.500",
          "R$1.500–3.000",
          "Acima de R$3.000",
        ],
      },
    ],
    messageTemplate:
      "Olá! Sou {name}.\nInteresse: {service}\nQuando: {timing}\nInvestimento: {budget}\n(Vim pelo site)",
    lowFitAnswers: ["Só pesquisando", "Até R$500"],
    lowFitMode: "tag",
    timingLabel: "Quando",
  },

  tier: 3,
  features: {
    qualifier: true,
    chatbot: true,
    multiPage: true,
    serviceFilter: true,
    lowFitMode: "tag",
  },

  privacyPolicyExtra:
    "Este site utiliza um assistente virtual (chatbot) que pode coletar perguntas e interações para fins de atendimento. As conversas são processadas por um serviço externo e não são armazenadas após o atendimento.",

  metaTitle: "Clínica Aurora Estética — Site Demonstrativo",
  metaDescription:
    "Demonstração Vitrine72: como só clientes qualificados chegam ao WhatsApp da sua clínica estética.",
};

export default estetica;
