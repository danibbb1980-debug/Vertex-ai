import { LOGO } from './logo-paths'

/** Símbolo do logo em SVG (herda a cor do texto: escuro ou claro). */
export function Logo({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <svg
      viewBox={LOGO.viewBox}
      role="img"
      aria-label="GB, Gustavo Borges Andrade Odontologia"
      fill="currentColor"
      className={`block h-auto ${tone === 'dark' ? 'text-ink' : 'text-on-night'} ${className}`}
    >
      <path d={LOGO.tooth} />
      <path d={LOGO.outline} fill="none" stroke="currentColor" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
      <g stroke="currentColor" strokeWidth={7} strokeLinejoin="round">
        <path d={LOGO.g} />
        <path d={LOGO.b} />
      </g>
      <rect {...LOGO.bar} />
    </svg>
  )
}
