/**
 * Fonte única de verdade do site da Star Sorrindo.
 *
 * Endereço, telefone, horários, links, avaliações, fotos e mensagens de
 * WhatsApp vivem só aqui. Mudar um horário neste arquivo atualiza a página
 * inicial, o rodapé, o FAQ, a página de contato e o JSON-LD de uma vez.
 *
 * Regra do projeto: só entra aqui informação fornecida pela clínica.
 * Nada de nomes de dentistas, CRO, títulos, equipamentos, número de pacientes
 * ou anos de experiência enquanto não forem informados e verificados.
 *
 * ⚠️  ANTES DE PUBLICAR, confirme com a clínica tudo o que está marcado com
 *     "CONFIRMAR" — principalmente o número do WhatsApp.
 */

/**
 * URL pública do site, em ordem de preferência:
 *   1. NEXT_PUBLIC_SITE_URL — domínio oficial, quando existir
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injetada automaticamente pela Vercel
 *   3. localhost, no desenvolvimento
 * Nenhum domínio é inventado: um canonical apontando para um domínio que a
 * clínica não possui seria pior do que nenhum.
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
  name: "Star Sorrindo Poços de Caldas",
  brand: "Star Sorrindo",
  /** Assinatura usada na fachada e no logotipo oficial. */
  brandLine: "Implantes",
  url: resolved.url,
  /** Só é true quando o domínio oficial foi configurado (habilita canonical e sitemap). */
  hasOfficialDomain: resolved.isOfficial,
  city: "Poços de Caldas",
  state: "MG",

  address: {
    street: "Av. Francisco Salles, 615",
    district: "Centro",
    city: "Poços de Caldas",
    state: "MG",
    postalCode: "37701-702",
    country: "BR",
  },

  /**
   * Número da ficha do Google, o mesmo pintado na fachada da clínica.
   * CONFIRMAR: na mensagem original foi informado outro número — confirme com
   * o responsável que este é o WhatsApp de agendamento antes de publicar.
   */
  phone: {
    display: "(35) 99888-3596",
    /** Formato E.164, para tel: e dados estruturados. */
    e164: "+5535998883596",
    /** Só dígitos (país + DDD + número), para wa.me. */
    whatsapp: "5535998883596",
  },

  links: {
    instagram: "https://www.instagram.com/starsorrindopc/",
    instagramHandle: "@starsorrindopc",
    maps: "https://maps.app.goo.gl/VYsd6mSkLCC5zcCg7",
    /** Rotas a partir da localização do visitante. */
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent("Star Sorrindo, Av. Francisco Salles, 615 - Centro, Poços de Caldas - MG, 37701-702"),
    /** Mapa incorporado sem chave de API. Só é carregado quando o visitante pede. */
    mapEmbed:
      "https://www.google.com/maps?output=embed&q=" +
      encodeURIComponent("Star Sorrindo, Av. Francisco Salles, 615, Centro, Poços de Caldas - MG"),
  },

  /**
   * Nota e total informados para o projeto. Não vêm de uma integração com o
   * Google: por isso a página mostra a data de referência e manda o visitante
   * conferir no perfil oficial. Atualize conforme os dados públicos vigentes.
   */
  rating: {
    value: "4,9",
    count: 12,
    reference: "outubro de 2026",
  },

  /**
   * CONFIRMAR e preencher: responsável técnico e CRO exigidos pelo CFO na
   * publicidade odontológica. Enquanto estiver null, o rodapé mostra um aviso
   * neutro em vez de inventar dados.
   */
  technicalResponsible: null as null | { name: string; cro: string },
} as const;

export const fullAddress = `${site.address.street} — ${site.address.district}, ${site.address.city} — ${site.address.state}, CEP ${site.address.postalCode}`;

/* ------------------------------------------------------------------ */
/* Horário de funcionamento (CONFIRMAR com a clínica)                   */
/* ------------------------------------------------------------------ */

export type OpeningDay = {
  /** 0 = domingo … 6 = sábado, igual a Date#getDay. */
  weekday: number;
  label: string;
  /** "HH:MM" em 24h, horário de Brasília. null = fechado. */
  opens: string | null;
  closes: string | null;
};

