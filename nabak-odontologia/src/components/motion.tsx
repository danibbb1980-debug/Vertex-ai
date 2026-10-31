/**
 * Primitivas de movimento. Inspiradas em componentes do 21st.dev
 * (Text Reveal, Spotlight, Magnetic Button, Marquee, Scroll Progress),
 * reescritas para a identidade Nabak: só transform/opacity, respeitam
 * prefers-reduced-motion e pausam fora da viewport.
 */
import { m, useReducedMotion, type Variants } from 'motion/react'
import {
  Children,
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type PointerEvent as RPointerEvent,
  type ReactNode,
} from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

/* Revelação ao rolar */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article' | 'p'
}) {
  const reduce = useReducedMotion()
  const Comp = m[as] as typeof m.div
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: reduce ? 0.3 : 0.9, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

/* Grupo com entrada escalonada */
const groupV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const itemV: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}
export function Stagger({ children, className, as = 'ul' }: { children: ReactNode; className?: string; as?: 'ul' | 'div' | 'ol' }) {
  const Comp = m[as] as typeof m.ul
  return (
    <Comp className={className} variants={groupV} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
      {children}
    </Comp>
  )
}
export function StaggerItem({ children, className, as = 'li' }: { children: ReactNode; className?: string; as?: 'li' | 'div' }) {
  const Comp = m[as] as typeof m.li
  return (
    <Comp className={className} variants={itemV}>
      {children}
    </Comp>
  )
}

/**
 * Título com revelação palavra a palavra (máscara + translateY).
 * Use *palavra* para a ênfase em itálico.
 */
export function TextReveal({
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  onView = true,
  id,
}: {
  id?: string
  text: string
  as?: ElementType
  className?: string
  delay?: number
  onView?: boolean
}) {
  const reduce = useReducedMotion()
  // cada palavra vira uma lista de segmentos; *ênfase* pode cobrir várias palavras
  // e a pontuação colada (ex.: "*planejamento*,") fica na mesma palavra
  const words: { t: string; em: boolean }[][] = []
  let inEm = false
  text.split(/\s+/).filter(Boolean).forEach((chunk) => {
    const segs: { t: string; em: boolean }[] = []
    chunk.split('*').forEach((part, idx) => {
      if (idx > 0) inEm = !inEm
      if (part) segs.push({ t: part, em: inEm })
    })
    words.push(segs)
  })
  const plain = text.replace(/\*/g, '')
  const anim = onView
    ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -8% 0px' } }
    : { animate: 'show' }
  return (
    <Tag className={className} id={id}>
      <span className="sr-only">{plain}</span>
      <m.span
        aria-hidden
        initial="hidden"
        {...anim}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
        style={{ display: 'inline' }}
      >
        {words.map((t, i) => (
          <Fragment key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
            <m.span
              style={{ display: 'inline-block' }}
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: '105%' },
                show: { y: 0, opacity: 1, transition: { duration: reduce ? 0.3 : 0.95, ease: EASE } },
              }}
            >
              {t.map((sg, k) => (sg.em ? <em key={k}>{sg.t}</em> : <Fragment key={k}>{sg.t}</Fragment>))}
            </m.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </m.span>
    </Tag>
  )
}

/* Spotlight: grava a posição do cursor em --mx/--my, sem re-render */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const frame = useRef(0)
  const onPointerMove = (e: RPointerEvent<T>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    cancelAnimationFrame(frame.current)
    const { clientX, clientY } = e
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - r.left}px`)
      el.style.setProperty('--my', `${clientY - r.top}px`)
    })
  }
  return { ref, onPointerMove }
}

/* Botão magnético sutil (só mouse, só sem reduced-motion) */
export function Magnetic({ children, strength = 0.22 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const move = (e: RPointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }
  const leave = () => {
    if (ref.current) ref.current.style.transform = 'translate3d(0,0,0)'
  }
  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ display: 'inline-flex', transition: 'transform .5s cubic-bezier(.22,1,.36,1)' }}
    >
      {children}
    </span>
  )
}

/* Pausa animações CSS quando fora da viewport */
export function useInViewport<T extends HTMLElement>(rootMargin = '0px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return { ref, visible }
}

/* Marquee discreto: pausa fora da tela e no hover; estático com reduced-motion */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, visible } = useInViewport<HTMLDivElement>()
  const items = Children.toArray(children)
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((c, i) => (
        <li key={i} className="flex items-center">
          {c}
          <span className="mx-8 inline-block h-[5px] w-[5px] rotate-45 border border-copper md:mx-12" aria-hidden />
        </li>
      ))}
    </ul>
  )
  return (
    <div ref={ref} className={`marquee overflow-hidden ${visible ? '' : 'marquee-paused'} ${className ?? ''}`}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

/* Oval do monograma (assinatura). Desenha o traço ao entrar. */
export function OvalFrame({
  className,
  style,
  draw = true,
  late = false,
  strokeWidth = 1,
  id,
}: {
  className?: string
  style?: CSSProperties
  draw?: boolean
  late?: boolean
  strokeWidth?: number
  id: string
}) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 260" fill="none" aria-hidden focusable={false} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9CFAA" />
          <stop offset="45%" stopColor="#B98A5E" />
          <stop offset="70%" stopColor="#E2C49E" />
          <stop offset="100%" stopColor="#A7764C" />
        </linearGradient>
      </defs>
      <ellipse
        cx="100"
        cy="130"
        rx="98"
        ry="128"
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className={draw ? (late ? 'oval-draw-late' : 'oval-draw') : undefined}
      />
    </svg>
  )
}
