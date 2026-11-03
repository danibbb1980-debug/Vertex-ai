import type { CSSProperties, ReactNode } from 'react'

/*
 * Movimento leve, sem biblioteca: o HTML já vem pré-renderizado e visível;
 * src/lib/efeitos.ts adiciona a classe "visivel" ao entrar na tela.
 * Só transform e opacity. Com prefers-reduced-motion nada é ocultado.
 */

/** Revelação palavra a palavra (adaptada do "Words Stagger" do 21st.dev). */
export type Trecho = string | { enfase: string }

export function TituloRevelado({
  trechos,
  as: Tag = 'h2',
  className = '',
  atraso = 0,
  noCarregamento = false,
  id,
}: {
  trechos: Trecho[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  atraso?: number
  noCarregamento?: boolean
  id?: string
}) {
  const palavras: { p: string; enfase: boolean }[] = []
  for (const t of trechos) {
    const texto = typeof t === 'string' ? t : t.enfase
    for (const p of texto.split(' ').filter(Boolean)) palavras.push({ p, enfase: typeof t !== 'string' })
  }
  const attrs = noCarregamento ? { 'data-revela-carga': '' } : { 'data-revela-palavras': '' }
  return (
    <Tag id={id} className={className} {...attrs} style={{ '--atraso': `${atraso}s` } as CSSProperties}>
      {palavras.map((w, i) => (
        <span key={i}>
          <span className="palavra">
            <span className={w.enfase ? 'enfase' : undefined} style={{ '--i': i } as CSSProperties}>
              {w.p}
            </span>
          </span>
          {i < palavras.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Entrada suave ao rolar. */
export function Surge({
  children,
  atraso = 0,
  className,
  noCarregamento = false,
}: {
  children: ReactNode
  atraso?: number
  className?: string
  noCarregamento?: boolean
}) {
  const attrs = noCarregamento ? { 'data-surge-carga': '' } : { 'data-revela': '' }
  return (
    <div className={className} {...attrs} style={{ '--atraso': `${atraso}s` } as CSSProperties}>
      {children}
    </div>
  )
}

/**
 * Momento de assinatura: as duas formas do símbolo (arco + quadrado)
 * se aproximam e se encaixam. No hero há um parallax leve ao rolar.
 */
export function Encaixe({
  className = '',
  tom = 'claro',
  parallax = false,
  noCarregamento = false,
}: {
  className?: string
  tom?: 'claro' | 'escuro'
  parallax?: boolean
  noCarregamento?: boolean
}) {
  const traco = tom === 'claro' ? 'var(--color-taupe-700)' : 'var(--color-pedra-100)'
  const traco2 = tom === 'claro' ? 'var(--color-musgo)' : 'var(--color-musgo-claro)'
  const miolo = tom === 'claro' ? 'var(--color-terracota)' : 'var(--color-terracota-claro)'
  const attrs = {
    ...(noCarregamento ? { 'data-encaixe-carga': '' } : { 'data-revela': '' }),
    ...(parallax ? { 'data-parallax': '' } : {}),
  }
  return (
    <div className={`encaixe ${className}`} aria-hidden {...attrs}>
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <g stroke={traco} strokeOpacity={0.14} strokeWidth={1}>
          <path d="M30 0V200M70 0V200M130 0V200M170 0V200M0 30H200M0 70H200M0 130H200M0 170H200" vectorEffect="non-scaling-stroke" />
        </g>
        <rect className="encaixe-miolo" x={70} y={70} width={60} height={60} fill={miolo} />
        <g className="encaixe-px-a">
          <path className="encaixe-a" d="M30 130A100 100 0 0 1 130 30V130Z" fill="none" stroke={traco} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </g>
        <g className="encaixe-px-b">
          <path className="encaixe-b" d="M170 70A100 100 0 0 1 70 170V70Z" fill="none" stroke={traco2} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </div>
  )
}
