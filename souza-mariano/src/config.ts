/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("", [] ou ausente) = o bloco correspondente NÃO aparece.
 */

export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Horario {
  dia: Dia;
  nome: string;
  abre?: string; // "09:00"
  fecha?: string; // "18:00"
  /** intervalo de almoço, se houver: ["12:00", "13:00"] */
  pausa?: [string, string];
}

export interface Area {
  nome: string;
  descricao: string;
}

export interface Familia {
  id: string;
  nome: string;
  resumo: string;
  areas: Area[];
}

export interface Advogada {
  nome: string;
  oab: string;
  /** caminho em /public (ex.: "/fotos/ilsara.jpg"). Vazio = sem foto. */
  foto?: string;
}

const telefone = "(35) 99142-0078";

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://souza-mariano-rascunho.vercel.app",

  nome: "Souza & Mariano Advogados Associados",
  nomeCurto: "Souza & Mariano",
  cidade: "Pouso Alegre",
  uf: "MG",

  /** Logo em alta resolução (SVG/PNG em /public). Vazio = usa o monograma redesenhado. */
  logo: "",

  advogadas: [
    { nome: "Dra. Ilsara Caroline de Souza", oab: "OAB/MG 202.983", foto: "" },
    { nome: "Dra. Jéssica Camila Mariano", oab: "OAB/MG 196.832", foto: "" },
  ] as Advogada[],

  /** Fotos do escritório em /public (ex.: ["/fotos/sala.jpg"]). Vazio = seção sem fotos. */
  fotosEscritorio: [] as string[],

  telefone,
  telefoneHref: "tel:+5535991420078",
  telefoneE164: "+55-35-99142-0078",

  /** Número no formato internacional, só dígitos. */
  whatsapp: "5535991420078",
  /** false = nenhum link de WhatsApp aparece; tudo vira "Ligar". */
  usarWhatsapp: false,
  mensagemWhatsapp:
    "Olá! Vi o site do escritório Souza & Mariano e gostaria de agendar um atendimento.",

  instagram: "",
  email: "",

  endereco: {
    rua: "Rua Coronel Otávio Meyer, 160",
    complemento: "Sala 315",
    bairro: "Centro",
    cidade: "Pouso Alegre",
    uf: "MG",
    cep: "37550-068",
  },
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Cel.%20Ot%C3%A1vio%20Meyer%2C%20160%20-%20Sala%20315%20-%20Centro%2C%20Pouso%20Alegre%20-%20MG%2C%2037550-068",
  mapaEmbedUrl:
    "https://www.google.com/maps?q=R.%20Cel.%20Ot%C3%A1vio%20Meyer%2C%20160%20-%20Centro%2C%20Pouso%20Alegre%20-%20MG%2C%2037550-068&output=embed",

  horarios: [
    { dia: 1, nome: "Segunda-feira", abre: "09:00", fecha: "18:00" },
    { dia: 2, nome: "Terça-feira", abre: "09:00", fecha: "18:00" },
    { dia: 3, nome: "Quarta-feira", abre: "09:00", fecha: "18:00" },
    { dia: 4, nome: "Quinta-feira", abre: "09:00", fecha: "18:00" },
    { dia: 5, nome: "Sexta-feira", abre: "09:00", fecha: "16:00" },
    { dia: 6, nome: "Sábado" },
    { dia: 0, nome: "Domingo" },
  ] as Horario[],
  avisoHorarios: "Horários podem variar em feriados.",

  familias: [
    {
      id: "empresas",
      nome: "Empresas e consultoria",
      resumo: "Orientação preventiva e atuação em disputas da vida empresarial.",
      areas: [
        { nome: "Direito Civil e Empresarial", descricao: "Contratos, obrigações, responsabilidade civil e relações entre sócios e empresas." },
        { nome: "Direito Tributário", descricao: "Orientação sobre tributos e acompanhamento de questões fiscais e administrativas." },
        { nome: "Consultoria para empreendedores e empresas", descricao: "Análise preventiva de rotinas, documentos e decisões do negócio." },
        { nome: "Orientação em processos empresariais", descricao: "Apoio jurídico em etapas como abertura, alterações contratuais e reorganização." },
        { nome: "Direito Digital", descricao: "Questões ligadas a contratos on-line, dados pessoais e presença na internet." },
      ],
    },
    {
      id: "trabalho",
      nome: "Trabalho e previdência",
      resumo: "Relações de trabalho e benefícios previdenciários.",
      areas: [
        { nome: "Direito Trabalhista", descricao: "Orientação e atuação em questões entre empregados e empregadores." },
        { nome: "Direito Previdenciário", descricao: "Análise de situações relacionadas a benefícios e ao planejamento previdenciário." },
      ],
    },
    {
      id: "consumo",
      nome: "Consumo e serviços",
      resumo: "Relações com fornecedores, bancos, transporte e saúde.",
      areas: [
        { nome: "Direito do Consumidor", descricao: "Relações de consumo entre pessoas, comércio e prestadores de serviço." },
        { nome: "Direito Bancário", descricao: "Contratos e relações com bancos e instituições financeiras." },
        { nome: "Direito de Trânsito", descricao: "Questões administrativas e judiciais ligadas ao trânsito." },
        { nome: "Direito do Passageiro Aéreo", descricao: "Relações entre passageiros e companhias de transporte aéreo." },
        { nome: "Direito da Saúde", descricao: "Relações com planos de saúde, hospitais e serviços de saúde." },
      ],
    },
    {
      id: "familia",
      nome: "Família e patrimônio",
      resumo: "Relações familiares, imóveis e propriedade rural.",
      areas: [
        { nome: "Direito de Família", descricao: "Questões familiares tratadas com orientação clara e discrição." },
        { nome: "Direito Imobiliário", descricao: "Compra, venda, locação e regularização de imóveis." },
        { nome: "Direito do Agro e Rural", descricao: "Contratos, propriedade e atividades ligadas ao meio rural." },
      ],
    },
    {
      id: "regularizacao",
      nome: "Regularização e processos administrativos",
      resumo: "Documentos e procedimentos perante órgãos públicos.",
      areas: [
        { nome: "Regularização de documentos e processos administrativos", descricao: "Acompanhamento de pedidos, documentos e procedimentos administrativos." },
      ],
    },
  ] as Familia[],

  formaDeTrabalhar: [
    { titulo: "Análise técnica", texto: "Cada demanda é estudada a partir dos documentos e dos fatos apresentados." },
    { titulo: "Comunicação clara", texto: "As possibilidades são explicadas em linguagem direta, sem jargão desnecessário." },
    { titulo: "Avaliação de riscos", texto: "Os caminhos juridicamente viáveis são apresentados com seus riscos." },
    { titulo: "Condução organizada", texto: "Acompanhamento discreto e organizado de cada etapa da demanda." },
  ],

  valores: [
    "Ética",
    "Transparência na comunicação",
    "Responsabilidade",
    "Respeito à singularidade de cada demanda",
    "Confiança",
  ],

  etapas: [
    { titulo: "Contato e agendamento", texto: "Você entra em contato por telefone e combina um horário de atendimento." },
    { titulo: "Análise do caso", texto: "As advogadas ouvem a situação e examinam os documentos disponíveis." },
    { titulo: "Orientação sobre as possibilidades", texto: "Você recebe uma explicação clara dos caminhos possíveis e de seus riscos." },
    { titulo: "Acompanhamento", texto: "Se decidir seguir, a demanda é conduzida e você é informado das etapas." },
  ],

  faq: [
    {
      p: "Como agendar um atendimento?",
      r: "Pelo telefone (35) 99142-0078, nos horários de funcionamento. A data e o horário são combinados diretamente com o escritório.",
    },
    {
      p: "Que documentos costumam ser úteis no primeiro atendimento?",
      r: "De forma geral, um documento de identificação e os papéis ligados ao assunto, como contratos, comunicações recebidas ou comprovantes. Se não tiver tudo em mãos, o atendimento pode acontecer assim mesmo.",
    },
    {
      p: "O que é atuação consultiva e contenciosa?",
      r: "Consultiva é a orientação preventiva: analisar contratos, decisões ou situações antes que virem conflito. Contenciosa é a atuação quando já existe uma disputa, em via administrativa ou judicial.",
    },
    {
      p: "O escritório atende empresas e pessoas físicas?",
      r: "Sim. O escritório atende pessoas físicas e empresas, de acordo com a área envolvida.",
    },
    {
      p: "Como é o primeiro atendimento?",
      r: "É uma conversa para entender a situação, ver os documentos disponíveis e explicar, de forma clara, quais caminhos podem ser analisados. Cada caso depende de análise individual.",
    },
    {
      p: "Quais áreas o escritório atende?",
      r: "Direito Civil e Empresarial, Tributário, Digital, Trabalhista, Previdenciário, do Consumidor, Bancário, de Trânsito, do Passageiro Aéreo, da Saúde, de Família, Imobiliário, do Agro e Rural, além de consultoria para empresas e regularização de documentos e processos administrativos.",
    },
    {
      p: "Quais são os horários de atendimento?",
      r: "De segunda a quinta, das 09h00 às 18h00, e na sexta, das 09h00 às 16h00. Sábado e domingo o escritório está fechado. Os horários podem variar em feriados.",
    },
    {
      p: "Onde fica o escritório?",
      r: "Na Rua Coronel Otávio Meyer, 160, Sala 315, no Centro de Pouso Alegre - MG, CEP 37550-068.",
    },
  ],

  /** Opções do formulário de agendamento (só aparece com usarWhatsapp = true). */
  agendamento: {
    exigirAtendimento: false,
  },

  /** Liga/desliga seções. Uma seção ligada mas sem conteúdo também não aparece. */
  secoes: {
    escritorio: true,
    advogadas: true,
    areas: true,
    valores: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

/** Link principal de contato, conforme o WhatsApp esteja ligado ou não. */
export const whatsappHref = (mensagem = CONFIG.mensagemWhatsapp) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const temWhatsapp = () => CONFIG.usarWhatsapp && CONFIG.whatsapp.trim() !== "";
