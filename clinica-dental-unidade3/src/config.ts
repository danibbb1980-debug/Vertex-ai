/*
  Todos os dados do site ficam aqui.
  Regra: campo vazio ("" ou []) = o bloco correspondente não aparece no site.
  Nada fora deste arquivo deve conter dados da clínica.
*/

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export type Horario = {
  dia: DiaSemana;
  abre: string; // "08:00"
  fecha: string; // "20:00"
  almoco?: { inicio: string; fim: string }; // omitido = sem intervalo informado
};

export type Atendimento = {
  id: string;
  nome: string;
  resumo: string;
  descricao: string;
};

export type Profissional = {
  nome: string;
  funcao: string; // ex.: "Cirurgiã-dentista"
  cro?: string;
  formacao?: string;
  foto?: string; // caminho em /public, ex.: "/img/equipe/nome.webp"
};

export type Foto = { src: string; alt: string; largura: number; altura: number };

export type Unidade = {
  id: string;
  ativa: boolean;
  nome: string; // "Unidade 3 · Santo Antônio"
  nomeCurto: string; // "Unidade 3"
  logo: string;
  logoAlt: string;
  endereco: {
    linha: string; // exibida no site (sem bairro, ver README)
    rua: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  whatsapp: string; // só dígitos, com 55
  telefoneExibicao: string;
  instagram: { url: string; usuario: string };
  maps: { link: string; consulta: string };
  horarios: Horario[];
  avisoHorarios: string;
  estrutura: string[];
  pagamentos: string[];
  responsavelTecnico: { nome: string; cro: string };
  profissionais: Profissional[];
  fotos: Foto[];
  inauguracao: string; // texto livre; vazio = não renderiza
  prontoSocorro: boolean;
};

export type Secoes = {
  clinica: boolean;
  marquee: boolean;
  atendimentos: boolean;
  quandoProcurar: boolean;
  comoFunciona: boolean;
  equipe: boolean;
  galeria: boolean;
  estrutura: boolean;
  faq: boolean;
  contato: boolean;
  agendamento: boolean;
  ctaFinal: boolean;
};

const HORARIOS_UNIDADE_3: Horario[] = [1, 2, 3, 4, 5].map((dia) => ({
  dia: dia as DiaSemana,
  abre: "08:00",
  fecha: "20:00",
}));

export const CONFIG = {
  rascunho: true,
  textoRascunho: "Rascunho para avaliação. Informações sujeitas a confirmação.",

  // URL pública absoluta (nunca localhost). Atualize após o deploy definitivo.
  siteUrl: "https://clinica-dental-unidade3-rascunho.vercel.app",

  marca: "Clínica Dental",
  cidade: "Pouso Alegre",
  uf: "MG",

  seo: {
    titulo: "Clínica Dental Unidade 3 | Dentista em Pouso Alegre - MG",
    descricao:
      "Clínico geral, implantes, ortodontia e estética com hora marcada em Pouso Alegre - MG. Agende sua avaliação pelo WhatsApp.",
    ogImagem: "", // vazio = sem og:image (só use uma imagem real, 1200×630)
  },

  secoes: {
    clinica: true,
    marquee: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    equipe: true, // só aparece se houver profissionais
    galeria: true, // só aparece se houver fotos
    estrutura: true,
    faq: true,
    contato: true,
    agendamento: true,
    ctaFinal: true,
  } satisfies Secoes,

  agendamento: {
    exigirAtendimento: false,
    limiteObservacoes: 300,
  },

  mensagens: {
    geral:
      "Olá! Vi o site da Clínica Dental (Unidade 3) e gostaria de agendar uma avaliação.",
    porAtendimento: (atendimento: string) =>
      `Olá! Vi o site da Clínica Dental (Unidade 3) e gostaria de informações sobre ${atendimento.toLowerCase()}.`,
  },

  atendimentos: [
    {
      id: "clinico-geral",
      nome: "Clínico geral",
      resumo: "Prevenção e cuidado do dia a dia.",
      descricao:
        "Consultas de rotina, prevenção e limpeza, com orientação para manter a saúde da boca em cada fase da vida. Costuma ser o ponto de partida do cuidado.",
    },
    {
      id: "implantes",
      nome: "Implantes",
      resumo: "Uma das alternativas para repor dentes.",
      descricao:
        "Os implantes são uma das opções para repor dentes perdidos. Antes de qualquer indicação, avaliamos a saúde da boca e, quando necessário, pedimos exames complementares.",
    },
    {
      id: "ortodontia",
      nome: "Ortodontia",
      resumo: "Alinhamento dos dentes e da mordida.",
      descricao:
        "Cuida do alinhamento dos dentes e da relação entre as arcadas. O tipo de aparelho e a frequência do acompanhamento são definidos depois da avaliação.",
    },
    {
      id: "estetica",
      nome: "Estética",
      resumo: "Cor, forma e harmonia do sorriso.",
      descricao:
        "Procedimentos voltados à cor, à forma e à harmonia do sorriso, sempre considerando a saúde de dentes e gengivas antes de qualquer proposta.",
    },
  ] satisfies Atendimento[] as Atendimento[],

  unidades: [
    {
      id: "unidade-3",
      ativa: true,
      nome: "Unidade 3 · Santo Antônio",
      nomeCurto: "Unidade 3",
      logo: "/img/logo-unidade3.jpg",
      logoAlt: "Clínica Dental, Unidade 3, Santo Antônio",
      endereco: {
        linha: "Praça Vereador José Custódio Ferreira, 80, Pouso Alegre - MG",
        rua: "Praça Vereador José Custódio Ferreira, 80",
        cidade: "Pouso Alegre",
        uf: "MG",
        cep: "37550-000",
      },
      whatsapp: "5535998269644",
      telefoneExibicao: "(35) 99826-9644",
      instagram: {
        url: "https://www.instagram.com/clinicadentalunidade3/",
        usuario: "@clinicadentalunidade3",
      },
      maps: {
        link: "https://maps.app.goo.gl/gGWvjGjckbNNRV7V9",
        consulta: "Praça Vereador José Custódio Ferreira, 80, Pouso Alegre - MG, 37550-000",
      },
      horarios: HORARIOS_UNIDADE_3,
      avisoHorarios: "Horários podem variar em feriados.",
      estrutura: ["Hora marcada recomendada", "Banheiro"],
      pagamentos: ["Cartão de crédito", "Cartão de débito", "Pagamento por aproximação"],
      responsavelTecnico: { nome: "", cro: "" },
      profissionais: [],
      fotos: [],
      inauguracao: "",
      prontoSocorro: false,
    },
  ] satisfies Unidade[] as Unidade[],
};

export const UNIDADES_ATIVAS = CONFIG.unidades.filter((u) => u.ativa);
