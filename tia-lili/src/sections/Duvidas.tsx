import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { CONFIG, enderecoCompleto } from "../config";
import { Secao, Cabecalho } from "../components/Secao";
import { BotaoWhatsApp, AConfirmar } from "../components/Botoes";

const lista = (itens: readonly string[]) => itens.join(", ").replace(/, ([^,]*)$/, " e $1").toLowerCase();

const PERGUNTAS: { p: string; r: ReactNode }[] = [
  {
    p: "Com que idade levar a criança ao dentista pela primeira vez?",
    r: "Não existe uma idade exata que sirva para todas as famílias. Em geral, recomenda-se que a primeira visita aconteça cedo, ainda nos primeiros anos de vida. Na avaliação, a doutora orienta quando fazer a primeira visita e com que frequência voltar.",
  },
  {
    p: "Como funciona a primeira consulta?",
    r: "Ela começa com uma conversa com a família e com a criança conhecendo o espaço. A avaliação acontece no ritmo dela, com explicações simples antes de cada etapa. No final, a doutora explica o que observou e os próximos passos.",
  },
  {
    p: "Como preparar a criança?",
    r: "Fale da consulta com naturalidade e com frases verdadeiras, como “vamos conhecer a Tia Lili, que cuida do sorriso das crianças”. Evite prometer que “não vai doer” ou usar o dentista como ameaça. Se a criança tiver perguntas, responda com calma ou guarde-as para fazer à doutora.",
  },
  {
    p: "Meu filho tem medo de dentista. E agora?",
    r: "É comum, e vale contar isso já no agendamento. O atendimento respeita o tempo da criança e cada passo é explicado antes de acontecer. A doutora conversa com a família sobre o caminho mais adequado para cada caso.",
  },
  {
    p: "Os pais podem acompanhar o atendimento?",
    r: (
      <>
        A família faz parte do cuidado. A forma de acompanhar o atendimento segue a rotina da clínica e é combinada com você{" "}
        <AConfirmar>[A CONFIRMAR]</AConfirmar>.
      </>
    ),
  },
  {
    p: "O consultório atende bebês e adolescentes?",
    r: "Sim. O atendimento é voltado a bebês, crianças e adolescentes, com orientações adequadas a cada fase.",
  },
  {
    p: "Como agendar?",
    r: `Pelo WhatsApp ${CONFIG.whatsappExibicao}. O atendimento é feito somente com horário marcado. O horário fica confirmado quando o consultório responder a sua mensagem.`,
  },
  {
    p: "Onde fica e quais são os horários?",
    r: `${enderecoCompleto}. De segunda a sexta, das 08h às 12h e das 14h às 18h. Sábado e domingo, fechado. ${CONFIG.observacaoHorarios}`,
  },
  {
    p: "Quais são as formas de pagamento?",
    r: `${lista(CONFIG.pagamentos).replace(/^./, (c) => c.toUpperCase())}. Para outras dúvidas sobre pagamento, fale com o consultório pelo WhatsApp.`,
  },
  {
    p: "O consultório tem acessibilidade?",
    r: "Sim, há assento com acessibilidade para pessoas em cadeira de rodas. Se precisar de alguma adaptação para a consulta, avise no agendamento.",
  },
];

/** Acordeão acessível (inspirado no FAQ Accordion Reveal do 21st.dev): botões com aria-expanded e vários itens abertos. */
function Item({ p, r, inicial = false }: { p: string; r: ReactNode; inicial?: boolean }) {
  const [aberto, setAberto] = useState(inicial);
  const id = useId();
  return (
    <li className={`rounded-xl2 transition-colors duration-500 ${aberto ? "bg-white" : "bg-white/60 hover:bg-white/85"} ring-1 ring-areia`}>
      <h3 className="font-sans text-[1.06rem] font-bold leading-snug tracking-normal">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          id={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="flex min-h-16 w-full items-center justify-between gap-5 rounded-xl2 px-6 py-4 text-left"
        >
          <span>{p}</span>
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              aberto ? "rotate-45 bg-menta-escuro text-white" : "bg-menta-claro text-menta-profundo"
            }`}
            aria-hidden
          >
            <Plus size={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-p`} hidden={!aberto}>
        <p className="faq-resposta px-6 pb-6 leading-relaxed text-cacau-2">{r}</p>
      </div>
    </li>
  );
}

export function Duvidas() {
  return (
    <Secao id="duvidas">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <Cabecalho
              id="duvidas"
              eyebrow="Dúvidas frequentes"
              titulo="Dúvidas *comuns* dos pais."
              texto={<p>Não encontrou o que procurava? Mande sua pergunta pelo WhatsApp.</p>}
            />
            <div className="revelar mt-8">
              <BotaoWhatsApp variante="secundario" mensagem="Olá! Vi o site da Tia Lili e tenho uma dúvida sobre o atendimento.">
                Perguntar pelo WhatsApp
              </BotaoWhatsApp>
            </div>
          </div>
        </div>
        <ul className="revelar flex flex-col gap-3 lg:col-span-8">
          {PERGUNTAS.map((q, i) => (
            <Item key={q.p} p={q.p} r={q.r} inicial={i === 0} />
          ))}
        </ul>
      </div>
    </Secao>
  );
}
