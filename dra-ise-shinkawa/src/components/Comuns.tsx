import type { ReactNode } from 'react';
import mono from '../monogram.json';
import { waLink, MSG_GERAL, CONFIG } from '../config';

export function Monograma({ className, cor = 'var(--champagne)' }: { className?: string; cor?: string }) {
  return (
    <svg className={className} viewBox={mono.viewBox} aria-hidden="true" focusable="false">
      <g fill={cor}>{mono.paths.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

/** Título revelado por linha com máscara (mecanismo a) + filete (mecanismo b). */
export function Titulo({ linhas, as: Tag = 'h2', className = 'h2', id }: { linhas: ReactNode[]; as?: 'h2' | 'h3' | 'p'; className?: string; id?: string }) {
  return (
    <Tag className={className} id={id}>
      {linhas.map((l, i) => (
        <span className="linha-m" key={i}><span>{l}</span></span>
      ))}
    </Tag>
  );
}

export function Rotulo({ children }: { children: ReactNode }) {
  return (
    <div className="rotulo rotulo-c" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: 'var(--e-3)' }}>
      <span className="ponto" aria-hidden="true" />{children}
    </div>
  );
}

export function BtnAgendar({ texto = 'Agendar avaliação', msg = MSG_GERAL, variante = 'cheio' }: { texto?: string; msg?: string; variante?: 'cheio' | 'vazio' }) {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;
  return (
    <a className={`btn btn-${variante}`} href={waLink(msg)} target="_blank" rel="noopener noreferrer">
      {texto}<span className="ponto" aria-hidden="true" />
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}

export function Link({ href, children, externo = false }: { href: string; children: ReactNode; externo?: boolean }) {
  return (
    <a className="link" href={href} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      <span className="marc" aria-hidden="true">·</span>
      <span className="t">{children}</span>
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}

export function Img({ f, sizes, className, eager = false }: { f: { src: string; srcSmall?: string; w: number; h: number; alt: string }; sizes: string; className?: string; eager?: boolean }) {
  return (
    <img
      className={className}
      src={f.src}
      srcSet={f.srcSmall ? `${f.srcSmall} 720w, ${f.src} ${f.w}w` : undefined}
      sizes={sizes}
      width={f.w}
      height={f.h}
      alt={f.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
