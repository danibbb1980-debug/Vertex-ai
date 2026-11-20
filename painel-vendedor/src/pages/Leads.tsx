import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlvo } from '../auth/Alvo'
import { useLeads, useLigacoes } from '../lib/api'
import { fmtDataCurta, hojeSP } from '../lib/datas'
import { RESULTADO_LIGACAO, RESULTADOS_LIGACAO, SEGMENTOS } from '../lib/rotulos'
import { leadAtivo, mapaTentativas } from '../lib/regras'
import type { Ligacao, Segmento } from '../lib/types'
import { Cabecalho, Carregando, Erro, Etiqueta, Tentativas, Vazio } from '../components/ui'

type FiltroRetorno = '' | 'vencido' | 'futuro' | 'sem'
type Situacao = 'ativos' | 'arquivados'

const normal = (s: string) => s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '')

export default function Leads() {
  const { vendedorId, podeEditar } = useAlvo()
  const leads = useLeads(vendedorId)
  const ligacoes = useLigacoes(vendedorId)
  const [busca, setBusca] = useState('')
  const [segmento, setSegmento] = useState<'' | Segmento>('')
  const [cidade, setCidade] = useState('')
  const [resultado, setResultado] = useState<'' | Ligacao['resultado'] | 'nunca'>('')
  const [retorno, setRetorno] = useState<FiltroRetorno>('')
  const [situacao, setSituacao] = useState<Situacao>('ativos')
  const hoje = hojeSP()

  const { tentativas, ultima, cidades } = useMemo(() => {
    const ligs = ligacoes.data ?? []
    const ult = new Map<string, Ligacao>()
    for (const l of ligs) if (!ult.has(l.lead_id)) ult.set(l.lead_id, l) // já vem em ordem decrescente
    const cs = [...new Set((leads.data ?? []).map((l) => l.cidade?.trim()).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'pt-BR'))
    return { tentativas: mapaTentativas(ligs), ultima: ult, cidades: cs }
  }, [ligacoes.data, leads.data])

  const filtrados = useMemo(() => {
    const q = normal(busca.trim())
    return (leads.data ?? []).filter((l) => {
      if ((situacao === 'ativos') !== leadAtivo(l)) return false
      if (segmento && l.segmento !== segmento) return false
      if (cidade && l.cidade?.trim() !== cidade) return false
      if (resultado) {
        const u = ultima.get(l.id)
        if (resultado === 'nunca' ? !!u : u?.resultado !== resultado) return false
      }
      if (retorno === 'vencido' && !(l.retornar_em && l.retornar_em <= hoje)) return false
      if (retorno === 'futuro' && !(l.retornar_em && l.retornar_em > hoje)) return false
      if (retorno === 'sem' && l.retornar_em) return false
      if (q) {
        const alvo = normal([l.nome, l.cidade, l.telefone, l.instagram, l.areas].filter(Boolean).join(' '))
        if (!alvo.includes(q) && !(l.telefone ?? '').replace(/\D/g, '').includes(q.replace(/\D/g, '') || '§')) return false
      }
      return true
    })
  }, [leads.data, busca, segmento, cidade, resultado, retorno, situacao, ultima, hoje])

  const filtrosAtivos = [segmento, cidade, resultado, retorno].filter(Boolean).length

  if (!vendedorId) return <Vazio>Escolha um vendedor no topo da tela.</Vazio>

  return (
    <>
      <Cabecalho
        titulo="Leads"
        sub={<span className="num">{filtrados.length} {filtrados.length === 1 ? 'lead' : 'leads'}</span>}
        acao={podeEditar && <Link to="/leads/novo" className="botao-secundario hidden lg:inline-flex">Novo lead</Link>}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="busca" className="sr-only">Buscar lead</label>
        <input
          id="busca"
          type="search"
          className="campo"
          placeholder="Buscar por nome, cidade, telefone ou Instagram"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <details className="group" open={filtrosAtivos > 0 || undefined}>
          <summary className="flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-verde marker:content-none">
            Filtros{filtrosAtivos > 0 && <span className="num rounded bg-verde px-1.5 text-micro text-white">{filtrosAtivos}</span>}
            <span aria-hidden="true" className="text-tinta-2 transition-transform group-open:rotate-180">▾</span>
          </summary>
          <div className="grid grid-cols-2 gap-2 pb-2 sm:grid-cols-4">
            <div>
              <label htmlFor="f-seg" className="text-micro font-medium text-tinta-2">Segmento</label>
              <select id="f-seg" className="campo" value={segmento} onChange={(e) => setSegmento(e.target.value as Segmento | '')}>
                <option value="">Todos</option>
                {Object.entries(SEGMENTOS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-cid" className="text-micro font-medium text-tinta-2">Cidade</label>
              <select id="f-cid" className="campo" value={cidade} onChange={(e) => setCidade(e.target.value)}>
                <option value="">Todas</option>
                {cidades.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-res" className="text-micro font-medium text-tinta-2">Última ligação</label>
              <select id="f-res" className="campo" value={resultado} onChange={(e) => setResultado(e.target.value as typeof resultado)}>
                <option value="">Qualquer</option>
                <option value="nunca">Nunca ligou</option>
                {RESULTADOS_LIGACAO.map((r) => <option key={r.valor} value={r.valor}>{r.rotulo}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-ret" className="text-micro font-medium text-tinta-2">Retorno</label>
              <select id="f-ret" className="campo" value={retorno} onChange={(e) => setRetorno(e.target.value as FiltroRetorno)}>
                <option value="">Qualquer</option>
                <option value="vencido">Hoje ou vencido</option>
                <option value="futuro">Futuro</option>
                <option value="sem">Sem data</option>
              </select>
            </div>
            {filtrosAtivos > 0 && (
              <button type="button" className="botao-texto col-span-2 justify-self-start sm:col-span-4" onClick={() => { setSegmento(''); setCidade(''); setResultado(''); setRetorno('') }}>
                Limpar filtros
              </button>
            )}
          </div>
        </details>
        <div role="group" aria-label="Situação" className="flex gap-1 border-b border-tinta">
          {(['ativos', 'arquivados'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={situacao === s}
              onClick={() => setSituacao(s)}
              className={`-mb-px min-h-11 border-b-[3px] px-2 text-[0.9375rem] ${situacao === s ? 'border-verde font-semibold' : 'border-transparent text-tinta-2'}`}
            >
              {s === 'ativos' ? 'Ativos' : 'Arquivados e não ligar'}
            </button>
          ))}
        </div>
      </div>

      {(leads.error || ligacoes.error) && <Erro erro={leads.error || ligacoes.error} />}
      {leads.isLoading ? (
        <Carregando />
      ) : filtrados.length === 0 ? (
        <Vazio>
          {(leads.data ?? []).length === 0 ? 'Nenhum lead ainda. Toque em "Novo lead" para cadastrar o primeiro.' : 'Nenhum lead com esses filtros.'}
        </Vazio>
      ) : (
        <ul>
          {filtrados.map((l) => {
            const u = ultima.get(l.id)
            return (
              <li key={l.id}>
                <Link to={`/leads/${l.id}`} className="grid grid-cols-[1fr_auto] gap-x-3 border-b border-fio py-3 hover:bg-superficie">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{l.nome}</span>
                    <span className="block truncate text-[0.9375rem] text-tinta-2">
                      {l.segmento === 'outro' && l.segmento_outro ? l.segmento_outro : SEGMENTOS[l.segmento]}
                      {l.cidade ? `, ${l.cidade}` : ''}
                      {u ? `. Última: ${RESULTADO_LIGACAO[u.resultado].toLowerCase()}` : '. Nunca ligou'}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1 pt-0.5">
                    <Tentativas feitas={tentativas.get(l.id) ?? 0} />
                    {l.nao_ligar ? (
                      <Etiqueta tom="vermelho">Não ligar</Etiqueta>
                    ) : l.ja_tem_site ? (
                      <Etiqueta>Já tem site</Etiqueta>
                    ) : l.arquivado_em ? (
                      <Etiqueta>Arquivado</Etiqueta>
                    ) : l.retornar_em ? (
                      <span className={`num text-micro ${l.retornar_em <= hoje ? 'font-semibold text-ambar' : 'text-tinta-2'}`}>
                        retorno {fmtDataCurta(l.retornar_em)}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
