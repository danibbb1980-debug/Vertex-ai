import { useEffect, useRef, useState } from 'react'

/**
 * Faixa de palavras em movimento lento (adaptada de "Marquee" do 21st.dev).
 * CSS puro (transform), pausa fora da tela e some o movimento com prefers-reduced-motion.
 */
export function Marquee({ itens }: { itens: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ativo, setAtivo] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setAtivo(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const linha = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {itens.map((t) => (
        <li key={t} className="flex items-center gap-10 pr-10 font-display text-xl font-light tracking-[-0.01em] text-grafite-200 sm:text-2xl">
          <span>{t}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="text-menta">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div
      ref={ref}
      className="relative overflow-hidden border-y border-white/8 bg-grafite-950 py-6"
    >
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="marquee-trilho flex w-max" data-ativo={ativo}>
        {linha(false)}
        {linha(true)}
      </div>
      </div>
    </div>
  )
}
