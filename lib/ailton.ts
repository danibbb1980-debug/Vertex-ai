/**
 * Landing page de Ailton D’Avila — Personal Trainer.
 *
 * Todo dado de negócio e todo texto da página vivem aqui. Regra deste
 * arquivo: só entra o que foi fornecido pelo profissional ou é verificável
 * publicamente. Nada de certificações, anos de experiência, preços, planos,
 * horários ou modalidades que não tenham sido confirmados — quando a
 * informação não existe, a página convida a perguntar no WhatsApp.
 */

export const ailton = {
  name: "Ailton D’Avila",
  role: "Personal Trainer",
  city: "Poços de Caldas",
  state: "MG",
  path: "/ailton-davila",

  phone: {
    /** Formato internacional, só dígitos — destino de wa.me e tel:. */
    e164: "5535988186010",
    display: "(35) 98818-6010",
  },

  address: {
    street: "Rua Rio Grande do Norte, 381",
    district: "Centro",
    city: "Poços de Caldas",
    state: "MG",
    postalCode: "37701-040",
  },

  google: {
    rating: 5,
    reviewCount: 37,
    mapsUrl: "https://maps.app.goo.gl/GaAmbvSTsynTXE8Y7",
  },
} as const;

/** Endereço em uma linha, idêntico em toda a página (consistência NAP). */
export const addressLine = `${ailton.address.street} — ${ailton.address.district}, ${ailton.address.city} — ${ailton.address.state}`;

/**
 * Mensagens pré-preenchidas, uma por contexto. Cada CTA abre a conversa já
 * dizendo de onde a pessoa veio — o Ailton sabe o que responder, e o visitante
 * não trava no "o que eu escrevo?".
 */
export const messages = {
  hero: "Olá, Ailton! Conheci seu trabalho pelo site e gostaria de saber como funciona seu acompanhamento como personal trainer.",
  process:
    "Olá, Ailton! Vi no site como funciona o acompanhamento e gostaria de conversar sobre os meus objetivos.",
  conversion:
    "Olá, Ailton! Vi seu site e quero saber mais sobre o acompanhamento como personal trainer. Podemos conversar?",
  pricing:
    "Olá, Ailton! Vi seu site e gostaria de saber os valores e as opções de acompanhamento disponíveis.",
  faq: "Olá, Ailton! Vi seu site e tenho uma dúvida sobre o acompanhamento.",
  final: "Olá, Ailton! Vim pelo site e quero saber como começar o acompanhamento.",
  floating:
    "Olá, Ailton! Vim pelo site e gostaria de tirar algumas dúvidas sobre o acompanhamento como personal trainer.",
} as const;

export type MessageKey = keyof typeof messages;

/** https://wa.me/5535988186010?text=… com a mensagem codificada para URL. */
export function waLink(key: MessageKey): string {
  return `https://wa.me/${ailton.phone.e164}?text=${encodeURIComponent(messages[key])}`;
}

export const telLink = `tel:+${ailton.phone.e164}`;

/** Avaliação no formato brasileiro: 5 → "5,0". */
export const ratingLabel = ailton.google.rating.toFixed(1).replace(".", ",");

export const nav = [
  { href: "#acompanhamento", label: "Acompanhamento" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;

export const benefits = [
  {
    n: "01",
    title: "Orientação de verdade",
    text: "Tenha orientação durante os exercícios, com atenção à execução e aos detalhes que fazem parte de um treino bem conduzido.",
  },
  {
    n: "02",
    title: "Treino alinhado aos seus objetivos",
    text: "Entenda como organizar seu treinamento de acordo com suas metas, seu nível atual e sua rotina.",
  },
  {
    n: "03",
    title: "Mais segurança e confiança",
    text: "Conte com acompanhamento profissional para esclarecer dúvidas e executar os movimentos com mais consciência.",
  },
  {
    n: "04",
    title: "Motivação para continuar",
    text: "Construa consistência com orientação, incentivo e um acompanhamento que ajude você a manter o foco.",
  },
] as const;

export const steps = [
  {
    n: "1",
    title: "Conversa",
    text: "Você compartilha seus objetivos, suas dúvidas e sua rotina.",
  },
  {
    n: "2",
    title: "Direcionamento",
    text: "O acompanhamento é alinhado às suas necessidades e ao que faz sentido para seu momento.",
  },
  {
    n: "3",
    title: "Evolução",
    text: "Você trabalha de forma consistente, com orientação e ajustes adequados ao longo do processo.",
  },
] as const;

/**
 * Avaliações públicas do Google, com o texto original preservado.
 * Não adicione nenhuma avaliação que não esteja publicada no perfil.
 */
export const reviews = [
  {
    author: "Altieres Lopes",
    text: "Manja muito, super solícito e gente boa. Está sempre atento aos detalhes e nos motivando a progredir.",
  },
  {
    author: "Thiago Morais Nogueira",
    text: "Quem conhece sabe o excelente profissional que é! Todos os clientes elogiam muito",
  },
  {
    author: "Guilherme Machado",
    text: "Ótimo profissional",
  },
] as const;

/**
 * O que os clientes mais destacam nas avaliações — temas recorrentes,
 * não citações.
 */
export const highlights = [
  "Experiência e competência",
  "Atenção aos detalhes",
  "Acompanhamento individualizado",
  "Dedicação e responsabilidade",
  "Motivação",
  "Boa comunicação",
] as const;

export const faq = [
  {
    q: "Como funciona o acompanhamento com o Ailton?",
    a: "O ponto de partida é uma conversa sobre seus objetivos, sua rotina e o seu momento atual. A partir daí, o Ailton explica como o acompanhamento pode ser conduzido para você. Os detalhes — formato, frequência e horários — são combinados diretamente com ele pelo WhatsApp.",
  },
  {
    q: "Como posso saber qual tipo de treino faz sentido para mim?",
    a: "Você não precisa chegar com essa resposta pronta. Conte o que você busca, sua experiência com treino e qualquer limitação ou dúvida que tenha. Essa conversa é justamente o que ajuda a definir o caminho mais adequado.",
  },
  {
    q: "Onde fica o local de atendimento?",
    a: `O endereço é ${addressLine}. Se tiver qualquer dúvida sobre o local, pergunte pelo WhatsApp.`,
    maps: true,
  },
  {
    q: "Como descubro os valores e os planos disponíveis?",
    a: "Os valores e as opções de acompanhamento são informados diretamente pelo Ailton. Mande uma mensagem pelo WhatsApp e pergunte — assim você recebe as informações atualizadas e pode tirar suas dúvidas na mesma conversa.",
    cta: "pricing" as MessageKey,
  },
  {
    q: "Como faço para começar?",
    a: "Basta chamar o Ailton no WhatsApp e contar o que você busca. Você não precisa decidir nada naquele momento: a primeira conversa serve para entender como funciona e conhecer as opções disponíveis.",
    cta: "final" as MessageKey,
  },
] as const;
