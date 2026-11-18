import { useEffect, useRef, useState } from 'react'

/** true quando o elemento entra na viewport (uma vez). */
export function useAceso<T extends Element>(rootMargin = '0px 0px -20% 0px') {
  const ref = useRef<T | null>(null)
  const [aceso, setAceso] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAceso(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, aceso] as const
}

export function useScrolled(limite = 8) {
  const [s, setS] = useState(false)
  useEffect(() => {
    const on = () => setS(window.scrollY > limite)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [limite])
  return s
}
