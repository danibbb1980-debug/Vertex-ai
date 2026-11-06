import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type Variante = "primario" | "secundario" | "claro" | "contorno-claro";

const estilos: Record<Variante, string> = {
  primario: "bg-mauve text-marfim hover:bg-mauve-2",
  secundario: "border border-mauve/35 text-mauve hover:border-mauve bg-transparent",
  claro: "bg-marfim text-cacau hover:bg-blush-2",
  "contorno-claro": "border border-ouro-claro/60 text-marfim hover:border-ouro-claro",
};

/**
 * Botão com efeito sutil: um filete dourado percorre a base no hover/foco
 * (só transform), e a seta desliza alguns pixels.
 */
export function Botao({ href, children, variante = "primario", externo = false, icone, className, ...rest }: {
  href: string; children: ReactNode; variante?: Variante; externo?: boolean; icone?: ReactNode; className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      className={cn(
        "group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-medium tracking-[0.01em] transition-colors duration-300",
        estilos[variante],
        className,
      )}
    >
      {icone}
      <span>{children}</span>
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-2 h-px origin-left scale-x-0 bg-ouro-claro transition-transform duration-500 ease-[var(--ease-suave)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
  );
}
