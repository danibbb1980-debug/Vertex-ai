/**
 * Central configuration. Everything an operator needs to change before going
 * live is in this file — no string hunting across components.
 */

const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP ?? "5511999999999";

export const site = {
  name: "Vertex Web Studios",
  shortName: "Vertex",
  domain: "vertexwebstudios.com.br",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vertexwebstudios.com.br",
  locale: "pt-BR",

  /** Monthly subscription price, in BRL. */
  price: 197,
  /** Anchor: what the same site costs paid up front, from agency quotes. */
  anchorLow: 3500,
  anchorHigh: 8000,
  /** Days from kickoff to launch, used consistently in every promise on the page. */
  launchDays: 7,
  /** Money-back window, in days. */
  guaranteeDays: 7,

  whatsapp: {
    number: rawPhone,
    /** Pre-filled first message — removes the "what do I even say?" friction. */
    message:
      "Olá! Vi o site da Vertex e quero saber mais sobre o plano de R$197/mês.",
  },

  social: {
    instagram: "https://instagram.com/vertexwebstudios",
    tiktok: "https://tiktok.com/@vertexwebstudios",
    linkedin: "https://linkedin.com/company/vertexwebstudios",
  },

  email: "contato@vertexwebstudios.com.br",
} as const;

/** Builds the wa.me deep link, tagged so you can attribute leads by CTA. */
export function whatsappUrl(source?: string): string {
  const text = source
    ? `${site.whatsapp.message} (origem: ${source})`
    : site.whatsapp.message;
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export const brl = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export const brlCents = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

/** "menos de R$6,57 por dia" — reframes the price at a scale that feels trivial. */
export const pricePerDay = brlCents(site.price / 30);
