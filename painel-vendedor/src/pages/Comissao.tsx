import { useMemo } from 'react'
import { useAlvo } from '../auth/Alvo'
import { useComissoes, useConfig, useLeads, useVendas } from '../lib/api'
import { fmtData, fmtMes } from '../lib/datas'
import { fmtMoeda } from '../lib/formato'
import { FORMA_PAGAMENTO, STATUS_COMISSAO, STATUS_VENDA } from '../lib/rotulos'
import { comissaoPorMes } from '../lib/regras'
import { Cabecalho, Carregando, Erro, Etiqueta, Secao, Vazio } from '../components/ui'

export default function Comissao() {
  const { vendedorId } = useAlvo()
  const vendas = useVendas(vendedorId)
  const comissoes = useComissoes(vendedorId)
  const leads = useLeads(vendedorId)
  const { data: config } = useConfig()
  const nomes = useMemo(() => new Map((leads.data ?? []).map((l) => [l.id, l.nome])), [leads.data])
  const porVenda = useMemo(() => new Map((comissoes.data ?? []).map((c) => [c.venda_id, c])), [comissoes.data])

  const totais = useMemo(() => {
    const cs = (comissoes.data ?? []).filter((c) => !c.cancelada)
    const soma = (f: (c: (typeof cs)[number]) => boolean) => Math.round(cs.filter(f).reduce((s, c) => s + c.valor, 0) * 100) / 100
    return { aReceber: soma((c) => c.status === 'a_pagar'), recebida: soma((c) => c.status === 'paga') }
  }, [comissoes.data])
  const meses = useMemo(() => comissaoPorMes(comissoes.data ?? []), [comissoes.data])
  const emAndamento = (vendas.data ?? []).filter((v) => v.status === 'aguardando_aprovacao' || v.status === 'aguardando_pagamento').length

  if (!vendedorId) return <Vazio>Escolha um vendedor no topo da tela.</Vazio>
  const pct = config?.percentual_comissao ?? 25

  return (
    <>
      <Cabecalho
        titulo="Vendas e comissão"
        sub={<>Comissão de <span className="num">{pct.toLocaleString('pt-BR')}%</span> sobre o valor líquido que o Pedro recebe. Ela nasce quando a venda é paga.</>}
      />
      {(vendas.error || comissoes.error) && <Erro erro={vendas.error || comissoes.error} />}

      <dl className="grid grid-cols-2 border-y border-tinta">
        <div className="border-r border-fio py-3 pr-3">
          <dt className="text-[0.9375rem] text-tinta-2">A receber</dt>
          <dd className="num text-[1.75rem] font-bold leading-tight tracking-[-0.01em] lg:text-[2.25rem]">{fmtMoeda(totais.aReceber)}</dd>
        </div>
        <div className="py-3 pl-3">
          <dt className="text-[0.9375rem] text-tinta-2">Já recebida</dt>
          <dd className="num text-[1.75rem] font-semibold leading-tight text-tinta-2 lg:text-[2.25rem]">{fmtMoeda(totais.recebida)}</dd>
        </div>
      </dl>
      {emAndamento > 0 && (
        <p className="num mt-2 text-[0.9375rem] text-tinta-2">
          {emAndamento} {emAndamento === 1 ? 'venda em andamento: a comissão nasce' : 'vendas em andamento: as comissões nascem'} quando o pagamento for confirmado.
        </p>
      )}

      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <Secao titulo="Vendas" contagem={vendas.data?.length ?? 0} id="s-vendas">
          {vendas.isLoading ? <Carregando /> : (vendas.data ?? []).length === 0 ? (
            <Vazio>Nenhuma venda ainda. Ao registrar "Compareceu e fechou" numa reunião, a venda aparece aqui.</Vazio>
          ) : (
            <ul>
              {(vendas.data ?? []).map((v) => {
                const c = porVenda.get(v.id)
                return (
                  <li key={v.id} className="border-b border-fio py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate font-semibold">{nomes.get(v.lead_id) ?? 'Lead'}</span>
                      <span className="num shrink-0 font-semibold">{fmtMoeda(v.valor_fechado ?? v.valor_combinado)}</span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[0.9375rem] text-tinta-2">
                      <span>
                        {FORMA_PAGAMENTO[v.forma_pagamento]}{v.forma_pagamento === 'cartao' ? ` ${v.parcelas}x` : ''}
                        {v.data_pagamento ? `, paga em ${fmtData(v.data_pagamento)}` : ''}
                      </span>
                      <Etiqueta tom={v.status === 'paga' ? 'verde' : v.status === 'cancelada' ? 'vermelho' : 'neutro'}>{STATUS_VENDA[v.status]}</Etiqueta>
                    </div>
                    {c && (
                      <p className="num mt-1 text-[0.9375rem]">
                        Comissão <strong>{fmtMoeda(c.valor)}</strong>
                        <span className="text-tinta-2">
                          {' '}({c.percentual.toLocaleString('pt-BR')}% de {fmtMoeda(c.base_calculo)} líquido), {c.cancelada ? 'zerada pelo cancelamento' : STATUS_COMISSAO[c.status].toLowerCase()}
                          {c.status === 'paga' && c.data_pagamento ? ` em ${fmtData(c.data_pagamento)}` : ''}
                        </span>
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Secao>

        <Secao titulo="Por mês" id="s-meses">
          {meses.length === 0 ? <Vazio>Sem comissões ainda.</Vazio> : (
            <table className="w-full text-[0.9375rem]">
              <caption className="sr-only">Comissão por mês</caption>
              <thead>
                <tr className="border-b border-fio text-left text-tinta-2">
                  <th scope="col" className="py-2 font-medium">Mês</th>
                  <th scope="col" className="py-2 text-right font-medium">A receber</th>
                  <th scope="col" className="py-2 text-right font-medium">Paga</th>
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
