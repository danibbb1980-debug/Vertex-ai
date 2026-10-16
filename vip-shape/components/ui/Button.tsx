import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-out-soft active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "chamfer-sm bg-orange text-ink hover:bg-orange-hot hover:shadow-[0_10px_40px_-10px_rgb(255_90_31/0.7)]",
  outline: "border border-white/25 text-white hover:border-orange hover:text-orange",
  ghost: "px-0 text-white underline-offset-8 hover:text-orange hover:underline",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Link externo: abre em nova aba com rel seguro e avisa o leitor de tela. */
  external?: boolean;
  icon?: ReactNode;
  ariaLabel?: string;
};

/**
 * Todos os CTAs do site são links reais (âncoras ou URLs externas), por isso
 * este é um Server Component sem JavaScript.
 */
export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  icon,
  ariaLabel,
}: ButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {icon}
      <span className="inline-flex items-center gap-2">{children}</span>
      {external && !icon && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
