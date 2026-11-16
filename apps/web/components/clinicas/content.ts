import { CLINIC_OFFER, clinicFoundingLeft } from "@vitrine72/core";
import { brl, whatsappUrl } from "@/components/home/content";

/**
 * Copy and data for /clinicas, the aesthetic-clinic offer page.
 * Source: "Vitrine72: Aesthetic Clinic Offer Playbook". Every price, count
 * and date comes from CLINIC_OFFER in @vitrine72/core.
 *
 * Copy rules from the playbook: the product is booked evaluations from the
 * clinic's existing attention, so the page never sells "um site"; no revenue
 * or closed-case promises; no case studies until real ones exist.
 */

const o = CLINIC_OFFER;
const foundingLeft = clinicFoundingLeft();
const isFounding = foundingLeft > 0;

/** True through the seasonal end date (Brazil time), when the lead angle is the end-of-year campaign. */
export function isSeasonal(now = new Date()): boolean {
  const end = new Date(`${o.seasonalAngleUntil}T23:59:59-03:00`);
  return now <= end;
}

const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00-03:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", timeZone: "America/Sao_Paulo" });

export const whatsapp = {
  main: whatsappUrl("Olá! Vi a oferta da Vitrini72 para clínicas de estética e quero ver como ficaria na minha clínica."),
  guarantee: whatsappUrl("Olá! Vi a oferta da Vitrini72 para clínicas de estética e quero entender a garantia para a minha clínica."),
};

export const price = {
  current: isFounding ? o.priceFounding : o.priceFull,
  full: o.priceFull,
  isFounding,
  foundingLeft,
  foundingSpots: o.foundingSpots,
  label: brl,
};

export function hero(seasonal: boolean) {
  return {
    kicker: seasonal ? `Clínicas de estética · Campanha de fim de ano` : "Clínicas de estética",
    title: seasonal
      ? `Sua campanha de fim de ano no ar em ${o.deliveryHours} horas.`
      : "Mais pedidos de avaliação com o público que a clínica já tem.",
    lead: seasonal
      ? "E mais pedidos de avaliação para o seu procedimento principal, vindos de quem já segue a clínica no Instagram e a encontra no Google. Tudo contado."
      : `Uma página para o seu procedimento principal no ar em ${o.deliveryHours} horas, alimentada pelo Instagram e pelo Google da clínica. Tudo contado.`,
    seasonNote: seasonal
      ? `A Black Friday é em ${fmtDate(o.blackFriday)} e a procura de verão vem logo depois.`
      : null,
    cta: "Ver como fica na minha clínica",
    secondary: "Como funciona a garantia",
  };
}

export const gap = {
  kicker: "Antes de tudo, dois números",
  title: "A clínica já é vista. A maioria de quem vê não chega a pedir avaliação.",
  steps: [
    "Abra o Instagram da clínica: Painel profissional → Visitas ao perfil, últimos 30 dias.",
    "Conte quantos pedidos de avaliação chegaram no mesmo período, por qualquer canal.",
  ],
  lead: "A diferença entre os dois números é o que trabalhamos. Se o Google traz mais gente que o Instagram, use as visualizações do perfil na aba Desempenho do Google.",
  calculator: {
    viewsLabel: "Visitas ao perfil no Instagram ou visualizações no Google, últimos 30 dias (o maior dos dois)",
    requestsLabel: "Pedidos de avaliação no mesmo período",
    privacy: "Nada do que você digita aqui sai do seu navegador.",
  },
};

export const included = {
  kicker: "O que a clínica recebe",
  title: "Um pacote. Tudo apontando para o mesmo lugar.",
  items: [
    {
      title: "Página da campanha",
      body: "Uma página para a campanha de fim de ano ou para o procedimento principal (toxina e preenchimento primeiro; laser ou corporal se for o carro-chefe). O botão de WhatsApp faz 2 ou 3 perguntas antes e já envia as respostas na mensagem. Ela substitui o link da bio.",
    },
    {
      title: "Bio e destaques do Instagram",
      body: "Reescritos para levar quem visita o perfil até a página.",
    },
    {
      title: "Perfil do Google refeito",
      body: "Fotos, serviços, WhatsApp e link de agendamento, tudo apontando para a página.",
    },
    {
      title: `Atendente virtual na página, ${o.includedDays} dias`,
      body: "Responde dúvidas e envia o link de agendamento a qualquer hora. Funciona só na página, nunca no WhatsApp da clínica.",
    },
    {
      title: "Um link rastreado por canal",
      body: "Instagram, Google e a página que a clínica já tiver: cada pedido chega identificado com a origem.",
    },
    {
      title: `Contagem semanal, ${o.includedDays} dias`,
      body: "Uma página com os pedidos de avaliação por origem, atualizada toda semana.",
    },
  ],
  bonusTitle: "Junto, sem custo extra",
  bonuses: [
    "Roteiro da recepção para transformar um pedido em avaliação agendada.",
    "Kit de mensagens para quem pediu informação e sumiu.",
    "Cartão com QR code para pedir avaliação no Google.",
  ],
  notNeededTitle: "O que a clínica não precisa fazer",
  notNeeded: [
    "Passar dados de pacientes.",
    "Dar acesso ao WhatsApp.",
    "Mudar o jeito que a recepção trabalha.",
  ],
};

