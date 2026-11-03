/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("") ou lista vazia ([]) = o bloco correspondente não aparece.
 * Nada de placeholder: se não há o dado, o site se reorganiza sem ele.
 */

export type Horario = { abre: string; fecha: string; almoco?: { inicio: string; fim: string } } | null

export type Atendimento = {
  id: string
  nome: string
  resumo: string
  descricao: string
}

export type Dentista = {
  nome: string
  cro: string
  formacao?: string
  /** Só preencha com título de especialidade registrado no CFO e com o número do registro. */
  especialidadeRegistrada?: string
  foto?: string
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Mude para false só na publicação definitiva. */
  rascunho: true,

  /** URL pública absoluta (sem barra no final). Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://odonto-fit-rascunho.vercel.app',

  nome: 'Odonto Fit',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  endereco: {
    rua: 'R. Silviano Brandão, 290',
    bairro: 'Jardim Noronha',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37550-000',
  },

  telefone: '(35) 4102-0088',
  /** Número usado no wa.me (DDI + DDD + número, só dígitos). Confirmar se recebe WhatsApp. */
  whatsapp: '553541020088',

  instagram: 'https://www.instagram.com/odontofitpousoalegre/',
  instagramUsuario: '@odontofitpousoalegre',
  mapsUrl: 'https://maps.app.goo.gl/yD22riDiFCy8u6xE7',

  /** 0 = domingo ... 6 = sábado. null = fechado. */
  horarios: {
    0: null,
    1: { abre: '08:30', fecha: '18:30' },
    2: { abre: '08:30', fecha: '18:30' },
    3: { abre: '08:30', fecha: '18:30' },
    4: { abre: '08:30', fecha: '18:30' },
    5: { abre: '08:30', fecha: '18:30' },
    6: null,
  } as Record<number, Horario>,
  avisoHorarios: 'Os horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'implantes',
      nome: 'Implantes',
      resumo: 'Reposição da raiz de um dente perdido.',
      descricao:
        'O implante substitui a raiz de um dente perdido e serve de base para uma coroa ou prótese. Antes de indicar, é preciso avaliar a gengiva e o osso da região.',
    },
    {
      id: 'ortodontia',
      nome: 'Ortodontia',
      resumo: 'Posição dos dentes e encaixe da mordida.',
      descricao:
        'Trata a posição dos dentes e o encaixe entre as arcadas. O tipo de aparelho e as etapas são definidos no planejamento de cada caso.',
    },
    {
      id: 'proteses',
      nome: 'Próteses',
      resumo: 'Reposição de dentes ausentes ou desgastados.',
      descricao:
        'Repõem dentes ausentes ou muito desgastados, de forma fixa ou removível, com o objetivo de restabelecer a mastigação e a fala.',
    },
    {
      id: 'harmonizacao',
      nome: 'Harmonização facial',
      resumo: 'Procedimentos na região da face, conforme as normas do conselho.',
      descricao:
        'Procedimentos na região da face realizados por cirurgião-dentista, dentro das normas do conselho de classe. A avaliação verifica se há indicação e explica cuidados, limites e alternativas.',
    },
    {
      id: 'periodontia',
      nome: 'Periodontia',
      resumo: 'Cuidado da gengiva e da sustentação dos dentes.',
      descricao:
        'Cuida da gengiva e das estruturas que sustentam os dentes. Sangramento, inchaço ou retração da gengiva são sinais que merecem avaliação.',
    },
    {
      id: 'endodontia',
      nome: 'Endodontia',
      resumo: 'O conhecido tratamento de canal.',
      descricao:
        'Conhecida como tratamento de canal, trata a parte interna do dente quando a polpa está inflamada ou infectada, buscando preservar o dente.',
    },
  ] as Atendimento[],

  /** Itens confirmados na ficha do Google. A entrada acessível NÃO foi informada. */
  estrutura: [
    { id: 'assento', titulo: 'Assento acessível', texto: 'Assento com acessibilidade para cadeirantes.' },
    { id: 'banheiro', titulo: 'Banheiro acessível', texto: 'Banheiro com acessibilidade para cadeirantes.' },
    { id: 'neutro', titulo: 'Banheiro de gênero neutro', texto: 'Banheiro disponível para todas as pessoas.' },
    { id: 'hora', titulo: 'Hora marcada', texto: 'É recomendado agendar antes de ir à clínica.' },
  ],
  pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação'],

  /** Vazio hoje: não aparecem no site. */
  dentistas: [] as Dentista[],
  responsavelTecnico: { nome: '', cro: '' },

  agendamento: {
    exigirAtendimento: false,
    /** true só se a clínica fizer atendimento de urgência. */
    urgencia: false,
    limiteObservacoes: 300,
  },

  mensagens: {
    geral: 'Olá! Vi o site da Odonto Fit e gostaria de agendar uma avaliação.',
    atendimento: (nome: string) =>
      `Olá! Vi o site da Odonto Fit e gostaria de informações sobre ${nome.toLowerCase()}.`,
  },

  /** Liga/desliga seções inteiras. Uma seção ligada só aparece se tiver conteúdo. */
  secoes: {
    marquee: true,
    clinica: true,
    atendimentos: true,
    equipe: true,
    quandoProcurar: true,
    comoFunciona: true,
    estrutura: true,
    galeria: true,
    faq: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export type Config = typeof CONFIG
