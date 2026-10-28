/**
 * INSTITUTO HARMONIZA — FONTE ÚNICA DE DADOS DO SITE
 *
 * Tudo o que aparece no site sai daqui. Para mudar um texto, um horário ou
 * ligar/desligar uma seção, edite só este arquivo e rode `npm run build`.
 *
 * Campos com `confirmado: false` aparecem no site com o selo "a confirmar".
 * Quando a clínica confirmar o dado, troque para `confirmado: true`.
 *
 * Fontes usadas: ficha do Google Maps e perfis do Instagram do instituto e dos
 * profissionais. Nada aqui foi inventado; o que não veio dessas fontes está
 * como placeholder visível.
 */

export type Dado<T = string> = { valor: T; confirmado: boolean };

export type Atendimento = {
  id: string;
  titulo: string;
  /** Palavra do título que vai em itálico. */
  destaque: string;
  descricao: string;
  /** Linha curta que aparece em "Para quem". */
  resumo: string;
  mensagemWhatsApp: string;
  /** CONFIRMAR COM A CLÍNICA: o Google lista, mas a clínica ainda não validou. */
  confirmado: boolean;
  ativo: boolean;
};

/** Foto em /public: `src` sem extensão (gera .avif e .webp); `menor` é a versão de 600 px para celular. */
export type Foto = {
  src: string;
  menor?: string;
  alt: string;
  largura: number;
  altura: number;
  /** Ponto focal para o recorte (CSS object-position). */
  foco?: string;
};

