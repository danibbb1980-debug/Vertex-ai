import { Fragment } from "react";
import { cn } from "../../lib/cn";

/** Converte "Texto com *ênfase*." em JSX com a palavra em itálico da marca. */
export function comEnfase(texto: string, classeEnfase = "text-teal-700") {
  return texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith("*") ? (
      <em key={i} className={cn("enfase", classeEnfase)}>
        {parte.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{parte}</Fragment>
    ),
  );
}

export function TituloSecao({
  rotulo,
  titulo,
  texto,
  escuro,
  className,
  id,
}: {
  rotulo: string;
  titulo: string;
  texto?: string;
  escuro?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className={cn("rotulo flex items-center gap-3", escuro ? "text-gold-300" : "text-teal-700")}>
        <span aria-hidden="true" className={cn("h-px w-8", escuro ? "bg-gold-400" : "bg-gold-500")} />
        {rotulo}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-4 text-[2.1rem] leading-[1.08] sm:text-5xl",
          escuro ? "text-white" : "text-navy-900",
        )}
      >
        {comEnfase(titulo, escuro ? "text-teal-300" : "text-teal-700")}
      </h2>
      {texto && (
        <p className={cn("mt-5 text-[1.05rem] leading-relaxed", escuro ? "text-white/75" : "text-ink-soft")}>{texto}</p>
      )}
    </div>
  );
}
