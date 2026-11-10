import { useEffect, useState, type RefObject } from 'react'
import { m, useScroll, useSpring, useReducedMotion, useTransform } from 'motion/react'

/**
 * O fio da logo: uma onda contínua verde-sálvia que conduz a leitora pelo site.
 * Corre pelas margens laterais, troca de lado nos espaços entre as seções
 * e termina numa curva que abraça o botão final ("Ligar para agendar").
 * Só no desktop (lg+), onde há margem lateral livre. Desenha conforme a rolagem.
 */
export function FioOnda({ alvo }: { alvo: RefObject<HTMLElement> }) {
  const [d, setD] = useState('')
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const reduz = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: alvo, offset: ['start start', 'end end'] })
  const suave = useSpring(scrollYProgress, { stiffness: 70, damping: 22, restDelta: 0.0005 })
  // começa já um pouco desenhado (nasce da onda do hero)
  const comprimento = useTransform(suave, [0, 1], [0.04, 1])

  useEffect(() => {
    const raiz = alvo.current
    if (!raiz) return
    const calcular = () => {
      const W = raiz.clientWidth
      if (W < 1024) {
        setD('')
        return
      }
      const H = raiz.scrollHeight
      const top = (el: Element) => el.getBoundingClientRect().top - raiz.getBoundingClientRect().top
      const secoes = Array.from(raiz.querySelectorAll<HTMLElement>('[data-fio]'))
      const fim = raiz.querySelector<HTMLElement>('[data-fio-fim]')
      if (secoes.length < 2 || !fim) return

      const conteudo = Math.min(W, 1152)
      const margem = (W - conteudo) / 2
      const xE = Math.max(22, margem * 0.45)
      const xD = W - xE
      const amp = 9

      const hero = secoes[0]
      const yIni = top(hero) + hero.offsetHeight * 0.62
      let x = xD
      let y = yIni
      let caminho = `M ${xD - 70} ${yIni - 40} C ${xD - 30} ${yIni - 40} ${xD} ${yIni - 20} ${xD} ${yIni}`

      // desce ondulando suavemente pela margem até a altura pedida
      const descer = (ate: number) => {
        const passo = 260
        let lado = 1
        while (ate - y > passo * 1.2) {
          const ny = y + passo
          caminho += ` C ${x + amp * lado} ${y + passo * 0.35} ${x + amp * lado} ${y + passo * 0.65} ${x} ${ny}`
          y = ny
          lado *= -1
        }
        if (ate > y) {
          caminho += ` L ${x} ${ate}`
          y = ate
        }
      }
      // troca de lado na fronteira entre seções, dentro do espaço livre (padding)
      const cruzar = (fronteira: number, para: number) => {
        descer(fronteira - 64)
        caminho += ` C ${x} ${fronteira} ${para} ${fronteira} ${para} ${fronteira + 64}`
        x = para
        y = fronteira + 64
      }

      for (let i = 1; i < secoes.length; i++) {
        const s = secoes[i]
        const fronteira = top(s)
        if (s.dataset.fio === 'cta') {
          // no CTA o fio chega pela esquerda, onde não há texto ao lado do botão
          if (x !== xE) cruzar(fronteira, xE)
          break
        }
        cruzar(fronteira, x === xD ? xE : xD)
      }

      // termina numa curva que abraça o botão final, como o cálice da tulipa
      const r = fim.getBoundingClientRect()
      const rr = raiz.getBoundingClientRect()
      const bx = r.left - rr.left
      const by = r.top - rr.top
      const bw = r.width
      const bh = r.height
      const meio = by + bh / 2
      const esq = bx - 30
      descer(meio - 120)
      caminho += ` C ${x} ${meio - 20} ${esq - 80} ${meio} ${esq} ${meio}`
      caminho += ` C ${bx - 6} ${by + bh + 30} ${bx + bw * 0.6} ${by + bh + 32} ${bx + bw + 6} ${by + bh + 4}`

      setDims({ w: W, h: H })
      setD(caminho)
    }

    calcular()
    const ro = new ResizeObserver(() => requestAnimationFrame(calcular))
    ro.observe(raiz)
    window.addEventListener('load', calcular)
    return () => {
      ro.disconnect()
      window.removeEventListener('load', calcular)
    }
  }, [alvo])

  if (!d) return null
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute left-0 top-0 z-[1] hidden lg:block"
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
    >
      <m.path
        d={d}
        fill="none"
        stroke="var(--color-salvia)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength: reduz ? 1 : comprimento }}
      />
    </svg>
  )
}
