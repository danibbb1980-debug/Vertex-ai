/**
 * CONFIG — fonte única de TODOS os dados do site.
 *
 * Fontes: ficha do Google Maps e perfis do Instagram (out/2026).
 * Tudo marcado "CONFIRMAR COM A CLÍNICA" precisa de validação antes de
 * desligar o modo rascunho (CONFIG.rascunho = false).
 *
 * Ligar/desligar profissionais: mostrarAline / mostrarJosiane.
 * Com só uma ligada, o site vira automaticamente o site individual dela.
 */

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Faixa {
  inicio: string; // "09:00"
  fim: string; // "11:30"
}

export interface Atendimento {
  id: string;
  titulo: string;
  descricao: string;
  /** false = exemplo/placeholder: aparece marcado no site e NÃO entra no formulário */
  confirmado: boolean;
}

export interface Profissional {
  id: "aline" | "josiane";
  nome: string;
  nomeCurto: string;
  titulo: string;
  cro: string;
  consultorio: string;
  apelido?: string;
  instagram: string;
  instagramUser: string;
  whatsapp: string;
  whatsappExibicao: string;
  mensagemWhatsApp: string;
  publico: string;
  foto: { base: string; larguras: number[]; alt: string; proporcao: string };
  logo: { src: string; alt: string; largura: number; altura: number };
  atendimentos: Atendimento[];
}

/**
 * Cenário de teste (só para validar os 3 modos em build local):
 *   VITE_CENARIO=aline npm run build   |   VITE_CENARIO=josiane npm run build
 * Em produção, use as flags abaixo.
 */
const cenario: string | undefined =
  (typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string> }).env?.VITE_CENARIO) ||
  (typeof process !== "undefined" ? process.env.VITE_CENARIO : undefined);

const aline: Profissional = {
  id: "aline",
  nome: "Dra. Aline Maciel",
  nomeCurto: "Dra. Aline",
  titulo: "Cirurgiã-Dentista",
  // CONFIRMAR COM A CLÍNICA: número do CRO-MG não informado
  cro: "CRO-MG [A CONFIRMAR]",
  consultorio: "Odonto Baixinhos",
  apelido: "Tia Aline",
  instagram: "https://www.instagram.com/odontobaixinhos.tialine/",
  instagramUser: "@odontobaixinhos.tialine",
  whatsapp: "5535988251774",
  whatsappExibicao: "(35) 98825-1774",
  mensagemWhatsApp: "Olá! Vi o site e gostaria de agendar uma avaliação para meu filho(a).",
  // CONFIRMAR COM A CLÍNICA: faixa etária exata (texto da doutora: dos primeiros dias de vida aos 12 anos)
  publico: "Bebês, crianças, pessoas com deficiência e gestantes",
  foto: {
    base: "/img/dra-aline",
    larguras: [320, 480, 640, 900],
    // CONFIRMAR COM A CLÍNICA: autorização de uso de imagem
    alt: "Retrato da Dra. Aline Maciel, sorrindo, com jaleco estampado",
    proporcao: "4 / 5",
  },
  logo: { src: "/img/logo-odonto-baixinhos.webp", alt: "Logotipo Odonto Baixinhos", largura: 360, altura: 267 },
  // Atendimento por fase (bio do Instagram). CONFIRMAR COM A CLÍNICA o público de cada fase.
  atendimentos: [
    {
      id: "bebes",
      titulo: "Bebês",
      descricao:
        "Desde os primeiros dias de vida: orientação aos pais sobre os cuidados com a boca do bebê e a chegada dos primeiros dentes.",
      confirmado: true,
    },
    {
      id: "criancas",
      titulo: "Crianças",
      descricao:
        "Consultas de acompanhamento e prevenção, com cada etapa explicada à criança e aos pais, numa linguagem que ela entende.",
      confirmado: true,
    },
    {
      id: "pne",
      titulo: "Pessoas com necessidades especiais",
      descricao:
        "Crianças atípicas e pessoas com deficiência, com tempo e adaptações combinados com a família a cada consulta.",
      confirmado: true,
    },
    {
      id: "gestantes",
      titulo: "Gestantes",
      descricao:
        "Cuidado com a saúde bucal durante a gestação e orientação sobre os primeiros cuidados com a boca do bebê.",
      confirmado: true,
    },
  ],
};

