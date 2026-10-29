import { useEffect, useRef, useState } from 'react'

/** true quando o elemento entra na tela (uma vez só). */
export function useInView<T extends Element>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, margin])
  return [ref, inView] as const
}

/**
 * Progresso de rolagem (0 a 1) de um elemento, escrito na variável CSS --p.
 * Sem re-render do React; só calcula enquanto o elemento está perto da tela.
 * start/end: posição do topo e do fim do elemento em fração da altura da janela.
 */
export function useScrollProgress<T extends HTMLElement>(start = 0.8, end = 0.6) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const calc = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const a = r.top - vh * start
      const b = r.bottom - vh * end
      const p = Math.min(1, Math.max(0, -a / (b - a)))
      el.style.setProperty('--p', p.toFixed(4))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.addEventListener('scroll', on, { passive: true })
        window.addEventListener('resize', on)
        on()
      } else {
        window.removeEventListener('scroll', on)
        window.removeEventListener('resize', on)
        calc()
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [start, end])
  return ref
}
