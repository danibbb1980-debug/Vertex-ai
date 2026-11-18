// ─────────────────────────────────────────────────────────────
// Todos os dados do site ficam aqui. Campo vazio ("" ou []) = o bloco não aparece.
// ─────────────────────────────────────────────────────────────

export type Dia = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export interface Atendimento {
  id: string;
  nome: string;
  descricao: string;
}

export interface Foto {
  src480: string;
  src960: string;
  largura: number;
  altura: number;
  alt: string;
}

export interface Profissional {
  nome: string;
  profissao: string;
  registro: string;
  /** Preencha apenas com especialidade registrada no conselho, com o número do registro. */
  especialidade: string;
  registroEspecialidade: string;
  fotos: Foto[];
}

const foto = (nome: string, largura: number, altura: number, alt: string): Foto => ({
  src480: `/fotos/${nome}-480.webp`,
  src960: `/fotos/${nome}-960.webp`,
  largura,
  altura,
  alt,
});

export const CONFIG = {
  rascunho: true,
  siteUrl: 'https://dra-roberta-motta-rascunho.vercel.app',

  nome: 'Dra. Roberta Motta',
  cidade: 'Varginha',
  uf: 'MG',

  /** Logo: troque pelos arquivos originais em alta resolução quando estiverem disponíveis. */
  logo: {
    claro: '/marca/logo-ameixa.svg',
    escuro: '/marca/logo-dourado.svg',
  },

  profissionais: [
    {
      nome: 'Dra. Roberta Motta',
      profissao: 'Cirurgiã-dentista',
      registro: 'CRO 33126 · Varginha/MG',
      especialidade: '',
      registroEspecialidade: '',
      fotos: [
        foto('profissional', 930, 1162, 'Dra. Roberta Motta, de pé junto a um arco do consultório'),
        foto('profissional-sentada', 752, 1168, 'Dra. Roberta Motta sentada na sala de espera do consultório'),
      ],
    },
  ] as Profissional[],

  responsavelTecnico: { nome: '', registro: '' },

  usarWhatsapp: true,
  whatsapp: '5535988814748',
  whatsappExibicao: '(35) 98881-4748',
  telefoneFixo: '',
  email: '',
  instagram: 'https://www.instagram.com/drarobertamotta/',

  mensagens: {
    geral: 'Olá! Vi o site da Dra. Roberta Motta e gostaria de agendar uma avaliação.',
    atendimento: (nome: string) =>
      `Olá! Vi o site da Dra. Roberta Motta e gostaria de agendar uma avaliação sobre ${nome.toLowerCase()}.`,
  },

  endereco: {
    rua: 'Rua Alferes Joaquim Antônio, 170',
    bairro: 'Vila Pinto',
    cidade: 'Varginha',
    uf: 'MG',
    cep: '37010-600',
    rota: 'https://www.google.com/maps/dir/?api=1&destination=R.%20Alferes%20Joaquim%20Ant%C3%B4nio%2C%20170%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG',
    mapaEmbed:
      'https://www.google.com/maps?q=R.%20Alferes%20Joaquim%20Ant%C3%B4nio%2C%20170%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG%2C%2037010-600&output=embed',
  },

  /** Horário de funcionamento. Lista vazia = fechado. */
  horarios: {
    seg: [['13:00', '18:00']],
    ter: [['13:00', '18:00']],
    qua: [['13:00', '18:00']],
    qui: [['13:00', '18:00']],
    sex: [['13:00', '18:00']],
    sab: [],
    dom: [],
  } as Record<Dia, [string, string][]>,
  avisoHorarios: 'Os horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'avaliacao-facial',
      nome: 'Avaliação facial',
      descricao:
        'Uma consulta para ouvir o que você procura, observar o rosto como um todo e explicar o que pode, ou não, ser indicado no seu caso. Nenhuma decisão é tomada antes dessa conversa.',
    },
    {
      id: 'harmonizacao-facial',
      nome: 'Harmonização facial',
      descricao:
        'Procedimentos estéticos da face planejados a partir da avaliação. O plano, as etapas e os cuidados são explicados antes de qualquer decisão, para que você escolha com informação.',
    },
  ] as Atendimento[],

  /** Fotos do ambiente (seção Localização). */
  fotosConsultorio: [
    foto('consultorio', 1043, 1558, 'Sala de atendimento com mesa curva, poltrona e painel iluminado'),
    foto('cafe', 1170, 1558, 'Bandeja com café servido na sala de espera'),
    foto('xicara', 600, 420, 'Xícara com o monograma RM sobre bandeja de madeira'),
  ] as Foto[],

  secoes: {
    hero: true,
    avaliacao: true,
    atendimento: true,
    profissional: true,
    comoFunciona: true,
    duvidas: true,
    local: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const DIAS: { id: Dia; nome: string; curto: string }[] = [
  { id: 'seg', nome: 'Segunda-feira', curto: 'Seg' },
  { id: 'ter', nome: 'Terça-feira', curto: 'Ter' },
  { id: 'qua', nome: 'Quarta-feira', curto: 'Qua' },
  { id: 'qui', nome: 'Quinta-feira', curto: 'Qui' },
  { id: 'sex', nome: 'Sexta-feira', curto: 'Sex' },
  { id: 'sab', nome: 'Sábado', curto: 'Sáb' },
  { id: 'dom', nome: 'Domingo', curto: 'Dom' },
];

/** getDay() → Dia */
export const DIA_POR_INDICE: Dia[] = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

export const waLink = (msg: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

export const hora = (h: string) => h.replace(':00', 'h').replace(/^0/, '');
