/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou lista vazia) = o elemento correspondente NÃO aparece.
 * Nada de placeholder na tela.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export type Horario = {
  /** dias da semana a que esta faixa se aplica */
  dias: DiaSemana[]
  /** rótulo exibido, ex.: "Segunda a sexta" */
  rotulo: string
  abre: string // "08:00"
  fecha: string // "17:30"
  /** pausa de almoço; deixe vazio se não houver */
  almoco?: { inicio: string; fim: string }
}

export type Atendimento = {
  id: string
  titulo: string
  /** nome curto usado na mensagem do WhatsApp e no select do formulário */
  nomeCurto: string
  /** rótulo no select do formulário (pode ter complemento) */
  rotuloFormulario?: string
  descricao: string
  /** false = não aparece no select do formulário */
  noFormulario: boolean
  /**
   * true = o botão deste atendimento usa a mensagem geral do WhatsApp,
   * sem citar a área (discrição para temas sensíveis).
   */
  mensagemDiscreta?: boolean
}

export const CONFIG = {
  /** faixa "Rascunho para avaliação" + noindex. Mude para false só na publicação definitiva. */
  rascunho: true,
  /** URL pública absoluta, sem barra no fim. Usada em canonical, og:url e og:image. */
  siteUrl: 'https://valeria-reis-rascunho.vercel.app',

  // ---------- Identificação ----------
  nome: 'Dra. Valéria Reis',
  /** nome completo NÃO confirmado: deixe vazio até a médica confirmar */
  nomeCompleto: '',
  consultorio: 'Espaço Saúde e Mulher',
  /** número do CRM. Vazio = não aparece. Obrigatório antes da publicação definitiva (CFM 2.336/2023). */
  crm: '',
  crmUF: 'MG',
  especialidades: [{ nome: 'Ginecologia e Obstetrícia', rqe: '50585' }],
  formacao: [
    'Médica, com residência em Ginecologia e Obstetrícia',
    'Pós-graduada em Ultrassonografia Ginecológica e Obstétrica',
  ],
  frase: 'Cuidando da mulher em todas as fases da vida',
  /** caminho da foto em /public (ex.: "/fotos/dra-valeria.jpg"). Vazio = composição tipográfica. Só com autorização. */
  foto: '',
  fotoAlt: '',
  /** vínculos institucionais (Santa Casa). Desligado até o cliente decidir. */
  mostrarSantaCasa: false,
  santaCasa: [
    'Plantonista e coordenadora da maternidade da Santa Casa de Poços de Caldas',
    'Ultrassonografista na Santa Casa de Poços de Caldas',
  ],
  /** área sensível em publicidade médica; pode ser desligada */
  mostrarEsteticaIntima: true,

  // ---------- Contato ----------
  whatsapp: '5535999597795',
  whatsappExibicao: '(35) 99959-7795',
  usarWhatsapp: true,
  /** telefone fixo. Vazio = sem botão "Ligar". */
  telefone: '',
  email: '',
  instagram: 'https://www.instagram.com/dravaleriareis/',
  instagramUsuario: '@dravaleriareis',
  mapsUrl: 'https://maps.app.goo.gl/DUgkkuq9U7xovJ4q6',

  endereco: {
    logradouro: 'Avenida Gentil Messías-Kitate, 240',
    complemento: 'Sala 113, Edifício Unique',
    bairro: 'Vila Cruz',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37701-528',
  },

  horarios: [
    { dias: [1, 2, 3, 4, 5], rotulo: 'Segunda a sexta', abre: '08:00', fecha: '17:30' },
  ] as Horario[],
  avisoFeriados: 'Horários podem variar em feriados.',

  mensagens: {
    geral: 'Olá! Vi o site da Dra. Valéria Reis e gostaria de agendar uma consulta.',
    /** {atendimento} é substituído pelo nome curto */
    porAtendimento: 'Olá! Vi o site da Dra. Valéria Reis e gostaria de agendar uma consulta de {atendimento}.',
    formularioAbertura:
      'Olá! Vim pelo site da Dra. Valéria Reis e gostaria de solicitar um agendamento.',
    avisoWhatsapp:
      'Este WhatsApp é para agendamento. Dúvidas clínicas, pedidos de exames, atestados e receitas são tratados somente na consulta.',
  },

  agendamento: {
    exigirAtendimento: false,
    /** duração de cada bloco de horário, em minutos */
    blocoMinutos: 60,
    limiteObservacoes: 300,
  },

  atendimentos: [
    {
      id: 'obstetricia',
      titulo: 'Obstetrícia',
      nomeCurto: 'Obstetrícia',
      rotuloFormulario: 'Obstetrícia (acompanhamento da gestação)',
      descricao:
        'Acompanhamento da gestação, do parto e do puerpério, com consultas regulares e orientação clara sobre cada etapa.',
      noFormulario: true,
    },
    {
      id: 'ginecologia',
      titulo: 'Ginecologia',
      nomeCurto: 'Ginecologia',
      descricao:
        'Acompanhamento da saúde da mulher ao longo da vida, da primeira consulta na adolescência à maturidade, com consultas de rotina e espaço para perguntas.',
      noFormulario: true,
    },
    {
      id: 'contracepcao',
      titulo: 'Contracepção',
      nomeCurto: 'Contracepção',
      rotuloFormulario: 'Contracepção (DIU e implante)',
      descricao:
        'Conversa sobre os métodos contraceptivos e sobre o que faz sentido para cada momento de vida. Inclui inserção de DIU e de implante contraceptivo, quando indicados.',
      noFormulario: true,
    },
    {
      id: 'menopausa',
      titulo: 'Menopausa',
      nomeCurto: 'Menopausa',
      descricao:
        'Acompanhamento da transição para a menopausa e dos anos seguintes, com orientação sobre as mudanças desse período e sobre os cuidados de rotina.',
      noFormulario: true,
    },
    {
      id: 'ultrassonografia',
      titulo: 'Ultrassonografia obstétrica e ginecológica',
      nomeCurto: 'Ultrassonografia',
      rotuloFormulario: 'Ultrassonografia',
      descricao:
        'Exames de ultrassonografia que complementam o acompanhamento ginecológico e o acompanhamento da gestação, com tudo explicado em linguagem simples.',
      noFormulario: true,
    },
    {
      id: 'saude-intima',
      titulo: 'Saúde íntima e estética ginecológica',
      nomeCurto: 'Saúde íntima',
      descricao:
        'Espaço para conversar com franqueza e respeito sobre a região íntima. Qualquer procedimento é indicado somente após avaliação médica individual.',
      noFormulario: false,
      mensagemDiscreta: true,
    },
  ] as Atendimento[],

  passos: [
    {
      titulo: 'Contato e agendamento',
      texto:
        'Pelo WhatsApp ou pelo formulário desta página. A equipe confirma o dia e o horário disponíveis.',
    },
    {
      titulo: 'Consulta',
      texto:
        'Tempo para ouvir sua história, suas perguntas e o momento que você está vivendo, seguido da avaliação.',
    },
    {
      titulo: 'Plano explicado com clareza',
      texto:
        'Exames, orientações e próximos passos explicados em linguagem simples, antes de qualquer decisão.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'Retornos combinados conforme cada caso, para seguir junto ao longo do tempo.',
    },
  ],

  paraQuem: [
    { legenda: 'Adolescência', texto: 'Adolescentes na primeira consulta ginecológica.' },
    { legenda: 'Ao longo da vida', texto: 'Mulheres de todas as idades que buscam acompanhamento.' },
    { legenda: 'Gestação', texto: 'Gestantes, do início da gestação ao puerpério.' },
    { legenda: 'Maturidade', texto: 'Mulheres na transição para a menopausa e depois dela.' },
    { legenda: 'Contracepção', texto: 'Quem quer conversar sobre métodos contraceptivos.' },
  ],

  /** liga/desliga seções inteiras */
  secoes: {
    medica: true,
    atendimentos: true,
    paraQuem: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export type Config = typeof CONFIG

// ---------- utilidades derivadas ----------

export const atendimentosVisiveis = () =>
  CONFIG.atendimentos.filter((a) => a.id !== 'saude-intima' || CONFIG.mostrarEsteticaIntima)

export const especialidadePrincipal = () => CONFIG.especialidades[0]

/** "CRM-MG 00000" ou "" */
export const crmTexto = () => (CONFIG.crm.trim() ? `CRM-${CONFIG.crmUF} ${CONFIG.crm.trim()}` : '')

/** "Ginecologia e Obstetrícia · RQE 50585" */
export const especialidadeTexto = () =>
  CONFIG.especialidades
    .filter((e) => e.nome)
    .map((e) => (e.rqe ? `${e.nome} · RQE ${e.rqe}` : e.nome))
    .join(' · ')

/** linha de identificação completa usada no selo, no bloco da médica e no rodapé */
export const identificacao = () =>
  [CONFIG.nomeCompleto.trim() || CONFIG.nome, crmTexto(), especialidadeTexto()].filter(Boolean).join(' · ')

export const waLink = (mensagem: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`

export const waAtendimento = (a: Atendimento) =>
  waLink(
    a.mensagemDiscreta
      ? CONFIG.mensagens.geral
      : CONFIG.mensagens.porAtendimento.replace('{atendimento}', a.nomeCurto.toLowerCase()),
  )

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.logradouro}, ${e.complemento}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`
}

export const temWhatsapp = () => CONFIG.usarWhatsapp && !!CONFIG.whatsapp
