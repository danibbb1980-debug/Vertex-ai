import type { ReactNode } from "react";
import { Revela } from "./Revela";

type Props = {
  rotulo: string;
  id: string;
  children: ReactNode;
  apoio?: ReactNode;
  className?: string;
  alinhamento?: "esquerda" | "centro";
};

/** Cabeçalho de seção: rótulo em caixa-alta + H2 serifado com uma palavra em itálico. */
export function Titulo({ rotulo, id, children, apoio, className = "", alinhamento = "esquerda" }: Props) {
  return (
    <Revela className={`${alinhamento === "centro" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      <p className="rotulo">{rotulo}</p>
      <h2 id={id} className="mt-5 text-[2.15rem] sm:text-[2.6rem] lg:text-[3.1rem]">
        {children}
      </h2>
      {apoio ? <div className="mt-5 text-[1.0625rem] text-cinza-texto sm:text-lg">{apoio}</div> : null}
    </Revela>
  );
}