export const timeline = {
  kicker: "Como funciona",
  title: "Do sim ao primeiro relatório.",
  steps: [
    { mark: "Ligação", title: "Seus números, na conversa", body: "Você lê as visitas ao perfil e os pedidos do último mês. É com eles que definimos a meta da garantia." },
    { mark: `${o.deliveryHours} h`, title: "Tudo no ar", body: "Página da campanha publicada, bio e perfil do Google refeitos, atendente treinado na sua clínica e links rastreados no lugar." },
    { mark: `Dias ${o.reportDays.slice(0, -1).join(", ")}`, title: "Contagem semanal", body: "Pedidos por origem toda semana. Se estiver abaixo do ritmo no dia 14, ajustamos ali, não no dia 30." },
    { mark: `Dia ${o.guaranteeDays}`, title: "Resultado contra a meta", body: "Conferimos a contagem contra o número combinado, com os prints do primeiro e do trigésimo dia." },
    { mark: `Dia ${o.includedDays}`, title: "Fim do período incluído", body: "Atendente e contagem seguem até aqui. Renovar é opcional e só é oferecido depois que você viu os números." },
  ],
};

export const guarantee = {
  kicker: "Garantia",
  title: `Se em ${o.guaranteeDays} dias o sistema não entregar os pedidos de avaliação combinados, a gente continua trabalhando de graça até entregar.`,
  tiersTitle: "Como a meta é definida",
  tiersLead: "Na ligação, você lê dois números: visitas ao perfil no Instagram e visualizações do perfil no Google, últimos 30 dias. O maior dos dois escolhe a linha.",
  belowMin: `Os dois abaixo de ${o.guaranteeMinViews.toLocaleString("pt-BR")}`,
  belowMinResult: "Sem garantia. Avisamos na ligação, antes de qualquer pagamento.",
  countsTitle: "O que conta como um pedido",
  counts: [
    "Uma conversa de WhatsApp iniciada pelo botão com perguntas da página.",
    "Um link de agendamento enviado pelo atendente a quem pediu para marcar.",
  ],
  countsNote: "Os dois são registrados pelo sistema. A contagem não depende de a recepção anotar nada.",
  clinicTitle: "A parte da clínica (só acessos)",
  clinic: [
    "Acesso de gerente ao perfil do Google em até 48 horas.",
    "Fotos enviadas e página aprovada em até 48 horas depois de recebida.",
    "Link rastreado colocado na bio do Instagram.",
    "Número de WhatsApp da clínica ativo.",
  ],
  clock: `Os ${o.guaranteeDays} dias contam a partir da página no ar e dos perfis atualizados. Se algum dos quatro itens atrasar, o prazo espera.`,
  excludesTitle: "O que a garantia não cobre",
  excludes: [
    "Comparecimento, fechamento e faturamento. Isso depende da recepção e do profissional.",
    "Devolução do valor pago. A compensação é o trabalho gratuito até chegar à meta.",
  ],
};

export const pricing = {
  kicker: "Preço",
  title: "Um pacote, um pagamento.",
  lead: `Tudo o que está acima, por ${o.includedDays} dias. Pagamento por PIX depois da ligação, com contrato.`,
  foundingNote: `Preço de lançamento para as ${o.foundingSpots} primeiras clínicas. Em troca, os resultados da clínica viram um caso publicado.`,
  fullNote: `A partir da ${o.foundingSpots + 1}ª clínica.`,
  compare: "Compare com o valor de um único procedimento da sua clínica.",
  cta: "Falar sobre a minha clínica",
};

export const rules = {
  kicker: "Regras",
  title: "O que fica de fora, de propósito.",
  items: [
    { title: "Preço e antes e depois", body: "Só aparecem na página se a clínica confirmar que o conselho da sua profissão permite." },
    { title: "Dados de pacientes", body: "Não pedimos e não guardamos. A contagem registra o pedido, não o histórico de ninguém." },
    { title: "WhatsApp da clínica", body: "Continua só com a clínica. O atendente funciona na página." },
    { title: "Promessas", body: "Não prometemos faturamento nem pacientes fechados. Prometemos o que controlamos: pedidos de avaliação contados." },
  ],
};

export const faq = {
  kicker: "Dúvidas",
  title: "Perguntas que as clínicas fazem.",
  items: [
    {
      q: "A clínica já tem uma página na internet. Ainda faz sentido?",
      a: "Faz. O trabalho não é ter uma página: é fazer quem já vê a clínica no Instagram e no Google pedir avaliação, e contar cada pedido por origem. A página que a clínica já tem pode continuar no ar e ganha o seu próprio link rastreado.",
    },
    {
      q: "Recebi uma prévia com o nome da minha clínica. O que é isso?",
      a: "Um rascunho montado a partir do perfil público da clínica no Google, para você ver como ficaria. Ele não aparece em buscas e apagamos no mesmo dia se você pedir.",
    },
    {
      q: "Vocês vão acessar o WhatsApp ou dados de pacientes?",
      a: "Não. Pedimos só acesso de gerente ao perfil do Google e que o link rastreado fique na bio do Instagram.",
    },
    {
      q: "E se não chegar à meta em 30 dias?",
      a: "Seguimos ajustando a página e os perfis sem custo até a contagem chegar ao número combinado na ligação.",
    },
    {
      q: "Vocês garantem pacientes ou faturamento?",
      a: "Não. O fechamento depende da recepção e do profissional. Garantimos pedidos de avaliação, que é o que o sistema controla e registra.",
    },
    {
      q: `O que acontece depois dos ${o.includedDays} dias?`,
      a: `A página e os perfis continuam da clínica. O atendente e a contagem podem ser renovados; a renovação é oferecida na conversa do dia ${o.guaranteeDays}, depois que você viu os números.`,
    },
  ],
};

export const finalCta = {
  title: "Veja como fica na sua clínica antes de decidir.",
  body: "Mande uma mensagem. Montamos a prévia com o perfil público da clínica e conversamos com os seus números na tela.",
  cta: "Ver como fica na minha clínica",
};
