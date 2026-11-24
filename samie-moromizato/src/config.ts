/**
 * Toda a informação do site vem daqui.
 * Regra: campo vazio ("", null, [] ou ativo: false) = o bloco NÃO aparece.
 */

export type Atendimento = {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  /** foto opcional (nome do arquivo em public/fotos, sem o sufixo -640/-1100) */
  foto?: Foto;
};

export type Foto = {
  arquivo: string;
  alt: string;
  /** largura / altura, para reservar o espaço e evitar salto de layout */
  proporcao: number;
  legenda?: string;
  /** "propria" = perfil da Samie; "cliente" = foto publicada por cliente em avaliação */
  origem: "propria" | "cliente";
};

export type Horario = {
  dia: string;
  /** 0 = domingo ... 6 = sábado (getDay) */
  diasSemana: number[];
  abre: string | null; // "08:00" ou null = fechado
  fecha: string | null;
};

export const CONFIG = {
  rascunho: true,
  intro: false,

  siteUrl: "https://samie-moromizato-rascunho.vercel.app",

  nome: "Samie Moromizato",
  descritor: "Estética e bem-estar",
  cidade: "Limeira",
  uf: "SP",

  logo: { src: "/logo.png", largura: 240, altura: 127, alt: "Samie Moromizato" },

  lema: { linha1: "Beleza não é", palavraRiscada: "intervenção", palavraFinal: "integridade" },

  metodo: "Método INTEGRAR",
  desde: 2011 as number | null,

  endereco: {
    rua: "Rua Prefeito Marciliano, 192",
    bairro: "Vila Cidade Jardim",
    cidade: "Limeira",
    uf: "SP",
    cep: "13480-180",
    mapsUrl: "https://maps.app.goo.gl/GLKe6xEtaCibncVVA",
    rotaUrl:
      "https://www.google.com/maps/dir/?api=1&destination=R.%20Prefeito%20Marciliano%2C%20192%2C%20Vila%20Cidade%20Jardim%2C%20Limeira%20-%20SP%2C%2013480-180",
    embedUrl:
      "https://www.google.com/maps?q=R.%20Prefeito%20Marciliano%2C%20192%2C%20Vila%20Cidade%20Jardim%2C%20Limeira%20-%20SP%2C%2013480-180&output=embed",
  },

  telefone: "551937135233",
  telefoneExibicao: "(19) 3713-5233",
  /** número com DDI, só dígitos. Preencha e ligue usarWhatsapp quando confirmado. */
  whatsapp: "",
  usarWhatsapp: false,
  email: "",

  instagram: { usuario: "@samiemoromizato", url: "https://www.instagram.com/samiemoromizato/" },

  fusoHorario: "America/Sao_Paulo",
  horarios: [
    { dia: "Segunda a sexta", diasSemana: [1, 2, 3, 4, 5], abre: "08:00", fecha: "19:00" },
    { dia: "Sábado", diasSemana: [6], abre: "09:00", fecha: "15:00" },
    { dia: "Domingo", diasSemana: [0], abre: null, fecha: null },
  ] as Horario[],
  avisoHorario: "Horários podem variar em feriados.",

  atendimentos: [
    {
      id: "limpeza-de-pele",
      nome: "Limpeza de pele",
      descricao:
        "Cuidado com a pele do rosto, com conversa e análise antes de começar.",
      ativo: true,
      foto: {
        arquivo: "limpeza-de-pele",
        alt: "Atendimento de limpeza de pele com esponjas no rosto de uma cliente deitada",
        proporcao: 1170 / 1542,
        origem: "propria",
      },
    },
    {
      id: "massagem",
      nome: "Massagem",
      descricao: "Momento de pausa e bem-estar, adaptado a cada pessoa.",
      ativo: true,
      foto: {
        arquivo: "massagem",
        alt: "Mãos da profissional durante uma massagem nas costas",
        proporcao: 1170 / 1542,
        origem: "propria",
      },
    },
    { id: "cuidados-capilares", nome: "Cuidados capilares", descricao: "", ativo: false },
    { id: "laser", nome: "Laser", descricao: "", ativo: false },
    { id: "luz-intensa-pulsada", nome: "Luz intensa pulsada", descricao: "", ativo: false },
  ] as Atendimento[],

  fotos: {
    retrato: {
      arquivo: "samie-retrato",
      alt: "Samie Moromizato de jaleco branco no espaço de atendimento",
      proporcao: 1170 / 1486,
      origem: "propria",
    } as Foto | null,
    mesa: {
      arquivo: "samie-mesa",
      alt: "Samie Moromizato sentada à mesa de atendimento",
      proporcao: 1170 / 871,
      origem: "propria",
    } as Foto | null,
    fachada: {
      arquivo: "fachada",
      alt: "Fachada do espaço Samie Moromizato, com o nome na parede e uma vitrine com plantas",
      proporcao: 1170 / 1534,
      origem: "propria",
    } as Foto | null,
    /** galeria "O espaço" */
    espaco: [
      { arquivo: "salao", alt: "Samie aplicando um produto com conta-gotas em uma cliente deitada no lavatório, com bancada e prateleiras ao fundo", proporcao: 1170 / 775, legenda: "Bancada e lavatório", origem: "propria" },
      { arquivo: "preparo", alt: "Mãos pingando um produto com conta-gotas em uma pequena tigela de cerâmica", proporcao: 1170 / 1630, legenda: "Preparo", origem: "propria" },
      { arquivo: "cuidado-capilar", alt: "Samie pingando um produto no couro cabeludo de uma cliente no lavatório", proporcao: 1170 / 1517, legenda: "Lavatório", origem: "propria" },
      { arquivo: "cesto", alt: "Cesto de palha com difusor de aromas, planta e uma placa iluminada sobre a maca", proporcao: 1170 / 1722, legenda: "Sobre a maca", origem: "cliente" },
      { arquivo: "sala", alt: "Canto de uma sala de atendimento com armário branco, luminária acesa e vaso de eucalipto", proporcao: 1170 / 1732, legenda: "Sala de atendimento", origem: "cliente" },
    ] as Foto[],
  },

  secoes: {
    atendimentos: true,
    profissional: true,
    espaco: true,
    horarios: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true, // só aparece se usarWhatsapp = true
    ctaFinal: true,
    profissionais: false, // área para outras profissionais: aguardando a Samie
  },
};

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo);

export const telHref = () => `tel:+${CONFIG.telefone}`;

export const waHref = (texto: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const usaWhats = () => CONFIG.usarWhatsapp && CONFIG.whatsapp.trim() !== "";

export const msgGeral = `Olá! Vi o site da ${CONFIG.nome} e gostaria de agendar um horário.`;
export const msgAtendimento = (nome: string) =>
  `Olá! Vi o site da ${CONFIG.nome} e gostaria de agendar um horário de ${nome.toLowerCase()}.`;

export const enderecoLinha = () =>
  `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}`;
