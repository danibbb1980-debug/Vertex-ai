import { useId, useState } from "react";
import { atendimentosAtivos, msgAtendimento } from "../config";
import { BotaoWhats, Hora } from "./ui";

const EXTENSO = ["", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez"];

/**
 * Índice editorial numerado. Base: "Editorial service list" (21st.dev, ibrandify),
 * adaptado: tipografia de display, cantos retos, fundo ardósia, título lateral fixo
 * e um botão de agendamento com mensagem própria em cada linha.
 */
export default function Atendimentos({ hora }: { hora: string }) {
  const lista = atendimentosAtivos();
  const [aberto, setAberto] = useState<number>(-1);
  const id = useId();
  if (!lista.length) return null;
  const n = lista.length;
  const qtd = n <= 10 ? EXTENSO[n] : String(n);

  return (
    <section id="atendimentos" className="tema-manha relative border-t border-grafite/15" aria-labelledby="t-atend">
      <div className="mx-auto grid max-w-[1240px] gap-y-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-40">
            <Hora hora={hora} />
            <h2 id="t-atend" className="titulo mt-6 text-[clamp(2.6rem,5.4vw,4.2rem)]">
              Atendimentos de <span className="enfase">estética</span> e <span className="whitespace-nowrap">bem-estar</span>
            </h2>
            <p className="mt-6 max-w-[22rem] text-cinza">
              {qtd} {n === 1 ? "atendimento" : "atendimentos"}, todos com horário marcado e uma conversa antes de
              começar.
            </p>
          </div>
        </div>

        <ol className="border-b border-grafite/25 lg:col-span-7">
          {lista.map((a, i) => {
            const open = aberto === i;
            return (
              <li key={a.id} className="border-t border-grafite/25">
                <h3>
                  <button
                    type="button"
                    id={`${id}-b-${i}`}
                    aria-expanded={open}
                    aria-controls={`${id}-p-${i}`}
                    onClick={() => setAberto(open ? -1 : i)}
                    className="group flex w-full items-center gap-4 py-6 text-left sm:gap-8 sm:py-8"
                  >
                    <span className="tab w-8 shrink-0 text-sm text-cinza sm:w-10">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`titulo flex-1 text-[clamp(1.9rem,4.2vw,3.1rem)] transition-transform duration-300 ease-[var(--ease-lento)] ${
                        open ? "translate-x-2" : "group-hover:translate-x-2"
                      }`}
                    >
                      {a.nome}
                    </span>
                    <span aria-hidden="true" className="relative size-5 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-5 bg-ocre-escuro" />
                      <span
                        className={`absolute left-1/2 top-0 h-5 w-px bg-ocre-escuro transition-transform duration-300 ${
                          open ? "scale-y-0" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-p-${i}`}
                  role="region"
                  aria-labelledby={`${id}-b-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-lento)] ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                  inert={!open}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-9 pl-12 sm:grid-cols-[1fr_auto] sm:items-end sm:pl-[4.5rem]">
                      <div className="max-w-[30rem]">
                        <p className="text-[1.08rem]">{a.descricao}</p>
                        <p className="mt-3 text-sm text-cinza">A indicação depende de avaliação individual.</p>
                      </div>
                      <BotaoWhats
                        texto="Agendar"
                        mensagem={msgAtendimento(a.nome)}
                        variante="btn-cheio"
                        rotuloAria={`Agendar ${a.nome.toLowerCase()} pelo WhatsApp`}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
