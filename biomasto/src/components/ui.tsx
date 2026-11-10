import { Fragment, useRef, type ReactNode, type MouseEvent } from 'react'
import { m, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

/* ------------------------------------------------------------------
 * Botão com efeito magnético sutil (adaptado do "Magnetic Button" do 21st.dev):
 * deslocamento máximo de 4px, só transform, desligado com reduced-motion e em telas de toque.
 * ------------------------------------------------------------------ */
type BotaoProps = {
  href: string
  children: ReactNode
  variante?: 'primario' | 'secundario' | 'claro' | 'contorno-claro'
  externo?: boolean
  className?: string
  ariaLabel?: string
  icone?: ReactNode
  'data-fio-fim'?: boolean
}

const estilos = {
  primario:
    'bg-ameixa text-marfim hover:bg-ameixa-2 shadow-[0_10px_30px_-12px_rgb(75_48_69/0.55)]',
  secundario:
    'bg-transparent text-ameixa ring-1 ring-inset ring-ameixa/25 hover:ring-ameixa/60 hover:bg-white/50',
  claro: 'bg-marfim text-ameixa hover:bg-white shadow-[0_10px_30px_-12px_rgb(0_0_0/0.4)]',
  'contorno-claro': 'bg-transparent text-marfim ring-1 ring-inset ring-marfim/35 hover:ring-marfim/80',
}

export function Botao({ href, children, variante = 'primario', externo, className = '', ariaLabel, icone, ...rest }: BotaoProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduz = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const mover = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduz || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width - 0.5) * 8)
    y.set(((e.clientY - r.top) / r.height - 0.5) * 6)
  }
  const soltar = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onMouseMove={mover}
      onMouseLeave={soltar}
      style={{ x: sx, y: sy }}
      data-fio-fim={rest['data-fio-fim'] ? '' : undefined}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.98rem] font-semibold tracking-[0.01em] transition-[background-color,box-shadow,color] duration-300 ${estilos[variante]} ${className}`}
    >
      {icone}
      <span>{children}</span>
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </m.a>
  )
}

/* ------------------------------------------------------------------
 * Revelação de texto palavra a palavra (adaptado do "Text Reveal" do 21st.dev):
 * cada palavra sobe de dentro de uma máscara. CSS puro para não atrasar a primeira pintura.
 * Marque a palavra de ênfase com *asteriscos*.
 * ------------------------------------------------------------------ */
export function TextoRevelado({ texto, atraso = 0 }: { texto: string; atraso?: number }) {
  const palavras = texto.split(' ')
  return (
    <>
      {palavras.map((p, i) => {
        const enfase = p.startsWith('*')
        const limpa = p.replace(/\*/g, '')
        const pont = enfase ? limpa.match(/[.,!?]$/)?.[0] ?? '' : ''
        const nucleo = pont ? limpa.slice(0, -1) : limpa
        return (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
              <span className="revela-palavra inline-block" style={{ animationDelay: `${atraso + i * 35}ms` }}>
                {enfase ? (
                  <>
                    <em className="enfase">{nucleo}</em>
                    {pont}
                  </>
                ) : (
                  limpa
                )}
              </span>
            </span>
            {i < palavras.length - 1 && ' '}
          </Fragment>
        )
      })}
    </>
  )
}

/** Converte "texto com *ênfase*" em JSX. */
export function Enfase({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*]+\*)/)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('*') ? (
          <em key={i} className="enfase">
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

/** Entrada suave ao aparecer na tela (opacidade + translate). */
export function Revela({ children, atraso = 0, className = '' }: { children: ReactNode; atraso?: number; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}

/** Pequena onda verde-sálvia que se desenha ao aparecer (eco da logo). */
export function OndaPequena({ className = '', largura = 72 }: { className?: string; largura?: number }) {
  return (
    <svg width={largura} height={14} viewBox="0 0 72 14" className={className} aria-hidden="true" focusable="false">
      <m.path
        d="M2 4c9 10 19 10 28 5s18-10 26-5 12 6 14 4"
        fill="none"
        stroke="var(--color-salvia)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

export function CabecalhoSecao({
  rotulo,
  titulo,
  texto,
  id,
  centro,
}: {
  rotulo: string
  titulo: string
  texto?: string
  id: string
  centro?: boolean
}) {
  return (
    <Revela className={centro ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`rotulo flex items-center gap-3 ${centro ? 'justify-center' : ''}`}>
        <OndaPequena largura={36} />
        {rotulo}
      </p>
      <h2 id={id} className="mt-4 text-[2.1rem] sm:text-[2.6rem] lg:text-[3rem]">
        <Enfase texto={titulo} />
      </h2>
      {texto && <p className="mt-5 text-lg text-tinta-2">{texto}</p>}
    </Revela>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/logo-biomasto.svg"
      alt="Clínica Biomasto"
      width={1400}
      height={640}
      className={className}
      decoding="async"
    />
  )
}
