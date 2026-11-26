import type { ReactNode } from 'react';
import { waUrl, MSG_GERAL } from './lib';
import { CONFIG } from './config';

export function WaButton({
  children = 'Pedir horário',
  texto = MSG_GERAL,
  variant = 'solid',
  className = '',
}: {
  children?: ReactNode;
  texto?: string;
  variant?: 'solid' | 'line' | 'ink';
  className?: string;
}) {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;
  return (
    <a
      className={`btn btn--${variant} ${className}`}
      href={waUrl(texto)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{children}</span>
      <span className="btn__note">WhatsApp</span>
    </a>
  );
}

export function LinkButton({
  href,
  children,
  external = false,
  variant = 'line',
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: 'solid' | 'line' | 'ink';
  className?: string;
}) {
  return (
    <a
      className={`btn btn--${variant} ${className}`}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span>{children}</span>
    </a>
  );
}

/** Cabeçalho de seção: número com o anel (a lente) e título revelado por máscara. */
export function SectionHead({
  num,
  label,
  title,
  id,
  children,
  tone = 'dark',
}: {
  num: string;
  label: string;
  title: ReactNode;
  id: string;
  children?: ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <header className={`shead shead--${tone}`}>
      <p className="shead__num" data-ring>
        <span className="ring" aria-hidden="true" />
        <span className="shead__n">{num}</span>
        <span className="shead__label">{label}</span>
      </p>
      <h2 className="shead__title" id={id}>
        <span className="mask" data-reveal>
          <span>{title}</span>
        </span>
      </h2>
      {children ? <div className="shead__lead">{children}</div> : null}
    </header>
  );
}

export function LensName({ as = 'div', className = '' }: { as?: 'div' | 'p'; className?: string }) {
  const Tag = as;
  return (
    <Tag className={`lensname ${className}`} aria-hidden="true">
      <span className="lensname__outline">{CONFIG.marca}</span>
      <span className="lensname__dot" />
    </Tag>
  );
}
