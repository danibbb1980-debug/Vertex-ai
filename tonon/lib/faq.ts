import { fullAddress, site } from "./site-data";

/**
 * Perguntas frequentes — apenas com fatos informados pelo laboratório.
 * Também alimentam o JSON-LD FAQPage (lib/structured-data.ts).
 */
export const faq: { question: string; answer: string }[] = [
  {
    question: "Onde fica o Laboratório Tonon?",
    answer: `${fullAddress}. O link “Como chegar” abre a localização no Google Maps.`,
  },
  {
    question: "Qual é o horário de atendimento?",
    answer: "De segunda a sábado, das 08h às 18h. Aos domingos o laboratório não abre.",
  },
  {
    question: "Preciso agendar antes de ir?",
    answer:
      "O agendamento é recomendado. Envie uma mensagem pelo WhatsApp para combinar o melhor horário para a sua visita.",
  },
  {
    question: "Há estacionamento?",
    answer:
      "Sim. Há estacionamento gratuito coberto e descoberto no local, além de estacionamento gratuito na rua.",
  },
  {
    question: "O laboratório é acessível?",
    answer: "Sim. A entrada e o banheiro são acessíveis para pessoas em cadeira de rodas.",
  },
  {
    question: "Como falo com Matheus Tonon?",
    answer: `Pelo WhatsApp ${site.phone.display} ou pelo Instagram ${site.links.instagramHandle}.`,
  },
];
