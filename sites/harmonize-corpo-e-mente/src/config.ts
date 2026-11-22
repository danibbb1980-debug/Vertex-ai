/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) = o bloco correspondente NÃO aparece no site.
 */

export type Atendimento = {
  id: string;
  nome: string;
  /** Uma descrição geral e conservadora, sem procedimento, produto, marca, prazo ou resultado. */
  descricao: string;
  /** Linha curta mostrada ao lado do nome no índice. */
  linha: string;
  ativo: boolean;
};

export type Foto = {
  /** Caminho base sem largura/extensão, ex.: "/img/recepcao" → /img/recepcao-640.webp e -1170.webp */
  src: string;
  larguras: number[];
  largura: number;
  altura: number;
  alt: string;
  legenda?: string;
};

export type Horario = {
  /** 0 = domingo ... 6 = sábado */
  dia: number;
  abre: string; // "08:00"
  fecha: string; // "18:00"
  pausa?: { inicio: string; fim: string };
};

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://harmonize-corpo-e-mente-rascunho.vercel.app",

  nome: "Harmonize Corpo e Mente",
  cidade: "Varginha",
  uf: "MG",

  /** Preencha só com dados confirmados: nome completo, título e registro no conselho. */
  responsavel: {
    nome: "",
    titulo: "",
    registro: "",
  },

  endereco: {
    rua: "Rua Santa Cruz, 739",
    bairro: "Centro",
    cidade: "Varginha",
    uf: "MG",
    cep: "37002-089",
  },

  whatsapp: "5535988045410",
  whatsappExibicao: "(35) 98804-5410",
  usarWhatsapp: true,

  instagram: {
    usuario: "@harmonizecorpomente",
    url: "https://www.instagram.com/harmonizecorpomente/",
  },

  telefone: "",
  email: "",

  funcionamento: "Atendimento somente com hora marcada, de segunda a sábado.",
  fechado: "Domingo: fechado",
  /** Deixe vazio enquanto não houver horários confirmados por dia. */
  horarios: [] as Horario[],
  diasFechados: [0],

  logo: {
    tinta: "/img/logo-tinta.webp",
    areia: "/img/logo-areia.webp",
    cores: "/img/logo-cores.webp",
    largura: 897,
    altura: 277,
  },

  atendimentos: [
    {
      id: "estetica",
      nome: "Estética facial e corporal",
      linha: "Pele e corpo",
      descricao:
        "Atendimento de estética voltado ao cuidado da pele e do corpo. Antes de qualquer sessão há uma conversa de avaliação individual, para entender o que você procura e o que é adequado ao seu caso.",
      ativo: true,
    },
    {
      id: "psicanalise",
      nome: "Psicanálise clínica",
      linha: "Escuta individual",
      descricao:
        "Atendimento psicanalítico individual, em sessões com hora marcada. Um espaço reservado de escuta e fala, no ritmo de cada pessoa.",
      ativo: true,
    },
    {
      id: "pericias",
      nome: "Perícias grafotécnicas e forenses extrajudiciais",
      linha: "Particulares e empresas",
      descricao:
        "Perícias solicitadas por particulares e empresas, fora do âmbito judicial. O primeiro passo é um contato descrevendo o tipo de documento ou situação; os detalhes são combinados diretamente.",
      ativo: true,
    },
    {
      id: "emagrecimento",
      nome: "Emagrecimento saudável",
      linha: "Acompanhamento",
      descricao: "",
      ativo: false,
    },
  ] as Atendimento[],

  /** Fotos do espaço enviadas pela cliente (perfil comercial). Lista vazia = seção sem fotos. */
  fotos: [
    {
      src: "/img/recepcao",
      larguras: [420, 640, 1170],
      largura: 1170,
      altura: 872,
      alt: "Recepção do Harmonize com balcão, poltronas rosadas e o logotipo na parede",
      legenda: "Recepção",
    },
    {
      src: "/img/sala-ampla",
      larguras: [320, 600],
      largura: 600,
      altura: 872,
      alt: "Mesa de atendimento em tampo marmorizado com luminária pendente de lâmpadas aparentes",
      legenda: "Mesa de conversa",
    },
    {
      src: "/img/sala-atendimento",
      larguras: [420, 640, 1170],
      largura: 1170,
      altura: 872,
      alt: "Sala de atendimento com mesa clara, cadeira branca e duas poltronas azuis",
      legenda: "Sala de atendimento",
    },
    {
      src: "/img/sala-procedimentos",
      larguras: [420, 640, 1170],
      largura: 1170,
      altura: 872,
      alt: "Sala de estética com maca reclinável, pia e armários claros",
      legenda: "Sala de estética",
    },
    {
      src: "/img/sala-equipamentos",
      larguras: [420, 640, 1170],
      largura: 1170,
      altura: 1542,
      alt: "Sala com maca reclinável e aparelhos de estética junto à parede",
      legenda: "Sala de estética corporal",
    },
  ] as Foto[],

  /** Foto de perfil enviada pela cliente. Aparece sem nome enquanto o responsável não for preenchido. */
  retrato: {
    src: "/img/retrato",
    larguras: [320, 480, 760],
    largura: 760,
    altura: 760,
    alt: "Retrato da profissional responsável pelo Harmonize, de blazer branco",
  } as Foto | null,

  secoes: {
    atendimentos: true,
    espaco: true,
    comoFunciona: true,
    duvidas: true,
    local: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo && a.descricao);

export const responsavelPreenchido = () =>
  Boolean(CONFIG.responsavel.nome && CONFIG.responsavel.titulo && CONFIG.responsavel.registro);

const MSG_GERAL = "Olá! Vi o site do Harmonize Corpo e Mente e gostaria de agendar um atendimento.";

export const linkWhatsapp = (texto: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const linkWhatsappAtendimento = (nome: string) =>
  linkWhatsapp(
    `Olá! Vi o site do Harmonize Corpo e Mente e gostaria de agendar um atendimento de ${nome.toLowerCase()}.`,
  );

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`;
};

export const linkComoChegar = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoLinha())}`;

export const linkMapaEmbed = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(enderecoLinha())}&output=embed`;
