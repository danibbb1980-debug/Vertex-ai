/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ('' / null / []) = o bloco correspondente NÃO aparece.
 * Fonte dos dados: Google Maps e bio do Instagram (ver README).
 */

export type Dia = {
  /** 0 = domingo ... 6 = sábado (igual a Date.getDay()) */
  dow: number
  nome: string
  curto: string
  /** "HH:MM" ou null se fechado */
  abre: string | null
  fecha: string | null
}

export type Atendimento = {
  id: string
  nome: string
  /** forma usada na frase da mensagem de WhatsApp: "informações sobre {mensagem}" */
  mensagem: string
  descricao: string
}

export type Foto = {
  /** caminhos em /public, sem extensão; o site espera -320 e -440 em .webp e .avif */
  base: string
  largura: number
  altura: number
  alt: string
} | null

export const CONFIG = {
  /** true = faixa "Rascunho" + noindex nas metas. Ver README para desligar por completo. */
  rascunho: true,

  /** URL pública absoluta (sem barra no final). Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://barbara-garcia-rascunho.vercel.app',

  marca: {
    nome: 'Barbara Garcia',
    descritor: 'Estética',
    nomeCompleto: 'Barbara Garcia Estética',
  },

  /** Ainda não informados. Preencha quando houver confirmação; vazio = não aparece. */
  profissional: {
    titulo: '',
    formacao: '',
    registro: '',
  },

  /** Foto da seção "Sobre". Use null para mostrar a composição com monograma e favo. */
  foto: {
    base: '/img/barbara',
    largura: 440,
    altura: 550,
    alt: 'Retrato de Barbara Garcia sorrindo, de jaleco branco com o nome da marca bordado, diante de um painel de madeira ripada.',
  } as Foto,

  /** Só dígitos, com DDI 55 e DDD. Vazio = botões e formulário de WhatsApp não aparecem. */
  whatsapp: '5519971692684',
  whatsappExibicao: '(19) 97169-2684',

  instagram: {
    url: 'https://www.instagram.com/barbaragarciaestetica/',
    usuario: '@barbaragarciaestetica',
  },

  maps: {
    url: 'https://maps.app.goo.gl/W4q1hbUSejtvd18D8',
    /** iframe sem chave de API; só carrega quando a pessoa pede (sem cookies antes disso) */
    embed:
      'https://www.google.com/maps?q=R.+Manoel+da+Costa+Patr%C3%A3o,+34+-+Vila+Fleming,+S%C3%A3o+Jo%C3%A3o+da+Boa+Vista+-+SP,+13876-039&output=embed',
  },

  endereco: {
    rua: 'R. Manoel da Costa Patrão, 34',
    bairro: 'Vila Fleming',
    cidade: 'São João da Boa Vista',
    uf: 'SP',
    cep: '13876-039',
  },

  /** Horários do Google, por dia, sem pausa de almoço. */
  horarios: [
    { dow: 1, nome: 'Segunda-feira', curto: 'Seg', abre: '15:00', fecha: '20:00' },
    { dow: 2, nome: 'Terça-feira', curto: 'Ter', abre: '07:00', fecha: '19:00' },
    { dow: 3, nome: 'Quarta-feira', curto: 'Qua', abre: '06:00', fecha: '19:00' },
    { dow: 4, nome: 'Quinta-feira', curto: 'Qui', abre: '08:00', fecha: '21:00' },
    { dow: 5, nome: 'Sexta-feira', curto: 'Sex', abre: '08:00', fecha: '20:00' },
    { dow: 6, nome: 'Sábado', curto: 'Sáb', abre: '08:00', fecha: '18:00' },
    { dow: 0, nome: 'Domingo', curto: 'Dom', abre: null, fecha: null },
  ] as Dia[],

  /** Dias com destaque visual na faixa de horários (quarta cedo, quinta tarde). */
  destaquesHorario: {
    3: 'a partir das 6h',
    4: 'até as 21h',
  } as Record<number, string>,

  avisoHorarios: 'Horários podem variar em feriados.',

  /** Somente atendimentos confirmados (bio do Instagram). Descrições gerais, sem promessa. */
  atendimentos: [
    {
      id: 'massagens',
      nome: 'Massagens',
      mensagem: 'massagens',
      descricao: 'Atendimento de massagem, realizado com avaliação prévia.',
    },
    {
      id: 'terapias',
      nome: 'Terapias faciais e corporais',
      mensagem: 'terapias faciais e corporais',
      descricao: 'Atendimentos de cuidado facial e corporal, definidos após conversa e avaliação.',
    },
    {
      id: 'depilacao',
      nome: 'Depilação com cera',
      mensagem: 'depilação com cera',
      descricao: 'Atendimento de remoção de pelos com cera, com avaliação prévia.',
    },
  ] as Atendimento[],

  agendamento: {
    exigirAtendimento: false,
    /** opções extras do select, além dos atendimentos */
    opcoesExtras: ['Ainda não sei, quero conversar'],
    /** só para clínicas de urgência; aqui fica desligado */
    urgencia: false,
    limiteObservacoes: 300,
    /** quantos dias à frente o calendário permite */
    diasAFrente: 90,
  },

  mensagens: {
    geral: 'Olá! Vi o site da Barbara Garcia Estética e gostaria de agendar um atendimento.',
    porAtendimento: 'Olá! Vi o site da Barbara Garcia Estética e gostaria de informações sobre {atendimento}.',
    solicitacao: 'Olá! Vim pelo site da Barbara Garcia Estética e gostaria de solicitar um agendamento.',
  },

  /** Liga/desliga seções. Uma seção ligada sem conteúdo também não aparece. */
  secoes: {
    horariosDestaque: true,
    sobre: true,
    atendimentos: true,
    faixa: true,
    antesDeAgendar: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    localizacao: true,
    agendamento: true,
    ctaFinal: true,
    whatsappFlutuante: true,
  },
}

export type Config = typeof CONFIG
