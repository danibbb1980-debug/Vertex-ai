import { createContext, useContext, useEffect, useRef, useState } from 'react'

export const ChapterContext = createContext<number | null>(null)
export const useChapter = () => useContext(ChapterContext)

/** Capítulo ativo: a seção [data-chapter] que cruza o meio da tela. */
export function useActiveChapter() {
  const [active, setActive] = useState<number | null>(null)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
    const visible = new Map<Element, number>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.set(e.target, Number((e.target as HTMLElement).dataset.chapter))
          else visible.delete(e.target)
        })
        const vals = Array.from(visible.values())
        setActive(vals.length ? vals[vals.length - 1] : null)
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

/** true quando o elemento entra na tela (uma vez). */
export function useInView<T extends Element>(margin = '0px 0px -20% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
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
  }, [margin])
  return [ref, inView] as const
}

export function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(m.matches)
    const f = () => setR(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return r
}
