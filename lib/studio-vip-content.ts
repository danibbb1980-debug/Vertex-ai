/**
 * Studio VIP — textos que também alimentam os dados estruturados.
 *
 * Depoimentos: trechos literais das avaliações reais do Google, com o nome de
 * quem escreveu. Não editar o conteúdo das falas nem acrescentar frases.
 */

import { addressLine } from "./studio-vip";

export const testimonials = [
  {
    name: "Keila Cornetes",
    quote:
      "Fazer parte do Studio VIP tem sido uma experiência transformadora. Mudar de academia foi uma das melhores decisões que tomei.",
  },
  {
    name: "Maria Júlia Lopes Silva",
    quote:
      "Os professores são excelentes e muito bem qualificados, corrigindo os movimentos de forma precisa e adaptando o treino conforme minhas necessidades.",
  },
  {
    name: "Selma Ferreira",
    quote: "Fui super bem atendida, o ambiente é aconchegante e os profissionais impecáveis.",
  },
] as const;

export const faq = [
  {
    q: "Como funciona o treinamento personalizado?",
    a: "A equipe considera seus objetivos, seu nível de experiência e suas necessidades para orientar cada treino, acompanhando a execução dos movimentos de perto. Para entender os detalhes, é só conversar com o estúdio pelo WhatsApp.",
  },
  {
    q: "Preciso ter experiência com academia?",
    a: "Não necessariamente. Entre em contato com a equipe e conte qual é a sua experiência e o que você procura: assim ela pode apresentar as opções mais adequadas para você.",
  },
  {
    q: "O Studio VIP oferece acompanhamento nutricional?",
    a: "Sim. Existe a possibilidade de acompanhamento nutricional personalizado com a profissional Aline. Consulte a equipe para saber como funciona e quais são as condições.",
  },
  {
    q: "Os horários são flexíveis?",
    a: "O estúdio trabalha com horários flexíveis, sujeitos à disponibilidade da agenda. Consulte os horários disponíveis diretamente com a equipe.",
  },
  {
    q: "Onde fica o Studio VIP?",
    a: `${addressLine}.`,
  },
  {
    q: "Como posso agendar uma aula experimental?",
    a: "Basta clicar em qualquer botão de WhatsApp desta página e conversar com a equipe. Ela explica como funciona e combina o melhor momento com você.",
  },
] as const;
