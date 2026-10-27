import { site } from "./site";

/**
 * Perguntas respondidas apenas com o que é confirmado. Preço, convênios e
 * prazos dependem da clínica: as respostas levam ao WhatsApp em vez de supor.
 */
export const faq = [
  {
    q: "Como faço para agendar uma consulta?",
    a: `Pelo WhatsApp: toque em "Agende pelo WhatsApp" e envie sua mensagem. A equipe responde com os horários disponíveis. Se preferir ligar, o telefone é ${site.phoneDisplay}.`,
  },
  {
    q: "A clínica atende a família toda?",
    a: "Sim. O atendimento é pensado para você e sua família, com tratamentos para diferentes necessidades e fases da vida.",
  },
  {
    q: "Quais tratamentos vocês fazem?",
    a: "Implantes, próteses (dentadura, ponte móvel e prótese parcial removível), coroas em porcelana, clareamento, aparelho ortodôntico, restaurações, tratamento de canal e extrações.",
  },
  {
    q: "O clareamento é feito em casa ou no consultório?",
    a: "Os dois. Existe a opção de clareamento caseiro e a de clareamento em consultório. Na avaliação, o dentista indica o caminho mais adequado para você.",
  },
  {
    q: "Quanto custa o tratamento?",
    a: "O valor depende do que cada caso precisa, por isso é definido depois da avaliação. Mande uma mensagem pelo WhatsApp contando o que você procura.",
  },
  {
    q: "Onde fica a clínica?",
    a: `Em ${site.city}, ${site.stateName}. Use o botão "Como chegar" para abrir o mapa, ou peça a localização exata pelo WhatsApp.`,
  },
] as const;
