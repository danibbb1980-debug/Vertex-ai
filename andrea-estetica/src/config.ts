/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("", [] ou ausente) = o bloco correspondente NÃO aparece.
 */

export type Atendimento = {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
};

/** Faixa de funcionamento de um dia. Horas em "HH:MM", fuso America/Sao_Paulo. */
export type Faixa = { abre: string; fecha: string } | null;

export type Foto = { src: string; alt: string };

export const CONFIG = {
  rascunho: true,

  /** URL pública definitiva. Atualize após o deploy (nunca localhost). */
  siteUrl: "https://andrea-estetica-rascunho.vercel.app",

  nome: "Andrea",
  /** Sobrenome NÃO confirmado: deixe vazio até a cliente confirmar. */
  nomeCompleto: "",
  descritor: "Estética e bem-estar",
  cidade: "Pirassununga",
  uf: "SP",

  /** Logo atual (640 px). Troque por um arquivo em alta resolução quando houver. */
  logo: {
    header: "/logo-128.webp", // exibido a 64 px (2x)
    rodape: "/logo-224.webp", // exibido a 112 px (2x)
    alt: "Logo de Andrea, estética e bem-estar",
  },

  endereco: {
    rua: "Rua Benedito Galhardo",
    numero: "1177",
    bairro: "Jardim Ferrarezzi",
    cidade: "Pirassununga",
    uf: "SP",
    cep: "13636-085",
    mapsUrl: "https://maps.app.goo.gl/5UYsyQvTFQ8kJvTG8",
    rotaUrl:
      "https://www.google.com/maps/dir/?api=1&destination=R.%20Benedito%20Galhardo%2C%201177%2C%20Jardim%20Ferrarezzi%2C%20Pirassununga%20-%20SP%2C%2013636-085",
    embedUrl:
      "https://www.google.com/maps?q=R.%20Benedito%20Galhardo%2C%201177%2C%20Jardim%20Ferrarezzi%2C%20Pirassununga%20-%20SP%2C%2013636-085&output=embed",
  },

  usarWhatsapp: true,
  whatsapp: "5519993274382",
  whatsappExibicao: "(19) 99327-4382",
  telefoneFixo: "",
  email: "",

  instagram: {
    usuario: "@andreafaquiano",
    url: "https://www.instagram.com/andreafaquiano/",
  },

  /** 0 = domingo ... 6 = sábado */
  horarios: {
    fuso: "America/Sao_Paulo",
    dias: [
      null,
      { abre: "08:00", fecha: "21:00" },
      { abre: "08:00", fecha: "21:00" },
      { abre: "08:00", fecha: "21:00" },
      { abre: "08:00", fecha: "21:00" },
      { abre: "08:00", fecha: "21:00" },
      { abre: "08:00", fecha: "18:30" },
    ] as Faixa[],
    aviso: "Horários podem variar em feriados.",
  },

  atendimentos: [
    {
      id: "limpeza-de-pele",
      nome: "Limpeza de pele",
      descricao: "Cuidado com a pele do rosto, com avaliação individual antes de começar.",
      ativo: true,
    },
    {
      id: "massagem-relaxante",
      nome: "Massagem relaxante",
      descricao: "Um momento de pausa e bem-estar, adaptado a cada pessoa.",
      ativo: true,
    },
    {
      id: "massagem-modeladora",
      nome: "Massagem modeladora",
      descricao: "Atendimento corporal, sempre com avaliação individual.",
      ativo: true,
    },
    {
      id: "drenagem-linfatica",
      nome: "Drenagem linfática",
      descricao: "Atendimento corporal com avaliação individual e ritmo combinado com você.",
      ativo: true,
    },
    {
      id: "depilacao",
      nome: "Depilação",
      descricao: "Atendimento com horário marcado e conversa prévia sobre as áreas desejadas.",
      ativo: true,
    },
    // Desligados até a cliente confirmar que podem ser anunciados e como descrever.
    { id: "microagulhamento", nome: "Microagulhamento", descricao: "", ativo: false },
    { id: "peeling-4d", nome: "Peeling 4D", descricao: "", ativo: false },
  ] as Atendimento[],

  /** Fotos AUTORIZADAS pela cliente (ex.: "/fotos/espaco-1.webp"). Vazio = não aparecem. */
  fotos: [] as Foto[],

  /** Liga/desliga seções inteiras. */
  secoes: {
    atendimentos: true,
    horarios: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const atendimentosAtivos = () =>
  CONFIG.atendimentos.filter((a) => a.ativo && a.nome.trim() !== "");

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};

export const MSG_GERAL = "Olá! Vi o site da Andrea e gostaria de agendar um horário.";
export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site da Andrea e gostaria de agendar um horário de ${nome.toLowerCase()}.`;

export const waLink = (texto: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
