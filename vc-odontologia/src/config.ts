/**
 * TODOS os dados do site ficam aqui.
 *
 * Regra: só entra o que veio da ficha do Google Maps e do Instagram da clínica.
 * Tudo marcado com "CONFIRMAR COM A CLÍNICA" aparece no site como placeholder
 * visível até a clínica validar.
 */

export type Horario = {
  dias: string
  horas: string
  /** Dias no formato do schema.org, para o JSON-LD. Vazio = fechado. */
  schemaDias: string[]
  abre?: string
  fecha?: string
}

export type Profissional = {
  id: 'otavio' | 'tales'
  nome: string
  /** CONFIRMAR COM A CLÍNICA */
  nomeCompleto?: string
  titulo: string
  cro: string
  responsavelTecnico: boolean
  areas: string[]
  letra: 'V' | 'C'
  fotos: { retrato: string; perfil: string }
  alt: string
}

export type Atendimento = {
  id: string
  titulo: string
  /** Palavra em itálico no título do cartão */
  destaque: string
  resumo: string
  texto: string
  mensagemWhatsApp: string
}

// O CRO do Dr. Otávio aparece como 71566 na arte e na bio, e como 91566 no
// texto de agendamento. Por decisão do responsável pelo projeto, o site usa
// 71566 (arte + bio). CONFIRMAR COM A CLÍNICA antes da versão final.
const CRO_OTAVIO = 'CRO-MG 71566'

const otavio: Profissional = {
  id: 'otavio',
  nome: 'Dr. Otávio Carvalho',
  // CONFIRMAR COM A CLÍNICA: nome completo usado no texto da bio
  nomeCompleto: 'Otávio de Carvalho Pereira',
  titulo: 'Cirurgião-dentista',
  cro: CRO_OTAVIO,
  responsavelTecnico: true,
  // Áreas de atuação indicadas na arte da clínica. CONFIRMAR COM A CLÍNICA
  areas: ['Implantes dentários', 'Diagnóstico', 'Planejamento individualizado'],
  letra: 'C',
  fotos: { retrato: 'otavio-retrato', perfil: 'otavio-perfil' },
  alt: 'Retrato do Dr. Otávio Carvalho, de paletó azul-marinho, sorrindo, em fundo bege',
}

const tales: Profissional = {
  id: 'tales',
  nome: 'Dr. Tales Vilhena',
  titulo: 'Cirurgião-dentista',
  // CONFIRMAR COM A CLÍNICA
  cro: 'CRO-MG 81321',
  responsavelTecnico: false,
  // Áreas de atuação indicadas na arte da clínica. CONFIRMAR COM A CLÍNICA
  areas: ['Reabilitação oral', 'Função mastigatória'],
  letra: 'V',
  fotos: { retrato: 'tales-retrato', perfil: 'tales-perfil' },
  alt: 'Retrato do Dr. Tales Vilhena, de paletó azul-marinho e camisa branca, sorrindo, em fundo bege',
}

