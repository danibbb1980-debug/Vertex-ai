import type { ReactNode } from "react";

type Variante = "primario" | "secundario" | "claro" | "contorno-claro";

const estilos: Record<Variante, string> = {
  primario: "bg-ameixa text-porcelana shadow-suave hover:bg-[#3e2b4b]",
  secundario: "bg-transparent text-ameixa ring-1 ring-inset ring-ameixa/35 hover:bg-nevoa/60",
  claro: "bg-porcelana text-ameixa hover:bg-white",
  "contorno-claro": "bg-transparent text-porcelana ring-1 ring-inset ring-porcelana/40 hover:bg-white/10",
};

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  externo?: boolean;
  className?: string;
  icone?: ReactNode;
  ariaLabel?: string;
};

export function Botao({ href, children, variante = "primario", externo, className = "", icone, ariaLabel }: Props) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`btn-brilho inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.98rem] font-semibold transition-[background-color,transform] duration-300 ease-(--ease-suave) active:scale-[0.98] ${estilos[variante]} ${className}`}
    >
      {icone}
      <span>{children}</span>
    </a>
  );
}
