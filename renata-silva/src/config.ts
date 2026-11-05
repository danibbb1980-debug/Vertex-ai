/**
 * Todos os dados do site ficam aqui. Regra de ouro: campo vazio ("" ou [])
 * não aparece. O componente ou a seção some e o layout se reorganiza.
 * Veja o README para o passo a passo de edição.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Horario {
  dias: DiaSemana[];
  rotulo: string; // como aparece no site
  abre: string; // "08:00"
  fecha: string; // "21:00"
  /** Intervalo sem atendimento (ex.: almoço). Deixe vazio se não houver. */
  pausa?: { inicio: string; fim: string };
}

export interface Atendimento {
  id: string;
  nome: string;
  frente: "facial" | "corporal";
  descricao: string;
  /** Grupo B: só aparece com mostrarProcedimentosMedicos = true. */
  medico?: boolean;
}

export interface Foto {
  arquivo: string; // nome-base em /public/img (gera .avif e .webp via npm run assets)
  alt: string;
  legenda: string;
  largura: number;
  altura: number;
}

import { PROCEDIMENTOS_MEDICOS } from "./procedimentos-medicos.ts";

/**
 * Procedimentos do grupo B. Exigem profissional habilitada com registro em
 * conselho preenchido em CONFIG.profissional.registro. Mantenha false até lá.
 * (Fica fora do objeto para o build descartar a lista quando estiver false.)
 */
export const MOSTRAR_PROCEDIMENTOS_MEDICOS = false;

