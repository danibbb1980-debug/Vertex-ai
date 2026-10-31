/**
 * CONFIGURAÇÃO DO SITE — Dr. Hércules Muniz
 * -----------------------------------------------------------------
 * Todo o conteúdo factual do site sai daqui. Regra: campo vazio ou
 * ausente = o componente correspondente NÃO aparece na tela.
 * Veja o README.md para instruções de edição.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dia: DiaSemana
  abre: string // "08:00"
  fecha: string // "19:00"
  /** Intervalo de almoço. Deixe ausente se não houver informação. */
  intervalo?: { inicio: string; fim: string }
}

export interface Atendimento {
  id: string
  nome: string
  resumo: string
  detalhe: string
  icone: 'implante' | 'ortodontia' | 'harmonizacao' | 'estetica'
}

export interface Especialidade {
  nome: string
  /** Número do registro de especialidade no CRO. Sem número, não aparece. */
  registro: string
}

export interface Foto {
  webp: string
  jpg: string
  largura: number
  altura: number
  alt: string
}

export interface Pergunta {
  pergunta: string
  resposta: string
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Mude para false ao publicar. */
  rascunho: true,

  /** URL absoluta onde o site está publicado (sem barra no fim). */
  siteUrl: 'https://dr-hercules-muniz-rascunho.vercel.app',

  nome: 'Dr. Hércules Muniz',
  nomeCurto: 'Hércules Muniz',
  titulo: 'Cirurgião-dentista',
  cro: 'CRO-MG 50169',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  /** Só número, com DDI e DDD, sem espaços. */
  whatsapp: '5535998595908',
  telefoneExibicao: '(35) 99859-5908',
  instagram: 'https://www.instagram.com/drherculesmuniz/',
  instagramUsuario: '@drherculesmuniz',
  mapsUrl: 'https://maps.app.goo.gl/oVuskvZ3y39dKG7J7',

  endereco: {
    rua: 'Av. Pref. Olavo Gomes de Oliveira, 2518',
    bairro: 'Jardim Aureliano',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37558-658',
  },

  /** Arquivo do logo em /public (ex.: '/logo-hercules.png'). Vazio = assinatura tipográfica. */
  logo: '',

  /** Horários do Google. Domingo fechado = simplesmente não aparece na lista. */
  horarios: [
    { dia: 1, abre: '08:00', fecha: '19:00' },
    { dia: 2, abre: '08:00', fecha: '19:00' },
    { dia: 3, abre: '08:00', fecha: '19:00' },
    { dia: 4, abre: '08:00', fecha: '19:00' },
    { dia: 5, abre: '08:00', fecha: '19:00' },
    { dia: 6, abre: '08:00', fecha: '12:00' },
  ] as Horario[],
  avisoHorarios: 'Os horários podem variar em feriados.',

  /**
   * Especialidades: só aparecem com mostrarEspecialidades = true E com o
   * número de registro preenchido (regra do CFO). Enquanto false, o site
   * não usa a palavra "especialista" em lugar nenhum.
   */
  mostrarEspecialidades: false,
  especialidades: [] as Especialidade[],

  /** Formação e currículo. Vazio = não aparece. */
  formacao: [] as string[],

  /** Outros profissionais. Vazio = não aparece. */
  equipe: [] as { nome: string; titulo: string; cro: string }[],

  fotos: {
    dentista: {
      webp: '/fotos/dr-hercules-720.webp',
      jpg: '/fotos/dr-hercules-720.jpg',
      largura: 720,
      altura: 840,
      alt: 'Retrato do Dr. Hércules Muniz, cirurgião-dentista, de jaleco cinza, com a mão apoiada no queixo.',
    } as Foto | null,
    /** Fotos do consultório (alta resolução). Vazio = não aparece. */
    consultorio: [] as Foto[],
  },

