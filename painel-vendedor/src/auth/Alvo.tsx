import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthProvider'
import { useProfiles } from '../lib/api'
import type { Profile } from '../lib/types'

/**
 * De quem é o painel que está na tela.
 * - Vendedor: sempre ele mesmo, pode editar as próprias linhas.
 * - Admin: escolhe um vendedor; vê a mesma tela, somente leitura,
 *   até tocar em "Editar" (que também libera os campos exclusivos do admin).
 */
interface AlvoCtx {
  vendedorId: string | null
  vendedor: Profile | null
  setVendedorId: (id: string) => void
  vendedores: Profile[]
  /** pode registrar ligações, editar leads etc. */
  podeEditar: boolean
  /** pode alterar rascunho, valor fechado, data de pagamento */
  podeEditarAdmin: boolean
  modoEdicao: boolean
  setModoEdicao: (v: boolean) => void
}

const Ctx = createContext<AlvoCtx | null>(null)
const CHAVE = 'lumivo.vendedor-alvo'

export function AlvoProvider({ children }: { children: ReactNode }) {
  const { perfil, isAdmin } = useAuth()
  const { data: perfis = [] } = useProfiles(isAdmin)
  const vendedores = useMemo(
    () => perfis.filter((p) => p.papel === 'vendedor').sort((a, b) => Number(b.ativo) - Number(a.ativo) || a.nome.localeCompare(b.nome, 'pt-BR')),
    [perfis],
  )
  const [escolhido, setEscolhido] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CHAVE)
    } catch {
      return null
    }
  })
  const [modoEdicao, setModoEdicao] = useState(false)

  useEffect(() => {
    if (!isAdmin || vendedores.length === 0) return
    if (!escolhido || !vendedores.some((v) => v.user_id === escolhido)) setEscolhido(vendedores[0].user_id)
  }, [isAdmin, vendedores, escolhido])

  const valor = useMemo<AlvoCtx>(() => {
    if (!isAdmin) {
      return {
        vendedorId: perfil?.user_id ?? null,
        vendedor: perfil,
        setVendedorId: () => {},
        vendedores: [],
        podeEditar: true,
        podeEditarAdmin: false,
        modoEdicao: false,
        setModoEdicao: () => {},
      }
    }
    return {
      vendedorId: escolhido,
      vendedor: vendedores.find((v) => v.user_id === escolhido) ?? null,
      setVendedorId: (id) => {
        setEscolhido(id)
        setModoEdicao(false)
        try {
          localStorage.setItem(CHAVE, id)
        } catch {
          /* sem armazenamento: tudo bem */
        }
      },
      vendedores,
      podeEditar: modoEdicao,
      podeEditarAdmin: modoEdicao,
      modoEdicao,
      setModoEdicao,
    }
  }, [isAdmin, perfil, escolhido, vendedores, modoEdicao])

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useAlvo(): AlvoCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAlvo fora do AlvoProvider')
  return c
}
