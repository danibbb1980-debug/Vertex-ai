/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) = o bloco correspondente NÃO aparece no site.
 * Veja o README.md para instruções de edição.
 */

export type Horario = {
  /** 0 = domingo, 1 = segunda ... 6 = sábado */
  dia: number;
  nome: string;
  /** "08:00" ou "" quando fechado */
  abre: string;
  fecha: string;
};

export type Atendimento = { nome: string; descricao: string };
export type Curso = { nome: string; descricao: string };
export type Foto = { src: string; alt: string };

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Mude para false ao publicar. */
  rascunho: true,

  /** URL pública absoluta, sem barra no final (canonical, og:url, JSON-LD). */
  siteUrl: "https://euflania-rascunho.vercel.app",

  nome: "Euflânia",
  descritor: "Centro Estético e Cursos",
  cargo: "Esteticista",

  /** Nome pessoal da profissional. Não informado: não aparece. */
  nomeProfissional: "",
  /** Ex.: "CRBM 0000" ou registro equivalente. Não informado: não aparece. */
  registro: "",
  /** Responsável técnico exibido no rodapé. Vazio: não aparece. */
  responsavelTecnico: "",
  /** Tempo de atuação (conflito entre fontes, ver README). Vazio: não aparece. */
  anosAtuacao: "",
  email: "",
  telefoneFixo: "",

  /** Logo original em alta resolução (ex.: "/logo.svg"). Vazio: usa o logotipo recriado em SVG. */
  logo: { claro: "", escuro: "" },

  /** Número no formato internacional, só dígitos. */
  whatsapp: "5535988393741",
  whatsappExibicao: "(35) 98839-3741",
  usarWhatsapp: true,

  instagram: "https://www.instagram.com/esteticistaeuflania/",
  instagramUsuario: "@esteticistaeuflania",

  endereco: {
    rua: "Rua Xingu, nº 251",
    bairro: "Santana",
    cidade: "Varginha",
    uf: "MG",
    cep: "37048-630",
    ruaSchema: "Rua Xingu, 251",
  },
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Xingu%2C%20251%2C%20Santana%2C%20Varginha%20-%20MG",
  mapaEmbed:
    "https://www.google.com/maps?q=R.%20Xingu%2C%20251%2C%20Santana%2C%20Varginha%20-%20MG%2C%2037048-630&output=embed",

  horarios: [
    { dia: 1, nome: "Segunda-feira", abre: "08:00", fecha: "21:00" },
    { dia: 2, nome: "Terça-feira", abre: "08:00", fecha: "21:00" },
    { dia: 3, nome: "Quarta-feira", abre: "08:00", fecha: "21:00" },
    { dia: 4, nome: "Quinta-feira", abre: "08:00", fecha: "21:00" },
    { dia: 5, nome: "Sexta-feira", abre: "08:00", fecha: "21:00" },
    { dia: 6, nome: "Sábado", abre: "08:00", fecha: "15:00" },
    { dia: 0, nome: "Domingo", abre: "", fecha: "" },
  ] as Horario[],
  avisoHorarios: "Horários podem variar em feriados.",

  /** Lista fácil de ampliar: cada item vira uma linha numerada e uma opção no formulário. */
  atendimentos: [
    {
      nome: "Estética corporal",
      descricao:
        "Os atendimentos são definidos em uma avaliação individual, a partir do que você procura e do que for observado no encontro.",
    },
  ] as Atendimento[],

  /** Vazio: a seção Cursos, o link no menu e a opção do formulário não aparecem. */
  cursos: [] as Curso[],

  /** Formação (confirmada pelo cliente em 16/11/2026). Vazio: seção some. */
  formacao: [
    "Formada em Estética pelo Senac",
    "Graduada pela Unifran",
    "Pós-graduada em Estética Avançada",
  ] as string[],

  /** Foto da profissional (seção Formação). Vazio (src: ""): não aparece. */
  fotoProfissional: {
    src: "/fotos/profissional.jpg",
    webp: "/fotos/profissional.webp",
    largura: 550,
    altura: 976,
    alt: "Esteticista da Euflânia, de jaleco branco, no espaço de atendimento",
  },

  /** Fotos autorizadas (ex.: { src: "/fotos/espaco-1.jpg", alt: "..." }). Vazio: nada aparece. */
  fotos: [] as Foto[],

  /** Liga/desliga seções (só renderizam se também tiverem conteúdo). */
  secoes: {
    atendimento: true,
    esteticaCorporal: true,
    formacao: true,
    cursos: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },

  seo: {
    title: "Euflânia | Estética Corporal em Varginha - MG",
    description:
      "Estética corporal em Varginha - MG, com avaliação individual. Atendimento de segunda a sábado, em horário estendido. Agende pelo WhatsApp.",
  },
};

export const mensagens = {
  geral: "Olá! Vi o site da Euflânia e gostaria de agendar uma avaliação.",
  atendimento: (nome: string) =>
    `Olá! Vi o site da Euflânia e gostaria de agendar uma avaliação sobre ${nome.toLowerCase()}.`,
  curso: (nome: string) => `Olá! Vi o site da Euflânia e gostaria de saber mais sobre ${nome}.`,
};
