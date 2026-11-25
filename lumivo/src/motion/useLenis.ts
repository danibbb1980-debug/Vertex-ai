import { useEffect } from 'react'

type LenisLike = { raf: (t: number) => void; destroy: () => void; scrollTo: (alvo: number | string | HTMLElement, opts?: { duration?: number }) => void }

let instancia: LenisLike | null = null

/** Rolagem suave só em ponteiro fino e sem preferência por movimento reduzido. Carregada sob demanda. */
export function useLenis() {
  useEffect(() => {
    const fino = window.matchMedia('(pointer: fine)').matches
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fino || reduzido) return
    let frame = 0
    let ativo = true
    import('lenis').then(({ default: Lenis }) => {
      if (!ativo) return
      const lenis = new Lenis({ duration: 1.1 }) as unknown as LenisLike
      instancia = lenis
      const loop = (t: number) => {
        lenis.raf(t)
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)
    })
    return () => {
      ativo = false
      cancelAnimationFrame(frame)
      instancia?.destroy()
      instancia = null
    }
  }, [])
}

export function rolarPara(alvo: string | number) {
  if (instancia) {
    instancia.scrollTo(alvo, { duration: 1.4 })
    return
  }
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduzido ? 'auto' : 'smooth'
  if (typeof alvo === 'number') window.scrollTo({ top: alvo, behavior })
  else document.querySelector(alvo)?.scrollIntoView({ behavior })
}

/** Trava/destrava a rolagem do fundo (menu e quiz). */
export function travarRolagem(travar: boolean) {
  const l = instancia as unknown as { stop?: () => void; start?: () => void } | null
  if (travar) {
    l?.stop?.()
    document.documentElement.classList.add('travado')
  } else {
    l?.start?.()
    document.documentElement.classList.remove('travado')
  }
}