export type Profissional = {
  nome: string;
  titulo: "Cirurgiã-dentista" | "Cirurgião-dentista";
  /** Só o CRO. Não exibir registros de outros conselhos. */
  cro: Dado;
  /** Linha de atuação, sem "especialista" (só com especialidade registrada no CFO). */
  atuacao: string | null;
  /** "Formação: ..." só depois que a clínica comprovar. Sem marca de universidade em destaque. */
  formacao: Dado | null;
  instagram: string;
  instagramUsuario: string;
  /** Caminho sem extensão em /public (gera .avif e .webp). null = iniciais. */
  foto: string | null;
  iniciais: string;
};

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" no topo + aviso no build. */
  rascunho: true,

  /** URL pública final (sem barra no fim). Usada em canonical, og:url, og:image e JSON-LD. */
  siteUrl: "https://instituto-harmoniza-rascunho.vercel.app",

  nome: "Instituto Harmoniza",
  descritor: "Odontologia e Harmonização Orofacial",

  /** Liga/desliga cada seção da página. */
  secoes: {
    hero: true,
    instituto: true,
    atendimentos: true,
    faixaAreas: true,
    paraQuem: true,
    comoFunciona: true,
    profissionais: true,
    estrutura: true,
    avaliacoesGoogle: false, // CONFIG.mostrarNotaGoogle também precisa estar true
    duvidas: true,
    contato: true,
    ctaFinal: true,
  },

  /** Efeitos de movimento (todos respeitam prefers-reduced-motion). */
  movimento: {
    curvaAssinatura: true,
    rolagemSuave: true,
    botaoMagnetico: true,
  },

  // ───────────────────────── Contato ─────────────────────────
  whatsapp: "5535999050404",
  telefoneExibicao: "(35) 99905-0404",
  /** Telefone igual ao WhatsApp, salvo indicação contrária da clínica. */
  telefone: "+55 35 99905-0404",
  mensagemWhatsAppGeral:
    "Olá! Vi o site do Instituto Harmoniza e gostaria de agendar uma avaliação.",

  instagram: "https://www.instagram.com/institutoharmoniza_/",
  instagramUsuario: "@institutoharmoniza_",
  googleMaps: "https://maps.app.goo.gl/YA3mu7nT62MLJt897",

  /** Fonte: ficha do Google Maps do instituto. */
  cidade: { valor: "Alfenas - MG", confirmado: true } as Dado,
  /** Fonte: ficha do Google Maps do instituto. */
  endereco: { valor: "Av. Gov. Valadares, 252 - Centro, Alfenas - MG, 37130-029", confirmado: true } as Dado,
  /** Mesmo endereço em partes (exibição em duas linhas e dados estruturados para o Google). */
  enderecoPartes: {
    rua: "Av. Gov. Valadares, 252",
    bairro: "Centro",
    cidade: "Alfenas",
    uf: "MG",
    cep: "37130-029",
  },
  /**
   * URL de incorporação do Google Maps. O mapa só carrega quando o visitante clica
   * (sem cookies do Google antes disso). Vazio = sem mapa, só o botão "Como chegar".
   */
  mapaEmbedUrl:
    "https://www.google.com/maps?q=Av.%20Gov.%20Valadares%2C%20252%20-%20Centro%2C%20Alfenas%20-%20MG%2C%2037130-029&output=embed",

  /** CONFIRMAR COM A CLÍNICA: horários da ficha do Google. */
  horarios: {
    confirmado: false,
    linhas: [
      { dias: "Segunda a sexta", horas: "08h às 19h", curto: "08–19h" },
      { dias: "Sábado", horas: "08h às 12h", curto: "08–12h" },
      { dias: "Domingo", horas: "Fechado", curto: "—" },
    ],
    observacao: "Horários podem variar em feriados.",
  },

  comodidades: {
    /** Listado na ficha do Google. */
    estacionamento: true,
  },

  // ───────────────────────── Avaliações do Google ─────────────────────────
  /** Decidir com a clínica. Sem texto de depoimentos; só nota e link. */
  mostrarNotaGoogle: false,
  notaGoogle: { nota: "", totalAvaliacoes: "" },

  // ───────────────────────── Responsável técnico ─────────────────────────
  /** CONFIRMAR COM A CLÍNICA: obrigatório na versão final. */
  responsavelTecnico: {
    nome: { valor: "[RESPONSÁVEL TÉCNICO A CONFIRMAR]", confirmado: false } as Dado,
    cro: { valor: "CRO [A CONFIRMAR]", confirmado: false } as Dado,
  },

  mostrarAnosDeExperiencia: false,

  // ───────────────────────── Atendimentos ─────────────────────────
  atendimentos: [
    {
      id: "estetica",
      titulo: "Odontologia estética",
      destaque: "estética",
      descricao:
        "Cuidados voltados à aparência do sorriso, como cor, forma e proporção dos dentes, sempre tendo a saúde bucal como ponto de partida. As possibilidades são conversadas na avaliação, caso a caso.",
      resumo: "Para quem deseja entender as possibilidades para o próprio sorriso, com orientação franca.",
      mensagemWhatsApp:
        "Olá! Vi o site do Instituto Harmoniza e gostaria de conversar sobre odontologia estética.",
      confirmado: false, // CONFIRMAR COM A CLÍNICA
      ativo: true,
    },
    {
      id: "pediatrico",
      titulo: "Atendimento pediátrico",
      destaque: "pediátrico",
      descricao:
        "Atendimento odontológico para crianças, com acolhimento e uma linguagem adequada a cada idade. Os responsáveis acompanham a consulta e recebem orientações para o cuidado em casa.",
      resumo: "Para pais que procuram um ambiente acolhedor para o cuidado dos filhos.",
      mensagemWhatsApp:
        "Olá! Vi o site do Instituto Harmoniza e gostaria de conversar sobre o atendimento pediátrico.",
      confirmado: false, // CONFIRMAR COM A CLÍNICA
      ativo: true,
    },
    {
      id: "sedacao",
      titulo: "Sedação odontológica",
      destaque: "Sedação",
      descricao:
        "Recurso que pode ser indicado para tornar o atendimento mais tranquilo em situações específicas. A indicação é feita conforme avaliação e protocolos de segurança, e explicada com clareza antes de qualquer decisão.",
      resumo: "Para quem precisa de um cuidado mais tranquilo, sempre conforme avaliação.",
      mensagemWhatsApp:
        "Olá! Vi o site do Instituto Harmoniza e gostaria de conversar sobre sedação odontológica.",
      confirmado: false, // CONFIRMAR COM A CLÍNICA
      ativo: true,
    },
    {
      id: "harmonizacao",
      titulo: "Harmonização orofacial",
      destaque: "Harmonização",
      descricao:
        "Área da odontologia dedicada ao equilíbrio entre as estruturas da face e do sorriso. Qualquer indicação depende de avaliação individual, com expectativas conversadas com transparência.",
      resumo: "Para quem quer conversar sobre equilíbrio facial com informação e sem pressa.",
      mensagemWhatsApp:
        "Olá! Vi o site do Instituto Harmoniza e gostaria de conversar sobre harmonização orofacial.",
      confirmado: false, // CONFIRMAR COM A CLÍNICA se é oferecida pelo instituto e por quem
      ativo: true,
    },
  ] as Atendimento[],

  // ───────────────────────── Profissionais ─────────────────────────
  profissionais: [
    {
      nome: "Dra. Poly Anderson",
      titulo: "Cirurgiã-dentista",
      cro: { valor: "CRO-MG 48027", confirmado: false }, // CONFIRMAR COM A CLÍNICA
      atuacao: "Atua com harmonização orofacial",
      formacao: null, // "Formação: [A CONFIRMAR]" só após comprovação
      instagram: "https://www.instagram.com/dra.polianymra/",
      instagramUsuario: "@dra.polianymra",
      foto: "/fotos/dra-poly-anderson",
      iniciais: "PA",
    },
    {
      nome: "Dr. João Ricardo",
      titulo: "Cirurgião-dentista",
      cro: { valor: "CRO [A CONFIRMAR]", confirmado: false }, // CONFIRMAR COM A CLÍNICA
      atuacao: null,
      formacao: null,
      instagram: "https://www.instagram.com/joaoridentista/",
      instagramUsuario: "@joaoridentista",
      foto: "/fotos/dr-joao-ricardo",
      iniciais: "JR",
    },
  ] as Profissional[],

  // ───────────────────────── Imagens ─────────────────────────
  /**
   * Fotos do espaço. null = composição gráfica / bloco reservado.
   * Origem atual: capturas da ficha do Google Maps (recepção e sala de espera foram
   * publicadas por visitantes). CONFIRMAR COM A CLÍNICA o uso, ou trocar por fotos próprias.
   */
  fotos: {
    hero: {
      src: "/fotos/instituto-recepcao",
      menor: "/fotos/instituto-recepcao-600",
      alt: "Recepção do Instituto Harmoniza: balcão em mármore e madeira, piso claro e um balanço decorado com flores",
      largura: 1000,
      altura: 1310,
      foco: "40% 50%",
    } as Foto | null,
    estrutura: {
      src: "/fotos/instituto-sala-de-espera",
      menor: "/fotos/instituto-sala-de-espera-600",
      alt: "Sala de espera do Instituto Harmoniza, com sofá, quadros e um balanço decorado com orquídeas",
      largura: 900,
      altura: 1315,
      foco: "60% 45%",
    } as Foto | null,
    contato: {
      src: "/fotos/instituto-fachada",
      alt: "Fachada do Instituto Harmoniza à noite, com o logotipo iluminado e a sala de espera vista pela vitrine",
      largura: 640,
      altura: 673,
      foco: "50% 18%",
    } as Foto | null,
  },
  logo: "/marca/logo-instituto-harmoniza",
  /** Imagem de compartilhamento (1200×630). Vazio = sem og:image. */
  ogImage: "/marca/og-instituto-harmoniza.png",
} as const;

export type Config = typeof CONFIG;
