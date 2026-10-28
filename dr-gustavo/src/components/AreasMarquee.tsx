import { useEffect, useRef } from 'react'
import { AREAS } from '../content'

/** Faixa discreta com as áreas de atuação. Pausa fora da tela, no hover e no foco. */
export function AreasMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.setAttribute('data-paused', String(!e.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const row = (dup = false) => (
    <ul className={`flex shrink-0 items-center ${dup ? 'marquee-dup' : ''}`} aria-hidden={dup || undefined}>
      {AREAS.map((a) => (
        <li key={a} className="flex items-center whitespace-nowrap px-6 font-display text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] font-[330] italic text-ink/80 md:px-10">
          {a}
          <svg aria-hidden="true" viewBox="0 0 24 12" className="ml-12 h-3 w-6 text-accent/60 md:ml-20" fill="none">
            <path d="M1 1c0 6 4.9 10 11 10S23 7 23 1" stroke="currentColor" strokeWidth="1" />
          </svg>
        </li>
      ))}
    </ul>
  )

  return (
    <section aria-label="Áreas de atuação" className="border-y border-line/80 bg-paper/60 py-7 md:py-9">
      <div ref={ref} className="marquee overflow-hidden" data-paused="true">
        <div className="marquee-track">
          {row()}
          {row(true)}
        </div>
      </div>
    </section>
  )
}
