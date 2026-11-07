import { useEffect, useRef, useState, type RefObject } from 'react'

export const prefereMenosMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Marca o elemento como visível na primeira vez que entra na tela. */
export function useAoAparecer<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefereMenosMovimento() || !('IntersectionObserver' in window)) return setVisivel(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visivel] as const
}

/**
 * Chama `aoRolar` (no máximo 1x por quadro) enquanto o elemento está perto da tela.
 * Fora da viewport o cálculo para.
 */
export function useAoRolar(alvo: RefObject<HTMLElement | null>, aoRolar: () => void) {
  const cb = useRef(aoRolar)
  cb.current = aoRolar
  useEffect(() => {
    const el = alvo.current
    if (!el) return
    let ativo = false
    let pedido = 0
    const tick = () => {
      pedido = 0
      cb.current()
    }
    const onScroll = () => {
      if (ativo && !pedido) pedido = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        ativo = e.isIntersecting
        if (ativo) onScroll()
      },
      { rootMargin: '25% 0px 25% 0px' },
    )
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    cb.current()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (pedido) cancelAnimationFrame(pedido)
    }
  }, [alvo])
}
