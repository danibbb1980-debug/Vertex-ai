/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ('' ou lista vazia) = o bloco correspondente NÃO aparece.
 * Nunca preencha com textos provisórios: o layout se reorganiza sozinho.
 */

export interface Especialidade {
  nome: string
  descricao: string
}

export interface Foto {
  /** Caminho a partir de /public, ex.: '/fotos/sala.webp' */
  src: string
  /** Descrição do que aparece na foto (leitores de tela) */
  alt: string
  /** Legenda curta exibida abaixo da foto ('' = sem legenda) */
  legenda: string
  largura: number
  altura: number
}

export interface Profissional {
  /** Nome completo, como no conselho */
  nome: string
  /** Ex.: 'Fonoaudióloga', 'Psicóloga', 'Pedagoga' */
  profissao: string
  /** Ex.: 'CRFa 6-12345'. Obrigatório para profissões com conselho. */
  registro: string
  /** true só depois da autorização por escrito do profissional */
  autorizado: boolean
  foto?: string
  texto?: string
}

export interface Horario {
  /** 0 = domingo, 1 = segunda ... 6 = sábado */
  dia: number
  abre: string
  fecha: string
  /** Pausa (ex.: almoço). Deixe sem para não haver pausa. */
  intervalo?: { inicio: string; fim: string }
}

const especialidades: Especialidade[] = [
  {
    nome: 'Terapia Ocupacional',
    descricao:
      'Acompanha a participação da pessoa nas atividades do dia a dia, como o autocuidado, o estudo, o trabalho e o lazer.',
  },
  {
    nome: 'Fisioterapia',
    descricao:
      'Estuda o movimento do corpo e acompanha a postura, a mobilidade e a funcionalidade em diferentes fases da vida.',
  },
  {
    nome: 'Fonoaudiologia',
    descricao: 'Acompanha a comunicação, a linguagem, a voz e a alimentação.',
  },
  {
    nome: 'Psicologia',
    descricao:
      'Estuda o comportamento e os processos mentais, e acompanha emoções, pensamentos e relações.',
  },
  {
    nome: 'Pedagogia',
    descricao:
      'Acompanha os processos de aprendizagem e o modo como cada pessoa constrói conhecimento.',
  },
  {
    nome: 'Serviço Social',
    descricao:
      'Orienta sobre direitos, acesso a serviços públicos e recursos da rede de apoio da pessoa e da família.',
  },
  {
    nome: 'Nutrição',
    descricao:
      'Estuda a alimentação e a relação dela com a saúde, considerando hábitos, rotina e necessidades individuais.',
  },
  {
    nome: 'Musicoterapia',
    descricao:
      'Usa a música e seus elementos, como som, ritmo e melodia, como meio de expressão e de comunicação.',
  },
]

const nome = 'Afeto Espaço Terapêutico'

