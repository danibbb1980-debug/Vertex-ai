import { useId, useState, type ReactNode } from "react";
import { CONFIG, enderecoCompleto } from "../config";
import { IconPlus } from "../components/Icons";
import { CabecalhoSecao, Confirmar, Pendente } from "../components/ui";

const PERGUNTAS: { p: string; r: ReactNode }[] = [
  {
    p: "Com que idade levar a criança ao dentista pela primeira vez?",
    r: (
      <p>
        Não é preciso esperar um problema para marcar a primeira consulta. Muitas famílias procuram orientação quando
        os primeiros dentes aparecem, mas cada criança tem a sua história: a doutora orienta, na avaliação, qual é o momento mais indicado
        para o seu filho.
      </p>
    ),
  },
  {
    p: "Como funciona a primeira consulta?",
    r: (
      <p>
        Começa com uma conversa e com a criança conhecendo o espaço. Depois vem a avaliação, feita com calma e no ritmo
        dela. No fim, os pais recebem as orientações em linguagem simples e podem tirar todas as dúvidas.
      </p>
    ),
  },
  {
    p: "Como preparar a criança?",
    r: (
      <p>
        Fale da consulta com naturalidade e use palavras simples. Evite prometer que “não vai sentir nada” ou usar o
        dentista como ameaça: a verdade, dita com carinho, ajuda mais. Um horário em que a criança esteja descansada
        também faz diferença.
      </p>
    ),
  },
  {
    p: "Os pais podem acompanhar o atendimento?",
    r: (
      <p>
        Os pais acompanham o atendimento conforme a rotina da clínica. Se tiver alguma preferência, combine ao agendar.
        <Confirmar />
      </p>
    ),
  },
  {
    p: "A clínica atende bebês e adolescentes?",
    r: (
      <p>
        Sim. O atendimento é voltado a bebês, crianças e adolescentes. Se quiser confirmar algo sobre a idade do seu
        filho, é só perguntar pelo WhatsApp.
        <Confirmar texto="confirmar faixa etária" />
      </p>
    ),
  },
  {
    p: "E se o meu filho chorar ou não quiser colaborar?",
    r: (
      <p>
        Acontece, e faz parte. Cada criança reage de um jeito. A proposta é respeitar o tempo dela e conversar com os
        pais sobre como seguir a partir dali.
      </p>
    ),
  },
  {
    p: "Como agendar?",
    r: (
      <p>
        Pelo WhatsApp {CONFIG.whatsappExibicao}. Conte a idade da criança e o motivo da consulta, e o horário é combinado
        com você.
      </p>
    ),
  },
  {
    p: "Onde fica e quais são os horários?",
    r: (
      <p>
        {enderecoCompleto}. {CONFIG.horarios.map((h) => `${h.dias}: ${h.horas}`).join("; ")}.{" "}
        {CONFIG.observacaoHorarios}
        <Confirmar />
      </p>
    ),
  },
  {
    p: "Quais são as formas de pagamento? Atende convênio?",
    r: (
      <p>
        <Pendente>[A CONFIRMAR]</Pendente> Enquanto essa informação não está no site, pergunte pelo WhatsApp.
      </p>
    ),
  },
];

/** Acordeão acessível (botão + região), animado só com opacidade e deslocamento. */
function Item({ p, r, aberto, alternar }: { p: string; r: ReactNode; aberto: boolean; alternar: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-line">
      <h3 className="font-sans text-base tracking-normal">
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          onClick={alternar}
          className="flex min-h-16 w-full items-center justify-between gap-5 py-5 text-left font-display text-[1.2rem] leading-snug text-ink md:text-[1.35rem]"
          style={{ fontVariationSettings: '"SOFT" 100' }}
        >
          <span>{p}</span>
          <span
            aria-hidden
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[rotate,background-color,border-color,color] duration-300 ${
              aberto ? "rotate-45 border-sage-deep bg-sage-deep text-white" : "border-line bg-paper text-ink"
            }`}
          >
            <IconPlus size={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-b`} hidden={!aberto}>
        <div className="surgir max-w-2xl pr-14 pb-6 text-body">{r}</div>
      </div>
    </li>
  );
}

export function Duvidas() {
  const [aberto, setAberto] = useState<number | null>(0);
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="relative py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <CabecalhoSecao
            id="titulo-duvidas"
            eyebrow="Dúvidas frequentes"
            titulo="Perguntas que os pais *costumam* fazer."
          />
        </div>
        <ul className="reveal border-t border-line lg:col-span-8" style={{ ["--d" as string]: "100ms" }}>
          {PERGUNTAS.map((q, i) => (
            <Item key={q.p} p={q.p} r={q.r} aberto={aberto === i} alternar={() => setAberto(aberto === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
