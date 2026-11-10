/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" / [] / null) = o bloco correspondente não aparece no site.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Horario {
  dia: DiaSemana;
  abre: string; // "09:00"
  fecha: string; // "18:00"
  almoco?: { inicio: string; fim: string } | null;
}

export interface Atendimento {
  id: string;
  titulo: string;
  subtitulo: string;
  /** Como o atendimento aparece na mensagem do WhatsApp ("...informações sobre {nomeMensagem}") */
  nomeMensagem: string;
  resumo: string;
  avaliado: string;
  acompanhamento: string;
}

export interface Foto {
  src: string;
  srcSmall?: string;
  width: number;
  height: number;
  alt: string;
}

export interface Especialidade {
  nome: string;
  rqe: string;
}

export interface Unidade {
  nome: string;
  cidade: string;
  whatsapp: string;
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Mude para false só na publicação definitiva. */
  rascunho: true,

  /** URL absoluta do site publicado (usada em canonical, og:url e og:image). */
  siteUrl: "https://palti-massa-rascunho.vercel.app",

  nome: "Dr. Palti Massa",
  nomeCurto: "Dr. Palti",
  titulo: "Médico",
  crm: { numero: "58249", uf: "MG" },

  /** CRM-SP aparece no Instagram. Só é exibido se mostrarCrmSP = true. */
  crmSP: "198120",
  mostrarCrmSP: false,

  /**
   * Títulos de especialista exigem RQE (regra do CFM). Enquanto mostrarEspecialidades = false,
   * nenhum texto do site cita as especialidades. Para ligar: preencha os números de RQE e mude para true.
   */
  mostrarEspecialidades: false,
  especialidades: [
    { nome: "Nutrologia", rqe: "" },
    { nome: "Medicina Esportiva", rqe: "" },
  ] as Especialidade[],

  cidade: "Poços de Caldas",
  uf: "MG",
  endereco: {
    rua: "Av. Gentil Messías-Kitate, 240",
    complemento: "Sala 217",
    bairro: "Centro",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37701-023",
  },

  /** Somente números, com DDI e DDD. */
  whatsapp: "5535998446911",
  whatsappExibicao: "(35) 99844-6911",
  /** Sem telefone fixo: nenhum botão "Ligar" aparece. */
  telefone: "",
  telefoneExibicao: "",

  instagram: { url: "https://www.instagram.com/dr.paltimassa/", usuario: "@dr.paltimassa" },
  mapsUrl: "https://maps.app.goo.gl/oQqBt2ZuNZaqZe2ZA",
  /** Endereço usado no mapa incorporado (carregado só quando o visitante pede). */
  mapsEmbedQuery: "Av. Gentil Messías-Kitate, 240, Centro, Poços de Caldas - MG, 37701-023",

  horarios: [
    { dia: 1, abre: "09:00", fecha: "18:00", almoco: null },
    { dia: 2, abre: "09:00", fecha: "18:00", almoco: null },
    { dia: 3, abre: "09:00", fecha: "18:00", almoco: null },
    { dia: 4, abre: "09:00", fecha: "18:00", almoco: null },
    { dia: 5, abre: "09:00", fecha: "18:00", almoco: null },
  ] as Horario[],
  avisoHorarios: "Os horários podem variar em feriados.",

  /** Foto do médico. Deixe null para usar a composição gráfica no lugar. */
  foto: {
    src: "/fotos/dr-palti-massa-735.webp",
    srcSmall: "/fotos/dr-palti-massa-480.webp",
    width: 735,
    height: 736,
    alt: "Dr. Palti Massa em pé, diante do balcão da recepção do consultório, com o nome na parede ao fundo",
  } as Foto | null,

