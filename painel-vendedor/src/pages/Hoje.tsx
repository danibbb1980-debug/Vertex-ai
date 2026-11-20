import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAlvo } from '../auth/Alvo'
import { useConfig, useLeads, useLigacoes, useReunioes } from '../lib/api'
import { diaSP, fmtDataCurta, fmtDiaExtenso, fmtHora, hojeSP } from '../lib/datas'
import { FORMATOS } from '../lib/rotulos'
import { listaHoje, mapaTentativas, pendenciasPacote, reunioesDoDia } from '../lib/regras'
import LinhaLigacao from '../components/LinhaLigacao'
import { Cabecalho, Carregando, Erro, Etiqueta, Secao, Vazio } from '../components/ui'
import type { Lead } from '../lib/types'

export default function Hoje() {
  const { vendedorId, podeEditar } = useAlvo()
  const leads = useLeads(vendedorId)
  const ligacoes = useLigacoes(vendedorId)
  const reunioes = useReunioes(vendedorId)
  const { data: config } = useConfig()
  const hoje = hojeSP()

  const dados = useMemo(() => {
    const ls = leads.data ?? []
    const porId = new Map<string, Lead>(ls.map((l) => [l.id, l]))
    const ligs = ligacoes.data ?? []
    return {
      porId,
      tentativas: mapaTentativas(ligs),
      ligarHoje: listaHoje(ls, hoje),
      feitasHoje: ligs.filter((l) => diaSP(l.data_hora) === hoje).length,
      reunioesHoje: reunioesDoDia(reunioes.data ?? [], hoje),
      pendencias: pendenciasPacote(reunioes.data ?? [], porId, hoje),
    }
  }, [leads.data, ligacoes.data, reunioes.data, hoje])

  if (!vendedorId) return <Vazio>Escolha um vendedor no topo da tela.</Vazio>
  const erro = leads.error || ligacoes.error || reunioes.error
  const meta = config?.meta_ligacoes_dia

  return (
    <>
      <Cabecalho
        titulo="Hoje"
        sub={
          <>
            <span className="first-letter:uppercase inline-block">{fmtDiaExtenso(hoje)}</span>
            <span className="num">
              {', '}
              {dados.feitasHoje}
              {meta ? ` de ${meta}` : ''} {dados.feitasHoje === 1 && !meta ? 'ligação registrada' : 'ligações registradas'}
            </span>
          </>
        }
      />
      {erro && <Erro erro={erro} />}
      {leads.isLoading ? (
        <Carregando />
      ) : (
        <div className="lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
          <Secao titulo="Para ligar" contagem={dados.ligarHoje.length} id="s-ligar">
            {dados.ligarHoje.length === 0 ? (
              <Vazio>
                Ninguém para ligar hoje.{' '}
                {podeEditar && (
                  <Link to="/leads/novo" className="font-semibold text-verde underline underline-offset-4">
                    Cadastrar um lead
                  </Link>
                )}
              </Vazio>
            ) : (
              <ul>
                {dados.ligarHoje.map((l) => (
                  <LinhaLigacao key={l.id} lead={l} feitas={dados.tentativas.get(l.id) ?? 0} hoje={hoje} podeEditar={podeEditar} />
                ))}
              </ul>
            )}
          </Secao>

          <div className="lg:mt-0">
            <Secao titulo="Reuniões de hoje" contagem={dados.reunioesHoje.length} id="s-reunioes">
              {dados.reunioesHoje.length === 0 ? (
                <Vazio>Nenhuma reunião hoje.</Vazio>
              ) : (
                <ul>
                  {dados.reunioesHoje.map((r) => (
                    <li key={r.id} className="border-b border-fio">
                      <Link to={`/reunioes/${r.id}`} className="flex items-center gap-3 py-3 hover:bg-superficie">
                        <span className="num w-14 shrink-0 text-[1.25rem] font-semibold">{fmtHora(r.data_hora)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{dados.porId.get(r.lead_id)?.nome ?? 'Lead'}</span>
                          <span className="text-[0.9375rem] text-tinta-2">{FORMATOS[r.formato]}</span>
                        </span>
                        {r.pacote_completo ? <Etiqueta tom="verde">Pacote ok</Etiqueta> : <Etiqueta tom="ambar">Falta pacote</Etiqueta>}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Secao>

            <Secao titulo="Pendências" contagem={dados.pendencias.length} id="s-pend">
              {dados.pendencias.length === 0 ? (
                <Vazio>Todos os pacotes das próximas reuniões estão completos.</Vazio>
              ) : (
                <ul>
                  {dados.pendencias.map((p) => (
                    <li key={p.reuniaoId} className="border-b border-fio">
                      <Link to={`/reunioes/${p.reuniaoId}`} className="block py-3 hover:bg-superficie">
                        <span className="block">
                          Falta o pacote completo para a reunião{p.dia ? ` de ${fmtDataCurta(p.dia)}` : ''} com{' '}
                          <strong className="font-semibold">{p.leadNome}</strong>
                        </span>
                        <span className="mt-0.5 block text-[0.9375rem] text-ambar">Falta: {p.faltando.join(', ')}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Secao>
          </div>
        </div>
      )}
    </>
  )
}
