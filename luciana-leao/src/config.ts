/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) = o bloco correspondente NÃO aparece no site.
 * Não escreva textos provisórios como "a confirmar": deixe o campo vazio.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo ... 6 = sábado

export interface Horario {
  dia: DiaSemana
  /** "HH:MM". Deixe vazio com fechado: true para dias sem atendimento. */
  abre?: string
  fecha?: string
  fechado?: boolean
}

export interface Atendimento {
  id: string
  titulo: string
  /** Como o atendimento aparece na mensagem do WhatsApp: "...informações sobre {mensagem}." */
  mensagem: string
  descricao: string
  detalhe: string
}

export interface Config {
  rascunho: boolean
  siteUrl: string
  nome: string
  descritor: string
  profissional: {
    crm: string
    /** UF do CRM. Vazia = exibe "CRM 90524". Preenchida = exibe "CRM-MG 90524". */
    uf: string
    rqe: string
  }
  /**
   * Prefixo da foto real da médica (sem fundo) em /public. O site usa {foto}-480/-720/-1000 em .avif e .webp
   * (gerados por `npm run gerar:foto`). Aparece no arco do topo. Vazio = arco só com a orquídea.
   */
  foto: string
  fotoAlt: string
  /** Somente dígitos, com DDI e DDD. Vazio = botões e formulário de WhatsApp não aparecem. */
  whatsapp: string
  whatsappExibicao: string
  instagram: { url: string; usuario: string }
  mapsUrl: string
  endereco: {
    rua: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    cep: string
    referencia: string
  }
  /** Só os dias informados. Dia ausente = não aparece na tabela e fica bloqueado no formulário. */
  horarios: Horario[]
  avisoFeriados: string
  atendimentos: Atendimento[]
  agendamento: {
    exigirAtendimento: boolean
    /** Duração de cada bloco de horário no formulário, em minutos. */
    blocoMinutos: number
    /** Último horário que pode ser escolhido no formulário ("HH:MM"). */
    ultimoHorario: string
    /** Intervalo sem atendimento (almoço). Vazio = sem intervalo. */
    pausa: { inicio: string; fim: string } | null
    opcoesExtras: string[]
  }
  secoes: {
    horariosDestaque: boolean
    sobre: boolean
    atendimentos: boolean
    antesDaConsulta: boolean
    comoFunciona: boolean
    estrutura: boolean
    duvidas: boolean
    localizacao: boolean
    agendar: boolean
    ctaFinal: boolean
    faixaRolante: boolean
  }
}

export const CONFIG: Config = {
  rascunho: true,
  siteUrl: 'https://luciana-leao-rascunho.vercel.app',

  nome: 'Dra. Luciana Leão',
  descritor: 'Dermatologista',
  profissional: {
    crm: '90524',
    uf: '', // a confirmar com a médica (não exibir até ser informada)
    rqe: '32476',
  },

  foto: '/fotos/dra-luciana',
  fotoAlt: 'Dra. Luciana Leão, dermatologista',

  whatsapp: '5535988535585', // NÚMERO NÃO VERIFICADO: testar antes de enviar o site
  whatsappExibicao: '(35) 98853-5585',
  instagram: {
    url: 'https://www.instagram.com/dralucianaleaodermatologista/',
    usuario: '@dralucianaleaodermatologista',
  },
  mapsUrl: 'https://maps.app.goo.gl/BqsAseJhMGD8xL6h9',

  endereco: {
    rua: 'Av. Champagnat',
    numero: '863',
    complemento: 'Conj. 204',
    bairro: 'São Domingos',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37701-391',
    referencia: 'Após o Colégio Municipal',
  },

  horarios: [
    { dia: 1, abre: '08:00', fecha: '18:30' },
    { dia: 2, abre: '08:00', fecha: '18:30' },
    { dia: 3, abre: '08:00', fecha: '18:30' },
    { dia: 4, abre: '08:00', fecha: '18:30' },
    { dia: 5, abre: '08:00', fecha: '18:30' },
    { dia: 6, fechado: true },
  ],
  avisoFeriados: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'dermatologia',
      titulo: 'Dermatologia',
      mensagem: 'consulta dermatológica',
      descricao: 'Atendimento dermatológico com avaliação médica individual.',
      detalhe:
        'A dermatologia cuida da saúde da pele, dos cabelos e das unhas. Na consulta, você conversa com a médica, tira dúvidas e entende os próximos passos.',
    },
    {
      id: 'estetica',
      titulo: 'Estética',
      mensagem: 'atendimentos de estética',
      descricao: 'Atendimentos de estética com indicação definida após avaliação médica.',
      detalhe:
        'Antes de qualquer procedimento, a médica avalia, explica e conversa com você sobre o que faz sentido no seu caso.',
    },
    {
      id: 'laser',
      titulo: 'Laser',
      mensagem: 'atendimentos com laser',
      descricao: 'Atendimentos com laser, indicados após avaliação médica.',
      detalhe:
        'O uso do laser é sempre precedido de avaliação. As orientações de preparo e de cuidados são passadas na consulta.',
    },
  ],

  agendamento: {
    exigirAtendimento: false,
    blocoMinutos: 60,
    ultimoHorario: '17:00',
    pausa: null, // pausa de almoço não informada
    opcoesExtras: ['Ainda não sei, quero conversar'],
  },

  secoes: {
    horariosDestaque: true,
    sobre: true,
    atendimentos: true,
    antesDaConsulta: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
    faixaRolante: true,
  },
}

/** Opções do campo "Atendimento" do formulário (regras específicas deste projeto). */
export const OPCOES_AGENDAMENTO: string[] = [
  ...CONFIG.atendimentos.map((a) => (a.id === 'dermatologia' ? 'Consulta dermatológica' : a.titulo)),
  ...CONFIG.agendamento.opcoesExtras,
]