export const CONFIG = {
  /** Faixa de rascunho + marcações "a confirmar". Desligar quando a clínica aprovar. */
  rascunho: true,

  /** URL pública final (sem barra no fim). Usada em canonical, og:url e og:image. */
  siteUrl: 'https://vc-odontologia-rascunho.vercel.app',

  nome: 'V&C Odontologia',
  nomeCompleto: 'Vilhena Carvalho Odontologia',
  titulo: 'V&C Odontologia | Implantes e Reabilitação Oral em Alfenas - MG',
  descricao:
    'Implantes, próteses sobre implante e reabilitação oral em Alfenas - MG, com diagnóstico e planejamento individual. Agende sua avaliação pelo WhatsApp.',

  whatsapp: '5535997188792',
  whatsappExibicao: '(35) 99718-8792',
  telefoneSchema: '+55-35-99718-8792',

  instagram: {
    url: 'https://www.instagram.com/vec.odontologia/',
    usuario: '@vec.odontologia',
  },

  maps: {
    url: 'https://maps.app.goo.gl/HYjrck8WGZmaU5VAA',
    embed:
      'https://www.google.com/maps?q=Vilhena+Carvalho+Odontologia,+Av.+Lincoln+Westin+da+Silveira,+1948+-+Vila+Formosa,+Alfenas+-+MG,+37131-400&output=embed',
  },

  // Endereço da ficha do Google e da bio. CONFIRMAR COM A CLÍNICA
  endereco: {
    logradouro: 'Av. Lincoln Westin da Silveira, 1948',
    bairro: 'Vila Formosa',
    cidade: 'Alfenas',
    uf: 'MG',
    cep: '37131-400',
  },

  // Horários da ficha do Google. CONFIRMAR COM A CLÍNICA (a ficha mostrou a
  // segunda-feira com o rótulo de feriado; 09h–19h é o horário regular).
  horarios: [
    {
      dias: 'Segunda a sexta',
      horas: '09h às 19h',
      schemaDias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      abre: '09:00',
      fecha: '19:00',
    },
    { dias: 'Sábado', horas: '08h às 12h', schemaDias: ['Saturday'], abre: '08:00', fecha: '12:00' },
    { dias: 'Domingo', horas: 'Fechado', schemaDias: [] },
  ] satisfies Horario[],
  observacaoHorarios: 'Horários podem variar em feriados.',

  otavio,
  tales,
  /** Ordem de exibição (V à esquerda, C à direita, como no nome da clínica). */
  profissionais: [tales, otavio],

  // Derivados da bio e da arte. CONFIRMAR COM A CLÍNICA.
  // Não incluir outros procedimentos até a clínica informar.
  atendimentos: [
    {
      id: 'implantes',
      titulo: 'Implantes dentários',
      destaque: 'Implantes',
      resumo: 'Para repor a raiz de um dente perdido.',
      texto:
        'O implante substitui a raiz de um dente perdido e serve de base para uma coroa ou prótese. Antes de qualquer indicação, avaliamos a saúde da boca, o osso e o seu histórico.',
      mensagemWhatsApp:
        'Olá! Vi o site da V&C Odontologia e gostaria de conversar sobre implantes dentários e agendar uma avaliação.',
    },
    {
      id: 'protocolo',
      titulo: 'Próteses sobre implante (protocolo)',
      destaque: 'Próteses',
      resumo: 'Uma arcada fixa apoiada sobre implantes.',
      texto:
        'A prótese do tipo protocolo é uma arcada fixa apoiada sobre implantes, considerada em alguns casos de perda de vários ou de todos os dentes. O planejamento olha para a mastigação, a fala e a rotina de cuidados.',
      mensagemWhatsApp:
        'Olá! Vi o site da V&C Odontologia e gostaria de conversar sobre próteses sobre implante (protocolo) e agendar uma avaliação.',
    },
    {
      id: 'reabilitacao',
      titulo: 'Reabilitação oral',
      destaque: 'Reabilitação',
      resumo: 'Dentes, mordida e função, pensados em conjunto.',
      texto:
        'Reabilitar é planejar o conjunto: dentes, mordida e função mastigatória. O plano pode combinar diferentes tratamentos, organizados em etapas a partir de um diagnóstico completo.',
      mensagemWhatsApp:
        'Olá! Vi o site da V&C Odontologia e gostaria de conversar sobre reabilitação oral e agendar uma avaliação.',
    },
    {
      id: 'diagnostico',
      titulo: 'Diagnóstico e planejamento individualizado',
      destaque: 'Diagnóstico',
      resumo: 'Entender o seu caso antes de propor qualquer caminho.',
      texto:
        'Tudo começa por entender o seu caso: conversa, exame clínico e, quando necessário, exames complementares. Depois, explicamos as possibilidades com clareza, no seu tempo.',
      mensagemWhatsApp:
        'Olá! Vi o site da V&C Odontologia e gostaria de agendar uma avaliação para diagnóstico e planejamento.',
    },
  ] satisfies Atendimento[],

  // NÃO mostrar anos de experiência até a clínica comprovar, por profissional
  // e sem superlativo (regras de publicidade do CFO).
  mostrarAnosDeExperiencia: false,

  // Só ligar se houver avaliações reais no Google. Sem depoimentos.
  mostrarNotaGoogle: false,
  notaGoogle: null as null | { nota: number; total: number },

  // CONFIRMAR COM A CLÍNICA: frase de assinatura das peças. Só como assinatura.
  mostrarAssinatura: false,
  assinatura: 'Sorrisos transformam o jeito de ver o mundo.',

  // Sem informação ainda (não aparecem no site): formas de pagamento, convênios,
  // estacionamento e acessibilidade. CONFIRMAR COM A CLÍNICA e acrescentar aqui.

  /**
   * Formulário "Solicitar agendamento": só monta a mensagem e abre o WhatsApp.
   * Nada é guardado nem enviado a servidor algum.
   */
  agendamento: {
    /** true = o campo "Atendimento desejado" passa a ser obrigatório */
    exigirAtendimento: false,
    // CONFIRMAR COM A CLÍNICA: intervalo de almoço (não consta na ficha do Google).
    // Os horários são só preferências; use null se não houver intervalo.
    intervaloAlmoco: { inicio: '12:00', fim: '13:00' } as null | { inicio: string; fim: string },
    /** Só ligar se a clínica atender urgências: mostra o aviso "Está com dor ou urgência?" */
    atendeUrgencia: false,
    limiteObservacoes: 300,
  },

  /** Liga/desliga cada seção. Para uma versão curta, desligue as do meio. */
  secoes: {
    clinica: true,
    marquee: true,
    atendimentos: true,
    paraQuem: true,
    comoFunciona: true,
    profissionais: true,
    compromissos: true,
    estrutura: true,
    avaliacoes: true, // só aparece se mostrarNotaGoogle também for true
    duvidas: true,
    agendamento: true,
    localizacao: true,
    ctaFinal: true,
  },

  mensagemWhatsApp: 'Olá! Vi o site da V&C Odontologia e gostaria de agendar uma avaliação.',
}

export const enderecoLinha = (e = CONFIG.endereco) =>
  `${e.logradouro} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`

export const linkWhatsApp = (mensagem: string = CONFIG.mensagemWhatsApp) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
