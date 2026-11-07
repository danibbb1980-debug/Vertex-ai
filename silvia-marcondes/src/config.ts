// Todos os dados do site ficam aqui. Campo vazio ("") ou lista vazia = o bloco não aparece.
// Fonte dos dados: ficha do Google Maps e bio do Instagram (ver README).

export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export type Horario = {
  dias: Dia[];
  rotulo: string; // como aparece no site
  abre: string; // "HH:MM"
  fecha: string; // "HH:MM"
};

export type Atendimento = {
  id: string;
  nome: string;
  resumo: string;
  apoio: string;
  // Preencher quando a profissional informar. Vazio = não aparece.
  detalhes: string;
};

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://silvia-marcondes-rascunho.vercel.app",

  marca: {
    nome: "Silvia Marcondes",
    descritor: "Estética",
    nomeCompleto: "Silvia Marcondes Estética",
  },

  profissional: {
    nome: "Silvia Marcondes",
    descritor: "Esteticista",
    // Campos prontos, ainda sem informação confirmada. Vazio = não aparece.
    titulo: "",
    formacao: "",
    registro: "",
    tempoAtuacao: "",
    foto: {
      // Caminho base sem extensão e sem largura: /img/silvia-{480|720|960}.{avif|webp}
      base: "/img/silvia",
      larguras: [480, 720, 960],
      largura: 960,
      altura: 1200,
      alt: "Silvia Marcondes, esteticista, sorrindo, com blusa azul-clara.",
    } as { base: string; larguras: number[]; largura: number; altura: number; alt: string } | null,
  },

  // Número informado: 019999037811. Precisa ser confirmado com a profissional.
  whatsapp: "5519999037811",
  whatsappExibicao: "(19) 99903-7811",
  telefoneSchema: "+55-19-99903-7811",

  instagram: {
    url: "https://www.instagram.com/sil_esteticista/",
    usuario: "@sil_esteticista",
  },

  maps: {
    link: "https://maps.app.goo.gl/rTAWCtR2ob2ALab68",
    embedQuery: "R. Nossa Sra. dos Anjos, 45 - São Benedito, São João da Boa Vista - SP, 13871-027",
  },

  endereco: {
    rua: "R. Nossa Sra. dos Anjos, 45",
    bairro: "São Benedito",
    cidade: "São João da Boa Vista",
    uf: "SP",
    cep: "13871-027",
    referencia: "Próximo ao Campo de Futebol Palmeiras e ao portão 2 do Clube da Esportiva.",
  },

  acessibilidade: "Entrada com acessibilidade para pessoas em cadeira de rodas",

  horarios: [
    { dias: [1, 2, 3, 4, 5], rotulo: "Segunda a sexta", abre: "06:30", fecha: "21:00" },
    { dias: [6], rotulo: "Sábado", abre: "07:00", fecha: "11:00" },
    { dias: [0], rotulo: "Domingo", abre: "07:00", fecha: "11:00" },
  ] as Horario[],
  avisoHorarios: "Horários podem variar em feriados.",

  atendimentos: [
    {
      id: "depilacao",
      nome: "Depilação",
      resumo: "Atendimento estético de remoção de pelos, com avaliação prévia.",
      apoio: "Antes de começar, a região é avaliada e você pode tirar todas as suas dúvidas com calma.",
      detalhes: "",
    },
    {
      id: "limpeza-de-pele",
      nome: "Limpeza de pele",
      resumo: "Cuidado estético de higienização da pele, com avaliação prévia.",
      apoio: "A avaliação ajuda a entender as características da sua pele antes do atendimento.",
      detalhes: "",
    },
    {
      id: "dermaplaning",
      nome: "Dermaplaning",
      resumo: "Procedimento estético facial, realizado após avaliação.",
      apoio: "Na conversa inicial, você entende como ele funciona e se faz sentido para você.",
      detalhes: "",
    },
  ] as Atendimento[],
  avisoIndicacao: "A indicação depende de avaliação individual.",

  agendamento: {
    exigirAtendimento: false,
    duracaoBlocoMin: 60,
    opcoesExtras: ["Ainda não sei, quero conversar"],
    mensagemInicial:
      "Olá! Vim pelo site da Silvia Marcondes Estética e gostaria de solicitar um agendamento.",
  },

  mensagens: {
    geral: "Olá! Vi o site da Silvia Marcondes Estética e gostaria de agendar um atendimento.",
    porAtendimento: (nome: string) =>
      `Olá! Vi o site da Silvia Marcondes Estética e gostaria de informações sobre ${nome.toLowerCase()}.`,
  },

  // Liga/desliga cada seção. Seções sem conteúdo não aparecem mesmo ligadas.
  secoes: {
    horarios: true,
    sobre: true,
    atendimentos: true,
    antesDeAgendar: true,
    comoFunciona: true,
    estrutura: true,
    faq: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
    marquee: true,
  },
};

export type Config = typeof CONFIG;
