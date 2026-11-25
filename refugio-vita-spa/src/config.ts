/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ('' ou lista vazia) = o bloco correspondente não aparece.
 */

export type Faixa = { inicio: string; fim: string } // "08:00"

export type Atendimento = {
  id: string
  nome: string
  descricao: string
  ativo: boolean
  /** nome do arquivo em public/fotos (sem -480.webp), opcional */
  foto?: string
}

export type Foto = {
  arquivo: string
  largura: number
  altura: number
  alt: string
  legenda: string
}

const endereco = {
  rua: 'Rua Benedito Kuhl',
  numero: '689',
  bairro: 'Vila Claudia',
  cidade: 'Limeira',
  uf: 'SP',
  cep: '13480-410',
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Lembre de tirar o noindex de public/_headers, vercel.json e robots.txt ao publicar. */
  rascunho: true,
  /** Abertura animada (cortina). Desligada por padrão. */
  intro: false,
  siteUrl: 'https://refugio-vita-spa-rascunho.vercel.app',

  nome: 'Refúgio Vita Spa',
  nomeCurto: 'Refúgio Vita',
  descritor: 'Spa e estética',

  /** Só o nome. Sem título, cargo ou formação até que sejam confirmados. */
  responsavel: 'Viviane Martins',
  /** Foto da responsável (arquivo em public/fotos). '' = não exibe. */
  responsavelFoto: 'viviane-martins',
  responsavelFotoAlt: 'Viviane Martins sentada ao lado da banheira, no Refúgio Vita Spa.',

  endereco,
  enderecoLinha: `${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`,
  mapsUrl: 'https://maps.app.goo.gl/Fiom3ShGKzJBtHYq9',
  rotaUrl:
    'https://www.google.com/maps/dir/?api=1&destination=R.%20Benedito%20Kuhl%2C%20689%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-410',
  mapaEmbedUrl:
    'https://www.google.com/maps?q=R.%20Benedito%20Kuhl%2C%20689%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-410&output=embed',

  usarWhatsapp: true,
  whatsapp: '5519992167352',
  whatsappExibicao: '(19) 99216-7352',
  telefoneFixo: '',
  email: '',

  instagram: {
    usuario: '@refugio_vita_spa',
    url: 'https://www.instagram.com/refugio_vita_spa/',
  },

  /** Faixas de funcionamento por dia (0 = domingo … 6 = sábado), fuso America/Sao_Paulo. */
  fuso: 'America/Sao_Paulo',
  horarios: {
    0: [],
    1: [{ inicio: '08:00', fim: '12:00' }],
    2: [{ inicio: '08:00', fim: '19:00' }],
    3: [{ inicio: '08:00', fim: '12:00' }],
    4: [{ inicio: '16:00', fim: '19:00' }],
    5: [
      { inicio: '08:00', fim: '12:00' },
      { inicio: '16:00', fim: '19:00' },
    ],
    6: [{ inicio: '08:00', fim: '13:00' }],
  } as Record<number, Faixa[]>,
  avisoFeriados: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'limpeza-de-pele',
      nome: 'Limpeza de pele',
      descricao:
        'Cuidado com a pele do rosto. Antes de começar, conversamos sobre a sua pele e sobre o que você procura.',
      ativo: true,
      foto: 'limpeza-de-pele',
    },
    {
      id: 'drenagem-linfatica',
      nome: 'Drenagem linfática',
      descricao:
        'Atendimento corporal, conduzido no ritmo de cada pessoa e ajustado ao que for conversado antes de começar.',
      ativo: true,
      foto: 'sala-atendimento',
    },
    {
      id: 'massagem-relaxante',
      nome: 'Massagem relaxante',
      descricao:
        'Uma pausa no meio do dia. A pressão e o ritmo são combinados com cada pessoa.',
      ativo: true,
      foto: 'sala-massagem',
    },
    // Desligados até a confirmação da habilitação e de como podem ser anunciados.
    {
      id: 'pos-operatorio-pos-parto',
      nome: 'Pós-operatório e pós-parto',
      descricao: '',
      ativo: false,
    },
    { id: 'ventosaterapia', nome: 'Ventosaterapia', descricao: '', ativo: false },
  ] as Atendimento[],

  /** Fotos autorizadas do espaço (geradas por `npm run fotos` a partir de referencias/fotos). Lista vazia = seção some. */
  fotos: [
    {
      arquivo: 'sala-atendimento',
      largura: 978,
      altura: 1725,
      alt: 'Sala de atendimento com maca coberta por lençol branco, teto de madeira aparente e luminárias de palha acesas.',
      legenda: 'Sala de atendimento',
    },
    {
      arquivo: 'banheira',
      largura: 1164,
      altura: 1620,
      alt: 'Banheira oval branca junto a janelas de madeira, com um roupão pendurado e chinelos no chão.',
      legenda: 'Banheira',
    },
    {
      arquivo: 'recepcao',
      largura: 1164,
      altura: 651,
      alt: 'Recepção com duas poltronas, aparador de madeira com café e parede de tijolos aparentes.',
      legenda: 'Recepção',
    },
    {
      arquivo: 'bandeja-preparo',
      largura: 994,
      altura: 1771,
      alt: 'Toalha bordada com o logo do Refúgio Vita Spa e uma bandeja de madeira com dois potes e dois frascos.',
      legenda: 'Antes de começar',
    },
    {
      arquivo: 'poltrona',
      largura: 1164,
      altura: 1534,
      alt: 'Canto com poltrona clara, banqueta, mesa lateral com flores e um recipiente com pedrinhas sobre tapete de crochê.',
      legenda: 'Canto da sala',
    },
    {
      arquivo: 'sala-massagem',
      largura: 1164,
      altura: 1551,
      alt: 'Sala com maca, toalhas dobradas, poltrona e banqueta ao fundo, sob luz de luminária de palha.',
      legenda: 'Sala de massagem',
    },
  ] as Foto[],

  /** Dimensões das fotos usadas fora da galeria. */
  dimensoesFotos: {
    'limpeza-de-pele': [1144, 1627],
    'sala-atendimento': [978, 1725],
    'sala-massagem': [1164, 1551],
    'viviane-martins': [1038, 1719],
  } as Record<string, [number, number]>,

  /** Logo vetorizado a partir do original (scripts/vetorizar-logo.py). */
  logo: {
    horizontal: '/logo-horizontal-escuro.svg', // header, sobre o branco
    vertical: '/logo-vertical-escuro.svg', // hero, sobre o branco
    verticalOuro: '/logo-vertical-ouro.svg', // rodapé e blocos verdes
  },

  secoes: {
    atendimentos: true,
    espaco: true,
    horarios: true,
    casa: true,
    comoFunciona: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo)
