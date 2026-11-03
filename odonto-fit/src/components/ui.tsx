import { m, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { IconWhatsApp } from './icons'
import { waLink } from '../lib/contato'

/**
 * A curva verde-água do logo: se desenha quando entra na tela.
 * É a linha condutora do site, passando por baixo da palavra em ênfase de cada título.
 */
export function Swoosh({ className = '', delay = 0.15 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  // "Wipe": a moldura entra da esquerda e o desenho, em sentido oposto. A curva parece se
  // desenhar da esquerda para a direita, animando só transform (traço com espessura fixa).
  const t = { duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] as const }
  return (
    <m.span
      aria-hidden="true"
      className={`pointer-events-none absolute -bottom-[0.2em] left-[-2%] block h-[0.36em] w-[104%] ${className}`}
      initial={reduce ? false : 'oculto'}
      whileInView="visivel"
      viewport={{ once: true, amount: 0.6 }}
    >
      <m.span className="anim block h-full w-full overflow-hidden" variants={{ oculto: { x: '-100%' }, visivel: { x: 0 } }} transition={t}>
        <m.span className="anim block h-full w-full" variants={{ oculto: { x: '100%' }, visivel: { x: 0 } }} transition={t}>
          <svg viewBox="0 -3 200 20" preserveAspectRatio="none" className="block h-full w-full overflow-visible">
            <path
              d="M3 10.5C46 3.2 118 1.4 197 6.8"
              fill="none"
              stroke="var(--color-aqua)"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </m.span>
      </m.span>
    </m.span>
  )
}

/** Texto em ênfase com a curva por baixo. */
export function Enfase({ children, escuro = false }: { children: ReactNode; escuro?: boolean }) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${escuro ? 'text-aqua' : 'text-aqua-ink'}`}>
      {children}
      <Swoosh />
    </span>
  )
}

export function SectionTitle({
  eyebrow,
  titulo,
  enfase,
  depois,
  intro,
  id,
  centro = false,
  escuro = false,
}: {
  eyebrow: string
  titulo: string
  enfase: string
  depois?: string
  intro?: ReactNode
  id: string
  centro?: boolean
  escuro?: boolean
}) {
  return (
    <div className={`max-w-[42rem] ${centro ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow ${escuro ? '!text-aqua' : ''}`}>{eyebrow}</p>
      <h2 id={id} className={`mt-4 text-[2.15rem] leading-[1.05] sm:text-5xl ${escuro ? '!text-white' : ''}`}>
        {titulo} <Enfase escuro={escuro}>{enfase}</Enfase>
        {depois}
      </h2>
      {intro && <p className={`mt-6 text-lg ${escuro ? 'text-white/80' : 'text-ink'}`}>{intro}</p>}
    </div>
  )
}

/** Entrada suave ao rolar (só transform e opacity). */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const reduce = useReducedMotion()
  const M = m[as]
  return (
    <M
      className={`anim ${className}`}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

export function BotaoWhatsApp({
  children = 'Agendar pelo WhatsApp',
  mensagem,
  className = 'btn-aqua',
  rotulo,
}: {
  children?: ReactNode
  mensagem?: string
  className?: string
  rotulo?: string
}) {
  return (
    <a
      href={waLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${className}`}
      aria-label={rotulo}
    >
      <IconWhatsApp size={20} />
      <span>{children}</span>
      <ArrowUpRight size={16} className="seta opacity-70" aria-hidden="true" />
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  )
}
