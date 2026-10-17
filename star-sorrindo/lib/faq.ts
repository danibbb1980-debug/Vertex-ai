import { fullAddress, hoursSummary } from "./site-data";

/**
 * Perguntas frequentes. Respostas educativas, sem promessas clínicas e sem
 * substituir a consulta. `tags` define em quais páginas cada pergunta aparece.
 * `link` acrescenta uma ação ao fim da resposta (ver components/sections/Faq.tsx).
 */
export type FaqLink = "whatsapp" | "implants" | "maps" | "contact";
export type FaqItem = {
  question: string;
  answer: string;
  tags: ("home" | "implants" | "prosthesis")[];
  link?: FaqLink;
};

const hours = hoursSummary.map((h) => `${h.label}: ${h.value}`).join(" · ");

export const faqItems: FaqItem[] = [
  {
    question: "O que é um implante dentário?",
    answer:
      "É uma peça instalada no osso da maxila ou da mandíbula que funciona como suporte para a reposição de um ou mais dentes. Sobre o implante é colocada uma coroa ou prótese. Se ele é uma opção para você, só a avaliação clínica pode dizer.",
    tags: ["home", "implants"],
    link: "implants",
  },
  {
    question: "Quem pode fazer implantes dentários?",
    answer:
      "Não existe uma resposta única. A indicação depende da saúde geral, das condições da gengiva e do osso, de hábitos e do histórico de cada pessoa. Por isso, a avaliação com o profissional responsável é sempre o primeiro passo.",
    tags: ["home", "implants"],
  },
  {
    question: "Quanto custa um implante dentário?",
    answer:
      "O valor só pode ser informado depois da avaliação clínica. O orçamento depende do planejamento individual, da quantidade de dentes envolvidos, do tipo de reabilitação e da eventual necessidade de tratamentos complementares antes do implante.",
    tags: ["home", "implants"],
    link: "whatsapp",
  },
  {
    question: "Quanto tempo demora o tratamento?",
    answer:
      "Cada caso tem características próprias. A duração varia conforme a condição do osso e da gengiva, a cicatrização de cada paciente e as etapas definidas no planejamento. O profissional explica a previsão para o seu caso depois da avaliação.",
    tags: ["home", "implants", "prosthesis"],
  },
  {
    question: "O procedimento exige avaliação prévia?",
    answer:
      "Sim. Antes de qualquer indicação de implante ou prótese, é preciso uma avaliação clínica e, quando o profissional julgar necessário, exames complementares. É ela que permite planejar com segurança.",
    tags: ["home", "implants", "prosthesis"],
  },
  {
    question: "Como funciona a primeira consulta?",
    answer:
      "Você conta o que gostaria de avaliar, o profissional examina sua saúde bucal e explica as possibilidades adequadas para o seu caso, incluindo etapas e cuidados. É o momento de tirar dúvidas com calma.",
    tags: ["home", "implants", "prosthesis"],
  },
  {
    question: "Qual é a diferença entre implante e prótese?",
    answer:
      "O implante é o suporte instalado no osso. A prótese é a parte que substitui o dente (ou dentes) e pode ser apoiada sobre implantes, sobre dentes naturais ou sobre a gengiva, conforme o caso. Muitas vezes os dois trabalham juntos — a combinação indicada é definida na avaliação.",
    tags: ["home", "implants", "prosthesis"],
  },
  {
    question: "Quem pode usar próteses dentárias?",
    answer:
      "As próteses podem ser indicadas para diferentes situações de dentes ausentes ou comprometidos. O tipo mais adequado depende das condições da boca, das necessidades funcionais e estéticas e da avaliação do profissional responsável.",
    tags: ["prosthesis"],
  },
  {
    question: "Como faço para agendar?",
    answer:
      "Pelo WhatsApp: toque em qualquer botão “Agendar avaliação” e uma conversa com a equipe é aberta com uma mensagem pronta. A equipe informa a disponibilidade e confirma o horário com você — o agendamento só vale depois dessa confirmação.",
    tags: ["home", "implants", "prosthesis"],
    link: "whatsapp",
  },
  {
    question: "Onde fica a Star Sorrindo?",
    answer: `No Centro de Poços de Caldas: ${fullAddress}.`,
    tags: ["home"],
    link: "maps",
  },
  {
    question: "Quais são os horários de atendimento?",
    answer: `${hours}. Os horários podem variar em feriados — confirme pelo WhatsApp.`,
    tags: ["home"],
    link: "contact",
  },
];

export const faqFor = (tag: FaqItem["tags"][number]) => faqItems.filter((f) => f.tags.includes(tag));
