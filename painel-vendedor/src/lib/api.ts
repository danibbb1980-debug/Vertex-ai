import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type {
  Comissao, Configuracoes, Lead, Ligacao, Profile, Reuniao, Venda,
} from './types'

async function lista<T>(promessa: PromiseLike<{ data: unknown; error: unknown }>): Promise<T[]> {
  const { data, error } = await promessa
  if (error) throw error
  return (data ?? []) as T[]
}

const num = <T extends object>(rows: T[], campos: (keyof T)[]): T[] =>
  rows.map((r) => {
    const c = { ...r }
    for (const k of campos) if (c[k] !== null && c[k] !== undefined) (c as Record<keyof T, unknown>)[k] = Number(c[k])
    return c
  })

// ---------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------
export function useProfiles(habilitado = true) {
  return useQuery({
    queryKey: ['profiles'],
    enabled: habilitado,
    queryFn: () => lista<Profile>(supabase.from('profiles').select('*').order('nome')),
  })
}

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const { data, error } = await supabase.from('configuracoes').select('*').eq('id', 1).maybeSingle()
      if (error) throw error
      const c = (data ?? { id: 1, percentual_comissao: 25, meta_ligacoes_dia: null, preco_padrao: 797, preco_piso: 597 }) as Configuracoes
      return {
        ...c,
        percentual_comissao: Number(c.percentual_comissao),
        preco_padrao: Number(c.preco_padrao),
        preco_piso: Number(c.preco_piso),
      }
    },
  })
}

export function useLeads(vendedorId: string | null) {
  return useQuery({
    queryKey: ['leads', vendedorId],
    enabled: !!vendedorId,
    queryFn: () =>
      lista<Lead>(
        supabase.from('leads').select('*').eq('vendedor_id', vendedorId!).is('deleted_at', null).order('nome'),
      ),
  })
}

export function useLigacoes(vendedorId: string | null) {
  return useQuery({
    queryKey: ['ligacoes', vendedorId],
    enabled: !!vendedorId,
    queryFn: () =>
      lista<Ligacao>(
        supabase.from('ligacoes').select('*').eq('vendedor_id', vendedorId!).is('deleted_at', null).order('data_hora', { ascending: false }),
      ),
  })
}

export function useReunioes(vendedorId: string | null) {
  return useQuery({
    queryKey: ['reunioes', vendedorId],
    enabled: !!vendedorId,
    queryFn: () =>
      lista<Reuniao>(
        supabase.from('reunioes_pacote').select('*').eq('vendedor_id', vendedorId!).is('deleted_at', null).order('data_hora', { ascending: true, nullsFirst: false }),
      ),
  })
}

export function useVendas(vendedorId: string | null) {
  return useQuery({
    queryKey: ['vendas', vendedorId],
    enabled: !!vendedorId,
    queryFn: async () =>
      num(
        await lista<Venda>(
          supabase.from('vendas').select('*').eq('vendedor_id', vendedorId!).is('deleted_at', null).order('created_at', { ascending: false }),
        ),
        ['valor_combinado', 'valor_fechado'],
      ),
  })
}

export function useComissoes(vendedorId: string | null) {
  return useQuery({
    queryKey: ['comissoes', vendedorId],
    enabled: !!vendedorId,
    queryFn: async () =>
      num(
        await lista<Comissao>(
          supabase.from('comissoes').select('*').eq('vendedor_id', vendedorId!).order('created_at', { ascending: false }),
        ),
        ['percentual', 'base_calculo', 'valor'],
      ),
  })
}

/** Admin: dados de todos os vendedores (fila de rascunhos e pagamentos). */
export function useTodasReunioes(habilitado: boolean) {
  return useQuery({
    queryKey: ['reunioes', 'todas'],
    enabled: habilitado,
    queryFn: () =>
      lista<Reuniao>(supabase.from('reunioes_pacote').select('*').is('deleted_at', null).order('data_hora', { ascending: true, nullsFirst: false })),
  })
}
export function useTodosLeads(habilitado: boolean) {
  return useQuery({
    queryKey: ['leads', 'todos'],
    enabled: habilitado,
    queryFn: () => lista<Lead>(supabase.from('leads').select('*').is('deleted_at', null)),
  })
}
export function useTodasVendas(habilitado: boolean) {
  return useQuery({
    queryKey: ['vendas', 'todas'],
    enabled: habilitado,
    queryFn: async () =>
      num(
        await lista<Venda>(supabase.from('vendas').select('*').is('deleted_at', null).order('created_at', { ascending: false })),
        ['valor_combinado', 'valor_fechado'],
      ),
  })
}
export function useTodasComissoes(habilitado: boolean) {
  return useQuery({
    queryKey: ['comissoes', 'todas'],
    enabled: habilitado,
    queryFn: async () =>
      num(await lista<Comissao>(supabase.from('comissoes').select('*').order('created_at', { ascending: false })), ['percentual', 'base_calculo', 'valor']),
  })
}

