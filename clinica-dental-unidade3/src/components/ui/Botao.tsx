import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variante = "primario" | "claro" | "contorno" | "contornoClaro" | "link";

const estilos: Record<Variante, string> = {
  primario: "btn-brilho bg-teal-600 text-white hover:bg-teal-700 shadow-[0_10px_30px_-12px_rgb(31_95_99/0.7)]",
  claro: "btn-brilho bg-ice text-navy-900 hover:bg-white shadow-[0_10px_30px_-14px_rgb(0_0_0/0.6)]",
  contorno: "border border-navy-900/20 text-navy-900 hover:border-teal-600 hover:text-teal-700 bg-white/40",
  contornoClaro: "border border-white/25 text-white hover:border-gold-300 hover:text-gold-300",
  link: "text-teal-700 underline-offset-4 hover:underline px-0",
};

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: Variante;
  icone?: ReactNode;
  iconeFim?: ReactNode;
  externo?: boolean;
};

export function Botao({ variante = "primario", icone, iconeFim, externo, className, children, ...p }: Props) {
  return (
    <a
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...p}
      className={cn(
        "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-semibold tracking-[0.01em] transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.98]",
        estilos[variante],
        className,
      )}
    >
      {icone}
      <span>{children}</span>
      {iconeFim}
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
