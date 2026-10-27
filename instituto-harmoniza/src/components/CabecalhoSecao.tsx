import type { ReactNode } from "react";
import { Revelar } from "./Revelar";

/** Número + rótulo com filete + título serif com uma palavra em itálico. */
export function CabecalhoSecao({
  numero,
  rotulo,
  titulo,
  id,
  escuro = false,
  children,
  className = "",
}: {
  numero: string;
  rotulo: string;
  titulo: ReactNode;
  id?: string;
  escuro?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Revelar className={`flex items-center gap-4 ${escuro ? "text-champanhe" : "text-bronze"}`}>
        <span className="rotulo tabular-nums">{numero}</span>
        <span aria-hidden="true" className="filete w-10" />
        <span className="rotulo">{rotulo}</span>
      </Revelar>
      <Revelar atraso={80}>
        <h2 id={id} className="titulo-display mt-6 text-[clamp(2.5rem,6.2vw,4.75rem)]">
          {titulo}
        </h2>
      </Revelar>
      {children && (
        <Revelar atraso={160} className={`texto-corrido mt-6 max-w-[56ch] text-[1.05rem] ${escuro ? "text-marfim/75" : "text-suave"}`}>
          {children}
        </Revelar>
      )}
    </div>
  );
}
