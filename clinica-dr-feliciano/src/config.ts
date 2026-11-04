// =============================================================================
// CONFIGURAÇÃO DO SITE · Clínica Dr. Feliciano (rascunho)
// Todo o conteúdo variável do site mora aqui. Regra: campo vazio ou ausente
// = o componente não aparece. Nada de placeholder na tela.
// =============================================================================

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Horario {
  dias: DiaSemana[];
  rotulo: string; // como aparece no site
  abre: string; // "09:00"
  fecha: string; // "18:00"
  almoco?: { inicio: string; fim: string }; // só se a clínica informar
}

export interface Atendimento {
  id: string;
  nome: string;
  resumo: string;
  icone: "canal" | "ortodontia" | "extracao" | "clareamento" | "implante" | "cirurgia" | "protese" | "toxina";
  aviso?: string; // frase extra obrigatória (ex.: toxina botulínica)
  restrito?: "toxina"; // controlado por CONFIG.mostrarToxina
}

export interface Profissional {
  nome: string;
  cro: string;
  formacao?: string;
  foto?: string;
}

export const CONFIG = {
  // Faixa de rascunho + noindex. Mudar para false só na publicação definitiva.
  rascunho: true,

  // URL pública (canonical, og:url, JSON-LD). Nunca localhost.
  siteUrl: "https://clinica-dr-feliciano-rascunho.vercel.app",

  nome: "Clínica Dr. Feliciano",
  nomeCurto: "Dr. Feliciano",
  descritor: "Odontologia",

  // ATENÇÃO: número recebido como "55 35 9984-5687". Foi acrescentado o 9 de
  // celular. Conferir com a clínica antes de publicar (ver README).
  whatsapp: "5535999845687",
  telefoneExibicao: "(35) 99984-5687",

  instagram: { url: "https://www.instagram.com/clinicadrfeliciano/", usuario: "@clinicadrfeliciano" },
  maps: "https://share.google/s8wsoVtY65ip3VB1t",

  endereco: {
    rua: "Av. Duque de Caxias, 112",
    bairro: "Centro",
    cidade: "Pouso Alegre",
    uf: "MG",
    cep: "37550-000",
  },

  horarios: [
    { dias: [1, 2, 3, 4, 5], rotulo: "Segunda a sexta", abre: "09:00", fecha: "18:00" },
    { dias: [6], rotulo: "Sábado", abre: "09:00", fecha: "12:00" },
  ] as Horario[],
  diasFechadosRotulo: "Domingo: fechado",
  avisoHorarios: "Os horários podem variar em feriados.",

  mostrarToxina: true, // só manter true com habilitação comprovada do profissional

  atendimentos: [
    {
      id: "canal",
      nome: "Tratamento de canal",
      icone: "canal",
      resumo:
        "Cuida da parte interna do dente quando a polpa está inflamada ou infectada. O objetivo é preservar o dente natural sempre que houver condições para isso.",
    },
    {
      id: "ortodontia",
      nome: "Aparelhos ortodônticos",
      icone: "ortodontia",
      resumo:
        "Acompanhamento do alinhamento dos dentes e da mordida ao longo do tempo. O tipo de aparelho e a duração variam de pessoa para pessoa.",
    },
    {
      id: "extracao",
      nome: "Extração",
      icone: "extracao",
      resumo:
        "Remoção de um dente quando outras alternativas não são indicadas, como em alguns casos de siso. Inclui orientações claras para os cuidados depois do procedimento.",
    },
    {
      id: "clareamento",
      nome: "Clareamento",
      icone: "clareamento",
      resumo:
        "Procedimento estético para tornar os dentes mais claros. A avaliação verifica se os dentes e a gengiva estão em condições de receber o tratamento.",
    },
    {
      id: "implante",
      nome: "Implante",
      icone: "implante",
      resumo:
        "Uma das alternativas para repor dentes perdidos, com uma base fixada no osso que recebe a parte visível do dente. Exige planejamento e exames prévios.",
    },
    {
      id: "cirurgia",
      nome: "Cirurgia",
      icone: "cirurgia",
      resumo:
        "Procedimentos cirúrgicos odontológicos realizados com planejamento prévio, orientações antes e depois e acompanhamento da recuperação.",
    },
    {
      id: "proteses",
      nome: "Próteses dentárias fixas e móveis",
      icone: "protese",
      resumo:
        "Reposição de dentes com peças fixas ou removíveis. A escolha considera a saúde da boca, a mastigação e a rotina de cada paciente.",
    },
    {
      id: "toxina",
      nome: "Toxina botulínica",
      icone: "toxina",
      restrito: "toxina",
      resumo:
        "Na odontologia, pode ser considerada em algumas situações relacionadas à musculatura da face. Conteúdo apenas informativo.",
      aviso: "Indicação e áreas de aplicação dependem de avaliação por cirurgião-dentista habilitado.",
    },
  ] as Atendimento[],

  // Estrutura confirmada na ficha do Google
  estrutura: {
    banheiroAcessivel: true,
    horaMarcada: true,
    pagamentos: ["Cartão de crédito", "Cartão de débito", "Pagamento por aproximação (NFC)"],
  },

  // Vazios hoje: nada aparece no site enquanto estiverem vazios.
  profissionais: [] as Profissional[],
  responsavelTecnico: "",
  cro: "",
  fotos: [] as { src: string; alt: string }[],

  agendamento: {
    exigirAtendimento: false,
    duracaoBlocoMin: 60,
    urgencia: false, // true apenas se a clínica fizer atendimento de urgência
  },

  mensagens: {
    geral: "Olá! Vi o site da Clínica Dr. Feliciano e gostaria de agendar uma avaliação.",
    atendimento: (nome: string) =>
      `Olá! Vi o site da Clínica Dr. Feliciano e gostaria de informações sobre ${nome.toLowerCase()}.`,
  },

  secoes: {
    clinica: true,
    atendimentos: true,
    quandoProcurar: true,
    comoFunciona: true,
    estrutura: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const atendimentosVisiveis = () =>
  CONFIG.atendimentos.filter((a) => a.restrito !== "toxina" || CONFIG.mostrarToxina);

export const waLink = (texto: string = CONFIG.mensagens.geral) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

export const enderecoCompleto = () => {
  const e = CONFIG.endereco;
  return `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`;
};

export const comoChegar = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enderecoCompleto())}`;
