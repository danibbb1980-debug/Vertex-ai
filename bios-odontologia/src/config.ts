/**
 * BIOS Instituto de Odontologia e Estética — configuração única do site.
 *
 * Regra de ouro: campo vazio ("" ou []) = o bloco correspondente NÃO aparece.
 * Nada de placeholder. Para exibir algo novo, preencha aqui e gere o build.
 */

export type Atendimento = {
  /** identificador curto, usado na âncora e no formulário */
  id: string;
  nome: string;
  /** linha curta usada em "O instituto" */
  linha: string;
  /** descrição geral e conservadora, usada em "Atendimentos" */
  descricao: string;
};

export type Horario = {
  /** 0 = domingo … 6 = sábado */
  dia: number;
  /** "08:00" */
  abre: string;
  /** "18:00" */
  fecha: string;
  /** pausas opcionais, ex.: [{ inicio: "12:00", fim: "13:00" }] */
  pausas?: { inicio: string; fim: string }[];
};

export type Foto = {
  src: string;
  alt: string;
  webp?: string;
  largura?: number;
  altura?: number;
  legenda?: string;
  foco?: string;
};

export type Profissional = {
  nome: string;
  cro: string;
  /** só preencha com especialidade registrada no CRO */
  especialidade?: string;
};

export const CONFIG = {
  /** faixa global de rascunho + noindex. Mude para false só na publicação definitiva. */
  rascunho: true,

  /** URL pública absoluta (usada em canonical, og:url e JSON-LD). Nunca localhost. */
  siteUrl: "https://bios-odontologia-rascunho.vercel.app",

  nome: "BIOS Instituto de Odontologia e Estética",
  nomeCurto: "BIOS",
  descritor: "Instituto de Odontologia e Estética",

  /**
   * Logo. "" usa o logotipo redesenhado em SVG (src/components/Logo.tsx).
   * Para usar o arquivo oficial, coloque-o em public/ e informe o caminho, ex.: "/logo-bios.svg".
   */
  logo: "",

  /** Publicidade de pessoa jurídica: responsável técnico + CRO (Res. CFO 196/2019). */
  responsavelTecnico: { nome: "", cro: "" },
  /** inscrição da entidade no CRO */
  registroCRO: "",
  equipe: [] as Profissional[],

  endereco: {
    rua: "Rua Coronel José Alves",
    numero: "6",
    bairro: "Vila Pinto",
    cidade: "Varginha",
    uf: "MG",
    cep: "37010-540",
  },
  mapsUrl: "https://maps.app.goo.gl/Y4nkriAr7AUsoSB86",
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Cel.%20Jos%C3%A9%20Alves%2C%206%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG",
  mapaEmbedUrl:
    "https://www.google.com/maps?q=Rua%20Coronel%20Jos%C3%A9%20Alves%2C%206%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG%2C%2037010-540&output=embed",

  usarWhatsapp: true,
  /** só dígitos, com DDI e DDD */
  whatsapp: "5535999668743",
  whatsappExibicao: "(35) 99966-8743",
  telefone: "(35) 3214-8743",
  telefoneLink: "tel:+553532148743",
  email: "",

  instagram: {
    url: "https://www.instagram.com/bios_odontologia/",
    usuario: "@bios_odontologia",
  },

  /** vazio = "Atendimento mediante agendamento" e campo livre no formulário */
  horarios: [] as Horario[],

  atendimentos: [
    {
      id: "estetica",
      nome: "Estética dental e facial",
      linha: "Avaliação e planejamento estético, feitos caso a caso.",
      descricao:
        "A conversa começa pelo que você observa e pelo que deseja. O profissional avalia, explica as possibilidades e monta um planejamento estético individual, com as etapas e os cuidados de cada uma.",
    },
    {
      id: "implantes",
      nome: "Implantes dentários",
      linha: "Avaliação e planejamento de reabilitação com implantes.",
      descricao:
        "Antes de qualquer indicação, há uma avaliação clínica e, quando necessário, exames de imagem. Com isso, o profissional explica se o implante é uma opção no seu caso e como o tratamento seria organizado.",
    },
    {
      id: "endodontia",
      nome: "Endodontia com microscopia",
      linha: "Tratamento de canal com apoio de microscópio.",
      descricao:
        "O tratamento de canal é feito com apoio de microscópio, que amplia o campo de trabalho do profissional. A indicação, o número de sessões e os cuidados depois do tratamento são definidos na avaliação.",
    },
    {
      id: "dor-orofacial",
      nome: "Tratamento de dor orofacial",
      linha: "Avaliação e acompanhamento de dor na face, na boca e na mandíbula.",
      descricao:
        "Dores na região da face, da boca e da mandíbula podem ter origens diferentes. A consulta começa pela avaliação do histórico e dos sintomas, e o acompanhamento é planejado a partir dela.",
    },
  ] as Atendimento[],

  /**
   * Procedimentos citados em diretório de terceiros (não pelo instituto).
   * Só aparecem com mostrarAtendimentosDiretorio = true, depois de confirmados pelo cliente.
   */
  atendimentosDiretorio: [
    {
      id: "clareamento",
      nome: "Clareamento dental",
      linha: "Avaliação para clareamento dental.",
      descricao:
        "A indicação do clareamento depende de avaliação: o profissional examina os dentes e as gengivas e explica se o procedimento é adequado no seu caso.",
    },
    {
      id: "facetas",
      nome: "Facetas e lentes de contato dental",
      linha: "Avaliação e planejamento de facetas.",
      descricao:
        "Facetas exigem planejamento individual. Na avaliação, o profissional explica as opções, as etapas e os cuidados envolvidos.",
    },
    {
      id: "alinhadores",
      nome: "Alinhadores",
      linha: "Avaliação ortodôntica para alinhadores.",
      descricao:
        "A possibilidade de usar alinhadores depende de avaliação ortodôntica individual.",
    },
    {
      id: "ortodontia",
      nome: "Aparelho ortodôntico",
      linha: "Avaliação ortodôntica.",
      descricao:
        "A avaliação ortodôntica define se há indicação de aparelho e qual tipo seria adequado.",
    },
    {
      id: "consulta",
      nome: "Consulta odontológica geral",
      linha: "Consulta e avaliação odontológica.",
      descricao: "Consulta para avaliação geral da saúde bucal.",
    },
  ] as Atendimento[],
  mostrarAtendimentosDiretorio: false,

  /**
   * Fotos autorizadas (fachada, recepção, ambientes, equipamentos — NUNCA pacientes).
   * Coloque os arquivos em public/fotos/ e liste aqui. A primeira vira og:image.
   * webp é opcional (versão leve); foco = object-position do recorte.
   */
  fotos: [
    {
      src: "/fotos/fachada-noite-2.jpg",
      webp: "/fotos/fachada-noite-2.webp",
      largura: 1170,
      altura: 872,
      alt: "Fachada do BIOS à noite: letreiro com o nome BIOS iluminado sobre a marquise curva e portas de vidro",
      legenda: "A fachada, na Rua Coronel José Alves, 6.",
      foco: "50% 40%",
    },
    {
      src: "/fotos/fachada-noite-1.jpg",
      webp: "/fotos/fachada-noite-1.webp",
      largura: 1170,
      altura: 872,
      alt: "Entrada do instituto à noite, com a placa da clínica ao lado do número 6 e o acesso pela rampa",
      legenda: "Entrada pela rampa, ao lado da placa.",
      foco: "38% 50%",
    },
  ] as Foto[],

  /** liga/desliga seções inteiras */
  secoes: {
    instituto: true,
    atendimentos: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

/* ---------- utilidades derivadas do config ---------- */

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade}\u00a0-\u00a0${e.uf}`;
};

export const atendimentosVisiveis = (): Atendimento[] => [
  ...CONFIG.atendimentos,
  ...(CONFIG.mostrarAtendimentosDiretorio ? CONFIG.atendimentosDiretorio : []),
];

export const MSG_GERAL =
  "Olá! Vi o site do BIOS Instituto de Odontologia e Estética e gostaria de agendar uma avaliação.";

export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site do BIOS Instituto de Odontologia e Estética e gostaria de agendar uma avaliação sobre ${nome.toLowerCase()}.`;

export const waLink = (mensagem: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const temResponsavel = () =>
  Boolean(CONFIG.responsavelTecnico.nome.trim() && CONFIG.responsavelTecnico.cro.trim());
