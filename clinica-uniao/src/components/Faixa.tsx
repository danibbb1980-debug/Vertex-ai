import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'

/** Faixa lenta com os atendimentos. Pausa fora da tela, ao passar o mouse e com movimento reduzido. */
export function FaixaAtendimentos() {
  const ref = useRef<HTMLDivElement>(null)
  const [pausado, setPausado] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPausado(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (CONFIG.atendimentos.length === 0) return null
  const itens = CONFIG.atendimentos.map((a) => a.nome.replace(/ \(.+\)/, ''))

  const grupo = (chave: string) => (
    <ul className="flex shrink-0 items-center" key={chave}>
      {itens.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 font-serif text-xl italic text-choco-800 sm:text-2xl">{t}</span>
          <svg viewBox="0 0 24 12" className="h-3 w-6 text-camel-600" aria-hidden="true" fill="none">
            <path d="M2 11a10 10 0 0 1 20 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-pausado={pausado}
      className="marquee relative overflow-hidden border-y border-choco-700/10 bg-cream py-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div className="marquee-trilho">
        {grupo('a')}
        {grupo('b')}
      </div>
    </div>
  )
}
