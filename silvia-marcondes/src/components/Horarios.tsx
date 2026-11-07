import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CONFIG, type Dia } from "../config";
import { DIAS_LONGOS, curto, hojeEmSP, horarioDoDia, minutos, resumoFds } from "../lib/horarios";
import { Revelar } from "./Revelar";
import { ComEnfase } from "./TextReveal";

const ORDEM: Dia[] = [1, 2, 3, 4, 5, 6, 0];
const INI = 6 * 60;
const FIM = 21 * 60;
const pct = (m: number) => ((m - INI) / (FIM - INI)) * 100;

export function Horarios() {
  const reduced = useReducedMotion();
  const [hoje, setHoje] = useState<Dia | null>(null);
  useEffect(() => setHoje(hojeEmSP().dia), []);
  const semana = horarioDoDia(1);
  const fds = resumoFds();

  const destaques = [
    semana && { valor: curto(semana.abre), texto: "abertura de segunda a sexta" },
    semana && { valor: curto(semana.fecha), texto: "fechamento de segunda a sexta" },
    fds && { valor: `${curto(fds.h.abre)}-${curto(fds.h.fecha)}`, texto: fds.longo },
  ].filter(Boolean) as { valor: string; texto: string }[];

  return (
    <section id="horarios" aria-labelledby="titulo-horarios" className="relative bg-nevoa/70 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="rotulo">Horários</p>
            <h2 id="titulo-horarios" className="mt-4 font-serif text-[2.1rem] leading-[1.08] tracking-[-0.015em] sm:text-5xl">
              <ComEnfase text="Antes ou depois do trabalho, e também no *fim de semana*." />
            </h2>
          </div>
          <dl className="grid grid-cols-3 gap-3 sm:gap-4">
            {destaques.map((d) => (
              <div key={d.texto} className="flex flex-col rounded-xl2 bg-porcelana/80 p-4 shadow-suave sm:p-5">
                <dt className="order-2 mt-1 text-[0.8rem] leading-snug text-tinta-suave sm:text-sm">{d.texto}</dt>
                <dd className="order-1 whitespace-nowrap font-serif text-[1.45rem] leading-tight text-ameixa sm:text-[2.2rem]">{d.valor}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Revelar className="mt-12 rounded-xl3 bg-porcelana p-5 shadow-cartao sm:p-8">
          <div className="relative">
            {/* Régua de horas */}
            <div aria-hidden="true" className="ml-[5.5rem] flex justify-between pb-3 text-[0.72rem] font-medium text-tinta-suave sm:ml-32">
              {[6, 9, 12, 15, 18, 21].map((h) => (
                <span key={h} className="w-0 whitespace-nowrap text-center">
                  <span className="-ml-3 inline-block w-6">{h}h</span>
                </span>
              ))}
            </div>
            <ul className="space-y-2.5">
              {ORDEM.map((dia, i) => {
                const h = horarioDoDia(dia);
                const ehHoje = hoje === dia;
                return (
                  <li key={dia} className="flex items-center gap-3">
                    <span className={`w-[5.5rem] shrink-0 text-[0.92rem] sm:w-32 ${ehHoje ? "font-semibold text-ameixa" : "text-grafite"}`}>
                      {DIAS_LONGOS[dia]}
                      {ehHoje ? <span className="ml-1.5 rounded-full bg-pessego px-1.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wider text-grafite">hoje</span> : null}
                    </span>
                    <span className="relative h-9 flex-1 rounded-full bg-nevoa-2">
                      {h ? (
                        <motion.span
                          className={`absolute inset-y-1 flex origin-left items-center justify-between rounded-full px-2.5 text-[0.74rem] sm:px-3.5 sm:text-[0.8rem] font-semibold ${
                            dia === 0 || dia === 6 ? "bg-pessego text-grafite" : "bg-ameixa text-porcelana"
                          }`}
                          style={{ left: `${pct(minutos(h.abre))}%`, width: `${pct(minutos(h.fecha)) - pct(minutos(h.abre))}%` }}
                          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
                          whileInView={{ scaleX: 1, opacity: 1 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: i * 0.06 }}
                        >
                          <span>{curto(h.abre)}</span>
                          <span>{curto(h.fecha)}</span>
                        </motion.span>
                      ) : (
                        <span className="absolute inset-0 flex items-center px-4 text-[0.8rem] text-tinta-suave">Sem atendimento</span>
                      )}
                      {h ? <span className="sr-only">das {curto(h.abre)} às {curto(h.fecha)}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          {CONFIG.avisoHorarios ? <p className="mt-6 text-sm text-tinta-suave">{CONFIG.avisoHorarios}</p> : null}
        </Revelar>
      </div>
      <span data-trace="horarios" className="absolute right-[4%] top-[18%] size-px" />
    </section>
  );
}
