/**
 * SoluSono — todos os dados do site ficam aqui.
 *
 * Regra: campo vazio ("" ou []) = o bloco correspondente não aparece no site.
 * Nada de placeholder. Veja README.md para o passo a passo.
 */

export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export type Horario = {
  dia: Dia;
  /** "08:00". Vazio = fechado. */
  abre: string;
  fecha: string;
  /** Intervalo opcional, ex.: { inicio: "12:00", fim: "13:00" }. */
  pausa?: { inicio: string; fim: string };
};

export type Servico = { nome: string; texto: string };

export type GrupoServicos = {
  id: string;
  titulo: string;
  /** Uma palavra do título que aparece em itálico. */
  enfase?: string;
  resumo: string;
  itens: Servico[];
  /** Nome usado na mensagem do WhatsApp deste bloco. */
  assuntoWhatsapp: string;
};

export type Profissional = {
  nome: string;
  profissao: string;
  /** Ex.: "CREFITO-4 000000-F". Sem registro, o profissional não aparece. */
  registro: string;
  foto?: string;
};

export type Foto = { src: string; alt: string; largura: number; altura: number; legenda?: string };

export const CONFIG = {
  rascunho: true,
  /** URL pública sem barra no final. Atualize depois do deploy definitivo. */
  siteUrl: "https://solusono-rascunho.vercel.app",

  nome: "SoluSono",
  descricaoCurta: "Fisioterapia do Sono",
  slogan: "Soluções em Saúde e Reabilitação do Sono",
  cidade: "Poços de Caldas",
  uf: "MG",

  whatsapp: "5535998804845",
  whatsappExibicao: "(35) 99880-4845",
  email: "contato@solusono.com.br",
  instagram: { url: "https://www.instagram.com/solusono/", usuario: "@solusono" },

  endereco: {
    rua: "R. Nico Duarte, 204",
    bairro: "Jardim do Ginásio",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37701-507",
    mapsUrl: "https://maps.app.goo.gl/SjdrVGTe1TcT3xEd8",
    /** Endereço usado no mapa incorporado (carrega só ao clicar). */
    mapaBusca: "R. Nico Duarte, 204 - Jardim do Ginásio, Poços de Caldas - MG, 37701-507",
  },

  horarios: [
    { dia: 1, abre: "08:00", fecha: "18:00" },
    { dia: 2, abre: "08:00", fecha: "18:00" },
    { dia: 3, abre: "08:00", fecha: "18:00" },
    { dia: 4, abre: "08:00", fecha: "18:00" },
    { dia: 5, abre: "08:00", fecha: "18:00" },
    { dia: 6, abre: "", fecha: "" },
    { dia: 0, abre: "", fecha: "" },
  ] as Horario[],
  avisoHorarios: "Horários podem variar em feriados.",

  modalidades: ["Presencial", "Online"],

  mensagens: {
    geral: "Olá! Vi o site da SoluSono e gostaria de agendar uma avaliação.",
    servico: (assunto: string) => `Olá! Vi o site da SoluSono e gostaria de informações sobre ${assunto}.`,
    agendamento: "Olá! Vim pelo site da SoluSono e gostaria de solicitar um agendamento.",
  },

  servicos: [
    {
      id: "avaliacao",
      titulo: "Avaliação e exames",
      enfase: "exames",
      resumo: "O ponto de partida: entender como você respira enquanto dorme.",
      assuntoWhatsapp: "avaliação e polissonografia domiciliar",
      itens: [
        {
          nome: "Polissonografia domiciliar",
          texto:
            "Exame do sono feito em casa, com equipamento portátil. Registra dados da respiração durante a noite para apoiar a investigação de ronco e apneia.",
        },
        {
          nome: "Titulação com CPAP/BiPAP",
          texto:
            "Ajuste dos parâmetros do aparelho de pressão positiva, quando ele foi indicado, para encontrar a configuração adequada a cada pessoa.",
        },
      ],
    },
    {
      id: "adaptacao",
      titulo: "Adaptação e acompanhamento",
      enfase: "acompanhamento",
      resumo: "Para quem começou ou vai começar a usar CPAP e quer apoio nesse processo.",
      assuntoWhatsapp: "adaptação ao CPAP e teste de máscaras",
      itens: [
        {
          nome: "Avaliação e teste de máscaras",
          texto:
            "Experimentação de modelos e tamanhos de máscara, com orientação sobre encaixe e conforto no uso diário.",
        },
        {
          nome: "Protocolo de adaptação ao CPAP com acompanhamento",
          texto:
            "Etapas de adaptação ao aparelho com retornos programados, para acompanhar o uso e conversar sobre as dificuldades que aparecem no caminho.",
        },
      ],
    },
    {
      id: "domiciliar",
      titulo: "Atendimento domiciliar",
      enfase: "domiciliar",
      resumo: "Quando o cuidado precisa acontecer em casa.",
      assuntoWhatsapp: "suporte ventilatório e oxigenoterapia domiciliar",
      itens: [
        {
          nome: "Suporte ventilatório domiciliar",
          texto:
            "Acompanhamento de pessoas que usam ventilação em casa, com orientação ao paciente e à família sobre o equipamento.",
        },
        {
          nome: "Oxigenoterapia domiciliar",
          texto:
            "Orientação e acompanhamento do uso de oxigênio em casa, conforme a prescrição de cada paciente.",
        },
      ],
    },
    {
      id: "online",
      titulo: "Consulta online",
      enfase: "online",
      resumo: "Conversa e acompanhamento a distância, por videochamada.",
      assuntoWhatsapp: "consulta e acompanhamento online",
      itens: [
        {
          nome: "Consulta e acompanhamento online",
          texto:
            "Atendimento por vídeo para tirar dúvidas, revisar o uso do aparelho e seguir com o acompanhamento sem sair de casa.",
        },
      ],
    },
  ] as GrupoServicos[],

  /** Opções do campo "Atendimento desejado" do formulário. */
  atendimentos: [
    "Avaliação (ronco e apneia do sono)",
    "Polissonografia domiciliar",
    "Titulação com CPAP/BiPAP",
    "Suporte ventilatório e oxigenoterapia domiciliar",
    "Avaliação e teste de máscaras",
    "Consulta e acompanhamento online",
  ],
  agendamento: { exigirAtendimento: false, limiteObservacoes: 300 },

  /** Fotos reais do espaço. Lista vazia = a seção "O espaço" não aparece. */
  fotos: [
    { src: "/fotos/fachada.webp", alt: "Fachada da SoluSono, com o logotipo em um painel verde e a entrada pelo jardim", largura: 731, altura: 978, legenda: "Fachada" },
    { src: "/fotos/recepcao.webp", alt: "Recepção da SoluSono com balcão branco e o logotipo na parede", largura: 731, altura: 978, legenda: "Recepção" },
    { src: "/fotos/consultorio.webp", alt: "Consultório com mesa de madeira, cadeiras e estante iluminada", largura: 731, altura: 546, legenda: "Consultório" },
  ] as Foto[],

  /** Equipe: desligada até haver nome completo + registro no conselho + autorização. */
  mostrarEquipe: false,
  equipe: [] as Profissional[],

  secoes: {
    sono: true,
    servicos: true,
    modalidades: true,
    espaco: true,
    comoFunciona: true,
    equipe: true,
    duvidas: true,
    agendar: true,
    contato: true,
    ctaFinal: true,
  },
};

