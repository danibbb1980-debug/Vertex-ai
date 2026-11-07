/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) ou ausente = o bloco correspondente não aparece no site.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dia: DiaSemana
  nome: string
  /** "HH:MM". Vazio = fechado. */
  abre: string
  fecha: string
  /** Pausa (ex.: almoço). Vazio = sem pausa. */
  pausaInicio?: string
  pausaFim?: string
}

export interface Atendimento {
  id: string
  nome: string
  /** Como o nome aparece no meio de uma frase ("informações sobre ...") */
  nomeFrase: string
  resumo: string
  descricao: string
}

export interface Formacao {
  curso: string
  instituicao: string
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Mude para false ao publicar. */
  rascunho: true,

  /** URL pública definitiva (sem barra no final). Usada em canonical, og:url e og:image. */
  siteUrl: 'https://juliana-borges-rascunho.vercel.app',

  nome: 'Juliana Borges',
  descritor: 'Massoterapeuta | Beleza e Estética',
  titulo: 'Massoterapeuta e depiladora',
  cidade: 'São João da Boa Vista',
  uf: 'SP',

  whatsapp: '5519992155482',
  whatsappExibicao: '(19) 99215-5482',
  instagram: 'https://www.instagram.com/ju_borgesestetica/',
  instagramUsuario: '@ju_borgesestetica',
  maps: 'https://maps.app.goo.gl/8mUM6ccSu8UtWSgJ6',

  endereco: {
    rua: 'R. Santa Maria, 640',
    bairro: 'Jardim São Paulo',
    cidade: 'São João da Boa Vista',
    uf: 'SP',
    cep: '13875-029',
  },

  horarios: [
    { dia: 1, nome: 'Segunda-feira', abre: '11:00', fecha: '19:00' },
    { dia: 2, nome: 'Terça-feira', abre: '11:00', fecha: '19:00' },
    { dia: 3, nome: 'Quarta-feira', abre: '11:00', fecha: '19:00' },
    { dia: 4, nome: 'Quinta-feira', abre: '11:00', fecha: '19:00' },
    { dia: 5, nome: 'Sexta-feira', abre: '11:00', fecha: '19:00' },
    { dia: 6, nome: 'Sábado', abre: '08:00', fecha: '14:00' },
    { dia: 0, nome: 'Domingo', abre: '', fecha: '' },
  ] as Horario[],
  avisoHorarios: 'Horários podem variar em feriados.',

  formacao: [
    { curso: 'Curso técnico de Massoterapia', instituicao: 'UNIFEOB' },
    { curso: 'Curso de Depilação', instituicao: 'SENAI' },
  ] as Formacao[],

  /**
   * Formações citadas no Instagram sem curso/instituição informados.
   * NÃO aparecem no site. Quando forem confirmadas (com instituição), mova para `formacao`.
   */
  formacaoPendente: ['Eletroterapias', 'Tratamentos faciais', 'Pós-operatório'],

  atendimentos: [
    {
      id: 'massoterapia',
      nome: 'Massoterapia',
      nomeFrase: 'massoterapia',
      resumo: 'Atendimento de massoterapia, realizado com avaliação prévia.',
      descricao:
        'A massoterapia reúne técnicas manuais aplicadas ao corpo, conduzidas por quem tem formação na área. O atendimento começa com uma conversa sobre o que você procura.',
    },
    {
      id: 'depilacao',
      nome: 'Depilação',
      nomeFrase: 'depilação',
      resumo: 'Atendimento de depilação, realizado com avaliação prévia.',
      descricao:
        'A depilação retira os pelos de regiões do corpo escolhidas por você. A forma de fazer é definida no atendimento, depois da avaliação.',
    },
    {
      id: 'estetica',
      nome: 'Estética facial e corporal',
      nomeFrase: 'estética facial e corporal',
      resumo: 'Atendimentos de estética para face e corpo, definidos após conversa e avaliação.',
      descricao:
        'Cuidados de estética para o rosto e para o corpo. O que fazer é combinado com você, a partir de uma conversa e de uma avaliação individual.',
    },
  ] as Atendimento[],
  avisoIndicacao: 'A indicação depende de avaliação individual.',

  /** Fotos em /public/img. Deixe "" para não exibir. */
  fotos: {
    retrato: 'juliana',
    espaco: [
      { src: 'espaco-sala', alt: 'Sala de atendimento com maca, bancada e mesa de apoio, em tons claros' },
      { src: 'espaco-maca', alt: 'Maca coberta com lençol branco, ao lado de prateleiras com produtos' },
      { src: 'espaco-recepcao', alt: 'Mesa de atendimento com cadeira branca e certificados na parede' },
    ],
  },

  agendamento: {
    exigirAtendimento: false,
    limiteObservacoes: 300,
    /** Intervalo entre horários sugeridos no formulário, em minutos */
    intervalo: 60,
    /** Duração mínima do último bloco antes do fechamento, em minutos */
    ultimoBlocoAntesDoFechamento: 60,
  },

  mensagens: {
    geral: 'Olá! Vi o site da Juliana Borges e gostaria de agendar um atendimento.',
    porAtendimento: (nomeFrase: string) =>
      `Olá! Vi o site da Juliana Borges e gostaria de informações sobre ${nomeFrase}.`,
    solicitacao: 'Olá! Vim pelo site da Juliana Borges e gostaria de solicitar um agendamento.',
  },

  /** Liga/desliga seções. Uma seção ligada só aparece se tiver conteúdo. */
  secoes: {
    hero: true,
    horariosDestaque: true,
    sobre: true,
    atendimentos: true,
    antesDeAgendar: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
    marquee: true,
  },
}

export type Config = typeof CONFIG
