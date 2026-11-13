import type { NicheConfig } from "../lib/niche";

const planejados: NicheConfig = {
  niche: "planejados",
  brandName: "Atelier Madeira",
  tagline: "Arquitetura de interiores sob medida",
  heroHeadline: "Precisão milimétrica. Materiais que duram décadas.",
  heroSubheadline:
    "Projetos desenvolvidos com engenharia alemã e sensibilidade brasileira. Do croqui à instalação — sem intermediários.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=1600&q=85",
  heroImageAlt: "Cozinha planejada de alto padrão",
  whatsappNumber: "5511953542831",

  primaryColor: "#c9a96e",
  primaryLight: "#2a2420",
  primaryDark: "#a07c40",
  accentColor: "#c9a96e",
  bgColor: "#111110",
  surfaceColor: "#1c1a18",
  textColor: "#f0ece4",
  mutedColor: "#7a7068",

  fontDisplay: "Space Grotesk",
  fontBody: "DM Sans",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap",

  heroVariant: "dark-fullscreen",
  servicesLayout: "photo-grid",

  services: [
    {
      id: "cozinha",
      name: "Cozinha",
      description:
        "Bancadas em Silestone, ferragens Blum e MDF naval. Cada módulo dimensionado ao milímetro do seu imóvel.",
      imageUrl:
        "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Cozinha planejada alto padrão",
      qualifierPreselect: "Cozinha",
    },
    {
      id: "closet",
      name: "Closet & Dormitório",
      description:
        "Walk-in closets com iluminação integrada, cabideiros motorizados e gavetas com amortecimento soft-close.",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Closet planejado de alto padrão",
      qualifierPreselect: "Closet/Dormitório",
    },
    {
      id: "sala",
      name: "Living & Estar",
      description:
        "Painéis ripados, estantes embutidas e racks com passagem de cabos invisível. Arquitetura que organiza.",
      imageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Living planejado moderno",
      qualifierPreselect: "Sala/Living",
    },
    {
      id: "home-office",
      name: "Home Office",
      description:
        "Estações de trabalho ergonômicas com gestão de cabos, prateleiras estruturais e painéis acústicos embutidos.",
      imageUrl:
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Home office planejado",
      qualifierPreselect: "Home Office",
    },
    {
      id: "projeto-completo",
      name: "Projeto Completo",
      description:
        "Todos os ambientes com identidade de materiais unificada. Um único projeto, um único interlocutor.",
      imageUrl:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Projeto completo de interiores",
      qualifierPreselect: "Projeto completo",
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
    "Este site utiliza um assistente virtual (chatbot) para atendimento. As mensagens e as fotos enviadas no chat são processadas por serviço externo, incluindo análise automatizada de imagens por inteligência artificial, e o histórico da conversa fica registrado para dar continuidade ao atendimento. Não envie dados de saúde sensíveis pelo chat.",

  metaTitle: "Atelier Madeira Planejados — Site Demonstrativo | Vitrine72",
  metaDescription:
    "Demonstração Vitrine72: site profissional para móveis planejados com qualificação automática de clientes no WhatsApp.",
};

export default planejados;
