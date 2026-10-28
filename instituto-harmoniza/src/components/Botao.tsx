import type { AnchorHTMLAttributes, ReactNode } from "react";
import { IconeSeta, IconeWhatsApp } from "./Icones";
import { Magnetico } from "./Magnetico";

type Variante = "primario" | "secundario" | "claro" | "contorno-claro";

const estilos: Record<Variante, string> = {
  primario: "bg-tinta text-marfim hover:bg-noite-2",
  secundario: "border border-tinta/25 text-tinta hover:border-tinta/60 bg-transparent",
  claro: "bg-marfim text-tinta hover:bg-branco",
  "contorno-claro": "border border-marfim/35 text-marfim hover:border-marfim/80",
};

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: Variante;
  icone?: "whatsapp" | "seta" | ReactNode;
  magnetico?: boolean;
  externo?: boolean;
};

export function Botao({ variante = "primario", icone, magnetico = false, externo = false, className = "", children, ...p }: Props) {
  const iconeEl =
    icone === "whatsapp" ? <IconeWhatsApp tamanho={17} /> : icone === "seta" ? <IconeSeta tamanho={17} /> : icone;
  const preenchido = variante === "primario" || variante === "claro";

  const link = (
    <a
      {...p}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full py-2 pr-2 pl-6 text-[0.95rem] font-medium tracking-[0.01em] transition-[background-color,border-color,color] duration-300 ${
        iconeEl ? "" : "pr-6"
      } ${estilos[variante]} ${className}`}
    >
      <span>{children}</span>
      {iconeEl && (
        <span
          className={`grid size-9 place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-suave)] group-hover:translate-x-0.5 ${
            preenchido
              ? variante === "primario"
                ? "bg-marfim/12 text-champanhe"
                : "bg-tinta/[0.06] text-bronze"
              : variante === "secundario"
                ? "bg-tinta/[0.05]"
                : "bg-marfim/10"
          }`}
        >
          {iconeEl}
        </span>
      )}
    </a>
  );

  return magnetico ? <Magnetico>{link}</Magnetico> : link;
}
