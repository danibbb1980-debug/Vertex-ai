/**
 * Clínica União | Pouso Alegre - MG
 * Todos os dados do site ficam aqui. Campo vazio, lista vazia ou `null` = o bloco
 * correspondente NÃO aparece no site (o layout se reorganiza sozinho).
 * Fonte dos dados atuais: ficha do Google Maps e bio do Instagram.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Expediente {
  abre: string // "08:00"
  fecha: string // "19:00"
  /** Intervalo de almoço, se a clínica informar. Hoje não informado. */
  almoco?: { inicio: string; fim: string }
}

export interface Atendimento {
  id: string
  nome: string
  /** Nome usado nas mensagens de WhatsApp, em minúsculas quando cabe na frase. */
  nomeMensagem: string
  descricao: string
  icone: 'estetica' | 'implante' | 'reabilitacao' | 'canal' | 'ortodontia' | 'crianca' | 'face'
}

export interface Dentista {
  nome: string
  cro: string // ex.: "CRO-MG 00000"
  /** Só preencha especialidade com registro no CFO; o número aparece junto. */
  especialidade?: string
  registroEspecialidade?: string
  formacao?: string
  foto?: string // caminho em /public, ex.: "/img/equipe/nome.webp"
}

export interface Foto {
  src: string
  alt: string
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Ao publicar de forma definitiva: false. */
  rascunho: true,

  /** URL pública absoluta, sem barra no final. Usada em canonical, og:url e og:image. */
  siteUrl: 'https://clinica-uniao-rascunho.vercel.app',

  nome: 'Clínica União',
  nomeCompleto: 'Clínica União | Pouso Alegre - MG',

  endereco: {
    logradouro: 'Av. Dr. Lisboa, 57',
    bairro: 'Centro',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37550-109',
  },

  /** Exibido no site e usado no botão de ligar. */
  telefone: '(35) 3425-9465',
  telefoneE164: '+553534259465',
  /**
   * Número usado no wa.me (só dígitos, com 55 + DDD).
   * ATENÇÃO: foi informado como WhatsApp, mas tem formato de telefone fixo.
   * Confirmar com a clínica antes de publicar (ver README).
   */
  whatsapp: '553534259465',

  instagram: {
    url: 'https://www.instagram.com/clinica_uniao_pousoalegre/',
    usuario: '@clinica_uniao_pousoalegre',
  },
  mapsUrl: 'https://maps.app.goo.gl/rzD5rxmh1wN4jr838',
  mapsEmbedQuery: 'Av. Dr. Lisboa, 57 - Centro, Pouso Alegre - MG, 37550-109',

  /** Horários por dia da semana (0 = domingo). `null` = fechado. Fonte: Google. */
  horarios: {
    0: null,
    1: { abre: '08:00', fecha: '19:00' },
    2: { abre: '08:00', fecha: '19:00' },
    3: { abre: '08:00', fecha: '19:00' },
    4: { abre: '08:00', fecha: '19:00' },
    5: { abre: '08:00', fecha: '19:00' },
    6: { abre: '09:00', fecha: '14:00' },
  } as Record<DiaSemana, Expediente | null>,
  avisoHorario: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'estetica-do-sorriso',
      nome: 'Estética do sorriso',
      nomeMensagem: 'estética do sorriso',
      descricao:
        'Cuidados com a cor, a forma e a proporção dos dentes, planejados a partir da saúde da gengiva e da mordida.',
      icone: 'estetica',
    },
    {
      id: 'implantes-dentarios',
      nome: 'Implantes dentários',
      nomeMensagem: 'implantes dentários',
      descricao:
        'Uma forma de repor dentes perdidos: uma peça fixada no osso serve de base para a prótese. A viabilidade é definida após exame clínico e de imagem.',
      icone: 'implante',
    },
    {
      id: 'reabilitacao-oral',
      nome: 'Reabilitação oral',
      nomeMensagem: 'reabilitação oral',
      descricao:
        'Um planejamento que combina próteses, restaurações e outros cuidados com o objetivo de restabelecer a mastigação e a fala.',
      icone: 'reabilitacao',
    },
    {
      id: 'endodontia',
      nome: 'Endodontia (canal)',
      nomeMensagem: 'endodontia (tratamento de canal)',
      descricao:
        'Tratamento da parte interna do dente, a polpa, indicado em casos como inflamação ou infecção, com o objetivo de preservar o dente.',
      icone: 'canal',
    },
    {
      id: 'ortodontia',
      nome: 'Ortodontia (aparelhos)',
      nomeMensagem: 'ortodontia (aparelhos)',
      descricao:
        'Acompanhamento do alinhamento dos dentes e do encaixe entre as arcadas, com o tipo de aparelho escolhido conforme cada caso.',
      icone: 'ortodontia',
    },
    {
      id: 'odontopediatria',
      nome: 'Odontopediatria',
      nomeMensagem: 'odontopediatria',
      descricao:
        'Atendimento voltado a crianças e adolescentes, com orientação à família sobre higiene, alimentação e hábitos.',
      icone: 'crianca',
    },
    {
      id: 'harmonizacao-facial',
      nome: 'Harmonização facial',
      nomeMensagem: 'harmonização facial',
      descricao:
        'Procedimentos na face realizados por cirurgião-dentista, dentro dos limites definidos pelo Conselho Federal de Odontologia. A conversa inicial serve para entender expectativas e avaliar se há indicação.',
      icone: 'face',
    },
  ] as Atendimento[],

  estrutura: {
    banheiroAcessivel: true, // banheiro com acessibilidade para cadeirantes (Google)
    horaMarcadaRecomendada: true,
    /** Entrada e assento acessíveis: NÃO informados. Preencha true só se a clínica confirmar. */
    entradaAcessivel: false,
  },
  pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],

  /** Ainda não informados: deixe vazio para não aparecer. */
  dentistas: [] as Dentista[],
  responsavelTecnico: null as null | { nome: string; cro: string },
  /** Fotos manuais. Fotos colocadas em ./referencias/fotos/ também aparecem automaticamente. */
  fotos: [] as Foto[],

  agendamento: {
    exigirAtendimento: false,
    /** true só se a clínica fizer atendimento de urgência (pronto-socorro). */
    urgencia: false,
    duracaoBlocoMin: 60,
  },

  /** Liga/desliga cada seção da página. */
  secoes: {
    clinica: true,
    atendimentos: true,
    equipe: true, // só aparece se houver dentistas
    galeria: true, // só aparece se houver fotos
    quandoProcurar: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
}

export type Config = typeof CONFIG
