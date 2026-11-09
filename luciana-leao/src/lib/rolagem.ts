import { useEffect, useRef, type RefObject } from 'react'

/** true quando o usuário pediu movimento reduzido (só no navegador). */
export function movimentoReduzido(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Progresso (0 a 1) de um elemento ao rolar, sem dependências e sem re-render:
 * `aoMudar` recebe o valor suavizado e escreve direto no DOM.
 * Início: quando o ponto `alvo[0]` do elemento (0 = topo, 1 = base) cruza a linha `tela[0]` da viewport.
 * Fim: quando `alvo[1]` cruza `tela[1]`. Pausa fora da tela; com movimento reduzido entrega 1.
 */
export function useProgressoRolagem(
  ref: RefObject<HTMLElement | null>,
  aoMudar: (p: number) => void,
  { alvo = [0, 1], tela = [1, 0], suavizar = 0.14 }: { alvo?: [number, number]; tela?: [number, number]; suavizar?: number } = {},
) {
  const cb = useRef(aoMudar)
  cb.current = aoMudar
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (movimentoReduzido()) {
      cb.current(1)
      return
    }
    let atual = -1
    let destino = 0
    let quadro = 0
    let visivel = true
    const medir = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const topo0 = tela[0] * vh - alvo[0] * r.height
      const topo1 = tela[1] * vh - alvo[1] * r.height
      destino = Math.min(1, Math.max(0, (topo0 - r.top) / (topo0 - topo1 || 1)))
    }
    const passo = () => {
      quadro = 0
      if (atual < 0) atual = destino
      else atual += (destino - atual) * suavizar
      if (Math.abs(destino - atual) < 0.0008) atual = destino
      cb.current(atual)
      if (atual !== destino) quadro = requestAnimationFrame(passo)
    }
    const aoRolar = () => {
      if (!visivel) return
      medir()
      if (!quadro) quadro = requestAnimationFrame(passo)
    }
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      if (visivel) aoRolar()
    }, { rootMargin: '20% 0px' })
    io.observe(el)
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    aoRolar()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      cancelAnimationFrame(quadro)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])
}

/** Escreve o "comprimento desenhado" (0 a 1) num path com pathLength=1. */
export function desenharTraco(path: SVGPathElement | null, p: number) {
  if (path) path.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, p)))
}

/** Mapeia p de [a, b] para [0, 1]. */
export const faixa = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)))
