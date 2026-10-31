import { createElement, type ReactNode, type CSSProperties, Fragment } from 'react';
import { useInView } from '../lib/useInView';

export type Parte = string | { em: string };

/**
 * Título com revelação palavra a palavra (máscara vertical).
 * Adaptado do conceito "Vertical Cut Reveal" (21st.dev): tipografia serifada,
 * uma palavra em ênfase dourada, só transform, e respeita prefers-reduced-motion.
 */
export function TextReveal({
  as = 'h2',
  parts,
  className = '',
  mode = 'view',
  id,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  parts: Parte[];
  className?: string;
  mode?: 'load' | 'view';
  id?: string;
}) {
  const [ref, inView] = useInView<HTMLHeadingElement>();
  let i = 0;
  const nodes: ReactNode[] = [];
  parts.forEach((p, pi) => {
    const isEm = typeof p !== 'string';
    const text = isEm ? p.em : p;
    const tokens = text.split(/(\s+)/);
    tokens.forEach((t, ti) => {
      if (!t) return;
      if (/^\s+$/.test(t)) {
        nodes.push(' ');
        return;
      }
      const inner = (
        <span className="tr-inner" style={{ '--i': i++ } as CSSProperties}>
          {t}
        </span>
      );
      nodes.push(
        <span className="tr-word" key={`${pi}-${ti}`}>
          {isEm ? <em className="enfase">{inner}</em> : inner}
        </span>,
      );
    });
  });
  return createElement(
    as,
    {
      ref: mode === 'view' ? ref : undefined,
      id,
      className: `${mode === 'load' ? 'tr-load' : 'tr-view'} ${inView ? 'is-in' : ''} ${className}`,
    },
    <Fragment>{nodes}</Fragment>,
  );
}

/** Entrada suave (opacidade + leve subida) quando o bloco entra na tela. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'p' | 'figure';
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return createElement(
    as,
    { ref, className: `fade-up ${inView ? 'is-in' : ''} ${className}`, style: { '--d': `${delay}ms` } as CSSProperties },
    children,
  );
}

/** Anéis dourados finos: o círculo do "C" do monograma como motivo gráfico. */
export function Rings({ className = '', strong = false }: { className?: string; strong?: boolean }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false" fill="none">
      <circle cx="200" cy="200" r="196" stroke="currentColor" strokeOpacity={strong ? 0.55 : 0.35} strokeWidth="1" />
      <circle cx="200" cy="200" r="160" stroke="currentColor" strokeOpacity={strong ? 0.35 : 0.22} strokeWidth="1" strokeDasharray="2 6" />
      <path d="M200 4a196 196 0 0 1 196 196" stroke="currentColor" strokeOpacity={strong ? 0.9 : 0.6} strokeWidth="1.5" />
    </svg>
  );
}
