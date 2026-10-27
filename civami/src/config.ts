/**
 * CIVAMI Clínica de Saúde: todos os dados do site ficam aqui.
 *
 * Regra: só entra o que veio da ficha do Google e do Instagram da clínica.
 * O que não foi informado fica de fora do site (sem placeholders).
 */

export type Area = 'odontologia' | 'medicina'

export interface Atendimento {
  area: Area
  titulo: string
  descricao: string
  /** Nome de quem atende (aparece no cartão) */
  profissional?: string
}

export interface Profissional {
  nome: string
  /** "Cirurgião(ã)-dentista" ou "Médico(a)" */
  categoria: string
  /** Ex.: "CRO-MG 00000" ou "CRM-MG 00000". Exigido pelo CFO/CFM na versão final. */
  registro?: string
  /** Especialidade informada pela clínica (CRO: registro de especialista; CRM: RQE) */
  especialidade?: string
  /** Frase curta de apresentação, sem promessa de resultado */
  bio?: string
  /** Base do arquivo em /public/fotos, sem largura e extensão (ex.: "/fotos/nome") */
  foto?: string
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

  // Endereço da ficha do Google.
  endereco: {
    rua: 'R. Bias Fortes, 722',
    bairro: 'Centro',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37130-085',
  },

  // Horários da ficha do Google. A segunda-feira aparecia com o rótulo "Dia de Finados",
  // com o mesmo horário dos outros dias úteis; por isso foi agrupada com eles.
  horarios: [
    { dia: 'Segunda a sexta', abre: ['08:00', '13:00'], fecha: ['12:00', '18:00'] },
    { dia: 'Sábado', abre: ['08:00'], fecha: ['12:00'] },
    { dia: 'Domingo', abre: [], fecha: [] },
  ] as { dia: string; abre: string[]; fecha: string[] }[],
  observacaoHorario: 'Horários podem variar em feriados.',

  mensagens: {
    geral: 'Olá! Vi o site da CIVAMI e gostaria de agendar uma avaliação.',
    atendimento: (titulo: string, area: string) =>
      `Olá! Vi o site da CIVAMI e gostaria de conversar sobre ${titulo} (${area}).`,
    profissional: (nome: string) => `Olá! Vi o site da CIVAMI e gostaria de agendar uma consulta com ${nome}.`,
  },

  /** Atendimentos, conforme as apresentações dos profissionais no Instagram da clínica. */
  atendimentos: [
    {
      area: 'odontologia',
      titulo: 'Implantodontia',
      descricao:
        'Avaliação e planejamento para repor dentes perdidos com implantes, com cada etapa explicada antes de começar.',
      profissional: 'Dra. Mirian Aquino',
    },
    {
      area: 'odontologia',
      titulo: 'Ortodontia',
      descricao:
        'Correção da posição dos dentes e da mordida, com consultas periódicas de acompanhamento.',
      profissional: 'Dra. Vanessa Aquino',
    },
    {
      area: 'medicina',
      titulo: 'Dermatologia',
      descricao: 'Consultas sobre a saúde da pele, com escuta atenta e orientação clara sobre os cuidados.',
      profissional: 'Dr. Cicero',
    },
    {
      area: 'medicina',
      titulo: 'Tricologia e transplante capilar',
      descricao:
        'Avaliação de queixas dos cabelos e do couro cabeludo e, quando houver indicação, transplante capilar.',
      profissional: 'Dr. Cicero',
    },
    {
      area: 'medicina',
      titulo: 'Cuidado com feridas',
      descricao: 'Acompanhamento médico de feridas, com orientação sobre curativos e cuidados em casa.',
      profissional: 'Dr. Cicero',
    },
    {
      area: 'medicina',
      titulo: 'Emagrecimento',
      descricao: 'Acompanhamento médico para perda de peso, a partir de uma avaliação individual.',
      profissional: 'Dr. Cicero',
    },
  ] as Atendimento[],

  /** Profissionais apresentados no Instagram da clínica. Registros (CRO/CRM) ainda não informados. */
  profissionais: [
    {
      nome: 'Dra. Mirian Aquino',
      categoria: 'Cirurgiã-dentista',
      especialidade: 'Implantodontia',
      bio: 'Atua na reposição de dentes perdidos com implantes, com atendimento tranquilo e individualizado.',
      foto: '/fotos/mirian-aquino',
    },
    {
      nome: 'Dra. Vanessa Aquino',
      categoria: 'Cirurgiã-dentista',
      especialidade: 'Ortodontia · Mestre em Ciências Odontológicas',
      bio: 'Cirurgiã-dentista há 18 anos, acredita que ouvir e acompanhar cada paciente de perto faz parte do cuidado.',
      foto: '/fotos/vanessa-aquino',
    },
    {
      nome: 'Dr. Cicero',
      categoria: 'Médico',
      especialidade: 'Dermatologia',
      bio: 'Atua em saúde da pele, tricologia e transplante capilar, cuidado com feridas e acompanhamento para emagrecimento.',
      foto: '/fotos/cicero',
    },
  ] as Profissional[],

  /** Responsáveis técnicos (CRO e CRM). Vazio = bloco não aparece no rodapé. Exigido pelo CFO/CFM na versão final. */
  responsaveisTecnicos: [] as { area: string; nome: string; registro: string }[],

  /** Dados da ficha do Google ("Sobre"). */
  estrutura: {
    estacionamento: 'Estacionamento descoberto gratuito e vagas gratuitas na rua.',
    acessibilidade: 'Entrada e banheiro acessíveis para pessoas em cadeira de rodas.',
    pagamento: 'Cartão de crédito, cartão de débito e pagamento por aproximação (NFC).',
    agendamento: 'Atendimento com hora marcada: agende antes pelo WhatsApp.',
    acolhimento: 'Espaço que acolhe a comunidade LGBTQ+ e pessoas transgênero, com banheiro de gênero neutro.',
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
    /** Foto da equipe enviada pela clínica. */
    equipe: {
      base: '/fotos/equipe-civami',
      larguras: [480, 720, 960, 1170],
      largura: 1170,
      altura: 1560,
      alt: 'Dra. Mirian Aquino, Dr. Cicero e Dra. Vanessa Aquino, da equipe CIVAMI Clínica de Saúde',
    },
    /** Fotos do espaço da clínica: ainda não recebidas. */
    espaco: null as null | { src: string; alt: string },
  },
} as const

export const enderecoCompleto = () => {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}
