/**
 * Todos os dados do site ficam aqui. Campo vazio ("" ou lista vazia) = não aparece no site.
 * Veja o README.md para instruções de edição.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Horario {
  dia: DiaSemana;
  nome: string;
  abre: string; // "HH:MM" ou "" para fechado
  fecha: string;
}

export interface Atendimento {
  id: string;
  nome: string;
  descricao: string;
  areas?: string; // opcional: áreas informadas pelo negócio
}

export interface Profissional {
  nome: string;
  cargo: string;
  formacao: string; // vazio = não renderiza
  registro: string; // vazio = não renderiza
  foto: string; // caminho em /public (sem extensão e sem largura), vazio = sem foto
  fotoAlt: string;
}

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://pellofinn-rascunho.vercel.app",

  nome: "PelloFinn",
  descritor: "Depilação a Laser e Estética",
  /** Caminho de um logo oficial em /public (SVG ou PNG em alta). Vazio = usa o logotipo recriado. */
  logo: "",

  endereco: {
    rua: "Rua Coronel João Urbano, nº 117",
    bairro: "Centro",
    cidade: "Varginha",
    uf: "MG",
    cep: "37002-350",
  },
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Cel.%20Jo%C3%A3o%20Urbano%2C%20117%2C%20Centro%2C%20Varginha%20-%20MG",
  mapaEmbed:
    "https://www.google.com/maps?q=R.%20Cel.%20Jo%C3%A3o%20Urbano%2C%20117%2C%20Centro%2C%20Varginha%20-%20MG&output=embed",

  whatsapp: "5535988520126",
  whatsappExibicao: "(35) 98852-0126",
  usarWhatsapp: true,
  email: "",
  instagram: "https://www.instagram.com/elianapellofinn/",
  instagramUsuario: "@elianapellofinn",

  horarios: [
    { dia: 1, nome: "Segunda", abre: "09:00", fecha: "18:00" },
    { dia: 2, nome: "Terça", abre: "07:30", fecha: "19:00" },
    { dia: 3, nome: "Quarta", abre: "07:30", fecha: "19:00" },
    { dia: 4, nome: "Quinta", abre: "07:30", fecha: "19:00" },
    { dia: 5, nome: "Sexta", abre: "07:30", fecha: "19:00" },
    { dia: 6, nome: "Sábado", abre: "07:30", fecha: "14:00" },
    { dia: 0, nome: "Domingo", abre: "", fecha: "" },
  ] as Horario[],
  avisoHorarios: "Horários podem variar em feriados.",

  atendimentos: [
    {
      id: "depilacao-a-laser",
      nome: "Depilação a laser",
      descricao:
        "Atendimento de depilação a laser conduzido a partir de uma conversa inicial sobre o que você procura e de uma avaliação da pele e dos pelos.",
    },
    {
      id: "micropigmentacao",
      nome: "Micropigmentação",
      descricao:
        "Atendimento de micropigmentação planejado com você, com o desenho e o tom conversados antes de qualquer procedimento.",
      areas: "Sobrancelhas, olhos e lábios",
    },
    {
      id: "remocao-de-tatuagem",
      nome: "Remoção de tatuagem",
      descricao:
        "O atendimento começa com uma avaliação individual da tatuagem. O que é possível em cada caso é conversado nessa avaliação.",
    },
  ] as Atendimento[],

  profissionais: [
    {
      nome: "Eliana Pellofinn",
      cargo: "Esteticista · Proprietária",
      formacao: "",
      registro: "",
      foto: "/fotos/eliana-pellofinn",
      fotoAlt: "Retrato de Eliana Pellofinn, esteticista e proprietária da PelloFinn",
    },
    {
      nome: "Lethicia Labadia",
      cargo: "Depilação a laser",
      formacao: "",
      registro: "",
      foto: "/fotos/lethicia-labadia",
      fotoAlt: "Retrato de Lethicia Labadia, que conduz os atendimentos de depilação a laser",
    },
  ] as Profissional[],

  /** Responsável técnico (nome e registro). Vazio = não aparece. */
  responsavelTecnico: "",

  secoes: {
    atendimento: true,
    atendimentos: true,
    equipe: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const MSG_GERAL = "Olá! Vi o site da PelloFinn e gostaria de agendar uma avaliação.";
export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site da PelloFinn e gostaria de agendar uma avaliação sobre ${nome.toLowerCase()}.`;
export const waLink = (msg: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

export const enderecoCompleto = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};

/** Horários de início em blocos de 1 h, terminando até o fechamento. */
export function blocosDoDia(dia: number): string[] {
  const h = CONFIG.horarios.find((x) => x.dia === dia);
  if (!h || !h.abre) return [];
  const toMin = (s: string) => {
    const [a, b] = s.split(":").map(Number);
    return a * 60 + b;
  };
  const out: string[] = [];
  for (let m = toMin(h.abre); m + 60 <= toMin(h.fecha); m += 60) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export const fmtHora = (s: string) => s.replace(":", "h");
