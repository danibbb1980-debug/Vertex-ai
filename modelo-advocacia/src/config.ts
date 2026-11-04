/**
 * Configuração central do site.
 *
 * Tudo o que muda de um escritório para outro está aqui: nome, contatos,
 * tema, áreas, perguntas e textos. Para usar como base de um cliente real,
 * troque os dados abaixo e coloque `modelo: false`.
 */

export type Tema = "papel-e-tinta" | "verde-profundo" | "grafite-e-cobre";

export interface Area {
  id: string;
  titulo: string;
  /** Palavra do título que aparece em itálico. */
  destaque: string;
  descricao: string;
  orientacoes: string[];
  /** Mensagem pré-preenchida do WhatsApp para esta área. */
  mensagem: string;
}

export const CONFIG = {
  /** true = site-modelo da Lumivo Web (faixa de aviso, botão "Quero um site assim", WhatsApp da Lumivo). */
  modelo: true,

  /** Tema visual: "papel-e-tinta" (padrão), "verde-profundo" ou "grafite-e-cobre". */
  tema: "papel-e-tinta" as Tema,

  /** URL pública final, sem barra no fim. Usada em canonical, og:url e JSON-LD. */
  siteUrl: "https://modelo-advocacia-lumivo.vercel.app",

  /** Caminho de uma foto real (ex.: "/foto-advogada.webp"). Vazio = monograma. */
  foto: "",

  lumivo: {
    whatsapp: "5535984487206",
    mensagemModelo:
      "Olá! Vi o modelo de site para advocacia e quero saber mais.",
    mensagemBotoes: "Vi o modelo e quero um site assim",
  },

  escritorio: {
    nome: "Lavra & Cruz Advocacia",
    nomeCurto: "Lavra & Cruz",
    monograma: "L&C",
    cidade: "Cidade Exemplo - UF",
    endereco: "Rua Exemplo, 000 · Centro",
    cep: "00000-000",
    telefone: "(00) 00000-0000",
    /** Somente dígitos, com DDI. Usado quando modelo = false. */
    whatsapp: "5500000000000",
    email: "contato@exemplo.com.br",
    oab: "OAB/UF 000.000",
    horarios: [
      { dias: "Segunda a sexta", horas: "9h às 18h" },
      { dias: "Atendimento online", horas: "com horário marcado" },
    ],
    responsaveis: [
      { nome: "Dra. Nome Exemplo Lavra", inscricao: "OAB/UF 000.000" },
      { nome: "Dr. Nome Exemplo Cruz", inscricao: "OAB/UF 000.001" },
    ],
    formacao: [
      "Graduação em Direito · Instituição Exemplo",
      "Pós-graduação · Área Exemplo",
    ],
  },

  seo: {
    titulo: "Lavra & Cruz Advocacia · Cidade Exemplo - UF",
    descricao:
      "Atendimento jurídico com escuta, clareza e acompanhamento do início ao fim. Família e Sucessões, Trabalho, Previdenciário e Civil.",
  },

  hero: {
    eyebrow: "Advocacia · Cidade Exemplo - UF",
    /** Cada item é uma linha do título. Use *asteriscos* para o itálico. */
    titulo: ["Cada caso", "começa por", "*ouvir*."],
    subtitulo:
      "Atendimento jurídico com escuta, clareza e acompanhamento do início ao fim.",
  },

  manifesto:
    "Explicar cada passo em linguagem clara, guardar o que nos é confiado e responder pelo que fazemos. É assim que entendemos a advocacia.",

  areas: [
    {
      id: "familia",
      titulo: "Família e Sucessões",
      destaque: "Sucessões",
      descricao:
        "Questões que envolvem vínculos, convivência e patrimônio familiar pedem cuidado com as pessoas e atenção aos detalhes.",
      orientacoes: [
        "Divórcio, guarda e convivência",
        "Pensão alimentícia",
        "Inventário e partilha",
        "Testamento e planejamento sucessório",
      ],
      mensagem:
        "Olá! Gostaria de uma orientação sobre Direito de Família e Sucessões.",
    },
    {
      id: "trabalho",
      titulo: "Direito do Trabalho",
      destaque: "Trabalho",
      descricao:
        "Relações de trabalho geram direitos e deveres para os dois lados. Entender cada um ajuda a tomar decisões com clareza.",
      orientacoes: [
        "Verbas rescisórias",
        "Jornada e horas extras",
        "Vínculo de emprego",
        "Orientação a empregadores",
      ],
      mensagem:
        "Olá! Gostaria de uma orientação sobre Direito do Trabalho.",
    },
    {
      id: "previdenciario",
      titulo: "Direito Previdenciário",
      destaque: "Previdenciário",
      descricao:
        "Benefícios do INSS envolvem regras, prazos e documentos específicos. Conhecer o caminho ajuda a decidir com mais segurança.",
      orientacoes: [
        "Aposentadorias",
        "Auxílio por incapacidade",
        "Benefício assistencial (BPC/LOAS)",
        "Revisão e planejamento previdenciário",
      ],
      mensagem:
        "Olá! Gostaria de uma orientação sobre Direito Previdenciário.",
    },
    {
      id: "civil",
      titulo: "Direito Civil",
      destaque: "Civil",
      descricao:
        "Contratos, imóveis e responsabilidades do dia a dia. Uma leitura cuidadosa antes de assinar costuma evitar problemas depois.",
      orientacoes: [
        "Contratos e revisão contratual",
        "Questões imobiliárias",
        "Responsabilidade civil",
        "Direito do consumidor",
      ],
      mensagem: "Olá! Gostaria de uma orientação sobre Direito Civil.",
    },
  ] satisfies Area[],

  etapas: [
    {
      titulo: "Primeiro contato e escuta",
      texto:
        "Você conta o que está acontecendo, no seu tempo. Ouvimos com atenção antes de qualquer conclusão.",
    },
    {
      titulo: "Análise do caso e documentos",
      texto:
        "Estudamos os fatos e os documentos com cuidado para entender o cenário completo.",
    },
    {
      titulo: "Estratégia explicada em linguagem clara",
      texto:
        "Apresentamos os caminhos possíveis, com seus riscos, sem juridiquês e sem promessas.",
    },
    {
      titulo: "Acompanhamento e comunicação",
      texto:
        "Você sabe em que pé está o seu caso. Cada movimentação relevante é comunicada.",
    },
  ],

  sobre: {
    titulo: ["Um método feito de", "*escuta*, clareza e sigilo."],
    paragrafos: [
      "O Lavra & Cruz é um escritório de advocacia que trabalha com atendimento próximo. Cada pessoa é recebida com tempo para explicar sua situação, e cada orientação é dada em linguagem que se entende na primeira leitura.",
      "Tratamos informações e documentos com sigilo profissional, explicamos as possibilidades e os limites de cada caminho e mantemos o cliente informado ao longo de todo o processo.",
    ],
    principios: [
      { termo: "Escuta", texto: "Entender antes de orientar." },
      { termo: "Clareza", texto: "Explicar sem juridiquês." },
      { termo: "Sigilo", texto: "Proteger o que é confiado." },
    ],
  },

  artigos: [
    {
      categoria: "Primeiros passos",
      titulo: "O que levar na primeira reunião",
      resumo:
        "Documentos pessoais, contratos, mensagens e uma linha do tempo dos fatos ajudam a tornar a conversa mais objetiva.",
      leitura: "3 min",
    },
    {
      categoria: "Acompanhamento",
      titulo: "Como acompanhar o andamento do seu caso",
      resumo:
        "Entenda o que significam as principais movimentações de um processo e quando vale perguntar ao seu advogado.",
      leitura: "4 min",
    },
    {
      categoria: "Ética profissional",
      titulo: "Por que o sigilo importa",
      resumo:
        "O sigilo profissional protege quem procura um advogado. Saiba o que ele cobre e por que é um dever, não uma escolha.",
      leitura: "3 min",
    },
  ],

  faq: [
    {
      pergunta: "Como funciona o primeiro atendimento?",
      resposta:
        "O primeiro passo é uma conversa para entender a sua situação. A partir dela, explicamos se e como podemos orientar e quais seriam os próximos passos.",
    },
    {
      pergunta: "O que preciso levar?",
      resposta:
        "Documento de identificação e o que tiver relação com o assunto: contratos, comprovantes, mensagens ou correspondências. Se não tiver tudo, não tem problema: orientamos o que reunir depois.",
    },
    {
      pergunta: "Como acompanho meu caso?",
      resposta:
        "Você recebe atualizações a cada movimentação relevante e pode tirar dúvidas pelos canais do escritório. Explicamos cada etapa em linguagem simples.",
    },
    {
      pergunta: "O atendimento é sigiloso?",
      resposta:
        "Sim. Tudo o que é conversado e entregue ao escritório é protegido pelo sigilo profissional, que é um dever do advogado.",
    },
    {
      pergunta: "Vocês atendem online?",
      resposta:
        "Sim. O atendimento pode ser presencial ou por videochamada, com horário combinado previamente.",
    },
    {
      pergunta: "Posso enviar documentos pelo WhatsApp?",
      resposta:
        "Pedimos que documentos e dados sensíveis sejam compartilhados apenas depois do primeiro contato, pelo canal que indicarmos durante o atendimento.",
    },
    {
      pergunta: "Como falar com o escritório?",
      resposta:
        "Pelo WhatsApp, por telefone ou por e-mail, nos horários de atendimento. Os contatos estão logo abaixo, na seção Contato.",
    },
  ],
};

/** Textos do pré-atendimento. */
export const LIMITE_MENSAGEM = 300;
