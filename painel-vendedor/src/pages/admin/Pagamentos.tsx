import { useMemo, useState } from 'react'
import {
  useConfig, useProfiles, useRegistrarPagamento, useSalvarComissao, useSalvarVenda, useTodasComissoes, useTodasVendas, useTodosLeads,
} from '../../lib/api'
import { fmtData, hojeSP } from '../../lib/datas'
import { fmtMoeda, lerMoeda } from '../../lib/formato'
import { FORMA_PAGAMENTO, STATUS_VENDA } from '../../lib/rotulos'
import { calcularComissao } from '../../lib/regras'
import { mensagemErro } from '../../lib/supabase'
import type { Comissao, Venda } from '../../lib/types'
import { useAviso } from '../../components/Aviso'
import { Campo, Carregando, Etiqueta, Secao, Vazio } from '../../components/ui'

export default function Pagamentos() {
  const vendas = useTodasVendas(true)
  const comissoes = useTodasComissoes(true)
  const leads = useTodosLeads(true)
  const { data: perfis = [] } = useProfiles()
  const nomeLead = useMemo(() => new Map((leads.data ?? []).map((l) => [l.id, l.nome])), [leads.data])
  const nomeVend = useMemo(() => new Map(perfis.map((p) => [p.user_id, p.nome])), [perfis])
  const vendaPorId = useMemo(() => new Map((vendas.data ?? []).map((v) => [v.id, v])), [vendas.data])

  const abertas = (vendas.data ?? []).filter((v) => v.status === 'aguardando_aprovacao' || v.status === 'aguardando_pagamento')
  const aPagar = (comissoes.data ?? []).filter((c) => c.status === 'a_pagar' && !c.cancelada)
  const pagas = (vendas.data ?? []).filter((v) => v.status === 'paga')

  if (vendas.isLoading) return <Carregando />
  return (
    <>
      <Secao titulo="Vendas aguardando pagamento" contagem={abertas.length} id="s-abertas">
        {abertas.length === 0 ? <Vazio>Nenhuma venda em aberto.</Vazio> : (
          <ul>{abertas.map((v) => <VendaAberta key={v.id} v={v} lead={nomeLead.get(v.lead_id) ?? 'Lead'} vendedor={nomeVend.get(v.vendedor_id) ?? ''} />)}</ul>
        )}
      </Secao>

      <Secao titulo="Comissões a pagar" contagem={aPagar.length} id="s-apagar"
        acao={<span className="num text-[0.9375rem] font-semibold">{fmtMoeda(aPagar.reduce((s, c) => s + c.valor, 0))}</span>}>
        {aPagar.length === 0 ? <Vazio>Nenhuma comissão pendente.</Vazio> : (
          <ul>{aPagar.map((c) => <ComissaoAPagar key={c.id} c={c} lead={nomeLead.get(vendaPorId.get(c.venda_id)?.lead_id ?? '') ?? 'Lead'} vendedor={nomeVend.get(c.vendedor_id) ?? ''} />)}</ul>
        )}
      </Secao>

      <Secao titulo="Vendas pagas" contagem={pagas.length} id="s-pagas">
        {pagas.length === 0 ? <Vazio>Nenhuma venda paga ainda.</Vazio> : (
          <ul>{pagas.map((v) => <VendaPaga key={v.id} v={v} lead={nomeLead.get(v.lead_id) ?? 'Lead'} vendedor={nomeVend.get(v.vendedor_id) ?? ''} />)}</ul>
        )}
      </Secao>
    </>
  )
}

