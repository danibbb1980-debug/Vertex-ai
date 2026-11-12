import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'

/**
 * O fio condutor: uma linha fina, com o mesmo traço do monograma, que desce pela margem
 * esquerda das seções e se desenha conforme a página rola, terminando no nó de "Solicitar agendamento".
 * O ponto final é o elemento marcado com [data-fim-do-fio].
 */
export function Trilho({ children }: { children: ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null)
  const linha = useRef<HTMLDivElement>(null)
  const [altura, setAltura] = useState(0)
  const reduzir = useReducedMotion()

  useLayoutEffect(() => {
    const el = caixa.current
    if (!el) return
    const medir = () => {
      const fim = el.querySelector<HTMLElement>('[data-fim-do-fio]')
      if (!fim) return setAltura(0)
      const a = fim.getBoundingClientRect()
      const b = el.getBoundingClientRect()
      setAltura(Math.max(0, a.top - b.top + a.height / 2))
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: linha, offset: ['start 72%', 'end 72%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 })
  const traco = useRef<SVGPathElement>(null)
  // só stroke-dashoffset é animado (pathLength = 1)
  const aplicar = (v: number) => {
    if (traco.current) traco.current.style.strokeDashoffset = String(reduzir ? 0 : 1 - Math.min(1, Math.max(0, v)))
  }
  useMotionValueEvent(progresso, 'change', aplicar)
  useLayoutEffect(() => aplicar(progresso.get()))

  return (
    <div ref={caixa} className="relative">
      {altura > 0 && (
        <div
          ref={linha}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 z-10 w-3 -translate-x-1/2"
          style={{ left: 'max(var(--pad), calc((100% - var(--wrap)) / 2 + var(--pad)))', height: altura }}
        >
        <svg focusable="false" className="block size-full" viewBox={`0 0 12 ${altura}`} preserveAspectRatio="none">
          <path
            ref={traco}
            d={`M6 0V${altura}`}
            pathLength={1}
            fill="none"
            stroke="#B48E57"
            strokeWidth={1}
            strokeDasharray="1 2"
            strokeDashoffset={1}
          />
        </svg>
        </div>
      )}
      {children}
    </div>
  )
}
