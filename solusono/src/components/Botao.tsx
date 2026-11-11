import type { ReactNode } from "react";

type Variante = "primario" | "secundario" | "claro" | "contorno-claro";

const estilos: Record<Variante, { base: string; fundo: string }> = {
  primario: { base: "bg-brand text-white", fundo: "bg-ink" },
  secundario: { base: "border border-ink/25 text-ink", fundo: "bg-tint" },
  claro: { base: "bg-white text-ink", fundo: "bg-tint" },
  "contorno-claro": { base: "border border-white/40 text-white", fundo: "bg-white/10" },
};

/**
 * Botão com efeito sutil: um preenchimento desliza da esquerda no hover
 * (adaptado de um botão "magnético" do 21st.dev, sem o deslocamento do cursor).
 */
export function Botao({
  href,
  children,
  variante = "primario",
  icone,
  externo = false,
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variante?: Variante;
  icone?: ReactNode;
  externo?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const e = estilos[variante];
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-semibold tracking-[-0.005em] transition-colors duration-300 ${e.base} ${className}`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-calma)] group-hover:scale-x-100 ${e.fundo}`}
      />
      {icone}
      <span>{children}</span>
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
