/**
 * Fonte única dos dados do site da Não+Pelo Pirassununga.
 * Conteúdo da marca copiado de naomaispelo.com.br; dados da unidade informados por ela.
 * Não acrescente números, promessas ou contatos que não estejam publicados pela marca.
 */

const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

/** Mensagem padrão usada em todos os links de WhatsApp do site original. */
export const WHATSAPP_DEFAULT_MESSAGE = "Olá! Quero saber mais detalhes. Poderia me ajudar?";

/** Monta um link universal do WhatsApp (abre o app no celular e o WhatsApp Web no desktop). */
export function whatsappLink(phone: string, message = WHATSAPP_DEFAULT_MESSAGE) {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

/**
 * Unidade Não+Pelo Pirassununga — dados informados pela unidade (novembro de 2026).
 * O site é exclusivo desta clínica.
 */
export const unit = {
  name: "Não+Pelo Pirassununga",
  city: "Pirassununga",
  state: "SP",
  street: "R. Duque de Caxias, 1942",
  district: "Centro",
  postalCode: "13630-095",
  addressLine: "R. Duque de Caxias, 1942 - Centro, Pirassununga - SP, 13630-095",
  whatsapp: "551935626669",
  whatsappDisplay: "(19) 3562-6669",
  instagram: "naomaispelo.pirassununga",
  instagramHref: "https://www.instagram.com/naomaispelo.pirassununga/",
  mapsHref: "https://maps.app.goo.gl/s2dbbVypGUHAQ4eT8",
  mapsEmbed:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Não+Pelo, R. Duque de Caxias, 1942 - Centro, Pirassununga - SP, 13630-095") +
    "&output=embed",
  /** Nome da unidade como o CRM da rede espera receber no formulário de cadastro. */
  crmName: "SP - PIRASSUNUNGA",
  /** Horário de funcionamento. Dia 0 = domingo. Horas no fuso de São Paulo. */
  hours: [
    { day: 1, label: "Segunda-feira", open: "08:00", close: "18:00" },
    { day: 2, label: "Terça-feira", open: "08:00", close: "18:00" },
    { day: 3, label: "Quarta-feira", open: "08:00", close: "18:00" },
    { day: 4, label: "Quinta-feira", open: "08:00", close: "18:00" },
    { day: 5, label: "Sexta-feira", open: "08:00", close: "18:00" },
    { day: 6, label: "Sábado", open: "08:00", close: "12:00" },
    { day: 0, label: "Domingo", open: null, close: null },
  ],
} as const;

export const site = {
  name: unit.name,
  url: envUrl ?? "https://naomaispelo.com.br",
  hasOfficialDomain: Boolean(envUrl),

  /** WhatsApp de agendamento da unidade. */
  centralWhatsapp: unit.whatsapp,

  social: [{ label: "Instagram", href: unit.instagramHref }],

  /** Páginas institucionais da marca, mantidas no site nacional. */
  external: {
    brand: "https://naomaispelo.com.br",
    franchise: "https://naomaispelo.com.br/seja-um-franqueado",
    privacy: "https://naomaispelo.com.br/politica-de-privacidade",
  },
} as const;

export const centralWhatsappHref = whatsappLink(site.centralWhatsapp);

export const nav = [
  { label: "Home", href: "/" },
  { label: "Tecnologia", href: "/#tecnologia" },
  { label: "Depilação feminina", href: "/depilacao-feminina" },
  { label: "Depilação masculina", href: "/depilacao-masculina" },
  { label: "Depoimentos", href: "/#depoimentos" },
  { label: "Localização", href: "/#localizacao" },
] as const;

/** Vídeo institucional da seção "Nossa tecnologia" do site original. */
export const technologyVideoId = "Y_UJY1cPlaI";

/** Depoimentos em vídeo publicados no site original (nomes e vídeos reais). */
export const testimonials = [
  { name: "Julia Caneppelle", videoId: "IW9LW-YapVI", image: "/img/depoimentos/depoimento-1.jpg" },
  { name: "Cesar", videoId: "tPmTOzEa9TQ", image: "/img/depoimentos/depoimento-2.jpg" },
  { name: "Suyane Damasio", videoId: "LW9HejXX0Jk", image: "/img/depoimentos/depoimento-3.jpg" },
  { name: "Natália Santos", videoId: "fUk_9VJ9Whk", image: "/img/depoimentos/depoimento-4.jpg" },
  { name: "Jornada Saraiva", videoId: "NtoU5Km3ce0", image: "/img/depoimentos/depoimento-5.jpg" },
  { name: "Daniele", videoId: "USeXJxBP98Q", image: "/img/depoimentos/depoimento-6.jpg" },
] as const;

/**
 * Diferenciais publicados nas páginas de depilação e em "Quem somos".
 * Redação levemente encurtada, sem alterar o sentido nem acrescentar promessas.
 */
export const differentials = [
  {
    title: "Superioridade tecnológica",
    text: "Sun&Safe, exclusividade Não+Pelo, com filtros especiais e exclusivos de safira.",
  },
  {
    title: "Atendemos peles bronzeadas",
    text: "Um diferencial que chama a atenção de muitos clientes e posiciona a Não+Pelo como marca inovadora em depilação.",
  },
  {
    title: "Personalizado para cada tom de pele",
    text: "Os tratamentos respeitam o tom de pele e o tipo de pelo de cada pessoa, para maior segurança.",
  },
  {
    title: "Resfriamento integrado",
    text: "Tecnologia exclusiva de resfriamento que protege a pele e torna a experiência mais confortável do início ao fim.",
  },
] as const;

export type Gender = "feminino" | "masculino";

/** Áreas e descrições do mapa interativo do site original (depilacao.js). */
export const bodyAreas = [
  { id: "virilha", label: "Virilha", text: "Abrange a região dentro da roupa íntima e o início da coxa, até 3 dedos. Pode ser completa ou parcial.", pin: { feminino: [40, 48], masculino: [40, 48.5] } },
  { id: "anus", label: "Ânus", text: "Depilação completa da região anal.", pin: { feminino: [50, 52], masculino: [50, 53] } },
  { id: "axilas", label: "Axilas", text: "Depilação completa das axilas.", pin: { feminino: [21, 20], masculino: [21, 22] } },
  { id: "meia-perna", label: "Meia perna", text: "Depilação da metade inferior da perna.", pin: { feminino: [38, 82], masculino: [32, 82] } },
  { id: "buco", label: "Buço", text: "Depilação do buço, a região acima do lábio superior.", pin: { feminino: [50, 11], masculino: [50, 11.5] } },
  { id: "anterior-coxa", label: "Anterior da coxa", text: "Depilação da parte anterior da coxa.", pin: { feminino: [36, 60], masculino: [32, 62] } },
  { id: "areolas", label: "Aréolas", text: "Depilação das aréolas mamárias.", pin: { feminino: [34, 24.5], masculino: [32, 26.3] } },
  { id: "barriga", label: "Barriga", text: "Depilação da região abdominal.", pin: { feminino: [48, 37], masculino: [50, 36] } },
] as const;
