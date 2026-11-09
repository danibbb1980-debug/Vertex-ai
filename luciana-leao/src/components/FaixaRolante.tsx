import { useEffect, useRef, useState } from 'react'

/**
 * Inspirado no "Marquee" (21st.dev, @kevingirelli): trilha em loop que pausa com hover/foco
 * e fora da tela. Adaptado: lento, em serifa itálica, separado por pequenas estrelas de quatro pontas;
 * conteúdo duplicado fica oculto para leitores de tela.
 */
export function FaixaRolante({ itens }: { itens: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pausada, setPausada] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPausada(!e.isIntersecting), { rootMargin: '50px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {itens.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className="px-6 font-serif text-2xl italic text-vinho/80 md:px-10 md:text-[2rem]">{t}</span>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-lilas" aria-hidden="true" fill="currentColor"><path d="M8 0c.6 4.2 3.8 7.4 8 8-4.2.6-7.4 3.8-8 8-.6-4.2-3.8-7.4-8-8 4.2-.6 7.4-3.8 8-8Z" /></svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} className="faixa relative overflow-hidden border-y border-filete/70 bg-pedra-50/60 py-6" data-pausada={pausada}>
      <div className="faixa-trilho flex w-max">
        {grupo(false)}
        {grupo(true)}
        {grupo(true)}
        {grupo(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-pedra to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-pedra to-transparent" />
    </div>
  )
}
