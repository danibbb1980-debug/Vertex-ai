import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "light" | "ghostLight";

const styles: Record<Variant, string> = {
  solid: "bg-tinta text-porcelana hover:bg-tinta-2",
  outline: "border border-tinta/25 text-tinta hover:border-tinta/60",
  light: "bg-porcelana text-tinta hover:bg-rose",
  ghostLight: "border border-porcelana/30 text-porcelana hover:border-porcelana/70",
};

export function Button({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.95rem] font-medium tracking-[0.01em] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-px ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
