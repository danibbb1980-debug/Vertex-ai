import type { ReactNode } from 'react'
import { CONFIG } from '../config'

/**
 * Marca um dado que ainda precisa ser confirmado com a clínica.
 * Com CONFIG.marcarPendencias = false, mostra só o conteúdo.
 */
export function Confirmar({ children, tag = true }: { children: ReactNode; tag?: boolean }) {
  if (!CONFIG.marcarPendencias) return <>{children}</>
  return (
    <span className="confirmar" title="Informação a confirmar com a clínica">
      {children}
      {tag && <span className="confirmar-tag">a confirmar</span>}
    </span>
  )
}
