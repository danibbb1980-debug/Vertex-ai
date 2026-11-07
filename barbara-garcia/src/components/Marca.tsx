import { MONOGRAMA } from '../lib/brand-paths'

type Tom = 'claro' | 'escuro'

/** Monograma BG no favo, com a gota de mel. Marca provisória (ver README). */
export function Monograma({
  tom = 'claro',
  className,
  titulo,
  gotaId,
}: {
  tom?: Tom
  className?: string
  titulo?: string
  gotaId?: string
}) {
  const traco = tom === 'claro' ? 'var(--color-oliva)' : 'var(--color-aveia)'
  return (
    <svg viewBox="0 0 100 100" className={className} role={titulo ? 'img' : undefined} aria-hidden={titulo ? undefined : true} aria-label={titulo}>
      <path d={MONOGRAMA.hexa} fill="none" stroke={traco} strokeWidth={2.4} />
      <path d={MONOGRAMA.hexaInner} fill="none" stroke={traco} strokeWidth={0.9} opacity={0.5} />
      <path d={MONOGRAMA.letras} fill={traco} />
      <path id={gotaId} d={MONOGRAMA.gota} fill="var(--color-mel)" />
    </svg>
  )
}

/** Logo horizontal: monograma + "Barbara Garcia" + ESTÉTICA (texto na fonte da marca). */
export function Logo({ tom = 'claro', className = '' }: { tom?: Tom; className?: string }) {
  const nome = tom === 'claro' ? 'text-grafite' : 'text-aveia'
  const desc = tom === 'claro' ? 'text-oliva' : 'text-mel-claro'
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monograma tom={tom} className="h-[2.6em] w-[2.6em] shrink-0" />
      <span className="flex flex-col items-center leading-none" aria-hidden="true">
        <span className={`font-serif text-[1.45em] font-[460] tracking-[-0.01em] ${nome}`}>Barbara Garcia</span>
        <span className={`mt-[0.32em] flex items-center gap-[0.55em] font-sans text-[0.5em] font-semibold tracking-[0.4em] ${desc}`}>
          <span className="h-px w-[2.6em] bg-mel" />
          ESTÉTICA
          <span className="-ml-[0.4em] h-px w-[2.6em] bg-mel" />
        </span>
      </span>
      <span className="sr-only">Barbara Garcia Estética</span>
    </span>
  )
}

/** Favo decorativo (hexágono de cantos suaves). */
export function Favo({ className, preenchido = false }: { className?: string; preenchido?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d={MONOGRAMA.hexa}
        fill={preenchido ? 'currentColor' : 'none'}
        stroke={preenchido ? 'none' : 'currentColor'}
        strokeWidth={preenchido ? 0 : 2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function Gota({ className }: { className?: string }) {
  return (
    <svg viewBox="40 62 20 18" className={className} aria-hidden="true">
      <path d={MONOGRAMA.gota} fill="currentColor" />
    </svg>
  )
}
