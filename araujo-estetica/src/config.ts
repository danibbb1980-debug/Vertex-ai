/**
 * Todos os dados do site. Campo vazio ("" / [] / undefined) = o bloco não aparece.
 * Fonte: Google Maps e Instagram da empresa, informados pelo vendedor.
 */

export type Servico = {
  id: string;
  nome: string;
  descricao: string;
  /** false = não aparece em lugar nenhum (lista, formulário, SEO, JSON-LD). */
  ativo: boolean;
};

export type Horario = {
  /** 0 = domingo ... 6 = sábado */
  dia: number;
  rotulo: string;
  /** "HH:MM"; ausente = fechado */
  abre?: string;
  fecha?: string;
};

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. */
  rascunho: true,
  /** Abertura (cortina) na primeira visita da sessão. Padrão: desligada. */
  intro: false,

  /** URL absoluta do site publicado (canonical, og:url). Atualize após o deploy. */
  siteUrl: "https://araujo-estetica-automotiva-rascunho.vercel.app",

  nome: "Araujo Estética Automotiva",
  marca: "Araujo",
  segmento: "Estética Automotiva",
  cidade: "Poços de Caldas",
  uf: "MG",

  /** Deixe vazio se o cliente não quiser o nome publicado. */
  proprietario: "",
  email: "",
  telefoneFixo: "",

  endereco: {
    rua: "R. Antônio Matavelli Sobrinho",
    numero: "423",
    bairro: "Vila Flora",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37700-390",
  },
  mapsUrl: "https://maps.app.goo.gl/pdPvQwGJeRWhXGA29",
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Ant%C3%B4nio%20Matavelli%20Sobrinho%2C%20423%2C%20Vila%20Flora%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037700-390",
  mapaEmbedUrl:
    "https://www.google.com/maps?q=R.%20Ant%C3%B4nio%20Matavelli%20Sobrinho%2C%20423%2C%20Vila%20Flora%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037700-390&output=embed",

  usarWhatsapp: true,
  whatsapp: "5535999824488",
  whatsappExibicao: "(35) 99982-4488",

  instagram: {
    usuario: "@araujo_estetica.aut",
    url: "https://www.instagram.com/araujo_estetica.aut/",
  },

  fusoHorario: "America/Sao_Paulo",
  horarios: [
    { dia: 1, rotulo: "Segunda", abre: "07:30", fecha: "17:30" },
    { dia: 2, rotulo: "Terça", abre: "07:30", fecha: "17:30" },
    { dia: 3, rotulo: "Quarta", abre: "07:30", fecha: "17:30" },
    { dia: 4, rotulo: "Quinta", abre: "07:30", fecha: "17:30" },
    { dia: 5, rotulo: "Sexta", abre: "07:30", fecha: "17:30" },
    { dia: 6, rotulo: "Sábado", abre: "08:00", fecha: "13:00" },
    { dia: 0, rotulo: "Domingo" },
  ] as Horario[],
  avisoHorarios: "Horários podem variar em feriados.",

  servicos: [
    {
      id: "lavagem-tecnica",
      nome: "Lavagem técnica",
      descricao: "Limpeza detalhada e cuidadosa do veículo.",
      ativo: true,
    },
    {
      id: "higienizacao",
      nome: "Higienização",
      descricao: "Limpeza e higienização do veículo, conforme a necessidade de cada um.",
      ativo: true,
    },
    {
      id: "motor-caixaria",
      nome: "Lavagem de motor e caixaria",
      descricao: "Limpeza do motor e da caixaria do veículo.",
      ativo: true,
    },
    // Desligados até a empresa confirmar o que oferece e como quer divulgar:
    { id: "polimento", nome: "Polimento", descricao: "", ativo: false },
    { id: "vitrificacao", nome: "Vitrificação", descricao: "", ativo: false },
    { id: "cristalizacao", nome: "Cristalização", descricao: "", ativo: false },
    { id: "pelicula", nome: "Película", descricao: "", ativo: false },
    { id: "protecao-pintura", nome: "Proteção de pintura", descricao: "", ativo: false },
  ] as Servico[],

  /** Liga/desliga seções. Mesmo ligada, a seção só aparece se tiver conteúdo. */
  secoes: {
    servicos: true,
    cuidado: true,
    silencio: true,
    comoFunciona: true,
    trabalhos: true,
    horarios: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },

  /**
   * Vídeos e fotos da seção "Trabalhos". A lista é montada no build a partir de
   * public/videos/*.mp4 (com pôster .webp de mesmo nome) e public/fotos/*.
   * Legenda: só quando o serviço for evidente no vídeo. Vazio = sem legenda.
   */
  legendasTrabalhos: {} as Record<string, string>,
  /** Pares antes/depois autorizados (arquivos em public/fotos/). */
  antesDepois: [] as { antes: string; depois: string; alt: string }[],
};

export const servicosAtivos = CONFIG.servicos.filter((s) => s.ativo);

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};

export const MSG_GERAL =
  "Olá! Vi o site da Araujo Estética Automotiva e gostaria de pedir um horário.";

export const waLink = (texto: string = MSG_GERAL) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const waServico = (servico: string) =>
  waLink(
    `Olá! Vi o site da Araujo Estética Automotiva e gostaria de pedir um horário para ${servico.toLowerCase()}.`,
  );
