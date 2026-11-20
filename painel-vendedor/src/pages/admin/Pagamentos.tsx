import { useMemo, useState, type FormEvent } from 'react'
import {
  useAlterarPagamento, useConfig, useExcluirVenda, useProfiles, useSalvarComissao, useTodasComissoes, useTodasVendas, useTodosLeads,
} from '../../lib/api'
import { fmtData, hojeSP } from '../../lib/datas'
import { fmtMoeda, lerMoeda } from '../../lib/formato'
import { FORMA_PAGAMENTO, STATUS_REPASSE, STATUS_VENDA } from '../../lib/rotulos'
import { baseDaComissao, valorComissao } from '../../lib/regras'
import { mensagemErro } from '../../lib/supabase'
import type { Comissao, StatusVenda, Venda } from '../../lib/types'
import { useAviso } from '../../components/Aviso'
import Dialogo from '../../components/Dialogo'
import { Campo, Carregando, Erro, Etiqueta, Faixa, Secao, Vazio } from '../../components/ui'

type Filtro = 'todas' | StatusVenda
const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'aguardando_pagamento', rotulo: 'Aguardando' },
  { valor: 'paga', rotulo: 'Pagas' },
  { valor: 'cancelada', rotulo: 'Canceladas' },
  { valor: 'todas', rotulo: 'Todas' },
]

/** Admin: vendas de todos os vendedores e o status do pagamento do cliente. */
export default function Pagamentos() {
  const vendas = useTodasVendas(true)
  const comissoes = useTodasComissoes(true)
  const leads = useTodosLeads(true)
  const { data: perfis = [] } = useProfiles()
  const [filtro, setFiltro] = useState<Filtro>('aguardando_pagamento')
  const nomeLead = useMemo(() => new Map((leads.data ?? []).map((l) => [l.id, l.deleted_at ? `${l.nome} (lead excluído)` : l.nome])), [leads.data])
  const nomeVend = useMemo(() => new Map(perfis.map((p) => [p.user_id, p.nome])), [perfis])
  const porVenda = useMemo(() => new Map((comissoes.data ?? []).map((c) => [c.venda_id, c])), [comissoes.data])

  const todas = vendas.data ?? []
  const lista = filtro === 'todas' ? todas : todas.filter((v) => v.status === filtro)
  const estornar = (comissoes.data ?? []).filter((c) => c.status_repasse === 'estornar')
  const vendaPorId = useMemo(() => new Map(todas.map((v) => [v.id, v])), [todas])

  if (vendas.isLoading) return <Carregando />
  return (
    <>
      {vendas.error && <Erro erro={vendas.error} />}
      {estornar.length > 0 && (
        <div className="mt-4">
          <Faixa tom="vermelho">
            <p className="font-semibold">
              {estornar.length === 1 ? '1 comissão para estornar' : `${estornar.length} comissões para estornar`}
            </p>
            <p className="mt-0.5">
              O pagamento destas vendas foi desfeito depois que a comissão já tinha sido repassada. Combine a devolução com o vendedor e
              marque como resolvido em Comissões a repassar.
            </p>
            <ul className="mt-1.5">
              {estornar.map((c) => (
                <li key={c.id} className="num">
                  {nomeVend.get(c.vendedor_id)}: {fmtMoeda(c.valor_repassado)} da venda de {nomeLead.get(vendaPorId.get(c.venda_id)?.lead_id ?? '') ?? 'lead'}
                </li>
              ))}
            </ul>
          </Faixa>
        </div>
      )}

      <div role="group" aria-label="Filtrar por pagamento" className="mt-4 flex flex-wrap gap-1.5">
        {FILTROS.map((f) => {
          const n = f.valor === 'todas' ? todas.length : todas.filter((v) => v.status === f.valor).length
          return (
            <button
              key={f.valor}
              type="button"
              aria-pressed={filtro === f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`botao !min-h-10 !px-3 text-[0.9375rem] ${filtro === f.valor ? 'bg-tinta text-white' : 'border border-fio-forte bg-superficie'}`}
            >
              {f.rotulo}
              <span className="num font-normal opacity-80">{n}</span>
            </button>
          )
        })}
      </div>

      <Secao titulo="Vendas" contagem={lista.length} id="s-vendas">
        {lista.length === 0 ? (
          <Vazio>Nenhuma venda neste filtro.</Vazio>
        ) : (
          <ul>
            {lista.map((v) => (
              <LinhaVenda
                key={v.id}
                v={v}
                comissao={porVenda.get(v.id)}
                lead={nomeLead.get(v.lead_id) ?? 'Lead'}
                vendedor={nomeVend.get(v.vendedor_id) ?? ''}
              />
            ))}
          </ul>
        )}
      </Secao>
    </>
  )
}

