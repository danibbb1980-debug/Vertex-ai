import { useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { CONFIG, temWhatsapp, waLink } from '../config'
import { MONOGRAMA_PATHS } from './Logo'
import { IconeWhatsapp } from './Icones'

/*
 * Momento de assinatura: "a porta se abre".
 * 1) Na entrada, os arcos finos se desenham em sequência (stroke-dashoffset via pathLength),
 *    a porta caramelo sobe por clip-path e o monograma aparece no centro.
 * 2) Ao rolar, a porta caramelo é transladada e escalada até cobrir a tela e vira o fundo
 *    da seção seguinte ("A clínica"), como se o visitante entrasse na clínica.
 * Só transform, opacity, clip-path e stroke-dashoffset. Com prefers-reduced-motion,
 * tudo aparece desenhado e a porta não cresce.
 */

const EASE = [0.65, 0, 0.35, 1] as const

// Arcos concêntricos (viewBox 0 0 300 400). A porta caramelo ocupa x 30–270, topo em y 30.
const ARCOS_EXTERNOS = ['M0 400 V150 A150 150 0 0 1 300 150 V400', 'M15 400 V150 A135 135 0 0 1 285 150 V400']
const ARCOS_INTERNOS = ['M66 400 V200 A84 84 0 0 1 234 200 V400', 'M96 400 V244 A54 54 0 0 1 204 244 V400']

const linhasTitulo: { texto: string; enfase?: string }[] = [
  { texto: 'Cada rosto pede' },
  { texto: 'um ', enfase: 'plano' },
  { texto: 'próprio.' },
]

export function Hero() {
  const reduz = useReducedMotion() ?? false
  const secaoRef = useRef<HTMLElement>(null)
  const palcoRef = useRef<HTMLDivElement>(null)
  const portaBoxRef = useRef<HTMLDivElement>(null)
  const geo = useRef({ dx: 0, dy: 0, s: 1, oy: 0 })

  const { scrollYProgress } = useScroll({ target: secaoRef, offset: ['start start', 'end end'] })
  const p = useTransform(scrollYProgress, [0.03, 0.82], [0, 1], { clamp: true })
  const pe = useTransform(p, (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2))
  const x = useTransform(pe, (v) => geo.current.dx * v)
  const y = useTransform(pe, (v) => geo.current.dy * v)
  const escala = useTransform(pe, (v) => 1 + (geo.current.s - 1) * v)
  const opacDetalhe = useTransform(p, [0, 0.3], [1, 0])
  const opacTexto = useTransform(p, [0, 0.32], [1, 0])
  const yTexto = useTransform(p, [0, 0.32], [0, -40])

  useLayoutEffect(() => {
    if (reduz) return
    const medir = () => {
      const palco = palcoRef.current
      const box = portaBoxRef.current
      if (!palco || !box) return
      const rp = palco.getBoundingClientRect()
      const rb = box.getBoundingClientRect()
      const w = rb.width
      const cx = rb.left - rp.left + w / 2
      const cy = rb.top - rp.top + w / 2 // centro do semicírculo da porta
      const W = rp.width
      const H = rp.height
      geo.current = { dx: W / 2 - cx, dy: H / 2 - cy, s: (Math.hypot(W, H) / w) * 1.06, oy: w / 2 }
      box.style.setProperty('--oy', `${w / 2}px`)
      escala.set(1 + (geo.current.s - 1) * pe.get())
      x.set(geo.current.dx * pe.get())
      y.set(geo.current.dy * pe.get())
    }
    medir()
    const ro = new ResizeObserver(medir)
    if (palcoRef.current) ro.observe(palcoRef.current)
    return () => ro.disconnect()
  }, [reduz, escala, pe, x, y])

  return (
    <section
      id="inicio"
      ref={secaoRef}
      aria-labelledby="titulo-hero"
      className={reduz ? 'relative' : 'relative h-[185svh]'}
    >
      <div
        ref={palcoRef}
        className={`${
          reduz ? 'relative min-h-svh' : 'sticky top-0 h-svh'
        } flex flex-col overflow-hidden lg:grid lg:grid-cols-12 lg:items-center`}
      >
        {/* Texto */}
        <motion.div
          style={reduz ? undefined : { opacity: opacTexto, y: yTexto }}
          className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pt-[6.75rem] sm:px-8 sm:pt-36 lg:col-span-12 lg:row-start-1 lg:pt-24"
        >
          <div className="lg:w-[56%]">
            <p className="rotulo text-caramelo-queimado">
              {CONFIG.assinatura} ·{' '}
              <span className="whitespace-nowrap">
                {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
              </span>
            </p>
            <h1
              id="titulo-hero"
              className="mt-5 text-[clamp(2.65rem,9.4vw,6.6rem)] leading-[0.94] tracking-[-0.025em]"
            >
              {linhasTitulo.map((l, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={reduz ? false : { y: '108%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.05, ease: EASE, delay: 0.15 + i * 0.12 }}
                  >
                    {l.texto}
                    {l.enfase && <em className="not-italic text-caramelo-queimado">{l.enfase}</em>}
                  </motion.span>
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-[30rem] text-[1.05rem] leading-relaxed text-cafe-suave sm:text-lg">
              Avaliação individual e protocolos personalizados, em um ambiente pensado para você.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              {temWhatsapp && (
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                  <IconeWhatsapp />
                  Agendar avaliação
                </a>
              )}
              <a
                href="#tratamentos"
                className="inline-flex min-h-12 items-center text-[0.975rem] font-medium link-sublinhado hover:text-caramelo-queimado"
              >
                Conhecer os tratamentos
              </a>
            </div>
          </div>
        </motion.div>

        {/* Porta: arcos + caramelo + monograma */}
        <div className="relative min-h-[34svh] flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[44%] lg:min-h-0">
          <div
            ref={portaBoxRef}
            className="absolute left-[30vw] top-4 aspect-[240/370] w-[78vw] sm:left-[42vw] sm:w-[52vw] lg:left-auto lg:right-[12%] lg:top-auto lg:bottom-0 lg:w-auto lg:h-[min(80svh,46rem)]"
          >
            <Porta reduz={reduz} x={x} y={y} escala={escala} />
            <motion.svg
              viewBox="0 0 300 400"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-[-12.5%] top-[-8.1%] h-[108.1%] w-[125%] overflow-visible"
              style={reduz ? undefined : { opacity: opacDetalhe }}
              aria-hidden="true"
            >
              {ARCOS_EXTERNOS.map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  fill="none"
                  stroke="#22160E"
                  strokeOpacity={i === 0 ? 0.28 : 0.45}
                  strokeWidth={0.7}
                  initial={reduz ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: EASE, delay: 0.1 + i * 0.22 }}
                />
              ))}
              {ARCOS_INTERNOS.map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  fill="none"
                  stroke="#F6F0E6"
                  strokeOpacity={0.85}
                  strokeWidth={0.7}
                  initial={reduz ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, ease: EASE, delay: 1.05 + i * 0.22 }}
                />
              ))}
              <motion.g
                fill="#F6F0E6"
                initial={reduz ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 1.6 }}
              >
                {/* celular: no alto da porta, visível na primeira dobra · desktop: no centro do arco menor */}
                <g transform="translate(77.2 92.9) scale(0.16)" className="lg:hidden">
                  {MONOGRAMA_PATHS.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
                <g transform="translate(40.3 196) scale(0.241)" className="hidden lg:block">
                  {MONOGRAMA_PATHS.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
              </motion.g>
            </motion.svg>
          </div>
        </div>
      </div>
    </section>
  )
}

function Porta({
  reduz,
  x,
  y,
  escala,
}: {
  reduz: boolean
  x: MotionValue<number>
  y: MotionValue<number>
  escala: MotionValue<number>
}) {
  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={reduz ? undefined : { x, y, scale: escala, transformOrigin: '50% var(--oy, 50%)' }}
    >
      <motion.div
        className="moldura-arco absolute inset-0 bg-caramelo"
        initial={reduz ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.25, ease: EASE, delay: 0.45 }}
      />
    </motion.div>
  )
}
