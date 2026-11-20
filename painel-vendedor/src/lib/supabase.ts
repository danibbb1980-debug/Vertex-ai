import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigurado = Boolean(url && anon)

/**
 * Cliente com a chave anon (pública). A segurança vem do RLS no banco;
 * nenhuma chave service_role existe neste app.
 */
export const supabase: SupabaseClient = createClient(
  url ?? 'http://localhost:54321',
  anon ?? 'chave-ausente',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } },
)

/** Mensagem de erro em pt-BR para exibir na interface. */
export function mensagemErro(e: unknown): string {
  const msg = (e as { message?: string })?.message ?? String(e)
  if (/Invalid login credentials/i.test(msg)) return 'E-mail ou senha incorretos.'
  if (/Email not confirmed/i.test(msg)) return 'Este e-mail ainda não foi confirmado no Supabase.'
  if (/row-level security|permission denied/i.test(msg)) return 'Sem permissão para esta ação.'
  if (/Failed to fetch|NetworkError/i.test(msg)) return 'Sem conexão. Verifique a internet e tente de novo.'
  return msg
}
