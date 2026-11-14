import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variante = 'cheio' | 'linha' | 'cheio-claro' | 'linha-clara'

const base =
  'group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ease-[var(--ease-saida)] cursor-pointer'

const variantes: Record<Variante, string> = {
  cheio: 'bg-preto text-osso hover:text-preto',
  linha: 'border border-preto/80 text-preto hover:text-osso',
  'cheio-claro': 'bg-osso text-preto hover:text-preto',
  'linha-clara': 'border border-osso/60 text-osso hover:text-preto',
}

const preenchimento: Record<Variante, string> = {
  cheio: 'bg-champanhe',
  linha: 'bg-preto',
  'cheio-claro': 'bg-champanhe',
  'linha-clara': 'bg-osso',
}

/**
 * Botão de cantos retos com "corte" de preenchimento:
 * uma lâmina sobe da base no hover/foco (só transform).
 */
export function Botao({
  variante = 'cheio',
  children,
  className = '',
  externo,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: Variante
  children: ReactNode
  externo?: boolean
}) {
  const ext = externo ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a className={`${base} ${variantes[variante]} ${className}`} {...ext} {...rest}>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[var(--ease-corte)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none ${preenchimento[variante]}`}
      />
      <span className="relative">{children}</span>
      {externo ? <span className="sr-only"> (abre em nova aba)</span> : null}
    </a>
  )
}

export function Seta({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={`relative h-3 w-6 ${className}`} fill="none" aria-hidden="true">
      <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
    </svg>
  )
}
