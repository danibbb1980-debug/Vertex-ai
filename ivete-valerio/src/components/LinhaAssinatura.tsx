import { useEffect, useRef, useState } from 'react'

/**
 * "A linha de uma mão só": uma única linha que nasce como o arco de uma sobrancelha
 * sobre o retrato, desce em ondas pelas margens entre as seções e fecha num laço no
 * fim da página. O desenho acompanha a rolagem (stroke-dashoffset).
 *
 * Âncoras lidas do DOM:
 *  [data-linha="sobrancelha"]  elemento sob o arco inicial
 *  [data-linha-borda]          seções onde a linha cruza de um lado para o outro
 *  [data-linha="laco"]         ponto do laço final
 *  [data-linha-escuro]         áreas escuras/argila, onde a linha fica clara
 */

type Geo = {
  w: number
  h: number
  d: string
  /** só o arco inicial, para garantir que ele apareça já no carregamento */
  /** y da página -> fração da linha já desenhada (calculado direto das curvas, sem consultar o DOM) */
  mapa: { y: number; f: number }[]
  /** fração que corresponde ao arco inicial, sempre desenhado */
  minimo: number
  escuros: { x: number; y: number; w: number; h: number }[]
  mobile: boolean
}

const PL = 1000

function rel(el: Element, base: DOMRect) {
  const r = el.getBoundingClientRect()
  return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height }
}

function montar(root: HTMLElement): Geo | null {
  const base = root.getBoundingClientRect()
  const w = root.clientWidth
  const h = root.scrollHeight
  const mobile = w < 768
  const conteudo = Math.min(w - 40, 1200)
  const calha = (w - conteudo) / 2
  const dir = mobile ? w - 7 : w - Math.max(14, Math.min(calha * 0.45, 60))
  const esq = mobile ? 7 : Math.max(14, Math.min(calha * 0.45, 60))
  const amp = mobile ? 0 : Math.min(calha * 0.35, 18)

  const sob = root.querySelector('[data-linha="sobrancelha"]')
  const laco = root.querySelector('[data-linha="laco"]')
  if (!sob || !laco) return null
  const s = rel(sob, base)
  const l = rel(laco, base)

  const f = (n: number) => n.toFixed(1)
  let d = ''
  let px = 0
  let py = 0
  const amostras: { x: number; y: number }[] = []
  const M = (x: number, y: number) => {
    d += `M${f(x)} ${f(y)}`
    px = x
    py = y
    amostras.push({ x, y })
  }
  const C = (ax: number, ay: number, bx: number, by: number, x: number, y: number) => {
    d += ` C${f(ax)} ${f(ay)} ${f(bx)} ${f(by)} ${f(x)} ${f(y)}`
    for (let k = 1; k <= 12; k++) {
      const t = k / 12
      const u = 1 - t
      amostras.push({
        x: u * u * u * px + 3 * u * u * t * ax + 3 * u * t * t * bx + t * t * t * x,
        y: u * u * u * py + 3 * u * u * t * ay + 3 * u * t * t * by + t * t * t * y,
      })
    }
    px = x
    py = y
  }
  // arco de sobrancelha: começa baixo à esquerda do retrato, sobe e desce à direita
  const x0 = s.x - s.w * (mobile ? 0.12 : 0.04)
  const y0 = s.y + s.h * 0.16
  const topo = s.y - s.h * (mobile ? 0.07 : 0.1)
  const xPico = s.x + s.w * 0.58
  const x1 = mobile ? w + 30 : Math.min(dir, s.x + s.w + s.w * 0.2)
  M(x0, y0)
  C(x0 + s.w * 0.18, topo + s.h * 0.02, xPico - s.w * 0.3, topo, xPico, topo)
  if (mobile) {
    // sangra para fora da tela e volta pela borda
    C(xPico + s.w * 0.35, topo, x1, s.y + s.h * 0.06, x1, s.y + s.h * 0.2)
    C(x1, s.y + s.h * 0.45, dir, s.y + s.h * 0.55, dir, s.y + s.h * 0.75)
  } else {
    C(xPico + s.w * 0.25, topo, x1, s.y + s.h * 0.0, x1 + 4, s.y + s.h * 0.12)
    C(x1 + 10, s.y + s.h * 0.3, dir, s.y + s.h * 0.4, dir, s.y + s.h * 0.62)
  }

  const nArco = amostras.length
  let lado: 'dir' | 'esq' = 'dir'
  let yAtual = s.y + s.h * (mobile ? 0.75 : 0.62)
  const xL = () => (lado === 'dir' ? dir : esq)

  // desce pela margem com ondulação suave
  const descer = (ate: number) => {
    const x = xL()
    const dist = ate - yAtual
    if (dist <= 0) return
    const passos = Math.max(1, Math.round(dist / 420))
    const passo = dist / passos
    for (let i = 0; i < passos; i++) {
      const ya = yAtual + passo * i
      const yb = ya + passo
      const sinal = i % 2 === 0 ? 1 : -1
      const dx = (lado === 'dir' ? -1 : 1) * amp * sinal
      C(x + dx, ya + passo * 0.35, x + dx, ya + passo * 0.65, x, yb)
    }
    yAtual = ate
  }

  const bordas = Array.from(root.querySelectorAll('[data-linha-borda]'))
    .map((el) => rel(el, base).y)
    .filter((y) => y > yAtual + 80 && y < l.y - 60)

  for (const yb of bordas) {
    const banda = mobile ? 34 : 54
    descer(yb - banda)
    const xa = xL()
    lado = lado === 'dir' ? 'esq' : 'dir'
    const xb = xL()
    // atravessa na emenda entre as seções, em S
    C(xa, yb - banda * 0.1, xa + (xb - xa) * 0.2, yb, (xa + xb) / 2, yb)
    C(xa + (xb - xa) * 0.8, yb, xb, yb + banda * 0.1, xb, yb + banda)
    yAtual = yb + banda
  }

  // laço final
  const r = mobile ? 20 : 30
  const lx = l.x + l.w / 2
  const ly = l.y + l.h / 2
  descer(ly - r * 4)
  const xa = xL()
  C(xa, ly - r * 2, lx + r * 2.2, ly - r * 1.2, lx + r * 1.4, ly + r * 0.2)
  C(lx + r, ly + r * 1.1, lx - r * 1.3, ly + r * 1.2, lx - r * 1.2, ly)
  C(lx - r * 1.1, ly - r * 1.3, lx + r * 0.6, ly - r * 1.1, lx + r * 0.9, ly + r * 0.4)
  C(lx + r * 1.1, ly + r * 1.4, lx + r * 2, ly + r * 1.6, lx + r * 3.2, ly + r * 1.3)

  const escuros = Array.from(root.querySelectorAll('[data-linha-escuro]')).map((el) => rel(el, base))
  let total = 0
  let maxY = -Infinity
  const acum: { y: number; l: number }[] = []
  let lArco = 0
  amostras.forEach((a, i) => {
    if (i > 0) total += Math.hypot(a.x - amostras[i - 1].x, a.y - amostras[i - 1].y)
    if (i === nArco - 1) lArco = total
    maxY = Math.max(maxY, a.y)
    acum.push({ y: maxY, l: total })
  })
  const mapa = acum.map((a) => ({ y: a.y, f: a.l / total }))
  return { w, h, d, mapa, minimo: lArco / total, escuros, mobile }
}

