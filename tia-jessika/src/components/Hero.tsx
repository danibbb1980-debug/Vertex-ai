import { useEffect, useRef, useState } from 'react'
import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { Blob, Brilho, CoracaoTraco, Estrela, Riscos } from './Decor'
import { IconSeta, IconWhats } from './Icons'
import { TextReveal } from './TextReveal'

function useForaDaTela<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [fora, setFora] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFora(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, fora }
}

/** O logotipo se "escreve": revelação progressiva da esquerda para a direita, com um ponto de caneta. */
function LogoAssinatura() {
  const reduced = useReducedMotion()
  const img = (
    <img
      src={CONFIG.logo.completo}
      srcSet={CONFIG.logo.completoSrcSet}
      sizes="(min-width: 1024px) 420px, 280px"
      width={CONFIG.logo.completoW}
      height={CONFIG.logo.completoH}
      alt={`${CONFIG.marca}, ${CONFIG.descritor}`}
      fetchPriority="high"
      decoding="async"
      className="relative block h-auto w-full select-none"
      draggable={false}
    />
  )
  if (reduced) return img
  return (
    <div className="relative">
      <m.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 2.1, ease: [0.55, 0.05, 0.25, 1], delay: 0.25 }}
      >
        {img}
      </m.div>
      {/* ponto de caneta que acompanha a escrita: o trilho tem a largura do logo */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ x: '0%', opacity: 0 }}
        animate={{ x: '100%', opacity: [0, 1, 1, 0] }}
        transition={{
          x: { duration: 2.1, ease: [0.55, 0.05, 0.25, 1], delay: 0.25 },
          opacity: { duration: 2.3, times: [0, 0.06, 0.86, 1], delay: 0.25 },
        }}
      >
        <span className="absolute left-0 top-[56%] -ml-1.5 block size-3 rounded-full bg-framboesa shadow-[0_0_0_6px_rgb(222_104_126/0.2)]" />
      </m.div>
    </div>
  )
}


export function Hero() {
  const { ref: secRef, fora } = useForaDaTela<HTMLElement>()
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: secRef, offset: ['start start', 'end start'] })
  const prog = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const linha = useTransform(prog, [0, 0.9], [0.08, 1])
  const decorY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      id="inicio"
      ref={secRef}
      className={`relative overflow-hidden pb-16 pt-[8.5rem] md:pb-24 lg:pt-[10rem] ${fora ? 'pausado' : ''}`}
      aria-labelledby="titulo-hero"
    >
      {/* linha curva fina que cresce com a rolagem */}
      <svg
        className="pointer-events-none absolute inset-0 -z-0 hidden h-full w-full text-framboesa/45 md:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        fill="none"
      >
        <m.path
          d="M1500 120C1260 140 1150 260 1210 400s-60 250-260 270-360 60-470 150-280 120-560 100"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={reduced ? undefined : { pathLength: linha }}
        />
      </svg>

      <div className="container-site relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Odontopediatria em Alfenas - MG</p>
          <h1 id="titulo-hero" className="mt-5 text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.35rem]">
            <TextReveal startOnView={false} delay={0.15} partes={['Cuidado com', { em: 'carinho' }, 'para cada fase do seu filho.']} />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-tinta-2 md:text-xl">
            Atendimento odontológico para bebês, crianças e adolescentes, com acolhimento e explicações claras para a família.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
              <IconWhats size={20} />
              Agendar avaliação
            </a>
            <a href="#atendimento" className="btn btn-secundario">
              Conhecer o atendimento
              <IconSeta size={18} />
            </a>
          </div>
          <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-tinta/12 bg-white/60 py-2 pl-2.5 pr-4 text-sm font-bold text-tinta-2">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-ceu-100 text-ceu-700">
              <Brilho className="size-4" strokeWidth={2.4} onMount />
            </span>
            {CONFIG.nome} · {CONFIG.cro}
          </p>
        </div>

        <div className="relative order-1 mx-auto mb-10 w-[84%] md:mb-20 max-w-[24rem] lg:order-2 lg:mb-0 lg:w-full lg:max-w-[30rem]">
          <Blob className="absolute -inset-[6%] -z-0 text-ceu-100/80 lg:-inset-[14%]" d={0} />
          <Blob className="absolute -bottom-[20%] -left-[14%] -z-0 w-[42%] text-framboesa-50/90" d={2} />
          <m.div style={reduced ? undefined : { y: decorY }} className="pointer-events-none absolute inset-0" aria-hidden="true">
            <span className="flutua absolute -left-[8%] top-[4%] block text-framboesa" style={{ animationDelay: '-1s' }}>
              <Estrela className="size-9 md:size-11" onMount delay={1.6} />
            </span>
            <span className="flutua absolute -right-[6%] top-[-6%] block text-ceu" style={{ animationDelay: '-3s' }}>
              <Riscos className="size-12 md:size-14" onMount delay={2} />
            </span>
            <span className="flutua absolute -right-[10%] top-[46%] block text-framboesa" style={{ animationDelay: '-2s' }}>
              <CoracaoTraco className="w-12 md:w-14" onMount delay={2.2} />
            </span>
            <span className="flutua absolute -left-[12%] bottom-[8%] block text-ceu" style={{ animationDelay: '-5s' }}>
              <Brilho className="size-8 md:size-10" onMount delay={2.4} />
            </span>
            <span className="flutua absolute bottom-[-10%] right-[18%] block text-ceu/70" style={{ animationDelay: '-4s' }}>
              <Brilho className="size-5" onMount delay={2.6} />
            </span>
          </m.div>
          <div className="relative px-[6%]">
            <LogoAssinatura />
          </div>
        </div>
      </div>
    </section>
  )
}
