/**
 * Central configuration. Everything an operator needs to change before going
 * live is in this file — no string hunting across components.
 */

/**
 * WhatsApp number in international format, digits only.
 * The real number is the fallback (it is not a secret), so every CTA keeps
 * working even if the env var is missing on a deploy.
 */
const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP ?? "5535984487206";

/**
 * Canonical URL, in order of preference:
 *   1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is connected
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected automatically by Vercel
 *   3. localhost, for local development
 * No hardcoded domain: a canonical/OG URL pointing at a domain you don't own
 * is worse than no domain at all.
 */
function resolveUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

const url = resolveUrl();

export const site = {
  name: "Vertex Web Studios",
  shortName: "Vertex",
  url,
  /** Host only — shown in the decorative browser chrome of the mockups. */
  domain: url.replace(/^https?:\/\//, ""),
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

  /** Only channels that actually exist. Never link to a profile that isn't real. */
  social: {
    tiktok: "https://www.tiktok.com/@vertexwebstudios",
  },
} as const;

/** Builds the wa.me deep link, tagged so you can attribute leads by CTA. */
export function whatsappUrl(source?: string): string {
  const text = source
    ? `${site.whatsapp.message} (origem: ${source})`
    : site.whatsapp.message;
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export type Lead = {
  name: string;
  company: string;
  phone: string;
  segment: string;
  needs: string;
};

/**
 * Builds the wa.me link for a completed form, with every field laid out as a
 * readable message. `*text*` and `_text_` are WhatsApp's native bold/italic —
 * the message arrives formatted, not as raw markup.
 */
export function whatsappLeadUrl(lead: Lead): string {
  const lines = [
    "Olá! Quero um site profissional para o meu negócio.",
    "",
    `*Nome:* ${lead.name.trim()}`,
    `*Empresa:* ${lead.company.trim()}`,
    `*WhatsApp:* ${lead.phone.trim()}`,
    `*Segmento:* ${lead.segment}`,
    `*O que preciso:* ${lead.needs.trim()}`,
    "",
    "_Enviado pelo formulário do site_",
  ];

  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(lines.join("\n"))}`;
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
