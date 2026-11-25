import { m, useScroll } from 'motion/react'

export function ProgressoLeitura() {
  const { scrollYProgress } = useScroll()
  return <m.div className="progresso-leitura" aria-hidden="true" style={{ scaleY: scrollYProgress }} />
}
