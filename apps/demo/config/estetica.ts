import type { NicheConfig } from "../lib/niche";

const estetica: NicheConfig = {
  niche: "estetica",
  brandName: "Clínica Aurora Estética",
  tagline: "Beleza com segurança e resultados reais",
  heroHeadline: "Realce sua beleza com quem entende de resultados",
  heroSubheadline:
    "Procedimentos faciais personalizados, aplicados por profissionais certificados. Agende agora e descubra o tratamento ideal para você.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=80",
  heroImageAlt: "Procedimento estético facial",
  whatsappNumber: "5511953542831",

  primaryColor: "#c97ea2",
  primaryLight: "#f3d6e8",
  primaryDark: "#8a4870",
  accentColor: "#c4a35a",
  bgColor: "#fdf8fb",
  surfaceColor: "#ffffff",
  textColor: "#1e1a1d",
  mutedColor: "#7a6275",

  fontDisplay: "Playfair Display",
  fontBody: "Inter",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",

  services: [
    {
      id: "harmonizacao",
      name: "Harmonização Facial",
      description:
        "Equilíbrio natural entre os traços do rosto com técnicas minimamente invasivas, resultado sutil e elegante.",
      imageUrl:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Harmonização facial",
      qualifierPreselect: "Harmonização facial",
    },
    {
      id: "botox",
      name: "Botox",
      description:
        "Suavização de linhas de expressão com resultado natural. Procedimento rápido, sem tempo de recuperação.",
      imageUrl:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Aplicação de botox",
      qualifierPreselect: "Botox",
    },
    {
      id: "preenchimento",
      name: "Preenchimento",
      description:
        "Volume e contorno precisos para lábios, maçãs do rosto e olheiras. Ácido hialurônico de alta qualidade.",
      imageUrl:
        "https://images.unsplash.com/photo-1588776814546-1ffbb071f7d2?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Preenchimento labial",
      qualifierPreselect: "Preenchimento",
    },
    {
      id: "bioestimulador",
      name: "Bioestimulador",
      description:
        "Estimula a produção natural de colágeno para pele mais firme, com resultados progressivos por até 2 anos.",
      imageUrl:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Tratamento com bioestimulador",
      qualifierPreselect: "Bioestimulador",
    },
    {
      id: "limpeza",
      name: "Limpeza de Pele",
      description:
        "Limpeza profunda, extração e hidratação profissional. Pele renovada, sem impurezas e com viço.",
      imageUrl:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      imageAlt: "Limpeza de pele profissional",
      qualifierPreselect: "Limpeza de pele",
    },
  ],

  howItWorks: [
    {
      step: "1",
      title: "Você clica em Falar no WhatsApp",
      description:
        "Uma tela rápida aparece com 3 perguntas simples. Só tocar — não precisa digitar nada.",
    },
    {
      step: "2",
      title: "Responde em menos de 30 segundos",
      description:
        "Procedimento desejado, quando pretende fazer e faixa de investimento. Tudo com um toque.",
    },
    {
      step: "3",
      title: "Mensagem chega pronta no WhatsApp",
      description:
        "Você já recebe o perfil completo do cliente antes de responder. Só clientes qualificados chegam até você.",
    },
  ],

  faqs: [
    {
      q: "Quais procedimentos a Clínica Aurora oferece?",
      a: "Realizamos harmonização facial, botox, preenchimento, bioestimuladores e limpeza de pele. Todos aplicados por profissionais certificados com materiais registrados na ANVISA.",
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
      q: "Preciso agendar uma avaliação antes?",
      a: "Sim, realizamos uma avaliação prévia gratuita para indicar o tratamento mais adequado. Entre em contato pelo WhatsApp e agendaremos sua visita.",
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Aceitamos PIX, cartão de crédito em até 12x e dinheiro. Consulte condições especiais no momento do agendamento.",
    },
  ],

  aboutHeadline: "Cuidado especializado, resultado natural",
  aboutText:
    "A Clínica Aurora nasceu da missão de oferecer procedimentos estéticos seguros, personalizados e com resultados que realçam a beleza natural de cada pessoa. Nossa equipe combina técnica apurada com escuta ativa — porque entendemos que cada rosto conta uma história única.",
  aboutImageUrl:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  aboutImageAlt: "Clínica Aurora — ambiente",
  stats: [
    { value: "1.500+", label: "Pacientes atendidas" },
    { value: "8 anos", label: "De experiência" },
    { value: "100%", label: "Produtos ANVISA" },
  ],

  qualifier: {
    steps: [
      { id: "name", type: "text", label: "Qual é o seu primeiro nome?", placeholder: "Ex: Ana" },
      {
        id: "service",
        type: "choice",
        label: "O que você quer fazer?",
        options: ["Harmonização facial", "Botox", "Preenchimento", "Bioestimulador", "Limpeza de pele", "Outro"],
      },
      {
        id: "timing",
        type: "choice",
        label: "Quando pretende fazer?",
        options: ["Esta semana", "Este mês", "Nos próximos 3 meses", "Só pesquisando"],
      },
      {
        id: "budget",
        type: "choice",
        label: "Quanto pretende investir?",
        options: ["Até R$500", "R$500–1.500", "R$1.500–3.000", "Acima de R$3.000"],
      },
    ],
    messageTemplate:
      "Olá! Sou {name}.\nInteresse: {service}\nQuando: {timing}\nInvestimento: {budget}\n(Vim pelo site)",
    lowFitAnswers: ["Só pesquisando", "Até R$500"],
    lowFitMode: "tag",
    timingLabel: "Quando",
  },

  tier: 3,
  features: { qualifier: true, chatbot: true, multiPage: true, serviceFilter: true, lowFitMode: "tag" },

  chatbotTenantId: "1e5ed8ef-4637-4756-be54-2c2a860f6498",

  privacyPolicyExtra:
    "Este site utiliza um assistente virtual (chatbot) para atendimento. As conversas são processadas por serviço externo e não são armazenadas após o atendimento.",

  metaTitle: "Clínica Aurora Estética — Site Demonstrativo | Vitrine72",
  metaDescription:
    "Demonstração Vitrine72: site profissional para clínicas estéticas com qualificação automática de clientes no WhatsApp.",
};

export default estetica;
