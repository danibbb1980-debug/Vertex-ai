/**
 * CONFIGURAÇÃO DO SITE — único lugar onde ficam os dados da Dra. Talita Lima.
 *
 * Regra: campo vazio ("" ou []) ou ausente = o bloco correspondente NÃO aparece no site.
 * Nada aqui deve ser inventado. Veja o README para saber o que ainda precisa de confirmação.
 */

export type Periodo = { inicio: string; fim: string } // "HH:MM"
export type DiaHorario = { dia: number; nome: string; periodos: Periodo[] } // dia: 0 = domingo … 6 = sábado

export type Atendimento = {
  id: string
  titulo: string
  /** Nome usado na mensagem do WhatsApp ("...gostaria de informações sobre {nomeMensagem}.") */
  nomeMensagem: string
  rotulo: string
  descricao: string
}

export type Especialidade = { nome: string; rqe: string }

export type Vinculo = { funcao: string; instituicao: string }

export type Foto = { src: string; srcPequena?: string; largura: number; altura: number; alt: string }

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Ver README antes de publicar. */
  rascunho: true,

  /** URL pública absoluta (sem barra no final). Usada em canonical, og:url e JSON-LD. */
  siteUrl: 'https://dra-talita-lima-rascunho.vercel.app',

  nome: 'Dra. Talita Lima',
  nomeCurto: 'Dra. Talita',
  titulo: 'Cirurgiã vascular',
  crm: 'CRM-MG 72644',
  crmNumero: '72644',
  rqe: 'RQE 55188',

  cidade: 'Poços de Caldas',
  uf: 'MG',

  endereco: {
    predio: 'Edifício Unique',
    logradouro: 'Av. Gentil Messias Kitate, 240',
    complemento: 'Sala 328',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    pais: 'BR',
  },

  /** Número no formato internacional, só dígitos. Confirmar se recebe WhatsApp (ver README). */
  whatsapp: '553531145756',
  telefone: '(35) 3114-5756',
  telefoneLink: 'tel:+553531145756',

  instagram: { url: 'https://www.instagram.com/talitalimavascular/', usuario: '@talitalimavascular' },
  mapsUrl: 'https://maps.app.goo.gl/y6D6iTQKiqd1b5Ju9',
  mapsEmbed:
    'https://www.google.com/maps?q=Av.+Gentil+Messias+Kitate,+240,+Po%C3%A7os+de+Caldas+-+MG&output=embed',

  mensagens: {
    geral: 'Olá, Dra. Talita! Vi seu site e gostaria de agendar uma avaliação.',
    porAtendimento: 'Olá, Dra. Talita! Vi seu site e gostaria de informações sobre {atendimento}.',
    agendamento: 'Olá, Dra. Talita! Vim pelo site e gostaria de solicitar um agendamento.',
  },

  /** Horários de funcionamento (Google). Dias fora da lista = fechado. */
  horarios: [
    { dia: 1, nome: 'Segunda-feira', periodos: [{ inicio: '08:00', fim: '11:30' }, { inicio: '13:30', fim: '17:30' }] },
    { dia: 2, nome: 'Terça-feira', periodos: [{ inicio: '08:00', fim: '11:30' }, { inicio: '13:30', fim: '17:30' }] },
    { dia: 3, nome: 'Quarta-feira', periodos: [{ inicio: '08:00', fim: '11:30' }, { inicio: '13:30', fim: '17:30' }] },
    { dia: 4, nome: 'Quinta-feira', periodos: [{ inicio: '08:00', fim: '11:30' }, { inicio: '13:30', fim: '17:30' }] },
    { dia: 5, nome: 'Sexta-feira', periodos: [{ inicio: '08:00', fim: '11:30' }, { inicio: '13:30', fim: '17:30' }] },
  ] as DiaHorario[],
  avisoFeriados: 'Horários podem variar em feriados.',

  atendimentos: [
    {
      id: 'cirurgia-vascular',
      titulo: 'Cirurgia vascular',
      nomeMensagem: 'cirurgia vascular',
      rotulo: 'Especialidade',
      descricao:
        'Especialidade que estuda, diagnostica e trata as doenças das veias e das artérias. A consulta começa pela conversa e pelo exame clínico, para entender o que você sente e o que pode ser feito.',
    },
    {
      id: 'fleboestetica',
      titulo: 'Fleboestética',
      nomeMensagem: 'fleboestética (varizes e vasinhos)',
      rotulo: 'Varizes e vasinhos',
      descricao:
        'Cuidado voltado às varizes e aos vasinhos, que podem trazer incômodo físico ou estético. A avaliação considera a saúde das veias antes de qualquer conduta.',
    },
    {
      id: 'endolaser',
      titulo: 'Endolaser',
      nomeMensagem: 'endolaser',
      rotulo: 'Procedimento',
      descricao:
        'Técnica que usa a energia do laser, aplicada por dentro da veia, como uma das possibilidades no tratamento de varizes. Se faz sentido para você, é algo que se decide na consulta.',
    },
  ] as Atendimento[],
  notaAtendimento: 'A indicação depende de avaliação médica individual.',

  /**
   * Angiologia e Cirurgia Endovascular: só podem aparecer com o RQE correspondente (regra do CFM).
   * Para ligar: preencha o número do RQE de cada uma e mude a flag para true.
   */
  mostrarEspecialidadesAdicionais: false,
  especialidadesAdicionais: [
    { nome: 'Angiologia', rqe: '' },
    { nome: 'Cirurgia Endovascular', rqe: '' },
  ] as Especialidade[],

  /** Vínculos vieram de fontes de terceiros: só ligar depois que a médica confirmar. */
  mostrarVinculos: false,
  vinculos: [
    { funcao: 'Cirurgiã vascular', instituicao: 'Santa Casa de Poços de Caldas' },
    { funcao: 'Cirurgiã vascular', instituicao: 'Hospital Universitário Alzira Velano' },
    { funcao: 'Preceptora de Cirurgia Geral/Vascular', instituicao: 'PUC Minas (Poços de Caldas)' },
  ] as Vinculo[],

  sobre: {
    texto:
      'Mineira de Machado, a Dra. Talita é a primeira médica da família. Formou-se em Medicina no Centro Universitário de Volta Redonda (RJ), fez Residência em Cirurgia Geral na Santa Casa de Poços de Caldas e Residência em Cirurgia Vascular na Universidade Federal de Uberlândia. Divide a rotina entre consultório, plantões e cirurgias hospitalares e mantém o estudo contínuo sobre os avanços da especialidade. Atender com zelo e se colocar no lugar do outro, especialmente em momentos de fragilidade, é um princípio que ela valoriza.',
    principio: 'Atender com zelo e se colocar no lugar do outro, especialmente em momentos de fragilidade.',
    assinatura: 'Dra. Talita Lima, Cirurgiã vascular',
    formacao: [
      { etapa: 'Graduação em Medicina', local: 'Centro Universitário de Volta Redonda (RJ)' },
      { etapa: 'Residência em Cirurgia Geral', local: 'Santa Casa de Poços de Caldas' },
      { etapa: 'Residência em Cirurgia Vascular', local: 'Universidade Federal de Uberlândia' },
    ],
  },

  /**
   * Fotos. Deixe como null para não exibir (o layout usa o monograma e a aquarela no lugar).
   * As fotos atuais foram recortadas das artes do Instagram; troque pelos arquivos originais quando possível.
   */
  foto: {
    src: '/img/dra-talita.webp',
    srcPequena: '/img/dra-talita-400.webp',
    largura: 610,
    altura: 762,
    alt: 'Retrato da Dra. Talita Lima, cirurgiã vascular, sorrindo, com blusa clara',
  } as Foto | null,
  fotoLocal: {
    src: '/img/edificio-unique.webp',
    largura: 720,
    altura: 441,
    alt: 'Fachada do Edifício Unique, na Av. Gentil Messias Kitate, 240, em Poços de Caldas',
  } as Foto | null,

  agendamento: {
    exigirAtendimento: false,
    /** true somente para clínicas de pronto atendimento. */
    atendeUrgencia: false,
    duracaoBlocoMin: 60,
    limiteObservacoes: 300,
  },

  quandoProcurar: {
    sinais: [
      { titulo: 'Peso ou cansaço nas pernas', texto: 'Aquela sensação que aparece no fim do dia ou depois de muito tempo em pé ou sentada.' },
      { titulo: 'Inchaço', texto: 'Pernas, tornozelos ou pés inchados com frequência merecem uma conversa com calma.' },
      { titulo: 'Varizes ou vasinhos que incomodam', texto: 'Seja pelo desconforto, seja pela aparência, o incômodo é um bom motivo para uma avaliação.' },
      { titulo: 'Dúvidas sobre circulação', texto: 'Quando você quer entender melhor a saúde das suas veias e artérias.' },
    ],
    alerta:
      'Dor súbita, perna muito inchada, vermelha ou fria, falta de ar ou outros sinais de gravidade: procure um pronto atendimento ou ligue 192 (SAMU).',
  },

  comoFunciona: [
    { titulo: 'Contato e agendamento', texto: 'Você fala com a clínica pelo WhatsApp ou por telefone e combina o melhor dia e horário.' },
    { titulo: 'Consulta e avaliação', texto: 'Uma conversa sem pressa sobre o que você sente, seu histórico e o exame clínico das pernas.' },
    { titulo: 'Plano explicado com clareza', texto: 'Se houver indicação de exames ou tratamento, cada etapa é explicada, com espaço para as suas perguntas.' },
    { titulo: 'Acompanhamento', texto: 'Quando necessário, os retornos são combinados para acompanhar a sua evolução.' },
  ],

  duvidas: [
    {
      p: 'Preciso agendar a consulta?',
      r: 'Sim. O atendimento é com hora marcada. Você pode pedir um horário pelo WhatsApp, pelo telefone {telefone} ou pelo formulário desta página.',
    },
    {
      p: 'Como é a primeira consulta?',
      r: 'É uma conversa sobre o que você sente e sobre o seu histórico de saúde, seguida do exame clínico. Ao final, a Dra. Talita explica o que foi observado e os próximos passos, se houver.',
    },
    {
      p: 'Quais atendimentos são realizados?',
      r: 'Cirurgia vascular, fleboestética (cuidado de varizes e vasinhos) e endolaser. A indicação de cada um depende de avaliação médica individual.',
    },
    {
      p: 'Quais são os horários?',
      r: '{horarios}',
    },
    {
      p: 'Onde fica o consultório?',
      r: 'No {endereco}.',
    },
    {
      p: 'O que levar na primeira consulta?',
      r: 'De forma geral, um documento com foto, exames anteriores relacionados às pernas ou à circulação, se você tiver, e a lista dos medicamentos que usa. Se tiver dúvidas, pergunte à clínica no momento do agendamento.',
    },
    {
      p: 'Varizes e vasinhos são a mesma coisa?',
      r: 'Não exatamente. Os vasinhos são veias bem finas e superficiais. As varizes são veias mais calibrosas e dilatadas. Só a avaliação médica diferencia cada caso e indica se há algo a fazer.',
    },
    {
      p: 'O que é endolaser, em linguagem simples?',
      r: 'É uma técnica em que a energia do laser é levada por dentro da veia, por meio de uma fibra bem fina. É uma das possibilidades no cuidado de varizes, e a indicação depende de avaliação médica individual.',
    },
    {
      p: 'O site agenda a consulta automaticamente?',
      r: 'Não. O formulário apenas monta uma mensagem e abre o WhatsApp da clínica. A equipe confirma a disponibilidade com você pela conversa.',
    },
  ],

  /** Liga/desliga seções inteiras. */
  secoes: {
    hero: true,
    marquee: true,
    medica: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export type Config = typeof CONFIG
