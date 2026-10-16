/**
 * Studio VIP — dados de contato, links e mensagens de WhatsApp.
 *
 * Tudo que o estúdio pode precisar trocar está aqui: endereço, telefone,
 * links e o texto pré-preenchido de cada CTA. Nenhum componente monta URL de
 * WhatsApp por conta própria.
 *
 * Regra do projeto: só informação confirmada pelo estúdio. Nada de preço,
 * horário de funcionamento, número de alunos ou resultado prometido.
 */

import { site } from "./site";

/**
 * No projeto próprio do estúdio (build com STUDIO_VIP_STANDALONE=1) a página
 * é servida na raiz; dentro do site da Vertex, em /studio-vip.
 * Só é lido no servidor (metadata, JSON-LD, sitemap).
 */
const standalone = process.env.STUDIO_VIP_STANDALONE === "1";
const path = standalone ? "/" : "/studio-vip";

export const studio = {
  name: "Studio VIP",
  fullName: "Studio VIP — Studio para Treinos",
  standalone,
  path,
  /** URL canônica da página, derivada da URL do projeto (ver lib/site.ts). */
  url: standalone ? site.url : `${site.url}${path}`,

  address: {
    street: "Rua Assis Figueiredo, 36, Sala 1",
    district: "Centro",
    city: "Poços de Caldas",
    state: "MG",
    postalCode: "37701-704",
    country: "BR",
  },

  phone: {
    display: "(35) 99222-7597",
    /** Formato internacional, só dígitos — usado no wa.me e no tel:. */
    e164: "5535992227597",
  },

  rating: {
    value: "5,0",
    count: 33,
  },

  links: {
    instagram: "https://www.instagram.com/studiovip.pc/",
    instagramHandle: "@studiovip.pc",
    maps: "https://maps.app.goo.gl/9d8VeyxYiZxYNr8m8",
    /** Embed sem chave de API, a partir do endereço público. */
    mapsEmbed:
      "https://www.google.com/maps?q=" +
      encodeURIComponent(
        "Studio VIP, Rua Assis Figueiredo, 36, Centro, Poços de Caldas - MG, 37701-704",
      ) +
      "&output=embed",
    linktree: "https://meulink.com.vc",
  },
} as const;

/** Mensagens pré-preenchidas, uma por contexto de CTA. */
export const messages = {
  hero: "Olá! Conheci o Studio VIP pelo site e gostaria de saber como funciona a aula experimental.",
  main: "Olá! Conheci o Studio VIP pelo site e gostaria de saber mais sobre os treinos personalizados.",
  nutrition:
    "Olá! Conheci o Studio VIP pelo site e gostaria de conhecer as opções de acompanhamento, incluindo o nutricional.",
  experimental:
    "Olá! Quero conhecer o Studio VIP e gostaria de agendar uma aula experimental. Como funciona?",
  final: "Olá! Gostaria de conhecer o Studio VIP e saber como posso agendar uma aula experimental.",
} as const;

export type MessageKey = keyof typeof messages;

/** Link wa.me com a mensagem do contexto, codificada corretamente. */
export function vipWhatsapp(key: MessageKey = "main"): string {
  return `https://wa.me/${studio.phone.e164}?text=${encodeURIComponent(messages[key])}`;
}

export const addressLine = `${studio.address.street}, ${studio.address.district}, ${studio.address.city} — ${studio.address.state}`;
