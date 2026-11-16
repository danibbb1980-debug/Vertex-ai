import { useEffect, useMemo, useState, type RefObject } from 'react'
import { LazyMotion, domAnimation, m, useScroll, useSpring, useTransform } from 'motion/react'
import { helice } from '../lib/helice'
import { CORES, type Tom } from './helice'
import { useMenosMovimento } from './ui'

/** Linha do tempo: progresso que acompanha a rolagem. */
export function ProgressoLinha({ alvo, className }: { alvo: RefObject<HTMLElement | null>; className: string }) {
  const reduz = useMenosMovimento()
  const { scrollYProgress } = useScroll({ target: alvo, offset: ['start 60%', 'end 55%'] })
  const progresso = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  return (
    <LazyMotion features={domAnimation} strict>
      <m.span aria-hidden="true" className={className} style={{ scaleY: reduz ? 1 : progresso }} />
    </LazyMotion>
  )
}

/**
 * A mesma hélice, como fio vertical fixo que se desenha conforme a rolagem
 * (indicador de leitura). Troca de cor sobre os blocos verde-petróleo.
 */
export function HeliceRolagem() {
  const reduz = useMenosMovimento()
  const [dim, setDim] = useState({ w: 28, h: 800, mobile: false })
  const [tom, setTom] = useState<Tom>('claro')
  const [ativa, setAtiva] = useState(false)

  useEffect(() => {
    const medir = () => {
      const mobile = window.innerWidth < 768
      setDim({ w: mobile ? 14 : 30, h: window.innerHeight, mobile })
    }
    medir()
    window.addEventListener('resize', medir, { passive: true })
    return () => window.removeEventListener('resize', medir)
  }, [])

  // aparece depois do hero
  useEffect(() => {
    const f = () => setAtiva(window.scrollY > window.innerHeight * 0.55)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  // cor conforme o bloco sob o centro da tela
  useEffect(() => {
    const escuros = Array.from(document.querySelectorAll('[data-tom="escuro"]'))
    if (!escuros.length) return
    const dentro = new Set<Element>()
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? dentro.add(e.target) : dentro.delete(e.target)))
        setTom(dentro.size ? 'escuro' : 'claro')
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    escuros.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const g = useMemo(
    () =>
      helice({
        largura: dim.w,
        altura: dim.h,
        voltas: dim.h / (dim.mobile ? 300 : 380),
        amp: dim.mobile ? 4.5 : 10,
        passos: Math.round(dim.h / 14),
        fase: 0.35,
      }),
    [dim],
  )

  const { scrollYProgress } = useScroll()
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const progresso = useTransform(reduz ? scrollYProgress : suave, [0, 1], [0.02, 1])

  const c = CORES[tom]
  return (
    <LazyMotion features={domAnimation} strict>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 bottom-0 z-30 transition-opacity duration-700"
        style={{
          right: dim.mobile ? 2 : 'max(12px, calc((100vw - 78rem) / 2 - 56px))',
          width: dim.w,
          opacity: ativa ? (dim.mobile ? 0.75 : 1) : 0,
        }}
      >
        <svg width={dim.w} height={dim.h} viewBox={`0 0 ${dim.w} ${dim.h}`} fill="none" strokeLinecap="round">
          {[...g.a, ...g.b].map((d, i) => (
            <path key={`t${i}`} d={d} stroke={c.a} strokeOpacity={0.16} strokeWidth={1} style={{ transition: 'stroke 0.6s' }} />
          ))}
          {g.a.map((d, i) => (
            <m.path key={`a${i}`} d={d} stroke={c.a} strokeWidth={1.5} style={{ pathLength: progresso, transition: 'stroke 0.6s' }} />
          ))}
          {g.b.map((d, i) => (
            <m.path key={`b${i}`} d={d} stroke={c.b} strokeWidth={1.5} style={{ pathLength: progresso, transition: 'stroke 0.6s' }} />
          ))}
        </svg>
      </div>
    </LazyMotion>
  )
}
