import { useEffect, useState } from 'react'

/** false no servidor e no primeiro render (evita divergência na hidratação). */
export function useReducedMotion() {
  const [reduzido, setReduzido] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const atualizar = () => setReduzido(mq.matches)
    atualizar()
    mq.addEventListener('change', atualizar)
    return () => mq.removeEventListener('change', atualizar)
  }, [])
  return reduzido
}

export function useMediaQuery(query: string) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const atualizar = () => setOk(mq.matches)
    atualizar()
    mq.addEventListener('change', atualizar)
    return () => mq.removeEventListener('change', atualizar)
  }, [query])
  return ok
}
