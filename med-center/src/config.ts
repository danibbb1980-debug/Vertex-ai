/**
 * Todo o conteúdo do site vem daqui.
 * Regra: campo vazio ou ausente = o bloco não aparece na tela.
 */

export type Andar = "terreo" | "primeiro" | "segundo";
export type Categoria = "odontologia" | "medicina" | "nutricao" | "saude-mental" | "fisioterapia" | "estetica";
export type IconeArea = "dente" | "dente-infantil" | "coracao" | "mente" | "conversa" | "coluna" | "folha" | "prato" | "corrida" | "pele" | "cuidado";

export interface Area {
  id: string;
  nome: string;
  categorias: Categoria[];
  descricao: string;
  icone: IconeArea;
  /** Preencha só quando a clínica confirmar o andar desta área. */
  andar?: Andar;
}

export interface Profissional {
  nome: string;
  /** Área exibida no cartão (sem a palavra "especialista"). */
  area: string;
  /** Registro no conselho. Vazio = o cartão NÃO aparece. */
  registro: string;
  /** Só para médicos, e só se o RQE aparecer na fonte. */
  rqe?: string;
  /** Só se o mesmo dado aparecer na arte do profissional. */
  formacao?: string[];
  /** Caminho de foto em boa qualidade (opcional). */
  foto?: string;
  /** id da área ligada a este profissional (opcional). */
  areaId?: string;
}

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://med-center-vital-brazil-rascunho.vercel.app",

  nome: "Med Center Vital Brazil",
  assinatura: "Saúde é vital.",
  logo: "/logo-medcenter.jpg",

  endereco: {
    rua: "Av. Alberto de Barros Cobra, 460",
    bairro: "Nova Pouso Alegre",
    cidade: "Pouso Alegre",
    uf: "MG",
    cep: "37553-438",
  },
  mapsUrl: "https://maps.app.goo.gl/8o7AtpSGkH5vdrZi9",
  mapsEmbed:
    "https://www.google.com/maps?q=Av.+Alberto+de+Barros+Cobra,+460+-+Nova+Pouso+Alegre,+Pouso+Alegre+-+MG,+37553-438&output=embed",

  telefone: { exibir: "(35) 3025-9494", tel: "+553530259494" },
  instagram: { url: "https://www.instagram.com/medcentervitalbrazil/", usuario: "@medcentervitalbrazil" },

  /** A CONFIRMAR COM A CLÍNICA: se o WhatsApp do térreo é a recepção geral. */
  whatsappPrincipal: "5535998495881",
  whatsappAndares: [
    { andar: "terreo" as Andar, rotulo: "Térreo", exibir: "(35) 99849-5881", numero: "5535998495881" },
    { andar: "primeiro" as Andar, rotulo: "1º andar", exibir: "(35) 99723-9848", numero: "5535997239848" },
    { andar: "segundo" as Andar, rotulo: "2º andar", exibir: "(35) 99826-1401", numero: "5535998261401" },
  ],

  mensagens: {
    geral: "Olá! Vi o site do Med Center Vital Brazil e gostaria de agendar um atendimento.",
    area: (area: string) => `Olá! Vi o site do Med Center Vital Brazil e gostaria de informações sobre ${area}.`,
  },

  /** 0 = domingo ... 6 = sábado. null = fechado. Sem intervalo de almoço informado. */
  horarios: {
    0: null,
    1: { abre: "07:00", fecha: "19:30" },
    2: { abre: "07:00", fecha: "19:30" },
    3: { abre: "07:00", fecha: "19:30" },
    4: { abre: "07:00", fecha: "19:30" },
    5: { abre: "07:00", fecha: "19:30" },
    6: null,
  } as Record<number, { abre: string; fecha: string; almoco?: [string, string] } | null>,
  horariosTexto: [
    { dias: "Segunda a sexta", horas: "07h00 às 19h30" },
    { dias: "Sábado e domingo", horas: "Fechado" },
  ],
  horariosAvisos: [
    "Os horários de cada profissional podem variar; consulte a recepção.",
    "Os horários podem variar em feriados.",
  ],

  estrutura: {
    andares: 3,
    acessibilidade: ["Entrada acessível para cadeirantes", "Banheiro acessível para cadeirantes", "Estacionamento acessível para cadeirantes"],
    pagamentos: ["Cartão de crédito", "Cartão de débito", "Pagamento por aproximação (NFC)"],
  },
  mostrarAcolhimento: true,

  /** Só ligue com comprovação. */
  mostrarHabilitacoes: false,
  mostrarProcedimentosEsteticos: false,

  categorias: [
    { id: "odontologia" as Categoria, nome: "Odontologia" },
    { id: "medicina" as Categoria, nome: "Medicina" },
    { id: "nutricao" as Categoria, nome: "Nutrição" },
    { id: "saude-mental" as Categoria, nome: "Saúde mental" },
    { id: "fisioterapia" as Categoria, nome: "Fisioterapia" },
    { id: "estetica" as Categoria, nome: "Estética" },
  ],

  areas: [
    {
      id: "biomedicina-estetica",
      nome: "Biomedicina estética",
      categorias: ["estetica"],
      descricao: "Cuidados estéticos com a pele e o rosto, com avaliação antes de qualquer conduta e orientação sobre cada etapa.",
      icone: "pele",
    },
    {
      id: "saude-mental-comportamental",
      nome: "Saúde mental e comportamental",
      categorias: ["saude-mental"],
      descricao: "Espaço de escuta e acompanhamento terapêutico para questões emocionais e de comportamento.",
      icone: "conversa",
    },
    {
      id: "fisioterapia-quiropraxia",
      nome: "Fisioterapia e quiropraxia",
      categorias: ["fisioterapia"],
      descricao: "Avaliação e acompanhamento de dores na coluna e no ombro, dor de cabeça e ATM, e tensões musculares.",
      icone: "coluna",
    },
    {
      id: "nutricao-fitoterapia",
      nome: "Nutrição clínica e fitoterapia",
      categorias: ["nutricao"],
      descricao: "Acompanhamento nutricional com olhar clínico e uso de fitoterapia integrativa quando houver indicação.",
      icone: "folha",
    },
    {
      id: "nutricao-integrativa",
      nome: "Nutrição integrativa",
      categorias: ["nutricao"],
      descricao: "Acompanhamento nutricional com abordagem integrativa e atenção à saúde da mulher.",
      icone: "prato",
    },
    {
      id: "nutricao-esportiva",
      nome: "Nutrição esportiva e clínica",
      categorias: ["nutricao"],
      descricao: "Acompanhamento nutricional para a rotina do dia a dia e para quem pratica atividade física.",
      icone: "corrida",
    },
    {
      id: "cardiologia",
      nome: "Cardiologia e clínica médica",
      categorias: ["medicina"],
      descricao: "Consultas de clínica médica e avaliação do coração, com orientação sobre exames e acompanhamento.",
      icone: "coracao",
    },
    {
      id: "psiquiatria",
      nome: "Psiquiatria",
      categorias: ["medicina", "saude-mental"],
      descricao: "Consulta médica em saúde mental, com escuta, avaliação e acompanhamento ao longo do tempo.",
      icone: "mente",
    },
    {
      id: "ortodontia",
      nome: "Ortodontia",
      categorias: ["odontologia"],
      descricao: "Ortodontia para adultos e crianças e ortopedia funcional dos maxilares.",
      icone: "dente",
    },
    {
      id: "odontopediatria",
      nome: "Odontopediatria",
      categorias: ["odontologia"],
      descricao: "Odontologia para crianças, atendimento a pacientes com necessidades especiais e ortopedia funcional dos maxilares.",
      icone: "dente-infantil",
    },
    {
      id: "ginecologia",
      nome: "Ginecologia e obstetrícia",
      categorias: ["medicina"],
      descricao: "Consultas de ginecologia e acompanhamento durante a gestação.",
      icone: "cuidado",
    },
  ] as Area[],

  /** Opções do formulário de agendamento (primeiro campo). */
  atendimentos: [
    "Biomedicina estética",
    "Saúde mental e comportamental",
    "Fisioterapia e quiropraxia",
    "Nutrição",
    "Cardiologia e clínica médica",
    "Psiquiatria",
    "Ortodontia",
    "Odontopediatria",
    "Ginecologia e obstetrícia",
  ],
  agendamento: { exigirAtendimento: false, limiteObservacoes: 300 },

  /**
   * Registros transcritos das artes em ./referencias/profissionais/.
   * Sem registro = sem cartão.
   */
  profissionais: [
    { nome: "Dra. Kenmelly A. Ferreira", area: "Biomedicina estética", registro: "CRBM 17220", areaId: "biomedicina-estetica" },
    { nome: "Dr. Eliandro Rosa Nascimento", area: "Saúde mental e comportamental", registro: "", areaId: "saude-mental-comportamental" },
    { nome: "Dra. Valéria Andrade", area: "Fisioterapia e quiropraxia clínica e esportiva", registro: "CREFITO 313205-F", areaId: "fisioterapia-quiropraxia" },
    { nome: "Dra. Renata de Almeida", area: "Nutrição clínica e fitoterapia", registro: "CRN-9 4401", areaId: "nutricao-fitoterapia" },
    { nome: "Dra. Ruth Ferrari", area: "Nutrição integrativa e saúde da mulher", registro: "CRN-9 32137", areaId: "nutricao-integrativa" },
    { nome: "Dr. Eduardo Lucas", area: "Cardiologia e clínica médica", registro: "CRM 51841", rqe: "RQE 33067", areaId: "cardiologia" },
    {
      nome: "Dra. Ana Carolina Brasil e Bernardes",
      area: "Nutrição clínica e esportiva",
      registro: "CRN 96501",
      formacao: ["Aprimoramento em transtornos alimentares (IPq-USP)", "Educadora em diabetes (SBD/ADJ)"],
      areaId: "nutricao-esportiva",
    },
    { nome: "Dr. Rodrigo C. F. Cardim", area: "Saúde mental", registro: "CRM 85366", areaId: "psiquiatria" },
    { nome: "Dra. Samara Chiachio Mendes", area: "Ortodontia e ortopedia funcional dos maxilares", registro: "CRO 50412", areaId: "ortodontia" },
    { nome: "Dra. Marina Barros", area: "Odontopediatria e pacientes com necessidades especiais", registro: "CRO-MG 7226", areaId: "odontopediatria" },
    { nome: "Dra. Júlia Figueiredo", area: "Ginecologia e obstetrícia", registro: "", areaId: "ginecologia" },
  ] as Profissional[],

  secoes: {
    centro: true,
    areas: true,
    profissionais: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

/* ---------- helpers ---------- */

export const temTexto = (v?: string | null) => typeof v === "string" && v.trim().length > 0;

export const profissionaisVisiveis = () => CONFIG.profissionais.filter((p) => temTexto(p.registro));

export function whatsappDoAndar(andar?: Andar) {
  if (!andar) return CONFIG.whatsappPrincipal;
  return CONFIG.whatsappAndares.find((a) => a.andar === andar)?.numero ?? CONFIG.whatsappPrincipal;
}

export function rotuloAndar(andar?: Andar) {
  if (!andar) return "";
  return CONFIG.whatsappAndares.find((a) => a.andar === andar)?.rotulo ?? "";
}

export function waLink(mensagem: string, numero: string = CONFIG.whatsappPrincipal) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export const enderecoCompleto = () => {
  const e = CONFIG.endereco;
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`;
};
