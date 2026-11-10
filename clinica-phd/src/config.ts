/**
 * CONFIGURAÇÃO DO SITE DA CLÍNICA PHD
 * ------------------------------------------------------------
 * Todo o conteúdo factual do site sai deste arquivo.
 * Regra: campo vazio ("") ou lista vazia = o item NÃO aparece no site.
 * Nada de placeholders: se um dado não existe, deixe vazio.
 */

export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo ... 6 = sábado

export interface Horario {
  dia: Dia;
  nome: string;
  /** "HH:MM" ou "" quando a clínica está fechada no dia */
  abre: string;
  fecha: string;
}

export interface Area {
  nome: string;
  slug: string;
  ativa: boolean;
  /** Frase educativa geral sobre a área (sem doenças, exames ou procedimentos) */
  educativo: string;
  /** Como é o atendimento na clínica, em termos gerais */
  descricao: string;
}

export interface Profissional {
  tratamento: "Dra." | "Dr.";
  nome: string;
  crm: string;
  crmUf: string;
  /** Área de atendimento (deve existir em CONFIG.areas) */
  area: string;
  /** Registro de Qualificação de Especialista. Vazio = o título de especialista NÃO aparece. */
  rqe: string;
  /** Título usado SOMENTE quando o RQE estiver preenchido (ex.: "Pediatra") */
  titulo: string;
  /** Caminho de foto em /public (ex.: "/fotos/equipe/barbara.webp"). Vazio = cartão só tipográfico. */
  foto: string;
  mostrar: boolean;
}

