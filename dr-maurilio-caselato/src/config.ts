// Fonte única de dados do site. Campo vazio ("") ou lista vazia = o bloco não aparece.

export type Foto = {
  src: string; // caminho base em /public/fotos, sem largura e extensão
  larguras: number[];
  largura: number; // proporção original (px)
  altura: number;
  alt: string;
  legenda?: string;
};

export type Atendimento = { nome: string; descricao: string };
export type Horario = { dia: string; diaSemana: number; abre: string; fecha: string } | { dia: string; diaSemana: number; fechado: true };

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://dr-maurilio-caselato-rascunho.vercel.app",

  nome: "Dr. Maurilio Caselato",
  nomeCurto: "Maurilio Caselato",
  profissao: "Cirurgião-dentista",
  cro: "CRO-MG 22618",
  // Preencher somente com especialidade registrada no CFO, junto do número de RQE.
  especialidade: "",
  rqe: "",
  responsavelTecnico: "",

  // Logotipo provisório (SVG em src/components/Logo.tsx). Para usar o logo definitivo,
  // coloque o arquivo em /public e informe o caminho aqui, ex.: "/logo.svg".
  logo: "",
  logoEscuro: "",

  cidade: "Varginha",
  uf: "MG",
  endereco: {
    rua: "Rua Alferes Joaquim Antônio",
    numero: "170",
    bairro: "Vila Pinto",
    cidade: "Varginha",
    uf: "MG",
    cep: "37010-600",
  },
  mapsUrl: "https://maps.app.goo.gl/7mtMTijWhBZR9Zry9",
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Alferes%20Joaquim%20Ant%C3%B4nio%2C%20170%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG",
  mapaEmbed:
    "https://www.google.com/maps?q=R.%20Alferes%20Joaquim%20Ant%C3%B4nio%2C%20170%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG%2C%2037010-600&output=embed",

  usarWhatsapp: true,
  whatsapp: "5535988480014",
  whatsappExibicao: "(35) 98848-0014",
  telefoneFixo: "",
  email: "",
  instagram: "https://www.instagram.com/drmauriliocaselato/",

  horarios: [
    { dia: "Segunda-feira", diaSemana: 1, abre: "08:00", fecha: "18:00" },
    { dia: "Terça-feira", diaSemana: 2, abre: "08:00", fecha: "18:00" },
    { dia: "Quarta-feira", diaSemana: 3, abre: "08:00", fecha: "18:00" },
    { dia: "Quinta-feira", diaSemana: 4, abre: "08:00", fecha: "18:00" },
    { dia: "Sexta-feira", diaSemana: 5, abre: "08:00", fecha: "18:00" },
    { dia: "Sábado", diaSemana: 6, fechado: true },
    { dia: "Domingo", diaSemana: 0, fechado: true },
  ] as Horario[],
  avisoHorarios: "Os horários podem variar em feriados.",

  atendimentos: [
    {
      nome: "Alinhadores transparentes",
      descricao:
        "Placas transparentes e removíveis, usadas para movimentar os dentes de forma gradual. Antes de qualquer indicação, avaliamos dentes, gengiva e mordida e explicamos o planejamento proposto para o seu caso.",
    },
    {
      nome: "Lentes de contato dental",
      descricao:
        "Revestimentos finos aplicados sobre a face visível dos dentes. Antes de qualquer indicação, avaliamos a saúde dos dentes e da gengiva e conversamos sobre o que é possível no seu caso.",
    },
  ] as Atendimento[],

  fotos: {
    // Retratos: confirmar com o cliente quem aparece em cada foto antes de publicar.
    profissional: [
      { src: "/fotos/retrato-consultorio", larguras: [400], largura: 400, altura: 600, alt: "Retrato do profissional de jaleco azul, em pé, no consultório" },
      { src: "/fotos/retrato-video", larguras: [400, 640], largura: 640, altura: 960, alt: "Retrato do profissional de terno cinza, diante de um painel de madeira" },
    ] as Foto[],
    consultorio: [
      { src: "/fotos/sala-de-espera", larguras: [480, 800], largura: 800, altura: 500, alt: "Sala de espera com sofá claro, luz indireta e passagem em arco", legenda: "Sala de espera" },
      { src: "/fotos/sala-arcos", larguras: [480, 800], largura: 800, altura: 600, alt: "Ambiente com divisórias em arco, janela para o jardim e painel iluminado", legenda: "Ambiente interno" },
      { src: "/fotos/sala-atendimento", larguras: [360], largura: 360, altura: 420, alt: "Cadeira odontológica e refletor na sala de atendimento", legenda: "Sala de atendimento" },
      { src: "/fotos/recepcao", larguras: [430], largura: 430, altura: 560, alt: "Recepção com poltronas vinho e balcão de madeira", legenda: "Recepção" },
    ] as Foto[],
  },

  secoes: {
    atendimentos: true,
    profissional: true,
    consultorio: true,
    comoFunciona: true,
    duvidas: true,
    local: true,
    agendar: true,
    ctaFinal: true,
  },

  mensagens: {
    geral: "Olá! Vi o site do Dr. Maurilio Caselato e gostaria de agendar uma avaliação.",
    porAtendimento: (a: string) =>
      `Olá! Vi o site do Dr. Maurilio Caselato e gostaria de agendar uma avaliação sobre ${a.toLowerCase()}.`,
  },
};

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};

export const waLink = (texto: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const temWhatsapp = () => CONFIG.usarWhatsapp && CONFIG.whatsapp.length > 0;