  /** Fotos do consultório. Lista vazia = a galeria não aparece. */
  fotosConsultorio: [
    {
      src: "/fotos/recepcao-739.webp",
      srcSmall: "/fotos/recepcao-480.webp",
      width: 739,
      height: 486,
      alt: "Recepção do consultório, com balcão de mármore e painel de madeira com o nome Dr. Palti Massa",
    },
    {
      src: "/fotos/sala-de-atendimento-739.webp",
      srcSmall: "/fotos/sala-de-atendimento-480.webp",
      width: 739,
      height: 486,
      alt: "Sala de atendimento, com mesa de trabalho, cadeiras e janela ampla com luz natural",
    },
  ] as Foto[],

  /** Dados ainda não informados: ficam vazios e não aparecem. */
  formacao: [] as string[],
  convenios: [] as string[],

  atendimentos: [
    {
      id: "emagrecimento",
      titulo: "Emagrecimento",
      subtitulo: "Redução de peso com acompanhamento",
      nomeMensagem: "emagrecimento",
      resumo:
        "Acompanhamento médico para quem deseja reduzir o peso com orientação e segurança, respeitando a sua rotina e a sua história de saúde.",
      avaliado:
        "Histórico de saúde, hábitos, rotina, alimentação, sono, atividade física e exames, quando houver.",
      acompanhamento:
        "Consultas de retorno para rever o plano, tirar dúvidas e fazer os ajustes que a avaliação indicar.",
    },
    {
      id: "hipertrofia",
      titulo: "Hipertrofia",
      subtitulo: "Ganho de massa muscular",
      nomeMensagem: "hipertrofia (ganho de massa muscular)",
      resumo:
        "Acompanhamento médico para quem deseja ganhar massa muscular com segurança, alinhando treino, alimentação e saúde.",
      avaliado:
        "Rotina de treinos, alimentação, recuperação, sono, histórico de saúde e exames, quando houver.",
      acompanhamento:
        "Retornos periódicos para acompanhar a evolução e ajustar o plano conforme a avaliação médica.",
    },
  ] as Atendimento[],

  primeiraConsulta: {
    titulo: "Primeira consulta",
    nomeMensagem: "a primeira consulta",
    texto:
      "Uma conversa com tempo para entender seus objetivos, seu histórico e sua rotina. Ao final, o médico explica com clareza os caminhos possíveis e como será o acompanhamento.",
    itens: ["Conversa sobre objetivos e histórico", "Avaliação clínica", "Plano explicado com clareza"],
  },

  /** Outras unidades citadas no Instagram. Desligado até confirmação. */
  mostrarOutrasUnidades: false,
  outrasUnidades: [
    { nome: "Clínica Lavie", cidade: "Ribeirão Preto - SP", whatsapp: "5535997351815" },
    { nome: "Clínica Lumibe", cidade: "Andradas - MG", whatsapp: "5535997351815" },
  ] as Unidade[],

  agendamento: {
    exigirAtendimento: false,
    mensagemInicial: "Olá, Dr. Palti! Vim pelo site e gostaria de solicitar um agendamento.",
    limiteObservacoes: 300,
  },

  mensagens: {
    geral: "Olá, Dr. Palti! Vi seu site e gostaria de agendar uma consulta.",
    porAtendimento: (nome: string) =>
      `Olá, Dr. Palti! Vi seu site e gostaria de informações sobre ${nome}.`,
  },

  /** Liga/desliga seções inteiras. Uma seção sem conteúdo também não aparece. */
  secoes: {
    medico: true,
    marquee: true,
    atendimentos: true,
    paraQuem: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export type Config = typeof CONFIG;

export const DIAS_NOMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export const crmTexto = () => `CRM-${CONFIG.crm.uf} ${CONFIG.crm.numero}`;

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}${e.complemento ? `, ${e.complemento}` : ""}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};

export const waLink = (mensagem: string = CONFIG.mensagens.geral, numero = CONFIG.whatsapp) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

/** Especialidades exibíveis: só com flag ligada E número de RQE preenchido. */
export const especialidadesVisiveis = () =>
  CONFIG.mostrarEspecialidades ? CONFIG.especialidades.filter((e) => e.nome && e.rqe) : [];
