import type { NicheConfig } from "../lib/niche";

const planejados: NicheConfig = {
  niche: "planejados",
  brandName: "Atelier Madeira Planejados",
  tagline: "Móveis sob medida que transformam seu espaço",
  heroHeadline: "Cada centímetro do seu espaço com propósito e elegância",
  heroSubheadline:
    "Projetos de móveis planejados desenvolvidos do zero para o seu imóvel. Do croqui à instalação, cuidamos de tudo.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80",
  heroImageAlt: "Cozinha planejada moderna",
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
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",

  services: [
    {
      id: "cozinha",
      name: "Cozinha",
      description:
        "Projeto completo com aproveitamento máximo, bancadas sob medida e acabamentos que resistem ao uso diário.",
      imageUrl:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Cozinha planejada moderna",
      qualifierPreselect: "Cozinha",
    },
    {
      id: "quarto",
      name: "Quarto / Closet",
      description:
        "Guarda-roupas e closets que aproveitam cada centímetro, com acabamento sofisticado e organização inteligente.",
      imageUrl:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Quarto com guarda-roupa planejado",
      qualifierPreselect: "Quarto/Closet",
    },
    {
      id: "banheiro",
      name: "Banheiro",
      description:
        "Gabinetes, nichos e painéis que transformam banheiros em espaços de bem-estar com funcionalidade e estilo.",
      imageUrl:
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Banheiro com móveis planejados",
      qualifierPreselect: "Banheiro",
    },
    {
      id: "sala",
      name: "Sala de Estar / TV",
      description:
        "Painéis, estantes e racks que valorizam o ambiente principal da casa com personalidade e praticidade.",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Sala de estar com painel planejado",
      qualifierPreselect: "Sala",
    },
    {
      id: "casa-inteira",
      name: "Casa Inteira",
      description:
        "Projeto integrado de todos os ambientes com identidade visual única e fluxo natural entre os espaços.",
      imageUrl:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Casa toda planejada",
      qualifierPreselect: "Casa inteira",
    },
  ],

  howItWorks: [
    {
      step: "1",
      title: "Você clica em Falar no WhatsApp",
      description:
        "Uma tela com 3 perguntas rápidas aparece. Basta tocar nas respostas — sem digitar nada.",
    },
    {
      step: "2",
      title: "Responde em menos de 30 segundos",
      description:
        "Ambiente, situação do imóvel e faixa de investimento. Cada resposta com um toque.",
    },
    {
      step: "3",
      title: "Mensagem chega pronta no WhatsApp",
      description:
        "Você já recebe o perfil do cliente antes de responder. Só quem está pronto para investir chega até você.",
    },
  ],

  faqs: [
    {
      q: "Quais ambientes o Atelier Madeira atende?",
      a: "Fazemos projetos de cozinha, quarto/closet, banheiro, sala de estar e projetos para a casa inteira. Cada peça fabricada sob medida para o seu espaço.",
    },
    {
      q: "Qual o prazo médio de entrega e instalação?",
      a: "Em média de 30 a 45 dias após aprovação do projeto. O prazo exato depende da complexidade e tamanho do projeto, informado na proposta.",
    },
    {
      q: "A visita técnica e o projeto 3D são cobrados?",
      a: "Não. A visita técnica e o projeto 3D são incluídos no processo, sem custo adicional. Entre em contato pelo WhatsApp para agendar.",
    },
    {
      q: "Atendem imóveis na planta ou em construção?",
      a: "Sim. Iniciamos o projeto com a planta do imóvel e ajustamos as medições finais quando você receber as chaves ou concluir a obra.",
    },
    {
      q: "Quais materiais e acabamentos são disponíveis?",
      a: "Trabalhamos com MDF de alta qualidade, ferragens importadas e acabamentos em laminados, lacas e pinturas. Apresentamos todas as opções na visita de projeto.",
    },
  ],

  aboutHeadline: "Projetos que contam histórias",
  aboutText:
    "O Atelier Madeira nasceu da paixão por transformar espaços comuns em ambientes que refletem a personalidade de quem vive neles. Cada projeto é desenvolvido de forma única — porque acreditamos que o seu espaço merece móveis que sejam tão únicos quanto você.",
  aboutImageUrl:
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80",
  aboutImageAlt: "Fabricação de móveis planejados",
  stats: [
    { value: "500+", label: "Projetos entregues" },
    { value: "15 anos", label: "De experiência" },
    { value: "98%", label: "Clientes satisfeitos" },
  ],

  qualifier: {
    steps: [
      { id: "name", type: "text", label: "Qual é o seu primeiro nome?", placeholder: "Ex: Carlos" },
      {
        id: "service",
        type: "choice",
        label: "Qual ambiente?",
        options: ["Cozinha", "Quarto/Closet", "Banheiro", "Sala", "Casa inteira", "Outro"],
      },
      {
        id: "timing",
        type: "choice",
        label: "Situação do imóvel?",
        options: ["Na planta", "Recebendo as chaves", "Em reforma", "Já moro"],
      },
      {
        id: "budget",
        type: "choice",
        label: "Quanto pretende investir?",
        options: ["Até R$15 mil", "R$15–30 mil", "R$30–60 mil", "Acima de R$60 mil"],
      },
    ],
    messageTemplate:
      "Olá! Sou {name}.\nInteresse: {service}\nSituação do imóvel: {timing}\nInvestimento: {budget}\n(Vim pelo site)",
    lowFitAnswers: ["Até R$15 mil"],
    lowFitMode: "tag",
    timingLabel: "Situação do imóvel",
  },

  tier: 3,
  features: { qualifier: true, chatbot: true, multiPage: true, serviceFilter: true, lowFitMode: "tag" },

  chatbotTenantId: "fe1c1d4e-c7f2-4dfb-9c67-6e00bda9135d",

  privacyPolicyExtra:
    "Este site utiliza um assistente virtual (chatbot) para atendimento. As conversas são processadas por serviço externo e não são armazenadas após o atendimento.",

  metaTitle: "Atelier Madeira Planejados — Site Demonstrativo | Vitrine72",
  metaDescription:
    "Demonstração Vitrine72: site profissional para móveis planejados com qualificação automática de clientes no WhatsApp.",
};

export default planejados;
