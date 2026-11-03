/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("", [] ou null) = o bloco correspondente NÃO aparece no site.
 * Fonte dos dados atuais: ficha do Google Maps e bio do Instagram da clínica.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo ... 6 = sábado

export interface Horario {
  dias: DiaSemana[]
  rotulo: string
  abre: string // "HH:MM"
  fecha: string // "HH:MM"
  almoco?: { inicio: string; fim: string } | null
}

export interface Atendimento {
  nome: string
  descricao: string
}

export interface Profissional {
  nome: string
  cro: string
  formacao?: string
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" no topo. Ao publicar de verdade, mude para false (ver README). */
  rascunho: true,

  /** URL pública do site, sem barra no final. Usada em canonical, og:url e og:image. */
  siteUrl: 'https://odonto-prevent-rascunho.vercel.app',

  nome: 'Odonto Prevent',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  endereco: {
    rua: 'Av. Dr. João Beraldo, 358',
    bairro: 'Centro',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37550-088',
  },

  mapsUrl: 'https://maps.app.goo.gl/cnaZit4AFHdGmau86',
  /** Busca usada no mapa incorporado (carrega só quando a pessoa clica). */
  mapsEmbedQuery: 'Odonto Prevent, Av. Dr. João Beraldo, 358 - Centro, Pouso Alegre - MG, 37550-088',

  instagram: 'https://www.instagram.com/odonto.prevent/',
  instagramHandle: '@odonto.prevent',

  /**
   * WhatsApp só com números (55 + DDD + número).
   * A bio informa "(35) 8877-2603"; o 9 inicial foi acrescentado por padrão de celular.
   * CONFERIR com a clínica antes de publicar.
   */
  whatsapp: '5535988772603',
  telefone: '(35) 3200-6462',

  mensagemWhatsapp: 'Olá! Vi o site da Odonto Prevent e gostaria de agendar uma avaliação.',

  /** Só os dias informados. Domingo não foi informado, então não aparece. */
  horarios: [
    { dias: [1, 2, 3, 4, 5], rotulo: 'Segunda a sexta', abre: '08:00', fecha: '19:00', almoco: null },
    { dias: [6], rotulo: 'Sábado', abre: '08:30', fecha: '13:00', almoco: null },
  ] as Horario[],
  avisoHorarios: 'Horários podem variar em feriados.',

  estrutura: {
    entradaAcessivel: true,
    banheiroAcessivel: true,
    agendamento: true,
  },

  pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação'],

  /** Atendimentos confirmados pela clínica. Vazio = cartões e opções do formulário não aparecem. */
  atendimentos: [] as Atendimento[],

  /** Dentistas com nome e CRO. Vazio = seção não aparece. */
  profissionais: [] as Profissional[],

  /** Responsável técnico (exigido pelo CFO para publicação definitiva). */
  responsavelTecnico: { nome: '', cro: '' },

  /** true só se a clínica fizer atendimento de urgência. */
  urgencia: false,

  agendamento: {
    exigirAtendimento: false,
    limiteObservacoes: 300,
  },

  /** Liga/desliga cada seção. Mesmo ligada, a seção só aparece se tiver conteúdo. */
  secoes: {
    faixa: true,
    clinica: true,
    profissionais: true,
    prevencao: true,
    calendario: true,
    comoFunciona: true,
    estrutura: true,
    fotos: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
}

export type Config = typeof CONFIG
