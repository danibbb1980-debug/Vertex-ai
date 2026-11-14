import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'motion/react'
import { CONFIG, filled } from '../config'
import { agendarUrl } from '../lib/links'
import { useReduzirMovimento } from '../lib/hooks'
import { Botao, Seta } from './Botao'
import { CorteTexto } from './CorteTexto'
import { Monograma, ANEL_R } from './Monograma'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Hero + momento de assinatura "o traço se fecha":
 * 1) ao carregar, o círculo e as duas peças do B se desenham em traço único;
 * 2) ao rolar, o interior do círculo escurece (o logo original, champanhe sobre preto);
 * 3) o círculo cresce como uma íris até cobrir a tela e vira o fundo da seção seguinte.
 * Com prefers-reduced-motion: monograma já desenhado e sem crescimento.
 */
export function Abertura() {
  const reduzir = useReduzirMovimento()
  const wrap = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)

  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const r0 = useMotionValue(200)
  const rMax = useMotionValue(1600)

  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ['start start', 'end end'] })

  const raio = useTransform(() => {
    const v = p.get()
    const a = r0.get()
    if (v <= 0) return 0
    if (v < 0.16) return a * (v / 0.16)
    const t = Math.min(1, (v - 0.16) / 0.44)
    const e = t * t * (3 - 2 * t)
    return a + (rMax.get() - a) * e
  })
  const anelR = useTransform(() => Math.max(raio.get(), r0.get()))
  const clip = useMotionTemplate`circle(${raio}px at ${cx}px ${cy}px)`
  const anelOp = useTransform(p, [0, 0.015], [0, 1])
  const anelLogoOp = useTransform(p, [0, 0.015], [1, 0])
  const bOp = useTransform(p, [0.26, 0.5], [1, 0])
  const fraseOp = useTransform(p, [0.56, 0.7], [0, 1])
  const fraseY = useTransform(p, [0.56, 0.7], [24, 0])
  const anelFimOp = useTransform(p, [0.48, 0.6], [1, 0])
  const anelTraco = useTransform(r0, (r) => (r / ANEL_R) * 6)

  const [ativo, setAtivo] = useState(false)
  useMotionValueEvent(p, 'change', (v) => setAtivo(v > 0.001))

  useIsoLayoutEffect(() => {
    const medir = () => {
      const s = svg.current?.getBoundingClientRect()
      const b = palco.current?.getBoundingClientRect()
      if (!s || !b) return
      const x = s.left - b.left + s.width / 2
      const y = s.top - b.top + s.height / 2
      cx.set(x)
      cy.set(y)
      r0.set((s.width / 400) * ANEL_R)
      const dx = Math.max(x, b.width - x)
      const dy = Math.max(y, b.height - y)
      rMax.set(Math.hypot(dx, dy) + 4)
    }
    medir()
    const ro = new ResizeObserver(medir)
    if (palco.current) ro.observe(palco.current)
    return () => ro.disconnect()
  }, [reduzir])

  const iris = !reduzir
  const mostrarFrase = iris && CONFIG.secoes.clinica && filled(CONFIG.frase)

  return (
    <div
      id="topo"
      ref={wrap}
      className={iris ? 'relative h-[260svh]' : 'relative'}
      data-iris={iris ? 'on' : 'off'}
    >
      <div ref={palco} className={`${iris ? 'sticky top-0 h-svh' : 'relative min-h-svh'} overflow-hidden bg-osso`}>
        {/* hero */}
        <div
          className={`container-b relative z-[2] flex h-full flex-col justify-end pb-[max(2.5rem,7svh)] ${
            CONFIG.rascunho ? 'pt-28' : 'pt-24'
          } md:justify-center md:pb-0 ${!iris ? 'min-h-svh' : ''}`}
        >
          <div className="max-w-[40rem] lg:max-w-[46rem]">
            <p className="rotulo mb-6 flex items-center gap-4 text-champanhe-escuro md:mb-8">
              <span aria-hidden="true" className="h-px w-10 bg-champanhe-escuro" />
              Estética · Pouso Alegre - MG
            </p>
            <h1 className="titulo text-[clamp(2.6rem,9.6vw,6rem)]">
              <CorteTexto
                segmentos={[{ texto: 'Cada rosto pede um plano ' }, { texto: 'preciso.', enfase: true }]}
              />
            </h1>
            <p className="mt-6 max-w-[29rem] text-[1.0625rem] leading-relaxed text-pedra md:mt-8 md:text-lg">
              Avaliação individual e protocolos pensados para cada pessoa, em um ambiente reservado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 md:mt-10">
              <Botao href={agendarUrl()} externo>
                Agendar avaliação
              </Botao>
              <a
                href="#tratamentos"
                className="group inline-flex min-h-12 items-center gap-3 self-start text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-preto"
              >
                <span className="border-b border-preto/40 pb-1 transition-colors group-hover:border-champanhe-escuro">
                  Conhecer os tratamentos
                </span>
                <Seta className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* íris: camada preta recortada pelo círculo */}
        {iris && (
          <motion.div
            aria-hidden="true"
            className="grao pointer-events-none absolute inset-0 z-[3] bg-preto"
            style={{ clipPath: clip, WebkitClipPath: clip, visibility: ativo ? 'visible' : 'hidden' }}
          >
            {mostrarFrase && (
              <motion.p
                style={{ opacity: fraseOp, y: fraseY }}
                className="absolute inset-0 flex items-center justify-center px-6 text-center"
              >
                <span className="enfase text-[clamp(2.2rem,6.5vw,5.5rem)] leading-[1.05] text-osso">
                  “{CONFIG.frase}”
                </span>
              </motion.p>
            )}
          </motion.div>
        )}

        {/* anel que cresce */}
        {iris && (
          <motion.svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[4] h-full w-full"
            style={{ opacity: anelOp }}
          >
            <motion.circle
              cx={cx}
              cy={cy}
              r={anelR}
              fill="none"
              stroke="var(--color-champanhe)"
              style={{ opacity: anelFimOp }}
              strokeWidth={anelTraco}
            />
          </motion.svg>
        )}

        {/* monograma em traço único */}
        <div
          className="pointer-events-none absolute z-[5] top-[31svh] right-[-20vw] w-[84vw] -translate-y-1/2 md:top-1/2 md:right-[-14vw] md:w-[min(56vw,84svh)] lg:right-[-5vw] lg:w-[min(45vw,84svh)]"
        >
          <Monograma
            svgRef={svg}
            desenhar
            className="h-auto w-full"
            anelOpacity={iris ? anelLogoOp : undefined}
            bOpacity={iris ? bOp : undefined}
            anel={6}
            traco={12}
          />
        </div>

      </div>
    </div>
  )
}
