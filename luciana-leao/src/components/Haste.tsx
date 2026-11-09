import { useEffect, useRef, useState, type RefObject } from 'react'
import { desenharTraco, faixa, useProgressoRolagem } from '../lib/rolagem'

/**
 * Momento de assinatura: a haste da orquídea se desenha devagar ao rolar a página, pela margem
 * direita, ganha folhas e termina no centro, onde a flor se completa (seção final).
 * Inspirado no "Line Draw SVG" (21st.dev, @pulkitxm), reescrito sem biblioteca: caminho gerado
 * em pixels a partir do tamanho real da página (sem distorção), só em telas largas.
 */

interface Geo {
  w: number
  h: number
  d: string
  folhas: { d: string; t: number }[]
}

function gerar(w: number, h: number): Geo {
  const conteudo = Math.min(w, 1200)
  const gutter = (w - conteudo) / 2 + 32
  const x0 = w - gutter / 2
  const amp = Math.min(12, gutter / 5)
  const periodo = 820
  const fimReto = h - 150
  const xEm = (y: number) => x0 + Math.sin((y / periodo) * Math.PI * 2) * amp
  const pts: [number, number][] = []
  for (let y = 0; y <= fimReto; y += periodo / 4) pts.push([xEm(y), y])
  let d = `M${pts[0][0].toFixed(1)} 0`
  for (let i = 1; i < pts.length; i++) {
    const [xa, ya] = pts[i - 1]
    const [xb, yb] = pts[i]
    const my = (ya + yb) / 2
    d += ` C${xa.toFixed(1)} ${my} ${xb.toFixed(1)} ${my} ${xb.toFixed(1)} ${yb}`
  }
  const [xl] = pts[pts.length - 1]
  d += ` C${xl.toFixed(1)} ${h - 40} ${w / 2 + 120} ${h - 70} ${w / 2} ${h}`

  const folhas: { d: string; t: number }[] = []
  let lado = -1
  for (let y = 700; y < fimReto - 300; y += 1100) {
    const x = xEm(y)
    const s = lado * Math.min(34, gutter / 2.6)
    folhas.push({
      d: `M${x} ${y} C${x + s * 0.4} ${y - 30} ${x + s * 1.1} ${y - 26} ${x + s * 1.25} ${y - 52} C${x + s * 0.6} ${y - 50} ${x + s * 0.15} ${y - 30} ${x} ${y}`,
      t: y / h,
    })
    lado *= -1
  }
  return { w, h, d, folhas }
}

export function Haste({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const [geo, setGeo] = useState<Geo | null>(null)
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = alvo.current
    if (!el) return
    const mq = window.matchMedia('(min-width: 1024px)')
    let ultimo = ''
    const medir = () => {
      const chave = `${el.clientWidth}x${el.scrollHeight}`
      if (chave === ultimo) return
      ultimo = chave
      setGeo(mq.matches ? gerar(el.clientWidth, el.scrollHeight) : null)
    }
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    mq.addEventListener('change', medir)
    medir()
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', medir)
    }
  }, [alvo])

  useProgressoRolagem(
    alvo,
    (p) => {
      const paths = svg.current?.querySelectorAll('path')
      if (!paths || !geo) return
      desenharTraco(paths[0], p)
      geo.folhas.forEach((f, i) => desenharTraco(paths[i + 1], faixa(p, f.t * 0.98, f.t * 0.98 + 0.03)))
    },
    { alvo: [0, 1], tela: [0.55, 1], suavizar: 0.08 },
  )

  if (!geo) return null
  return (
    <svg
      ref={svg}
      aria-hidden="true"
      className="traco-rolagem pointer-events-none absolute inset-0 z-20 text-lilas mix-blend-multiply"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
    >
      <path d={geo.d} pathLength={1} />
      {geo.folhas.map((f, i) => (
        <path key={i} d={f.d} pathLength={1} />
      ))}
    </svg>
  )
}
