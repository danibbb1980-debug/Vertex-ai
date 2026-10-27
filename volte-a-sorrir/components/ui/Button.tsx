import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "sun" | "ghost-light";

const styles: Record<Variant, string> = {
  // Azul-marinho sobre amarelo/papel: o CTA de maior contraste.
  primary:
    "bg-navy text-white hover:bg-navy-deep shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_10px_24px_-14px_rgba(14,40,55,0.7)]",
  secondary: "border border-navy/25 text-navy hover:border-navy hover:bg-navy/[0.04]",
  sun: "bg-sun text-navy-deep hover:bg-sun-deep",
  "ghost-light": "border border-white/30 text-white hover:border-white hover:bg-white/[0.06]",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function ButtonLink({ href, children, variant = "primary", icon, external, className = "", ariaLabel }: ButtonLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex min-h-13 cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 text-[0.975rem] font-semibold tracking-[-0.005em] transition-[background-color,border-color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] ${styles[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
}