const josiane: Profissional = {
  id: "josiane",
  nome: "Dra. Josiane Silva",
  nomeCurto: "Dra. Josiane",
  titulo: "Cirurgiã-Dentista",
  // CONFIRMAR COM A CLÍNICA: número do CRO-MG não informado
  cro: "CRO-MG [A CONFIRMAR]",
  consultorio: "Consultório Odontológico",
  instagram: "https://www.instagram.com/drajosianesilva/",
  instagramUser: "@drajosianesilva",
  // CONFIRMAR COM A CLÍNICA: a bio usa este fixo como WhatsApp; confirmar que recebe mensagens
  whatsapp: "553532925761",
  whatsappExibicao: "(35) 3292-5761",
  mensagemWhatsApp: "Olá! Vi o site e gostaria de agendar uma avaliação.",
  publico: "Adultos",
  foto: {
    base: "/img/dra-josiane",
    larguras: [320, 480, 640, 809],
    // CONFIRMAR COM A CLÍNICA: autorização de uso de imagem
    alt: "Retrato da Dra. Josiane Silva no consultório, de óculos e jaleco azul-claro com detalhes dourados",
    proporcao: "4 / 5",
  },
  logo: { src: "/img/logo-dra-josiane.webp", alt: "Logotipo Dra. Josiane Silva, Cirurgiã-Dentista", largura: 360, altura: 180 },
  // CONFIRMAR COM A CLÍNICA: atendimentos NÃO foram informados. Itens com confirmado:false
  // aparecem marcados como exemplo e não entram no formulário de agendamento.
  atendimentos: [
    {
      id: "geral",
      titulo: "Odontologia geral",
      descricao: "Cuidado individualizado, com avaliação e plano explicado em detalhes. [A CONFIRMAR COM A CLÍNICA]",
      confirmado: false,
    },
    {
      id: "prevencao",
      titulo: "Prevenção e acompanhamento",
      descricao: "[A CONFIRMAR COM A CLÍNICA] Descrição do atendimento.",
      confirmado: false,
    },
    {
      id: "atendimento-3",
      titulo: "[Atendimento 3]",
      descricao: "[A CONFIRMAR COM A CLÍNICA] Descrição do atendimento.",
      confirmado: false,
    },
    {
      id: "atendimento-4",
      titulo: "[Atendimento 4]",
      descricao: "[A CONFIRMAR COM A CLÍNICA] Descrição do atendimento.",
      confirmado: false,
    },
  ],
};