export type Config = typeof CONFIG;

/* ---------- utilidades ---------- */

export function linkWhatsapp(texto: string) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

const NOMES_DIA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/** Agrupa dias com o mesmo horário: "Segunda a sexta · 08h00 às 18h00". */
export function horariosResumo() {
  const ordem: Dia[] = [1, 2, 3, 4, 5, 6, 0];
  const linhas: { dias: string; horas: string }[] = [];
  let grupo: Horario[] = [];
  const fmt = (h: string) => h.replace(":", "h");
  const chave = (h: Horario) => `${h.abre}-${h.fecha}-${h.pausa?.inicio ?? ""}`;
  const fechar = () => {
    if (!grupo.length) return;
    const a = NOMES_DIA[grupo[0].dia];
    const b = NOMES_DIA[grupo[grupo.length - 1].dia].toLowerCase();
    const dias = grupo.length === 1 ? a : grupo.length === 2 ? `${a} e ${b}` : `${a} a ${b}`;
    const h = grupo[0];
    const horas = !h.abre
      ? "Fechado"
      : h.pausa
        ? `${fmt(h.abre)} às ${fmt(h.pausa.inicio)} e ${fmt(h.pausa.fim)} às ${fmt(h.fecha)}`
        : `${fmt(h.abre)} às ${fmt(h.fecha)}`;
    linhas.push({ dias, horas });
    grupo = [];
  };
  for (const d of ordem) {
    const h = CONFIG.horarios.find((x) => x.dia === d);
    if (!h) continue;
    if (grupo.length && chave(grupo[0]) !== chave(h)) fechar();
    grupo.push(h);
  }
  fechar();
  return linhas;
}

const min = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};

/** Blocos de 1 hora que terminam até o fechamento, fora da pausa. */
export function horariosDoDia(dia: Dia): string[] {
  const h = CONFIG.horarios.find((x) => x.dia === dia);
  if (!h || !h.abre) return [];
  const out: string[] = [];
  for (let t = min(h.abre); t + 60 <= min(h.fecha); t += 60) {
    if (h.pausa && t < min(h.pausa.fim) && t + 60 > min(h.pausa.inicio)) continue;
    out.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return out;
}

export function diaAberto(dia: number) {
  return horariosDoDia(dia as Dia).length > 0;
}

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};
