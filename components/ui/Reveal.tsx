import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso do stagger, em segundos (mantém a mesma assinatura de antes). */
  delay?: number;
  className?: string;
  /** Renderiza como <li> quando usado dentro de <ul>/<ol>. */
  as?: "div" | "li";
};

/**
 * Revelação no scroll, sem JavaScript no bundle.
 *
 * Este é um Server Component: não envia nenhum JS próprio. Ele só marca o
 * elemento com a classe `.reveal`; o estado escondido é aplicado por CSS
 * apenas quando `data-js="1"` está presente no <html>, e o
 * RevealObserver (um único observer para a página inteira) adiciona `.is-in`
 * quando o elemento entra no viewport.
 *
 * Consequência importante: sem JS, ou antes da hidratação, todo o conteúdo
 * está visível. Nada na página depende de JavaScript para ser lido.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const Tag = as;
  const style = delay
    ? ({ "--reveal-delay": `${Math.round(delay * 1000)}ms` } as CSSProperties)
    : undefined;

  return (
    <Tag className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
