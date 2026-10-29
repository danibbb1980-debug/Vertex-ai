import { createContext, useContext, useState, type ReactNode } from 'react'
import { CONFIG, type Unidade } from '../config'

interface Ctx {
  unidade: Unidade
  setUnidadeId: (id: string) => void
  multiplas: boolean
}

const UnidadeCtx = createContext<Ctx | null>(null)

export function UnidadeProvider({ children }: { children: ReactNode }) {
  const [id, setUnidadeId] = useState(CONFIG.unidades[0].id)
  const unidade = CONFIG.unidades.find((u) => u.id === id) ?? CONFIG.unidades[0]
  return (
    <UnidadeCtx.Provider value={{ unidade, setUnidadeId, multiplas: CONFIG.unidades.length > 1 }}>
      {children}
    </UnidadeCtx.Provider>
  )
}

export function useUnidade() {
  const c = useContext(UnidadeCtx)
  if (!c) throw new Error('useUnidade fora do provider')
  return c
}
