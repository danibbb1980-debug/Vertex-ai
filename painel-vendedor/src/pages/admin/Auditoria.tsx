import { useMemo } from 'react'
import { useAuditoria, useProfiles, useTodasVendas, useTodosLeads } from '../../lib/api'
import { fmtData, fmtDataHora } from '../../lib/datas'
import { fmtMoeda } from '../../lib/formato'
import { STATUS_REPASSE, STATUS_VENDA } from '../../lib/rotulos'
import type { Auditoria as Linha, StatusRepasse, StatusVenda } from '../../lib/types'
import { Carregando, Erro, Secao, Vazio } from '../../components/ui'

const CAMPOS: Record<string, string> = {
  status: 'Pagamento do cliente',
  valor_fechado: 'Valor fechado',
  valor_liquido_recebido: 'Valor líquido',
  data_pagamento: 'Data do pagamento',
  deleted_at: 'Exclusão',
  percentual_aplicado: 'Percentual da comissão',
  base_calculo: 'Base da comissão',
  cancelada: 'Comissão cancelada',
  status_repasse: 'Repasse',
  data_repasse: 'Data do repasse',
  percentual_comissao: 'Percentual padrão (configuração)',
}

function valor(campo: string, v: string | null): string {
  if (v === null || v === '') return '—'
  if (campo === 'status') return STATUS_VENDA[v as StatusVenda] ?? v
  if (campo === 'status_repasse') return STATUS_REPASSE[v as StatusRepasse] ?? v
  if (campo === 'cancelada') return v === 'true' ? 'Sim' : 'Não'
  if (campo.startsWith('valor') || campo === 'base_calculo') return fmtMoeda(Number(v))
  if (campo.startsWith('percentual')) return `${Number(v).toLocaleString('pt-BR')}%`
  if (campo.startsWith('data')) return fmtData(v)
  if (campo === 'deleted_at') return fmtDataHora(v)
  return v
}

/** Admin: quem mudou o quê e quando nos pagamentos e comissões. */
export default function Auditoria() {
  const auditoria = useAuditoria(true)
  const vendas = useTodasVendas(true)
  const leads = useTodosLeads(true)
  const { data: perfis = [] } = useProfiles()
  const nome = useMemo(() => new Map(perfis.map((p) => [p.user_id, p.nome])), [perfis])
  const leadDaVenda = useMemo(() => {
    const nl = new Map((leads.data ?? []).map((l) => [l.id, l.nome]))
    return new Map((vendas.data ?? []).map((v) => [v.id, nl.get(v.lead_id) ?? 'Lead']))
  }, [vendas.data, leads.data])

  if (auditoria.isLoading) return <Carregando />
  const linhas: Linha[] = auditoria.data ?? []
  return (
    <Secao titulo="Auditoria de pagamentos" contagem={linhas.length} id="s-aud">
      {auditoria.error && <Erro erro={auditoria.error} />}
      <p className="pt-2 text-[0.9375rem] text-tinta-2">As 200 mudanças mais recentes. Só o admin vê esta lista.</p>
      {linhas.length === 0 ? (
        <Vazio>Nenhuma mudança registrada ainda.</Vazio>
      ) : (
        <ol>
          {linhas.map((l) => (
            <li key={l.id} className="border-b border-fio py-2.5 text-[0.9375rem]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span>
                  <strong className="font-semibold">{CAMPOS[l.campo] ?? l.campo}</strong>
                  {l.venda_id && <span className="text-tinta-2">, venda de {leadDaVenda.get(l.venda_id) ?? 'lead'}</span>}
                </span>
                <span className="num text-micro text-tinta-2">{fmtDataHora(l.criado_em)}</span>
              </div>
              <p className="num">
                <span className="text-tinta-2">{valor(l.campo, l.valor_anterior)}</span>
                <span aria-hidden="true"> → </span>
                <span className="sr-only"> para </span>
                <span className="font-medium">{valor(l.campo, l.valor_novo)}</span>
                <span className="text-tinta-2"> por {l.autor_id ? (nome.get(l.autor_id) ?? 'usuário') : 'sistema'}</span>
              </p>
            </li>
          ))}
        </ol>
      )}
    </Secao>
  )
}
