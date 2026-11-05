import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Momento de assinatura: uma linha fina vinho, como um traço de pincel, que se desenha ao rolar.
 * Sai do hero, corre pelas margens (atravessando de um lado ao outro apenas nos respiros entre seções)
 * e termina numa mancha de aquarela que envolve o botão de agendar.
 * Custo: um único path SVG; a cada quadro só muda stroke-dashoffset e o transform do ponto da ponta.
 */
const CRUZAMENTOS = ['a-medica', 'atendimentos', 'como-funciona', 'contato', 'agendar']

type Geo = { w: number; h: number; d: string }

export function LinhaFluxo({ alvo }: { alvo: RefObject<HTMLDivElement | null> }) {
  const [geo, setGeo] = useState<Geo | null>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const ecoRef = useRef<SVGPathElement>(null)
  const pontaRef = useRef<SVGCircleElement>(null)
  const amostras = useRef<{ len: number; y: number }[]>([])

  // 1) monta o desenho a partir da posição real das seções
  useEffect(() => {
    const wrap = alvo.current
    if (!wrap) return
    const medir = () => {
      const r = wrap.getBoundingClientRect()
      const w = r.width
      const h = wrap.scrollHeight
      // posição pelo offset (ignora transforms das animações de entrada)
      const rel = (el: Element) => {
        let x = 0
        let y = 0
        let n: HTMLElement | null = el as HTMLElement
        while (n && n !== wrap) {
          x += n.offsetLeft
          y += n.offsetTop
          n = n.offsetParent as HTMLElement | null
        }
        const e = el as HTMLElement
        return { x, y, w: e.offsetWidth, h: e.offsetHeight }
      }
      const inicioEl = wrap.querySelector('[data-fluxo="inicio"]')
      const fimEl = wrap.querySelector('[data-fluxo="fim"]')
      if (!inicioEl || !fimEl) return setGeo(null)
      const ini = rel(inicioEl)
      const fim = rel(fimEl)
      const margem = w < 768 ? 9 : Math.max(24, Math.min(56, (w - 1216) / 2 + 20))
      const lado = [margem, w - margem]
      let s = 1 // começa pela direita
      const S = { x: ini.x + ini.w * 0.5, y: ini.y + ini.h + 46 }
      const ys = CRUZAMENTOS.map((id) => wrap.querySelector(`#${id}`))
        .filter((el): el is Element => !!el)
        .map((el) => rel(el).y)
        .filter((y) => y > S.y + 80)
      const E = { x: fim.x - 4, y: fim.y + fim.h / 2 }
      const banda = w < 768 ? 46 : 70
      let d = `M ${S.x} ${S.y}`
      // do hero até a margem direita
      const y1 = S.y + 90
      d += ` C ${S.x} ${S.y + 60}, ${lado[s]} ${S.y + 20}, ${lado[s]} ${y1}`
      let yAtual = y1
      for (const yb of ys) {
        if (yb >= E.y - 140) break
        const a = Math.max(yAtual, yb - banda)
        d += ` L ${lado[s]} ${a}`
        const ns = 1 - s
        d += ` C ${lado[s]} ${yb}, ${lado[ns]} ${yb}, ${lado[ns]} ${yb + banda}`
        s = ns
        yAtual = yb + banda
      }
      const yAprox = Math.max(yAtual, E.y - 150)
      d += ` L ${lado[s]} ${yAprox}`
      d += ` C ${lado[s]} ${E.y - 20}, ${E.x - 60} ${E.y + 10}, ${E.x} ${E.y}`
      setGeo({ w, h, d })
    }
    let ro: ResizeObserver | undefined
    let raf = 0
    const agendar = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(medir)
    }
    const iniciar = () => {
      medir()
      ro = new ResizeObserver(agendar)
      ro.observe(wrap)
    }
    // fora do caminho crítico: espera o carregamento e um momento ocioso
    const ocioso = (cb: () => void) =>
      typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 600)
    let cancelado = false
    const comecar = () => ocioso(() => !cancelado && iniciar())
    if (document.readyState === 'complete') comecar()
    else window.addEventListener('load', comecar, { once: true })
    return () => {
      cancelado = true
      window.removeEventListener('load', comecar)
      cancelAnimationFrame(raf)
      ro?.disconnect()
    }
  }, [alvo])

  // 2) liga o traço à rolagem
  useEffect(() => {
    const wrap = alvo.current
    const path = pathRef.current
    if (!wrap || !path || !geo) return
    const total = path.getTotalLength()
    const N = 240
    amostras.current = Array.from({ length: N + 1 }, (_, i) => {
      const len = (total * i) / N
      return { len, y: path.getPointAtLength(len).y }
    })
    for (const p of [path, ecoRef.current]) {
      if (!p) continue
      p.style.strokeDasharray = `${total}`
    }
    const fim = wrap.querySelector<HTMLElement>('[data-fluxo="fim"]')
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzir) {
      path.style.strokeDashoffset = '0'
      if (ecoRef.current) ecoRef.current.style.strokeDashoffset = '0'
      fim?.setAttribute('data-chegou', 'true')
      if (pontaRef.current) pontaRef.current.style.opacity = '0'
      return
    }

    let raf = 0
    let ativo = false
    const atualizar = () => {
      raf = 0
      const r = wrap.getBoundingClientRect()
      const alvoY = window.innerHeight * 0.62 - r.top
      const a = amostras.current
      let len = 0
      if (alvoY >= a[a.length - 1].y) len = total
      else {
        // maior comprimento cuja altura ainda está acima do alvo (o traço desce de forma monotônica)
        for (let i = a.length - 1; i >= 0; i--) {
          if (a[i].y <= alvoY) {
            const prox = a[Math.min(i + 1, a.length - 1)]
            const t = prox.y === a[i].y ? 0 : (alvoY - a[i].y) / (prox.y - a[i].y)
            len = a[i].len + t * (prox.len - a[i].len)
            break
          }
        }
      }
      const off = String(total - len)
      path.style.strokeDashoffset = off
      if (ecoRef.current) ecoRef.current.style.strokeDashoffset = off
      if (pontaRef.current) {
        const p = path.getPointAtLength(len)
        pontaRef.current.style.transform = `translate(${p.x}px, ${p.y}px)`
        pontaRef.current.style.opacity = len > 4 && len < total - 2 ? '1' : '0'
      }
      if (fim) fim.setAttribute('data-chegou', len >= total - 2 ? 'true' : 'false')
    }
    const pedir = () => {
      if (ativo && !raf) raf = requestAnimationFrame(atualizar)
    }
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting
      if (ativo) pedir()
    })
    io.observe(wrap)
    ativo = true
    atualizar()
    window.addEventListener('scroll', pedir, { passive: true })
    window.addEventListener('resize', pedir)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', pedir)
      window.removeEventListener('resize', pedir)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [geo, alvo])

  if (!geo) return null
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-[5] hidden overflow-visible [.js_&]:block"
      width={geo.w}
      height={geo.h}
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <path ref={ecoRef} d={geo.d} fill="none" stroke="var(--color-vinho)" strokeWidth="0.7" strokeOpacity="0.28" strokeLinecap="round" transform="translate(4 3)" />
      <path ref={pathRef} d={geo.d} fill="none" stroke="var(--color-vinho)" strokeWidth="1.35" strokeOpacity="0.7" strokeLinecap="round" />
      <circle ref={pontaRef} r="3.2" cx="0" cy="0" fill="var(--color-vinho)" style={{ opacity: 0 }} />
    </svg>
  )
}
