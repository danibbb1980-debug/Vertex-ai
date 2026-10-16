/**
 * Fonte única de verdade do site.
 *
 * Endereço, telefone, horários, aulas, links e mensagens de WhatsApp vivem
 * apenas aqui. Os componentes leem deste módulo: mudar um horário neste
 * arquivo atualiza a página, o rodapé, o FAQ e o JSON-LD de uma vez.
 *
 * Regra: só entra aqui informação confirmada pela academia. Nada de preço,
 * plano, promoção ou serviço que não tenha sido informado.
 */

/**
 * URL pública do site, em ordem de preferência:
 *   1. NEXT_PUBLIC_SITE_URL — domínio oficial, quando existir
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injetada automaticamente pela Vercel
 *   3. localhost, no desenvolvimento
 * Nenhum domínio é inventado: um canonical apontando para um domínio que a
 * academia não possui seria pior do que nenhum.
 */
function resolveUrl(): { url: string; isOfficial: boolean } {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return { url: explicit.replace(/\/$/, ""), isOfficial: true };

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return { url: `https://${vercel}`, isOfficial: false };

  return { url: "http://localhost:3000", isOfficial: false };
}

const resolved = resolveUrl();

export const site = {
  name: "VIP Shape Academia",
  shortName: "VIP Shape",
  tagline: "Sua melhor versão começa aqui.",
  url: resolved.url,
  /** Só é true quando o domínio oficial foi configurado (habilita o canonical). */
  hasOfficialDomain: resolved.isOfficial,
  city: "Poços de Caldas",
  state: "MG",

  address: {
    street: "Avenida Dr. Rowilson Flora Filho, 535",
    district: "Residencial Tiradentes",
    city: "Poços de Caldas",
    state: "MG",
    postalCode: "37713-552",
    country: "BR",
  },

  phone: {
    display: "(35) 99158-3270",
    /** Formato E.164, para tel: e dados estruturados. */
    e164: "+5535991583270",
    /** Só dígitos, para wa.me. */
    whatsapp: "5535991583270",
  },

  links: {
    instagram: "https://www.instagram.com/vipshapeacademia/",
    instagramHandle: "@vipshapeacademia",
    maps: "https://maps.app.goo.gl/gu2RmVZTMJVn1Ug49",
  },

  /**
   * Nota e total de avaliações no Google. Não são lidos de uma integração:
   * atualize aqui quando mudarem.
   */
  rating: {
    value: "5,0",
    count: 70,
  },

  /**
   * Rascunho para avaliação do cliente: liga a faixa no topo e o noindex.
   * Mude para false somente quando o site for aprovado.
   */
  rascunho: true,
} as const;

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}, CEP ${site.address.postalCode}`;

/* ------------------------------------------------------------------ */
/* Horário de funcionamento                                            */
/* ------------------------------------------------------------------ */

export type OpeningDay = {
  /** 0 = domingo … 6 = sábado, igual a Date#getDay. */
  weekday: number;
  label: string;
  short: string;
  /** "HH:MM" em 24h, horário de Brasília. null = fechado. */
  opens: string | null;
  closes: string | null;
};

export const openingHours: OpeningDay[] = [
  { weekday: 1, label: "Segunda-feira", short: "Seg", opens: "06:00", closes: "21:30" },
  { weekday: 2, label: "Terça-feira", short: "Ter", opens: "06:00", closes: "21:30" },
  { weekday: 3, label: "Quarta-feira", short: "Qua", opens: "06:00", closes: "21:30" },
  { weekday: 4, label: "Quinta-feira", short: "Qui", opens: "06:00", closes: "21:30" },
  { weekday: 5, label: "Sexta-feira", short: "Sex", opens: "06:00", closes: "21:30" },
  { weekday: 6, label: "Sábado", short: "Sáb", opens: "07:00", closes: "13:00" },
  { weekday: 0, label: "Domingo", short: "Dom", opens: null, closes: null },
];

/** "06:00" → "06h", "21:30" → "21h30". */
export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  return m === "00" ? `${h}h` : `${h}h${m}`;
}

export function formatRange(day: OpeningDay): string {
  if (!day.opens || !day.closes) return "Fechado";
  return `${formatTime(day.opens)} às ${formatTime(day.closes)}`;
}

/** Resumo compacto, para o rodapé e o FAQ. */
export const hoursSummary = [
  { label: "Segunda a sexta", value: "06h às 21h30" },
  { label: "Sábado", value: "07h às 13h" },
  { label: "Domingo", value: "Fechado" },
] as const;

/* ------------------------------------------------------------------ */
/* Modalidades e aulas coletivas                                       */
/* ------------------------------------------------------------------ */

export type ModalityId = "musculacao" | "hit-dance" | "danca" | "jump";

export const modalities: {
  id: ModalityId;
  name: string;
  description: string;
  kind: string;
}[] = [
  {
    id: "musculacao",
    name: "Musculação",
    description: "Treine no seu ritmo e trabalhe em direção aos seus objetivos.",
    kind: "Treino individual",
  },
  {
    id: "hit-dance",
    name: "Hit Dance",
    description: "Movimente o corpo, acompanhe a música e treine com energia.",
    kind: "Aula coletiva",
  },
  {
    id: "danca",
    name: "Dança",
    description: "Uma forma dinâmica e divertida de incluir movimento na sua rotina.",
    kind: "Aula coletiva",
  },
  {
    id: "jump",
    name: "Jump",
    description: "Uma aula coletiva dinâmica com exercícios sobre mini-trampolim.",
    kind: "Aula coletiva",
  },
];

/** Grade divulgada pela academia. Não acrescente aulas sem confirmação. */
export const classSchedule: { day: string; short: string; modality: ModalityId; times: string[] }[] = [
  { day: "Segunda-feira", short: "Seg", modality: "hit-dance", times: ["06h"] },
  { day: "Terça-feira", short: "Ter", modality: "danca", times: ["19h"] },
  { day: "Quarta-feira", short: "Qua", modality: "jump", times: ["06h", "19h"] },
  { day: "Quinta-feira", short: "Qui", modality: "danca", times: ["19h"] },
];

export const modalityName = (id: ModalityId): string =>
  modalities.find((m) => m.id === id)?.name ?? id;

/* ------------------------------------------------------------------ */
/* Navegação                                                           */
/* ------------------------------------------------------------------ */

export const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Estrutura", href: "#estrutura" },
  { label: "Modalidades", href: "#modalidades" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Localização", href: "#localizacao" },
] as const;

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

/**
 * Mensagem inicial por contexto. Todas abrem a conversa com o mesmo número;
 * o texto só ajuda a equipe a entender de onde veio o contato.
 */
export const whatsappMessages = {
  default:
    "Olá! Conheci o site da VIP Shape Academia e gostaria de saber mais sobre planos, matrícula e como começar a treinar.",
  start:
    "Olá! Conheci o site da VIP Shape Academia e quero começar a treinar. Podem me passar informações sobre planos e matrícula?",
  visit:
    "Olá! Vi a estrutura da VIP Shape Academia no site e gostaria de conhecer a academia pessoalmente. Qual o melhor horário para visitar?",
  classes:
    "Olá! Vi no site da VIP Shape Academia a grade de aulas coletivas (Hit Dance, Dança e Jump) e gostaria de saber mais sobre as aulas.",
  partnerships:
    "Olá! Tenho Wellhub ou TotalPass e gostaria de confirmar se o meu plano dá acesso à VIP Shape Academia e em quais condições.",
  plans:
    "Olá! Gostaria de saber os valores dos planos e como funciona a matrícula na VIP Shape Academia.",
} as const;

export type WhatsappContext = keyof typeof whatsappMessages;

export function whatsappUrl(context: WhatsappContext = "default"): string {
  return whatsappUrlWithText(whatsappMessages[context]);
}

export function whatsappUrlWithText(text: string): string {
  return `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* ------------------------------------------------------------------ */
