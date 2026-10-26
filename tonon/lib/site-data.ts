/**
 * Fonte única de verdade do site.
 *
 * Endereço, telefone, horários, links, comodidades, mensagens de WhatsApp e
 * fotos vivem apenas aqui. Mudar um horário neste arquivo atualiza a página,
 * o rodapé, o FAQ e o JSON-LD de uma vez.
 *
 * Regra: só entra aqui informação fornecida pelo laboratório. Nada de
 * títulos, certificações, tempo de experiência, números de pacientes,
 * depoimentos ou serviços que não tenham sido informados.
 */

/**
 * URL pública do site, em ordem de preferência:
 *   1. NEXT_PUBLIC_SITE_URL — domínio oficial, quando existir
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injetada automaticamente pela Vercel
 *   3. localhost, no desenvolvimento
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
  name: "Laboratório Tonon",
  person: "Matheus Tonon",
  role: "Especialista em reabilitação estética",
  title: "CEO | Laboratório Tonon",
  focus: "Alta performance em reabilitação oral",
  url: resolved.url,
  /** Só é true quando o domínio oficial foi configurado (habilita o canonical). */
  hasOfficialDomain: resolved.isOfficial,
  city: "São João da Boa Vista",
  state: "SP",

  address: {
    street: "Rua Henrique Cabral de Vasconcelos, 2104",
    district: "Jardim São Nicolau",
    city: "São João da Boa Vista",
    state: "SP",
    postalCode: "13876-100",
    country: "BR",
  },

  phone: {
    display: "(19) 98135-7500",
    /** Formato E.164, para tel: e dados estruturados. */
    e164: "+5519981357500",
    /** Só dígitos, para wa.me. */
    whatsapp: "5519981357500",
  },

  links: {
    instagram: "https://www.instagram.com/matheus.tonon/",
    instagramHandle: "@matheus.tonon",
    maps: "https://maps.app.goo.gl/DzCmDyUCrzpVoUCz7",
  },
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
  { weekday: 1, label: "Segunda-feira", short: "Seg", opens: "08:00", closes: "18:00" },
  { weekday: 2, label: "Terça-feira", short: "Ter", opens: "08:00", closes: "18:00" },
  { weekday: 3, label: "Quarta-feira", short: "Qua", opens: "08:00", closes: "18:00" },
  { weekday: 4, label: "Quinta-feira", short: "Qui", opens: "08:00", closes: "18:00" },
  { weekday: 5, label: "Sexta-feira", short: "Sex", opens: "08:00", closes: "18:00" },
  { weekday: 6, label: "Sábado", short: "Sáb", opens: "08:00", closes: "18:00" },
  { weekday: 0, label: "Domingo", short: "Dom", opens: null, closes: null },
];

/** "08:00" → "08h", "18:30" → "18h30". */
export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  return m === "00" ? `${h}h` : `${h}h${m}`;
}

export function formatRange(day: OpeningDay): string {
  if (!day.opens || !day.closes) return "Fechado";
  return `${formatTime(day.opens)} às ${formatTime(day.closes)}`;
}

/** Resumo compacto, para o hero, o rodapé e o FAQ. */
export const hoursSummary = [
  { label: "Segunda a sábado", value: "08h às 18h" },
  { label: "Domingo", value: "Fechado" },
] as const;

/* ------------------------------------------------------------------ */
/* Comodidades e acessibilidade (informadas pelo laboratório)          */
/* ------------------------------------------------------------------ */

export type AmenityGroup = { title: string; items: string[] };

export const amenities: AmenityGroup[] = [
  {
    title: "Estacionamento",
    items: [
      "Estacionamento gratuito coberto",
      "Estacionamento gratuito descoberto",
      "Estacionamento no local",
      "Estacionamento gratuito na rua",
    ],
  },
  {
    title: "Acessibilidade",
    items: [
      "Entrada acessível para pessoas em cadeira de rodas",
      "Banheiro acessível para pessoas em cadeira de rodas",
    ],
  },
  {
    title: "Atendimento",
    items: ["Atendimento mediante agendamento recomendado", "Ambiente acolhedor à comunidade LGBTQ+"],
  },
];

