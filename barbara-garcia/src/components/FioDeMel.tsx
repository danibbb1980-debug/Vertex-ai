import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion, useScroll, useMotionValueEvent } from 'motion/react'

/**
 * Momento de assinatura: um fio de mel que escorre ao rolar.
 * Parte da gota do monograma (hero), desce pela margem passando pelos
 * atendimentos e termina numa gota que preenche o botão de agendar.
 *
 * Âncoras no DOM (data-fio), na ordem em que aparecem:
 *  - "centro": ponto exato do elemento (início)
 *  - "desvio": mesma coluna do ponto anterior, na altura do elemento
 *  - "margem": coluna da margem esquerda, na altura do elemento
 *  - "fim":    topo central do elemento (o botão)
 *
 * Desempenho: o caminho só é recalculado quando o tamanho muda; ao rolar,
 * só mudam o comprimento desenhado do traço e o transform da gota.
 */

const useIsoLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect

type Geo = { w: number; h: number; d: string; total: number; amostras: { y: number; l: number }[]; fimY: number }

function construir(wrapper: HTMLElement, svgPath: SVGPathElement): Geo | null {
  const r = wrapper.getBoundingClientRect()
  const w = r.width
  const h = r.height
  const ancoras = Array.from(wrapper.querySelectorAll<HTMLElement>('[data-fio]'))
  if (ancoras.length < 2) return null

  const conteudo = Math.min(w, 1200)
  const margemLivre = (w - conteudo) / 2
  const xMargem = margemLivre >= 44 ? Math.min(margemLivre * 0.55, 90) : w >= 768 ? 18 : 9

  const pts: { x: number; y: number }[] = []
  let alterna = 0
  for (const el of ancoras) {
    const b = el.getBoundingClientRect()
    const tipo = el.dataset.fio
    const cx = b.left - r.left + b.width / 2
    const cy = b.top - r.top + b.height / 2
    const prev = pts[pts.length - 1]
    if (tipo === 'centro') pts.push({ x: cx, y: cy })
    else if (tipo === 'desvio' && prev) pts.push({ x: prev.x, y: b.top - r.top })
    else if (tipo === 'margem') pts.push({ x: xMargem + (alterna++ % 2 ? 7 : 0), y: b.top - r.top })
    else if (tipo === 'fim') pts.push({ x: cx, y: b.top - r.top + 4 })
  }
  if (pts.length < 2) return null

  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const dy = b.y - a.y
    const k = Math.max(dy * 0.5, 24)
    d += ` C${a.x.toFixed(1)} ${(a.y + k).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - k).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
  }

  svgPath.setAttribute('d', d)
  const total = svgPath.getTotalLength()
  const amostras: { y: number; l: number }[] = []
  const N = 240
  let maxY = -Infinity
  for (let i = 0; i <= N; i++) {
    const l = (total * i) / N
    const p = svgPath.getPointAtLength(l)
    // y monotônico (o fio só desce): ignora pequenas voltas
    maxY = Math.max(maxY, p.y)
    amostras.push({ y: maxY, l })
  }
  return { w, h, d, total, amostras, fimY: pts[pts.length - 1].y }
}

function comprimentoEm(geo: Geo, y: number): number {
  const a = geo.amostras
  if (y <= a[0].y) return 0
  if (y >= a[a.length - 1].y) return geo.total
  let lo = 0
  let hi = a.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (a[mid].y < y) lo = mid
    else hi = mid
  }
  const t = (y - a[lo].y) / Math.max(a[hi].y - a[lo].y, 0.001)
  return a[lo].l + t * (a[hi].l - a[lo].l)
}

export function FioDeMel({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null)
  const medidor = useRef<SVGPathElement>(null)
  const traco = useRef<SVGPathElement>(null)
  const fimEl = useRef<HTMLElement | null>(null)
  const [geo, setGeo] = useState<Geo | null>(null)
  const reduz = useReducedMotion()

  const gota = useRef<SVGGElement>(null)
  const { scrollY } = useScroll()

  useIsoLayout(() => {
    const el = wrap.current
    const m = medidor.current
    if (!el || !m) return
    fimEl.current = el.querySelector<HTMLElement>('[data-fio="fim"]')
    let raf = 0
    const medir = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setGeo(construir(el, m)))
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    document.fonts?.ready.then(medir).catch(() => {})
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  const atualizar = (sy: number) => {
    const el = wrap.current
    if (!geo || !el) return
    const topo = el.getBoundingClientRect().top + sy
    // a "ponta" do fio acompanha ~62% da altura da tela
    const yPonta = sy + window.innerHeight * 0.62 - topo
    const l = reduz ? geo.total : comprimentoEm(geo, yPonta)
    const frac = l / geo.total
    if (traco.current) traco.current.style.strokeDashoffset = String(geo.total - l)
    const g = gota.current
    if (g && medidor.current) {
      if (reduz) g.style.opacity = '0'
      else {
        const p = medidor.current.getPointAtLength(l)
        g.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`
        g.style.opacity = frac > 0.004 && frac < 0.995 ? '1' : '0'
      }
    }
    // o botão final enche quando o fio chega nele
    const enche = reduz ? 1 : Math.min(Math.max((yPonta - geo.fimY) / 140, 0), 1)
    fimEl.current?.style.setProperty('--enche', enche.toFixed(3))
  }

  useMotionValueEvent(scrollY, 'change', atualizar)
  useEffect(() => {
    atualizar(window.scrollY)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, reduz])

  return (
    <div ref={wrap} className="relative">
      {children}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 hidden h-full w-full overflow-visible [.js_&]:block"
        width={geo?.w ?? 0}
        height={geo?.h ?? 0}
        viewBox={geo ? `0 0 ${geo.w} ${geo.h}` : undefined}
      >
        <defs>
          <linearGradient id="fio-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D9A441" stopOpacity="0.95" />
            <stop offset="0.6" stopColor="#C98F2E" stopOpacity="0.9" />
            <stop offset="1" stopColor="#D9A441" />
          </linearGradient>
        </defs>
        {/* caminho invisível usado só para medir */}
        <path ref={medidor} d={geo?.d} fill="none" stroke="none" />
        {/* o fio que escorre */}
        <path
          ref={traco}
          d={geo?.d}
          fill="none"
          stroke="url(#fio-grad)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray={geo ? `${geo.total} ${geo.total}` : undefined}
          strokeDashoffset={geo ? geo.total : undefined}
        />
        {/* gota na ponta */}
        <g ref={gota} style={{ opacity: 0, transition: 'opacity .3s' }}>
          <path d="M0 -9 C2 -5 5 -2 5 1.5 A5 5 0 0 1 -5 1.5 C-5 -2 -2 -5 0 -9Z" fill="#D9A441" />
          <circle cx="-1.6" cy="0.5" r="1.3" fill="#F6E3B8" opacity="0.9" />
        </g>
      </svg>
    </div>
  )
}