export const CONFIG = {
  /** Faixa "Rascunho" + noindex. Desligue só depois de confirmar tudo. */
  rascunho: true,
  /** URL pública final (sem barra no fim). Atualize após o deploy. */
  siteUrl: "https://odonto-baixinhos-josiane-rascunho.vercel.app",

  mostrarAline: cenario ? cenario === "aline" || cenario === "ambas" : true,
  mostrarJosiane: cenario ? cenario === "josiane" || cenario === "ambas" : true,

  /** Especialidade só aparece se registrada no CRO. */
  mostrarEspecialidades: false,
  especialidadeAline: "[ESPECIALIDADE REGISTRADA NO CRO, A CONFIRMAR]",
  /** "Cirurgiã-dentista desde 2013" (Dra. Josiane): aguardando confirmação. */
  mostrarAnosDeFormada: false,
  anoFormaturaJosiane: 2013,
  /** Informações pessoais das bios: não usar sem autorização. */
  mostrarPerfilPessoal: false,
  /** Nota do Google: só com avaliações reais verificadas. */
  mostrarNotaGoogle: false,
  notaGoogle: { nota: 0, total: 0 },

  profissionais: { aline, josiane },
  sedacaoAline: {
    // Ativar SOMENTE com a habilitação em Sedação Consciente comprovada.
    mostrar: false,
    texto:
      "Sedação consciente, quando indicada, conforme avaliação individual e protocolos de segurança.",
  },

  endereco: {
    // CONFIRMAR COM A CLÍNICA (ficha do Google)
    rua: "Av. Afonso Pena, 997",
    bairro: "Centro",
    cidade: "Alfenas",
    uf: "MG",
    cep: "37130-023",
    pais: "BR",
    mapsUrl: "https://maps.app.goo.gl/Lk8wSW4wzsDTweEt5",
    mapsEmbed:
      "https://www.google.com/maps?q=Av.+Afonso+Pena,+997+-+Centro,+Alfenas+-+MG,+37130-023&output=embed",
  },

  /** CONFIRMAR POR PROFISSIONAL: a ficha do Google é única para o endereço. */
  horarios: {
    1: [{ inicio: "09:00", fim: "11:30" }, { inicio: "13:30", fim: "18:00" }],
    2: [{ inicio: "09:00", fim: "11:30" }, { inicio: "13:30", fim: "18:00" }],
    3: [{ inicio: "09:00", fim: "11:30" }, { inicio: "13:30", fim: "18:00" }],
    4: [{ inicio: "09:00", fim: "11:30" }, { inicio: "13:30", fim: "18:00" }],
    5: [{ inicio: "09:00", fim: "11:30" }, { inicio: "13:30", fim: "18:00" }],
    6: [],
    0: [],
  } as Record<DiaSemana, Faixa[]>,
  observacaoHorarios: "Horários podem variar em feriados.",

  /** CONFIRMAR COM A CLÍNICA (ficha do Google) */
  estrutura: {
    horaMarcada: true,
    acessibilidade: ["Entrada acessível para cadeirantes", "Assento acessível", "Banheiro acessível", "Estacionamento acessível"],
    banheiro: true,
    pagamentos: ["cartão de crédito", "cartão de débito", "pagamento por aproximação (NFC)"],
  },

  agendamento: {
    exigirAtendimento: false,
    duracaoBlocoMin: 60,
    limiteObservacoes: 300,
    /** Só para pronto-socorro: mostra o aviso de urgência acima do formulário. */
    urgencia: false,
  },

  /** Seções da página (desligue com false). */
  secoes: {
    marquee: true,
    aline: true,
    paraOsPais: true,
    josiane: true,
    comoFunciona: true,
    estrutura: true,
    avaliacoes: true, // só aparece se mostrarNotaGoogle = true
    duvidas: true,
    agendar: true,
    contato: true,
    ctaFinal: true,
  },
} as const;

export type Config = typeof CONFIG;

/** Profissionais ativas, na ordem de exibição. */
export function profissionaisAtivas(): Profissional[] {
  const lista: Profissional[] = [];
  if (CONFIG.mostrarAline) lista.push(CONFIG.profissionais.aline);
  if (CONFIG.mostrarJosiane) lista.push(CONFIG.profissionais.josiane);
  return lista;
}

export type Modo = "ambas" | "aline" | "josiane";
export function modoAtual(): Modo {
  if (CONFIG.mostrarAline && CONFIG.mostrarJosiane) return "ambas";
  return CONFIG.mostrarAline ? "aline" : "josiane";
}

export function linkWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export const enderecoCompleto = `${CONFIG.endereco.rua} - ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, ${CONFIG.endereco.cep}`;

/** "Cartão de crédito, cartão de débito e pagamento por aproximação (NFC)" */
export function listaPagamentos(): string {
  const l = [...CONFIG.estrutura.pagamentos];
  const t = l.length > 1 ? `${l.slice(0, -1).join(", ")} e ${l[l.length - 1]}` : l.join("");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