/* ------------------------------------------------------------------ */
/* Navegação                                                           */
/* ------------------------------------------------------------------ */

export const navLinks = [
  { label: "Laboratório", href: "#laboratorio" },
  { label: "Matheus Tonon", href: "#sobre" },
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Visita", href: "#visita" },
  { label: "Dúvidas", href: "#duvidas" },
] as const;

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

export const whatsappMessages = {
  default:
    "Olá, Matheus! Conheci o Laboratório Tonon pelo site e gostaria de obter mais informações.",
  schedule:
    "Olá, Matheus! Conheci o Laboratório Tonon pelo site e gostaria de agendar um horário.",
  cases:
    "Olá, Matheus! Vi os trabalhos do Laboratório Tonon no site e gostaria de obter mais informações.",
} as const;

export type WhatsappContext = keyof typeof whatsappMessages;

export function whatsappUrl(context: WhatsappContext = "default"): string {
  return `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(whatsappMessages[context])}`;
}

/* ------------------------------------------------------------------ */
/* Imagens                                                             */
/* ------------------------------------------------------------------ */

export const portrait = {
  src: "/images/matheus-tonon.jpg",
  width: 1080,
  height: 1440,
  alt: "Matheus Tonon, de camisa preta, na recepção do Laboratório Tonon, com parede em relevo branco e plantas ao fundo",
} as const;

export type CaseStudy = {
  id: string;
  /** Rótulo curto do que a foto mostra (não descreve procedimento). */
  label: string;
  width: number;
  height: number;
  /** Descrição visual do que aparece na foto, sem prometer resultado. */
  before: string;
  after: string;
  /** Formato de leitura no comparador. */
  shape: "wide" | "tall";
};

/**
 * Casos publicados por Matheus Tonon no Instagram. As imagens foram separadas
 * em "antes" e "depois" por scripts/prepare-images.mjs, sem retoque.
 */
export const cases: CaseStudy[] = [
  {
    id: "caso-01",
    label: "Sorriso completo",
    width: 656,
    height: 534,
    before: "Sorriso antes do tratamento, com dentes manchados, desgastados e espaços entre eles",
    after: "O mesmo sorriso depois da reabilitação estética, com dentes claros, uniformes e alinhados",
    shape: "wide",
  },
  {
    id: "caso-02",
    label: "Dentes anteriores",
    width: 1400,
    height: 929,
    before: "Vista aproximada dos dentes antes, com variação de cor entre os dentes da frente",
    after: "A mesma vista depois, com os dentes superiores em cor e formato harmonizados",
    shape: "wide",
  },
  {
    id: "caso-04",
    label: "Vista lateral",
    width: 1400,
    height: 930,
    before: "Sorriso lateral antes, com ausência de um dente superior",
    after: "O mesmo sorriso depois, com a arcada superior completa",
    shape: "wide",
  },
  {
    id: "caso-05",
    label: "Proporção e alinhamento",
    width: 1400,
    height: 889,
    before: "Sorriso antes, com dentes curtos, desgastados e desalinhados",
    after: "O mesmo sorriso depois, com dentes em proporção, cor e alinhamento renovados",
    shape: "wide",
  },
  {
    id: "caso-06",
    label: "Cor e contorno",
    width: 1400,
    height: 873,
    before: "Sorriso antes, com dentes amarelados e espaço entre os incisivos",
    after: "O mesmo sorriso depois, com dentes claros e contornos uniformes",
    shape: "wide",
  },
  {
    id: "caso-03",
    label: "Retrato",
    width: 536,
    height: 1270,
    before: "Retrato em preto e branco de uma paciente sorrindo, antes do tratamento",
    after: "Retrato em preto e branco da mesma paciente sorrindo, depois do tratamento",
    shape: "tall",
  },
];

export const caseSrc = (id: string, phase: "antes" | "depois") => `/images/casos/${id}-${phase}.jpg`;
