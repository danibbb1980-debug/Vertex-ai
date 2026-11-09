/**
 * Todos os dados do site ficam aqui. Edite este arquivo e rode `npm run build`.
 * Regra: campo vazio ("") faz o bloco correspondente sumir do site.
 */

export const CONFIG = {
  /** Faixa "Rascunho para avaliação" + noindex. Ver README para desligar tudo. */
  rascunho: true,

  /** URL pública, sem barra no final. Usada em canonical, og:url e JSON-LD. */
  siteUrl: "https://diego-silva-advocacia-rascunho.vercel.app",

  nomeEscritorio: "Diego Silva Advocacia & Consultoria Jurídica",
  marca: "Diego Silva",
  submarca: "Advocacia & Consultoria Jurídica",

  /** Número exibido e usado em todos os botões (só dígitos, com 55 + DDD). */
  whatsapp: "5535998569709",
  whatsappExibicao: "(35) 99856-9709",

  instagram: {
    usuario: "@diego_silva_advocacia",
    url: "https://www.instagram.com/diego_silva_advocacia",
  },

  /** Ficha do Google (botão "Como chegar"). */
  mapsUrl: "https://share.google/5prBE9a1NKuZ65fjH",
  /** Busca do endereço no Google Maps (link "Ver no Google Maps"). Sem notas ou avaliações no site. */
  maps: "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("R. Vinte de Janeiro, 7, Jardim América, Poços de Caldas - MG, 37704-365"),
  endereco: {
    rua: "R. Vinte de Janeiro, 7",
    bairro: "Jardim América",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37704-365",
  },

  horarios: [
    { dias: "Segunda a sexta", horas: "09h às 18h" },
    { dias: "Sábado e domingo", horas: "Fechado" },
  ],
  avisoHorario: "Horários podem variar em feriados.",

  /**
   * Bloco "O advogado": só aparece com `oab` preenchido no formato "OAB/UF número".
   * OAB e formação confirmadas pelo advogado.
   */
  advogado: {
    /** Usado no rodapé ("Diego Silva · OAB"). No bloco do advogado aparece com o tratamento. */
    nome: "Diego Silva",
    tratamento: "Dr.",
    oab: "OAB/MG 210.925",
    formacao: [
      "Bacharel em Direito, PUC/MG",
      "Pós-graduação em Direito e Processo do Trabalho, PUC/RS",
      "Pós-graduação em Advocacia Cível, ESA",
    ] as string[],
    /** Parágrafo do subbloco "O advogado" (texto fornecido pelo advogado). */
    texto:
      "Fundado pelo Dr. Diego Silva, bacharel em Direito pela PUC/MG, com pós-graduação em Direito e Processo do Trabalho pela PUC/RS e em Advocacia Cível pela ESA, o escritório foi construído sobre uma base de conhecimento técnico e de respeito por quem nos procura.",
  },

  /**
   * Seção "O escritório" (menu: "Sobre"), texto fornecido pelo advogado (ajustado ao Provimento 205/2021).
   * Com `mostrarTempoEscritorio: false`, a abertura começa sem a frase do tempo.
   */
  mostrarTempoEscritorio: true,
  tempoEscritorio: "Há mais de meia década",
  sobre: {
    abertura:
      "nascemos com um propósito claro: transformar a relação entre o cliente e a justiça por meio de uma advocacia técnica e, acima de tudo, humana.",
    paragrafos: [
      "Sediados em Poços de Caldas/MG, atuamos em todo o território nacional, independentemente de onde você esteja.",
      "Acreditamos que cada cliente traz uma história única, e é com escuta atenta, acolhimento e humanização que conduzimos cada caso.",
    ],
    /** Fecha o último parágrafo, com leve destaque. */
    fecho: "Aqui, você não é um número de processo.",
    valores: [
      "Ética em cada passo",
      "Transparência na comunicação",
      "Compromisso com cada caso",
      "Empatia no atendimento",
      "Sigilo e confiança acima de tudo",
    ],
  },

  /** Retrato (pasta public/). Vazio = composição tipográfica com o emblema. */
  foto: {
    src: "/img/retrato-800.jpg",
    webp480: "/img/retrato-480.webp",
    webp800: "/img/retrato-800.webp",
    alt: "Diego Silva, de terno azul e braços cruzados, no escritório.",
    largura: 800,
    altura: 999,
  } as { src: string; webp480: string; webp800: string; alt: string; largura: number; altura: number } | null,
} as const;

export type Area = {
  num: string;
  titulo: string;
  curto: string;
  doQueSeTrata: string;
  comoOrientamos: string;
  mensagem: string;
};

