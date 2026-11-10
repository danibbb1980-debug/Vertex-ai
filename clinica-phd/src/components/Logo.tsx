import { CONFIG } from "../config";
import { Monograma } from "./Monograma";

type Props = { tom?: "claro" | "escuro"; className?: string };

/** Monograma + nome em tipografia. tom="claro" para fundos claros, "escuro" para fundos escuros. */
export function Logo({ tom = "claro", className = "" }: Props) {
  const corMonograma = tom === "claro" ? "#8A6A44" : "#C49A6C";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monograma className="h-9 w-auto shrink-0" cor={corMonograma} espessura={12} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.35rem] tracking-[-0.01em] ${tom === "claro" ? "text-grafite" : "text-creme"}`}>
          {CONFIG.nome}
        </span>
      </span>
    </span>
  );
}
