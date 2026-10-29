type LenisLike = { scrollTo: (t: Element | number, o?: { offset?: number; duration?: number }) => void }
let lenis: LenisLike | null = null
export const setLenis = (l: LenisLike | null) => {
  lenis = l
}

/** Rolagem para uma âncora, respeitando o header fixo e o foco (acessibilidade). */
export function scrollToHash(hash: string) {
  const el = document.querySelector(hash)
  if (!el) return
  const offset = -96
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 })
  else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
  }
  history.replaceState(null, '', hash)
  const target = (el.querySelector('h1,h2') as HTMLElement | null) ?? (el as HTMLElement)
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
}
