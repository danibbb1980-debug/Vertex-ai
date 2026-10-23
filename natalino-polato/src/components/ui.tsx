import { useRef, useState, useId, type ReactNode, type MouseEvent } from 'react'
import { m as motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

export function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3ZM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm0-21.6A11.8 11.8 0 0 0 1.9 18l-1.7 6 6.2-1.6A11.8 11.8 0 1 0 12 .2Z" />
    </svg>
  )
}

export function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Botão com leve atração magnética ao cursor (só em mouse; desativado com reduced-motion). */
export function MagneticLink({
  href,
  children,
  className = '',
  external = false,
  ariaLabel,
}: {
  href: string
  children: ReactNode
  className?: string
  external?: boolean
  ariaLabel?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 160, damping: 18, mass: 0.4 })

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current || !window.matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.14)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.22)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.a>
  )
}

/** Revelação suave ao entrar na tela. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Cabeçalho de seção numerado. */
export function SectionLabel({ n, children, dark = false }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <p className={`label flex items-center gap-4 ${dark ? 'text-bronze' : 'text-bronze-deep'}`}>
      <span className="tabular-nums">{n}</span>
      <span aria-hidden="true" className={`h-px w-10 ${dark ? 'bg-bronze/60' : 'bg-bronze-deep/50'}`} />
      <span>{children}</span>
    </p>
  )
}

export type FaqItem = { q: string; a: ReactNode }

/** Acordeão acessível (botões com aria-expanded / aria-controls). */
export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${base}-b${i}`
        const panelId = `${base}-p${i}`
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full cursor-pointer items-start gap-5 py-6 text-left md:py-7"
              >
                <span className="label mt-2 w-6 shrink-0 tabular-nums text-bronze-deep">{String(i + 1).padStart(2, '0')}</span>
                <span className="display flex-1 text-[1.45rem] leading-snug text-text transition-colors duration-300 group-hover:text-bronze-deep md:text-[1.7rem]">
                  {item.q}
                </span>
                <span aria-hidden="true" className="relative mt-3 h-3 w-3 shrink-0">
                  <span className="absolute top-1/2 left-0 h-px w-3 bg-text" />
                  <span
                    className={`absolute top-0 left-1/2 h-3 w-px bg-text transition-transform duration-500 ease-out ${isOpen ? 'scale-y-0' : 'scale-y-100'}`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="max-w-2xl pb-7 pl-11 text-muted">{item.a}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
