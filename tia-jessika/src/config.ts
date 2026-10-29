/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("", [] ou ausente) = a parte correspondente NÃO aparece.
 * Ao preencher um campo, a seção ou o bloco aparece sozinho.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export type Horario = {
  dia: DiaSemana
  /** "" = fechado */
  abre: string
  fecha: string
  /** intervalo de almoço; vazio = não informado (não é descontado) */
  almocoInicio?: string
  almocoFim?: string
}

export type Foto = { src: string; srcSet?: string; alt: string; width: number; height: number }

export const CONFIG = {
  /** Faixa global de rascunho + noindex. */
  rascunho: true,
  /** URL final (sem barra no fim). Atualizar após o deploy. */
  siteUrl: 'https://tia-jessika-rascunho-v2.vercel.app',

  marca: 'Tia Jessika',
  nome: 'Dra. Jessika Domingues',
  titulo: 'Cirurgiã-Dentista',
  descritor: 'Odontopediatra',
  cro: 'CRO-MG 48389',

  /** Depende do registro da especialidade no CRO. false = esconde "Especialista". */
  mostrarEspecialidades: true,
  /** Nunca exibir tempo de atuação (regra do CFO para este projeto). */
  mostrarAnosDeAtuacao: false,

  formacao: {
    graduacao: 'Graduação pela Universidade Federal de Alfenas (UNIFAL)',
    especialidades: [
      { nome: 'Especialista em Odontopediatria', instituicao: 'São Leopoldo Mandic' },
      { nome: 'Especialista em Ortopedia Funcional dos Maxilares', instituicao: '' },
    ],
  },

  whatsapp: '5535988722114',
  whatsappExibicao: '(35) 98872-2114',
  telefone: '+553532973360',
  telefoneExibicao: '(35) 3297-3360',
  instagram: 'https://www.instagram.com/drajessikadomingues/',
  instagramUsuario: '@drajessikadomingues',
  mapsUrl: 'https://maps.app.goo.gl/Q7GV2j1BTJr7Aie56',
  /** Embed sem chave de API, a partir do endereço. */
  mapsEmbed:
    'https://www.google.com/maps?q=Rua+G%C3%A1spar+Lopes,+124+-+Santa+In%C3%AAs,+Alfenas+-+MG,+37130-153&output=embed',

  endereco: {
    rua: 'Rua Gáspar Lopes, 124',
    bairro: 'Santa Inês',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37130-153',
  },

  horarios: [
    { dia: 0, abre: '', fecha: '' },
    { dia: 1, abre: '08:00', fecha: '18:00' },
    { dia: 2, abre: '08:00', fecha: '18:00' },
    { dia: 3, abre: '08:00', fecha: '18:00' },
    { dia: 4, abre: '08:00', fecha: '18:00' },
    { dia: 5, abre: '08:00', fecha: '18:00' },
    { dia: 6, abre: '', fecha: '' },
  ] as Horario[],
  observacaoHorario: 'Horários podem variar em feriados.',
  horaMarcada: true,

  estrutura: {
    acessibilidade: ['Entrada acessível para cadeirantes', 'Banheiro acessível para cadeirantes'],
    pagamento: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação'],
  },

  /** Somente atendimentos confirmados (usados no formulário de agendamento). */
  atendimentos: [
    'Atendimento para bebês',
    'Atendimento para crianças',
    'Atendimento para adolescentes',
    'Ortopedia Funcional dos Maxilares',
  ],

  agendamento: {
    exigirAtendimento: false,
    /** true só se a clínica atender urgência (não é o caso). */
    urgencia: false,
    limiteObservacoes: 300,
  },

  /** Somente se a clínica confirmar como funciona o acompanhamento dos pais. "" = não aparece. */
  paisAcompanham: '',

  fotos: {
    /** Retrato aprovado (sem personagens, sem crianças). Vazio = monograma "TJ". */
    doutora: {
      src: '/img/dra-jessika-800.webp',
      srcSet: '/img/dra-jessika-480.webp 480w, /img/dra-jessika-800.webp 800w, /img/dra-jessika-1000.webp 1000w',
      alt: 'Dra. Jessika Domingues sorrindo, sentada no espaço kids do consultório, com paredes azuis e nuvens iluminadas',
      width: 800,
      height: 1000,
    } as Foto | null,
    /** Fotos do consultório. Vazio = nada aparece. */
    consultorio: [] as Foto[],
  },

  logo: {
    completo: '/img/logo-tia-jessika-560.webp',
    completoSrcSet:
      '/img/logo-tia-jessika-360.webp 360w, /img/logo-tia-jessika-560.webp 560w, /img/logo-tia-jessika-780.webp 780w, /img/logo-tia-jessika-1040.webp 1040w',
    completoW: 1035,
    completoH: 831,
    marca: '/img/marca-tia-jessika-160.webp',
    marcaSrcSet: '/img/marca-tia-jessika-160.webp 1x, /img/marca-tia-jessika-320.webp 2x',
    marcaW: 1035,
    marcaH: 644,
  },
  ogImage: '/img/og-tia-jessika.jpg',

  /** Liga/desliga seções. */
  secoes: {
    consultorio: true,
    atendimento: true,
    pais: true,
    primeiraConsulta: true,
    profissional: true,
    estrutura: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
    marquee: true,
  },
}

export const enderecoCompleto = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`
