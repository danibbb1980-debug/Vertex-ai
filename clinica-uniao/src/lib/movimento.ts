import { useEffect, useRef, type RefObject } from 'react'

/* Movimento leve, sem bibliotecas: só opacity/transform, pausado fora da tela. */

let observador: IntersectionObserver | null = null
function obs() {
  if (!observador && typeof IntersectionObserver !== 'undefined') {
    observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            observador!.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
  }
  return observador
}

/** Marca o elemento para aparecer ao entrar na tela (ver [data-reveal] no CSS). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    const o = obs()
    if (!el) return
    if (!o) {
      el.classList.add('is-in')
      return
    }
    o.observe(el)
    return () => o.unobserve(el)
  }, [])
  return ref
}

/**
 * Progresso de 0 a 1 ligado à rolagem, calculado só enquanto o elemento está visível.
 * `calc` recebe o retângulo do elemento e a altura da janela.
 */
export function useProgressoRolagem(
  ref: RefObject<HTMLElement>,
  calc: (r: DOMRect, vh: number) => number,
  aoMudar: (p: number) => void,
) {
  const calcRef = useRef(calc)
  const cbRef = useRef(aoMudar)
  calcRef.current = calc
  cbRef.current = aoMudar

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let quadro = 0
    let visivel = false
    const medir = () => {
      quadro = 0
      const p = calcRef.current(el.getBoundingClientRect(), window.innerHeight)
      cbRef.current(Math.min(1, Math.max(0, p)))
    }
    const agendar = () => {
      if (visivel && !quadro) quadro = requestAnimationFrame(medir)
    }
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel) agendar()
    })
    io.observe(el)
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar, { passive: true })
    medir()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
      cancelAnimationFrame(quadro)
    }
  }, [ref])
}
