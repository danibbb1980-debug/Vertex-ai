import { classSchedule, fullAddress, hoursSummary, modalityName, type ModalityId } from "./site-data";

/**
 * Perguntas frequentes. Ficam num módulo próprio porque alimentam tanto o
 * accordion quanto o JSON-LD da página. Respostas só com informação
 * confirmada; o resto é direcionado ao WhatsApp.
 */
export type FaqItem = {
  question: string;
  answer: string;
  link?: "maps" | "plans" | "visit" | "partnerships" | "classes";
};

/** "Hit Dance: segunda-feira às 06h; Dança: terça-feira e quinta-feira às 19h; …" — derivado da grade. */
function scheduleSentence(): string {
  const order: ModalityId[] = [];
  const byModality = new Map<ModalityId, string[]>();
  for (const row of classSchedule) {
    if (!byModality.has(row.modality)) {
      order.push(row.modality);
      byModality.set(row.modality, []);
    }
    byModality.get(row.modality)!.push(`${row.day.toLowerCase()} às ${row.times.join(" e às ")}`);
  }
  return order.map((id) => `${modalityName(id)}: ${byModality.get(id)!.join("; ")}`).join(". ");
}

const hours = hoursSummary.map((h) => `${h.label}: ${h.value.toLowerCase()}`).join("; ");

export const faqItems: FaqItem[] = [
  {
    question: "Qual é o endereço da VIP Shape?",
    answer: `A VIP Shape Academia fica na ${fullAddress}.`,
    link: "maps",
  },
  {
    question: "Quais são os horários de funcionamento?",
    answer: `${hours}.`,
  },
  {
    question: "Quais modalidades coletivas são divulgadas?",
    answer: `${scheduleSentence()}. Além das aulas coletivas, a academia oferece musculação. Confirme a programação com a equipe, porque os horários podem mudar.`,
    link: "classes",
  },
  {
    question: "Como posso saber os valores dos planos?",
    answer:
      "Os valores e as condições de matrícula são informados diretamente pela equipe. Mande uma mensagem pelo WhatsApp para receber as informações atualizadas.",
    link: "plans",
  },
  {
    question: "Como faço para conhecer a academia?",
    answer:
      "Fale com a equipe pelo WhatsApp para combinar o melhor horário e venha conhecer a estrutura pessoalmente, dentro do horário de funcionamento.",
    link: "visit",
  },
  {
    question: "A VIP Shape aceita Wellhub e TotalPass?",
    answer:
      "Wellhub e TotalPass: consulte as condições com a equipe pelo WhatsApp antes de ir.",
    link: "partnerships",
  },
];