export function LinhaAssinatura({ raiz }: { raiz: React.RefObject<HTMLDivElement> }) {
  const [geo, setGeo] = useState<Geo | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const mapa = useRef<{ y: number; f: number }[]>([])
  const minimo = useRef(0)
  const reduzido = useRef(false)

  // useEffect (e não useLayoutEffect): o ref do container só é ligado depois dos efeitos de layout dos filhos
  useEffect(() => {
    const root = raiz.current
    if (!root) return
    let t = 0
    const medir = () => {
      cancelAnimationFrame(t)
      t = requestAnimationFrame(() => setGeo(montar(root)))
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(root)
    document.fonts?.ready.then(medir)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(t)
    }
  }, [raiz])

  useEffect(() => {
    if (!geo) return
    mapa.current = geo.mapa
    minimo.current = geo.minimo
    atualizar()
  }, [geo])

  const atualizar = () => {
    const svg = svgRef.current
    if (!svg) return
    if (reduzido.current) {
      svg.style.setProperty('--off', '0')
      return
    }
    const alvo = window.scrollY + window.innerHeight * 0.78
    const pts = mapa.current
    let f = 1
    for (const p of pts) {
      if (p.y >= alvo) {
        f = p.f
        break
      }
    }
    f = Math.max(f, minimo.current)
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) f = 1
    svg.style.setProperty('--off', String(PL * (1 - f)))
  }

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduzido.current = mq.matches
    const onMq = () => {
      reduzido.current = mq.matches
      atualizar()
    }
    mq.addEventListener('change', onMq)
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(atualizar)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    // primeiro desenho: transição longa, depois acompanha a rolagem
    const t = window.setTimeout(() => svgRef.current?.classList.remove('primeiro'), 2400)
    return () => {
      window.removeEventListener('scroll', onScroll)
      mq.removeEventListener('change', onMq)
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [])

  if (!geo) return null
  const larg = geo.mobile ? 1.5 : 2.1
  const estilo = { strokeDasharray: PL, strokeDashoffset: 'var(--off, 1000)' } as React.CSSProperties

  const tracos = (cor: string, sec: string) => (
    <>
      <path
        d={geo.d}
        pathLength={PL}
        fill="none"
        stroke={cor}
        strokeWidth={larg}
        strokeLinecap="round"
        style={estilo}
      />
      {/* segunda passada levemente deslocada: a espessura varia como num traço à mão */}
      <path
        d={geo.d}
        pathLength={PL}
        fill="none"
        stroke={sec}
        strokeWidth={larg * 0.55}
        strokeLinecap="round"
        transform="translate(0.9 1.3)"
        opacity="0.6"
        style={estilo}
      />
    </>
  )

  return (
    <svg
      ref={svgRef}
      className="linha-assinatura primeiro pointer-events-none absolute left-0 top-0 z-[1]"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      aria-hidden="true"
      focusable="false"
      style={{ opacity: geo.mobile ? 0.85 : 1 }}
    >
      <defs>
        <clipPath id="linha-escuros">
          {geo.escuros.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} />
          ))}
        </clipPath>
      </defs>
      {tracos('var(--color-argila)', 'var(--color-argila)')}
      <g clipPath="url(#linha-escuros)">{tracos('var(--color-argila-clara)', 'var(--color-cru)')}</g>
    </svg>
  )
}