export interface Foto {
  src: string; // caminho em /public, sem extensão se houver versões .avif/.webp
  alt: string;
  largura: number;
  altura: number;
}

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" no topo. Mude para false só ao publicar de vez. */
  rascunho: true,
  /** URL pública do site (sem barra no final). Usada em canonical, og:url, og:image e JSON-LD. */
  siteUrl: "https://clinica-phd-rascunho.vercel.app",

  nome: "Clínica PHD",
  cidade: "Poços de Caldas",
  uf: "MG",

  endereco: {
    logradouro: "Av. Gentil Messías-Kitate, 240",
    complemento: "1º andar, sala 224",
    edificio: "Edifício Unique",
    bairro: "Vila Cruz",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37701-528",
  },

  /** Somente dígitos, com DDI 55 + DDD. */
  telefone: "553531141459",
  telefoneExibicao: "(35) 3114-1459",
  /**
   * NÚMERO NÃO VERIFICADO COMO WHATSAPP (é um telefone fixo).
   * Testar antes de enviar o site. Para trocar, altere só este campo.
   */
  whatsapp: "553531141459",
  /** false = todos os botões de WhatsApp viram "Ligar" (link tel:) */
  usarWhatsapp: true,

  email: "clinicaphd@clinicaphd.com",
  instagram: {
    url: "https://www.instagram.com/clinica_phd/",
    usuario: "@clinica_phd",
  },
  maps: {
    url: "https://maps.app.goo.gl/STXCEAqdisKMBUVZ8",
    /** Endereço usado no mapa incorporado */
    consulta: "Av. Gentil Messías-Kitate, 240, Vila Cruz, Poços de Caldas - MG, 37701-528",
  },

  horarios: [
    { dia: 1, nome: "Segunda-feira", abre: "08:00", fecha: "18:00" },
    { dia: 2, nome: "Terça-feira", abre: "08:00", fecha: "18:00" },
    { dia: 3, nome: "Quarta-feira", abre: "08:00", fecha: "18:00" },
    { dia: 4, nome: "Quinta-feira", abre: "08:00", fecha: "18:00" },
    { dia: 5, nome: "Sexta-feira", abre: "08:00", fecha: "18:00" },
    { dia: 6, nome: "Sábado", abre: "", fecha: "" },
    { dia: 0, nome: "Domingo", abre: "", fecha: "" },
  ] as Horario[],
  /** Pausa de almoço: não informada. Ex.: { inicio: "12:00", fim: "13:00" } */
  almoco: null as null | { inicio: string; fim: string },
  avisoFeriados: "Horários podem variar em feriados.",

  areas: [
    {
      nome: "Pediatria",
      slug: "pediatria",
      ativa: true,
      educativo: "A pediatria é a área da medicina dedicada à saúde de bebês, crianças e adolescentes.",
      descricao:
        "Atendimento na área de pediatria, com avaliação médica individual e a presença do responsável durante a consulta.",
    },
    {
      nome: "Dermatologia",
      slug: "dermatologia",
      ativa: true,
      educativo: "A dermatologia é a área da medicina dedicada à pele, aos cabelos e às unhas.",
      descricao: "Atendimento na área de dermatologia, com avaliação médica individual.",
    },
    {
      nome: "Hematologia",
      slug: "hematologia",
      ativa: true,
      educativo: "A hematologia é a área da medicina que estuda o sangue e os órgãos que o produzem.",
      descricao: "Atendimento na área de hematologia, com avaliação médica individual.",
    },
    {
      nome: "Reumatologia",
      slug: "reumatologia",
      ativa: true,
      educativo:
        "A reumatologia é a área da medicina dedicada às articulações, aos músculos e aos tecidos que dão sustentação ao corpo.",
      descricao: "Atendimento na área de reumatologia, com avaliação médica individual.",
    },
  ] as Area[],

  /** Aparecem no Instagram, mas sem médico informado. Ficam DESLIGADAS (não aparecem no site). */
  areasPendentes: ["Cardiologia", "Endocrinologia"],

  /**
   * Dados de listagem pública de terceiros: conferir no portal do CRM-MG
   * e obter autorização da clínica antes de publicar.
   */
  profissionais: [
    { tratamento: "Dra.", nome: "Barbara Regina Martins Lusvarghi", crm: "62121", crmUf: "MG", area: "Pediatria", rqe: "", titulo: "Pediatra", foto: "", mostrar: true },
    { tratamento: "Dra.", nome: "Bruna de Cassia Silva Avila Lima", crm: "73224", crmUf: "MG", area: "Pediatria", rqe: "", titulo: "Pediatra", foto: "", mostrar: true },
    { tratamento: "Dra.", nome: "Beatriz Helena Martins Lusvarghi", crm: "55174", crmUf: "MG", area: "Dermatologia", rqe: "", titulo: "Dermatologista", foto: "", mostrar: true },
    { tratamento: "Dr.", nome: "João Guilherme Martins Lusvarghi", crm: "63578", crmUf: "MG", area: "Hematologia", rqe: "", titulo: "Hematologista", foto: "", mostrar: true },
    { tratamento: "Dra.", nome: "Daniela Vieira", crm: "79182", crmUf: "MG", area: "Reumatologia", rqe: "", titulo: "Reumatologista", foto: "", mostrar: true },
  ] as Profissional[],

  /** Fotos reais do espaço (fachada, recepção, consultórios). Lista vazia = nenhuma foto aparece. */
  fotos: [] as Foto[],

  agendamento: {
    /** true = o campo "Atendimento desejado" passa a ser obrigatório */
    exigirAtendimento: false,
    /** Duração de cada bloco de horário sugerido, em minutos */
    intervaloMinutos: 60,
    limiteObservacoes: 300,
    /** Só para pronto atendimento. A Clínica PHD não é PS: fica false. */
    urgencia: false,
  },

  mensagens: {
    geral: "Olá! Vi o site da Clínica PHD e gostaria de agendar uma consulta.",
    area: (area: string) => `Olá! Vi o site da Clínica PHD e gostaria de informações sobre ${area}.`,
    formularioAbertura: "Olá! Vim pelo site da Clínica PHD e gostaria de solicitar um agendamento.",
  },

  /** Liga/desliga cada seção da página. Seção sem conteúdo também não aparece. */
  secoes: {
    hero: true,
    horariosDestaque: true,
    sobre: true,
    areas: true,
    corpoClinico: true,
    antesDaConsulta: true,
    comoFunciona: true,
    estrutura: true,
    faq: true,
    localizacao: true,
    agendar: true,
    ctaFinal: true,
  },
};

/* ------------------------------------------------------------------ */
/* Valores derivados (não editar)                                      */
/* ------------------------------------------------------------------ */

export const preenchido = (v: unknown): boolean =>
  typeof v === "string" ? v.trim() !== "" : Array.isArray(v) ? v.length > 0 : v != null;

export const areasAtivas = CONFIG.areas.filter(
  (a) => a.ativa && !CONFIG.areasPendentes.includes(a.nome),
);

export const profissionaisVisiveis = CONFIG.profissionais.filter(
  (p) => p.mostrar && areasAtivas.some((a) => a.nome === p.area),
);

/**
 * O título de especialista ("Pediatra", "Dermatologista"...) só aparece
 * quando o RQE do profissional está preenchido (CFM, Resolução nº 2.336/2023).
 * Hoje nenhum RQE foi informado, então este valor é false.
 */
export const mostrarTituloEspecialista = (p?: Profissional): boolean =>
  p ? preenchido(p.rqe) && preenchido(p.titulo) : CONFIG.profissionais.some((x) => preenchido(x.rqe));
