/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) ou ausente = o bloco correspondente NÃO aparece.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dia: DiaSemana
  nome: string
  abre?: string // "08:00"
  fecha?: string // "17:00"
}

export interface Atendimento {
  id: string
  nome: string
  /** usado na mensagem do WhatsApp: "uma consulta de {mensagem}" */
  mensagem: string
  descricao: string
  ativo: boolean
}

export interface Foto {
  src: string // caminho base sem largura, ex.: "/img/retrato"
  larguras: number[]
  largura: number
  altura: number
  alt: string
}

export const CONFIG = {
  siteUrl: 'https://matheus-quinteiro-rascunho.vercel.app',
  rascunho: true,
  intro: false,

  nome: 'Matheus Quinteiro',
  descritor: 'Nutricionista',
  registro: 'CRN 29815',
  cidade: 'Poços de Caldas',
  uf: 'MG',

  /** Logo oficial (caminho em /public). Vazio = wordmark provisório em texto. */
  logo: '',

  formacao: [
    { titulo: 'Graduação em Nutrição', instituicao: 'UNIFEOB' },
    {
      titulo: 'Pós-graduação em Obesidade e Emagrecimento',
      instituicao: 'Faculdade Israelita Albert Einstein',
    },
  ],

  endereco: {
    rua: 'R. Alagoas, 12',
    complemento: 'Sala 12',
    bairro: 'Centro',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37701-034',
    maps: 'https://maps.app.goo.gl/KFGCzhmsT6PyrgXR6',
    rota: 'https://www.google.com/maps/dir/?api=1&destination=R.%20Alagoas%2C%2012%2C%20sala%2012%2C%20Centro%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037701-034',
    embed:
      'https://www.google.com/maps?q=R.%20Alagoas%2C%2012%2C%20Centro%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037701-034&output=embed',
  },

  usarWhatsapp: true,
  whatsapp: '5535984370700',
  whatsappExibicao: '(35) 98437-0700',
  telefone: '',
  email: '',

  instagram: {
    usuario: '@matheusquinteiro.nutri',
    url: 'https://www.instagram.com/matheusquinteiro.nutri/',
  },

  horarios: [
    { dia: 1, nome: 'Segunda', abre: '08:00', fecha: '17:00' },
    { dia: 2, nome: 'Terça', abre: '08:00', fecha: '17:00' },
    { dia: 3, nome: 'Quarta', abre: '08:00', fecha: '17:00' },
    { dia: 4, nome: 'Quinta', abre: '09:00', fecha: '17:00' },
    { dia: 5, nome: 'Sexta', abre: '08:00', fecha: '17:00' },
    { dia: 6, nome: 'Sábado', abre: '08:00', fecha: '12:00' },
    { dia: 0, nome: 'Domingo' },
  ] as Horario[],
  fusoHorario: 'America/Sao_Paulo',
  avisoHorarios: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'consulta',
      nome: 'Consulta de nutrição',
      mensagem: 'nutrição',
      descricao:
        'Atendimento nutricional individual. Começa por uma conversa sobre a sua rotina, seus hábitos e o que você procura, seguida de uma avaliação. A partir daí, a orientação é pensada para o seu dia a dia.',
      ativo: true,
    },
    {
      id: 'obesidade',
      nome: 'Obesidade e emagrecimento',
      mensagem: 'obesidade e emagrecimento',
      descricao:
        'Acompanhamento nutricional para quem busca perder peso, com atenção aos hábitos e ao comportamento alimentar. Tudo parte de uma avaliação individual, e o plano é conversado com você.',
      ativo: true,
    },
    { id: 'mat', nome: 'Método MAT', mensagem: '', descricao: '', ativo: false },
    { id: 'esportiva', nome: 'Nutrição esportiva', mensagem: '', descricao: '', ativo: false },
    { id: 'online', nome: 'Atendimento online', mensagem: '', descricao: '', ativo: false },
  ] as Atendimento[],

  /** Fotos enviadas pelo responsável pelo projeto. Lista vazia = seção sem foto. */
  fotos: {
    retrato: {
      src: '/img/retrato',
      larguras: [480, 880],
      largura: 880,
      altura: 1100,
      alt: 'Matheus Quinteiro, de camisa branca, sentado no consultório',
    } as Foto | null,
    consultorio: {
      src: '/img/consultorio',
      larguras: [640, 1162],
      largura: 1162,
      altura: 924,
      alt: 'Matheus Quinteiro arrumando a estante do consultório, com livros e quadros',
    } as Foto | null,
    maca: {
      src: '/img/maca',
      larguras: [480, 750],
      largura: 750,
      altura: 750,
      alt: 'Escultura dourada em forma de maçã vazada, segurada na mão, no consultório',
    } as Foto | null,
  },

  secoes: {
    atendimentos: true,
    consulta: true,
    formacao: true,
    comoFunciona: true,
    horarios: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo && a.nome)

export const linkWhatsapp = (texto: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`

export const MSG_GERAL = `Olá! Vi o site do ${CONFIG.nome} e gostaria de agendar uma consulta.`
export const msgAtendimento = (a: Atendimento) =>
  `Olá! Vi o site do ${CONFIG.nome} e gostaria de agendar uma consulta de ${a.mensagem}.`

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua}, ${e.complemento.toLowerCase()}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`
}

/** "08:00" -> "8h" ; "09:30" -> "9h30" */
export const hora = (h: string) => {
  const [hh, mm] = h.split(':')
  return `${Number(hh)}h${mm === '00' ? '' : mm}`
}
