import { useEffect } from 'react'

/** Liga a classe .visivel nos elementos .revela quando entram na tela (uma vez). */
export function useRevela() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.revela'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('visivel'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('visivel')
            io.unobserve(en.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}