export const AVALIACAO = "A indicação depende de avaliação individual.";

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex nas metas. */
  rascunho: true,

  /** URL pública, sem barra no final. Usada em canonical, og:url e JSON-LD. */
  siteUrl: "https://renata-silva-estetica-rascunho.vercel.app",

  nome: "Renata Silva Estética Avançada",
  nomeCurto: "Renata Silva",
  cidade: "Poços de Caldas",
  uf: "MG",

  endereco: {
    rua: "R. Luiz Fernandes, 465",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37705-020",
  },

  /** Só dígitos, com DDI e DDD. */
  whatsapp: "5535991674340",
  telefoneExibicao: "(35) 99167-4340",

  instagram: {
    url: "https://www.instagram.com/renatasilvaesteticavancada/",
    usuario: "@renatasilvaesteticavancada",
  },

  mapsUrl: "https://maps.app.goo.gl/HcfFH32nnDUsYf7Q9",
  mapsEmbed:
    "https://maps.google.com/maps?q=R.%20Luiz%20Fernandes%2C%20465%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037705-020&z=16&output=embed",

  horarios: [
    { dias: [1, 2, 3, 4, 5], rotulo: "Segunda a sexta", abre: "08:00", fecha: "21:00" },
    { dias: [6], rotulo: "Sábado", abre: "08:00", fecha: "18:00" },
  ] as Horario[],
  /** Dias sem atendimento, como aparecem na lista de horários. */
  fechado: [{ dias: [0] as DiaSemana[], rotulo: "Domingo" }],
  avisoHorarios: "Horários podem variar em feriados.",

  /**
   * Profissional. Foto e nome aparecem sempre que houver foto. Título e formação SÓ aparecem com o registro preenchido
   * (ex.: registro: "CRM-MG 00000"). Sem registro, o site apresenta só a clínica.
   */
  profissional: {
    nome: "Renata Silva",
    titulo: "",
    registro: "",
    formacao: "",
    bio: "",
    /** Retrato da profissional (aparece mesmo sem registro, só com o nome, sem título). */
    foto: {
      arquivo: "renata-silva",
      alt: "Renata Silva sorrindo, de blazer rosa e blusa escura, em fundo azul-marinho",
      legenda: "Renata Silva",
      largura: 960,
      altura: 1280,
    } as Foto | null,
  },

  mostrarProcedimentosMedicos: MOSTRAR_PROCEDIMENTOS_MEDICOS,

  /** Cursos particulares: sem detalhes confirmados, a seção não existe. */
  mostrarCursos: false,
  cursos: [] as { titulo: string; descricao: string }[],

  atendimentos: [
    // Facial
    {
      id: "ultrassom-microfocado",
      nome: "Ultrassom microfocado",
      frente: "facial",
      descricao:
        "Tecnologia que aplica energia de ultrassom de forma focalizada na pele. Área, intervalo e cuidados são definidos e explicados na avaliação.",
    },
    {
      id: "bb-glow",
      nome: "BB Glow",
      frente: "facial",
      descricao:
        "Técnica facial que associa um microagulhamento superficial a um produto com pigmento leve. Antes, conversamos sobre sua pele e seus cuidados diários.",
    },
    {
      id: "micropigmentacao",
      nome: "Micropigmentação",
      frente: "facial",
      descricao:
        "Técnica que deposita pigmento na camada superficial da pele, usada por exemplo nas sobrancelhas. Formato e tom são combinados com você antes de começar.",
    },
    // Corporal
    {
      id: "criomodele-hd",
      nome: "Criomodele HD",
      frente: "corporal",
      descricao:
        "Atendimento corporal com tecnologia. Na avaliação, explicamos como funciona, quais áreas podem ser tratadas e se ele é indicado para você.",
    },
    {
      id: "sculpt-dermo-firm",
      nome: "Sculpt Dermo Firm",
      frente: "corporal",
      descricao:
        "Atendimento corporal com tecnologia. A avaliação considera sua pele e seu histórico antes de qualquer indicação, com cada etapa explicada.",
    },
    {
      id: "estrias",
      nome: "Tratamento para estrias",
      frente: "corporal",
      descricao:
        "Atendimento voltado às estrias, com a técnica escolhida depois de observar a pele, a região e o seu histórico.",
    },
    {
      id: "depilacao-led",
      nome: "Depilação a LED",
      frente: "corporal",
      descricao:
        "Depilação feita com um aparelho de luz. Antes de começar, a avaliação considera o tom da pele, o tipo de pelo e os cuidados de cada sessão.",
    },
    // Grupo B (src/procedimentos-medicos.ts) entra só com MOSTRAR_PROCEDIMENTOS_MEDICOS = true
    ...(MOSTRAR_PROCEDIMENTOS_MEDICOS ? PROCEDIMENTOS_MEDICOS : []),
  ] as Atendimento[],

  avisoAvaliacao: AVALIACAO,

  /**
   * Fotos do ambiente (sem pessoas). Vêm de ./referencias/fotos, tratadas
   * por `npm run assets`. Lista vazia = o site segue só com direção de arte.
   */
  fotosClinica: [
    {
      arquivo: "sala-de-atendimento",
      alt: "Sala de atendimento com maca branca, persiana clara, aparelho de estética, mesa e painel de madeira ripada",
      legenda: "Sala de atendimento",
      largura: 960,
      altura: 1260,
    },
    {
      arquivo: "consultorio",
      alt: "Consultório com mesa branca, painéis de madeira ripada, quadros, parede com papel florido e bancada com pia",
      legenda: "Consultório",
      largura: 960,
      altura: 1260,
    },
  ] as Foto[],

  /** Foto do bloco de contato (ambiente, sem pessoas). null = não aparece. */
  fotoContato: {
    arquivo: "recepcao",
    alt: "Recepção da clínica com paredes rosadas, viga de madeira escura, balcão de madeira ripada, cristaleira com produtos e banco de madeira",
    legenda: "Recepção",
    largura: 960,
    altura: 1260,
  } as Foto | null,

  /** Formulário "Solicitar agendamento" (só monta a mensagem e abre o WhatsApp). */
  agendamento: {
    exigirAtendimento: false,
    limiteObservacoes: 300,
    /** Mostra o aviso de urgência. Só para clínicas de pronto atendimento. */
    urgencia: false,
  },

  mensagens: {
    geral: "Olá! Vi o site da Renata Silva Estética Avançada e gostaria de agendar uma avaliação.",
    atendimento: (nome: string) =>
      `Olá! Vi o site da Renata Silva Estética Avançada e gostaria de informações sobre ${nome}.`,
    agendamentoAbertura:
      "Olá! Vim pelo site da Renata Silva Estética Avançada e gostaria de solicitar um agendamento.",
  },

  /** Liga/desliga seções. Uma seção ligada sem conteúdo também não aparece. */
  secoes: {
    clinica: true,
    atendimentos: true,
    comoFunciona: true,
    antesDeAgendar: true,
    duvidas: true,
    contato: true,
    agendamento: true,
    ctaFinal: true,
    marquee: true,
  },
};

export type Config = typeof CONFIG;

/** Frases da faixa em movimento abaixo do hero (sem promessas). */
export const atendimentosMarquee = [
  "Avaliação individual",
  "Estética facial",
  "Estética corporal",
  "Atendimento com hora marcada",
  "Tecnologias explicadas",
  `${CONFIG.cidade} - ${CONFIG.uf}`,
];
