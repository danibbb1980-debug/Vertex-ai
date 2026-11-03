/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("") ou lista vazia ([]) = o bloco correspondente não aparece.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dias: DiaSemana[]
  rotulo: string
  abre: string // "08:00"
  fecha: string // "20:00"
  /** Intervalo de almoço, se a clínica informar. Ex.: { inicio: "12:00", fim: "13:00" } */
  almoco?: { inicio: string; fim: string }
}

export interface Atendimento {
  id: string
  nome: string
  resumo: string
  icone: 'implante' | 'ortodontia' | 'canal' | 'cirurgia' | 'protese' | 'clinico' | 'infantil'
}

export interface Profissional {
  nome: string
  /** Área de atuação (use "Especialista em" somente com registro de especialidade no CFO). */
  atuacao: string
  /** Número do CRO. Profissional sem CRO não é exibido. */
  cro: string
  /** Registro de especialidade (RQE/CFO), se houver. */
  registroEspecialidade?: string
  /** Caminho de uma foto em /public, ex.: "/fotos/equipe/nome.webp" */
  foto?: string
}

export interface Foto {
  src: string // sem extensão: o site procura .webp e .jpg
  alt: string
  legenda: string
  largura: number
  altura: number
}

export const CONFIG = {
  rascunho: true,
  siteUrl: 'https://doctors-odontologia-rascunho.vercel.app',

  nome: 'Doctors Odontologia e Saúde',
  nomeCurto: 'Doctors',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  whatsapp: '553597191553',
  telefoneExibicao: '(35) 9719-1553',
  instagram: {
    url: 'https://www.instagram.com/doctors.odontosaude/',
    usuario: '@doctors.odontosaude',
  },

  endereco: {
    rua: 'R. Afonso Pena, 103',
    bairro: 'Centro',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37550-091',
    mapsUrl: 'https://maps.app.goo.gl/UsufSJsbgjv59Yhj7',
  },

  horarios: [
    { dias: [1, 2, 3, 4, 5], rotulo: 'Segunda a sexta', abre: '08:00', fecha: '20:00' },
    { dias: [6], rotulo: 'Sábado', abre: '08:00', fecha: '15:30' },
  ] as Horario[],
  diasFechados: [{ rotulo: 'Domingo', texto: 'Fechado' }],
  avisoHorario: 'Os horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'implantodontia',
      nome: 'Implantodontia',
      icone: 'implante',
      resumo:
        'Reposição de dentes perdidos com implantes, peças fixadas no osso que servem de base para uma prótese.',
    },
    {
      id: 'ortodontia',
      nome: 'Ortodontia',
      icone: 'ortodontia',
      resumo:
        'Cuida da posição dos dentes e do encaixe entre as arcadas, com aparelhos fixos ou removíveis, conforme o caso.',
    },
    {
      id: 'endodontia',
      nome: 'Endodontia',
      icone: 'canal',
      resumo:
        'Trata a parte interna do dente, a polpa. É o conhecido tratamento de canal, indicado em casos de inflamação ou infecção.',
    },
    {
      id: 'cirurgia',
      nome: 'Cirurgia',
      icone: 'cirurgia',
      resumo:
        'Procedimentos como extrações, inclusive de dentes do siso, e outras intervenções feitas na boca.',
    },
    {
      id: 'protese',
      nome: 'Prótese',
      icone: 'protese',
      resumo:
        'Recupera dentes ausentes ou muito desgastados com coroas, pontes ou próteses removíveis.',
    },
    {
      id: 'clinico-geral',
      nome: 'Clínico geral',
      icone: 'clinico',
      resumo:
        'Consultas de rotina, limpeza, restaurações e prevenção. Costuma ser o ponto de partida do planejamento.',
    },
    {
      id: 'odontopediatria',
      nome: 'Odontopediatria',
      icone: 'infantil',
      resumo:
        'Atendimento para bebês, crianças e adolescentes, com orientação à família sobre higiene e hábitos.',
    },
  ] as Atendimento[],

  estrutura: {
    acessibilidade: [
      'Entrada acessível para cadeirantes',
      'Assento acessível para cadeirantes',
      'Banheiro acessível para cadeirantes',
    ],
    horaMarcada: 'É recomendado marcar hora.',
    pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],
  },

  /** Fotos do espaço (fonte: Google Maps). Lista vazia = galeria some. */
  fotos: {
    destaque: {
      src: '/fotos/recepcao',
      alt: 'Recepção da clínica, com o nome Doctors em letras na parede e o balcão de madeira',
      legenda: 'Recepção',
      largura: 448,
      altura: 596,
    } as Foto | null,
    ambiente: [
      {
        src: '/fotos/consultorio-1',
        alt: 'Consultório claro com cadeira odontológica, bancada e janela',
        legenda: 'Consultório',
        largura: 448,
        altura: 596,
      },
      {
        src: '/fotos/consultorio-2',
        alt: 'Outro consultório com cadeira odontológica e armários brancos',
        legenda: 'Consultório',
        largura: 390,
        altura: 520,
      },
      {
        src: '/fotos/sala',
        alt: 'Sala de atendimento com mesa de madeira, cadeiras e maca',
        legenda: 'Sala de atendimento',
        largura: 404,
        altura: 538,
      },
    ] as Foto[],
  },

  /**
   * Profissionais. Só aparecem os que tiverem CRO preenchido.
   * Nomes vêm das artes do Instagram enviadas; faltam os números de CRO.
   */
  equipe: [
    { nome: 'Dr. Rodrigo Sales', atuacao: 'Ortodontia', cro: '' },
    { nome: 'Dra. Beatriz Paiva', atuacao: 'Facetas em resina', cro: '' },
    { nome: 'Dra. Brenda', atuacao: 'Ortodontia e clínico geral', cro: '' },
    { nome: 'Dra. Luana Marinho', atuacao: 'Odontopediatria', cro: '' },
    { nome: 'Dra. Fernanda Costa', atuacao: 'Endodontia', cro: '' },
    { nome: 'Dra. Thais Oliveira', atuacao: 'Implantodontia', cro: '' },
  ] as Profissional[],

  responsavelTecnico: { nome: '', cro: '' },

  agendamento: {
    exigirAtendimento: false,
    urgencia: false, // true só para clínicas de pronto atendimento
    limiteObservacoes: 300,
  },

  secoes: {
    clinica: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    estrutura: true,
    equipe: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const MENSAGEM_GERAL =
  'Olá! Vi o site da Doctors Odontologia e Saúde e gostaria de agendar uma avaliação.'

export const mensagemAtendimento = (nome: string) =>
  `Olá! Vi o site da Doctors Odontologia e Saúde e gostaria de informações sobre ${nome}.`

export const waLink = (mensagem: string = MENSAGEM_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}

export const equipeVisivel = () => CONFIG.equipe.filter((p) => p.nome.trim() && p.cro.trim())
