/**
 * CONFIGURAÇÃO ÚNICA DO SITE
 * --------------------------------------------------------------
 * Tudo o que aparece no site sai daqui. Regra: campo vazio ("" ou [])
 * = a parte correspondente NÃO aparece. Preencha e ela surge sozinha.
 * Fontes dos dados atuais: ficha do Google Maps e perfil do Instagram.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Expediente {
  abre: string // "09:00"
  fecha: string // "18:00"
  /** Intervalo de almoço, se a clínica informar. Ex.: ["12:00", "13:00"] */
  almoco?: [string, string]
}

/** Um item por dia da semana. `null` = fechado. */
export type Horarios = Record<DiaSemana, Expediente | null>

export interface Unidade {
  id: string
  /** Nome curto usado no seletor e nas mensagens. */
  nome: string
  /** Rótulo da marca, como no logo. */
  rotulo: string
  endereco: {
    logradouro: string
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
  /** Somente dígitos, com DDI e DDD. */
  whatsapp: string
  /** Telefone exibido (formatado). */
  telefoneExibicao: string
  mapsUrl: string
  horarios: Horarios
  observacaoHorarios: string
  /** Foto da fachada, para reconhecer o local (opcional). */
  fachada?: Foto
}

export interface Atendimento {
  titulo: string
  descricao: string
}

export interface Profissional {
  nome: string
  cro: string
  formacao?: string
  foto?: string
}

export interface Foto {
  /** Arquivo principal (em /public). */
  src: string
  /** Versões em outros tamanhos, no formato do atributo srcset (opcional). */
  srcset?: string
  alt: string
  legenda?: string
  largura: number
  altura: number
}

const horariosFoch: Horarios = {
  0: null,
  1: { abre: '09:00', fecha: '18:00' },
  2: { abre: '09:00', fecha: '18:00' },
  3: { abre: '09:00', fecha: '18:00' },
  4: { abre: '09:00', fecha: '18:00' },
  5: { abre: '09:00', fecha: '18:00' },
  6: null,
}

export const CONFIG = {
  /** Liga a faixa "Rascunho" e o noindex nas metas. */
  rascunho: true,

  /** URL pública final, sem barra no fim. Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://clinica-dental-foch-rascunho.vercel.app',

  nome: 'Clínica Dental',
  posicionamento: 'Odontologia para toda a família',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  instagram: {
    url: 'https://www.instagram.com/clinicadentalpousoalegre/',
    usuario: '@clinicadentalpousoalegre',
  },

  logo: {
    src: '/brand/logo-clinica-dental.jpg',
    alt: 'Clínica Dental, Unidade 1, Foch',
    largura: 150,
    altura: 150,
  },

  /**
   * Unidades. Com UMA, o site se comporta como site de unidade única.
   * Com DUAS ou mais, aparecem o seletor no topo, a seção "Unidades"
   * e o campo "Unidade" no formulário de agendamento.
   */
  unidades: [
    {
      id: 'foch',
      nome: 'Foch',
      rotulo: 'Unidade 1 · Foch',
      endereco: {
        logradouro: 'Av. Pref. Olavo Gomes de Oliveira, 1850',
        bairro: 'Cidade Foch',
        cidade: 'Pouso Alegre',
        uf: 'MG',
        cep: '37550-000',
      },
      whatsapp: '5535999298789',
      telefoneExibicao: '(35) 99929-8789',
      mapsUrl: 'https://maps.app.goo.gl/Z4YYAnGNd3zr9gsP9',
      horarios: horariosFoch,
      observacaoHorarios: 'Horários podem variar em feriados.',
      fachada: {
        src: '/fotos/fachada-203.webp',
        alt: 'Fachada da Clínica Dental em verde-azulado, com letreiro e bandeira na calçada',
        largura: 203,
        altura: 434,
      },
    },
  ] as Unidade[],

  /** Atendimentos confirmados pela clínica. Vazio = seção "Como cuidamos" no lugar. */
  atendimentos: [] as Atendimento[],

  /** Profissionais. Vazio = seção de equipe não aparece. */
  profissionais: [] as Profissional[],

  /** Exigência do CFO: preencher antes da publicação definitiva. */
  responsavelTecnico: '',
  cro: '',

  /** Fotos reais da clínica (coloque os arquivos em /public/fotos). Vazio = sem galeria. */
  fotos: [
    {
      src: '/fotos/consultorio-1200.webp',
      srcset: '/fotos/consultorio-640.webp 640w, /fotos/consultorio-1200.webp 1088w',
      alt: 'Consultório com cadeira odontológica azul, bancada e janela com persiana',
      legenda: 'Consultório',
      largura: 1088,
      altura: 836,
    },
    {
      src: '/fotos/recepcao-640.webp',
      alt: 'Recepção com balcão de madeira clara e parede cinza com o letreiro Clínica Dental',
      legenda: 'Recepção',
      largura: 598,
      altura: 680,
    },
    {
      src: '/fotos/equipe-1200.webp',
      srcset: '/fotos/equipe-640.webp 640w, /fotos/equipe-1200.webp 944w',
      alt: 'Três integrantes da equipe sorrindo em frente ao letreiro Clínica Dental',
      legenda: 'Equipe',
      largura: 944,
      altura: 898,
    },
  ] as Foto[],

  estrutura: {
    acessibilidade: ['Entrada acessível para cadeirantes', 'Banheiro acessível para cadeirantes'],
    horaMarcada: true,
    pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],
  },

  /** Se a clínica fizer atendimento de urgência, mude para true. */
  urgencia: false,

  agendamento: {
    exigirAtendimento: false,
    limiteObservacoes: 300,
  },

  /** {unidade} é trocado pelo nome da unidade escolhida. */
  mensagemWhatsapp:
    'Olá! Vi o site da Clínica Dental (Unidade {unidade}) e gostaria de agendar uma avaliação.',

  /** Liga/desliga seções inteiras. */
  secoes: {
    clinica: true,
    atendimento: true,
    paraQuem: true,
    comoFunciona: true,
    estrutura: true,
    equipe: true,
    galeria: true,
    unidades: true,
    faq: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export type Config = typeof CONFIG