/* Imagens                                                             */
/* ------------------------------------------------------------------ */

/**
 * Fotos reais da unidade, extraídas do material enviado pela academia
 * (fotos e frames do vídeo de divulgação). Para trocar por versões em alta
 * resolução, substitua o arquivo em public/images mantendo o nome — ou
 * altere o caminho, a largura e a altura aqui.
 */
export const photos = {
  cardio: {
    src: "/images/area-cardio.jpg",
    width: 508,
    height: 677,
    alt: "Área de cardio com esteiras e bicicletas, iluminação azul e paredes laranja",
  },
  salao: {
    src: "/images/salao-principal.jpg",
    width: 508,
    height: 677,
    alt: "Salão principal com piso de madeira, esteiras e estações de musculação",
  },
  estacoes: {
    src: "/images/estacoes-musculacao.jpg",
    width: 313,
    height: 677,
    alt: "Estações de musculação alinhadas junto à parede com iluminação em LED",
  },
  corredor: {
    src: "/images/corredor-maquinas.jpg",
    width: 407,
    height: 375,
    alt: "Corredor de máquinas de musculação com paredes laranja e trilho de luz no teto",
  },
  corredorLaranja: {
    src: "/images/corredor-laranja.jpg",
    width: 416,
    height: 580,
    alt: "Máquinas de musculação para membros inferiores ao longo da parede laranja",
  },
  pesosLivres: {
    src: "/images/pesos-livres.jpg",
    width: 416,
    height: 580,
    alt: "Área de pesos livres com halteres, bancos e piso emborrachado",
  },
  funcional: {
    src: "/images/area-funcional.jpg",
    width: 416,
    height: 580,
    alt: "Equipamentos de peso livre e máquinas articuladas sobre piso emborrachado",
  },
  esteiras: {
    src: "/images/esteiras.jpg",
    width: 416,
    height: 580,
    alt: "Fileira de esteiras na área de cardio com telão ao fundo",
  },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];
