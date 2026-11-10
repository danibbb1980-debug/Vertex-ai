import { CONFIG } from "../config";
import { resumoHorarios } from "../lib/horarios";
import { IconeRelogio } from "../components/Icones";

export function HorariosDestaque() {
  const grupos = resumoHorarios();
  return (
    <section aria-label="Horários de atendimento" className="escuro bg-chumbo text-creme">
      <div className="container-phd flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between md:gap-10">
        <p className="flex items-center gap-3 font-serif text-xl">
          <IconeRelogio className="size-5 text-bronze" />
          Atendimento com <em>hora marcada</em>
        </p>
        <dl className="flex flex-col gap-2 sm:flex-row sm:gap-8">
          {grupos.map((g) => (
            <div key={g.dias} className="flex items-baseline gap-3">
              <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-bronze-claro">{g.dias}</dt>
              <dd className="text-[1.02rem]">{g.aberto ? g.texto : "fechado"}</dd>
            </div>
          ))}
        </dl>
        <a href="#horarios" className="link-sublinhado inline-flex min-h-12 items-center text-[0.95rem] text-creme md:min-h-0">
          Ver horários por dia
        </a>
      </div>
      <p className="sr-only">{CONFIG.avisoFeriados}</p>
    </section>
  );
}