function VendaAberta({ v, lead, vendedor }: { v: Venda; lead: string; vendedor: string }) {
  const { data: config } = useConfig()
  const [aberto, setAberto] = useState(false)
  const [fechado, setFechado] = useState(String(v.valor_combinado).replace('.', ','))
  const [base, setBase] = useState('')
  const [data, setData] = useState(hojeSP())
  const [pct, setPct] = useState('')
  const registrar = useRegistrarPagamento()
  const salvarVenda = useSalvarVenda()
  const { avisar } = useAviso()
  const percentual = lerMoeda(pct) ?? config?.percentual_comissao ?? 25
  const nBase = lerMoeda(base)
  const nFechado = lerMoeda(fechado)
  const previa = nBase !== null ? calcularComissao(nBase, percentual, 'paga') : null
  const id = v.id.slice(0, 8)

  return (
    <li className="border-b border-fio py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-semibold">{lead}</span>
        <span className="num font-semibold">{fmtMoeda(v.valor_combinado)}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.9375rem] text-tinta-2">
        <span>{vendedor}, {FORMA_PAGAMENTO[v.forma_pagamento]}{v.forma_pagamento === 'cartao' ? ` ${v.parcelas}x` : ''}</span>
        <Etiqueta>{STATUS_VENDA[v.status]}</Etiqueta>
      </div>
      {!aberto ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="botao-primario" onClick={() => setAberto(true)}>Registrar pagamento</button>
          <button type="button" className="botao-secundario !text-vermelho" disabled={salvarVenda.isPending}
            onClick={async () => {
              if (!window.confirm(`Cancelar a venda de ${lead}?`)) return
              try { await salvarVenda.mutateAsync({ id: v.id, dados: { status: 'cancelada' } }); avisar('Venda cancelada.') } catch (e) { avisar(mensagemErro(e), 'erro') }
            }}>
            Cancelar venda
          </button>
        </div>
      ) : (
        <form className="mt-3 grid gap-3 rounded-md border border-fio bg-superficie p-3 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault()
            if (nBase === null || nFechado === null) return
            try {
              await registrar.mutateAsync({ venda_id: v.id, valor_fechado: nFechado, base_liquida: nBase, data_pagamento: data, percentual })
              avisar('Pagamento registrado e comissão criada.')
            } catch (err) { avisar(mensagemErro(err), 'erro') }
          }}>
          <Campo id={`vf-${id}`} rotulo="Valor fechado (R$)">
            <input id={`vf-${id}`} inputMode="decimal" className="campo num" value={fechado} onChange={(e) => setFechado(e.target.value)} required />
          </Campo>
          <Campo id={`bl-${id}`} rotulo="Base líquida recebida (R$)" ajuda="Depois das taxas do cartão ou do boleto.">
            <input id={`bl-${id}`} inputMode="decimal" className="campo num" value={base} onChange={(e) => setBase(e.target.value)} required />
          </Campo>
          <Campo id={`dp-${id}`} rotulo="Data do pagamento">
            <input id={`dp-${id}`} type="date" className="campo num" value={data} onChange={(e) => setData(e.target.value)} required />
          </Campo>
          <Campo id={`pc-${id}`} rotulo="Percentual da comissão" ajuda={`Padrão: ${(config?.percentual_comissao ?? 25).toLocaleString('pt-BR')}%`}>
            <input id={`pc-${id}`} inputMode="decimal" className="campo num" placeholder={String(config?.percentual_comissao ?? 25)} value={pct} onChange={(e) => setPct(e.target.value)} />
          </Campo>
          <p className="num text-[0.9375rem] sm:col-span-2">
            Comissão: <strong>{previa !== null ? fmtMoeda(previa) : '—'}</strong>
          </p>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="botao-primario" disabled={nBase === null || nFechado === null || !data || registrar.isPending}>Confirmar pagamento</button>
            <button type="button" className="botao-secundario" onClick={() => setAberto(false)}>Voltar</button>
          </div>
        </form>
      )}
    </li>
  )
}

function ComissaoAPagar({ c, lead, vendedor }: { c: Comissao; lead: string; vendedor: string }) {
  const [data, setData] = useState(hojeSP())
  const salvar = useSalvarComissao()
  const { avisar } = useAviso()
  return (
    <li className="border-b border-fio py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span><span className="font-semibold">{vendedor}</span> <span className="text-tinta-2">pela venda de {lead}</span></span>
        <span className="num font-semibold">{fmtMoeda(c.valor)}</span>
      </div>
      <p className="num text-[0.9375rem] text-tinta-2">{c.percentual.toLocaleString('pt-BR')}% de {fmtMoeda(c.base_calculo)}</p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor={`cp-${c.id}`} className="text-micro font-medium text-tinta-2">Pago em</label>
          <input id={`cp-${c.id}`} type="date" className="campo num" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <button type="button" className="botao-primario" disabled={!data || salvar.isPending}
          onClick={async () => {
            try { await salvar.mutateAsync({ id: c.id, dados: { status: 'paga', data_pagamento: data } }); avisar('Comissão marcada como paga.') } catch (e) { avisar(mensagemErro(e), 'erro') }
          }}>
          Marcar como paga
        </button>
      </div>
    </li>
  )
}

function VendaPaga({ v, lead, vendedor }: { v: Venda; lead: string; vendedor: string }) {
  const salvar = useSalvarVenda()
  const { avisar } = useAviso()
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-b border-fio py-2.5">
      <span className="min-w-0">
        <span className="font-semibold">{lead}</span>
        <span className="block text-[0.9375rem] text-tinta-2"><span className="num">{fmtMoeda(v.valor_fechado)}</span> em {fmtData(v.data_pagamento)}, {vendedor}</span>
      </span>
      <button type="button" className="botao-texto !text-vermelho" disabled={salvar.isPending}
        onClick={async () => {
          if (!window.confirm(`Marcar a venda de ${lead} como cancelada ou reembolsada? A comissão será zerada.`)) return
          try { await salvar.mutateAsync({ id: v.id, dados: { status: 'cancelada' } }); avisar('Venda cancelada. Comissão zerada.') } catch (e) { avisar(mensagemErro(e), 'erro') }
        }}>
        Reembolsar
      </button>
    </li>
  )
}
