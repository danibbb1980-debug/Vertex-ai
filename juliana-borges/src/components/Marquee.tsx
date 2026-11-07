import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'

/** Faixa de texto em movimento lento. Decorativa (aria-hidden), pausada fora da tela. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const [pausado, setPausado] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPausado(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const itens = [...CONFIG.atendimentos.map((a) => a.nome), 'Hora marcada', CONFIG.cidade]
  if (itens.length < 2) return null
  const grupo = (k: string) => (
    <div className="flex shrink-0 items-center" key={k}>
      {itens.map((t) => (
        <span key={k + t} className="flex items-center">
          <span className="px-6 font-serif text-[1.6rem] italic text-choco md:px-10 md:text-[2.2rem]">{t}</span>
          <span className="inline-block size-1.5 rotate-45 bg-ouro" />
        </span>
      ))}
    </div>
  )
  return (
    <div ref={ref} aria-hidden="true" data-pausado={pausado} className="marquee overflow-hidden border-y border-choco/10 bg-creme py-6">
      <div className="marquee-trilha flex w-max">
        {grupo('a')}
        {grupo('b')}
      </div>
    </div>
  )
}