  atendimentos: [
    {
      id: 'implantes',
      nome: 'Implantes dentários',
      icone: 'implante',
      resumo:
        'Uma forma de repor dentes perdidos com uma raiz artificial instalada no osso, que serve de base para a nova coroa.',
      detalhe:
        'Antes de qualquer decisão, avaliamos a saúde da gengiva, a quantidade de osso e o histórico de cada paciente. Os exames necessários são pedidos conforme o caso.',
    },
    {
      id: 'ortodontia',
      nome: 'Ortodontia',
      icone: 'ortodontia',
      resumo:
        'Cuida da posição dos dentes e da relação entre as arcadas, com aparelhos escolhidos de acordo com cada situação.',
      detalhe:
        'O tipo de aparelho e a frequência das consultas de manutenção são definidos depois da avaliação e explicados com calma.',
    },
    {
      id: 'harmonizacao',
      nome: 'Harmonização orofacial',
      icone: 'harmonizacao',
      resumo:
        'Área da odontologia que estuda o equilíbrio entre a face, os lábios e o sorriso, considerando funções e proporções.',
      detalhe:
        'A conversa inicial serve para entender expectativas, avaliar se há indicação e esclarecer limites e cuidados de cada procedimento.',
    },
    {
      id: 'estetica',
      nome: 'Estética do sorriso',
      icone: 'estetica',
      resumo:
        'Procedimentos que atuam sobre a forma, a cor e o alinhamento visual dos dentes, sempre em conjunto com a saúde bucal.',
      detalhe:
        'O planejamento parte do que é possível para cada boca, respeitando a estrutura dos dentes e a harmonia com o rosto.',
    },
  ] as Atendimento[],
  avisoIndicacao: 'A indicação depende de avaliação individual.',

  quandoProcurar: [
    {
      titulo: 'Perdeu um ou mais dentes',
      texto:
        'Espaços sem dentes podem influenciar a mastigação e a posição dos dentes vizinhos. Uma avaliação ajuda a entender as alternativas de reposição.',
    },
    {
      titulo: 'Quer avaliar o alinhamento',
      texto:
        'Dentes tortos, apinhados ou com espaços, ou uma mordida que incomoda, são bons motivos para uma conversa sobre ortodontia.',
    },
    {
      titulo: 'Tem interesse na estética facial ou do sorriso',
      texto:
        'Se você tem dúvidas sobre cor, forma dos dentes ou equilíbrio do rosto, a avaliação esclarece o que é indicado no seu caso.',
    },
  ],

  etapas: [
    {
      titulo: 'Contato e agendamento',
      texto:
        'Você chama pelo WhatsApp ou envia uma solicitação pelo site. A equipe confirma o dia e o horário disponíveis.',
    },
    {
      titulo: 'Avaliação e escuta',
      texto:
        'Na primeira consulta, ouvimos o que você procura, examinamos a boca e, quando necessário, solicitamos exames complementares.',
    },
    {
      titulo: 'Plano explicado com clareza',
      texto:
        'Você recebe as alternativas possíveis, as etapas de cada uma e os cuidados envolvidos, para decidir com tranquilidade.',
    },
    {
      titulo: 'Acompanhamento',
      texto:
        'Durante e depois do tratamento, as consultas de retorno acompanham a evolução e mantêm os cuidados em dia.',
    },
  ],

