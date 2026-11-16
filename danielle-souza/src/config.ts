/**
 * Todos os dados do site. Campo vazio ("") ou lista vazia = o bloco correspondente
 * NÃO é renderizado. Fonte: Google Maps e Instagram do negócio (ver README).
 */

export type Dia = {
  /** 0 = domingo ... 6 = sábado (Date.getDay) */
  dow: number
  nome: string
  curto: string
  /** "08:30"; vazio = fechado */
  abre: string
  fecha: string
}

export type Procedimento = {
  id: string
  nome: string
  descricao: string
}

export type Profissional = {
  nome: string
  /** ex.: "Biomédica" — vazio, não aparece */
  profissao: string
  /** ex.: "CRBM nº 00000" — vazio, não aparece */
  registro: string
  /**
   * Fotos AUTORIZADAS em /public (a primeira é o retrato principal; a segunda,
   * opcional, entra menor e sobreposta). Lista vazia = só tipografia.
   * Se existir a versão "-640.webp" ao lado, ela é usada em telas pequenas.
   */
  fotos: string[]
}

export const CONFIG = {
  rascunho: true,
  /** URL pública definitiva (canonical, og:url). Nunca localhost. */
  siteUrl: 'https://danielle-souza-rascunho.vercel.app',

  nome: 'Danielle Souza',
  descritor: 'Estética Avançada',

  /** logo recortado do arquivo original (substituir por versão em alta resolução) */
  logo: {
    claro: '/brand/logo.webp',
    escuro: '/brand/logo-branco.webp',
    largura: 507,
    altura: 194,
  },

  usarWhatsapp: true,
  whatsapp: '5535998133999',
  whatsappExibicao: '(35) 99813-3999',
  email: 'daniellevga@hotmail.com',

  instagram: {
    url: 'https://www.instagram.com/danielleesteticaavancada/',
    usuario: '@danielleesteticaavancada',
  },

  endereco: {
    rua: 'R. Alberto Cabre',
    numero: '326',
    bairro: 'Vila Pinto',
    cidade: 'Varginha',
    uf: 'MG',
    cep: '37010-630',
  },
  rotaUrl:
    'https://www.google.com/maps/dir/?api=1&destination=R.%20Alberto%20Cabre%2C%20326%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG',
  mapaEmbedUrl:
    'https://www.google.com/maps?q=R.%20Alberto%20Cabre%2C%20326%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG%2C%2037010-630&output=embed',

  horarios: [
    { dow: 1, nome: 'Segunda-feira', curto: 'Seg', abre: '08:30', fecha: '18:30' },
    { dow: 2, nome: 'Terça-feira', curto: 'Ter', abre: '08:30', fecha: '19:00' },
    { dow: 3, nome: 'Quarta-feira', curto: 'Qua', abre: '08:30', fecha: '19:30' },
    { dow: 4, nome: 'Quinta-feira', curto: 'Qui', abre: '08:30', fecha: '19:00' },
    { dow: 5, nome: 'Sexta-feira', curto: 'Sex', abre: '08:30', fecha: '18:00' },
    { dow: 6, nome: 'Sábado', curto: 'Sáb', abre: '', fecha: '' },
    { dow: 0, nome: 'Domingo', curto: 'Dom', abre: '', fecha: '' },
  ] as Dia[],
  avisoHorarios: 'Horários podem variar em feriados.',

  /** Lista informada pela bio do Instagram. Para ampliar, acrescente itens. */
  procedimentos: [
    {
      id: 'toxina-botulinica',
      nome: 'Toxina botulínica',
      descricao:
        'Procedimento estético facial feito somente depois de uma avaliação individual. Nela, verifica-se se há indicação e são explicados os cuidados, os limites e os possíveis efeitos.',
    },
    {
      id: 'preenchimento-facial',
      nome: 'Preenchimento facial',
      descricao:
        'Procedimento estético facial que também começa pela avaliação individual. A conversa trata da indicação, dos cuidados antes e depois e dos possíveis efeitos.',
    },
  ] as Procedimento[],

  profissionais: [
    {
      nome: 'Danielle Souza',
      profissao: '',
      registro: '',
      fotos: ['/fotos/danielle-estudio.webp', '/fotos/danielle-congresso.webp'],
    },
  ] as Profissional[],

  /** Preencha nome e registro para exibir no rodapé. */
  responsavelTecnico: { nome: '', registro: '' },

  secoes: {
    atendimento: true,
    procedimentos: true,
    profissional: true,
    comoFunciona: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },

  mensagens: {
    geral: 'Olá! Vi o site da Danielle Souza Estética e gostaria de agendar uma avaliação.',
    procedimento: (nome: string) =>
      `Olá! Vi o site da Danielle Souza Estética e gostaria de agendar uma avaliação sobre ${nome.toLowerCase()}.`,
  },
}

export const temTexto = (v?: string | null) => typeof v === 'string' && v.trim().length > 0

export const waLink = (texto: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`

export const enderecoLinha1 = () => `${CONFIG.endereco.rua}, ${CONFIG.endereco.numero}`
export const enderecoLinha2 = () =>
  `${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`

/** "08:30" -> "08h30" */
export const hora = (h: string) => h.replace(':', 'h')
