import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso em ms, para escalonar elementos vizinhos. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "figure" | "section";
};

/**
 * Marca o elemento para entrar suavemente quando aparece na tela. O estado
 * oculto só existe com JS ativo (classe .js no <html>), então o conteúdo
 * nunca depende de JavaScript para ser lido.
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
