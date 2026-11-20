import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

interface AuthCtx {
  carregando: boolean
  session: Session | null
  /** null = sem perfil ou conta desativada (o RLS não devolve a linha) */
  perfil: Profile | null
  isAdmin: boolean
  sair: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [perfil, setPerfil] = useState<Profile | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setCarregando(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s)
      if (!s) {
        setPerfil(null)
        setCarregando(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const uid = session?.user.id
  useEffect(() => {
    if (!uid) return
    let ativo = true
    setCarregando(true)
    // O papel vem SEMPRE do banco. Conta desativada → RLS não devolve nada.
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle()
      .then(({ data }) => {
        if (!ativo) return
        setPerfil((data as Profile | null) ?? null)
        setCarregando(false)
      })
    return () => {
      ativo = false
    }
  }, [uid])

  const valor = useMemo<AuthCtx>(
    () => ({
      carregando,
      session,
      perfil,
      isAdmin: perfil?.papel === 'admin' && perfil.ativo,
      sair: async () => {
        await supabase.auth.signOut()
      },
    }),
    [carregando, session, perfil],
  )
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth fora do AuthProvider')
  return c
}
