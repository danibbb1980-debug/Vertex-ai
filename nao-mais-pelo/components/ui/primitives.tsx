import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Seta fina usada em botões e links. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 10" width="22" height="10" fill="none" aria-hidden="true" className={`btn-arrow ${className}`}>
      <path d="M0 5h20.5M16.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "figure" | "p" | "span";
  kind?: "fade" | "image";
};

/** Marca o elemento para a revelação ao rolar (ver ClientEnhancements e globals.css). */
export function Reveal({ children, delay = 0, className = "", as = "div", kind = "fade" }: RevealProps) {
  const Tag = as;
  const style = delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag className={`${kind === "image" ? "reveal-image" : "reveal"} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

/**
 * Título com linhas reveladas por máscara. Cada item de `lines` vira uma linha;
 * use <em> dentro das linhas para o itálico editorial.
 */
export function RevealTitle({
  lines,
  as = "h2",
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}) {
  const Tag = as;
  const style = delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag className={`reveal-lines ${className}`} style={style}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ "--i": i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Rótulo de seção no estilo de revista: "N° 02 — Tecnologia". */
export function Eyebrow({
  index,
  children,
  className = "",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      {index ? <span className="tabular-nums">N° {index}</span> : null}
      {index ? <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" /> : null}
      <span>{children}</span>
    </p>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid-dark" | "solid-light" | "outline-light" | "outline-dark" | "green";
  className?: string;
  external?: boolean;
  arrow?: boolean;
};

/** Link com aparência de botão. Links externos abrem em nova aba. */
export function ButtonLink({ href, children, variant = "solid-dark", className = "", external, arrow = true }: ButtonProps) {
  const cls = `btn btn-${variant} ${className}`;
  const isExternal = external ?? /^https?:\/\//.test(href);
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </>
  );
  if (isExternal) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
