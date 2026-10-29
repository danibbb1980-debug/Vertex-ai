/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("" ou []) = o bloco correspondente NÃO aparece no site.
 */

export type Atendimento = {
  id: string
  nome: string
  /** usado na mensagem do WhatsApp: "gostaria de informações sobre {assunto}" */
  assunto: string
  /** rótulo curto do botão: "Falar sobre {cta}" */
  cta: string
  resumo: string
  descricao: string
  ilustracao: 'alinhador' | 'implante' | 'faceta' | 'siso'
}

export type Foto = { src: string; alt: string; legenda?: string; largura: number; altura: number }

export type Profissional = { nome: string; formacao?: string; cro?: string; foto?: string }

export type Horario = {
  /** 0 = domingo ... 6 = sábado */
  dia: number
  nome: string
  abre?: string
  fecha?: string
  almocoInicio?: string
  almocoFim?: string
}

export const CONFIG = {
  rascunho: true,
  textoRascunho: 'Rascunho para avaliação. Informações sujeitas a confirmação.',

  /** URL pública absoluta (sem barra no final). Nunca localhost. */
  siteUrl: 'https://ciom-odontologia-rascunho.vercel.app',

  nome: 'CIOM Odontologia',
  /** logo enviado pela clínica (referencias/logo-ciom.jpg), só com o branco das bordas recortado */
  logo: { src: '/img/logo-ciom.png', largura: 95, altura: 39 },

  /** recebido como "+55 35 8856-8104"; o 9 inicial foi acrescentado. CONFERIR antes de publicar. */
  whatsapp: '5535988568104',
  telefoneExibicao: '(35) 98856-8104',
  mensagemPadrao: 'Olá! Vi o site da CIOM Odontologia e gostaria de agendar uma avaliação.',

  instagram: { url: 'https://www.instagram.com/ciom_odontologia/', usuario: '@ciom_odontologia' },
  mapsUrl: 'https://maps.app.goo.gl/wJj92Ziew6Qvkp6XA',
  mapsBusca: 'CIOM Odontologia, R. Olegário Maciel, Centro, Pouso Alegre - MG, 37550-000',

  endereco: {
    rua: 'R. Olegário Maciel',
    /** número não informado: deixe vazio até confirmar */
    numero: '',
    bairro: 'Centro',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37550-000',
  },

  horarios: [
    { dia: 1, nome: 'Segunda', abre: '08:00', fecha: '18:00' },
    { dia: 2, nome: 'Terça', abre: '08:00', fecha: '18:00' },
    { dia: 3, nome: 'Quarta', abre: '08:00', fecha: '18:00' },
    { dia: 4, nome: 'Quinta', abre: '08:00', fecha: '18:00' },
    { dia: 5, nome: 'Sexta', abre: '08:00', fecha: '18:00' },
    { dia: 6, nome: 'Sábado' },
    { dia: 0, nome: 'Domingo' },
  ] as Horario[],
  avisoHorario: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'ortodontia',
      nome: 'Ortodontia',
      assunto: 'ortodontia',
      cta: 'ortodontia',
      resumo: 'Alinhamento dos dentes e relação entre as arcadas.',
      descricao:
        'Tratamento voltado ao alinhamento dos dentes e ao encaixe entre as arcadas. O tipo de aparelho e as etapas são definidos depois da avaliação, de acordo com cada caso.',
      ilustracao: 'alinhador',
    },
    {
      id: 'implantes',
      nome: 'Implantes dentários',
      assunto: 'implantes dentários',
      cta: 'implantes',
      resumo: 'Uma das alternativas para repor um dente perdido.',
      descricao:
        'A perda de um dente pode interferir na mastigação e na fala. O implante é uma das alternativas de reposição, e a indicação considera exames e as condições de cada paciente.',
      ilustracao: 'implante',
    },
    {
      id: 'lentes-facetas',
      nome: 'Lentes de contato dental e facetas',
      assunto: 'lentes de contato dental e facetas',
      cta: 'lentes e facetas',
      resumo: 'Ajustes de cor, forma e proporção dos dentes.',
      descricao:
        'Recursos de odontologia estética para ajustes de cor, forma e proporção. A escolha entre lente e faceta é feita na avaliação, conforme o que cada caso pede.',
      ilustracao: 'faceta',
    },
    {
      id: 'siso',
      nome: 'Cirurgia do siso',
      assunto: 'cirurgia do siso (terceiro molar)',
      cta: 'siso',
      resumo: 'Avaliação e cirurgia do terceiro molar.',
      descricao:
        'Avaliação do terceiro molar e cirurgia quando há indicação clínica. Exames de imagem ajudam a entender a posição do dente e a planejar cada etapa.',
      ilustracao: 'siso',
    },
  ] as Atendimento[],

  acessibilidade: [
    { id: 'entrada', texto: 'Entrada acessível para cadeirantes' },
    { id: 'assento', texto: 'Assento acessível para cadeirantes' },
    { id: 'banheiro', texto: 'Banheiro acessível para cadeirantes' },
    { id: 'estacionamento', texto: 'Estacionamento acessível para cadeirantes' },
    { id: 'aro', texto: 'Aro de indução magnética, para quem usa aparelho auditivo' },
  ],
  estrutura: ['Atendimento no local', 'Agendamento recomendado', 'Banheiro', 'Estacionamento pago na rua'],
  pagamentos: ['Cartão de crédito', 'Cartão de débito'],

  mostrarAcolhimento: true,
  acolhimento: {
    frase: 'Aqui você é recebido com respeito, como é.',
    atributos: ['Empresa que acolhe a comunidade LGBTQ+', 'Espaço seguro para pessoas transgênero'],
  },

  /** Não informados. Ambos são exigidos (CFO) para a publicação definitiva. */
  responsavelTecnico: { nome: '', cro: '' },
  profissionais: [] as Profissional[],

  fotos: {
    equipe: [
      { src: '/fotos/equipe-4.webp', alt: 'Equipe da CIOM Odontologia no consultório', largura: 224, altura: 298 },
      { src: '/fotos/equipe-2.webp', alt: 'Dentista da CIOM Odontologia na sala de atendimento', largura: 202, altura: 135 },
    ] as Foto[],
    espaco: [
      { src: '/fotos/recepcao.webp', alt: 'Recepção da clínica, com balcão curvo', legenda: 'Recepção', largura: 203, altura: 434 },
      { src: '/fotos/sala-atendimento.webp', alt: 'Sala de atendimento com cadeira odontológica', legenda: 'Sala de atendimento', largura: 203, altura: 409 },
      { src: '/fotos/consultorio.webp', alt: 'Consultório com mesa e poltronas para a conversa inicial', legenda: 'Consultório', largura: 202, altura: 270 },
      { src: '/fotos/sala-de-espera.webp', alt: 'Sala de espera no mezanino, com guarda-corpo de vidro', legenda: 'Sala de espera', largura: 203, altura: 409 },
      { src: '/fotos/equipe-1.webp', alt: 'Dentista da CIOM Odontologia à mesa do consultório', legenda: 'Conversa inicial', largura: 203, altura: 304 },
    ] as Foto[],
    /** foto ao lado do formulário de agendamento */
    agendar: { src: '/fotos/equipe-3.webp', alt: 'Equipe da CIOM Odontologia à mesa, pronta para receber o paciente', largura: 202, altura: 135 } as Foto | null,
    fachada: { src: '/fotos/fachada.webp', alt: 'Fachada da CIOM Odontologia, com rampa de acesso', legenda: 'Fachada', largura: 224, altura: 298 } as Foto | null,
  },

  agendamento: {
    exigirAtendimento: false,
    /** true apenas para clínicas de urgência (pronto-socorro) */
    urgencia: false,
    duracaoBlocoMin: 60,
  },

  secoes: {
    clinica: true,
    espaco: true,
    atendimentos: true,
    comparativo: true,
    quandoProcurar: true,
    comoFunciona: true,
    acolhimento: true,
    duvidas: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
}

export function enderecoTexto() {
  const e = CONFIG.endereco
  const rua = e.numero ? `${e.rua}, ${e.numero}` : e.rua
  return `${rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`
}
