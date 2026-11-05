import { useId, useState, type ReactNode } from "react";
import { m } from "motion/react";
import { Plus } from "lucide-react";
import { CONFIG } from "../config";
import { RevealTitle } from "../components/Reveal";
import { faixa } from "../lib/horarios";
import { atendimentosVisiveis, FRENTES } from "./Atendimentos";
import { waLink } from "../lib/whatsapp";
import { EASE, useReduced } from "../lib/motion";

function perguntas(): { q: string; a: ReactNode }[] {
  const lista = atendimentosVisiveis();
  const temLed = lista.some((a) => a.id === "depilacao-led");
  const out: { q: string; a: ReactNode }[] = [
    {
      q: "Preciso agendar antes de ir?",
      a: (
        <p>
          Sim. O atendimento é com hora marcada. Você pode pedir um horário pelo{" "}
          <a className="text-rose-700 underline underline-offset-4" href={waLink()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{" "}
          ou pelo formulário{CONFIG.secoes.agendamento ? <> em <a className="text-rose-700 underline underline-offset-4" href="#agendar">Solicitar agendamento</a></> : null}. A equipe responde
          com a disponibilidade.
        </p>
      ),
    },
    {
      q: "Como é a primeira avaliação?",
      a: (
        <p>
          É uma conversa individual. Você conta o que procura, falamos sobre o seu histórico de saúde e os cuidados que já faz, e a pele
          da região é observada. Ao final, você recebe a explicação do que pode ser indicado, ou não, no seu caso.
        </p>
      ),
    },
  ];
  if (lista.length) {
    out.push({
      q: "Quais atendimentos a clínica oferece?",
      a: (
        <div className="space-y-2">
          {FRENTES.map((f) => {
            const itens = lista.filter((a) => a.frente === f.id);
            return itens.length ? (
              <p key={f.id}>
                <strong className="font-semibold text-ink">{f.titulo}:</strong> {itens.map((a) => a.nome).join(", ")}.
              </p>
            ) : null;
          })}
          <p>{CONFIG.avisoAvaliacao}</p>
        </div>
      ),
    });
  }
  if (CONFIG.horarios.length) {
    out.push({
      q: "Quais são os horários de atendimento?",
      a: (
        <p>
          {CONFIG.horarios.map((h) => `${h.rotulo}, das ${faixa(h)}`).join("; ")}
          {CONFIG.fechado.length ? `. ${CONFIG.fechado.map((f) => f.rotulo).join(", ")}: fechado` : ""}. {CONFIG.avisoHorarios}
        </p>
      ),
    });
  }
  out.push(
    {
      q: "Onde fica a clínica?",
      a: (
        <p>
          {CONFIG.endereco.rua}, {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, CEP {CONFIG.endereco.cep}.{" "}
          <a className="text-rose-700 underline underline-offset-4" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">
            Ver no Google Maps
          </a>
          .
        </p>
      ),
    },
    {
      q: "O que levar na avaliação?",
      a: (
        <p>
          Se você usa medicamentos, vale levar a lista com os nomes. Informações sobre alergias e sobre procedimentos estéticos que já fez
          também ajudam na conversa.
        </p>
      ),
    },
  );
  if (temLed) {
    out.push({
      q: "Como funciona a depilação a LED, em linguagem simples?",
      a: (
        <p>
          É uma depilação feita com um aparelho que emite luz sobre a área escolhida. Antes de começar, a avaliação considera o tom da
          pele, o tipo de pelo e o seu histórico. A equipe explica os cuidados antes e depois de cada sessão e o intervalo entre elas.
        </p>
      ),
    });
  }
  out.push(
    {
      q: "Todo atendimento serve para qualquer pessoa?",
      a: (
        <p>
          Não. Cada procedimento tem indicações e contraindicações, e algumas situações de saúde pedem cuidado ou outro caminho. Por isso
          a avaliação individual vem antes de qualquer decisão.
        </p>
      ),
    },
    {
      q: "Posso tirar dúvidas de saúde pelo WhatsApp?",
      a: (
        <p>
          O WhatsApp serve para agendar e para dúvidas gerais. Informações de saúde, como doenças, medicamentos e alergias, são
          conversadas no atendimento, com privacidade.
        </p>
      ),
    },
    {
      q: "Posso escolher o dia e o horário?",
      a: (
        <p>
          Pode indicar a sua preferência. O dia e o horário escolhidos no formulário são preferências: a clínica confirma a
          disponibilidade pelo WhatsApp.
        </p>
      ),
    },
  );
  return out;
}

function Item({ q, a, open, onToggle }: { q: string; a: ReactNode; open: boolean; onToggle: () => void }) {
  const id = useId();
  const reduce = useReduced();
  return (
    <li className="border-b border-ink/12">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
        >
          <span className="title text-[1.45rem] text-ink transition-colors group-hover:text-rose-700 md:text-[1.7rem]">{q}</span>
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ${
              open ? "rotate-45 border-rose-700 bg-rose-700 text-ivory" : "border-ink/20 text-ink group-hover:border-rose-700"
            }`}
            aria-hidden="true"
          >
            <Plus size={16} />
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open}>
        <m.div
          key={String(open)}
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="max-w-[46rem] pb-7 pr-12 text-ink-soft"
        >
          {a}
        </m.div>
      </div>
    </li>
  );
}

/** Acordeão acessível (adaptado do "FAQ Accordion Reveal" do 21st.dev). */
export function Duvidas() {
  const [open, setOpen] = useState<number | null>(0);
  if (!CONFIG.secoes.duvidas) return null;
  const list = perguntas();
  return (
    <section id="duvidas" data-line="right" aria-labelledby="duvidas-titulo" className="on-light relative bg-ivory pb-24 pt-8 md:pb-36 md:pt-12">
      <div className="container-site relative z-[2] grid gap-12 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
        <div className="md:sticky md:top-[calc(var(--banner-h)+var(--header-h)+48px)] md:self-start">
          <div className="filete mb-14 md:hidden" aria-hidden="true" />
          <p className="eyebrow mb-6 text-rose-700">Dúvidas frequentes</p>
          <RevealTitle id="duvidas-titulo" text="Perguntas que costumam *chegar*." className="text-[2.6rem] text-ink md:text-[3.4rem]" />
          <p className="mt-6 text-ink-soft">
            Não encontrou a sua?{" "}
            <a className="text-rose-700 underline underline-offset-4" href={waLink()} target="_blank" rel="noopener noreferrer">
              Fale com a clínica
            </a>
            .
          </p>
        </div>
        <ul className="border-t border-ink/12">
          {list.map((x, i) => (
            <Item key={x.q} q={x.q} a={x.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
