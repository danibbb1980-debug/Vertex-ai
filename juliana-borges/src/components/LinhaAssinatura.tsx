import { useEffect, useRef, useState, type RefObject } from 'react'
import { prefereMenosMovimento, useAoRolar } from '../lib/movimento'

interface Geo {
  inicio: number // px a partir do topo do <main>
  altura: number
  nos: number[] // posições (0..1) dos pontos ao longo da linha
}

/**
 * Momento de assinatura: a linha vertical do monograma J|B se desenha devagar ao rolar,
 * passa pelo hero, pelos atendimentos e pelo contato, e termina junto ao botão de agendar do CTA final.
 */
export function LinhaAssinatura({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const [geo, setGeo] = useState<Geo | null>(null)
  const linha = useRef<HTMLSpanElement>(null)
  const pontos = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const wrap = alvo.current
    if (!wrap) return
    const medir = () => {
      const wr = wrap.getBoundingClientRect()
      const nosEl = [...wrap.querySelectorAll<HTMLElement>('[data-no-linha]')]
      const fimEl = wrap.querySelector<HTMLElement>('[data-fim-linha]')
      if (!nosEl.length || !fimEl) return setGeo(null)
      const yDe = (el: HTMLElement) => el.getBoundingClientRect().top - wr.top + (parseFloat(getComputedStyle(el).paddingTop) || 0)
      const inicio = yDe(nosEl[0])
      const fr = fimEl.getBoundingClientRect()
      const altura = Math.max(1, fr.top - wr.top + fr.height / 2 - inicio)
      setGeo({ inicio, altura, nos: [...nosEl.map((el) => (yDe(el) - inicio) / altura), 1] })
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [alvo])

  useAoRolar(alvo, () => {
    const wrap = alvo.current
    if (!wrap || !geo) return
    let p = 1
    if (!prefereMenosMovimento()) {
      const topo = wrap.getBoundingClientRect().top + geo.inicio
      p = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - topo) / geo.altura))
    }
    if (linha.current) linha.current.style.transform = `scaleY(${p})`
    geo.nos.forEach((pos, i) => {
      const el = pontos.current[i]
      if (el) el.dataset.ativo = p >= pos - 0.002 ? 'true' : 'false'
    })
  })

  if (!geo) return null

  return (
    <div
      aria-hidden="true"
      className="linha-assinatura pointer-events-none absolute z-[5] w-px"
      style={{ top: geo.inicio, height: geo.altura, left: 'max(0.5rem, calc((100% - 76rem) / 2 + 0.75rem))' }}
    >
      <span className="absolute inset-0 bg-ouro/15" />
      <span ref={linha} className="absolute inset-0 origin-top bg-gradient-to-b from-ouro via-ouro to-linha" style={{ transform: 'scaleY(0)' }} />
      {geo.nos.map((pos, i) => (
        <span
          key={i}
          ref={(el) => {
            pontos.current[i] = el
          }}
          data-ativo="false"
          data-fim={i === geo.nos.length - 1 || undefined}
          className="ponto-linha absolute left-1/2"
          style={{ top: `${pos * 100}%` }}
        />
      ))}
    </div>
  )
}
