// Todos os dados do site ficam aqui. Campo vazio ("" ou []) = o bloco não aparece.

export type Atendimento = { id: string; nome: string; descricao: string };
export type Caso = { id: string; nome: string; antes: string; depois: string; alt: string };
export type Foto = { src: string; alt: string; legenda: string };

export const CONFIG = {
  rascunho: true,
  siteUrl: "https://dr-filipe-vaneli-rascunho.vercel.app",

  nome: "Dr. Filipe Vaneli",
  profissao: "Médico",
  registro: "CRMMG 109352",

  logo: "", // caminho de um arquivo de logo definitivo; vazio = usa o logotipo SVG criado a partir do nome

  profissionais: [
    {
      nome: "Dr. Filipe Vaneli",
      profissao: "Médico",
      registro: "CRMMG 109352",
      rqe: "",
      especialidade: "",
      foto: { src: "/img/medico.webp", alt: "Dr. Filipe Vaneli sentado à mesa do consultório, segurando um tablet" },
    },
  ],
  responsavelTecnico: { nome: "", registro: "" },

  endereco: {
    rua: "Rua Domingos Vieira de Lima, nº 380",
    bairro: "Centro",
    cidade: "Santana da Vargem",
    uf: "MG",
    cep: "37195-000",
  },
  regiao: "Três Pontas e região",
  rotaUrl:
    "https://www.google.com/maps/dir/?api=1&destination=R.%20Domingos%20Vieira%20de%20Lima%2C%20380%2C%20Centro%2C%20Santana%20da%20Vargem%20-%20MG",
  mapaEmbed:
    "https://www.google.com/maps?q=R.%20Domingos%20Vieira%20de%20Lima%2C%20380%2C%20Centro%2C%20Santana%20da%20Vargem%20-%20MG&output=embed",

  usarWhatsapp: true,
  whatsapp: "5535998038161",
  whatsappVisivel: "(35) 99803-8161",
  instagram: "https://www.instagram.com/dr.filipevaneli/",

  // dia: 0 = domingo ... 6 = sábado. abre/fecha em horas inteiras; null = fechado
  horarios: [
    { dia: 1, rotulo: "Segunda-feira", abre: 9, fecha: 18 },
    { dia: 2, rotulo: "Terça-feira", abre: 9, fecha: 18 },
    { dia: 3, rotulo: "Quarta-feira", abre: 9, fecha: 18 },
    { dia: 4, rotulo: "Quinta-feira", abre: 9, fecha: 18 },
    { dia: 5, rotulo: "Sexta-feira", abre: 9, fecha: 18 },
    { dia: 6, rotulo: "Sábado", abre: 9, fecha: 12 },
    { dia: 0, rotulo: "Domingo", abre: null, fecha: null },
  ] as { dia: number; rotulo: string; abre: number | null; fecha: number | null }[],

  atendimentos: [
    {
      id: "avaliacao",
      nome: "Avaliação facial",
      descricao:
        "Consulta para ouvir o que você procura, examinar o rosto e conversar sobre o que é indicado, ou não, para o seu caso.",
    },
    {
      id: "toxina",
      nome: "Botox masculino",
      descricao:
        "Aplicação voltada às linhas de expressão, pensada para o rosto masculino. Dose e pontos são definidos na avaliação.",
    },
    {
      id: "harmonizacao",
      nome: "Harmonização masculina",
      descricao:
        "Planejamento do contorno do rosto masculino, como mandíbula e queixo, a partir das proporções de cada pessoa.",
    },
    {
      id: "rinomodelacao",
      nome: "Rinomodelação",
      descricao: "Atendimento voltado ao contorno do nariz, sem cirurgia. A possibilidade é definida na avaliação.",
    },
    {
      id: "perfiloplastia",
      nome: "Perfiloplastia",
      descricao: "Planejamento do perfil do rosto como um conjunto: nariz, lábios, queixo e mandíbula.",
    },
    {
      id: "labial",
      nome: "Preenchimento labial",
      descricao: "Atendimento voltado ao contorno e ao volume dos lábios, de acordo com as proporções de cada rosto.",
    },
  ] as Atendimento[],

  // Antes e depois: imagens publicadas pelo próprio médico. Confirmar autorização dos pacientes antes de publicar.
  casos: [
    { id: "toxina", nome: "Botox masculino", antes: "/img/toxina-antes.webp", depois: "/img/toxina-depois.webp", alt: "rosto de frente, testa" },
    { id: "rinomodelacao", nome: "Rinomodelação", antes: "/img/rinomodelacao-antes.webp", depois: "/img/rinomodelacao-depois.webp", alt: "perfil do nariz" },
    { id: "harmonizacao", nome: "Harmonização masculina", antes: "/img/harmonizacao-antes.webp", depois: "/img/harmonizacao-depois.webp", alt: "perfil masculino, mandíbula e queixo" },
    { id: "perfiloplastia", nome: "Perfiloplastia", antes: "/img/perfiloplastia-antes.webp", depois: "/img/perfiloplastia-depois.webp", alt: "perfil completo do rosto" },
    { id: "labial", nome: "Preenchimento labial", antes: "/img/labial-antes.webp", depois: "/img/labial-depois.webp", alt: "lábios em três quartos" },
  ] as Caso[],

  consultorio: [
    { src: "/img/recepcao.webp", alt: "Recepção com poltronas cinza, balcão iluminado e painel de madeira", legenda: "Recepção" },
    { src: "/img/consultorio.webp", alt: "Mesa de atendimento com duas cadeiras, prateleiras e luminária", legenda: "Consultório" },
    { src: "/img/sala.webp", alt: "Sala de procedimentos com maca e espelho iluminado", legenda: "Sala de procedimentos" },
  ] as Foto[],

  secoes: {
    avaliacao: true,
    atendimento: true,
    casos: true,
    medico: true,
    comoFunciona: true,
    duvidas: true,
    local: true,
    agendar: true,
    ctaFinal: true,
  },
};

export const MSG_GERAL = `Olá! Vi o site do ${CONFIG.nome} e gostaria de agendar uma avaliação.`;
export const msgAtendimento = (a: string) =>
  `Olá! Vi o site do ${CONFIG.nome} e gostaria de agendar uma avaliação sobre ${a.toLowerCase()}.`;
export const waUrl = (msg = MSG_GERAL) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
export const enderecoLinha = () => {
  const e = CONFIG.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;
};
