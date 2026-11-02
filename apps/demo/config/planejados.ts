import type { NicheConfig } from "../lib/niche";

const planejados: NicheConfig = {
  niche: "planejados",
  brandName: "Atelier Madeira Planejados",
  tagline: "Móveis sob medida que transformam seu espaço",
  heroHeadline: "Só clientes certos chegam até você — no WhatsApp",
  heroSubheadline:
    "O Atelier Madeira filtra quem está pesquisando de quem está pronto para investir. Você recebe a mensagem com ambiente, situação e orçamento já informados.",
  whatsappNumber: "5511953542831",
  primaryColor: "#8b5e3c",
  primaryLight: "#d4b896",
  primaryDark: "#5c3b21",
  accentColor: "#c4a35a",
  bgColor: "#faf7f4",
  surfaceColor: "#ffffff",
  textColor: "#1c1713",
  mutedColor: "#7a6652",
  fontDisplay: "Playfair Display",
  fontBody: "Inter",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap",

  services: [
    {
      id: "cozinha",
      name: "Cozinha",
      description:
        "Projetos completos de cozinha planejada com aproveitamento máximo do espaço.",
      emoji: "🍳",
      qualifierPreselect: "Cozinha",
    },
    {
      id: "quarto",
      name: "Quarto / Closet",
      description:
        "Guarda-roupas e closets sob medida para cada centímetro do seu quarto.",
      emoji: "🛏️",
      qualifierPreselect: "Quarto/Closet",
    },
    {
      id: "banheiro",
      name: "Banheiro",
      description:
        "Gabinetes e nichos planejados para banheiros funcionais e elegantes.",
      emoji: "🚿",
      qualifierPreselect: "Banheiro",
    },
    {
      id: "sala",
      name: "Sala de Estar / TV",
      description:
        "Painéis, estantes e racks que valorizam o ambiente e organizam o espaço.",
      emoji: "🛋️",
      qualifierPreselect: "Sala",
    },
    {
      id: "casa-inteira",
      name: "Casa Inteira",
      description:
        "Projeto integrado de todos os ambientes com identidade visual única.",
      emoji: "🏠",
      qualifierPreselect: "Casa inteira",
    },
  ],

  howItWorks: [
    {
      step: "1",
      title: "Você clica em 'Falar no WhatsApp'",
      description:
        "Abre uma tela com 3 perguntas rápidas — basta tocar nas respostas, sem digitar.",
    },
    {
      step: "2",
      title: "Você responde em menos de 30 segundos",
      description:
        "Qual ambiente, situação do imóvel e faixa de investimento que está planejando.",
    },
    {
      step: "3",
      title: "A mensagem chega pronta para você",
      description:
        "O WhatsApp abre com tudo preenchido. Você já sabe o projeto e o orçamento antes de responder.",
    },
  ],

  faqs: [
    {
      q: "Quais ambientes o Atelier Madeira atende?",
      a: "Fazemos projetos completos de cozinha, quarto/closet, banheiro, sala de estar e projetos para a casa inteira. Cada peça é fabricada sob medida para o seu espaço.",
    },
    {
      q: "Qual o prazo médio de entrega e instalação?",
      a: "O prazo varia conforme o projeto. Em média, cozinhas e quartos levam de 30 a 45 dias após a medição e aprovação do projeto. Informamos o prazo exato na proposta.",
    },
    {
      q: "Vocês fazem a medição e o projeto gratuitamente?",
      a: "Sim, a visita técnica e o projeto 3D são incluídos no processo. Entre em contato pelo WhatsApp para agendar.",
    },
    {
      q: "Atendem imóveis na planta?",
      a: "Sim! Pode iniciar o projeto com a planta do imóvel e ajustamos as medições finais quando você receber as chaves.",
    },
    {
      q: "Quais materiais são utilizados?",
      a: "Trabalhamos com MDF de alta qualidade, ferragens importadas e acabamentos em laminados, lacas e pinturas. Apresentamos as opções na visita de projeto.",
    },
  ],

  qualifier: {
    steps: [
      {
        id: "name",
        type: "text",
        label: "Qual é o seu primeiro nome?",
        placeholder: "Ex: Carlos",
      },
      {
        id: "service",
        type: "choice",
        label: "Qual ambiente?",
        options: [
          "Cozinha",
          "Quarto/Closet",
          "Banheiro",
          "Sala",
          "Casa inteira",
          "Outro",
        ],
      },
      {
        id: "timing",
        type: "choice",
        label: "Situação do imóvel?",
        options: [
          "Na planta",
          "Recebendo as chaves",
          "Em reforma",
          "Já moro",
        ],
      },
      {
        id: "budget",
        type: "choice",
        label: "Quanto pretende investir?",
        options: [
          "Até R$15 mil",
          "R$15–30 mil",
          "R$30–60 mil",
          "Acima de R$60 mil",
        ],
      },
    ],
    messageTemplate:
      "Olá! Sou {name}.\nInteresse: {service}\nSituação do imóvel: {timing}\nInvestimento: {budget}\n(Vim pelo site)",
    lowFitAnswers: ["Até R$15 mil"],
    lowFitMode: "tag",
    timingLabel: "Situação do imóvel",
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

  metaTitle: "Atelier Madeira Planejados — Site Demonstrativo",
  metaDescription:
    "Demonstração Vitrine72: como só clientes qualificados chegam ao WhatsApp da sua empresa de móveis planejados.",
};

export default planejados;
