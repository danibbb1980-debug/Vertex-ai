/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("", null, [] ou ausente) = o bloco correspondente NÃO aparece.
 */

export type Turno = [inicio: string, fim: string];

export interface DiaHorario {
  dia: string;
  /** 0 = domingo ... 6 = sábado (igual a Date.getDay) */
  diaSemana: number;
  turnos: Turno[];
  schema: string;
}

export interface Atendimento {
  id: string;
  /** código da lâmina da escala de cor que marca o item */
  codigo: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface Foto {
  src: string;
  alt: string;
  largura: number;
  altura: number;
}

export interface Caso {
  antes: Foto;
  depois: Foto;
}

// Permite testar o modo WhatsApp sem editar este arquivo:
// VITE_WHATSAPP=5519999999999 npm run build
const whatsappTeste = (import.meta.env?.VITE_WHATSAPP as string | undefined) ?? "";

export const CONFIG = {
  /** Faixa de rascunho + noindex. Mude para false na publicação definitiva. */
  rascunho: true,
  siteUrl: "https://dra-isabella-dias-rascunho.vercel.app",

  nome: "Dra. Isabella Dias",
  nomeCurto: "Isabella Dias",
  profissao: "Cirurgiã-dentista",
  /** forma usada no texto corrido */
  cro: "CRO-SP 89630",
  /** forma que aparece no logotipo original */
  croArte: "CRO-SP 89.630",

  formacao: ["Clínica geral", "Pós-graduação em Implantes e Harmonização Orofacial (HOF)"],
  /** Só preencher com registro de especialidade no CRO (ex.: "Implantodontia") */
  especialidade: "",
  rqe: "",
  /** Informado pela profissional; confirmar. 0 = não exibe. */
  anosAtuacao: 20,
  /** Ex.: "Responsável técnica: Dra. Fulana, CRO-SP 00000". Vazio = não exibe. */
  responsavelTecnico: "",

  endereco: {
    logradouro: "Av. Santos Pinto, 100",
    complemento: "Sala 3",
    cep: "13930-000",
    cidade: "Serra Negra",
    uf: "SP",
  },
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Av.%20Santos%20Pinto%2C%20100%2C%20Serra%20Negra%20-%20SP%2C%2013930-000",
  mapaEmbed:
    "https://www.google.com/maps?q=Av.%20Santos%20Pinto%2C%20100%2C%20Serra%20Negra%20-%20SP%2C%2013930-000&output=embed",

  /** Telefone fixo, só dígitos com DDI */
  telefone: "551938923894",
  telefoneExibicao: "(19) 3892-3894",
  /** Só dígitos com DDI. Vazio = sem WhatsApp. */
  whatsapp: whatsappTeste,
  /** true somente se a clínica confirmar que o número atende por WhatsApp */
  usarWhatsapp: whatsappTeste !== "",
  mensagemWhatsapp: "Olá! Vi o site da Dra. Isabella Dias e gostaria de agendar uma avaliação.",

  instagram: "https://www.instagram.com/draisabelladias/",

  horarios: [
    { dia: "Segunda-feira", diaSemana: 1, turnos: [["09:00", "12:00"], ["14:00", "18:30"]], schema: "Monday" },
    { dia: "Terça-feira", diaSemana: 2, turnos: [["09:00", "12:00"], ["14:00", "18:30"]], schema: "Tuesday" },
    { dia: "Quarta-feira", diaSemana: 3, turnos: [["09:00", "12:00"], ["14:00", "18:30"]], schema: "Wednesday" },
    { dia: "Quinta-feira", diaSemana: 4, turnos: [["09:00", "12:00"], ["14:00", "18:30"]], schema: "Thursday" },
    { dia: "Sexta-feira", diaSemana: 5, turnos: [["09:00", "12:00"], ["14:00", "17:30"]], schema: "Friday" },
    { dia: "Sábado", diaSemana: 6, turnos: [], schema: "Saturday" },
    { dia: "Domingo", diaSemana: 0, turnos: [], schema: "Sunday" },
  ] as DiaHorario[],
  avisoHorarios: "Os horários podem variar em feriados.",

  atendimentos: [
    {
      id: "clinica-geral",
      codigo: "01",
      nome: "Clínica geral",
      descricao:
        "O acompanhamento da saúde bucal como um todo: consulta, exame clínico, orientação de cuidados em casa e o planejamento do que for necessário, explicado antes de começar.",
      ativo: true,
    },
    {
      id: "implantes",
      codigo: "02",
      nome: "Implantes dentários",
      descricao:
        "Uma alternativa para repor dentes perdidos. Antes de qualquer indicação, a avaliação considera a saúde da boca, os exames necessários e o histórico de cada pessoa.",
      ativo: true,
    },
    {
      // HOF é especialidade regulamentada: só ativar com registro comprovado no CRO.
      id: "hof",
      codigo: "03",
      nome: "Harmonização orofacial (HOF)",
      descricao:
        "Procedimentos da região orofacial, indicados somente após avaliação individual por profissional habilitado.",
      ativo: false,
    },
  ] as Atendimento[],

  /** Fotos autorizadas da profissional. Remova um item para ocultá-lo. */
  fotos: {
    retrato: {
      src: "/fotos/dra-retrato.webp",
      alt: "Dra. Isabella Dias, de jaleco lilás e braços cruzados, sorrindo diante de um painel de folhagens.",
      largura: 900,
      altura: 1195,
    } as Foto | null,
    consultorio: {
      src: "/fotos/dra-consultorio.webp",
      alt: "Dra. Isabella Dias no consultório, diante da parede rosa com o seu logotipo.",
      largura: 900,
      altura: 1217,
    } as Foto | null,
  },

  /**
   * Registros clínicos publicados pela profissional. Exigem autorização por escrito
   * de cada paciente (TCLE). Lista vazia = seção some.
   */
  casos: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    antes: { src: `/casos/caso${n}-antes.webp`, alt: `Registro clínico ${n}, situação inicial.`, largura: 800, altura: 400 },
    depois: { src: `/casos/caso${n}-depois.webp`, alt: `Registro clínico ${n}, após o atendimento.`, largura: 800, altura: 320 },
  })) as Caso[],

  /** Logotipo (máscaras PNG do arquivo original, coloridas por CSS) */
  logo: {
    simbolo: "/marca/logo-simbolo.webp",
    nome: "/marca/logo-nome.webp",
    completo: "/marca/logo.webp",
  },

  /** Liga/desliga seções */
  secoes: {
    atendimentos: true,
    profissional: true,
    casos: true,
    comoFunciona: true,
    duvidas: true,
    local: true,
    agendar: true, // só aparece se usarWhatsapp = true
    ctaFinal: true,
  },
};

export const enderecoLinha = `${CONFIG.endereco.logradouro}, ${CONFIG.endereco.complemento}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`;

export const atendimentosAtivos = () => CONFIG.atendimentos.filter((a) => a.ativo);

export const telHref = `tel:+${CONFIG.telefone}`;

export function waHref(texto: string = CONFIG.mensagemWhatsapp) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export const modoWhatsapp = () => CONFIG.usarWhatsapp && CONFIG.whatsapp !== "";

/** "09:00" -> "9h", "18:30" -> "18h30" */
export const hFmt = (h: string) => {
  const [a, b] = h.split(":");
  return `${Number(a)}h${b === "00" ? "" : b}`;
};
