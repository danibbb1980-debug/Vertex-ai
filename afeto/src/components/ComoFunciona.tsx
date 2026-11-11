import { useRef } from 'react'
import { useProgressoRolagem } from '../lib/rolagem'
import { CONFIG } from '../config'
import { TituloEnfase } from './Enfase'

/** Título fixo à esquerda; linha do tempo vertical com números grandes e progresso ao rolar. */
export function ComoFunciona() {
  const etapas = CONFIG.comoFunciona
  const ref = useRef<HTMLOListElement>(null)
  const linha = useRef<HTMLSpanElement>(null)
  // Linha de progresso: começa quando o topo da lista passa 70% da tela, completa quando o fim passa 60%.
  useProgressoRolagem(
    ref,
    (r, h) => (h * 0.7 - r.top) / (r.height - h * 0.1),
    (p) => {
      if (linha.current) linha.current.style.transform = `scaleY(${p})`
    },
    0.2,
  )
  if (!etapas.length) return null
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="relative bg-salvia-clara">
      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 -top-px block h-8 w-full sm:h-14">
        <path d="M0 0h1440v4C1080 60 360 60 0 4Z" fill="var(--color-creme)" />
      </svg>
      <div className="mx-auto grid max-w-[84rem] gap-12 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-32 lg:pt-36">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-40">
            <p className="rotulo mb-5 text-terracota-texto">Como funciona</p>
            <h2 id="titulo-como" className="text-[clamp(2.4rem,5.6vw,4.6rem)] text-tinta">
              <TituloEnfase texto="Do primeiro contato ao *acompanhamento*." />
            </h2>
            <p className="mt-6 max-w-[26rem] text-tinta-suave">
              Quatro etapas, sem pressa. Os detalhes de cada uma variam conforme a área e são combinados com o
              profissional.
            </p>
          </div>
        </div>
        <ol ref={ref} className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.9rem] top-6 w-px bg-tinta/20 sm:left-[2.6rem]" />
          <span
            ref={linha}
            aria-hidden="true"
            className="absolute bottom-6 left-[1.9rem] top-6 w-[2px] origin-top scale-y-0 bg-terracota sm:left-[2.6rem] motion-reduce:scale-y-100"
          />
          {etapas.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[3.8rem_1fr] gap-x-5 pb-14 last:pb-0 sm:grid-cols-[5.2rem_1fr] sm:gap-x-8">
              <span className="num relative z-10 flex aspect-square w-full items-center justify-center rounded-full rounded-tl-none bg-salvia-clara text-[2.6rem] text-terracota ring-1 ring-tinta/25 sm:text-[3.4rem]">
                {i + 1}
              </span>
              <div className="pt-2 sm:pt-4">
                <h3 className="text-[clamp(1.7rem,2.6vw,2.2rem)] leading-[1.05] text-tinta">{e.titulo}</h3>
                <p className="mt-3 max-w-[30rem] text-tinta-suave">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
