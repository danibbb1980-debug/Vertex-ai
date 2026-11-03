import { useEffect, useState } from 'react'
import { m, useScroll, useSpring, useReducedMotion } from 'motion/react'

/**
 * Assinatura do site: a barra dourada do "D".
 * Desktop: fixa à esquerda, preenche com a rolagem e mostra a seção atual.
 * Celular: vira um filete fino no topo, sem cobrir conteúdo.
 */
export function EixoDourado() {
  const { scrollYProgress } = useScroll()
  const reduzir = useReducedMotion()
  const suave = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const progresso = reduzir ? scrollYProgress : suave
  const [secao, setSecao] = useState('')

  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>('[data-secao]'))
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setSecao(e.target.getAttribute('data-secao') ?? '')
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    alvos.forEach((a) => io.observe(a))
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* Desktop */}
      <div aria-hidden className="pointer-events-none fixed bottom-10 left-8 top-36 z-40 hidden w-[5px] xl:block">
        <div className="absolute inset-0 bg-ouro/20" />
        <m.div className="absolute inset-0 origin-top bg-ouro" style={{ scaleY: progresso }} />
        <div className="absolute left-4 top-0 [writing-mode:vertical-rl]">
          <span key={secao} className="rotulo block whitespace-nowrap text-[0.62rem] text-ouro-escuro/90 transition-opacity duration-500">
            {secao}
          </span>
        </div>
      </div>
      {/* Celular e tablet */}
      <m.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-ouro xl:hidden"
        style={{ scaleX: progresso }}
      />
    </>
  )
}
