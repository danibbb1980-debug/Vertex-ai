import { useMemo, useState } from 'react'
import { useAlvo } from '../auth/Alvo'
import { useLigacoes, useReunioes, useVendas } from '../lib/api'
import { fmtData, hojeSP, subtrairDias } from '../lib/datas'
import { fmtPct } from '../lib/formato'
import { calcularFunil, motivosDePerda, type Periodo } from '../lib/regras'
import { Cabecalho, Carregando, Secao, Vazio } from '../components/ui'

export default function Desempenho() {
  const { vendedorId } = useAlvo()
  const ligacoes = useLigacoes(vendedorId)
  const reunioes = useReunioes(vendedorId)
  const vendas = useVendas(vendedorId)
  const hoje = hojeSP()
  const atalhos: { rotulo: string; p: Periodo }[] = [
    { rotulo: 'Teste de 2 semanas', p: { inicio: subtrairDias(hoje, 13), fim: hoje } },
    { rotulo: 'Este mês', p: { inicio: `${hoje.slice(0, 7)}-01`, fim: hoje } },
    { rotulo: 'Últimos 30 dias', p: { inicio: subtrairDias(hoje, 29), fim: hoje } },
  ]
  const [p, setP] = useState<Periodo>(atalhos[0].p)

  const funil = useMemo(
    () => calcularFunil(ligacoes.data ?? [], reunioes.data ?? [], vendas.data ?? [], p),
    [ligacoes.data, reunioes.data, vendas.data, p],
  )
  const motivos = useMemo(() => motivosDePerda(reunioes.data ?? [], p), [reunioes.data, p])
  const topo = Math.max(1, funil[0]?.total ?? 0)

  if (!vendedorId) return <Vazio>Escolha um vendedor no topo da tela.</Vazio>

  return (
    <>
      <Cabecalho titulo="Meu desempenho" sub={<span className="num">{fmtData(p.inicio)} a {fmtData(p.fim)}</span>} />

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Atalhos de período">
        {atalhos.map((a) => {
          const ativo = a.p.inicio === p.inicio && a.p.fim === p.fim
          return (
            <button key={a.rotulo} type="button" aria-pressed={ativo} onClick={() => setP(a.p)}
              className={`botao !min-h-10 !px-3 text-[0.9375rem] ${ativo ? 'bg-tinta text-white' : 'border border-fio-forte bg-superficie'}`}>
              {a.rotulo}
            </button>
          )
        })}
      </div>
      <div className="mt-3 grid max-w-sm grid-cols-2 gap-2">
        <div>
          <label htmlFor="ini" className="text-micro font-medium text-tinta-2">De</label>
          <input id="ini" type="date" className="campo num" value={p.inicio} max={p.fim} onChange={(e) => e.target.value && setP({ ...p, inicio: e.target.value })} />
        </div>
        <div>
          <label htmlFor="fim" className="text-micro font-medium text-tinta-2">Até</label>
          <input id="fim" type="date" className="campo num" value={p.fim} min={p.inicio} onChange={(e) => e.target.value && setP({ ...p, fim: e.target.value })} />
        </div>
      </div>

      {ligacoes.isLoading ? <Carregando /> : (
        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10">
          <Secao titulo="Funil" id="s-funil">
            <table className="w-full">
              <caption className="sr-only">Funil do período, com a taxa de passagem de cada etapa para a seguinte</caption>
              <thead className="sr-only">
                <tr><th scope="col">Etapa</th><th scope="col">Total</th><th scope="col">Taxa sobre a etapa anterior</th></tr>
              </thead>
              <tbody>
                {funil.map((e, i) => (
                  <tr key={e.chave} className="border-b border-fio align-top">
                    <th scope="row" className="py-3 pr-3 text-left font-normal">
                      <span className="block font-semibold">{e.rotulo}</span>
                      <span aria-hidden="true" className="mt-1.5 block h-2 rounded-r-[4px] bg-verde" style={{ width: `${Math.max(e.total ? 2 : 0, (e.total / topo) * 100)}%` }} />
                    </th>
                    <td className="num w-16 py-3 text-right text-[1.5rem] font-bold leading-none">{e.total}</td>
                    <td className="num w-28 py-3 pl-3 text-right text-[0.9375rem] text-tinta-2">
                      {i === 0 ? '' : <>{fmtPct(e.taxa)}<span className="block text-micro">da anterior</span></>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-micro text-tinta-2">
              Atendidas: toda ligação que não terminou em "não atendeu". Comparecimentos: reuniões do período que aconteceram (fechou, pediu tempo ou recusou). Vendas pagas: pela data de pagamento.
            </p>
          </Secao>

          <Secao titulo="Motivos de perda mais citados" id="s-motivos">
            {motivos.length === 0 ? <Vazio>Nenhum motivo registrado no período.</Vazio> : (
              <ol>
                {motivos.map((m) => (
                  <li key={m.motivo} className="flex items-baseline justify-between gap-3 border-b border-fio py-2.5">
                    <span>“{m.motivo}”</span>
                    <span className="num shrink-0 text-tinta-2">{m.vezes}×</span>
                  </li>
                ))}
              </ol>
            )}
          </Secao>
        </div>
      )}
    </>
  )
}
