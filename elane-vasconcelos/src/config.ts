/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou lista vazia) = o bloco correspondente NÃO aparece.
 */

export type Foto = {
  /** caminho base sem sufixo, ex.: "/img/espaco-sala" (gera -480 e -739/-880 .avif/.webp) */
  base: string;
  larguras: [number, number];
  /** proporção largura/altura da imagem */
  proporcao: number;
  alt: string;
};

export type Atendimento = {
  id: string;
  nome: string;
  rotulo: string;
  descricao: string[];
};

/** Faixas por dia da semana (0 = domingo ... 6 = sábado), formato "HH:MM". */
export type Horarios = Record<number, [string, string][]>;

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://elane-vasconcelos-rascunho.vercel.app",

  marca: {
    nome: "Elane Vasconcelos",
    descritor: "Estética e furo de orelha infantil",
    /** logo provisório criado para o rascunho; troque por "/logo-oficial.svg" quando houver */
    logoClaro: "/brand/logo-fundo-claro.svg",
    logoEscuro: "/brand/logo-fundo-escuro.svg",
  },

  /**
   * Título e registro: enquanto `registro` estiver vazio, o site não usa
   * nenhum título profissional. Preencha os três juntos quando confirmados.
   */
  profissional: {
    nome: "Elane Vasconcelos",
    titulo: "", // ex.: "Biomédica esteta"
    registro: "", // ex.: "CRBM-1 00000"
    formacao: [] as string[],
  },

  cidade: "São João da Boa Vista",
  uf: "SP",
  endereco: {
    rua: "R. Henrique Cabral de Vasconcelos, 1464",
    bairro: "Jardim São Nicolau",
    cidade: "São João da Boa Vista",
    uf: "SP",
    cep: "13876-100",
  },
  mapsUrl: "https://maps.app.goo.gl/y6QikzJkFhLq4dDR7",
  mapsEmbed:
    "https://www.google.com/maps?q=R.+Henrique+Cabral+de+Vasconcelos,+1464,+Jardim+S%C3%A3o+Nicolau,+S%C3%A3o+Jo%C3%A3o+da+Boa+Vista+-+SP,+13876-100&output=embed",

  whatsapp: "5519995745719",
  whatsappExibicao: "(19) 99574-5719",
  instagram: {
    url: "https://www.instagram.com/dra.elane.vasconcelos/",
    usuario: "@dra.elane.vasconcelos",
  },

  horarios: {
    0: [],
    1: [["08:00", "12:00"], ["14:00", "18:00"]],
    2: [["08:00", "12:00"], ["14:00", "18:00"]],
    3: [["08:00", "12:00"], ["14:00", "18:00"]],
    4: [["08:00", "12:00"], ["14:00", "18:00"]],
    5: [["08:00", "12:00"], ["14:00", "18:00"]],
    6: [["08:00", "12:00"]],
  } as Horarios,
  avisoHorarios: "Horários podem variar em feriados.",

  acessibilidade: "Entrada com acessibilidade para pessoas em cadeira de rodas",

  atendimentos: [
    {
      id: "estetica",
      nome: "Estética",
      rotulo: "Para você",
      descricao: [
        "Atendimento de estética com hora marcada, começando por uma conversa sobre o que você procura e o que é possível no seu caso.",
        "A indicação depende de avaliação individual.",
      ],
    },
    {
      id: "furo",
      nome: "Furo de orelha infantil",
      rotulo: "Para bebês e crianças",
      descricao: [
        "Atendimento voltado a bebês e crianças, com acolhimento para a criança e para quem a acompanha.",
        "Antes, conversamos com calma e explicamos cada etapa. A realização depende de avaliação individual.",
      ],
    },
  ] as Atendimento[],

  /** Procedimentos de estética: preencha quando forem informados (lista vazia = não aparece). */
  procedimentos: [] as string[],

  fotos: {
    /** Foto principal da profissional (hero). */
    hero: {
      base: "/img/elane-retrato",
      larguras: [480, 880],
      proporcao: 1080 / 1440,
      alt: "Elane Vasconcelos sentada à mesa do consultório, de jaleco branco, segurando um tablet",
    } as Foto | null,
    /** Foto do bloco "Sobre" (CONFIG.foto). */
    sobre: {
      base: "/img/elane-jaleco",
      larguras: [480, 880],
      proporcao: 1080 / 1440,
      alt: "Retrato de Elane Vasconcelos sorrindo, de óculos e jaleco branco",
    } as Foto | null,
    espaco: [
      {
        base: "/img/espaco-sala",
        larguras: [480, 739],
        proporcao: 739 / 549,
        alt: "Sala de atendimento clara, com maca coberta por manta rosa e marrom e móveis em madeira",
      },
      {
        base: "/img/espaco-recepcao",
        larguras: [480, 739],
        proporcao: 739 / 549,
        alt: "Recepção com mesa de madeira, estante e plantas, iluminada pela luz do dia",
      },
      {
        base: "/img/espaco-acolhimento",
        larguras: [480, 739],
        proporcao: 739 / 768,
        alt: "Bandeja de boas-vindas com chá em xícara rosa, biscoito e flores sobre mesa de madeira",
      },
    ] as Foto[],
  },

  /** Liga/desliga seções. Uma seção ligada só aparece se tiver conteúdo. */
  secoes: {
    hero: true,
    sobre: true,
    atendimentos: true,
    paraQuemAcompanha: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    contato: true,
    agendamento: true,
    ctaFinal: true,
  },

  agendamento: {
    exigirAtendimento: false,
    /** Urgência não se aplica a este negócio. */
    urgencia: false,
    opcoesExtras: ["Primeira avaliação", "Ainda não sei, quero conversar"],
  },

  mensagens: {
    geral: "Olá! Vi o site da Elane Vasconcelos e gostaria de agendar um atendimento.",
    porAtendimento: (nome: string) =>
      `Olá! Vi o site da Elane Vasconcelos e gostaria de informações sobre ${nome.toLowerCase()}.`,
    formulario: "Olá! Vim pelo site da Elane Vasconcelos e gostaria de solicitar um agendamento.",
  },
};

export const temRegistro = () => CONFIG.profissional.registro.trim() !== "";
