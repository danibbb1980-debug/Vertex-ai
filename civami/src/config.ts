/**
 * CIVAMI Clínica de Saúde: todos os dados do site ficam aqui.
 *
 * Regra: só entra o que veio da ficha do Google e do Instagram.
 * Tudo marcado com "CONFIRMAR COM A CLÍNICA" é provisório e aparece no site
 * como placeholder visível até ser validado.
 */

export type Area = 'odontologia' | 'medicina'

export interface Atendimento {
  area: Area
  titulo: string
  descricao: string
  /** true enquanto o item for só um exemplo, ainda não confirmado pela clínica */
  exemplo?: boolean
}

export interface Profissional {
  nome: string
  /** "Cirurgião(ã)-dentista" ou "Médico(a)" */
  categoria: string
  /** Ex.: "CRO-MG 00000" ou "CRM-MG 00000" (obrigatório) */
  registro: string
  /** Só preencha se houver registro de especialidade (CRO) ou RQE (CRM) */
  especialidade?: string
  /** Caminho de uma foto real em /public/fotos (opcional) */
  foto?: string
  exemplo?: boolean
}

export const CONFIG = {
  /** Faixa "Rascunho" + noindex. Ver README para desligar. */
  rascunho: true,

  /** URL pública final, sem barra no fim. Usada em canonical, og:url e og:image. */
  siteUrl: 'https://civami-rascunho.vercel.app',

  nome: 'CIVAMI Clínica de Saúde',
  nomeCurto: 'CIVAMI',
  posicionamento: 'Odontologia e Medicina Integradas',

  whatsapp: '5535988355190',
  telefoneExibicao: '(35) 98835-5190',
  telefoneSchema: '+55-35-98835-5190',

  instagram: 'https://www.instagram.com/clinica_civami',
  instagramHandle: '@clinica_civami',
  mapsUrl: 'https://maps.app.goo.gl/1T5cPD9t5wY29fne7',

  // CONFIRMAR COM A CLÍNICA: endereço copiado da ficha do Google.
  endereco: {
    rua: 'R. Bias Fortes, 722',
    bairro: 'Centro',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37130-085',
  },

  // CONFIRMAR COM A CLÍNICA: horários da ficha do Google.
  // A segunda-feira apareceu como "Dia de Finados" na ficha: confirmar o horário regular.
  horarios: [
    { dia: 'Segunda-feira', abre: ['08:00', '13:00'], fecha: ['12:00', '18:00'], confirmar: true },
    { dia: 'Terça a sexta', abre: ['08:00', '13:00'], fecha: ['12:00', '18:00'] },
    { dia: 'Sábado', abre: ['08:00'], fecha: ['12:00'] },
    { dia: 'Domingo', abre: [], fecha: [] },
  ] as { dia: string; abre: string[]; fecha: string[]; confirmar?: boolean }[],
  observacaoHorario: 'Horários podem variar em feriados.',

  mensagens: {
    geral: 'Olá! Vi o site da CIVAMI e gostaria de agendar uma avaliação.',
    atendimento: (titulo: string, area: string) =>
      `Olá! Vi o site da CIVAMI e gostaria de conversar sobre ${titulo} (${area}).`,
    profissional: 'Olá! Vi o site da CIVAMI e gostaria de saber mais sobre a equipe.',
  },

  /**
   * Atendimentos confirmados pela clínica. Enquanto estiver vazio, o site mostra
   * os EXEMPLOS abaixo, marcados como "[A CONFIRMAR COM A CLÍNICA]".
   */
  atendimentos: [] as Atendimento[],

  /** Profissionais confirmados (com CRO/CRM). Vazio = mostra cartões de exemplo. */
  profissionais: [] as Profissional[],

  // CONFIRMAR COM A CLÍNICA: obrigatórios na versão final (rodapé).
  responsaveisTecnicos: {
    odontologia: { nome: '[NOME DO RESPONSÁVEL TÉCNICO]', registro: 'CRO-MG [A CONFIRMAR]' },
    medicina: { nome: '[NOME DO DIRETOR TÉCNICO MÉDICO]', registro: 'CRM-MG [A CONFIRMAR]' },
  },

  /** Nota do Google: só ligue com nota real e autorização. Sem depoimentos. */
  mostrarNotaGoogle: false,
  notaGoogle: null as null | { nota: number; total: number },

  /** Liga/desliga cada seção da página. */
  secoes: {
    clinica: true,
    faixa: true,
    atendimentos: true,
    paraQuem: true,
    comoFunciona: true,
    equipe: true,
    compromissos: true,
    estrutura: true,
    avaliacoes: true, // só aparece se mostrarNotaGoogle = true
    duvidas: true,
    contato: true,
    ctaFinal: true,
  },

  fotos: {
    /** Foto real enviada pela clínica (equipe). Sem nomes até confirmação. */
    equipe: {
      base: '/fotos/equipe-civami',
      larguras: [480, 720, 960, 1170],
      largura: 1170,
      altura: 1560,
      alt: 'Equipe da CIVAMI Clínica de Saúde em retrato de estúdio',
    },
    /** Fotos do espaço da clínica: ainda não recebidas. */
    espaco: null as null | { src: string; alt: string },
  },
} as const

