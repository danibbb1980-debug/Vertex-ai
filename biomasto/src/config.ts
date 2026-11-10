/**
 * TODOS os dados do site ficam aqui.
 * Regra: campo vazio ("") ou lista vazia = o bloco correspondente NÃO aparece no site.
 * Veja o README.md para instruções de edição.
 */

export type Periodo = { inicio: string; fim: string } // "HH:MM"
export type Dia = {
  nome: string // "Segunda"
  semana: number // 0 = domingo ... 6 = sábado (padrão do JavaScript)
  periodos: Periodo[] // vazio = fechado
}

export type Atendimento = {
  id: string
  nome: string
  resumo: string
  texto: string
}

export type Medico = { nome: string; crm: string; rqe: string; area: string }

export const CONFIG = {
  /** Faixa de rascunho + metas noindex. Mude para false só na publicação definitiva. */
  rascunho: true,

  /** URL pública, sem barra no final. Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://biomasto-rascunho.vercel.app',

  nome: 'Clínica Biomasto',
  cidade: 'Poços de Caldas',
  uf: 'MG',

  endereco: {
    rua: 'Av. Gentil Messías-Kitate, 240',
    complemento: 'Sala 105',
    bairro: 'Vila Cruz',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37701-528',
  },

  telefone: '(35) 3414-9050',
  telefoneLink: 'tel:+553534149050',
  telefoneE164: '+553534149050',

  /** Número preparado para WhatsApp. Só é usado se usarWhatsapp = true. */
  whatsapp: '553534149050',
  /** Hoje false: não há confirmação de que o número recebe WhatsApp. */
  usarWhatsapp: false,

  instagram: { url: 'https://www.instagram.com/biomasto/', usuario: '@biomasto' },
  maps: {
    url: 'https://maps.app.goo.gl/dBnKNx5av5ybBgFm9',
    embed:
      'https://www.google.com/maps?q=Av.+Gentil+Mess%C3%ADas-Kitate,+240,+Vila+Cruz,+Po%C3%A7os+de+Caldas+-+MG,+37701-528&output=embed',
  },

  /** Horários (fonte: Google). Exibidos exatamente assim. */
  horarios: [
    { nome: 'Segunda', semana: 1, periodos: [{ inicio: '09:00', fim: '12:00' }, { inicio: '13:00', fim: '18:48' }] },
    { nome: 'Terça', semana: 2, periodos: [{ inicio: '08:00', fim: '12:00' }, { inicio: '13:00', fim: '17:48' }] },
    { nome: 'Quarta', semana: 3, periodos: [{ inicio: '08:00', fim: '12:00' }, { inicio: '13:00', fim: '17:48' }] },
    { nome: 'Quinta', semana: 4, periodos: [{ inicio: '09:00', fim: '12:00' }, { inicio: '13:00', fim: '18:48' }] },
    { nome: 'Sexta', semana: 5, periodos: [{ inicio: '09:00', fim: '12:00' }, { inicio: '13:00', fim: '18:48' }] },
    { nome: 'Sábado', semana: 6, periodos: [] },
    { nome: 'Domingo', semana: 0, periodos: [] },
  ] as Dia[],
  avisoHorarios: 'Pausa para almoço das 12h00 às 13h00. Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'mastologia',
      nome: 'Mastologia',
      resumo: 'Cuidado e acompanhamento da saúde das mamas.',
      texto:
        'Consultas para acompanhar a saúde das mamas ao longo do tempo, tirar dúvidas e conversar sobre o que chamou sua atenção.',
    },
    {
      id: 'ginecologia',
      nome: 'Ginecologia',
      resumo: 'Acompanhamento da saúde da mulher ao longo da vida.',
      texto:
        'Consultas de rotina e de acompanhamento em cada fase da vida, com espaço para perguntas e explicações claras.',
    },
    {
      id: 'obstetricia',
      nome: 'Obstetrícia',
      resumo: 'Acompanhamento da gestação.',
      texto:
        'Consultas para acompanhar a gestação, com orientações explicadas com calma a cada encontro.',
    },
  ] as Atendimento[],

  /** Equipe: desligada até haver nomes com CRM-MG e RQE confirmados. */
  mostrarEquipe: false,
  equipe: [
    // { nome: '', crm: '', rqe: '', area: '' },
  ] as Medico[],

  /** OBRIGATÓRIO antes de publicar (regra de publicidade médica do CFM). */
  diretorTecnico: { nome: '', crm: '' },

  /**
   * Fotos: qualquer imagem em ./referencias/fotos/ aparece na seção "A clínica".
   * Use esta lista para dar um texto alternativo (alt) e uma legenda a cada arquivo (pelo nome, sem extensão).
   * A primeira foto (ordem alfabética) é a principal da seção.
   */
  mostrarFotos: true,
  fotos: {
    '1-recepcao': { alt: 'Recepção da Clínica Biomasto, com sofá, poltronas claras e balcão de atendimento.', legenda: 'Recepção' },
    '2-consultorio': { alt: 'Consultório com mesa clara e duas poltronas.', legenda: 'Consultório' },
    '3-sala-de-exames': { alt: 'Consultório com mesa e, ao lado, sala de exames separada por divisória.', legenda: 'Consultório e sala de exames' },
    '4-entrada-sala-105': { alt: 'Corredor do prédio com a porta de vidro da Sala 105 e a recepção ao fundo.', legenda: 'Entrada, Sala 105' },
  } as Record<string, { alt: string; legenda: string }>,

  agendamento: {
    exigirAtendimento: false,
    opcoesExtras: ['Primeira consulta', 'Ainda não sei, quero conversar'],
    mensagemInicial: 'Olá! Vim pelo site da Clínica Biomasto e gostaria de solicitar um agendamento.',
  },

  mensagens: {
    geral: 'Olá! Vi o site da Clínica Biomasto e gostaria de agendar uma consulta.',
    porAtendimento: (nome: string) =>
      `Olá! Vi o site da Clínica Biomasto e gostaria de informações sobre ${nome}.`,
  },

  /** Liga/desliga seções. Uma seção ligada só aparece se tiver conteúdo. */
  secoes: {
    clinica: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true, // só aparece com usarWhatsapp = true
    ctaFinal: true,
  },

  seo: {
    titulo: 'Clínica Biomasto | Mastologia, Ginecologia e Obstetrícia em Poços de Caldas - MG',
    descricao:
      'Atendimento em mastologia, ginecologia e obstetrícia em Poços de Caldas - MG, com avaliação individual e hora marcada.',
    /** Caminho de uma imagem real para og:image (ex.: "/og.jpg"). Vazio = sem og:image. */
    ogImage: '/og-biomasto.jpg',
  },
}

export type Config = typeof CONFIG