// ---------------------------------------------------------------------
// Escrita
// ---------------------------------------------------------------------
function useInvalidar() {
  const qc = useQueryClient()
  return (...chaves: string[]) => Promise.all(chaves.map((k) => qc.invalidateQueries({ queryKey: [k] })))
}

async function exec<T>(p: PromiseLike<{ data: unknown; error: unknown }>): Promise<T> {
  const { data, error } = await p
  if (error) throw error
  return data as T
}

export type NovoLead = Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>> & Pick<Lead, 'nome' | 'segmento'>

export function useSalvarLead() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: async ({ id, dados }: { id?: string; dados: NovoLead }) => {
      if (id) return exec<Lead>(supabase.from('leads').update(dados).eq('id', id).select().single())
      return exec<Lead>(supabase.from('leads').insert(dados).select().single())
    },
    onSuccess: () => inv('leads', 'reunioes'),
  })
}

export function useRegistrarLigacao() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: async (p: {
      lead_id: string
      resultado: Ligacao['resultado']
      observacao: string | null
      retornar_em: string | null
    }) => {
      const lig = await exec<Ligacao>(
        supabase.from('ligacoes').insert({ lead_id: p.lead_id, resultado: p.resultado, observacao: p.observacao }).select().single(),
      )
      await exec(supabase.from('leads').update({ retornar_em: p.retornar_em }).eq('id', p.lead_id))
      return lig
    },
    onSuccess: () => inv('ligacoes', 'leads'),
  })
}

export function useSalvarReuniao() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: async ({ id, dados }: { id?: string; dados: Partial<Reuniao> }) => {
      // pacote_completo é calculado pela view: nunca é enviado
      const { pacote_completo: _ignorado, ...limpo } = dados
      void _ignorado
      if (id) return exec<Reuniao>(supabase.from('reunioes').update(limpo).eq('id', id).select().single())
      return exec<Reuniao>(supabase.from('reunioes').insert(limpo).select().single())
    },
    onSuccess: () => inv('reunioes'),
  })
}

export function useSalvarVenda() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: async ({ id, dados }: { id?: string; dados: Partial<Venda> }) => {
      if (id) return exec<Venda>(supabase.from('vendas').update(dados).eq('id', id).select().single())
      return exec<Venda>(supabase.from('vendas').insert(dados).select().single())
    },
    onSuccess: () => inv('vendas', 'comissoes'),
  })
}

export function useRegistrarPagamento() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: (p: { venda_id: string; valor_fechado: number; base_liquida: number; data_pagamento: string; percentual: number }) =>
      exec<Comissao>(
        supabase.rpc('registrar_pagamento', {
          p_venda_id: p.venda_id,
          p_valor_fechado: p.valor_fechado,
          p_base_liquida: p.base_liquida,
          p_data_pagamento: p.data_pagamento,
          p_percentual: p.percentual,
        }),
      ),
    onSuccess: () => inv('vendas', 'comissoes'),
  })
}

export function useSalvarComissao() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<Comissao> }) =>
      exec(supabase.from('comissoes').update(dados).eq('id', id)),
    onSuccess: () => inv('comissoes'),
  })
}

export function useSalvarPerfil() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<Profile> }) =>
      exec(supabase.from('profiles').update(dados).eq('user_id', id)),
    onSuccess: () => inv('profiles'),
  })
}

export function useSalvarConfig() {
  const inv = useInvalidar()
  return useMutation({
    mutationFn: (dados: Partial<Configuracoes>) => exec(supabase.from('configuracoes').update(dados).eq('id', 1)),
    onSuccess: () => inv('config'),
  })
}
