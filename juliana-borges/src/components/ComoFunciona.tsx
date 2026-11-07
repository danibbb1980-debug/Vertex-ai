import { useRef } from 'react'
import { prefereMenosMovimento, useAoRolar } from '../lib/movimento'
import { etapas } from '../content'
import { CabecalhoSecao, Revelar } from './ui'

/** Linha do tempo com progresso ao rolar (inspirada no "Animated Progress Stepper" do 21st.dev). */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const vRef = useRef<HTMLSpanElement>(null)
  const hRef = useRef<HTMLSpanElement>(null)
  useAoRolar(ref, () => {
    const el = ref.current
    if (!el) return
    let p = 1
    if (!prefereMenosMovimento()) {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // começa quando o topo chega a 75% da tela e termina quando o fim chega a 55%
      p = (vh * 0.75 - r.top) / (r.height + vh * 0.2)
      p = Math.min(1, Math.max(0, p))
    }
    if (vRef.current) vRef.current.style.transform = `scaleY(${p})`
    if (hRef.current) hRef.current.style.transform = `scaleX(${p})`
  })
  if (!etapas.length) return null

  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="relative overflow-hidden bg-cacau py-24 text-creme escuro md:py-32">
      <div className="container-site">
        <CabecalhoSecao
          id="titulo-como"
          rotulo="Como funciona"
          titulo={
            <>
              Do primeiro contato às <em>orientações</em>.
            </>
          }
        >
          <p className="text-creme/85">Quatro etapas, sempre com hora marcada.</p>
        </CabecalhoSecao>

        <ol ref={ref} className="relative mt-16 grid gap-12 md:mt-20 md:grid-cols-4 md:gap-8">
          {/* trilho + progresso: vertical no celular, horizontal no desktop */}
          <span aria-hidden="true" className="absolute bottom-2 left-[0.6875rem] top-2 w-px bg-creme/15 md:bottom-auto md:left-0 md:right-0 md:top-[0.6875rem] md:h-px md:w-auto" />
          <span
            ref={vRef}
            style={{ transform: 'scaleY(0)' }}
            aria-hidden="true"
            className="absolute bottom-2 left-[0.6875rem] top-2 w-px origin-top bg-nude transition-transform duration-300 ease-out md:hidden"
          />
          <span
            ref={hRef}
            style={{ transform: 'scaleX(0)' }}
            aria-hidden="true"
            className="absolute left-0 right-0 top-[0.6875rem] hidden h-px origin-left bg-nude transition-transform duration-300 ease-out md:block"
          />
          {etapas.map((e, i) => (
            <Revelar como="li" key={e.titulo} atraso={i * 0.08} className="relative pl-12 md:pl-0 md:pt-14">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 flex size-[1.375rem] items-center justify-center rounded-full border border-nude bg-cacau"
              >
                <span className="size-1.5 rounded-full bg-nude" />
              </span>
              <span className="rotulo !text-nude/90">Etapa {i + 1}</span>
              <h3 className="mt-3 font-serif text-[1.6rem] leading-tight text-creme">{e.titulo}</h3>
              <p className="mt-3 text-creme/85">{e.texto}</p>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  )
}
