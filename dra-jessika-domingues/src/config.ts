/**
 * Todos os dados do site ficam aqui.
 * Itens marcados "CONFIRMAR COM A CLÍNICA" vieram do Google Maps ou do
 * Instagram e ainda precisam ser validados pela Dra. Jessika.
 */

export const CONFIG = {
  /** Faixa "Rascunho" + marcadores "a confirmar" visíveis. */
  rascunho: true,

  /** URL final do site (sem barra no fim). Usada em canonical e og:url. */
  siteUrl: "https://dra-jessika-domingues-rascunho.vercel.app",

  nome: "Dra. Jessika Domingues",
  nomeCurto: "Jessika Domingues",
  profissao: "Cirurgiã-Dentista",
  cro: "CRO-MG 48389", // CONFIRMAR COM A CLÍNICA
  /** Nome do consultório. null = ainda não informado. */
  nomeConsultorio: null as string | null, // CONFIRMAR COM A CLÍNICA

  /**
   * Especialidades citadas na bio do Instagram. Só ligue depois que a
   * doutora comprovar o registro de cada uma no CRO.
   */
  mostrarEspecialidades: false,
  especialidades: [
    "[ESPECIALIDADE REGISTRADA NO CRO, A CONFIRMAR]", // Odontopediatria
    "[ESPECIALIDADE REGISTRADA NO CRO, A CONFIRMAR]", // Ortopedia Funcional dos Maxilares
  ],
  /** Como descrever o trabalho enquanto as especialidades não forem confirmadas. */
  areasDeAtuacao: [
    "Odontologia para bebês, crianças e adolescentes",
    "Acompanhamento do crescimento e do desenvolvimento dos maxilares",
  ],

  /** Número no formato internacional, só dígitos. */
  whatsapp: "5535988940051",
  whatsappExibicao: "(35) 98894-0051",
  instagram: "https://www.instagram.com/drajessikadomingues/",
  instagramUsuario: "@drajessikadomingues",
  googleMaps: "https://maps.app.goo.gl/1SncwW4WSs4NgCDm6",

  endereco: {
    // CONFIRMAR COM A CLÍNICA (dados da ficha do Google)
    rua: "R. Gáspar Lopes, 124",
    bairro: "Parque das Nações",
    cidade: "Alfenas",
    uf: "MG",
    cep: "37130-153",
  },

  /** Horário regular (ficha do Google). CONFIRMAR COM A CLÍNICA, inclusive segunda-feira. */
  horarios: [
    { dias: "Segunda a sexta", horas: "08h às 18h" },
    { dias: "Sábado e domingo", horas: "Fechado" },
  ],
  observacaoHorarios: "Horários podem variar em feriados.",
  /** Para o JSON-LD. */
  horarioSchema: { dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "08:00", fecha: "18:00" },

  /** Avaliações do Google: só ligue com nota real e autorização. */
  mostrarNotaGoogle: false,
  notaGoogle: null as null | { nota: string; total: string },

  /** Liga/desliga cada seção da página. */
  secoes: {
    consultorio: true,
    marquee: true,
    atendimento: true,
    pais: true,
    primeiraConsulta: true,
    profissional: true,
    estrutura: true,
    avaliacoes: true, // só aparece se mostrarNotaGoogle = true
    duvidas: true,
    contato: true,
    ctaFinal: true,
  },

  /** O cartão sobre maxilares só aparece se ligado. CONFIRMAR se é oferecido. */
  mostrarCartaoMaxilares: true,

  fotos: {
    hero: {
      base: "/fotos/dra-jessika-retrato",
      larguras: [420, 650],
      largura: 650,
      altura: 810,
      alt: "Dra. Jessika Domingues sorrindo, de camisa e calça brancas, sentada em um banco claro",
    },
    perfil: {
      base: "/fotos/dra-jessika-perfil",
      larguras: [480, 760],
      largura: 760,
      altura: 1013,
      alt: "Dra. Jessika Domingues sorrindo, de colete e calça cor caramelo",
    },
  },
} as const;

export type Fase = "bebe" | "crianca" | "adolescente" | "maxilares" | "geral";

const MENSAGENS: Record<Fase, string> = {
  geral: "Olá! Vi o site da Dra. Jessika e gostaria de agendar uma avaliação para meu filho(a).",
  bebe: "Olá! Vi o site da Dra. Jessika e gostaria de agendar uma avaliação para o meu bebê.",
  crianca:
    "Olá! Vi o site da Dra. Jessika e gostaria de conversar sobre o atendimento para crianças e agendar uma avaliação para meu filho(a).",
  adolescente: "Olá! Vi o site da Dra. Jessika e gostaria de agendar uma avaliação para meu filho(a) adolescente.",
  maxilares:
    "Olá! Vi o site da Dra. Jessika e gostaria de saber mais sobre o acompanhamento do desenvolvimento dos maxilares.",
};

export function whatsappLink(fase: Fase = "geral") {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(MENSAGENS[fase])}`;
}

export const enderecoCompleto = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`;

export const comoChegarLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto)}`;

export const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(enderecoCompleto)}&output=embed`;

/** Descritor exibido: só usa o nome da especialidade se ela estiver confirmada. */
export const descritor = CONFIG.mostrarEspecialidades ? "Odontopediatria" : "Odontologia infantil";

export const tituloPagina = CONFIG.mostrarEspecialidades
  ? `${CONFIG.nome} | Odontopediatra em Alfenas - MG`
  : `${CONFIG.nome} | Dentista para crianças em Alfenas - MG`;

export const descricaoPagina =
  "Odontologia para bebês, crianças e adolescentes em Alfenas - MG, com acolhimento e explicações claras para a família. Agende uma avaliação pelo WhatsApp.";
