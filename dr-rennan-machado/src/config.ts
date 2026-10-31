/**
 * TODOS os dados do site ficam aqui.
 * Regra: campo vazio ('', null, [] ou ausente) = o bloco correspondente NÃO aparece.
 * Fonte dos dados: ficha do Google Maps e bio do Instagram.
 */

export type Foto = { src: string; srcSet?: string; alt: string; width: number; height: number };

/** Faixa de atendimento de um dia (formato 24h "HH:MM"). */
export type Turno = { abre: string; fecha: string };

/**
 * Horário por dia da semana (0 = domingo ... 6 = sábado).
 * - objeto Turno  → aberto nesse horário
 * - 'fechado'     → fechado (aparece como "fechado")
 * - null          → horário desconhecido: NÃO aparece e o dia fica indisponível no agendamento
 */
export type DiaHorario = Turno | 'fechado' | null;

export type Atendimento = {
  id: string;
  nome: string;
  resumo: string;
  descricao: string;
  /** Nome usado na mensagem do WhatsApp: "gostaria de informações sobre {assunto}." */
  assunto: string;
  icone: 'clinico' | 'endo' | 'orto' | 'implante';
};

export type Especialidade = { nome: string; registro: string };

export const CONFIG = {
  /** Modo rascunho: faixa global + noindex. Mude para false quando o conteúdo estiver confirmado. */
  rascunho: true,

  /** URL pública absoluta (canonical, og:url, og:image). Nunca localhost. */
  siteUrl: 'https://dr-rennan-machado-rascunho.vercel.app',

  nome: 'Dr. Rennan Machado',
  nomeCurto: 'Dr. Rennan',
  titulo: 'Cirurgião-dentista',
  cro: 'CRO-MG 54427',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  logo: { src: '/img/logo-rennan.webp', fallback: '/img/logo-rennan.jpg', width: 150, height: 150 },

  /** Foto do dentista. null = composição tipográfica no lugar. */
  foto: {
    src: '/img/dentista-retrato-800.webp',
    srcSet: '/img/dentista-retrato-360.webp 360w, /img/dentista-retrato-480.webp 480w, /img/dentista-retrato-600.webp 600w, /img/dentista-retrato-800.webp 800w',
    alt: 'Dr. Rennan Machado, de jaleco preto, sorrindo de braços cruzados no consultório',
    width: 800,
    height: 1000,
  } as Foto | null,

  /** Foto secundária do dentista (opcional). */
  fotoSecundaria: {
    src: '/img/dentista-consultorio-800.webp',
    srcSet: '/img/dentista-consultorio-360.webp 360w, /img/dentista-consultorio-480.webp 480w, /img/dentista-consultorio-600.webp 600w, /img/dentista-consultorio-800.webp 800w',
    alt: 'Dr. Rennan Machado sentado à mesa do consultório, em frente ao computador',
    width: 800,
    height: 1000,
  } as Foto | null,

  /** Fotos do consultório. Lista vazia = a galeria não aparece. */
  fotosConsultorio: [
    {
      src: '/img/recepcao.webp',
      srcSet: '/img/recepcao-640.webp 640w, /img/recepcao.webp 1170w',
      alt: 'Recepção com balcão de madeira clara, poltronas e painel de madeira ripada com o logotipo',
      width: 1170,
      height: 774,
    },
    {
      src: '/img/sala-procedimentos.webp',
      srcSet: '/img/sala-procedimentos-640.webp 640w, /img/sala-procedimentos.webp 1170w',
      alt: 'Sala clara com maca, bancada branca, espelho e armários organizados',
      width: 1170,
      height: 774,
    },
  ] as Foto[],

  /** Formação e currículo. Lista vazia = não aparece. */
  formacao: [] as string[],

  /**
   * Especialidades. Só aparecem se mostrarEspecialidades = true E o número de registro
   * estiver preenchido (regra do CFO: especialista apenas com título registrado no CRO).
   */
  mostrarEspecialidades: false,
  especialidades: [
    { nome: 'Ortodontia', registro: '' },
    { nome: 'Endodontia', registro: '' },
  ] as Especialidade[],

  whatsapp: '5535999395114',
  whatsappExibicao: '(35) 99939-5114',
  instagram: 'https://www.instagram.com/drrennanmachado/',
  instagramHandle: '@drrennanmachado',
  maps: 'https://maps.app.goo.gl/iECKfKR9tpDd2wBZA',

  endereco: {
    rua: 'R. Gabriel Baret de Barros, 102',
    bairro: 'Centro',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37553-420',
  },

  /** 0 = domingo ... 6 = sábado. Segunda (1) é desconhecida: null. */
  horarios: {
    0: 'fechado',
    1: null,
    2: { abre: '09:00', fecha: '18:00' },
    3: { abre: '09:00', fecha: '18:00' },
    4: { abre: '09:00', fecha: '18:00' },
    5: { abre: '09:00', fecha: '18:00' },
    6: 'fechado',
  } as Record<number, DiaHorario>,

  /** Intervalo de almoço. null = não informado (nenhum horário é excluído). */
  almoco: null as Turno | null,

  avisoFeriados: 'Os horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'clinico',
      nome: 'Clínico geral',
      assunto: 'clínico geral',
      resumo: 'Prevenção e cuidado do dia a dia',
      descricao:
        'Consultas de rotina, prevenção, limpeza, restaurações e orientação de higiene. É o ponto de partida para cuidar da saúde bucal como um todo.',
      icone: 'clinico',
    },
    {
      id: 'endodontia',
      nome: 'Endodontia',
      assunto: 'endodontia (tratamento de canal)',
      resumo: 'O tratamento de canal',
      descricao:
        'Cuida da parte interna do dente, a polpa. O tratamento de canal é indicado quando essa região está inflamada ou infeccionada e tem como objetivo preservar o dente.',
      icone: 'endo',
    },
    {
      id: 'ortodontia',
      nome: 'Ortodontia',
      assunto: 'ortodontia',
      resumo: 'Posição dos dentes e da mordida',
      descricao:
        'Avalia e corrige a posição dos dentes e a relação entre as arcadas. O tipo de aparelho é definido a partir de exames e de um planejamento individual.',
      icone: 'orto',
    },
    {
      id: 'implantodontia',
      nome: 'Implantodontia',
      assunto: 'implantodontia',
      resumo: 'Reposição de dentes perdidos',
      descricao:
        'Repõe dentes perdidos com implantes, que funcionam como raízes para a futura prótese. A viabilidade é analisada caso a caso, com exames.',
      icone: 'implante',
    },
  ] as Atendimento[],

  estrutura: {
    horaMarcada: true,
    banheiro: true,
    pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],
  },

  mostrarAcolhimento: true,

  agendamento: {
    /** Torna o campo "Atendimento desejado" obrigatório. */
    exigirAtendimento: false,
    /** Consultório de urgência (pronto atendimento)? Mostra aviso de urgência acima do formulário. */
    urgencia: false,
    /** Quantos dias à frente a data pode ser escolhida. */
    diasAFrente: 90,
  },

  /** Liga/desliga cada seção. Uma seção ligada mas sem conteúdo também não aparece. */
  secoes: {
    dentista: true,
    atendimentos: true,
    faixa: true,
    quandoProcurar: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export type Config = typeof CONFIG;
