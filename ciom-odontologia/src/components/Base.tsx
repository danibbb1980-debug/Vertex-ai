import { useEffect, useRef, useState, type ReactNode } from 'react'
import { m, useInView, useScroll, useSpring, useTransform } from 'motion/react'

export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const M = as === 'li' ? m.li : as === 'article' ? m.article : m.div
  return (
    <M
      className={className}
      data-anim=""
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

/** Ponto da linha de planejamento: acende quando a seção entra na tela. */
export function PlanNode({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -45% 0px' })
  const [visto, setVisto] = useState(false)
  useEffect(() => {
    if (inView) setVisto(true)
  }, [inView])
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute z-[2] hidden h-[13px] w-[13px] -translate-x-1/2 items-center justify-center rounded-full border md:flex ${
        dark ? 'border-sage-soft bg-ink' : 'border-sage-deep bg-ivory'
      } ${className}`}
      style={{ left: 'calc(20px - var(--pad))' }}
    >
      <span
        className={`block h-[5px] w-[5px] rounded-full transition-transform duration-700 ${dark ? 'bg-sage-soft' : 'bg-sage-deep'}`}
        style={{ transform: `scale(${visto ? 1 : 0})`, transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}
      />
    </span>
  )
}

export function SectionHead({
  numero,
  rotulo,
  titulo,
  intro,
  dark = false,
  center = false,
  id,
}: {
  numero: string
  rotulo: string
  titulo: ReactNode
  intro?: ReactNode
  dark?: boolean
  center?: boolean
  id?: string
}) {
  return (
    <div className={`relative ${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <PlanNode dark={dark} className="top-[3px]" />
      <Reveal>
        <p className={`eyebrow flex items-center gap-3 ${center ? 'justify-center' : ''} ${dark ? 'text-sage-soft' : 'text-sage-deep'}`}>
          <span className="tabular-nums opacity-80">{numero}</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-50" />
          <span>{rotulo}</span>
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 id={id} className={`h2 mt-5 ${dark ? 'text-ivory' : 'text-ink'}`}>
          {titulo}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.12}>
          <p className={`mt-6 max-w-2xl text-lg ${center ? 'mx-auto' : ''} ${dark ? 'text-ivory/80' : 'text-muted'}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  )
}

/**
 * Assinatura visual: uma linha fina de "projeto" que se desenha com a rolagem,
 * ligando as seções da avaliação ao acompanhamento. Só transform/opacity.
 */
export function PlanLine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 55%', 'end 55%'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const [altura, setAltura] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setAltura(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const tipY = useTransform(p, (v) => v * altura)

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-[1] hidden w-[9px] -translate-x-1/2 md:block"
        style={{ left: 'max(20px, calc(50% - 600px))' }}
      >
        {/* trilho com marcações de régua */}
        <div
          className="absolute inset-y-0 left-1/2 w-[9px] -translate-x-1/2"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, var(--color-line) 0 1px, transparent 1px 40px)',
          }}
        />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
        <m.div
          className="absolute inset-y-0 left-1/2 w-[1.5px] origin-top -translate-x-1/2 bg-sage-deep"
          data-anim=""
          style={{ scaleY: p }}
        />
        {altura > 0 && (
          <m.div data-anim-hide="" className="absolute left-1/2 top-0 -ml-[6px] -mt-[6px] h-3 w-3" style={{ y: tipY }}>
            <span className="absolute inset-0 rounded-full bg-sage/30" style={{ transform: 'scale(2.2)' }} />
            <span className="absolute inset-[3px] rounded-full bg-sage-deep" />
          </m.div>
        )}
      </div>
      {children}
    </div>
  )
}
