import { useEffect, useState } from 'react'

/** prefers-reduced-motion, seguro para pré-renderização (false no servidor). */
export function useReduzirMovimento(): boolean {
  const [reduzir, setReduzir] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduzir(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduzir
}

export function useMontado(): boolean {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}

/** Leitura síncrona (cliente) para ajustar transições sem afetar o HTML. */
export const prefereReduzir = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
