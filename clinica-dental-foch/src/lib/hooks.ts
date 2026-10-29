import { useEffect, useRef, useState, type RefObject } from 'react'

/** Liga a classe .is-in nos elementos .reveal quando entram na tela. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** true enquanto o elemento está (perto de estar) visível. Usado para pausar animações. */
export function useNaTela<T extends Element>(margem = '120px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visivel, setVisivel] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin: margem })
    io.observe(el)
    return () => io.disconnect()
  }, [margem])
  return [ref, visivel]
}

/** Uma vez visível, fica true (para carregar coisas sob demanda, como o mapa). */
export function useApareceu<T extends Element>(margem = '300px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return setOk(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOk(true)
          io.disconnect()
        }
      },
      { rootMargin: margem },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margem])
  return [ref, ok]
}

export function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduzido(mq.matches)
    const fn = () => setReduzido(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduzido
}

/** Atualiza --mx/--my para a luz dos cartões seguir o ponteiro. */
export function moverLuz(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/**
 * Progresso de rolagem (0 a 1) de um elemento, sem biblioteca: escuta o scroll
 * com requestAnimationFrame e só calcula enquanto o elemento está perto da tela.
 * `inicio` e `fim` são frações da altura da janela (ex.: 0.75 = 75% da janela).
 * modo 'saida': 0 quando o topo do elemento está no topo da tela, 1 quando ele sai.
 */
export function useProgressoRolagem<T extends HTMLElement>(
  ao: (p: number) => void,
  opcoes: { modo: 'saida' } | { modo: 'passagem'; inicio: number; fim: number },
): RefObject<T | null> {
  const ref = useRef<T>(null)
  const cb = useRef(ao)
  cb.current = ao
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let ativo = true
    const calc = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      let p: number
      if (opcoes.modo === 'saida') p = -r.top / r.height
      else p = (vh * opcoes.inicio - r.top) / (r.height - vh * opcoes.fim + vh * opcoes.inicio)
      cb.current(Math.min(1, Math.max(0, p)))
    }
    const agenda = () => {
      if (ativo && !raf) raf = requestAnimationFrame(calc)
    }
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting
      if (ativo) agenda()
    })
    io.observe(el)
    window.addEventListener('scroll', agenda, { passive: true })
    window.addEventListener('resize', agenda)
    calc()
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', agenda)
      window.removeEventListener('resize', agenda)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}
