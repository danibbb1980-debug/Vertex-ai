/**
 * Botelho & Neves Advogados Associados: todos os dados do site.
 *
 * Regra: campo vazio (string "", lista vazia, null ou false) = o bloco NÃO aparece.
 * Nada de placeholders. Veja o README para o que ainda falta confirmar.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export type Horario = {
  dia: DiaSemana;
  /** "HH:MM". Ausente = fechado. */
  abre?: string;
  fecha?: string;
  /** Intervalo de almoço opcional, "HH:MM". */
  almocoInicio?: string;
  almocoFim?: string;
};

export type Unidade = {
  nome: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  /** Só a unidade que tiver estes campos mostra mapa, rota e horários. */
  mapsUrl?: string;
  mapaEmbed?: string;
  horarios?: Horario[];
};

export type Foto = { src: string; srcPequena?: string; largura: number; altura: number; alt: string };

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://botelho-neves-rascunho.vercel.app",

  nome: "Botelho & Neves Advogados Associados",
  nomeCurto: "Botelho & Neves",

  socios: [
    { nome: "Dr. Ismael Cândido Botelho Júnior", oab: "OAB/MG 165.920" },
    { nome: "Dr. Wilton Neves Ferreira", oab: "OAB/MG 157.961" },
  ],

  /** Registro da sociedade na OAB: não informado. */
  registroSociedade: "",

  tempoAtuacao: "Mais de 10 anos de atuação",
  mostrarTempoAtuacao: true,

  cidadesAtuacao: ["Varginha", "Boa Esperança", "Coqueiral"],

  telefone: "(35) 3015-8433",
  telefoneHref: "tel:+553530158433",

  /** Número preparado, mas ainda NÃO confirmado como WhatsApp do escritório. */
  whatsapp: "553530158433",
  usarWhatsapp: false,

  instagram: {
    url: "https://www.instagram.com/botelhoenevesadvogados/",
    usuario: "@botelhoenevesadvogados",
  },

  unidades: [
    {
      nome: "Varginha",
      logradouro: "Rua Santa Cruz, 789",
      complemento: "sala 101",
      bairro: "Centro",
      cidade: "Varginha",
      uf: "MG",
      cep: "37002-089",
      mapsUrl: "https://maps.app.goo.gl/xFftrtDsQEiPbsRS6",
      mapaEmbed:
        "https://www.google.com/maps?q=Rua+Santa+Cruz,+789,+Centro,+Varginha+-+MG,+37002-089&output=embed",
      horarios: [
        { dia: 1, abre: "08:00", fecha: "18:00" },
        { dia: 2, abre: "08:00", fecha: "18:00" },
        { dia: 3, abre: "08:00", fecha: "18:00" },
        { dia: 4, abre: "08:00", fecha: "18:00" },
        { dia: 5, abre: "08:00", fecha: "18:00" },
        { dia: 6 },
        { dia: 0 },
      ],
    },
    {
      nome: "Coqueiral",
      logradouro: "Rua Professora Dona Joaquina, 74",
      bairro: "Centro",
      cidade: "Coqueiral",
      uf: "MG",
      cep: "37235-000",
    },
  ] as Unidade[],

  avisoFeriados: "Horários podem variar em feriados.",

  areas: [
    {
      id: "trabalho",
      titulo: "Direito do Trabalho",
      resumo:
        "Questões que nascem da relação de emprego, do primeiro dia de contrato até depois do desligamento.",
      paragrafos: [
        "O advogado trabalhista orienta sobre a relação de emprego: registro, contrato, jornada, descanso, férias, afastamentos e o que deve ser pago quando o vínculo termina.",
        "Também acompanha conversas e acordos com a empresa e, quando necessário, o processo na Justiça do Trabalho.",
      ],
      temas: [
        "Registro e reconhecimento do vínculo de emprego",
        "Verbas rescisórias e documentos do desligamento",
        "Jornada, horas extras, intervalos e descanso",
        "Férias, 13º salário e FGTS",
        "Afastamentos e retorno ao trabalho",
      ],
    },
    {
      id: "previdenciario",
      titulo: "Direito Previdenciário",
      resumo:
        "Benefícios do INSS e o caminho entre o pedido, a análise e uma eventual revisão.",
      paragrafos: [
        "O advogado previdenciário explica as regras dos benefícios do INSS, ajuda a reunir e organizar a documentação e acompanha o pedido administrativo.",
        "Quando um benefício é negado, cessado ou concedido de forma diferente da esperada, analisa os caminhos possíveis, no INSS ou na Justiça.",
      ],
      temas: [
        "Aposentadorias e planejamento previdenciário",
        "Pensão por morte",
        "Auxílios por incapacidade",
        "Benefício assistencial (BPC/LOAS)",
        "Revisões e pedidos negados ou cessados",
      ],
    },
  ],

  atendimentos: ["Direito do Trabalho", "Direito Previdenciário"],

  agendamento: { exigirAtendimento: false },

  /** Fotos opcionais. Vazio = o bloco não aparece. */
  fotos: {
    socios: {
      src: "/img/socios.webp",
      srcPequena: "/img/socios-400.webp",
      largura: 810,
      altura: 545,
      alt: "Os dois sócios do escritório Botelho & Neves, lado a lado, de terno escuro.",
    } as Foto | null,
    escritorio: null as Foto | null,
  },

  secoes: {
    escritorio: true,
    advogados: true,
    areas: true,
    quandoProcurar: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true, // só aparece também com usarWhatsapp = true
    ctaFinal: true,
  },

  mensagens: {
    geral: "Olá! Vi o site do escritório Botelho & Neves e gostaria de agendar um atendimento.",
    area: (area: string) =>
      `Olá! Vi o site do escritório Botelho & Neves e gostaria de informações sobre ${area}.`,
  },
};

export const temWhatsapp = () => CONFIG.usarWhatsapp && CONFIG.whatsapp.length >= 12;

export const linkWhatsapp = (texto: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const enderecoLinha = (u: Unidade) =>
  [u.logradouro, u.complemento, u.bairro].filter(Boolean).join(", ") + `, ${u.cidade} - ${u.uf}`;

export const sede = () => CONFIG.unidades[0];
