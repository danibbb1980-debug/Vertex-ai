import { useMemo, useState } from 'react'
import { useAlvo } from '../auth/Alvo'
import { useComissoes, useConfig, useLeads, useVendas } from '../lib/api'
import { fmtData, fmtMes, hojeSP } from '../lib/datas'
import { fmtMoeda } from '../lib/formato'
import { FORMA_PAGAMENTO, STATUS_VENDA } from '../lib/rotulos'
import { comissaoPorMes, situacaoComissao, totaisDoMes, type SituacaoComissao } from '../lib/regras'
import { Cabecalho, Carregando, Erro, Etiqueta, Secao, Vazio } from '../components/ui'

/** Vendedor (e admin vendo o painel dele): vendas e comissão, somente leitura. */
export default function Comissao() {
  const { vendedorId } = useAlvo()
  const vendas = useVendas(vendedorId)
  const comissoes = useComissoes(vendedorId)
  const leads = useLeads(vendedorId)
  const { data: config } = useConfig()
  const [mes, setMes] = useState(hojeSP().slice(0, 7))
  const nomes = useMemo(() => new Map((leads.data ?? []).map((l) => [l.id, l.nome])), [leads.data])
  const porVenda = useMemo(() => new Map((comissoes.data ?? []).map((c) => [c.venda_id, c])), [comissoes.data])
  const totais = useMemo(() => totaisDoMes(comissoes.data ?? [], vendas.data ?? [], mes), [comissoes.data, vendas.data, mes])
  const meses = useMemo(() => comissaoPorMes(comissoes.data ?? [], vendas.data ?? []), [comissoes.data, vendas.data])

  if (!vendedorId) return <Vazio>Escolha um vendedor no topo da tela.</Vazio>
  const pct = config?.percentual_comissao ?? 25

  return (
    <>
      <Cabecalho
        titulo="Vendas e comissão"
        sub={<>A comissão nasce quando o cliente paga: <span className="num">{pct.toLocaleString('pt-BR')}%</span> do valor líquido que o Pedro recebe.</>}
      />
      {(vendas.error || comissoes.error) && <Erro erro={vendas.error || comissoes.error} />}

      <div className="flex items-end justify-between gap-3">
        <div>
          <label htmlFor="mes" className="text-micro font-medium text-tinta-2">Mês</label>
          <input id="mes" type="month" className="campo num !w-auto" value={mes} max={hojeSP().slice(0, 7)} onChange={(e) => e.target.value && setMes(e.target.value)} />
        </div>
        <p className="pb-2.5 text-[0.9375rem] font-medium first-letter:uppercase">{fmtMes(mes)}</p>
      </div>
      <dl className="mt-3 grid grid-cols-2 border-y border-tinta">
        <div className="border-r border-fio py-3 pr-3">
          <dt className="text-[0.9375rem] text-tinta-2">A receber</dt>
          <dd className="num text-[1.75rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.25rem]">{fmtMoeda(totais.aReceber)}</dd>
          <dd className="text-micro text-tinta-2">vendas pagas no mês</dd>
        </div>
        <div className="py-3 pl-3">
          <dt className="text-[0.9375rem] text-tinta-2">Recebido</dt>
          <dd className="num text-[1.75rem] font-semibold leading-tight text-tinta-2 lg:text-[2.25rem]">{fmtMoeda(totais.recebido)}</dd>
          <dd className="text-micro text-tinta-2">repasses feitos no mês</dd>
        </div>
      </dl>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <Secao titulo="Vendas" contagem={vendas.data?.length ?? 0} id="s-vendas">
          {vendas.isLoading ? <Carregando /> : (vendas.data ?? []).length === 0 ? (
            <Vazio>Nenhuma venda ainda. Ao registrar "Compareceu e fechou" numa reunião, a venda aparece aqui.</Vazio>
          ) : (
            <ul>
              {(vendas.data ?? []).map((v) => {
                const s = situacaoComissao(v, porVenda.get(v.id))
                return (
                  <li key={v.id} className="border-b border-fio py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate font-semibold">{nomes.get(v.lead_id) ?? 'Lead excluído'}</span>
                      <Etiqueta tom={v.status === 'paga' ? 'verde' : v.status === 'cancelada' ? 'vermelho' : 'neutro'}>{STATUS_VENDA[v.status]}</Etiqueta>
                    </div>
                    <p className="num text-[0.9375rem] text-tinta-2">
                      {fmtMoeda(v.valor_fechado ?? v.valor_combinado)}, {FORMA_PAGAMENTO[v.forma_pagamento]}
                      {v.forma_pagamento === 'cartao' ? ` ${v.parcelas}x` : ''}
                    </p>
                    <LinhaComissao s={s} />
                  </li>
                )
              })}
            </ul>
          )}
        </Secao>

        <Secao titulo="Por mês" id="s-meses">
          {meses.length === 0 ? <Vazio>Os totais aparecem depois da primeira venda paga.</Vazio> : (
            <table className="w-full text-[0.9375rem]">
              <caption className="sr-only">Comissão por mês: a receber pelo mês em que o cliente pagou, recebido pelo mês do repasse</caption>
              <thead>
                <tr className="border-b border-fio text-left text-tinta-2">
                  <th scope="col" className="py-2 font-medium">Mês</th>
                  <th scope="col" className="py-2 text-right font-medium">A receber</th>
                  <th scope="col" className="py-2 text-right font-medium">Recebido</th>
                </tr>
              </thead>
              <tbody>
                {meses.map((m) => (
                  <tr key={m.mes} className="border-b border-fio">
                    <th scope="row" className="py-2.5 text-left font-medium first-letter:uppercase">{fmtMes(m.mes)}</th>
                    <td className="num py-2.5 text-right">{fmtMoeda(m.aReceber)}</td>
                    <td className="num py-2.5 text-right text-tinta-2">{fmtMoeda(m.recebida)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Secao>
      </div>
    </>
  )
}

function LinhaComissao({ s }: { s: SituacaoComissao }) {
  switch (s.tipo) {
    case 'aguardando':
      return <p className="mt-1 text-[0.9375rem] text-tinta-2">Comissão disponível após o pagamento.</p>
    case 'cancelada':
      return <p className="mt-1 text-[0.9375rem] text-tinta-2">Venda cancelada: sem comissão.</p>
    case 'estornar':
      return (
        <p className="num mt-1 text-[0.9375rem] font-semibold text-vermelho">
          Estorno pendente: {fmtMoeda(s.valorRepassado)} repassados em {fmtData(s.dataRepasse)}. Combine a devolução com o Pedro.
        </p>
      )
    case 'paga':
      return (
        <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="num text-[0.9375rem]">
            Comissão <strong className="text-[1.0625rem]">{fmtMoeda(s.valor)}</strong>
            <span className="text-tinta-2"> ({s.percentual.toLocaleString('pt-BR')}% de {fmtMoeda(s.base)}), cliente pagou em {fmtData(s.dataPagamento)}</span>
          </p>
          {s.repasse === 'paga'
            ? <Etiqueta tom="verde">Recebida em {fmtData(s.dataRepasse)}</Etiqueta>
            : <Etiqueta tom="ambar">A receber</Etiqueta>}
        </div>
      )
  }
}