export const AREAS: Area[] = [
  {
    num: "01",
    titulo: "Direito do Trabalho",
    curto: "Trabalho",
    doQueSeTrata:
      "Questões da relação de trabalho: contrato, jornada, salário, férias, afastamentos e o que envolve o fim do vínculo.",
    comoOrientamos:
      "Ouvimos a sua situação, analisamos os documentos do vínculo e explicamos, com calma, quais caminhos existem e o que cada um envolve.",
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre uma questão de Direito do Trabalho.",
  },
  {
    num: "02",
    titulo: "Direito de Família",
    curto: "Família",
    doQueSeTrata:
      "Momentos delicados da vida familiar: divórcio, união estável, guarda, convivência, pensão alimentícia e partilha de bens.",
    comoOrientamos:
      "Em uma conversa reservada, explicamos as alternativas, incluindo o acordo quando ele for possível, e acompanhamos cada etapa com discrição.",
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre uma questão de Direito de Família.",
  },
  {
    num: "03",
    titulo: "Direito Cível",
    curto: "Cível",
    doQueSeTrata:
      "Situações do dia a dia entre pessoas e empresas: contratos, cobranças, relações de consumo, imóveis e pedidos de indenização.",
    comoOrientamos:
      "Lemos com atenção contratos e documentos, apontamos riscos e explicamos as opções, da negociação à via judicial, para você decidir com informação.",
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre uma questão de Direito Cível.",
  },
  {
    num: "04",
    titulo: "Direito Previdenciário",
    curto: "Previdenciário",
    doQueSeTrata:
      "Pedidos e revisões junto ao INSS: aposentadorias, benefícios por incapacidade, pensão por morte e benefício assistencial.",
    comoOrientamos:
      "Analisamos o seu histórico e os documentos disponíveis, explicamos o que pode ser pedido e acompanhamos o andamento do pedido.",
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre uma questão de Direito Previdenciário.",
  },
];

export const ETAPAS = [
  {
    num: "01",
    titulo: "Primeiro contato e escuta",
    texto:
      "Você conta o que está acontecendo, no seu tempo. A primeira conversa serve para entender a situação e o que é mais importante para você.",
  },
  {
    num: "02",
    titulo: "Análise do caso e dos documentos",
    texto:
      "Fatos e documentos são examinados com cuidado, para identificar os caminhos possíveis e também os riscos de cada um.",
  },
  {
    num: "03",
    titulo: "Estratégia explicada em linguagem clara",
    texto:
      "A orientação vem em palavras simples, sem juridiquês. Você entende as opções e decide os próximos passos com segurança.",
  },
  {
    num: "04",
    titulo: "Acompanhamento e comunicação",
    texto:
      "Durante todo o caso, você sabe em que ponto as coisas estão e tem um canal direto para tirar dúvidas.",
  },
];

export const CONTEUDOS = [
  {
    titulo: "O que levar na primeira conversa",
    texto:
      "Documento pessoal, papéis ligados ao assunto (contratos, comunicados, recibos, mensagens) e uma linha do tempo simples, com as datas de que você se lembra. Se faltar algo, tudo bem: a conversa ajuda a entender o que é necessário.",
  },
  {
    titulo: "Como acompanhar o andamento do seu caso",
    texto:
      "Pergunte sempre em que fase o caso está e qual é o próximo passo. Guarde comunicações e números de processo em um só lugar e use o canal combinado com o escritório para tirar dúvidas.",
  },
  {
    titulo: "Por que o sigilo importa",
    texto:
      "O que você conta ao seu advogado é protegido pelo sigilo profissional. Por isso, a conversa pode ser franca, e é essa franqueza que permite uma orientação adequada ao seu caso.",
  },
];

export const FAQ = [
  {
    p: "Como funciona o primeiro atendimento?",
    r: "Começa com uma mensagem pelo WhatsApp. Depois, é combinada uma conversa, presencial em Poços de Caldas ou on-line, para entender a sua situação e explicar os caminhos possíveis.",
  },
  {
    p: "O que devo levar ou separar?",
    r: "Um documento pessoal e o que tiver relação com o assunto: contratos, comunicados, recibos, mensagens ou cartas. Não precisa ter tudo organizado; a conversa ajuda a identificar o que falta.",
  },
  {
    p: "Vocês atendem on-line?",
    r: "Sim. O atendimento on-line vale para todo o Brasil. O contato começa pelo WhatsApp e o formato da conversa e o envio de documentos são combinados no atendimento.",
  },
  {
    p: "O atendimento é sigiloso?",
    r: "Sim. Tudo o que você conta é protegido pelo sigilo profissional do advogado. Mesmo assim, evite enviar documentos ou dados sensíveis antes de combinar o canal adequado.",
  },
  {
    p: "Como acompanho o meu caso?",
    r: "Você recebe atualizações sobre cada etapa e tem um canal direto com o escritório. Sempre que surgir uma dúvida, é só perguntar.",
  },
  {
    p: "Preciso saber em qual área o meu caso se encaixa?",
    r: "Não. Basta contar o que está acontecendo. Identificar a área e os caminhos possíveis faz parte da orientação.",
  },
  {
    p: "Como falo com o escritório?",
    r: `Pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo Instagram @diego_silva_advocacia. O atendimento é de segunda a sexta, das 09h às 18h.`,
  },
];

export const enderecoCompleto = `${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}, CEP ${CONFIG.endereco.cep}`;

export const temAdvogado = /^OAB\/[A-Z]{2}\s+\S+/.test(CONFIG.advogado.oab.trim());
