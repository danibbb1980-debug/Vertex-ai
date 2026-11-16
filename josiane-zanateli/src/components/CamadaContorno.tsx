import { useEffect, useRef, type ReactNode } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { CONTORNOS, VIEWBOX } from '../contornos'

export function ContornoSvg({ classe, desenhar }: { classe: string; desenhar: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={`absolute inset-0 h-full w-full ${desenhar ? 'desenhar' : ''} ${classe}`}
      aria-hidden="true"
      focusable="false"
    >
      {CONTORNOS.map((d, i) => (
        <path key={i} d={d} pathLength={1} className="curva" style={{ ['--i' as string]: i }} />
      ))}
    </svg>
  )
}

/**
 * Momento de assinatura: "o contorno se desenha".
 * Um único conjunto de curvas atravessa o hero (traço grafite) e o bloco verde-musgo (traço areia).
 * As duas cópias têm a mesma geometria; cada uma é recortada (clip-path) na altura do corte entre os blocos,
 * então o contorno parece continuar e só trocar de cor.
 */
export function CamadaContorno({ children, corteRef }: { children: ReactNode; corteRef: React.RefObject<HTMLElement | null> }) {
  const raiz = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: raiz, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -160])
  const rot = useTransform(scrollYProgress, [0, 1], [0, -4])

  useEffect(() => {
    const el = corteRef.current
    const r = raiz.current
    if (!el || !r) return
    const ro = new ResizeObserver(() => r.style.setProperty('--corte', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [corteRef])

  const pos =
    'absolute right-[-50vw] top-[33rem] aspect-[2/3] w-[128vw] sm:right-[-30vw] sm:top-[9rem] sm:w-[80vw] lg:right-[-3vw] lg:top-[5rem] lg:w-[48vw] lg:max-w-[860px]'
  const estilo = reduzir ? undefined : { y, rotate: rot }

  return (
    <div ref={raiz} className="relative">
      {children}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 calc(100% - var(--corte, 100%)) 0)' }}>
          <m.div className={pos} style={estilo}>
            <ContornoSvg classe="stroke-grafite/60 lg:stroke-grafite/70 [stroke-width:1px]" desenhar />
          </m.div>
        </div>
        <div className="absolute inset-0" style={{ clipPath: 'inset(var(--corte, 100%) 0 0 0)' }}>
          <m.div className={pos} style={estilo}>
            <ContornoSvg classe="stroke-areia/40 lg:stroke-areia/45 [stroke-width:1px]" desenhar />
          </m.div>
        </div>
      </div>
    </div>
  )
}
