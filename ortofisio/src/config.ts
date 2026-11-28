// Todos os dados do site ficam aqui.
// Regra: campo vazio ('' ou lista vazia) = o bloco correspondente não aparece no site.

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dias: DiaSemana[]
  rotulo: string
  abre: string // "08:00"
  fecha: string // "19:00"
}

export interface Atendimento {
  id: string
  nome: string
  descricao: string[]
  observacao: string
  mensagemWhatsApp: string
}

export interface Profissional {
  nome: string
  profissao: string
  registro: string // ex.: "CREFITO-4 000000-F". Sem registro, o profissional não aparece.
  foto?: string
}

export interface Pergunta {
  pergunta: string
  resposta: string
}

export const CONFIG = {
  // Faixa "Rascunho para avaliação" e metas noindex
  rascunho: true,

  // URL pública do site (usada em canonical, og:url e JSON-LD). Nunca localhost.
  siteUrl: 'https://ortofisio-rascunho.vercel.app',

  nome: 'OrtoFisio',
  descritor: 'Fisioterapia & Pilates',
  cidade: 'Poços de Caldas',
  uf: 'MG',

  seo: {
    titulo: 'OrtoFisio | Fisioterapia e Pilates em Poços de Caldas - MG',
    descricao:
      'Fisioterapia e pilates com cuidado individualizado no Centro de Poços de Caldas - MG. Peça seu horário pelo WhatsApp.',
    // Deixe vazio enquanto não houver imagem real de compartilhamento.
    ogImage: '',
  },

  logo: {
    src: '/logo-ortofisio.webp',
    largura: 317,
    altura: 288,
    alt: 'OrtoFisio, fisioterapia e pilates',
  },

  // Contato
  whatsapp: '5535988353607',
  whatsappExibicao: '(35) 98835-3607',
  telefone: '+553537123444',
  telefoneExibicao: '(35) 3712-3444',
  email: 'fisioterapia1.ortofisio@gmail.com',
  instagram: {
    url: 'https://www.instagram.com/clinica__ortofisio/',
    usuario: '@clinica__ortofisio',
  },

  endereco: {
    rua: 'R. São Paulo, 693',
    bairro: 'Centro',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37701-012',
    mapsUrl: 'https://maps.app.goo.gl/SMQojpoFo2yu6U2Z9',
    mapaEmbed:
      'https://www.google.com/maps?q=R.+S%C3%A3o+Paulo,+693+-+Centro,+Po%C3%A7os+de+Caldas+-+MG,+37701-012&output=embed',
  },

  horarios: [
    { dias: [1, 2, 3, 4], rotulo: 'Segunda a quinta', abre: '08:00', fecha: '19:00' },
    { dias: [5], rotulo: 'Sexta', abre: '08:00', fecha: '17:00' },
  ] as Horario[],
  fechado: 'Sábado e domingo',
  avisoHorarios: 'Horários podem variar em feriados.',
  // Pausa de almoço (ex.: { inicio: '12:00', fim: '13:00' }). Vazio = sem pausa informada.
  almoco: null as null | { inicio: string; fim: string },

  mensagens: {
    geral: 'Olá! Vi o site da OrtoFisio e gostaria de agendar um atendimento.',
    formulario: 'Olá! Vim pelo site da OrtoFisio e gostaria de solicitar um agendamento.',
  },

  atendimentos: [
    {
      id: 'fisioterapia',
      nome: 'Fisioterapia',
      descricao: [
        'A fisioterapia é a área da saúde que estuda o movimento do corpo e trabalha para preservar e recuperar suas funções.',
        'Cada atendimento começa por uma avaliação, e o plano é construído a partir dela.',
      ],
      observacao: 'A indicação depende de avaliação individual.',
      mensagemWhatsApp: 'Olá! Vi o site da OrtoFisio e gostaria de informações sobre fisioterapia.',
    },
    {
      id: 'pilates',
      nome: 'Pilates',
      descricao: [
        'O pilates é um método de exercícios que trabalha força, controle e consciência corporal, com atenção à respiração e à postura.',
        'O ritmo e os exercícios são ajustados a cada pessoa.',
      ],
      observacao: 'A indicação depende de avaliação individual.',
      mensagemWhatsApp: 'Olá! Vi o site da OrtoFisio e gostaria de informações sobre pilates.',
    },
  ] as Atendimento[],

  agendamento: {
    exigirAtendimento: false,
    limiteObservacoes: 300,
  },

  // Equipe: só aparece com mostrarEquipe = true E com nome + registro preenchidos.
  mostrarEquipe: false,
  equipe: [
    // { nome: 'Nome completo', profissao: 'Fisioterapeuta', registro: 'CREFITO-4 000000-F', foto: '/fotos/nome.webp' },
  ] as Profissional[],

  // Fotos: coloque os arquivos em public/fotos/ e liste aqui. Lista vazia = sem fotos no site.
  fotos: [] as { src: string; alt: string }[],

  etapas: [
    {
      titulo: 'Contato e agendamento',
      texto: 'Você fala com a clínica pelo WhatsApp ou pelo telefone e combina o dia da primeira visita.',
    },
    {
      titulo: 'Avaliação',
      texto: 'Na primeira consulta, a conversa e a avaliação mostram o que faz sentido para você.',
    },
    {
      titulo: 'Plano explicado com clareza',
      texto: 'Você entende o que será feito, com que frequência e por quê, antes de começar.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'O plano é revisto ao longo das sessões e ajustado quando necessário.',
    },
  ],
  avisoEtapas: 'As etapas variam conforme cada caso.',

  faq: [
    {
      pergunta: 'O que é fisioterapia, em termos gerais?',
      resposta:
        'É a área da saúde que estuda o movimento humano e atua para preservar, desenvolver e recuperar as funções do corpo. O que será feito em cada caso é definido depois da avaliação.',
    },
    {
      pergunta: 'O que é pilates, em termos gerais?',
      resposta:
        'É um método de exercícios que trabalha força, controle, mobilidade e respiração de forma integrada. Os exercícios são escolhidos de acordo com cada pessoa.',
    },
    {
      pergunta: 'Preciso de indicação médica?',
      resposta:
        'Depende do caso e da forma de atendimento. Isso é combinado com a clínica na avaliação. Se você tiver um pedido ou exames, leve no primeiro dia.',
    },
    {
      pergunta: 'Fisioterapia ou pilates: como saber qual escolher?',
      resposta:
        'Não é preciso decidir antes. Na avaliação, a clínica conversa com você e explica qual caminho faz mais sentido.',
    },
    {
      pergunta: 'Como faço para agendar?',
      resposta:
        'Pelo WhatsApp (35) 98835-3607, pelo telefone (35) 3712-3444 ou pelo formulário desta página, que monta a mensagem e abre o WhatsApp da clínica.',
    },
    {
      pergunta: 'Posso agendar pelo WhatsApp?',
      resposta:
        'Sim. Envie sua mensagem e a equipe responde com os horários disponíveis. O horário só fica marcado depois que a clínica confirma.',
    },
    {
      pergunta: 'Quais são os horários da clínica?',
      resposta:
        'Segunda a quinta, das 8h às 19h. Sexta, das 8h às 17h. Sábado e domingo a clínica fica fechada. Em feriados os horários podem variar.',
    },
    {
      pergunta: 'Onde fica a clínica?',
      resposta: 'Na R. São Paulo, 693, no Centro de Poços de Caldas - MG, CEP 37701-012.',
    },
    {
      pergunta: 'O que levar no primeiro atendimento?',
      resposta:
        'Um documento com foto e, se tiver, pedidos e exames relacionados. Outros detalhes são combinados com a clínica ao agendar.',
    },
  ] as Pergunta[],

  // Liga/desliga seções inteiras
  secoes: {
    hero: true,
    cuidado: true,
    atendimentos: true,
    equipe: true, // ainda depende de mostrarEquipe + dados
    fotos: true, // ainda depende de haver fotos
    comoFunciona: true,
    faq: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

// Utilitários
export const waLink = (mensagem: string = CONFIG.mensagens.geral) =>
  CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}` : ''

export const telLink = () => (CONFIG.telefone ? `tel:${CONFIG.telefone}` : '')

export const equipeVisivel = () =>
  CONFIG.mostrarEquipe && CONFIG.equipe.filter((p) => p.nome.trim() && p.registro.trim())