function LinhaVenda({ v, comissao, lead, vendedor }: { v: Venda; comissao?: Comissao; lead: string; vendedor: string }) {
  const [destino, setDestino] = useState<StatusVenda | null>(null)
  const [corrigindo, setCorrigindo] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const idSel = `pg-${v.id}`
  const comissaoViva = comissao && !comissao.cancelada

  return (
    <li className="border-b border-fio py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-semibold">{lead}</span>
        <span className="num font-semibold">{fmtMoeda(v.valor_fechado ?? v.valor_combinado)}</span>
      </div>
      <p className="text-[0.9375rem] text-tinta-2">
        {vendedor}, {FORMA_PAGAMENTO[v.forma_pagamento]}
        {v.forma_pagamento === 'cartao' ? ` ${v.parcelas}x` : ''}
        {v.valor_fechado !== null && v.valor_fechado !== v.valor_combinado ? <>, combinado <span className="num">{fmtMoeda(v.valor_combinado)}</span></> : null}
      </p>

      <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center">
        <div>
          <label htmlFor={idSel} className="text-micro font-medium text-tinta-2">Pagamento do cliente</label>
          <select
            id={idSel}
            className="campo font-semibold"
            value={v.status}
            onChange={(e) => setDestino(e.target.value as StatusVenda)}
          >
            {Object.entries(STATUS_VENDA).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>{rotulo}</option>
            ))}
          </select>
        </div>
        <div className="text-[0.9375rem] sm:pt-4">
          {v.status === 'paga' && (
            <p className="num">
              Caiu em {fmtData(v.data_pagamento)}, líquido {fmtMoeda(v.valor_liquido_recebido ?? v.valor_fechado ?? v.valor_combinado)}
              {v.valor_liquido_recebido === null && <span className="text-tinta-2"> (valor fechado)</span>}
              <button type="button" className="botao-texto ml-1 !min-h-0 !inline !px-0 text-[0.9375rem]" onClick={() => setCorrigindo(true)}>
                Corrigir
              </button>
            </p>
          )}
          {comissaoViva && (
            <p className="num">
              Comissão <strong>{fmtMoeda(comissao.valor)}</strong>{' '}
              <span className="text-tinta-2">({comissao.percentual_aplicado.toLocaleString('pt-BR')}% de {fmtMoeda(comissao.base_calculo)})</span>{' '}
              <Etiqueta tom={comissao.status_repasse === 'paga' ? 'verde' : 'neutro'}>{STATUS_REPASSE[comissao.status_repasse]}</Etiqueta>
            </p>
          )}
          {comissao?.status_repasse === 'estornar' && (
            <p className="num font-semibold text-vermelho">
              Estornar {fmtMoeda(comissao.valor_repassado)} repassados em {fmtData(comissao.data_repasse)}
            </p>
          )}
          {comissao?.cancelada && comissao.status_repasse !== 'estornar' && (
            <p className="text-tinta-2">Comissão cancelada (histórico guardado na auditoria)</p>
          )}
          {v.status === 'aguardando_pagamento' && !comissao && <p className="text-tinta-2">Sem comissão até o pagamento.</p>}
        </div>
      </div>

      <div className="mt-1 flex justify-end">
        <button type="button" className="botao-texto !min-h-10 text-[0.9375rem] !text-vermelho" onClick={() => setExcluindo(true)}>
          Excluir venda
        </button>
      </div>
      {excluindo && <ExcluirVenda v={v} lead={lead} comissao={comissao} onFechar={() => setExcluindo(false)} />}
      {(destino === 'paga' || corrigindo) && <MarcarPaga
        aberto
        corrigindo={corrigindo}
        v={v}
        lead={lead}
        percentualGravado={comissaoViva ? comissao.percentual_aplicado : comissao?.percentual_aplicado}
        onFechar={() => { setDestino(null); setCorrigindo(false) }}
      />}
      {destino !== null && destino !== 'paga' && <ConfirmarStatus
        aberto
        destino={destino}
        v={v}
        lead={lead}
        comissao={comissao}
        onFechar={() => setDestino(null)}
      />}
    </li>
  )
}

