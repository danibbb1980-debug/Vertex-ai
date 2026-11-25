import { useEffect, type RefObject } from 'react'

const FOCAVEIS = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Prende o Tab dentro do container e fecha com Esc. */
export function useFocoPreso(ref: RefObject<HTMLElement | null>, ativo: boolean, onEsc: () => void) {
  useEffect(() => {
    if (!ativo) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onEsc()
        return
      }
      if (e.key !== 'Tab' || !ref.current) return
      const itens = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCAVEIS)).filter((el) => el.offsetParent !== null)
      if (!itens.length) return
      const primeiro = itens[0]
      const ultimo = itens[itens.length - 1]
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [ref, ativo, onEsc])
}
