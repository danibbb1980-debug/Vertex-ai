// Fonte única de dados do site. Campo vazio ou ausente = não aparece na página.
// Ver README.md para instruções de edição.

export type Profissional = {
  nome: string
  cro: string // vazio enquanto não for informado: nenhum cartão individual aparece
  foto?: string
  formacao?: string[]
}

export type Atendimento = {
  id: string
  nome: string
  /** nome curto usado no formulário de agendamento */
  nomeCurto: string
  descricao: string
  icone: 'estetica' | 'clareamento' | 'restauracao' | 'ortodontia' | 'implante' | 'protese' | 'canal' | 'gengiva' | 'siso' | 'sedacao'
}

export type Foto = { src: string; alt: string; largura: number; altura: number }

/** 0 = domingo ... 6 = sábado. null = fechado. Intervalo de almoço opcional. */
export type HorarioDia = { abre: string; fecha: string; almoco?: { inicio: string; fim: string } } | null

export const CONFIG = {
  rascunho: true,
  siteUrl: 'https://odontologia-estetica-andre-douglas.vercel.app',

  nome: 'Odontologia Estética',
  dentistasLinha: 'Dr. André Totti & Dr. Douglas Barbosa',
  cidade: 'Pouso Alegre',
  uf: 'MG',

  profissionais: [
    { nome: 'Dr. André Totti', cro: '', foto: '', formacao: [] },
    { nome: 'Dr. Douglas Barbosa', cro: '', foto: '', formacao: [] },
  ] as Profissional[],

  // Números sem rótulo de pessoa: não se sabe a qual dentista pertence cada um.
  whatsapp: '5535988775060',
  whatsapp2: '5535999723296',
  telefone: '553534229276',

  instagram: {
    url: 'https://www.instagram.com/odontologiadrandre.drdouglas/',
    usuario: '@odontologiadrandre.drdouglas',
  },
  mapsUrl: 'https://maps.app.goo.gl/jtD367rqJvKjf2Gn6',
  mapaEmbed:
    'https://www.google.com/maps?q=Av.+Ver.+Ant%C3%B4nio+da+Costa+Rios,+318+-+S%C3%A3o+Geraldo,+Pouso+Alegre+-+MG,+37558-059&output=embed',

  endereco: {
    rua: 'Av. Ver. Antônio da Costa Rios, 318',
    bairro: 'São Geraldo',
    cidade: 'Pouso Alegre',
    uf: 'MG',
    cep: '37558-059',
  },

  horarios: [
    null, // domingo
    { abre: '08:00', fecha: '18:00' },
    { abre: '08:00', fecha: '18:00' },
    { abre: '08:00', fecha: '18:00' },
    { abre: '08:00', fecha: '18:00' },
    { abre: '08:00', fecha: '18:00' },
    { abre: '08:00', fecha: '12:00' }, // sábado
  ] as HorarioDia[],

  mostrarSedacao: false, // ligar SOMENTE com habilitação comprovada
  mostrarAcolhimento: true,
  urgencia: false, // true apenas se a clínica fizer pronto atendimento

  agendamento: { exigirAtendimento: false },

  atendimentos: [
    {
      id: 'estetica',
      nome: 'Odontologia estética',
      nomeCurto: 'Odontologia estética',
      icone: 'estetica',
      descricao:
        'Cuida da forma, da cor e da harmonia dos dentes no conjunto do rosto. Pode envolver ajustes de contorno, facetas ou restaurações, sempre a partir da saúde bucal.',
    },
    {
      id: 'clareamento',
      nome: 'Clareamento dental',
      nomeCurto: 'Clareamento dental',
      icone: 'clareamento',
      descricao:
        'Técnica que atenua manchas e escurecimentos do esmalte. Antes de indicar, o dentista avalia sensibilidade, restaurações existentes e a saúde da gengiva.',
    },
    {
      id: 'restauracoes',
      nome: 'Restaurações',
      nomeCurto: 'Restaurações',
      icone: 'restauracao',
      descricao:
        'Recuperam dentes com cárie, desgaste ou pequenas fraturas, devolvendo forma e função. O material é escolhido conforme a posição e a necessidade de cada dente.',
    },
    {
      id: 'ortodontia',
      nome: 'Aparelhos ortodônticos fixos e removíveis',
      nomeCurto: 'Aparelhos ortodônticos',
      icone: 'ortodontia',
      descricao:
        'Corrigem a posição dos dentes e a forma como eles se encaixam na mordida. O tipo de aparelho e o acompanhamento são definidos depois de exames e avaliação.',
    },
    {
      id: 'implantes',
      nome: 'Implantes dentais',
      nomeCurto: 'Implantes dentais',
      icone: 'implante',
      descricao:
        'Uma alternativa para repor dentes perdidos, com um pino fixado no osso que sustenta a coroa. Depende das condições do osso e da saúde geral de cada pessoa.',
    },
    {
      id: 'proteses',
      nome: 'Próteses fixas e removíveis',
      nomeCurto: 'Próteses',
      icone: 'protese',
      descricao:
        'Repõem um ou mais dentes para recuperar a mastigação, a fala e o apoio do sorriso. Podem ser fixas ou removíveis, conforme o caso.',
    },
    {
      id: 'canal',
      nome: 'Tratamento de canal',
      nomeCurto: 'Tratamento de canal',
      icone: 'canal',
      descricao:
        'Trata a parte interna do dente quando a polpa está inflamada ou infectada, com o objetivo de preservar o dente natural.',
    },
    {
      id: 'gengivas',
      nome: 'Tratamento de gengivas',
      nomeCurto: 'Tratamento de gengivas',
      icone: 'gengiva',
      descricao:
        'Cuida de sangramento, inflamação e retração gengival. Gengivas saudáveis são a base para qualquer outro tratamento.',
    },
    {
      id: 'siso',
      nome: 'Extração de siso (dente do juízo)',
      nomeCurto: 'Extração de siso',
      icone: 'siso',
      descricao:
        'Os terceiros molares nem sempre precisam sair. A decisão considera posição, espaço, sintomas e exames de imagem.',
    },
  ] as Atendimento[],

  sedacao: {
    id: 'sedacao',
    nome: 'Sedação odontológica',
    nomeCurto: 'Sedação odontológica',
    icone: 'sedacao',
    descricao:
      'Recurso que pode ser indicado em situações específicas, sempre com avaliação prévia e protocolo adequado.',
  } as Atendimento,

  acessibilidade: [
    'Entrada acessível para cadeirantes',
    'Assento acessível para cadeirantes',
    'Banheiro acessível para cadeirantes',
    'Estacionamento acessível para cadeirantes',
    'Estacionamento gratuito na rua',
    'Banheiro no local',
  ],
  pagamentos: ['Cartão de crédito', 'Cartão de débito', 'Pagamento por aproximação (NFC)'],
  acolhimento: ['Empresa que acolhe a comunidade LGBTQ+', 'Espaço seguro para pessoas transgênero'],

  // Fotos do consultório (fonte: perfil público no Google). Lista vazia = galeria não aparece.
  fotosConsultorio: [
    { src: '/img/recepcao.webp', alt: 'Recepção com balcão de madeira, pendentes de luz e o símbolo da Odontologia Estética na parede', largura: 755, altura: 1000 },
    { src: '/img/consultorio.webp', alt: 'Consultório com cadeira odontológica, bancada, painel ripado e janela com persianas', largura: 1000, altura: 744 },
    { src: '/img/sala-de-espera.webp', alt: 'Sala de espera com poltrona, bancos estofados e jardim vertical', largura: 404, altura: 540 },
    { src: '/img/consultorio-2.webp', alt: 'Segundo consultório, com cadeira odontológica, mesa e painel ripado', largura: 1000, altura: 744 },
    { src: '/img/recepcao-2.webp', alt: 'Recepção vista de lado, com pendentes de luz e balcão', largura: 404, altura: 540 },
    { src: '/img/corredor.webp', alt: 'Entrada coberta com poltrona, bancos estofados, jardim vertical e porta de vidro', largura: 755, altura: 1000 },
  ] as Foto[],
  fotoFachada: { src: '/img/fachada.webp', alt: 'Fachada do consultório na Av. Ver. Antônio da Costa Rios, com a placa Odontologia Estética', largura: 448, altura: 596 } as Foto | null,

  // Fotos dos dentistas sem nome associado, pois não se confirmou quem é quem.
  fotosEquipe: [
    { src: '/img/equipe-1.webp', alt: 'Dentista da Odontologia Estética de jaleco, à mesa do consultório', largura: 1000, altura: 660 },
    { src: '/img/equipe-2.webp', alt: 'Dentista da Odontologia Estética sentado no consultório', largura: 390, altura: 278 },
    { src: '/img/equipe-3.webp', alt: 'Dentista da Odontologia Estética à mesa, com notebook', largura: 1000, altura: 421 },
  ] as Foto[],

  ogImage: '/img/og-image.jpg',

  secoes: {
    clinica: true,
    galeria: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
}

export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function atendimentosVisiveis(): Atendimento[] {
  return CONFIG.mostrarSedacao ? [...CONFIG.atendimentos, CONFIG.sedacao] : CONFIG.atendimentos
}