function MarcarPaga({
  aberto, corrigindo, v, lead, percentualGravado, onFechar,
}: { aberto: boolean; corrigindo: boolean; v: Venda; lead: string; percentualGravado?: number; onFechar: () => void }) {
  const { data: config } = useConfig()
  const alterar = useAlterarPagamento()
  const { avisar } = useAviso()
  const [data, setData] = useState(v.data_pagamento ?? hojeSP())
  const [fechado, setFechado] = useState((v.valor_fechado ?? v.valor_combinado).toFixed(2).replace('.', ','))
  const [liquido, setLiquido] = useState(v.valor_liquido_recebido !== null ? v.valor_liquido_recebido.toFixed(2).replace('.', ',') : '')
  const nFechado = lerMoeda(fechado)
  const nLiquido = liquido.trim() ? lerMoeda(liquido) : null
  const liquidoInvalido = liquido.trim() !== '' && nLiquido === null
  const percentual = percentualGravado ?? config?.percentual_comissao ?? 25
  const base = nFechado === null ? null : baseDaComissao({ ...v, valor_fechado: nFechado, valor_liquido_recebido: null }, nLiquido)
  const previa = base === null ? null : valorComissao(base, percentual)
  const id = v.id

  async function confirmar(e: FormEvent) {
    e.preventDefault()
    if (nFechado === null || liquidoInvalido || !data) return
    try {
      await alterar.mutateAsync({ venda_id: v.id, status: 'paga', data_pagamento: data, valor_fechado: nFechado, valor_liquido_recebido: nLiquido })
      avisar(corrigindo ? 'Pagamento corrigido. Comissão recalculada.' : `Venda paga. Comissão de ${fmtMoeda(previa)} criada.`)
      onFechar()
    } catch (err) {
      avisar(mensagemErro(err), 'erro')
    }
  }

  return (
    <Dialogo aberto={aberto} onFechar={onFechar} titulo={corrigindo ? 'Corrigir pagamento' : 'Marcar como paga'}>
      <p className="text-[0.9375rem] text-tinta-2">{lead}</p>
      <form onSubmit={confirmar} className="mt-3 flex flex-col gap-3" noValidate>
        <Campo id={`dt-${id}`} rotulo="Data em que o dinheiro caiu">
          <input id={`dt-${id}`} type="date" className="campo num" value={data} max={hojeSP()} onChange={(e) => setData(e.target.value)} required />
        </Campo>
        <Campo id={`vf-${id}`} rotulo="Valor fechado (R$)" erro={nFechado === null ? 'Informe o valor fechado.' : null}>
          <input id={`vf-${id}`} inputMode="decimal" className="campo num" value={fechado} onChange={(e) => setFechado(e.target.value)} />
        </Campo>
        <Campo
          id={`lq-${id}`}
          rotulo="Valor líquido recebido (R$)"
          ajuda="Depois das taxas do Asaas ou do Mercado Pago. Em branco, usa o valor fechado."
          erro={liquidoInvalido ? 'Valor inválido. Use, por exemplo, 770,00.' : null}
        >
          <input id={`lq-${id}`} inputMode="decimal" className="campo num" value={liquido} placeholder={fechado} onChange={(e) => setLiquido(e.target.value)} />
        </Campo>

        <div className="rounded-md border border-fio bg-superficie px-3 py-2.5" aria-live="polite">
          <p className="text-micro font-medium text-tinta-2">Prévia da comissão</p>
          <dl className="num mt-1 grid grid-cols-3 gap-2">
            <div>
              <dt className="text-micro text-tinta-2">Percentual</dt>
              <dd className="font-semibold">{percentual.toLocaleString('pt-BR')}%</dd>
            </div>
            <div>
              <dt className="text-micro text-tinta-2">Base</dt>
              <dd className="font-semibold">{fmtMoeda(base)}</dd>
            </div>
            <div>
              <dt className="text-micro text-tinta-2">Comissão</dt>
              <dd className="text-[1.125rem] font-bold">{fmtMoeda(previa)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-micro text-tinta-2">
            {percentualGravado !== undefined
              ? 'Percentual já gravado nesta comissão; mudar a configuração não o altera.'
              : 'O percentual vigente fica gravado na comissão; mudar a configuração depois não a altera.'}
          </p>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="botao-primario !min-h-12 flex-1 sm:flex-none" disabled={nFechado === null || liquidoInvalido || !data || alterar.isPending}>
            {alterar.isPending ? 'Salvando…' : corrigindo ? 'Salvar correção' : 'Confirmar pagamento'}
          </button>
          <button type="button" className="botao-secundario !min-h-12" onClick={onFechar}>Cancelar</button>
        </div>
      </form>
    </Dialogo>
  )
}

function ConfirmarStatus({
  aberto, destino, v, lead, comissao, onFechar,
}: { aberto: boolean; destino: StatusVenda | null; v: Venda; lead: string; comissao?: Comissao; onFechar: () => void }) {
  const alterar = useAlterarPagamento()
  const { avisar } = useAviso()
  if (!destino || destino === 'paga') return null
  const desfazendo = v.status === 'paga'
  const repassada = comissao?.status_repasse === 'paga'
  return (
    <Dialogo
      aberto={aberto}
      onFechar={onFechar}
      titulo={desfazendo ? 'Desfazer o pagamento?' : `Mudar para "${STATUS_VENDA[destino]}"?`}
    >
      <p>
        {lead}: de <strong>{STATUS_VENDA[v.status]}</strong> para <strong>{STATUS_VENDA[destino]}</strong>.
      </p>
      {desfazendo && comissao && !comissao.cancelada && (
        <div className="mt-3">
          <Faixa tom={repassada ? 'vermelho' : 'ambar'}>
            <p className="num">
              A comissão de <strong>{fmtMoeda(comissao.valor)}</strong> será cancelada (valor zerado; o histórico fica na auditoria).
            </p>
            {repassada && (
              <p className="num mt-1 font-semibold">
                Ela já foi repassada em {fmtData(comissao.data_repasse)}. Vai ficar como "Estornar" até você resolver com o vendedor.
              </p>
            )}
          </Faixa>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className={`botao !min-h-12 flex-1 sm:flex-none ${desfazendo ? 'bg-vermelho text-white' : 'bg-verde text-white'}`}
          disabled={alterar.isPending}
          onClick={async () => {
            try {
              await alterar.mutateAsync({ venda_id: v.id, status: destino })
              avisar(desfazendo ? `Pagamento desfeito. ${repassada ? 'Comissão em "Estornar".' : 'Comissão cancelada.'}` : `Venda: ${STATUS_VENDA[destino]}.`)
              onFechar()
            } catch (e) {
              avisar(mensagemErro(e), 'erro')
            }
          }}
        >
          {desfazendo ? 'Desfazer pagamento' : 'Confirmar'}
        </button>
        <button type="button" className="botao-secundario !min-h-12" onClick={onFechar}>Manter como está</button>
      </div>
    </Dialogo>
  )
}

function ExcluirVenda({ v, lead, comissao, onFechar }: { v: Venda; lead: string; comissao?: Comissao; onFechar: () => void }) {
  const excluir = useExcluirVenda()
  const { avisar } = useAviso()
  const viva = comissao && !comissao.cancelada
  const repassada = comissao?.status_repasse === 'paga'
  return (
    <Dialogo aberto onFechar={onFechar} titulo="Excluir venda?">
      <p>
        {lead}: <span className="num">{fmtMoeda(v.valor_fechado ?? v.valor_combinado)}</span>, {STATUS_VENDA[v.status].toLowerCase()}.
      </p>
      <p className="mt-2 text-[0.9375rem] text-tinta-2">
        A venda some das listas (fica guardada no banco, na auditoria e na exportação). Não dá para desfazer pelo app.
      </p>
      {viva && (
        <div className="mt-3">
          <Faixa tom={repassada ? 'vermelho' : 'ambar'}>
            <p className="num">A comissão de <strong>{fmtMoeda(comissao.valor)}</strong> será cancelada.</p>
            {repassada && (
              <p className="num mt-1 font-semibold">
                Ela já foi repassada em {fmtData(comissao.data_repasse)}: vai ficar como "Estornar" até você resolver com o vendedor.
              </p>
            )}
          </Faixa>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="botao !min-h-12 flex-1 bg-vermelho text-white sm:flex-none"
          disabled={excluir.isPending}
          onClick={async () => {
            try {
              await excluir.mutateAsync(v.id)
              avisar(viva ? (repassada ? 'Venda excluída. Comissão em "Estornar".' : 'Venda excluída. Comissão cancelada.') : 'Venda excluída.')
              onFechar()
            } catch (e) {
              avisar(mensagemErro(e), 'erro')
            }
          }}
        >
          {excluir.isPending ? 'Excluindo…' : 'Excluir venda'}
        </button>
        <button type="button" className="botao-secundario !min-h-12" onClick={onFechar}>Cancelar</button>
      </div>
    </Dialogo>
  )
}

// usado por Repasses para resolver estornos
export function useResolverEstorno() {
  const salvar = useSalvarComissao()
  const { avisar } = useAviso()
  return async (c: Comissao) => {
    try {
      await salvar.mutateAsync({ id: c.id, dados: { status_repasse: 'a_pagar' } })
      avisar('Estorno marcado como resolvido.')
    } catch (e) {
      avisar(mensagemErro(e), 'erro')
    }
  }
}
