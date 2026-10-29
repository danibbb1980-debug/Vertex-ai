import { useEffect, useRef, useState } from 'react'

/** Faixa contínua e lenta; pausa fora da tela, ao passar o mouse e com movimento reduzido. */
export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-7 font-display text-[1.6rem] italic font-light text-ink/80 sm:text-[2rem]">{t}</span>
          <span aria-hidden="true" className="block size-2 bg-teal" />
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} className="marquee relative overflow-hidden border-y border-sand/60 bg-ivory-2/60 py-6" data-paused={paused}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ivory-2 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ivory-2 to-transparent" />
    </div>
  )
}
