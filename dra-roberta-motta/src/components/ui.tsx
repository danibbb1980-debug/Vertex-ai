import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { waLink } from '../config';

export function useReducedMotion() {
  const [r, setR] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return r;
}

/** Marca o elemento com .on quando entra na tela (numeração que acende). */
export function useAcende<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -25% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

export function Numero({ n, className = '' }: { n: string; className?: string }) {
  const [ref, on] = useAcende<HTMLSpanElement>();
  return (
    <span ref={ref} aria-hidden="true" className={`num acende ${on ? 'on' : ''} ${className}`}>
      {n}
    </span>
  );
}

export function BotaoWhats({
  msg,
  children = 'Agendar avaliação',
  variante = 'primario',
  className = '',
  rotulo,
}: {
  msg?: string;
  children?: ReactNode;
  variante?: 'primario' | 'secundario' | 'claro' | 'contorno-claro';
  className?: string;
  rotulo?: string;
}) {
  return (
    <a
      href={waLink(msg)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variante} ${className}`}
      aria-label={rotulo}
    >
      {children}
    </a>
  );
}

export function Sinal({ aberto }: { aberto: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-4 w-4 shrink-0">
      <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
      <span
        className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300"
        style={{ transform: aberto ? 'scaleY(0)' : 'scaleY(1)' }}
      />
    </span>
  );
}

/** Painel recolhível acessível (botão com aria-expanded + região). Animação só em CSS. */
export function Recolhivel({
  aberto,
  id,
  labelledBy,
  children,
}: {
  aberto: boolean;
  id: string;
  labelledBy: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      hidden={!aberto}
      className="recolhivel"
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export function useIds(prefixo: string) {
  const base = useId().replace(/:/g, '');
  return (s: string | number) => `${prefixo}-${base}-${s}`;
}

export function IconeWhats({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z" strokeLinejoin="round" />
      <path d="M9.2 8.6c.3 2.6 2.2 4.8 5 5.6l1-1.1 1.6.8-.4 1.4c-3.8.2-7.6-3.4-7.7-7.4l1.4-.4.8 1.6z" strokeLinejoin="round" />
    </svg>
  );
}
