// Todos os dados do site ficam aqui. Campo vazio ("") ou ausente = o bloco não aparece.

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export type Horario = {
  dia: DiaSemana
  nome: string
  /** "" = fechado */
  abre: string
  fecha: string
  /** pausa opcional, ex.: { inicio: "11:30", fim: "13:00" } */
  pausa?: { inicio: string; fim: string }
}

export type Area = {
  id: string
  titulo: string
  resumo: string
  situacoes: string[]
}

export const CONFIG = {
  // ---- Modo rascunho ----
  rascunho: true,
  siteUrl: 'https://vicente-loredo-rascunho.vercel.app',

  // ---- Identificação ----
  nomeExibicao: 'Vicente Loredo',
  /** Nome completo lido na placa do escritório (fotos do Google Maps). Confirmar no CNA. */
  nomeCompleto: 'Vicente Lima Lorêdo',
  titulo: 'Advogado',
  /** Número lido na placa da porta e da fachada (fotos do Google Maps). Confirmar no CNA antes de publicar. */
  oab: '84.176',
  oabUF: 'MG',
  /** Caminho para o logo oficial (ex.: "/logo.svg"). Vazio = identidade tipográfica. */
  logo: '',

  // ---- Fotos (vazio = não aparece) ----
  fotos: {
    advogado: '/fotos/vicente-loredo.webp',
    advogadoAlt: 'Vicente Loredo em sua mesa de trabalho, no escritório em Varginha',
    escritorio: '/fotos/recepcao.webp',
    escritorioAlt: 'Recepção do escritório, com sofá, tapete e quadros nas paredes',
  },

  // ---- Contato ----
  usarWhatsapp: true,
  whatsapp: '5535999883485',
  whatsappExibicao: '(35) 99988-3485',
  telefone: '',
  email: '',
  instagram: 'https://www.instagram.com/vicentelloredo/',
  instagramUsuario: '@vicentelloredo',
  maps: 'https://maps.app.goo.gl/5R4Q41vj3TTQyxWj7',
  mapsEmbed:
    'https://www.google.com/maps?q=Avenida+Francisco+Navarra,+122,+Centro,+Varginha+-+MG,+37006-000&output=embed',

  endereco: {
    logradouro: 'Avenida Francisco Navarra, 122-A',
    complemento: 'Conjunto B',
    bairro: 'Centro',
    cidade: 'Varginha',
    uf: 'MG',
    cep: '37006-000',
  },

  horarios: [
    { dia: 1, nome: 'Segunda-feira', abre: '09:00', fecha: '18:00' },
    { dia: 2, nome: 'Terça-feira', abre: '09:00', fecha: '18:00' },
    { dia: 3, nome: 'Quarta-feira', abre: '09:00', fecha: '18:00' },
    { dia: 4, nome: 'Quinta-feira', abre: '09:00', fecha: '18:00' },
    { dia: 5, nome: 'Sexta-feira', abre: '09:00', fecha: '18:00' },
    { dia: 6, nome: 'Sábado', abre: '', fecha: '' },
    { dia: 0, nome: 'Domingo', abre: '', fecha: '' },
  ] as Horario[],
  avisoHorarios: 'Horários podem variar em feriados.',

  // ---- Conteúdo ----
  mostrarTrajetoria: true,
  trajetoria: ['Pós-graduado em Direito Tributário', 'Palestrante da Escola Superior de Advocacia (ESA)'],

  /** Desligado: a publicidade na advocacia restringe exibir cargos (Provimento 205/2021). Decidir com o cliente. */
  mostrarCargosOAB: false,
  cargosOAB: [] as string[],

  areas: [
    {
      id: 'tributario',
      titulo: 'Direito Tributário',
      resumo:
        'Orientação a pessoas e empresas sobre obrigações tributárias e questões fiscais: o que a lei exige, como ler uma cobrança e quais caminhos existem diante de uma divergência com o Fisco.',
      situacoes: [
        'Dúvidas sobre obrigações fiscais da empresa ou da pessoa física',
        'Notificações, autuações e cobranças de tributos',
        'Análise de enquadramento e de rotinas fiscais',
      ],
    },
    {
      id: 'empresarial',
      titulo: 'Direito Empresarial',
      resumo:
        'Contratos, constituição de empresas e relações entre sócios. O trabalho é dar forma jurídica clara às decisões do negócio, antes que elas virem conflito.',
      situacoes: [
        'Elaboração e revisão de contratos',
        'Abertura, alteração e reorganização de sociedades',
        'Questões entre sócios e acordos societários',
      ],
    },
    {
      id: 'trabalho',
      titulo: 'Direito do Trabalho',
      resumo:
        'Relações de trabalho vistas pelos dois lados: orientação a empregadores sobre suas obrigações e a trabalhadores sobre seus direitos, sempre em termos gerais até a análise do caso.',
      situacoes: [
        'Orientação a empresas sobre rotinas e obrigações trabalhistas',
        'Dúvidas de trabalhadores sobre contrato, jornada e rescisão',
        'Acompanhamento de reclamações trabalhistas',
      ],
    },
  ] as Area[],

  /** Atendimentos confirmados para o select do formulário */
  atendimentos: ['Direito Tributário', 'Direito Empresarial', 'Direito do Trabalho'],
  agendamento: { exigirAtendimento: false },

  secoes: {
    advogado: true,
    areas: true,
    quando: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

// ---- Derivados ----
export const oabTexto = CONFIG.oab ? `OAB/${CONFIG.oabUF} ${CONFIG.oab}` : ''

export function waLink(mensagem: string) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export const MSG_GERAL = 'Olá, Dr. Vicente! Vi seu site e gostaria de agendar um atendimento.'
export const msgArea = (area: string) =>
  `Olá, Dr. Vicente! Vi seu site e gostaria de informações sobre ${area}.`

export const temWhats = CONFIG.usarWhatsapp && !!CONFIG.whatsapp

export const enderecoLinha = [
  CONFIG.endereco.logradouro,
  CONFIG.endereco.complemento,
  CONFIG.endereco.bairro,
  `${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`,
  CONFIG.endereco.cep && `CEP ${CONFIG.endereco.cep}`,
]
  .filter(Boolean)
  .join(', ')
