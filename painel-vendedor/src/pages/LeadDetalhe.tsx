import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAlvo } from '../auth/Alvo'
import { useLeads, useLigacoes, useReunioes, useSalvarLead, useVendas } from '../lib/api'
import { fmtData, fmtDataHora, hojeSP } from '../lib/datas'
import { fmtMoeda, instagramUrl, telefoneE164 } from '../lib/formato'
import { RASCUNHO_STATUS, RESULTADO_LIGACAO, RESULTADO_REUNIAO, SEGMENTOS, STATUS_VENDA, WHATSAPP } from '../lib/rotulos'
import { leadAtivo } from '../lib/regras'
import { mensagemErro } from '../lib/supabase'
import { useAviso } from '../components/Aviso'
import ExcluirLead from '../components/ExcluirLead'
import LinhaLigacao from '../components/LinhaLigacao'
import { Cabecalho, Carregando, Etiqueta, Secao, Vazio } from '../components/ui'
import type { Lead } from '../lib/types'

export default function LeadDetalhe() {
  const { id } = useParams()
  const { vendedorId, podeEditar } = useAlvo()
  const leads = useLeads(vendedorId)
  const ligacoes = useLigacoes(vendedorId)
  const reunioes = useReunioes(vendedorId)
  const vendas = useVendas(vendedorId)
  const salvar = useSalvarLead()
  const { avisar } = useAviso()
  const navigate = useNavigate()
  const lead = leads.data?.find((l) => l.id === id)
  const hoje = hojeSP()

  const ligs = useMemo(() => (ligacoes.data ?? []).filter((l) => l.lead_id === id), [ligacoes.data, id])
  const reus = useMemo(() => (reunioes.data ?? []).filter((r) => r.lead_id === id), [reunioes.data, id])
  const vds = useMemo(() => (vendas.data ?? []).filter((v) => v.lead_id === id), [vendas.data, id])

  if (leads.isLoading) return <Carregando />
  if (!lead) return <Vazio>Lead não encontrado. <Link className="font-semibold text-verde underline" to="/leads">Voltar aos leads</Link></Vazio>

  async function alterar(dados: Partial<Lead>, msg: string) {
    try {
      await salvar.mutateAsync({ id: lead!.id, dados: dados as Lead })
      avisar(msg)
    } catch (e) {
      avisar(mensagemErro(e), 'erro')
    }
  }

  const ig = instagramUrl(lead.instagram)
  const wa = lead.whatsapp === 'sim' ? telefoneE164(lead.telefone)?.replace('+', '') : null
  const segmento = lead.segmento === 'outro' && lead.segmento_outro ? lead.segmento_outro : SEGMENTOS[lead.segmento]
  const ficha: [string, React.ReactNode][] = [
    ['Segmento', segmento],
    ['Cidade', [lead.cidade, lead.uf].filter(Boolean).join(' - ') || null],
    ['WhatsApp', wa ? <a className="font-semibold text-verde underline underline-offset-4" href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer noopener">Sim, abrir conversa</a> : WHATSAPP[lead.whatsapp]],
    ['Instagram', ig ? <a className="break-all font-semibold text-verde underline underline-offset-4" href={ig} target="_blank" rel="noreferrer noopener">{lead.instagram}</a> : null],
    ['Google Maps', lead.maps_link ? <a className="font-semibold text-verde underline underline-offset-4" href={lead.maps_link} target="_blank" rel="noreferrer noopener">Abrir no Maps</a> : null],
    ['Registro', lead.registro_numero ? `${lead.registro_tipo ?? ''} ${lead.registro_numero}`.trim() : null],
    ['Áreas', lead.areas],
    ['Estilo', lead.estilo],
    ['Ligar em', lead.retornar_em ? fmtData(lead.retornar_em) : null],
    ['Observações', lead.observacoes],
  ]

  return (
    <>
      <Cabecalho
        titulo={lead.nome}
        sub={
          <span className="flex flex-wrap gap-1.5 pt-1">
            {lead.nao_ligar && <Etiqueta tom="vermelho">Não ligar mais</Etiqueta>}
            {lead.ja_tem_site && <Etiqueta>Já tem site</Etiqueta>}
            {lead.arquivado_em && <Etiqueta>Arquivado</Etiqueta>}
          </span>
        }
        acao={podeEditar && <Link to={`/leads/${lead.id}/editar`} className="botao-secundario">Editar</Link>}
      />

      <ul className="border-t border-tinta">
        <LinhaLigacao lead={lead} feitas={ligs.length} hoje={hoje} podeEditar={podeEditar && !lead.nao_ligar} />
      </ul>

      <div className="lg:grid lg:grid-cols-2 lg:gap-10">
        <div>
          <Secao titulo="Ficha" id="s-ficha">
            <dl className="divide-y divide-fio">
              {ficha.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5">
                  <dt className="text-[0.9375rem] text-tinta-2">{k}</dt>
                  <dd className="min-w-0 whitespace-pre-line">{v || <span className="text-tinta-3">—</span>}</dd>
                </div>
              ))}
            </dl>
          </Secao>

          {podeEditar && (
            <Secao titulo="Ações" id="s-acoes">
              <div className="flex flex-wrap gap-2 pt-3">
                <Link to={`/reunioes/nova?lead=${lead.id}`} className="botao-primario">Marcar reunião</Link>
                {!lead.ja_tem_site && leadAtivo(lead) && (
                  <button type="button" className="botao-secundario" onClick={() => alterar({ ja_tem_site: true, arquivado_em: new Date().toISOString() }, 'Marcado como "já tem site" e arquivado.')}>
                    Já tem site, arquivar
                  </button>
                )}
                {lead.arquivado_em || lead.ja_tem_site ? (
                  <button type="button" className="botao-secundario" onClick={() => alterar({ arquivado_em: null, ja_tem_site: false }, 'Lead reativado.')}>
                    Desarquivar
                  </button>
                ) : (
                  <button type="button" className="botao-secundario" onClick={() => alterar({ arquivado_em: new Date().toISOString() }, 'Lead arquivado.')}>
                    Arquivar
                  </button>
                )}
                {lead.nao_ligar ? (
                  <button type="button" className="botao-secundario" onClick={() => alterar({ nao_ligar: false }, 'Lead pode receber ligações de novo.')}>
                    Voltar a ligar
                  </button>
                ) : (
                  <button type="button" className="botao-secundario !text-vermelho" onClick={() => alterar({ nao_ligar: true, retornar_em: null }, 'Marcado como "não ligar mais".')}>
                    Não ligar mais
                  </button>
                )}
                <ExcluirLead
                  lead={lead}
                  temVenda={vds.some((v) => v.status !== 'cancelada')}
                  reunioes={reus.length}
                  ligacoes={ligs.length}
                  onExcluido={() => navigate('/leads', { replace: true })}
                />
              </div>
            </Secao>
          )}
        </div>

        <div>
          <Secao titulo="Ligações" contagem={ligs.length} id="s-ligs">
            {ligs.length === 0 ? (
              <Vazio>Nenhuma ligação registrada.</Vazio>
            ) : (
              <ol>
                {ligs.map((l, i) => (
                  <li key={l.id} className="grid grid-cols-[2rem_1fr] gap-x-2 border-b border-fio py-2.5">
                    <span className="num pt-0.5 text-micro text-tinta-2">{ligs.length - i}ª</span>
                    <span>
                      <span className="flex flex-wrap justify-between gap-x-3">
                        <span className="font-medium">{RESULTADO_LIGACAO[l.resultado]}</span>
                        <span className="num text-micro text-tinta-2">{fmtDataHora(l.data_hora)}</span>
                      </span>
                      {l.observacao && <span className="block text-[0.9375rem] text-tinta-2">{l.observacao}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Secao>

          <Secao titulo="Reuniões" contagem={reus.length} id="s-reus">
            {reus.length === 0 ? (
              <Vazio>Nenhuma reunião.</Vazio>
            ) : (
              <ul>
                {reus.map((r) => (
                  <li key={r.id}>
                    <Link to={`/reunioes/${r.id}`} className="flex items-center justify-between gap-3 border-b border-fio py-2.5 hover:bg-superficie">
                      <span className="num">{fmtDataHora(r.data_hora)}</span>
                      <span className="text-right text-[0.9375rem] text-tinta-2">
                        {r.resultado ? RESULTADO_REUNIAO[r.resultado] : RASCUNHO_STATUS[r.rascunho_status]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Secao>

          {vds.length > 0 && (
            <Secao titulo="Vendas" contagem={vds.length} id="s-vds">
              <ul>
                {vds.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 border-b border-fio py-2.5">
                    <span className="num font-semibold">{fmtMoeda(v.valor_fechado ?? v.valor_combinado)}</span>
                    <span className="text-[0.9375rem] text-tinta-2">{STATUS_VENDA[v.status]}</span>
                  </li>
                ))}
              </ul>
            </Secao>
          )}
        </div>
      </div>
    </>
  )
}
