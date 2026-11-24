import { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { agoraSP, DIAS, escala, horaFala, horaNum } from "../tempo";
import { Arco, Hora, useNaTela } from "./ui";

const ORDEM = [1, 2, 3, 4, 5, 6, 0];
const NOME = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/** Régua horizontal de 08 a 21, reaproveitando as marcas do relógio de sol. */
export default function Horarios({ hora }: { hora: string }) {
  const { ini, fim } = escala();
  const [agora, setAgora] = useState(() => agoraSP());
  const [ref, visto] = useNaTela<HTMLDivElement>();
  useEffect(() => {
    const t = setInterval(() => setAgora(agoraSP()), 60_000);
    return () => clearInterval(t);
  }, []);
  const pct = (h: number) => ((h - ini) / (fim - ini)) * 100;
  const horas = Array.from({ length: fim - ini + 1 }, (_, i) => ini + i);

  return (
    <section id="horarios" aria-labelledby="t-horarios" className="tema-tarde">
      <Arco className="mx-auto max-w-[1240px] px-5 sm:px-8" />
      <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-14 sm:px-8 sm:pb-32">
      <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <Hora hora={hora} />
          <h2 id="t-horarios" className="titulo mt-6 text-[clamp(2.6rem,5.4vw,4.2rem)]">
            O dia <span className="enfase">inteiro</span> na agenda
          </h2>
        </div>
        <p className="max-w-[30rem] self-end text-grafite/85 lg:col-span-6 lg:col-start-7">
          Nos dias de semana, o espaço abre às 8h e só fecha às 21h. Dá para encaixar o atendimento antes do
          trabalho, no almoço ou depois do expediente.
        </p>
      </div>

      <div ref={ref} className="mt-16">
        {/* Escala */}
        <div className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[8rem_1fr_7.5rem]" aria-hidden="true">
          <span />
          <div className="relative h-6">
            {horas.map((h) => (
              <span
                key={h}
                className={`tab absolute -translate-x-1/2 text-[0.7rem] text-cinza ${h % 2 === 1 && h !== fim ? "hidden sm:block" : ""} ${h === fim - 1 ? "!hidden sm:!block" : ""}`}
                style={{ left: `${pct(h)}%` }}
              >
                {String(h).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>

        <ul className="border-b border-grafite/20">
          {ORDEM.map((d, idx) => {
            const f = CONFIG.horarios.dias[d];
            const hoje = d === agora.dia;
            const aberto = f && agora.hora >= horaNum(f.abre) && agora.hora < horaNum(f.fecha);
            return (
              <li
                key={d}
                className={`grid grid-cols-[5.5rem_1fr] items-center gap-y-1 border-t border-grafite/20 py-4 sm:grid-cols-[8rem_1fr_7.5rem] sm:py-5 ${
                  hoje ? "bg-white/35" : ""
                }`}
              >
                <span className="pl-1 text-[0.98rem]">
                  {NOME[d]}
                  {hoje && <span className="block text-xs text-ocre-escuro">hoje</span>}
                </span>
                <div className="relative h-7" aria-hidden="true">
                  {horas.map((h) => (
                    <span
                      key={h}
                      className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-grafite/25"
                      style={{ left: `${pct(h)}%` }}
                    />
                  ))}
                  {f && (
                    <span
                      className="absolute top-1/2 h-2.5 -translate-y-1/2 origin-left bg-ardosia transition-transform duration-[1400ms] ease-[var(--ease-lento)]"
                      style={{
                        left: `${pct(horaNum(f.abre))}%`,
                        width: `${pct(horaNum(f.fecha)) - pct(horaNum(f.abre))}%`,
                        transform: visto ? "scaleX(1)" : "scaleX(0)",
                        transitionDelay: `${idx * 70}ms`,
                      }}
                    />
                  )}
                  {hoje && aberto && (
                    <span
                      className="absolute top-0 h-full w-[2px] bg-ocre"
                      style={{ left: `${pct(agora.hora)}%` }}
                      title="agora"
                    />
                  )}
                </div>
                <span className="tab col-start-2 text-sm text-grafite/85 sm:col-start-auto sm:text-right sm:text-[0.98rem]">
                  {f ? `${horaFala(f.abre)} às ${horaFala(f.fecha)}` : "Fechado"}
                  <span className="sr-only">{` (${DIAS[d]})`}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-sm text-cinza">{CONFIG.horarios.aviso}</p>
      </div>
      </div>
    </section>
  );
}
