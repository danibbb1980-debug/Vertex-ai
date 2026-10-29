/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou lista vazia) = a parte correspondente NÃO aparece no site.
 * Ao preencher um campo, o trecho ligado a ele passa a ser exibido sozinho.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Horario {
  dia: DiaSemana
  abre: string // "08:00"
  fecha: string // "18:00"
  /** Intervalo de almoço opcional, ex.: { inicio: "12:00", fim: "13:30" } */
  almoco?: { inicio: string; fim: string }
}

export interface Atendimento {
  id: string
  titulo: string
  resumo: string
  descricao: string
  mensagem: string
}

export interface EtapaFormacao {
  ano: string
  titulo: string
  sigla: string
  instituicao: string
}

export const CONFIG = {
  /** Mostra a faixa de rascunho e mantém o noindex. */
  rascunho: true,
  /** URL pública final, sem barra no fim. Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://dr-vitor-marinho-rascunho.vercel.app',

  nome: 'Dr. Vitor Alexandre Marinho',
  nomeCurto: 'Dr. Vitor',
  profissao: 'Cirurgião-Dentista',
  consultorio: 'Consultório Vitor Alexandre Marinho',

  /** Ex.: "CRO-MG 00000". Vazio = nada é exibido. Obrigatório antes de publicar em definitivo. */
  cro: '',
  /** Só ative com o registro de especialidade no CRO. Exige `cro` preenchido. */
  mostrarEspecialista: false,
  especialidade: 'Dentística',

  whatsapp: '5535984256245',
  whatsappExibicao: '(35) 98425-6245',
  telefoneSchema: '+55-35-98425-6245',
  /** Ex.: "https://instagram.com/usuario". Vazio = não aparece. */
  instagram: '',

  endereco: {
    rua: 'R. Martins Alfenas, 2339',
    complemento: 'Sala 206',
    bairro: 'Santa Rita',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37132-018',
  },
  mapsUrl: 'https://maps.app.goo.gl/DDERwEnich6RiyHv8',
  mapsEmbed:
    'https://www.google.com/maps?q=R.+Martins+Alfenas,+2339+-+Santa+Rita,+Alfenas+-+MG,+37132-018&output=embed',

  horarios: [
    { dia: 1, abre: '08:00', fecha: '18:00' },
    { dia: 2, abre: '08:00', fecha: '18:00' },
    { dia: 3, abre: '08:00', fecha: '18:00' },
    { dia: 4, abre: '08:00', fecha: '18:00' },
    { dia: 5, abre: '08:00', fecha: '18:00' },
  ] as Horario[],
  observacaoHorarios: 'Horários podem variar em feriados.',

  formacao: [
    {
      ano: '1993',
      titulo: 'Graduação em Odontologia',
      sigla: 'UNIFENAS',
      instituicao: 'Universidade José do Rosário Vellano',
    },
    {
      ano: '1998',
      titulo: 'Mestrado em Dentística',
      sigla: 'FOB/USP',
      instituicao: 'Faculdade de Odontologia de Bauru, Universidade de São Paulo',
    },
    {
      ano: '2002',
      titulo: 'Doutorado em Dentística',
      sigla: 'USP',
      instituicao: 'Universidade de São Paulo',
    },
  ] as EtapaFormacao[],

  atendimentos: [
    {
      id: 'restauracoes-diretas',
      titulo: 'Restaurações diretas',
      resumo: 'Forma e função de volta ao dente.',
      descricao:
        'Recuperam dentes com cárie, fratura ou desgaste. O material é aplicado e modelado diretamente no dente, em camadas, sem etapa de laboratório.',
      mensagem: 'Olá! Vi o site do Dr. Vitor e gostaria de conversar sobre restaurações diretas.',
    },
    {
      id: 'odontologia-estetica',
      titulo: 'Odontologia estética',
      resumo: 'Forma, cor e proporção, a partir da saúde.',
      descricao:
        'Cuidado com a aparência dos dentes que parte sempre da saúde bucal. O planejamento considera o sorriso como um todo, e não um dente isolado.',
      mensagem: 'Olá! Vi o site do Dr. Vitor e gostaria de conversar sobre odontologia estética.',
    },
    {
      id: 'protese-fixa',
      titulo: 'Prótese fixa',
      resumo: 'Coroas e pontes que não se retiram.',
      descricao:
        'Coroas e pontes cimentadas sobre dentes preparados, para recuperar estrutura perdida ou repor dentes ausentes. Não são removidas pelo paciente.',
      mensagem: 'Olá! Vi o site do Dr. Vitor e gostaria de conversar sobre prótese fixa.',
    },
    {
      id: 'proteses-sobre-implante',
      titulo: 'Próteses sobre implante',
      resumo: 'A parte visível do tratamento com implantes.',
      descricao:
        'Coroas, pontes ou próteses maiores que se apoiam sobre implantes para repor dentes ausentes. O tipo de prótese é definido a partir da avaliação de cada caso.',
      mensagem: 'Olá! Vi o site do Dr. Vitor e gostaria de conversar sobre próteses sobre implante.',
    },
    {
      id: 'proteses-removiveis-totais',
      titulo: 'Próteses removíveis e totais',
      resumo: 'Para colocar e retirar no dia a dia.',
      descricao:
        'A removível repõe alguns dentes e se apoia nos que permanecem. A total, conhecida como dentadura, repõe todos os dentes de uma arcada.',
      mensagem:
        'Olá! Vi o site do Dr. Vitor e gostaria de conversar sobre próteses removíveis e totais.',
    },
  ] as Atendimento[],

  estrutura: {
    acessibilidade: 'Entrada e banheiro acessíveis para cadeirantes.',
    estacionamento: 'Estacionamento descoberto gratuito e vagas gratuitas na rua.',
    pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação'],
  },
  mostrarAcolhimento: true,
  acolhimento: 'Um espaço que acolhe a comunidade LGBTQ+ e pessoas transgênero.',

  fotos: {
    /** Ex.: "/img/dr-vitor.webp" (coloque o arquivo em public/img). Vazio = sem foto. */
    doutor: '',
    /** Fotos do consultório: [{ src: "/img/sala.webp", alt: "Sala de atendimento" }] */
    consultorio: [] as { src: string; alt: string }[],
    /** Foto da fachada do edifício (pequena, enviada junto com o logo). */
    fachada: '/img/fachada-consultorio.webp',
  },

  agendamento: {
    exigirAtendimento: false,
    /** true apenas para clínicas de urgência: mostra o aviso "Está com dor ou urgência?". */
    urgencia: false,
  },

  /** Liga/desliga seções inteiras. */
  secoes: {
    marquee: true,
    consultorio: true,
    atendimentos: true,
    formacao: true,
    paraQuem: true,
    comoFunciona: true,
    estrutura: true,
    faq: true,
    localizacao: true,
    agendamento: true,
    ctaFinal: true,
  },

  seo: {
    titulo: 'Dr. Vitor Alexandre Marinho | Dentista em Alfenas - MG',
    descricao:
      'Restaurações, estética do sorriso e próteses em Alfenas - MG, com atendimento por agendamento. Consultório do Dr. Vitor Alexandre Marinho, Cirurgião-Dentista.',
    /** Caminho em public/. Vazio = sem og:image. */
    ogImage: '/og-image.png',
  },
}

export const MENSAGEM_GERAL = 'Olá! Vi o site do Dr. Vitor e gostaria de agendar uma avaliação.'

export const enderecoLinha = () => {
  const e = CONFIG.endereco
  return `${e.rua} - ${e.complemento} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}

/** "Especialista em Dentística" só aparece com o CRO preenchido. */
export const exibirEspecialista = () => CONFIG.mostrarEspecialista && CONFIG.cro.trim() !== ''
