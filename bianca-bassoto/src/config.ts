/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio, ausente ou `ativo: false` = o bloco NÃO aparece.
 * Nunca escreva "a confirmar" em um campo: deixe vazio.
 */

export type Atendimento = {
  id: string;
  nome: string;
  descricao: string;
  /** Complemento da mensagem do WhatsApp: "...uma consulta de {mensagem}." */
  mensagem: string;
  ativo: boolean;
};

export type Frente = {
  id: 'avaliacao' | 'exames' | 'plano' | 'acompanhamento';
  rotulo: string;
  texto: string;
  /** token de cor do marcador */
  cor: 'm1' | 'm2' | 'm3' | 'm4';
  ativo: boolean;
};

export type Formacao = { texto: string; ativo: boolean };

export type Dia = {
  /** 0 = domingo ... 6 = sábado (getDay) */
  dia: number;
  nome: string;
  abre?: string; // "08:00"
  fecha?: string; // "20:00"
};

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" e noindex. */
  rascunho: true,
  /** Abertura (cortina). Padrão: desligada. */
  intro: false,

  siteUrl: 'https://bianca-bassoto-rascunho.vercel.app',

  nome: 'Bianca Bassoto',
  descritor: 'Nutricionista',
  cidade: 'Poços de Caldas',
  uf: 'MG',

  /** Ex.: "CRN-9 00000". Vazio = nenhuma menção a CRN no site. */
  crn: '',

  /** Foto autorizada (retrato ou consultório) em /public/fotos. Vazio = sem foto. */
  foto: '',
  fotoAlt: '',

  email: '',

  whatsapp: '553537224901',
  telefone: '553537224901',
  telefoneExibicao: '(35) 3722-4901',
  usarWhatsapp: true,

  instagram: {
    usuario: '@biancabassotonutri',
    url: 'https://www.instagram.com/biancabassotonutri/',
  },

  endereco: {
    rua: 'R. Ceará, 19',
    complemento: 'Sala 106',
    bairro: 'Centro',
    cidade: 'Poços de Caldas',
    uf: 'MG',
    cep: '37701-710',
    ruaSchema: 'Rua Ceará, 19, sala 106',
    maps: 'https://maps.app.goo.gl/XkHrrVsY6wQpWW2y6',
    rota:
      'https://www.google.com/maps/dir/?api=1&destination=R.%20Cear%C3%A1%2C%2019%2C%20sala%20106%2C%20Centro%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037701-710',
    embed:
      'https://www.google.com/maps?q=R.%20Cear%C3%A1%2C%2019%2C%20Centro%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037701-710&output=embed',
  },

  fusoHorario: 'America/Sao_Paulo',
  horarios: [
    { dia: 1, nome: 'Segunda-feira', abre: '08:00', fecha: '20:00' },
    { dia: 2, nome: 'Terça-feira', abre: '08:00', fecha: '20:00' },
    { dia: 3, nome: 'Quarta-feira', abre: '08:00', fecha: '20:00' },
    { dia: 4, nome: 'Quinta-feira', abre: '08:00', fecha: '20:00' },
    { dia: 5, nome: 'Sexta-feira', abre: '08:00', fecha: '20:00' },
    { dia: 6, nome: 'Sábado', abre: '08:00', fecha: '12:00' },
    { dia: 0, nome: 'Domingo' },
  ] as Dia[],
  avisoHorarios: 'Os horários podem variar em feriados.',

  formacao: [
    { texto: 'Graduação em Nutrição, Universidade de Alfenas, concluída em 2007.', ativo: true },
    // Desligados até a profissional confirmar títulos e forma de divulgação:
    { texto: 'Pós-graduação em fitoterapia', ativo: false },
    { texto: 'Pós-graduação em nutrição esportiva', ativo: false },
    { texto: 'Curso de epigenética', ativo: false },
    { texto: 'Curso de modulação intestinal', ativo: false },
  ] as Formacao[],

  atendimentos: [
    {
      id: 'atendimento-nutricional',
      nome: 'Atendimento nutricional',
      descricao:
        'Consulta individual que começa por uma conversa e uma avaliação. A partir delas, a orientação alimentar é pensada para a rotina de cada pessoa.',
      mensagem: 'atendimento nutricional',
      ativo: true,
    },
    {
      id: 'emagrecimento',
      nome: 'Emagrecimento',
      descricao:
        'Acompanhamento nutricional para quem quer perder peso, com atenção aos hábitos e ao comportamento alimentar, sempre a partir de uma avaliação individual.',
      mensagem: 'emagrecimento',
      ativo: true,
    },
    // Desligados até a profissional confirmar o que oferece e como pode anunciar:
    { id: 'antropometrica', nome: 'Avaliação antropométrica', descricao: '', mensagem: 'avaliação antropométrica', ativo: false },
    { id: 'bioimpedancia', nome: 'Bioimpedância', descricao: '', mensagem: 'bioimpedância', ativo: false },
    { id: 'exames-geneticos', nome: 'Exames genéticos', descricao: '', mensagem: 'exames genéticos', ativo: false },
    { id: 'fitoterapia', nome: 'Fitoterapia', descricao: '', mensagem: 'fitoterapia', ativo: false },
    { id: 'esportiva', nome: 'Nutrição esportiva', descricao: '', mensagem: 'nutrição esportiva', ativo: false },
    { id: 'mentoria', nome: 'Mentoria', descricao: '', mensagem: 'mentoria', ativo: false },
    { id: 'coach', nome: 'Coach', descricao: '', mensagem: 'coach', ativo: false },
    { id: 'online', nome: 'Atendimento online', descricao: '', mensagem: 'atendimento online', ativo: false },
  ] as Atendimento[],

  /** As quatro frentes: marcadores do hero e etapas de "Como funciona". */
  frentes: [
    {
      id: 'avaliacao',
      rotulo: 'Avaliação',
      texto: 'Uma conversa sobre a sua rotina, a sua alimentação e o que você procura, seguida da avaliação individual.',
      cor: 'm1',
      ativo: true,
    },
    {
      id: 'exames',
      rotulo: 'Exames',
      texto: 'Quando a profissional considerar necessário, exames entram na avaliação. Nem toda consulta precisa deles.',
      cor: 'm2',
      ativo: true,
    },
    {
      id: 'plano',
      rotulo: 'Plano',
      texto: 'Uma orientação alimentar individual, feita para caber nos seus horários e nos seus hábitos.',
      cor: 'm3',
      ativo: true,
    },
    {
      id: 'acompanhamento',
      rotulo: 'Acompanhamento',
      texto: 'Retornos para conversar sobre o que funcionou na prática e ajustar a orientação quando for preciso.',
      cor: 'm4',
      ativo: true,
    },
  ] as Frente[],

  secoes: {
    atendimentos: true,
    consulta: true,
    sobre: true,
    comoFunciona: true,
    horarios: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },

  mensagens: {
    geral: 'Olá! Vi o site da Bianca Bassoto e gostaria de agendar uma consulta.',
    porAtendimento: (a: string) => `Olá! Vi o site da Bianca Bassoto e gostaria de agendar uma consulta de ${a}.`,
  },
};

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo && a.descricao.trim());
export const frentesAtivas = () => CONFIG.frentes.filter((f) => f.ativo);
export const formacaoAtiva = () => CONFIG.formacao.filter((f) => f.ativo && f.texto.trim());
export const temCrn = () => CONFIG.crn.trim().length > 0;

export const waLink = (mensagem: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const telLink = () => `tel:+${CONFIG.telefone}`;

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.complemento.toLowerCase()}, ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`;
};
