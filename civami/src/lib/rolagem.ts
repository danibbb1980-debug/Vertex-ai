import { useEffect, type RefObject } from 'react'

const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Converte o progresso geral (0–1) para o trecho [de, ate], também 0–1. */
export const trecho = (p: number, de: number, ate: number) => limitar((p - de) / (ate - de))

/**
 * Chama `aoMudar(progresso)` enquanto o elemento está na tela, uma vez por quadro.
 * - 'cena': 0 quando o topo encosta no topo da tela, 1 quando o fim encosta no fim (sticky).
 * - 'lista': 0 quando o topo passa 75% da tela, 1 quando o fim passa 55%.
 * Pausado fora da viewport. Com movimento reduzido, entrega 1 e não escuta a rolagem.
 */
export function useProgressoRolagem(
  ref: RefObject<HTMLElement | null>,
  aoMudar: (p: number) => void,
  modo: 'cena' | 'lista' = 'cena',
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      aoMudar(1)
      return
    }
    let raf = 0
    let ativo = false
    const medir = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p =
        modo === 'cena'
          ? -r.top / Math.max(1, r.height - vh)
          : (vh * 0.75 - r.top) / Math.max(1, r.height + vh * 0.2)
      aoMudar(limitar(p))
    }
    const agendar = () => {
      if (ativo && !raf) raf = requestAnimationFrame(medir)
    }
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting
      if (ativo) agendar()
    })
    io.observe(el)
    medir()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, modo])
}

/** Revela elementos [data-revelar] ao entrarem na tela (um único observer para a página). */
export function iniciarRevelacoes() {
  const els = document.querySelectorAll<HTMLElement>('[data-revelar]')
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.setAttribute('data-visivel', ''))
    return
  }
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.setAttribute('data-visivel', '')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  els.forEach((el) => io.observe(el))
}
