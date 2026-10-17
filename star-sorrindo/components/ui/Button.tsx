import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Variant = "primary" | "gold" | "outline" | "outline-light" | "text";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-center text-[0.92rem] sm:whitespace-nowrap font-semibold tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-400 ease-out-soft active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-ivory hover:bg-navy-3 hover:shadow-[0_14px_34px_-14px_rgb(14_29_54/0.55)]",
  gold: "bg-gold text-navy hover:bg-[#d4b887] hover:shadow-[0_14px_34px_-14px_rgb(197_165_114/0.6)]",
  outline: "border border-navy/25 text-navy hover:border-navy hover:bg-navy/[0.03]",
  "outline-light": "border border-ivory/30 text-ivory hover:border-gold hover:text-gold",
  text: "min-h-11 rounded-none px-0 text-navy",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Link externo: abre em nova aba com rel seguro e avisa o leitor de tela. */
  external?: boolean;
  icon?: ReactNode;
  /** Seta à direita para links internos. */
  arrow?: boolean;
};

/**
 * Todos os CTAs do site são links reais (âncoras ou URLs externas), por isso
 * este é um Server Component, sem JavaScript.
 */
export function Button({ href, children, variant = "primary", className = "", external = false, icon, arrow = false }: ButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {icon}
      <span className={variant === "text" ? "link-line" : undefined}>{children}</span>
      {arrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-400 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
      )}
      {external && !icon && !arrow && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-400 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
