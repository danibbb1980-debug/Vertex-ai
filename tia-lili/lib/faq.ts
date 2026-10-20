/**
 * Perguntas práticas sobre contato e agendamento. Sem orientação clínica:
 * dúvidas sobre a saúde bucal da criança são tratadas na consulta.
 */
export type FaqLink = "whatsapp" | "instagram" | "maps";

export const faqItems: { question: string; answer: string; link?: FaqLink }[] = [
  {
    question: "Como entro em contato com a Tia Lili?",
    answer:
      "O jeito mais rápido é pelo WhatsApp (+55 35 9811-2645). Você também pode acompanhar o consultório pelo Instagram @tialiliodontopediatra.",
    link: "whatsapp",
  },
  {
    question: "Como solicito um agendamento?",
    answer:
      "Envie uma mensagem pelo WhatsApp contando que deseja agendar. A equipe responde com as informações e a disponibilidade de horários.",
    link: "whatsapp",
  },
  {
    question: "Como encontro o consultório?",
    answer: "A localização está no Google Maps: é só abrir o link para ver o caminho a partir de onde você estiver.",
    link: "maps",
  },
  {
    question: "Posso tirar dúvidas antes da consulta?",
    answer:
      "Sim. Dúvidas sobre agendamento podem ser enviadas pelo WhatsApp. Questões sobre a saúde bucal da criança são avaliadas com calma durante a consulta.",
    link: "whatsapp",
  },
];