/** Exemplos exibidos enquanto CONFIG.atendimentos estiver vazio. CONFIRMAR COM A CLÍNICA. */
export const ATENDIMENTOS_EXEMPLO: Atendimento[] = [
  {
    area: 'odontologia',
    titulo: 'Avaliação odontológica',
    descricao:
      'Primeira conversa para entender suas queixas e seu histórico, observar a saúde bucal e explicar com calma o que foi visto.',
    exemplo: true,
  },
  {
    area: 'odontologia',
    titulo: 'Prevenção e higiene bucal',
    descricao:
      'Consultas de acompanhamento e orientações para a rotina de cuidados com dentes e gengiva em casa.',
    exemplo: true,
  },
  {
    area: 'odontologia',
    titulo: 'Tratamentos restauradores',
    descricao:
      'Quando há necessidade de restaurar um dente, as opções são apresentadas e discutidas antes de qualquer decisão.',
    exemplo: true,
  },
  {
    area: 'odontologia',
    titulo: '[Especialidade odontológica]',
    descricao: 'Espaço reservado para uma especialidade com registro no CRO, a ser informada pela clínica.',
    exemplo: true,
  },
  {
    area: 'medicina',
    titulo: 'Consulta médica',
    descricao:
      'Atendimento com escuta atenta, exame clínico e explicação clara sobre o que foi observado e os próximos passos.',
    exemplo: true,
  },
  {
    area: 'medicina',
    titulo: 'Acompanhamento de saúde',
    descricao:
      'Retornos programados para acompanhar sua saúde ao longo do tempo, com registro do que foi conversado em cada consulta.',
    exemplo: true,
  },
  {
    area: 'medicina',
    titulo: 'Orientação e encaminhamentos',
    descricao:
      'Quando necessário, orientação sobre exames e encaminhamento para outros profissionais, sempre explicados com clareza.',
    exemplo: true,
  },
  {
    area: 'medicina',
    titulo: '[Especialidade médica]',
    descricao: 'Espaço reservado para uma especialidade com RQE, a ser informada pela clínica.',
    exemplo: true,
  },
]

/** Exemplos exibidos enquanto CONFIG.profissionais estiver vazio. CONFIRMAR COM A CLÍNICA. */
export const PROFISSIONAIS_EXEMPLO: Profissional[] = [
  {
    nome: '[NOME DO PROFISSIONAL]',
    categoria: 'Cirurgião(ã)-dentista',
    registro: '[CRO-MG, a confirmar]',
    especialidade: '[Especialidade, a confirmar]',
    exemplo: true,
  },
  {
    nome: '[NOME DO PROFISSIONAL]',
    categoria: 'Médico(a)',
    registro: '[CRM-MG, a confirmar]',
    especialidade: '[Especialidade/RQE, a confirmar]',
    exemplo: true,
  },
  {
    nome: '[NOME DO PROFISSIONAL]',
    categoria: 'Cirurgião(ã)-dentista ou Médico(a)',
    registro: '[CRO-MG ou CRM-MG, a confirmar]',
    especialidade: '[Especialidade/RQE, a confirmar]',
    exemplo: true,
  },
]

export const enderecoCompleto = () => {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}
