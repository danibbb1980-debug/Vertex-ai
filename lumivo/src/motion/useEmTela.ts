import { useEffect, useState, type RefObject } from 'react'

/** Visível na viewport e aba ativa: usado para pausar loops. */
export function useEmTela(ref: RefObject<Element | null>, margem = '0px') {
  const [visivel, setVisivel] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin: margem })
    io.observe(el)
    const vis = () => setAbaAtiva(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', vis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', vis)
    }
  }, [ref, margem])
  return visivel && abaAtiva
}
