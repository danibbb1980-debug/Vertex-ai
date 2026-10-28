/**
 * Adaptado do componente "Stacking Cards" (21st.dev, danielpetho / Khoa Phan).
 * Mantém a lógica original (cada cartão encolhe de 1 até `scaleTo` entre
 * index/total e 1 do progresso), mas sem a lib motion: o progresso vem de um
 * hook próprio e a escala é aplicada direto no transform. Topo fixo calculado
 * a partir do header; com prefers-reduced-motion não há escala.
 */
import { createContext, useCallback, useContext, useEffect, useRef, type HTMLAttributes, type PropsWithChildren } from 'react'
import { useScrollProgress } from '../lib/scroll'

type Setter = (p: number) => void
type Ctx = { register: (s: Setter) => () => void; scaleMultiplier: number; totalCards: number }
const StackingCardsContext = createContext<Ctx | null>(null)

export function StackingCards({
  children,
  totalCards,
  scaleMultiplier = 0.02,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { totalCards: number; scaleMultiplier?: number }>) {
  const targetRef = useRef<HTMLDivElement>(null)
  const setters = useRef(new Set<Setter>())
  const onProgress = useCallback((p: number) => setters.current.forEach((s) => s(p)), [])
  // 'start start' → 'end end'
  useScrollProgress(targetRef, onProgress, { start: 0, end: 1 })
  const register = useCallback((s: Setter) => {
    setters.current.add(s)
    return () => void setters.current.delete(s)
  }, [])
  return (
    <StackingCardsContext.Provider value={{ register, scaleMultiplier, totalCards }}>
      <div ref={targetRef} {...props}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  )
}

export function StackingCardItem({
  index,
  children,
  className = '',
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { index: number }>) {
  const ctx = useContext(StackingCardsContext)
  if (!ctx) throw new Error('StackingCardItem precisa estar dentro de StackingCards')
  const inner = useRef<HTMLDivElement>(null)
  const { register, scaleMultiplier, totalCards } = ctx

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const from = index / totalCards
    const scaleTo = 1 - (totalCards - 1 - index) * scaleMultiplier
    return register((p) => {
      const t = p <= from ? 0 : (p - from) / (1 - from)
      if (inner.current) inner.current.style.transform = `scale(${1 + (scaleTo - 1) * t})`
    })
  }, [register, index, totalCards, scaleMultiplier])

  return (
    <div
      className={`sticky ${className}`}
      style={{ top: `calc(var(--banner-h) + var(--header-h) + 1rem + ${index * 0.75}rem)` }}
      {...props}
    >
      <div ref={inner} className="origin-top">
        {children}
      </div>
    </div>
  )
}
