import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfiles, useSalvarReuniao, useTodasReunioes, useTodosLeads } from '../../lib/api'
import { fmtDataHora } from '../../lib/datas'
import { FORMATOS, RASCUNHO_STATUS, SEGMENTOS } from '../../lib/rotulos'
import { mensagemErro } from '../../lib/supabase'
import type { RascunhoStatus, Reuniao } from '../../lib/types'
import { useAviso } from '../../components/Aviso'
import { Carregando, Erro, Etiqueta, Secao, Vazio } from '../../components/ui'
import { useAlvo } from '../../auth/Alvo'

export default function Fila() {
  const reunioes = useTodasReunioes(true)
  const leads = useTodosLeads(true)
  const { data: perfis = [] } = useProfiles()
  const porLead = useMemo(() => new Map((leads.data ?? []).map((l) => [l.id, l])), [leads.data])
  const nomes = useMemo(() => new Map(perfis.map((p) => [p.user_id, p.nome])), [perfis])

  const fila = useMemo(
    () =>
      (reunioes.data ?? [])
        .filter((r) => r.pacote_completo && !r.resultado && (r.rascunho_status === 'aguardando_pacote' || r.rascunho_status === 'em_producao'))
        .sort((a, b) => (a.data_hora ?? '9').localeCompare(b.data_hora ?? '9')),
    [reunioes.data],
  )
  const incompletas = (reunioes.data ?? []).filter((r) => !r.pacote_completo && !r.resultado).length

  return (
    <Secao titulo="Rascunhos a produzir" contagem={fila.length} id="s-fila">
      <p className="pt-2 text-[0.9375rem] text-tinta-2">
        Reuniões com pacote completo, em ordem de data. {incompletas > 0 && <>Outras <span className="num">{incompletas}</span> ainda esperam o pacote do vendedor.</>}
      </p>
      {reunioes.error && <Erro erro={reunioes.error} />}
      {reunioes.isLoading ? <Carregando /> : fila.length === 0 ? <Vazio>Nada na fila.</Vazio> : (
        <ul>
          {fila.map((r) => {
            const l = porLead.get(r.lead_id)
            return <ItemFila key={r.id} r={r} lead={l?.nome ?? 'Lead'} seg={l ? SEGMENTOS[l.segmento] : ''} vendedor={nomes.get(r.vendedor_id) ?? ''} />
          })}
        </ul>
      )}
    </Secao>
  )
}

function ItemFila({ r, lead, seg, vendedor }: { r: Reuniao; lead: string; seg: string; vendedor: string }) {
  const [status, setStatus] = useState<RascunhoStatus>(r.rascunho_status)
  const [link, setLink] = useState(r.rascunho_link ?? '')
  const salvar = useSalvarReuniao()
  const { avisar } = useAviso()
  const { setVendedorId } = useAlvo()
  const mudou = status !== r.rascunho_status || link.trim() !== (r.rascunho_link ?? '')
  return (
    <li className="border-b border-fio py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <Link to={`/reunioes/${r.id}`} onClick={() => setVendedorId(r.vendedor_id)} className="font-semibold underline-offset-4 hover:underline">{lead}</Link>
        <span className="num text-[0.9375rem]">{fmtDataHora(r.data_hora)}</span>
      </div>
      <p className="text-[0.9375rem] text-tinta-2">{seg}, {FORMATOS[r.formato].toLowerCase()}, vendedor {vendedor} <Etiqueta>{RASCUNHO_STATUS[r.rascunho_status]}</Etiqueta></p>
      <div className="mt-2 grid gap-2 sm:grid-cols-[11rem_1fr_auto]">
        <label className="sr-only" htmlFor={`st-${r.id}`}>Status do rascunho</label>
        <select id={`st-${r.id}`} className="campo" value={status} onChange={(e) => setStatus(e.target.value as RascunhoStatus)}>
          {Object.entries(RASCUNHO_STATUS).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        <label className="sr-only" htmlFor={`lk-${r.id}`}>Link do rascunho</label>
        <input id={`lk-${r.id}`} type="url" className="campo" placeholder="Link do rascunho" value={link} onChange={(e) => setLink(e.target.value)} />
        <button type="button" className="botao-primario" disabled={!mudou || salvar.isPending}
          onClick={async () => {
            try {
              await salvar.mutateAsync({ id: r.id, dados: { rascunho_status: status, rascunho_link: link.trim() || null } })
              avisar('Rascunho atualizado.')
            } catch (e) { avisar(mensagemErro(e), 'erro') }
          }}>
          Salvar
        </button>
      </div>
    </li>
  )
}
