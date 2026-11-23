/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ou ausente = o bloco correspondente NÃO aparece.
 */

export type Atendimento = {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
};

export type Horario = {
  /** 0 = domingo ... 6 = sábado */
  dia: number;
  rotulo: string;
  /** "08:00" ou vazio quando fechado */
  abre?: string;
  fecha?: string;
};

export type Foto = { src: string; srcSet?: string; alt: string; largura: number; altura: number };

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://suzane-rodrigues-rascunho.vercel.app",

  nome: "Suzane Rodrigues",
  descritor: "Estética facial e corporal",
  cidade: "Pirassununga",
  uf: "SP",

  /** Confirmar curso e certificado antes de ligar `mostrarFormacao`. */
  formacao: "Licenciada em Estética Integrativa",
  mostrarFormacao: false,

  logo: {
    /** Recriação vetorial do medalhão. Troque por um arquivo oficial em alta resolução quando houver. */
    src: "/img/logo-sr.svg",
    alt: "Medalhão com o monograma SR de Suzane Rodrigues",
  },

  /** Foto autorizada da profissional (recorte sem fundo). Deixe `null` para esconder. */
  fotoProfissional: {
    src: "/img/suzane-540.webp",
    srcSet: "/img/suzane-360.webp 360w, /img/suzane-540.webp 540w, /img/suzane-700.webp 700w",
    alt: "Suzane Rodrigues, de jaleco branco, sorrindo",
    largura: 700,
    altura: 1061,
  } as Foto | null,

  /** Outras fotos autorizadas do espaço (vazio = seção não aparece). */
  fotos: [] as Foto[],

  endereco: {
    rua: "Rua Coronel Franco, 1451",
    bairro: "Centro",
    cidade: "Pirassununga",
    uf: "SP",
    cep: "13630-136",
    mapsUrl: "https://maps.app.goo.gl/exeTtuPDotZAKMDu9",
    rotaUrl:
      "https://www.google.com/maps/dir/?api=1&destination=R.%20Cel.%20Franco%2C%201451%2C%20Centro%2C%20Pirassununga%20-%20SP%2C%2013630-136",
    embedUrl:
      "https://www.google.com/maps?q=Rua%20Coronel%20Franco%2C%201451%2C%20Centro%2C%20Pirassununga%20-%20SP%2C%2013630-136&output=embed",
  },

  usarWhatsapp: true,
  whatsapp: "5519996784888",
  whatsappExibicao: "(19) 99678-4888",

  instagram: {
    usuario: "@drasuzanerodriguesestetic",
    url: "https://www.instagram.com/drasuzanerodriguesestetic/",
  },

  horarios: [
    { dia: 1, rotulo: "Segunda", abre: "08:00", fecha: "18:00" },
    { dia: 2, rotulo: "Terça", abre: "08:00", fecha: "18:00" },
    { dia: 3, rotulo: "Quarta", abre: "08:00", fecha: "18:00" },
    { dia: 4, rotulo: "Quinta", abre: "08:00", fecha: "18:00" },
    { dia: 5, rotulo: "Sexta", abre: "08:00", fecha: "18:00" },
    { dia: 6, rotulo: "Sábado", abre: "08:00", fecha: "13:00" },
    { dia: 0, rotulo: "Domingo" },
  ] as Horario[],
  avisoHorarios: "Os horários podem variar em feriados.",

  /**
   * Ligue um item (ativo: true) somente depois que a cliente confirmar que pode anunciá-lo
   * e como descrevê-lo. Mesmo ligado, a descrição continua geral, sem promessa.
   */
  atendimentos: [
    {
      id: "facial",
      nome: "Estética facial",
      descricao:
        "Atendimento voltado ao cuidado da pele do rosto. Começa por uma conversa e uma avaliação individual, para entender o que você procura e o que faz sentido no seu caso.",
      ativo: true,
    },
    {
      id: "corporal",
      nome: "Estética corporal",
      descricao:
        "Atendimento voltado ao cuidado do corpo. Antes de qualquer indicação, há uma avaliação individual, feita com calma e com horário reservado só para você.",
      ativo: true,
    },
    { id: "fios", nome: "Fios de colágeno", descricao: "", ativo: false },
    { id: "harmony", nome: "Harmony Face", descricao: "", ativo: false },
    { id: "crio", nome: "Criomodelagem", descricao: "", ativo: false },
  ] as Atendimento[],

  secoes: {
    atendimentos: true,
    profissional: true,
    comoFunciona: true,
    duvidas: true,
    local: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo && a.nome.trim());

export const MSG_GERAL = "Olá! Vi o site da Suzane Rodrigues e gostaria de agendar uma avaliação.";

export const waLink = (texto: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site da Suzane Rodrigues e gostaria de agendar uma avaliação de ${nome.toLowerCase()}.`;

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};

export const hora = (h?: string) => (h ? h.replace(":00", "h").replace(/^0/, "") : "");
