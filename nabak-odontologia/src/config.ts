/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("", [] ou ausente) = o bloco correspondente NÃO aparece.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dia: DiaSemana
  abre: string // "09:00"
  fecha: string // "18:30"
  almoco?: { inicio: string; fim: string }
}

export interface Atendimento {
  id: string
  nome: string
  resumo: string
  descricao: string
  icone: 'implante' | 'estetica' | 'clinica'
}

export interface Foto {
  /** caminho sem a largura, ex.: "/fotos/equipe-consultorio" (precisa de -480.webp, -800.webp e -1100.webp) */
  base: string
  alt: string
  largura: number
  altura: number
}

export interface Profissional {
  nome: string
  formacao?: string
  cro?: string
  foto?: Foto
}

export const CONFIG = {
  /** Mostra a faixa de rascunho e aplica noindex nas metas. */
  rascunho: true,

  /** URL pública absoluta, sem barra no final. Usada em canonical, og:url e og:image. */
  siteUrl: 'https://nabak-odontologia-rascunho.vercel.app',

  nome: 'Nabak Odontologia',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  endereco: {
    rua: 'R. Bom Jesus, 634',
    bairro: 'Centro',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37550-002',
  },

  /** Somente dígitos, com DDI e DDD. Conferir antes de publicar (ver README). */
  whatsapp: '5535991182910',
  telefoneExibicao: '(35) 99118-2910',

  instagram: 'https://www.instagram.com/nabakodontologia/',
  instagramUsuario: '@nabakodontologia',
  mapsUrl: 'https://maps.app.goo.gl/qLVbXxTAa19xGxZM6',

  horarios: [
    { dia: 1, abre: '09:00', fecha: '18:30' },
    { dia: 2, abre: '09:00', fecha: '18:30' },
    { dia: 3, abre: '09:00', fecha: '18:30' },
    { dia: 4, abre: '09:00', fecha: '18:30' },
    { dia: 5, abre: '09:00', fecha: '18:30' },
  ] as Horario[],
  avisoHorarios: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'implantes',
      nome: 'Implantes dentários',
      resumo: 'Reposição de dentes perdidos com planejamento a partir de exames.',
      descricao:
        'O implante é uma peça que substitui a raiz de um dente perdido e serve de base para a prótese. Antes de qualquer etapa, avaliamos a saúde da boca, a estrutura óssea e os exames, para explicar com clareza se o implante é uma opção para o seu caso.',
      icone: 'implante',
    },
    {
      id: 'estetica',
      nome: 'Estética',
      resumo: 'Cuidado com a aparência dos dentes, com proporção e naturalidade.',
      descricao:
        'A odontologia estética trata de forma, cor e alinhamento dos dentes. O ponto de partida é uma conversa sobre o que incomoda você, seguida de uma avaliação para entender quais caminhos fazem sentido e quais limites existem.',
      icone: 'estetica',
    },
    {
      id: 'clinica-geral',
      nome: 'Clínica geral',
      resumo: 'Consultas de rotina, prevenção e acompanhamento da saúde bucal.',
      descricao:
        'A clínica geral cuida da base: avaliação periódica, limpeza, prevenção e tratamento de cáries e outras alterações. É também por onde começa a orientação para tratamentos mais específicos, quando necessários.',
      icone: 'clinica',
    },
  ] as Atendimento[],

  acessibilidade: [
    'Entrada acessível para pessoas em cadeira de rodas',
    'Assento acessível para pessoas em cadeira de rodas',
    'Banheiro acessível para pessoas em cadeira de rodas',
  ],
  estrutura: ['Banheiro', 'Atendimento com hora marcada (recomendado agendar)'],
  pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],

  /** Vazio hoje: a seção de equipe não aparece. Preencha para exibir. */
  profissionais: [] as Profissional[],

  /** Obrigatório para a publicação definitiva (CFO). Vazio = não aparece. */
  responsavelTecnico: { nome: '', cro: '' },

  /** Fotos do ambiente e da equipe (sem pacientes). Vazio = composições só com ilustração. */
  fotos: [
    {
      base: '/fotos/equipe-consultorio',
      alt: 'Equipe da Nabak Odontologia no consultório',
      largura: 1440,
      altura: 1911,
    },
    {
      base: '/fotos/profissional-consultorio',
      alt: 'Profissional da Nabak Odontologia sentado na cadeira do consultório',
      largura: 1448,
      altura: 1929,
    },
    {
      base: '/fotos/profissional-retrato',
      alt: 'Profissional da Nabak Odontologia em retrato no consultório',
      largura: 2049,
      altura: 2727,
    },
  ] as Foto[],

  agendamento: {
    exigirAtendimento: false,
    /** true apenas para clínicas de urgência (pronto-socorro). */
    urgencia: false,
    duracaoBlocoMin: 60,
    limiteObservacoes: 300,
  },

  secoes: {
    marquee: true,
    clinica: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    acessibilidade: true,
    equipe: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export type Config = typeof CONFIG

export const NOMES_DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const

export const enderecoCompleto = (c: Config = CONFIG) =>
  `${c.endereco.rua} - ${c.endereco.bairro}, ${c.endereco.cidade} - ${c.endereco.uf}, ${c.endereco.cep}`
