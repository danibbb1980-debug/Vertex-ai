// Todos os dados do site ficam aqui. Campo vazio ou ausente = o bloco não aparece.

export type Area = 'cabelo' | 'rosto' | 'corpo' | 'depilacao'

export interface Atendimento {
  id: string
  ativo: boolean
  area: Area
  /** Nome do atendimento, como aparece no índice. */
  nome: string
  /** Palavra curta usada na ficha e na mensagem do WhatsApp. */
  rotulo: string
  /** Como a área entra na frase "uma avaliação de ...". */
  naFrase: string
  descricao: string
}

export interface Horario {
  /** 0 = domingo ... 6 = sábado */
  dia: number
  abre: string
  fecha: string
}

export interface Foto {
  src: string
  alt: string
  largura: number
  altura: number
}

export const CONFIG = {
  rascunho: true,
  intro: false,
  usarWhatsapp: true,

  siteUrl: 'https://homenz-limeira-rascunho.vercel.app',

  nome: 'Homenz Limeira',
  marca: 'Homenz',
  cidadeCurta: 'Limeira',
  descritor: 'Estética para homens',

  // Profissional responsável: vazio até a clínica confirmar nome e registro.
  responsavel: { nome: '', registro: '' },

  endereco: {
    rua: 'Avenida Antonio Ometto',
    numero: '841',
    bairro: 'Vila Claudia',
    cidade: 'Limeira',
    uf: 'SP',
    cep: '13480-470',
  },
  mapsUrl: 'https://maps.app.goo.gl/uoU6hQGcuJewM7CC9',
  rotaUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Av.%20Antonio%20Ometto%2C%20841%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-470',
  mapaEmbed:
    'https://www.google.com/maps?q=Av.%20Antonio%20Ometto%2C%20841%2C%20Vila%20Claudia%2C%20Limeira%20-%20SP%2C%2013480-470&output=embed',

  whatsapp: '5519990188717',
  whatsappExibicao: '(19) 99018-8717',
  telefoneFixo: '',
  email: '',

  instagram: { usuario: '@homenz.limeira', url: 'https://www.instagram.com/homenz.limeira/' },

  fusoHorario: 'America/Sao_Paulo',
  horarios: [
    { dia: 1, abre: '10:00', fecha: '19:00' },
    { dia: 2, abre: '10:00', fecha: '19:00' },
    { dia: 3, abre: '10:00', fecha: '19:00' },
    { dia: 4, abre: '10:00', fecha: '19:00' },
    { dia: 5, abre: '10:00', fecha: '19:00' },
    { dia: 6, abre: '08:00', fecha: '12:00' },
  ] as Horario[],
  avisoFeriados: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'capilar',
      ativo: true,
      area: 'cabelo',
      nome: 'Cuidados capilares',
      rotulo: 'Cabelo',
      naFrase: 'cabelo',
      descricao:
        'Uma avaliação individual para orientar o cuidado com o cabelo e o couro cabeludo, de acordo com o que você observa e com o que a avaliação mostrar.',
    },
    {
      id: 'facial',
      ativo: true,
      area: 'rosto',
      nome: 'Estética facial',
      rotulo: 'Rosto',
      naFrase: 'rosto',
      descricao:
        'Cuidado com a pele do rosto, começando por uma avaliação individual que define o que faz sentido para a sua pele e a sua rotina.',
    },
    {
      id: 'corporal',
      ativo: true,
      area: 'corpo',
      nome: 'Estética corporal',
      rotulo: 'Corpo',
      naFrase: 'corpo',
      descricao:
        'Atendimento corporal com avaliação individual antes de qualquer indicação, para entender o que você procura e o que é possível fazer.',
    },
    {
      id: 'depilacao',
      ativo: true,
      area: 'depilacao',
      nome: 'Depilação',
      rotulo: 'Depilação',
      naFrase: 'depilação',
      descricao:
        'Depilação para homens, com conversa prévia sobre as áreas de interesse e orientação sobre o que esperar do atendimento.',
    },
  ] as Atendimento[],

  // Fotos autorizadas pela clínica (ambiente, fachada). Vazio = nenhuma foto aparece.
  fotos: [] as Foto[],

  secoes: {
    atendimentos: true,
    clinica: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo)

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua}, ${e.numero}, ${e.bairro}`
}
export const enderecoCompleto = () => {
  const e = CONFIG.endereco
  return `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`
}
