import { type RefObject, useEffect } from 'react'

const limitar = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Progresso de rolagem (0 a 1) de um elemento, com suavização leve.
 * Só calcula enquanto o elemento está na tela; com movimento reduzido, entrega 1 direto.
 * `aplicar` deve mexer apenas em transform/opacity via ref (sem re-render).
 */
export function useProgressoRolagem(
  ref: RefObject<HTMLElement | null>,
  calcular: (r: DOMRect, alturaTela: number) => number,
  aplicar: (p: number) => void,
  suavizar = 0.16,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      aplicar(1)
      return
    }
    let alvo = limitar(calcular(el.getBoundingClientRect(), window.innerHeight))
    let atual = alvo
    let quadro = 0
    let ativo = false
    aplicar(atual)

    const passo = () => {
      atual += (alvo - atual) * suavizar
      if (Math.abs(alvo - atual) < 0.001) atual = alvo
      aplicar(atual)
      quadro = atual === alvo ? 0 : requestAnimationFrame(passo)
    }
    const aoRolar = () => {
      if (!ativo) return
      alvo = limitar(calcular(el.getBoundingClientRect(), window.innerHeight))
      if (!quadro) quadro = requestAnimationFrame(passo)
    }
    const io = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting
      if (ativo) aoRolar()
    })
    io.observe(el)
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      cancelAnimationFrame(quadro)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
