import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "solid" | "solid-light" | "outline" | "outline-light";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] px-6 py-3 text-[0.8rem] font-semibold tracking-[0.08em] uppercase transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-soft active:translate-y-px";

const variants: Record<Variant, string> = {
  solid: "bg-graphite text-paper hover:bg-sage hover:shadow-[0_18px_40px_-18px_rgb(23_25_24/0.8)]",
  "solid-light": "bg-paper text-graphite hover:bg-champagne",
  outline: "border border-graphite/25 text-graphite hover:border-graphite hover:bg-graphite hover:text-paper",
  "outline-light": "border border-paper/25 text-paper hover:border-paper hover:bg-paper hover:text-graphite",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Link externo: abre em nova aba com rel seguro e avisa o leitor de tela. */
  external?: boolean;
  icon?: ReactNode;
};

/**
 * Todos os CTAs do site são links reais (âncoras ou URLs externas): Server
 * Component, sem JavaScript.
 */
export function Button({ href, children, variant = "solid", className = "", external = false, icon }: ButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {icon}
      <span>{children}</span>
      {!icon && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
