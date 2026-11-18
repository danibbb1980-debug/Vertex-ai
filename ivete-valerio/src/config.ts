/**
 * Todos os dados do site. Campo vazio ("" ou lista vazia) = o bloco não aparece.
 * Ver README.md para editar.
 */

export type Dia = {
  nome: string
  /** código schema.org (Monday, Tuesday...) */
  schema: string
  aberto: boolean
  /** "09:00". Vazio = não mostra horário em horas. */
  inicio: string
  fim: string
}

export type Servico = {
  id: string
  nome: string
  frase: string
  itens: string[]
}

export type Foto = {
  src: string
  webp?: string
  webpPequena?: string
  alt: string
  largura: number
  altura: number
}

export const CONFIG = {
  rascunho: true,
  siteUrl: 'https://ivete-valerio-estetica-rascunho.vercel.app',

  nome: 'Ivete Valério Estética',
  nomePessoa: 'Ivete Valério',
  titulo: 'Esteticista',

  /** Troque pelos arquivos definitivos quando houver. */
  logo: {
    claro: '/brand/logo-cacau.svg',
    escuro: '/brand/logo-cru.svg',
    largura: 274,
    altura: 52,
  },

  usarWhatsapp: true,
  whatsapp: '5535999012929',
  whatsappExibicao: '(35) 99901-2929',
  telefoneFixo: '',
  email: 'ivetevalerio@yahoo.com.br',
  instagram: {
    url: 'https://www.instagram.com/ivetevalerioestetica/',
    usuario: '@ivetevalerioestetica',
  },

  endereco: {
    logradouro: 'Praça Matheus Tavares, 83',
    bairro: 'Centro',
    cidade: 'Varginha',
    uf: 'MG',
    cep: '37002-320',
  },
  rotaUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Pra%C3%A7a%20Matheus%20Tavares%2C%2083%2C%20Centro%2C%20Varginha%20-%20MG',
  mapaEmbed:
    'https://www.google.com/maps?q=Pra%C3%A7a%20Matheus%20Tavares%2C%2083%2C%20Centro%2C%20Varginha%20-%20MG%2C%2037002-320&output=embed',

  horarios: {
    somenteHoraMarcada: true,
    observacao: 'Os dias podem variar em feriados.',
    dias: [
      { nome: 'Segunda-feira', schema: 'Monday', aberto: false, inicio: '', fim: '' },
      { nome: 'Terça-feira', schema: 'Tuesday', aberto: false, inicio: '', fim: '' },
      { nome: 'Quarta-feira', schema: 'Wednesday', aberto: true, inicio: '', fim: '' },
      { nome: 'Quinta-feira', schema: 'Thursday', aberto: true, inicio: '', fim: '' },
      { nome: 'Sexta-feira', schema: 'Friday', aberto: true, inicio: '', fim: '' },
      { nome: 'Sábado', schema: 'Saturday', aberto: true, inicio: '', fim: '' },
      { nome: 'Domingo', schema: 'Sunday', aberto: false, inicio: '', fim: '' },
    ] as Dia[],
    /** dias da semana do JS (0 = domingo) com atendimento, usado no formulário */
    diasJs: [3, 4, 5, 6],
  },

  servicos: [
    {
      id: 'massagens',
      nome: 'Massagens',
      frase: 'Escolha entre os tipos de massagem abaixo e combine o horário pelo WhatsApp.',
      itens: [
        'Modeladora',
        'Localizada',
        'Relaxante',
        'Drenagem linfática',
        'Pedras quentes',
        'Bambu terapia',
      ],
    },
    {
      id: 'depilacao',
      nome: 'Depilação',
      frase: 'Depilação com linha ou com cera, como você preferir.',
      itens: ['Egípcia (com linha)', 'Com cera'],
    },
    {
      id: 'sobrancelha',
      nome: 'Design de sobrancelha',
      frase: 'Três opções de design, do simples ao feito com henna ou tinta.',
      itens: ['Simples', 'Henna', 'Tinta'],
    },
    {
      id: 'facial',
      nome: 'Estética facial',
      frase: 'Serviços para o rosto, da limpeza de pele à hidratação.',
      itens: [
        'Limpeza de pele profunda',
        'Peeling de diamante',
        'Hidratação com massagem',
        'Depilação',
      ],
    },
  ] as Servico[],

  fotos: {
    retrato: {
      src: '/img/ivete-800.jpg',
      webp: '/img/ivete-800.webp',
      webpPequena: '/img/ivete-480.webp',
      alt: 'Ivete Valério, esteticista, de jaleco branco e braços cruzados.',
      largura: 800,
      altura: 1000,
    } as Foto | null,
  },

  sobre: {
    nome: 'Ivete Valério',
    titulo: 'Esteticista',
    frase: 'Atende com hora marcada no Centro de Varginha.',
  },

  faq: [
    {
      p: 'Como marco um horário?',
      r: 'Pelo WhatsApp (35) 99901-2929. Você pode mandar uma mensagem direto ou usar o formulário desta página, que monta a mensagem para você.',
    },
    {
      p: 'Preciso de hora marcada?',
      r: 'Sim. O atendimento é somente com hora marcada.',
    },
    {
      p: 'Quais serviços estão disponíveis?',
      r: 'Massagens, depilação, design de sobrancelha e estética facial. A lista de cada um está na seção Serviços.',
    },
    {
      p: 'Em quais dias a Ivete atende?',
      r: 'De quarta-feira a sábado. Em feriados, os dias podem variar.',
    },
    {
      p: 'Atende aos domingos, segundas e terças?',
      r: 'Não. Nesses dias não há atendimento.',
    },
    {
      p: 'Onde fica?',
      r: 'Na Praça Matheus Tavares, 83, Centro, Varginha - MG, CEP 37002-320.',
    },
    {
      p: 'Posso marcar pelo site?',
      r: 'O formulário do site monta a sua mensagem e abre o WhatsApp. O dia e o período são combinados na conversa, e a Ivete confirma a disponibilidade.',
    },
    {
      p: 'Quais são as formas de contato?',
      r: 'WhatsApp (35) 99901-2929, Instagram @ivetevalerioestetica e e-mail ivetevalerio@yahoo.com.br.',
    },
    {
      p: 'Preciso contar algo sobre a minha saúde na mensagem?',
      r: 'Não. Para pedir um horário basta dizer o serviço e o dia que você prefere.',
    },
    {
      p: 'E se eu ainda não sei qual serviço escolher?',
      r: 'No formulário, escolha "Ainda não sei, quero conversar". Pelo WhatsApp vocês conversam sobre o que você procura.',
    },
  ],

  secoes: {
    servicos: true,
    horaMarcada: true,
    sobre: true,
    comoAgendar: true,
    duvidas: true,
    contato: true,
    solicitar: true,
    ctaFinal: true,
  },
}

export const MSG_GERAL =
  'Olá! Vi o site da Ivete Valério Estética e gostaria de marcar um horário.'

export const msgServico = (categoria: string) =>
  `Olá! Vi o site da Ivete Valério Estética e gostaria de marcar um horário para ${categoria.toLowerCase()}.`

export const waLink = (texto: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.logradouro}, ${e.bairro}, ${e.cidade} - ${e.uf}`
}

export const diasAbertos = () => CONFIG.horarios.dias.filter((d) => d.aberto)

/** "9h às 18h" se houver horário; senão "". */
export const faixaHoras = (d: Dia) => {
  if (!d.inicio || !d.fim) return ''
  const f = (h: string) => h.replace(':00', 'h').replace(':', 'h')
  return `${f(d.inicio)} às ${f(d.fim)}`
}
