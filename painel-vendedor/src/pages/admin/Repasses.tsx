import { useMemo, useState } from 'react'
import { useProfiles, useSalvarComissao, useTodasComissoes, useTodasVendas, useTodosLeads } from '../../lib/api'
import { fmtData, fmtMes, hojeSP } from '../../lib/datas'
import { fmtMoeda } from '../../lib/formato'
import { gruposDeRepasse } from '../../lib/regras'
import { mensagemErro } from '../../lib/supabase'
import type { Comissao } from '../../lib/types'
import { useAviso } from '../../components/Aviso'
import { Carregando, Erro, Secao, Vazio } from '../../components/ui'
import { useResolverEstorno } from './Pagamentos'

/** Admin: comissões a repassar e repassadas, por vendedor e mês do pagamento do cliente. */
export default function Repasses() {
  const comissoes = useTodasComissoes(true)
  const vendas = useTodasVendas(true)
  const leads = useTodosLeads(true)
  const { data: perfis = [] } = useProfiles()
  const resolver = useResolverEstorno()
  const [vendedor, setVendedor] = useState('')
  const [mes, setMes] = useState('')

  const nomeVend = useMemo(() => new Map(perfis.map((p) => [p.user_id, p.nome])), [perfis])
  const nomeLead = useMemo(() => new Map((leads.data ?? []).map((l) => [l.id, l.deleted_at ? `${l.nome} (lead excluído)` : l.nome])), [leads.data])
  const vendaPorId = useMemo(() => new Map((vendas.data ?? []).map((v) => [v.id, v])), [vendas.data])
  const grupos = useMemo(() => gruposDeRepasse(comissoes.data ?? [], vendas.data ?? []), [comissoes.data, vendas.data])
  const meses = [...new Set(grupos.map((g) => g.mes))]
  const vendedores = [...new Set(grupos.map((g) => g.vendedorId))]
  const filtrados = grupos.filter((g) => (!vendedor || g.vendedorId === vendedor) && (!mes || g.mes === mes))
  const totalARepassar = filtrados.reduce((s, g) => s + g.totalARepassar, 0)
  const totalRepassado = filtrados.reduce((s, g) => s + g.totalRepassado, 0)
  const estornar = (comissoes.data ?? []).filter((c) => c.status_repasse === 'estornar' && (!vendedor || c.vendedor_id === vendedor))
  const leadDaComissao = (c: Comissao) => nomeLead.get(vendaPorId.get(c.venda_id)?.lead_id ?? '') ?? 'Lead'

  if (comissoes.isLoading) return <Carregando />
  return (
    <>
      {comissoes.error && <Erro erro={comissoes.error} />}
      <div className="mt-4 grid max-w-lg grid-cols-2 gap-2">
        <div>
          <label htmlFor="rp-v" className="text-micro font-medium text-tinta-2">Vendedor</label>
          <select id="rp-v" className="campo" value={vendedor} onChange={(e) => setVendedor(e.target.value)}>
            <option value="">Todos</option>
            {vendedores.map((v) => <option key={v} value={v}>{nomeVend.get(v) ?? 'Vendedor'}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rp-m" className="text-micro font-medium text-tinta-2">Mês do pagamento</label>
          <select id="rp-m" className="campo first-letter:uppercase" value={mes} onChange={(e) => setMes(e.target.value)}>
            <option value="">Todos</option>
            {meses.map((m) => <option key={m} value={m}>{fmtMes(m)}</option>)}
          </select>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 border-y border-tinta">
        <div className="border-r border-fio py-3 pr-3">
          <dt className="text-[0.9375rem] text-tinta-2">A repassar no período</dt>
          <dd className="num text-[1.75rem] font-bold leading-tight">{fmtMoeda(totalARepassar)}</dd>
        </div>
        <div className="py-3 pl-3">
          <dt className="text-[0.9375rem] text-tinta-2">Repassado no período</dt>
          <dd className="num text-[1.75rem] font-semibold leading-tight text-tinta-2">{fmtMoeda(totalRepassado)}</dd>
        </div>
      </dl>

      {estornar.length > 0 && (
        <Secao titulo="Estornar" contagem={estornar.length} id="s-estornar">
          <ul>
            {estornar.map((c) => (
              <li key={c.id} className="border-b border-fio py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span><strong className="font-semibold">{nomeVend.get(c.vendedor_id)}</strong> pela venda de {leadDaComissao(c)}</span>
                  <span className="num font-semibold text-vermelho">{fmtMoeda(c.valor_repassado)}</span>
                </div>
                <p className="num text-[0.9375rem] text-tinta-2">
                  Repassada em {fmtData(c.data_repasse)}; o pagamento da venda foi desfeito depois.
                </p>
                <button type="button" className="botao-secundario mt-2" onClick={() => resolver(c)}>
                  Marcar estorno como resolvido
                </button>
              </li>
            ))}
          </ul>
        </Secao>
      )}

      {filtrados.length === 0 ? (
        <Vazio>Nenhuma comissão neste período. A comissão nasce quando uma venda é marcada como paga.</Vazio>
      ) : (
        filtrados.map((g) => (
          <Secao
            key={`${g.vendedorId}|${g.mes}`}
            id={`g-${g.vendedorId}-${g.mes}`}
            titulo={`${nomeVend.get(g.vendedorId) ?? 'Vendedor'}, ${fmtMes(g.mes)}`}
            acao={
              <span className="num text-right text-[0.9375rem]">
                <strong>{fmtMoeda(g.totalARepassar)}</strong> <span className="text-tinta-2">a repassar</span>
              </span>
            }
          >
            {g.aRepassar.length > 0 && (
              <ul>
                {g.aRepassar.map((c) => (
                  <ItemARepassar key={c.id} c={c} lead={leadDaComissao(c)} pagoEm={vendaPorId.get(c.venda_id)?.data_pagamento ?? null} />
                ))}
              </ul>
            )}
            {g.repassadas.length > 0 && (
              <>
                <h3 className="mt-3 text-micro font-semibold text-tinta-2">
                  Repassadas <span className="num font-normal">{fmtMoeda(g.totalRepassado)}</span>
                </h3>
                <ul>
                  {g.repassadas.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-fio py-2 text-[0.9375rem]">
                      <span>{leadDaComissao(c)}</span>
                      <span className="num text-tinta-2">
                        {fmtMoeda(c.valor_repassado ?? c.valor)} em {fmtData(c.data_repasse)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Secao>
        ))
      )}
    </>
  )
}

function ItemARepassar({ c, lead, pagoEm }: { c: Comissao; lead: string; pagoEm: string | null }) {
  const [data, setData] = useState(hojeSP())
  const salvar = useSalvarComissao()
  const { avisar } = useAviso()
  const id = `rp-${c.id}`
  return (
    <li className="border-b border-fio py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-semibold">{lead}</span>
        <span className="num font-semibold">{fmtMoeda(c.valor)}</span>
      </div>
      <p className="num text-[0.9375rem] text-tinta-2">
        Cliente pagou em {fmtData(pagoEm)}; {c.percentual_aplicado.toLocaleString('pt-BR')}% de {fmtMoeda(c.base_calculo)}
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor={id} className="text-micro font-medium text-tinta-2">Data do repasse</label>
          <input id={id} type="date" className="campo num" value={data} max={hojeSP()} onChange={(e) => setData(e.target.value)} />
        </div>
        <button
          type="button"
          className="botao-primario"
          disabled={!data || salvar.isPending}
          onClick={async () => {
            try {
              await salvar.mutateAsync({ id: c.id, dados: { status_repasse: 'paga', data_repasse: data } })
              avisar(`Repasse de ${fmtMoeda(c.valor)} marcado como pago.`)
            } catch (e) {
              avisar(mensagemErro(e), 'erro')
            }
          }}
        >
          Marcar repasse como pago
        </button>
      </div>
    </li>
  )
}

