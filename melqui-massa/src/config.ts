/**
 * CONFIGURAÇÃO DO SITE — Dr. Melqui Massa
 * ---------------------------------------------------------------
 * Todo o conteúdo variável do site mora aqui.
 * Regra: campo vazio ("" ou []) = o bloco correspondente NÃO aparece.
 * Nada de placeholder: se um dado não existe, ele simplesmente some.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Horario {
  dia: DiaSemana;
  nome: string;
  abre: string; // "09:00"
  fecha: string; // "19:30"
  /** Intervalo sem atendimento (almoço). Vazio = não há pausa informada. */
  pausa?: { inicio: string; fim: string };
}

export interface Atendimento {
  id: string;
  titulo: string;
  /** Rótulo usado no formulário e na mensagem de WhatsApp. */
  rotuloFormulario: string;
  /** Trecho usado em "gostaria de informações sobre {assunto}". */
  assunto: string;
  texto: string;
  detalhe?: string;
}

export interface Especialidade {
  nome: string;
  rqe: string;
}

export interface Foto {
  src: string;
  alt: string;
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex (o noindex fica também nos arquivos estáticos). */
  rascunho: true,

  /** URL pública absoluta. Usada em canonical, og:url e JSON-LD. Nunca localhost. */
  siteUrl: "https://melqui-massa-rascunho.vercel.app",

  nome: "Dr. Melqui Massa",
  nomeCurto: "Dr. Melqui",
  titulo: "Médico",

  /** Número do CRM. Vazio = não aparece. Ao preencher, surge ao lado do nome, no selo do hero, no bloco do médico e no rodapé. */
  crm: "",
  crmUF: "MG",

  /**
   * Especialidade só pode ser divulgada com RQE visível (Resolução CFM nº 2.336/2023).
   * Para ligar: preencha `especialidades` com nome + RQE e mude `mostrarEspecialidade` para true.
   */
  mostrarEspecialidade: false,
  especialidades: [] as Especialidade[],

  cidade: "Poços de Caldas",
  uf: "MG",

  endereco: {
    predio: "Edifício Unique",
    logradouro: "Av. Gentil Messías-Kitate, 240",
    complemento: "Sala 214",
    bairro: "Vila Cruz",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37701-528",
  },

  /** Somente dígitos, com DDI e DDD. */
  whatsapp: "5535998787242",
  whatsappExibicao: "(35) 99878-7242",
  /** Telefone fixo. Vazio = nenhum botão "Ligar". */
  telefone: "",

  instagram: {
    url: "https://www.instagram.com/psiquiatra_melquimassa/",
    /** Não exibido no site: o @ contém "psiquiatra", e a especialidade só pode aparecer com RQE. */
    usuario: "@psiquiatra_melquimassa",
  },

  mapsUrl: "https://maps.app.goo.gl/xoxoUoTaRR85w7X7A",
  /** Endereço usado no mapa incorporado (carregado só quando a pessoa pede). */
  mapsBusca: "Edifício Unique, Av. Gentil Messías-Kitate, 240, Vila Cruz, Poços de Caldas - MG, 37701-528",

  horarios: [
    { dia: 1, nome: "Segunda", abre: "09:00", fecha: "19:30" },
    { dia: 2, nome: "Terça", abre: "09:00", fecha: "18:00" },
    { dia: 3, nome: "Quarta", abre: "09:00", fecha: "19:30" },
    { dia: 4, nome: "Quinta", abre: "09:00", fecha: "18:00" },
    { dia: 5, nome: "Sexta", abre: "09:00", fecha: "19:30" },
  ] as Horario[],
  /** Dias listados como fechados na tabela de horários. */
  diasFechados: ["Sábado", "Domingo"],
  avisoHorarios: "Horários podem variar em feriados.",

  /** Foto do médico. Vazio = composição tipográfica com o traço do logo. */
  foto: null as Foto | null,

  /** Fotos do consultório (pasta public/fotos). Vazio = bloco some. */
  fotosConsultorio: [
    { src: "/fotos/consultorio-recepcao.jpg", alt: "Recepção do consultório, com balcão escuro e o nome Dr. Melqui Massa na parede" },
    { src: "/fotos/consultorio-sala.jpg", alt: "Sala do consultório com poltronas claras, mesa de madeira e parede verde" },
    { src: "/fotos/consultorio-espera.jpg", alt: "Sala de espera com cadeiras pretas, lustre e painel de madeira" },
    { src: "/fotos/consultorio-recepcao-2.jpg", alt: "Outra vista da recepção, com o balcão e as cadeiras de espera" },
  ] as Foto[],

  atendimentos: [
    {
      id: "adultos",
      titulo: "Adultos",
      rotuloFormulario: "Adultos",
      assunto: "atendimento para adultos",
      texto:
        "Consulta para quem sente que precisa de apoio e orientação médica em saúde mental. Começa por uma conversa sem pressa sobre a sua história, a sua rotina e o que trouxe você até aqui.",
    },
    {
      id: "adolescentes",
      titulo: "Adolescentes",
      rotuloFormulario: "Adolescentes (agendamento feito pelo responsável)",
      assunto: "atendimento para adolescentes",
      texto:
        "Atendimento ao adolescente com a participação do responsável. Há momentos de conversa em conjunto e momentos em que o adolescente é ouvido com reserva, sempre com o responsável informado do que é necessário.",
      detalhe: "O agendamento é feito pelo responsável.",
    },
    {
      id: "dependencia",
      titulo: "Dependência química",
      rotuloFormulario: "Dependência química",
      assunto: "atendimento em dependência química",
      texto:
        "Acolhimento e acompanhamento médico para a pessoa com dependência, sem julgamento. Familiares também podem procurar orientação sobre como apoiar e por onde começar.",
    },
    {
      id: "modalidades",
      titulo: "Presencial e online",
      rotuloFormulario: "",
      assunto: "as modalidades de consulta, presencial e online",
      texto:
        "As consultas acontecem no consultório, em Poços de Caldas, e também existe atendimento online. A modalidade de cada consulta é combinada pelo WhatsApp.",
    },
  ] as Atendimento[],

  agendamento: {
    exigirAtendimento: false,
    opcoesExtras: ["Ainda não sei, quero conversar"],
    modalidades: ["Presencial em Poços de Caldas", "Online"],
    maxObservacoes: 300,
  },

  /** Liga/desliga seções inteiras. */
  secoes: {
    hero: true,
    medico: true,
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
