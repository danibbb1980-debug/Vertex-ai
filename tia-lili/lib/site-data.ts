/**
 * Fonte única de verdade do site.
 *
 * Regra: só entra aqui informação confirmada pela clínica. Endereço em texto,
 * horários, CRO, formação, preços e avaliações não foram informados e por isso
 * não aparecem no site. Ao recebê-los, acrescente aqui primeiro.
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
  name: "Tia Lili Odontopediatra",
  /** Nome como aparece no perfil da clínica no Google Maps. */
  professional: "Dra. Liliane Ormeneze",
  tagline: "Cuidado com os dentinhos, carinho em cada etapa.",
  url: resolved.url,
  /** Só é true quando o domínio oficial foi configurado (habilita o canonical). */
  hasOfficialDomain: resolved.isOfficial,

  phone: {
    display: "+55 35 9811-2645",
    /** Só dígitos, para wa.me. */
    whatsapp: "553598112645",
  },

  links: {
    instagram: "https://www.instagram.com/tialiliodontopediatra/",
    instagramHandle: "@tialiliodontopediatra",
    maps: "https://maps.app.goo.gl/xu5a7v4h7BiHF6nR7",
  },
} as const;

/** Mensagem padrão do WhatsApp, a mesma em todos os botões do site. */
export const whatsappMessage =
  "Olá, vim pelo site da Tia Lili e gostaria de informações sobre agendamento.";

export const whatsappUrl = `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

export const navLinks = [
  { label: "Abordagem", href: "#abordagem" },
  { label: "Consultório", href: "#consultorio" },
  { label: "Dúvidas", href: "#duvidas" },
  { label: "Contato", href: "#contato" },
] as const;

/**
 * Fotos publicadas no perfil da clínica no Google Maps. São arquivos pequenos
 * (até ~600 px): para trocar por versões em alta resolução, substitua o arquivo
 * em public/images mantendo o nome, ou altere caminho, largura e altura aqui.
 */
export const photos = {
  consultorioSorriso: {
    src: "/images/consultorio-sorriso.jpg",
    width: 508,
    height: 677,
    alt: "Menina sorridente ao lado de uma profissional no consultório, com o logotipo da Tia Lili na parede",
  },
  atendimentoMesa: {
    src: "/images/atendimento-mesa.jpg",
    width: 381,
    height: 677,
    alt: "Profissional de jaleco conversando com uma menina sentada à mesa",
  },
  brinquedos: {
    src: "/images/cantinho-brinquedos.jpg",
    width: 286,
    height: 508,
    alt: "Criança pequena escolhendo um brinquedo em uma cesta colorida",
  },
  retrato: {
    src: "/images/retrato.jpg",
    width: 344,
    height: 406,
    alt: "Retrato da Dra. Liliane Ormeneze, a Tia Lili, sorrindo",
  },
  recepcao: {
    src: "/images/recepcao.jpg",
    width: 381,
    height: 508,
    alt: "Recepção clara com balcão branco e painel lúdico colorido na parede",
  },
  mesaAtividades: {
    src: "/images/mesa-atividades.jpg",
    width: 381,
    height: 508,
    alt: "Duas meninas sentadas à mesa, olhando materiais ilustrados com uma adulta",
  },
  tchauChupeta: {
    src: "/images/tchau-chupeta.jpg",
    width: 597,
    height: 677,
    alt: "Quadro ilustrado “Tchau Chupeta” com uma fadinha e o logotipo da Tia Lili",
  },
  fachada: {
    src: "/images/fachada.jpg",
    width: 381,
    height: 508,
    alt: "Fachada do prédio, com brises brancos e céu azul",
  },
} as const;

export type Photo = (typeof photos)[keyof typeof photos];