  estrutura: {
    acessibilidade: [
      'Entrada acessível para cadeirantes',
      'Assento acessível para cadeirantes',
      'Banheiro acessível para cadeirantes',
      'Banheiro de gênero neutro',
      'Sala de amamentação',
    ],
    funcionamento: ['Atendimento com hora marcada (recomendado agendar)'],
    pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],
  },

  faq: [
    {
      pergunta: 'Preciso agendar antes de ir ao consultório?',
      resposta:
        'É recomendado marcar hora. Assim o horário fica reservado para você e a consulta acontece com calma. O agendamento pode ser solicitado pelo WhatsApp ou pelo formulário deste site.',
    },
    {
      pergunta: 'Como é a primeira avaliação?',
      resposta:
        'É uma conversa para entender o que você procura, seguida do exame clínico. Quando necessário, são solicitados exames complementares. Depois, as alternativas possíveis são explicadas para você.',
    },
    {
      pergunta: 'Quais atendimentos são realizados?',
      resposta:
        'Implantes dentários, ortodontia, harmonização orofacial e estética do sorriso. A indicação de cada um depende da avaliação individual.',
    },
    {
      pergunta: 'Quais são os horários de atendimento?',
      resposta:
        'De segunda a sexta, das 8h às 19h, e aos sábados, das 8h às 12h. Aos domingos o consultório não abre. Os horários podem variar em feriados.',
    },
    {
      pergunta: 'Onde fica o consultório?',
      resposta:
        'Na Av. Pref. Olavo Gomes de Oliveira, 2518, no Jardim Aureliano, em Pouso Alegre - MG. O link "Como chegar" abre a rota no Google Maps.',
    },
    {
      pergunta: 'O consultório tem acessibilidade?',
      resposta:
        'Sim. A entrada, o assento e o banheiro são acessíveis para cadeirantes. Há também banheiro de gênero neutro e sala de amamentação.',
    },
    {
      pergunta: 'Quais formas de pagamento são aceitas?',
      resposta:
        'Cartão de crédito, cartão de débito e pagamento por aproximação. Valores e condições são tratados diretamente com a equipe após a avaliação.',
    },
    {
      pergunta: 'O que levar na primeira consulta?',
      resposta:
        'De forma geral, um documento com foto, a lista de medicamentos que você usa e exames odontológicos recentes, se tiver. Se houver alguma orientação específica, a equipe avisa ao confirmar o horário.',
    },
    {
      pergunta: 'Quanto tempo dura o tratamento?',
      resposta:
        'Depende de cada caso. O tempo e o número de etapas só podem ser estimados depois da avaliação, e são explicados no plano de tratamento.',
    },
    {
      pergunta: 'O formulário do site já marca minha consulta?',
      resposta:
        'Não. O formulário apenas monta uma mensagem e abre o WhatsApp do consultório. O dia e o horário escolhidos são preferências: a equipe confirma a disponibilidade pela conversa.',
    },
  ] as Pergunta[],

  agendamento: {
    exigirAtendimento: false,
    /** true apenas para clínicas de pronto atendimento. */
    urgencia: false,
    limiteObservacoes: 300,
  },

  /** Liga/desliga seções inteiras. */
  secoes: {
    hero: true,
    marquee: true,
    dentista: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    estrutura: true,
    faq: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

/* ---------- utilidades derivadas do config ---------- */

export const MSG_GERAL = 'Olá, Dr. Hércules! Vi seu site e gostaria de agendar uma avaliação.'

export function msgAtendimento(nome: string) {
  return `Olá, Dr. Hércules! Vi seu site e gostaria de informações sobre ${nome.toLowerCase()}.`
}

export function linkWhats(mensagem = MSG_GERAL) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}

const NOMES_DIA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function horaCurta(h: string) {
  const [hh, mm] = h.split(':')
  return mm === '00' ? `${Number(hh)}h` : `${Number(hh)}h${mm}`
}

/** Agrupa dias consecutivos com o mesmo horário: "Segunda a sexta · 8h às 19h". */
export function horariosResumo() {
  const linhas: { dias: string; horas: string }[] = []
  const ordem: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0]
  let grupo: { ini: DiaSemana; fim: DiaSemana; chave: string } | null = null
  const chaveDe = (d: DiaSemana) => {
    const h = CONFIG.horarios.find((x) => x.dia === d)
    if (!h) return 'fechado'
    const iv = h.intervalo ? ` (intervalo ${horaCurta(h.intervalo.inicio)} às ${horaCurta(h.intervalo.fim)})` : ''
    return `${horaCurta(h.abre)} às ${horaCurta(h.fecha)}${iv}`
  }
  const fecha = () => {
    if (!grupo) return
    const dias =
      grupo.ini === grupo.fim
        ? NOMES_DIA[grupo.ini]
        : `${NOMES_DIA[grupo.ini]} a ${NOMES_DIA[grupo.fim].toLowerCase()}`
    linhas.push({ dias, horas: grupo.chave === 'fechado' ? 'Fechado' : grupo.chave })
  }
  for (const d of ordem) {
    const chave = chaveDe(d)
    if (grupo && grupo.chave === chave) grupo.fim = d
    else {
      fecha()
      grupo = { ini: d, fim: d, chave }
    }
  }
  fecha()
  return linhas
}

export function especialidadesVisiveis() {
  if (!CONFIG.mostrarEspecialidades) return []
  return CONFIG.especialidades.filter((e) => e.nome.trim() && e.registro.trim())
}

/** Seção ligada E com conteúdo. Usado também pelos links de menu. */
export function secaoAtiva(nome: keyof typeof CONFIG.secoes): boolean {
  if (!CONFIG.secoes[nome]) return false
  switch (nome) {
    case 'atendimentos':
      return CONFIG.atendimentos.length > 0
    case 'quandoProcurar':
      return CONFIG.quandoProcurar.length > 0
    case 'comoFunciona':
      return CONFIG.etapas.length > 0
    case 'faq':
      return CONFIG.faq.length > 0
    case 'estrutura':
      return Object.values(CONFIG.estrutura).some((l) => l.length > 0)
    default:
      return true
  }
}