export const CONFIG = {
  /** Mostra a faixa de rascunho e bloqueia a indexação (meta robots). */
  rascunho: true,
  /** URL pública, sem barra no final. Usada no canonical, og:url e og:image. */
  siteUrl: 'https://afeto-espaco-terapeutico-rascunho.vercel.app',

  nome,
  cidade: 'Poços de Caldas',
  uf: 'MG',
  fraseMarca: 'Afeto é tocar com respeito o mundo do outro.',

  /** Só dígitos, com 55 + DDD. */
  whatsapp: '5535997642371',
  whatsappExibicao: '(35) 99764-2371',
  /** Telefone fixo. Vazio = sem botão "Ligar". */
  telefone: '',

  instagram: {
    url: 'https://www.instagram.com/afeto.espacoterapeutico/',
    usuario: '@afeto.espacoterapeutico',
  },
  maps: {
    url: 'https://maps.app.goo.gl/dGjQcMKkw7Euc4Q27',
    /** Busca usada no mapa incorporado (carregado só quando a pessoa pede). */
    busca: 'Afeto Espaço Terapêutico, R. Nico Duarte, 359, Jardim do Ginásio, Poços de Caldas - MG',
  },
  endereco: {
    rua: 'R. Nico Duarte, 359',
    bairro: 'Jardim do Ginásio',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37701-501',
  },

  horarios: [1, 2, 3, 4, 5].map((dia) => ({ dia, abre: '09:00', fecha: '17:00' })) as Horario[],
  avisoHorarios: 'Os horários podem variar em feriados.',

  dimensoes: [
    { nome: 'Saúde física', texto: 'O corpo, o movimento e as atividades da rotina.' },
    { nome: 'Saúde cognitiva', texto: 'Atenção, linguagem, aprendizagem e organização do pensamento.' },
    { nome: 'Saúde emocional', texto: 'Sentimentos, relações e o modo de lidar com o que se vive.' },
  ],

  especialidades,
  /** Opções do formulário de agendamento (somente atendimentos confirmados). */
  atendimentos: especialidades.map((e) => e.nome),

  fotos: [
    {
      src: '/fotos/sala-ampla.webp',
      alt: 'Sala ampla com piso de madeira, tatame azul, balanço suspenso em estrutura metálica, piscina de bolinhas e uma mesa baixa com cadeiras pequenas.',
      legenda: 'Sala com tatame e balanço suspenso',
      largura: 739,
      altura: 549,
    },
    {
      src: '/fotos/sala-acolhimento.webp',
      alt: 'Sala clara com sofá de tecido em retalhos, poltrona azul, mesa de madeira junto à janela, tapete e bichos de pelúcia.',
      legenda: 'Sala com sofá e poltrona',
      largura: 733,
      altura: 957,
    },
    {
      src: '/fotos/sala-mesas.webp',
      alt: 'Sala com mesa de trabalho, duas cadeiras pretas, estante com plantas, espelho orgânico na parede e uma mesa redonda baixa com cadeirinhas.',
      legenda: 'Sala com mesa e espelho',
      largura: 692,
      altura: 925,
    },
    {
      src: '/fotos/sala-movimento.webp',
      alt: 'Sala com teto de madeira, estrutura de grade com faixas e acessórios pendurados, colchonetes, mesa com cadeiras amarelas e espelho ao fundo.',
      legenda: 'Sala com teto de madeira',
      largura: 739,
      altura: 971,
    },
    {
      src: '/fotos/sala-atendimento.webp',
      alt: 'Sala de piso claro com mesa branca, duas cadeiras, armário, prateleira com plantas e três quadros de flores na parede.',
      legenda: 'Sala de atendimento',
      largura: 703,
      altura: 938,
    },
    {
      src: '/fotos/sala-integracao.webp',
      alt: 'Vista da sala com tatame azul, balanço suspenso, bolas de exercício, cabana de tecido e mesa com material de escritório em primeiro plano.',
      legenda: 'Outra vista da sala com tatame',
      largura: 739,
      altura: 549,
    },
  ] as Foto[],

  /** Liga o bloco de equipe. Só exibe profissionais com autorizado = true e registro (quando a profissão tem conselho). */
  mostrarEquipe: false,
  /** Profissões sem conselho de classe: aparecem só com nome e formação. */
  profissoesSemConselho: ['Pedagogia', 'Pedagoga', 'Pedagogo', 'Musicoterapia', 'Musicoterapeuta'],
  equipe: [
    // Exemplo (deixe comentado até ter autorização):
    // { nome: 'Nome Completo', profissao: 'Fonoaudióloga', registro: 'CRFa 6-00000', autorizado: true, foto: '/equipe/nome.webp', texto: '' },
  ] as Profissional[],

  agendamento: {
    exigirAtendimento: false,
    limiteObservacoes: 300,
    /** Duração de cada bloco de horário, em minutos. */
    blocoMinutos: 60,
  },

  mensagens: {
    geral: `Olá! Vi o site do ${nome} e gostaria de agendar uma avaliação.`,
    porAtendimento: (atendimento: string) =>
      `Olá! Vi o site do ${nome} e gostaria de informações sobre ${atendimento}.`,
    formulario: `Olá! Vim pelo site do ${nome} e gostaria de solicitar um agendamento.`,
  },

  comoFunciona: [
    {
      titulo: 'Contato e agendamento',
      texto: 'Você conversa com a equipe pelo WhatsApp e combina o dia e o horário do primeiro encontro.',
    },
    {
      titulo: 'Avaliação',
      texto: 'Um encontro individual para entender a sua necessidade, ou a de quem você acompanha.',
    },
    {
      titulo: 'Plano de cuidado explicado com clareza',
      texto: 'O profissional conta o que observou, apresenta o caminho proposto e responde às suas dúvidas.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'Os atendimentos seguem com hora marcada, conforme o que foi combinado com o profissional.',
    },
  ],

  /** Ligue/desligue seções inteiras. Seções sem conteúdo já somem sozinhas. */
  secoes: {
    hero: true,
    faixaAreas: true,
    espaco: true,
    fotos: true,
    atendimentos: true,
    equipe: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },

  seo: {
    title: 'Afeto Espaço Terapêutico | Atendimento Multiprofissional em Poços de Caldas - MG',
    description:
      'Espaço multiprofissional em Poços de Caldas - MG para a saúde física, cognitiva e emocional, com avaliação individual e hora marcada.',
    /** Imagem para compartilhamento (em /public). '' = sem og:image. */
    imagem: '/og-afeto.png',
  },
}

export type Config = typeof CONFIG
