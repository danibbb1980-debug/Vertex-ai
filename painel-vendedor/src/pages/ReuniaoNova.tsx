import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAlvo } from '../auth/Alvo'
import { useLeads, useSalvarReuniao } from '../lib/api'
import { localSPparaISO } from '../lib/datas'
import { FORMATOS } from '../lib/rotulos'
import { leadAtivo } from '../lib/regras'
import { mensagemErro } from '../lib/supabase'
import type { Formato } from '../lib/types'
import { useAviso } from '../components/Aviso'
import { Cabecalho, Campo, Opcoes, Vazio } from '../components/ui'

export default function ReuniaoNova() {
  const [params] = useSearchParams()
  const { vendedorId, podeEditar } = useAlvo()
  const leads = useLeads(vendedorId)
  const [leadId, setLeadId] = useState(params.get('lead') ?? '')
  const [quando, setQuando] = useState('')
  const [formato, setFormato] = useState<Formato>('video')
  const salvar = useSalvarReuniao()
  const navigate = useNavigate()
  const { avisar } = useAviso()
  const lead = leads.data?.find((l) => l.id === leadId)

  if (!podeEditar) return <Vazio>Modo somente leitura.</Vazio>

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (!leadId) return
    try {
      const r = await salvar.mutateAsync({ dados: { lead_id: leadId, formato, data_hora: quando ? localSPparaISO(quando) : null } })
      avisar('Reunião marcada.')
      navigate(`/reunioes/${r.id}`, { replace: true })
    } catch (err) {
      avisar(mensagemErro(err), 'erro')
    }
  }

  return (
    <>
      <Cabecalho titulo="Marcar reunião" sub={lead ? lead.nome : 'Reunião de 15 minutos para mostrar o rascunho.'} />
      <form onSubmit={enviar} className="flex max-w-xl flex-col gap-4">
        {!params.get('lead') && (
          <Campo id="lead" rotulo="Lead">
            <select id="lead" className="campo" value={leadId} onChange={(e) => setLeadId(e.target.value)} required>
              <option value="">Escolha o lead</option>
              {(leads.data ?? []).filter((l) => leadAtivo(l) || l.id === leadId).map((l) => (
                <option key={l.id} value={l.id}>{l.nome}</option>
              ))}
            </select>
          </Campo>
        )}
        <Campo id="quando" rotulo="Data e hora" ajuda="Horário de Brasília. Pode deixar em branco e preencher depois, mas o pacote só fica completo com a data.">
          <input id="quando" type="datetime-local" className="campo num" value={quando} onChange={(e) => setQuando(e.target.value)} />
        </Campo>
        <Opcoes
          nome="formato"
          rotulo="Formato"
          valor={formato}
          colunas={2}
          opcoes={Object.entries(FORMATOS).map(([valor, rotulo]) => ({ valor: valor as Formato, rotulo }))}
          onChange={setFormato}
        />
        <div className="flex gap-2">
          <button type="submit" className="botao-primario !min-h-12 flex-1 lg:flex-none" disabled={!leadId || salvar.isPending}>
            {salvar.isPending ? 'Salvando…' : 'Marcar reunião'}
          </button>
          <button type="button" className="botao-secundario !min-h-12" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </>
  )
}
