import type { ReactNode } from "react";

type Variant = "primary" | "soft" | "link";

const variants: Record<Variant, string> = {
  primary:
    "min-h-12 rounded-full bg-teal px-6 py-3 text-white shadow-[0_10px_30px_-14px_rgb(31_107_92/0.8)] hover:bg-teal-dark",
  soft: "min-h-12 rounded-full border border-ink/15 bg-paper px-6 py-3 text-ink hover:border-teal hover:text-teal",
  link: "min-h-11 px-1 text-ink underline decoration-coral-200 decoration-2 underline-offset-6 hover:text-teal hover:decoration-teal",
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

/** Todos os CTAs são links reais; por isso é um Server Component sem JavaScript. */
export function Button({ href, children, variant = "primary", className = "", external = false, icon }: ButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 font-semibold transition-[background-color,color,border-color,transform] duration-300 ease-out-soft active:translate-y-px ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {icon}
      {children}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
