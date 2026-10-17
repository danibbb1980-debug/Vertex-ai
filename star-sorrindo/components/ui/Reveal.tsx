import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso em milissegundos, para escalonar elementos vizinhos. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "figure" | "article";
};

/**
 * Server Component: só marca o elemento. O estado escondido existe apenas
 * quando o JS está ativo (ver globals.css), então nada depende de JavaScript
 * para ser lido.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const Tag = as;
  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
