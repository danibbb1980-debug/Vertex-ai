/**
 * Fonte única dos dados da clínica. Tudo aqui foi confirmado no material
 * enviado (logo, fachada, parede da recepção e posts do Instagram) ou no
 * briefing. Campos `null` são informações que ainda faltam: o site esconde o
 * trecho correspondente em vez de inventar.
 */

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const officialUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

/**
 * WhatsApp: número exatamente como informado no briefing (wa.me/553597597180).
 * A fachada mostra "(35) 9 9759-7180" — com o nono dígito. O WhatsApp costuma
 * aceitar os dois formatos para números de MG, mas confirme abrindo o link no
 * celular antes de publicar. Para trocar sem mexer no código, use
 * NEXT_PUBLIC_WHATSAPP (só dígitos, com 55 e DDD).
 */
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") || "553597597180";

export const site = {
  name: "Dentista Volte a Sorrir",
  shortName: "Volte a Sorrir",
  description: "Tratamento odontológico personalizado para você e sua família.",
  city: "Alfenas",
  state: "MG",
  stateName: "Minas Gerais",
  url: officialUrl ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
  hasOfficialDomain: Boolean(officialUrl),

  whatsappNumber,
  /** Telefone como aparece na fachada da clínica. */
  phoneDisplay: "(35) 9 9759-7180",
  phoneE164: "+5535997597180",

  instagram: {
    handle: "@volteasorrir.dentista",
    url: "https://www.instagram.com/volteasorrir.dentista/",
  },

  /** Busca no Google Maps pelo nome da clínica em Alfenas. Troque pelo link
   *  do perfil no Google quando ele for confirmado. */
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dentista+Volte+a+Sorrir+Alfenas+MG",

  /** Endereço completo (rua, número, bairro). Ainda não confirmado. */
  streetAddress: null as string | null,
  /** Horário de atendimento. Ainda não confirmado (a fachada traz um horário,
   *  mas a foto não tem resolução para lê-lo com segurança). */
  openingHours: null as string | null,
  /**
   * Responsável técnico: nome e CRO. O Código de Ética Odontológica exige
   * esses dados em toda divulgação da clínica. Preencha antes de publicar,
   * por exemplo: { name: "Dra. Nome Sobrenome", cro: "CRO-MG 00000" }.
   */
  technicalLead: null as { name: string; cro: string } | null,
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultMessage = "Olá! Vim pelo site e gostaria de agendar uma avaliação.";

export type Treatment = {
  id: string;
  name: string;
  /** Linha curta, descritiva (o que é), sem promessa de resultado. */
  summary: string;
  /** Como a clínica nomeia o serviço (parede da recepção / posts). */
  detail?: string;
  group: "Reabilitação" | "Estética" | "Prevenção e tratamento" | "Cirurgia";
};

/**
 * Serviços confirmados: parede da recepção (Extração, Implantes, Obturação,
 * Canal, Dentadura, Ponte móvel) e posts do Instagram (aparelho ortodôntico,
 * coroa em porcelana e.max, clareamento caseiro ou em consultório, prótese
 * parcial removível, implante dentário).
 */
export const treatments: Treatment[] = [
  {
    id: "implantes",
    name: "Implantes dentários",
    summary: "Repõem o dente perdido com uma raiz artificial fixada no osso e uma coroa sobre ela.",
    detail: "Implantes (cirurgia)",
    group: "Reabilitação",
  },
  {
    id: "proteses",
    name: "Próteses e dentaduras",
    summary: "Dentadura, ponte móvel e prótese parcial removível (PPR) para devolver dentes e mastigação.",
    detail: "Dentadura · Ponte móvel · PPR",
    group: "Reabilitação",
  },
  {
    id: "coroas",
    name: "Coroas em porcelana",
    summary: "Revestem o dente desgastado ou escurecido com uma peça de cerâmica (e.max) de aspecto natural.",
    detail: "Coroa em porcelana (e.max)",
    group: "Estética",
  },
  {
    id: "clareamento",
    name: "Clareamento dental",
    summary: "Deixa os dentes mais claros, com a opção caseira ou feita no consultório.",
    detail: "Caseiro ou em consultório",
    group: "Estética",
  },
  {
    id: "ortodontia",
    name: "Aparelho ortodôntico",
    summary: "Alinha os dentes e corrige a mordida aos poucos, com acompanhamento periódico.",
    detail: "Instalação e manutenção",
    group: "Estética",
  },
  {
    id: "restauracoes",
    name: "Restaurações",
    summary: "Tratam cáries e pequenas fraturas, devolvendo forma e função ao dente.",
    detail: "Obturação (dentística)",
    group: "Prevenção e tratamento",
  },
  {
    id: "canal",
    name: "Tratamento de canal",
    summary: "Trata a parte interna do dente quando a polpa está inflamada ou infectada, para preservá-lo.",
    detail: "Canal (endodontia)",
    group: "Prevenção e tratamento",
  },
  {
    id: "extracoes",
    name: "Extrações",
    summary: "Remoção de dentes quando não é possível mantê-los, inclusive dentes do siso.",
    detail: "Extração (cirurgia)",
    group: "Cirurgia",
  },
];

export type CaseStudy = {
  id: string;
  title: string;
  treatment: string;
  before: { src: string; width: number; height: number; alt: string };
  after: { src: string; width: number; height: number; alt: string };
};

/** Casos publicados pela própria clínica no Instagram (fotos recortadas dos posts). */
export const cases: CaseStudy[] = [
  {
    id: "implante",
    title: "Implante dentário",
    treatment: "Implante",
    before: { src: "/images/casos/implante-antes.jpg", width: 912, height: 402, alt: "Antes: falha de um dente na arcada superior e dentes desalinhados" },
    after: { src: "/images/casos/implante-depois.jpg", width: 948, height: 423, alt: "Depois: espaço preenchido e sorriso completo" },
  },
  {
    id: "coroa-clareamento",
    title: "Coroa em porcelana e clareamento",
    treatment: "Coroa e.max + clareamento",
    before: { src: "/images/casos/coroa-clareamento-antes.jpg", width: 967, height: 479, alt: "Antes: incisivo central escurecido e dentes amarelados" },
    after: { src: "/images/casos/coroa-clareamento-depois.jpg", width: 958, height: 456, alt: "Depois: coroa de porcelana na cor dos dentes vizinhos, mais claros" },
  },
  {
    id: "protese-parcial",
    title: "Prótese parcial removível",
    treatment: "PPR",
    before: { src: "/images/casos/protese-parcial-antes.jpg", width: 441, height: 270, alt: "Antes: ausência de vários dentes superiores" },
    after: { src: "/images/casos/protese-parcial-depois.jpg", width: 445, height: 261, alt: "Depois: sorriso completo com a prótese parcial removível" },
  },
  {
    id: "ortodontia",
    title: "Instalação de aparelho ortodôntico",
    treatment: "Aparelho fixo",
    before: { src: "/images/casos/ortodontia-antes.jpg", width: 458, height: 233, alt: "Antes: dentes superiores desalinhados" },
    after: { src: "/images/casos/ortodontia-depois.jpg", width: 402, height: 282, alt: "Depois: aparelho ortodôntico fixo instalado" },
  },
  {
    id: "sorriso-renovado",
    title: "Sorriso renovado",
    treatment: "Restaurações estéticas",
    before: { src: "/images/casos/sorriso-renovado-antes.jpg", width: 453, height: 300, alt: "Antes: dentes da frente com manchas e fratura" },
    after: { src: "/images/casos/sorriso-renovado-depois.jpg", width: 470, height: 257, alt: "Depois: dentes da frente restaurados, com forma e cor uniformes" },
  },
];

export const navLinks = [
  { href: "#tratamentos", label: "Tratamentos" },
  { href: "#resultados", label: "Resultados" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;
