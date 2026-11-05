/**
 * Todos os dados e textos do site ficam aqui.
 * Regra: se um dado não é confirmado, ele NÃO entra no site. Deixe o campo
 * vazio ("") e o componente correspondente simplesmente não aparece.
 */

const WHATSAPP = "5535999105072";

export const waLink = (mensagem: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

export const CONFIG = {
  /** Liga a faixa "Rascunho para avaliação" e o noindex nas metas. */
  rascunho: true,

  /** URL pública absoluta, sem barra no fim. Usada em canonical, og:url e JSON-LD. */
  siteUrl: "https://msc-advocacia-rascunho.vercel.app",

  nome: "MSC Advocacia Previdenciária",
  nomeCurto: "MSC Advocacia",
  titulo: "MSC Advocacia Previdenciária | Poços de Caldas - MG",
  descricao:
    "Advocacia previdenciária em Poços de Caldas - MG. Orientação em aposentadorias, benefícios por incapacidade, salário-maternidade, pensão por morte e planejamento previdenciário.",

  whatsapp: WHATSAPP,
  whatsappExibicao: "(35) 99910-5072",
  telefoneE164: "+55 35 99910-5072",
  email: "atendimentomscadvprev@gmail.com",

  endereco: {
    /** Endereço do site atual (referencias/site-atual-texto.txt). */
    logradouro: "R. Pref. Chagas, 305, sala 301",
    bairro: "Centro",
    cidade: "Poços de Caldas",
    uf: "MG",
    cep: "37701-734",
  },
  mapsUrl: "https://maps.app.goo.gl/6sj76S4RWVtXz3DF6",

  instagram: {
    usuario: "@mscadvocaciaprev",
    url: "https://www.instagram.com/mscadvocaciaprev/",
  },

  horario: {
    dias: "Segunda a sexta",
    periodos: ["09h às 12h", "13h às 18h"],
    fechado: "Sábado e domingo: fechado",
  },

  /** Presencial em Poços de Caldas + consultoria jurídica à distância. */
  atendeOnline: true,

  /**
   * A advogada só aparece se mostrarFundadora = true E o número da OAB estiver
   * preenchido. Sem OAB, o bloco "Sobre" fala apenas do escritório.
   */
  mostrarFundadora: false,
  fundadora: {
    nome: "Fabiana Mariano Schultz Cagnani",
    oab: "",
    formacao: "",
  },

  /** Tempo de atuação e vínculos anteriores: só ative depois de confirmar com a advogada. */
  mostrarTrajetoria: false,
  trajetoria: [
    "Cerca de 20 anos de atuação em direito previdenciário.",
    "Passagem pela Procuradoria Federal Especializada do INSS.",
  ],

  creditos: { nome: "Lumivo Web" },
};

export const mostraFundadora = CONFIG.mostrarFundadora && CONFIG.fundadora.oab.trim() !== "";

export const enderecoCurto = `${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`;

export const MSG = {
  geral: "Olá! Vim pelo site e gostaria de falar sobre um atendimento.",
  planejamento: "Olá! Vim pelo site e gostaria de conversar sobre planejamento previdenciário.",
};

export type Area = {
  id: string;
  titulo: string;
  resumo: string;
  trata: string;
  orienta: string;
  tags?: string[];
  mensagem: string;
};

export const AREAS: Area[] = [
  {
    id: "maternidade",
    titulo: "Salário-maternidade",
    resumo: "Afastamento por nascimento, adoção ou guarda.",
    trata:
      "Benefício ligado ao afastamento do trabalho por nascimento, adoção ou guarda judicial para fins de adoção. Cada forma de vínculo com a Previdência tem as suas particularidades.",
    orienta:
      "Verificamos a sua situação junto à Previdência, ajudamos a organizar os documentos e acompanhamos o pedido no INSS e, se for preciso, na Justiça.",
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre salário-maternidade.",
  },
  {
    id: "incapacidade",
    titulo: "Benefícios por incapacidade",
    resumo: "Afastamento por doença ou acidente.",
    trata:
      "Benefícios para quem precisa se afastar do trabalho por doença ou acidente, de forma temporária ou permanente.",
    orienta:
      "Explicamos o caminho do pedido, como reunir laudos e exames, o que esperar da perícia e quais medidas são possíveis se o benefício for negado ou encerrado.",
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre benefício por incapacidade.",
  },
  {
    id: "aposentadorias",
    titulo: "Aposentadorias",
    resumo: "Por idade, rural, por tempo de contribuição e especial.",
    trata:
      "Cada modalidade de aposentadoria tem requisitos próprios, e as regras mudaram ao longo dos anos. Entender qual caminho se aplica começa pela sua história de trabalho.",
    orienta:
      "Analisamos o histórico de contribuições, conferimos períodos que podem não estar registrados corretamente e conduzimos o pedido na via administrativa ou judicial.",
    tags: ["Por idade", "Rural", "Por tempo de contribuição", "Especial"],
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre aposentadoria.",
  },
  {
    id: "pensao",
    titulo: "Pensão por morte",
    resumo: "Proteção para os dependentes do segurado.",
    trata:
      "Benefício destinado aos dependentes de quem era segurado da Previdência. Envolve comprovar a condição de segurado e a relação de dependência.",
    orienta:
      "Conversamos com cuidado sobre a situação da família, indicamos os documentos necessários e acompanhamos o pedido até a decisão.",
    mensagem: "Olá! Vim pelo site e gostaria de conversar sobre pensão por morte.",
  },
  {
    id: "insalubre",
    titulo: "Atividade insalubre",
    resumo: "Reconhecimento de tempo especial.",
    trata:
      "Quem trabalhou exposto a agentes nocivos à saúde, como ruído, calor ou produtos químicos, pode ter esse período considerado de forma diferenciada pela Previdência.",
    orienta:
      "Avaliamos os documentos da empresa, como o PPP e os laudos técnicos, e buscamos o reconhecimento desse tempo no INSS ou na Justiça.",
    mensagem:
      "Olá! Vim pelo site e gostaria de conversar sobre reconhecimento de atividade insalubre (tempo especial).",
  },
  {
    id: "planejamento",
    titulo: "Planejamento previdenciário",
    resumo: "Um estudo personalizado da sua vida contributiva.",
    trata:
      "Um estudo da sua vida contributiva para entender onde você está hoje e quais caminhos existem até a aposentadoria.",
    orienta:
      "Reunimos e conferimos os seus registros, comparamos cenários possíveis e explicamos cada um com clareza, para que você decida com informação.",
    mensagem: MSG.planejamento,
  },
];

export const PLANEJAMENTO = [
  {
    n: "01",
    titulo: "Levantamento",
    texto:
      "Reunimos o seu histórico: carteiras de trabalho, carnês, extrato do CNIS e outros registros de contribuição.",
  },
  {
    n: "02",
    titulo: "Conferência",
    texto:
      "Verificamos se há períodos faltando, vínculos incompletos ou atividades que merecem atenção especial.",
  },
  {
    n: "03",
    titulo: "Cenários",
    texto:
      "Comparamos as possibilidades e explicamos cada uma em linguagem simples, para você decidir os próximos passos.",
  },
];

export const ETAPAS = [
  {
    n: "01",
    titulo: "Primeiro contato e escuta",
    texto:
      "Você conta a sua história no seu tempo. Ouvimos com atenção para entender a situação e o que é mais importante para você.",
  },
  {
    n: "02",
    titulo: "Análise do caso e dos documentos",
    texto:
      "Examinamos documentos, registros e as regras que se aplicam ao seu caso, com cuidado em cada detalhe.",
  },
  {
    n: "03",
    titulo: "Estratégia explicada em linguagem clara",
    texto:
      "Apresentamos os caminhos possíveis, sem termos difíceis, com os cuidados de cada um. A decisão é sempre sua.",
  },
  {
    n: "04",
    titulo: "Acompanhamento e comunicação",
    texto:
      "Seguimos com você durante o andamento, no INSS ou na Justiça, e mantemos você informado sobre cada etapa.",
  },
];

export const METODO = [
  {
    titulo: "Escuta",
    texto: "Cada caso começa por uma conversa atenta. Entender a pessoa vem antes de analisar o processo.",
  },
  {
    titulo: "Clareza",
    texto: "Explicamos cada etapa em linguagem simples, para que você saiba sempre onde está e o que vem a seguir.",
  },
  {
    titulo: "Sigilo",
    texto: "Saúde, renda e família são assuntos delicados. Tudo o que você compartilha é protegido pelo sigilo profissional.",
  },
  {
    titulo: "Atendimento humanizado",
    texto: "Respeito ao seu tempo e às suas particularidades, do primeiro contato ao fim do acompanhamento.",
  },
];

export const CONTEUDOS = [
  {
    n: "01",
    titulo: "Que documentos reunir antes da primeira conversa",
    texto:
      "Documentos pessoais, carteiras de trabalho, carnês de contribuição e cartas ou decisões recebidas do INSS ajudam a compor o quadro. Se faltar algo, tudo bem: a primeira conversa também serve para identificar o que ainda é preciso.",
  },
  {
    n: "02",
    titulo: "Como acompanhar o andamento do seu pedido",
    texto:
      "Pedidos feitos ao INSS podem ser consultados pelos canais oficiais do órgão, como o aplicativo e o site Meu INSS. Guardar o número do protocolo e anotar cada comunicação recebida facilita esse acompanhamento.",
  },
  {
    n: "03",
    titulo: "Por que o sigilo importa",
    texto:
      "Questões previdenciárias envolvem saúde, renda e família. Por isso, os detalhes do seu caso devem ser tratados no atendimento, com sigilo profissional, e não em comentários ou mensagens abertas.",
  },
];

export const FAQ = [
  {
    p: "Como funciona o primeiro atendimento?",
    r: "É uma conversa para entender a sua situação. Você conta o que está acontecendo e tira as suas dúvidas. A partir daí, explicamos quais documentos serão necessários e quais são os próximos passos.",
  },
  {
    p: "O que devo levar?",
    r: "Documento de identificação, CPF, carteiras de trabalho e o que você tiver relacionado ao INSS, como cartas, protocolos ou decisões. Em benefícios ligados à saúde, laudos e exames também ajudam. Se não tiver tudo, não tem problema: orientamos sobre o que falta.",
  },
  {
    p: "Preciso já ter feito o pedido no INSS para procurar o escritório?",
    r: "Não. Você pode buscar orientação antes de fazer o pedido, durante a análise ou depois de receber uma resposta do INSS.",
  },
  {
    p: "Como acompanho o andamento do meu caso?",
    r: "Mantemos você informado sobre cada etapa importante. Sempre que tiver uma dúvida, você pode falar com o escritório pelo WhatsApp ou por e-mail.",
  },
  {
    p: "O atendimento é sigiloso?",
    r: "Sim. Tudo o que você compartilha é protegido pelo sigilo profissional da advocacia. Por isso, pedimos que documentos e detalhes do caso sejam tratados somente no atendimento.",
  },
  {
    p: "Vocês atendem online?",
    r: "Sim. Além do atendimento presencial em Poços de Caldas, o escritório oferece consultoria jurídica à distância. Combine pelo WhatsApp a forma mais adequada para você.",
    online: true,
  },
  {
    p: "Como falar com o escritório?",
    r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelo e-mail ${CONFIG.email} ou pelo formulário de pré-atendimento desta página. O atendimento acontece de segunda a sexta, das 09h às 12h e das 13h às 18h.`,
  },
].filter((f) => !f.online || CONFIG.atendeOnline);

export const NAV = [
  { href: "#areas", label: "Áreas" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#sobre", label: "Sobre" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];
