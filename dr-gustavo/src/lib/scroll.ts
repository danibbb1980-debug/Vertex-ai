import { useEffect, type RefObject } from 'react'

/**
 * Progresso de rolagem leve (substitui o useScroll da lib motion).
 * Um único listener de scroll/resize, com requestAnimationFrame, e cada
 * elemento só é calculado quando está perto da tela (IntersectionObserver).
 *
 * `start`: fração da altura da tela onde o TOPO do elemento marca 0.
 * `end`:   fração da altura da tela onde a BASE do elemento marca 1.
 */
type Sub = { el: HTMLElement; start: number; end: number; cb: (p: number) => void; active: boolean; last: number }

const subs = new Set<Sub>()
let ticking = false
let bound = false

function measure(s: Sub, vh: number) {
  const r = s.el.getBoundingClientRect()
  const total = r.height + (s.start - s.end) * vh
  const p = total <= 0 ? 1 : (s.start * vh - r.top) / total
  const c = p < 0 ? 0 : p > 1 ? 1 : p
  if (c !== s.last) {
    s.last = c
    s.cb(c)
  }
}

function frame() {
  ticking = false
  const vh = window.innerHeight
  subs.forEach((s) => s.active && measure(s, vh))
}

function request() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(frame)
  }
}

export function reduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  cb: (p: number) => void,
  { start = 1, end = 0, enabled = true }: { start?: number; end?: number; enabled?: boolean } = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || reduceMotion()) {
      cb(1)
      return
    }
    if (!bound) {
      bound = true
      window.addEventListener('scroll', request, { passive: true })
      window.addEventListener('resize', request, { passive: true })
    }
    const sub: Sub = { el, start, end, cb, active: false, last: -1 }
    subs.add(sub)
    const io = new IntersectionObserver(
      ([e]) => {
        sub.active = e.isIntersecting
        if (sub.active) measure(sub, window.innerHeight)
      },
      { rootMargin: '25% 0px 25% 0px' },
    )
    io.observe(el)
    measure(sub, window.innerHeight)
    return () => {
      io.disconnect()
      subs.delete(sub)
    }
    // cb é estável por contrato (definido com useCallback ou ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end, enabled])
}
