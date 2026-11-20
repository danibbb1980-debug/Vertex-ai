import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlvo } from '../auth/Alvo'
import { useLeads, useReunioes } from '../lib/api'
import { diaSP, fmtDiaSemana, fmtHora, hojeSP } from '../lib/datas'
import { FORMATOS, RASCUNHO_STATUS, RESULTADO_REUNIAO } from '../lib/rotulos'
import { Cabecalho, Carregando, Erro, Etiqueta, Vazio } from '../components/ui'
import type { Reuniao } from '../lib/types'

export default function Reunioes() {
  const { vendedorId, podeEditar } = useAlvo()
  const reunioes = useReunioes(vendedorId)
  const leads = useLeads(vendedorId)
  const [aba, setAba] = useState<'proximas' | 'passadas'>('proximas')
  const hoje = hojeSP()
  const nomes = useMemo(() => new Map((leads.data ?? []).map((l) => [l.id, l.nome])), [leads.data])

  const { proximas, passadas } = useMemo(() => {
    const p: Reuniao[] = []
    const q: Reuniao[] = []
    for (const r of reunioes.data ?? []) {
      const futura = !r.data_hora || diaSP(r.data_hora) >= hoje
      if (futura && !r.resultado) p.push(r)
      else q.push(r)
    }
    q.sort((a, b) => (b.data_hora ?? '').localeCompare(a.data_hora ?? ''))
    return { proximas: p, passadas: q }
  }, [reunioes.data, hoje])

  const lista = aba === 'proximas' ? proximas : passadas
  if (!vendedorId) return <Vazio>Escolha um vendedor no topo da tela.</Vazio>

  // agrupa por dia
  const grupos: { dia: string; itens: Reuniao[] }[] = []
  for (const r of lista) {
    const dia = r.data_hora ? diaSP(r.data_hora) : 'sem-data'
    const g = grupos[grupos.length - 1]
    if (g && g.dia === dia) g.itens.push(r)
    else grupos.push({ dia, itens: [r] })
  }

  return (
    <>
      <Cabecalho
        titulo="Reuniões"
        acao={podeEditar && <Link to="/reunioes/nova" className="botao-secundario">Marcar reunião</Link>}
      />
      <div role="group" aria-label="Período" className="flex gap-1 border-b border-tinta">
        {(['proximas', 'passadas'] as const).map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={aba === a}
            onClick={() => setAba(a)}
            className={`-mb-px min-h-11 border-b-[3px] px-2 text-[0.9375rem] ${aba === a ? 'border-verde font-semibold' : 'border-transparent text-tinta-2'}`}
          >
            {a === 'proximas' ? 'Próximas' : 'Realizadas e passadas'}
            <span className="num ml-1.5 text-tinta-2">{a === 'proximas' ? proximas.length : passadas.length}</span>
          </button>
        ))}
      </div>
      {reunioes.error && <Erro erro={reunioes.error} />}
      {reunioes.isLoading ? (
        <Carregando />
      ) : lista.length === 0 ? (
        <Vazio>{aba === 'proximas' ? 'Nenhuma reunião marcada. Quando uma ligação terminar em "Reunião marcada", ela aparece aqui.' : 'Nenhuma reunião passada.'}</Vazio>
      ) : (
        grupos.map((g) => (
          <section key={g.dia} aria-label={g.dia === 'sem-data' ? 'Sem data' : fmtDiaSemana(g.dia)}>
            <h2 className="num mt-4 text-micro font-semibold text-tinta-2">
              {g.dia === 'sem-data' ? 'Sem data' : g.dia === hoje ? `Hoje, ${fmtDiaSemana(g.dia)}` : fmtDiaSemana(g.dia)}
            </h2>
            <ul>
              {g.itens.map((r) => (
                <li key={r.id}>
                  <Link to={`/reunioes/${r.id}`} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 border-b border-fio py-3 hover:bg-superficie">
                    <span className="num text-[1.125rem] font-semibold">{r.data_hora ? fmtHora(r.data_hora) : '—'}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{nomes.get(r.lead_id) ?? 'Lead'}</span>
                      <span className="block truncate text-[0.9375rem] text-tinta-2">
                        {FORMATOS[r.formato]}, rascunho {RASCUNHO_STATUS[r.rascunho_status].toLowerCase()}
                      </span>
                    </span>
                    {r.resultado ? (
                      <Etiqueta tom={r.resultado === 'fechou' ? 'verde' : r.resultado === 'recusou' || r.resultado === 'faltou' ? 'vermelho' : 'neutro'}>
                        {RESULTADO_REUNIAO[r.resultado].replace('Compareceu e ', '')}
                      </Etiqueta>
                    ) : r.pacote_completo ? (
                      <Etiqueta tom="verde">Pacote ok</Etiqueta>
                    ) : (
                      <Etiqueta tom="ambar">Falta pacote</Etiqueta>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  )
}
