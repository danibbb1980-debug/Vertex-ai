import type { ReactNode } from "react";
import { TituloEnfase } from "./TextReveal";

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  rotulo?: string;
};

export function Secao({ id, children, className = "", rotulo }: Props) {
  return (
    <section id={id} data-linha aria-labelledby={id ? `${id}-titulo` : undefined} aria-label={id ? undefined : rotulo} className={`relative z-[1] py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function Cabecalho({
  id,
  eyebrow,
  titulo,
  texto,
  centro,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  titulo: string;
  texto?: ReactNode;
  centro?: boolean;
  className?: string;
}) {
  return (
    <div className={`revelar ${centro ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id ? `${id}-titulo` : undefined} className="titulo-secao mt-4">
        <TituloEnfase texto={titulo} />
      </h2>
      {texto ? <div className="mt-5 text-lg text-taupe-texto md:text-[1.15rem]">{texto}</div> : null}
    </div>
  );
}
