import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { COR_PECA } from '../brand/Marca'

const CORES = [COR_PECA.salvia, COR_PECA.ambar, COR_PECA.terracota]

/** Faixa discreta com as áreas. Pausa fora da tela e ao passar o mouse; estática com movimento reduzido. */
export function FaixaAreas() {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const areas = CONFIG.especialidades.map((e) => e.nome)
  if (areas.length < 2) return null
  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {areas.map((a, i) => (
        <li key={a} className="flex items-center whitespace-nowrap px-6 font-display text-[1.6rem] text-tinta sm:text-[2rem]">
          <svg viewBox="0 0 20 20" className="mr-6 size-3.5" aria-hidden="true">
            {i % 3 === 0 && <path d="M0 20A20 20 0 0 1 20 0v20Z" fill={CORES[i % 3]} />}
            {i % 3 === 1 && <path d="M0 10a10 10 0 0 1 20 0Z" fill={CORES[i % 3]} transform="translate(0 5)" />}
            {i % 3 === 2 && <path d="M10 0C16 7 18 11 18 13a8 8 0 0 1-16 0c0-2 2-6 8-13Z" fill={CORES[i % 3]} />}
          </svg>
          {a}
        </li>
      ))}
    </ul>
  )
  return (
    <div
      ref={ref}
      className="faixa overflow-hidden border-y border-fio bg-creme-claro py-4"
      data-pausada={!visivel}
      role="region"
      aria-label="Áreas de atendimento"
    >
      <div className="faixa-trilho">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  )
}
