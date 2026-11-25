import { useRef } from 'react'
import { m, useMotionTemplate, useScroll, useTransform } from 'motion/react'

/** "LUMIVO" gigante cortado na base; ao rolar sobe (0.6x) e um feixe de luz a revela. */
export function PalavraLuz() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 0.25'] })
  const y = useTransform(scrollYProgress, [0, 1], ['24%', '-6%'])
  const x = useTransform(scrollYProgress, [0.25, 0.95], [-15, 115])
  const pos = useMotionTemplate`${x}%`
  // opacidade via variável CSS: o motion aceleraria por ScrollTimeline nativo, que não acompanha este alvo
  const brilho = useTransform(scrollYProgress, [0.1, 0.35], [0, 1])

  return (
    <div ref={ref} className="palavra-luz" aria-hidden="true">
      <m.div className="palavra-luz__palco" style={{ y }}>
        <span className="palavra-luz__base">Lumivo</span>
        <m.span className="palavra-luz__acesa" style={{ '--x': pos, '--b': brilho } as never}>
          Lumivo
        </m.span>
        <m.span className="palavra-luz__feixe" style={{ left: pos, '--b': brilho } as never} />
      </m.div>
    </div>
  )
}