export const openingHours: OpeningDay[] = [
  { weekday: 1, label: "Segunda-feira", opens: "09:00", closes: "19:00" },
  { weekday: 2, label: "Terça-feira", opens: "09:00", closes: "19:00" },
  { weekday: 3, label: "Quarta-feira", opens: "09:00", closes: "19:00" },
  { weekday: 4, label: "Quinta-feira", opens: "09:00", closes: "19:00" },
  { weekday: 5, label: "Sexta-feira", opens: "09:00", closes: "19:00" },
  { weekday: 6, label: "Sábado", opens: "08:00", closes: "15:00" },
  { weekday: 0, label: "Domingo", opens: null, closes: null },
];

/** "09:00" → "09h", "18:30" → "18h30". */
export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  return m === "00" ? `${h}h` : `${h}h${m}`;
}

export function formatRange(day: OpeningDay): string {
  if (!day.opens || !day.closes) return "Fechado";
  return `${formatTime(day.opens)} às ${formatTime(day.closes)}`;
}

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta · 09h às 19h". */
export const hoursSummary: { label: string; value: string }[] = (() => {
  const groups: { days: OpeningDay[]; value: string }[] = [];
  for (const day of openingHours) {
    const value = formatRange(day);
    const last = groups.at(-1);
    if (last && last.value === value) last.days.push(day);
    else groups.push({ days: [day], value });
  }
  return groups.map(({ days, value }) => {
    const first = days[0].label.replace("-feira", "");
    const last = days.at(-1)!.label.replace("-feira", "");
    return { label: days.length > 1 ? `${first} a ${last.toLowerCase()}` : first, value };
  });
})();

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

export const whatsappMessages = {
  default: "Olá! Conheci a Star Sorrindo pelo site e gostaria de informações sobre uma avaliação odontológica.",
  implants: "Olá! Gostaria de saber mais sobre avaliação para implantes dentários na Star Sorrindo.",
  prosthesis: "Olá! Gostaria de receber informações sobre próteses dentárias e agendar uma avaliação.",
  general: "Olá! Gostaria de agendar uma avaliação de clínica geral na Star Sorrindo.",
  other: "Olá! Gostaria de saber quais outros tratamentos odontológicos a Star Sorrindo oferece.",
  question: "Olá! Tenho uma dúvida sobre os atendimentos da Star Sorrindo.",
} as const;

export type WhatsAppTopic = keyof typeof whatsappMessages;

