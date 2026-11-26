import { frentesAtivas } from '../config';

/** Os quatro marcadores (as frentes do atendimento). */
export function Markers({ variant = 'mini', className = '' }: { variant?: 'hero' | 'mini' | 'lit'; className?: string }) {
  const frentes = frentesAtivas();
  if (variant === 'hero') {
    return (
      <ol className={`mk-hero ${className}`} aria-label="As frentes do atendimento">
        {frentes.map((f, i) => (
          <li key={f.id} className="mk-hero__item" style={{ ['--i' as string]: i }}>
            <span className="mk-bar" aria-hidden="true">
              <span className="mk-bar__fill" style={{ background: `var(--${f.cor})` }} />
            </span>
            <span className="mk-hero__label">{f.rotulo}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <span className={`mk-mini ${variant === 'lit' ? 'mk-mini--lit' : ''} ${className}`} aria-hidden="true">
      {frentes.map((f, i) => (
        <span key={f.id} className="mk-mini__bar" style={{ ['--i' as string]: i }}>
          <span className="mk-bar__fill" style={{ background: `var(--${f.cor})` }} />
        </span>
      ))}
    </span>
  );
}
