/**
 * Todos os dados do site ficam aqui.
 * Regra: campo vazio ("") ou lista vazia ([]) = o bloco correspondente NÃO aparece.
 */

export type Foto = { src: string; alt: string; largura: number; altura: number; legenda?: string };

export type Horario = {
  dia: string;
  /** 0 = domingo ... 6 = sábado */
  diaSemana: number;
  abre: string; // "08:00" ou "" (fechado)
  fecha: string; // "18:00" ou "" (fechado)
};

export type Tratamento = { id: string; nome: string; descricao: string };

export type Profissional = {
  nome: string;
  profissao: string; // ex.: "Biomédica esteta" (vazio = não aparece)
  registro: string; // ex.: "CRBM nº 00000" (vazio = não aparece)
  fotos: Foto[];
};

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://clinic-sculpt-rascunho.vercel.app",

  nome: "Clinic Sculpt",
  descritor: "Estética Personalizada",
  nomeAlternativo: "Clínica Patrícia Caroline",
  /** Caminho do logo original (SVG/PNG em alta). Vazio = usa o logotipo recriado. */
  logo: "",

  whatsapp: "5535999438498",
  whatsappExibicao: "(35) 99943-8498",
  usarWhatsapp: true,
  telefoneFixo: "",
  email: "clinicsculptvga@gmail.com",
  instagram: {
    url: "https://www.instagram.com/clinicapatriciacaroline/",
    usuario: "@clinicapatriciacaroline",
  },

  endereco: {
    rua: "Rua Alberto Cabre",
    numero: "130",
    bairro: "Vila Pinto",
    cidade: "Varginha",
    uf: "MG",
    cep: "37010-630",
  },
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Alberto%20Cabre%2C%20130%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG",
  mapaEmbedUrl:
    "https://www.google.com/maps?q=R.%20Alberto%20Cabre%2C%20130%2C%20Vila%20Pinto%2C%20Varginha%20-%20MG%2C%2037010-630&output=embed",

  horarios: [
    { dia: "Segunda-feira", diaSemana: 1, abre: "08:00", fecha: "18:00" },
    { dia: "Terça-feira", diaSemana: 2, abre: "08:00", fecha: "18:00" },
    { dia: "Quarta-feira", diaSemana: 3, abre: "08:00", fecha: "18:00" },
    { dia: "Quinta-feira", diaSemana: 4, abre: "08:00", fecha: "18:00" },
    { dia: "Sexta-feira", diaSemana: 5, abre: "08:00", fecha: "18:00" },
    { dia: "Sábado", diaSemana: 6, abre: "09:00", fecha: "12:00" },
    { dia: "Domingo", diaSemana: 0, abre: "", fecha: "" },
  ] as Horario[],
  avisoHorarios: "Horários podem variar em feriados.",

  /** Para ampliar, acrescente itens: o índice e o formulário crescem sozinhos. */
  tratamentos: [
    {
      id: "toxina-botulinica",
      nome: "Toxina botulínica",
      descricao:
        "Procedimento injetável indicado somente após conversa e avaliação individual. Na consulta, você entende como ele funciona, quais cuidados envolve e se faz sentido para o seu caso.",
    },
    {
      id: "pele",
      nome: "Tratamentos para a pele",
      descricao:
        "Cuidados planejados a partir da avaliação da sua pele e da sua rotina. Cada etapa é explicada antes de começar, junto com os cuidados em casa.",
    },
    {
      id: "corporal",
      nome: "Estética corporal",
      descricao:
        "Tratamentos corporais definidos a partir da avaliação individual, com objetivos, cuidados e alternativas conversados com antecedência.",
    },
  ] as Tratamento[],

  profissionais: [
    {
      nome: "Patrícia Caroline Manoel",
      profissao: "",
      registro: "",
      fotos: [
        {
          src: "/fotos/profissional-1",
          alt: "Retrato de Patrícia Caroline Manoel sobre fundo escuro",
          largura: 1170,
          altura: 1452,
        },
        {
          src: "/fotos/profissional-2",
          alt: "Patrícia Caroline Manoel com as mãos entrelaçadas, em retrato sobre fundo escuro",
          largura: 1170,
          altura: 1452,
        },
      ],
    },
  ] as Profissional[],

  responsavelTecnico: { nome: "", registro: "" },

  /** Fotos do espaço. Lista vazia = a seção "O espaço" não aparece. */
  fotosEspaco: [
    {
      src: "/fotos/espaco-entrada",
      alt: "Entrada da Clinic Sculpt, com porta de vidro emoldurada em madeira e placa azul com o logotipo",
      largura: 1170,
      altura: 1532,
      legenda: "Entrada · Rua Alberto Cabre, 130",
    },
    {
      src: "/fotos/espaco-recepcao",
      alt: "Recepção com duas poltronas claras, aparador com café e água e plantas pendentes",
      largura: 1170,
      altura: 1532,
      legenda: "Recepção",
    },
    {
      src: "/fotos/espaco-sala",
      alt: "Sala de atendimento com mesa de conversa separada da maca por painel de ripas de madeira",
      largura: 1170,
      altura: 1532,
      legenda: "Sala de atendimento",
    },
  ] as Foto[],

  secoes: {
    atendimento: true,
    tratamentos: true,
    espaco: true,
    profissional: true,
    comoFunciona: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade} - ${e.uf}`;
};