/** Link oficial wa.me com mensagem inicial. Funciona no celular e no computador. */
export function whatsappUrlWithText(text: string): string {
  return `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function whatsappUrl(topic: WhatsAppTopic = "default"): string {
  return whatsappUrlWithText(whatsappMessages[topic]);
}

/* ------------------------------------------------------------------ */
/* Navegação                                                           */
/* ------------------------------------------------------------------ */

export const navLinks = [
  { label: "A clínica", href: "/#clinica" },
  { label: "Tratamentos", href: "/#tratamentos" },
  { label: "Implantes", href: "/implantes-dentarios/" },
  { label: "Próteses", href: "/proteses-dentarias/" },
  { label: "Avaliações", href: "/#avaliacoes" },
  { label: "Contato", href: "/contato/" },
] as const;

/* ------------------------------------------------------------------ */
/* Tratamentos                                                         */
/* ------------------------------------------------------------------ */

/**
 * Só tratamentos confirmados. Para incluir um novo (ex.: clareamento,
 * ortodontia), confirme com a clínica, adicione aqui e, se quiser uma página
 * própria, crie app/<slug>/page.tsx seguindo o modelo de implantes.
 */
export const treatments = [
  {
    id: "implantes",
    name: "Implantes dentários",
    summary:
      "Uma alternativa para repor dentes ausentes em determinados casos, definida após avaliação clínica e planejamento individual.",
    href: "/implantes-dentarios/",
    whatsapp: "implants" as WhatsAppTopic,
    featured: true,
  },
  {
    id: "proteses",
    name: "Próteses dentárias",
    summary:
      "Recursos para restaurar dentes ausentes ou comprometidos, com indicação que depende das condições e necessidades de cada paciente.",
    href: "/proteses-dentarias/",
    whatsapp: "prosthesis" as WhatsAppTopic,
    featured: false,
  },
  {
    id: "clinica-geral",
    name: "Clínica geral",
    summary:
      "Consultas e cuidados odontológicos para acompanhar a saúde bucal e orientar sobre os próximos passos de cada caso.",
    href: null,
    whatsapp: "general" as WhatsAppTopic,
    featured: false,
  },
] as const;

/* ------------------------------------------------------------------ */
/* Avaliações do Google                                                */
/* ------------------------------------------------------------------ */

/**
 * Trechos de avaliações públicas do Google, com a redação original.
 * Sem nome nem foto do autor (não há autorização). Para adicionar uma nova,
 * copie o texto exatamente como está no Google e, se possível, o link direto
 * da avaliação em `url`.
 */
export const reviews: { text: string; url?: string }[] = [
  { text: "Profissionais de altíssimo nível e infraestrutura de primeira linha." },
  { text: "Ótima clínica, muito limpo, todos funcionários educados." },
  { text: "Ótimo trabalho, profissionais excelentes." },
];

/* ------------------------------------------------------------------ */
/* Fotos                                                               */
/* ------------------------------------------------------------------ */

/**
 * Fotos reais enviadas pela clínica (public/images/, em WebP, sem metadados).
 * Para trocar uma foto: coloque o arquivo em public/images/ e altere `src`
 * (e `srcSet`, se houver versão menor). Com `src: null` o site mostra uma
 * composição abstrata — nunca uma foto de banco como se fosse a clínica.
 */
export type PhotoSlot = { src: string | null; srcSet?: string; alt: string; label: string; position?: string };

const img = (name: string) => ({
  src: `/images/${name}-1100.webp`,
  srcSet: `/images/${name}-640.webp 640w, /images/${name}-1100.webp 1100w`,
});

export const photos = {
  hero: {
    ...img("consultorio"),
    alt: "Consultório da Star Sorrindo, com cadeira odontológica, divisória vazada e iluminação indireta",
    label: "Consultório",
    position: "50% 55%",
  },
  facade: {
    ...img("fachada"),
    alt: "Fachada da Star Sorrindo Implantes na Av. Francisco Salles, com jardim vertical e entrada de vidro",
    label: "Fachada",
    position: "50% 35%",
  },
  gallery: [
    {
      ...img("fachada-noite"),
      alt: "Fachada da Star Sorrindo iluminada à noite, na esquina da Av. Francisco Salles",
      label: "Fachada à noite",
      position: "50% 50%",
    },
    {
      ...img("consultorio"),
      alt: "Consultório odontológico com iluminação indireta em tons dourados",
      label: "Consultório",
      position: "50% 50%",
    },
    {
      ...img("fachada"),
      alt: "Entrada da clínica, com a recepção visível pela porta de vidro",
      label: "Entrada e recepção",
      position: "50% 50%",
    },
  ],
} satisfies { hero: PhotoSlot; facade: PhotoSlot; gallery: PhotoSlot[] };

export const hasGalleryPhotos = photos.gallery.some((p) => p.src);

/* ------------------------------------------------------------------ */
/* Casos clínicos (antes e depois)                                     */
/* ------------------------------------------------------------------ */

/**
 * Imagens de antes e depois publicadas pela própria clínica no Instagram.
 *
 * ⚠️  CONFIRMAR ANTES DE PUBLICAR: a Resolução CFO 196/2019 só permite
 *     divulgar antes e depois com autorização prévia e por escrito de cada
 *     paciente, e com identificação do responsável técnico (nome e CRO).
 *     Se alguma autorização não existir, remova o caso da lista. Para
 *     esconder a seção inteira, mude `enabled` para false.
 */
export const clinicalCases = {
  enabled: true,
  items: [1, 2, 3, 4, 5].map((n) => ({
    src: `/images/casos/caso-${n}.webp`,
    alt: `Caso ${n}: sorriso de paciente antes e depois do tratamento, em fotos aproximadas da boca`,
  })),
};
