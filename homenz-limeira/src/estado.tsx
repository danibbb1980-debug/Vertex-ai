import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Area } from './config'

interface Selecao {
  sel: Set<Area>
  alternar: (area: Area, marcar: boolean) => void
  tocou: boolean
}

const Ctx = createContext<Selecao | null>(null)

/** Estado em memória, compartilhado entre as fichas e o formulário. Nada é salvo. */
export function SelecaoProvider({ children }: { children: ReactNode }) {
  const [sel, setSel] = useState<Set<Area>>(() => new Set())
  const [tocou, setTocou] = useState(false)
  const alternar = useCallback((area: Area, marcar: boolean) => {
    setTocou(true)
    setSel((s) => {
      const n = new Set(s)
      if (marcar) n.add(area)
      else n.delete(area)
      return n
    })
  }, [])
  const v = useMemo(() => ({ sel, alternar, tocou }), [sel, alternar, tocou])
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>
}

export function useSelecao() {
  const c = useContext(Ctx)
  if (!c) throw new Error('SelecaoProvider ausente')
  return c
}
