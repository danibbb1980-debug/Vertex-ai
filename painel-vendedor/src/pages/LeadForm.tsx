import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAlvo } from '../auth/Alvo'
import { useLeads, useSalvarLead, type NovoLead } from '../lib/api'
import { hojeSP } from '../lib/datas'
import { SEGMENTOS, WHATSAPP } from '../lib/rotulos'
import { registroExigido } from '../lib/regras'
import { mensagemErro } from '../lib/supabase'
import type { Lead, RegistroTipo, Segmento, Whatsapp } from '../lib/types'
import { useAviso } from '../components/Aviso'
import { Cabecalho, Campo, Carregando, Opcoes, Vazio } from '../components/ui'

type Form = {
  nome: string
  segmento: Segmento | null
  segmento_outro: string
  cidade: string
  uf: string
  telefone: string
  whatsapp: Whatsapp
  instagram: string
  maps_link: string
  registro_tipo: RegistroTipo | ''
  registro_numero: string
  areas: string
  estilo: string
  retornar_em: string
  observacoes: string
}

const vazio = (): Form => ({
  nome: '', segmento: null, segmento_outro: '', cidade: 'Poços de Caldas', uf: 'MG', telefone: '',
  whatsapp: 'nao_sei', instagram: '', maps_link: '', registro_tipo: '', registro_numero: '',
  areas: '', estilo: '', retornar_em: hojeSP(), observacoes: '',
})

const deLead = (l: Lead): Form => ({
  nome: l.nome, segmento: l.segmento, segmento_outro: l.segmento_outro ?? '', cidade: l.cidade ?? '', uf: l.uf ?? '',
  telefone: l.telefone ?? '', whatsapp: l.whatsapp, instagram: l.instagram ?? '', maps_link: l.maps_link ?? '',
  registro_tipo: l.registro_tipo ?? '', registro_numero: l.registro_numero ?? '', areas: l.areas ?? '',
  estilo: l.estilo ?? '', retornar_em: l.retornar_em ?? '', observacoes: l.observacoes ?? '',
})

const nulo = (s: string) => (s.trim() ? s.trim() : null)

export default function LeadForm() {
  const { id } = useParams()
  const { vendedorId, podeEditar } = useAlvo()
  const leads = useLeads(vendedorId)
  const existente = id ? leads.data?.find((l) => l.id === id) : undefined
  if (id && leads.isLoading) return <Carregando />
  if (id && !existente) return <Vazio>Lead não encontrado.</Vazio>
  if (!podeEditar) return <Vazio>Modo somente leitura. Toque em "Editar" no topo para alterar.</Vazio>
  return <Formulario key={id ?? 'novo'} existente={existente} todos={leads.data ?? []} vendedorId={vendedorId!} />
}

function Formulario({ existente, todos, vendedorId }: { existente?: Lead; todos: Lead[]; vendedorId: string }) {
  const [f, setF] = useState<Form>(() => (existente ? deLead(existente) : vazio()))
  const [tentouSalvar, setTentouSalvar] = useState(false)
  const salvar = useSalvarLead()
  const navigate = useNavigate()
  const { avisar } = useAviso()
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }))

  const duplicado = useMemo(() => {
    const d = f.telefone.replace(/\D/g, '')
    if (d.length < 8) return null
    return todos.find((l) => l.id !== existente?.id && (l.telefone ?? '').replace(/\D/g, '').endsWith(d.slice(-8))) ?? null
  }, [f.telefone, todos, existente])

  const erroNome = tentouSalvar && !f.nome.trim() ? 'Informe o nome do profissional ou do negócio.' : null
  const erroSeg = tentouSalvar && !f.segmento ? 'Escolha o segmento.' : null
  const erroOutro = tentouSalvar && f.segmento === 'outro' && !f.segmento_outro.trim() ? 'Diga qual é o segmento.' : null
  const reg = f.segmento ? registroExigido(f.segmento) : null

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setTentouSalvar(true)
    if (!f.nome.trim() || !f.segmento || (f.segmento === 'outro' && !f.segmento_outro.trim())) return
    const dados: NovoLead = {
      nome: f.nome.trim(),
      segmento: f.segmento,
      segmento_outro: f.segmento === 'outro' ? nulo(f.segmento_outro) : null,
      cidade: nulo(f.cidade),
      uf: nulo(f.uf.toUpperCase().slice(0, 2)),
      telefone: nulo(f.telefone),
      whatsapp: f.whatsapp,
      instagram: nulo(f.instagram),
      maps_link: nulo(f.maps_link),
      registro_tipo: f.registro_tipo || (reg && f.registro_numero.trim() ? reg : null),
      registro_numero: nulo(f.registro_numero),
      areas: nulo(f.areas),
      estilo: nulo(f.estilo),
      retornar_em: f.retornar_em || null,
      observacoes: nulo(f.observacoes),
    }
    if (!existente) dados.vendedor_id = vendedorId
    try {
      const l = await salvar.mutateAsync({ id: existente?.id, dados })
      avisar(existente ? 'Lead salvo.' : 'Lead cadastrado.')
      navigate(`/leads/${l.id}`, { replace: true })
    } catch (err) {
      avisar(mensagemErro(err), 'erro')
    }
  }

  return (
    <>
      <Cabecalho titulo={existente ? 'Editar lead' : 'Novo lead'} sub={existente ? existente.nome : 'Só nome e segmento são obrigatórios.'} />
      <form onSubmit={enviar} noValidate className="flex max-w-xl flex-col gap-4">
        <Campo id="nome" rotulo="Nome do profissional ou negócio" erro={erroNome}>
          <input id="nome" className="campo" value={f.nome} onChange={(e) => set('nome', e.target.value)} autoComplete="off" aria-invalid={!!erroNome} aria-describedby={erroNome ? 'nome-erro' : undefined} autoFocus={!existente} />
        </Campo>

        <div>
          <Opcoes
            nome="segmento"
            rotulo="Segmento"
            valor={f.segmento}
            colunas={2}
            opcoes={Object.entries(SEGMENTOS).map(([valor, rotulo]) => ({ valor: valor as Segmento, rotulo }))}
            onChange={(v) => set('segmento', v)}
          />
          {erroSeg && <p className="mt-1 text-micro font-medium text-vermelho">{erroSeg}</p>}
        </div>
        {f.segmento === 'outro' && (
          <Campo id="seg-outro" rotulo="Qual segmento?" erro={erroOutro}>
            <input id="seg-outro" className="campo" value={f.segmento_outro} onChange={(e) => set('segmento_outro', e.target.value)} placeholder="Ex.: fisioterapia, pet shop" />
          </Campo>
        )}

        <Campo id="tel" rotulo="Telefone" ajuda={duplicado ? undefined : 'Com DDD.'}>
          <input id="tel" type="tel" inputMode="tel" autoComplete="off" className="campo num" value={f.telefone} onChange={(e) => set('telefone', e.target.value)} placeholder="(35) 9 9999-9999" />
        </Campo>
        {duplicado && (
          <p className="-mt-2 rounded-md bg-ambar-fundo px-3 py-2 text-[0.9375rem] text-ambar">
            Telefone parecido com o de <strong>{duplicado.nome}</strong>. Confira se não é o mesmo lead.
          </p>
        )}

        <div className="grid grid-cols-[1fr_5rem] gap-2">
          <Campo id="cidade" rotulo="Cidade">
            <input id="cidade" className="campo" value={f.cidade} onChange={(e) => set('cidade', e.target.value)} />
          </Campo>
          <Campo id="uf" rotulo="UF">
            <input id="uf" className="campo uppercase" maxLength={2} value={f.uf} onChange={(e) => set('uf', e.target.value)} />
          </Campo>
        </div>

        <details open={!!existente || undefined} className="group rounded-md border border-fio bg-superficie px-3">
          <summary className="flex min-h-12 items-center justify-between font-semibold marker:content-none">
            Mais detalhes (para o pacote do rascunho)
            <span aria-hidden="true" className="text-tinta-2 transition-transform group-open:rotate-180">▾</span>
          </summary>
          <div className="flex flex-col gap-4 pb-4">
            <Opcoes
              nome="whatsapp"
              rotulo="O telefone tem WhatsApp?"
              valor={f.whatsapp}
              colunas={3}
              opcoes={Object.entries(WHATSAPP).map(([valor, rotulo]) => ({ valor: valor as Whatsapp, rotulo }))}
              onChange={(v) => set('whatsapp', v)}
            />
            <Campo id="ig" rotulo="Instagram">
              <input id="ig" className="campo" value={f.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="@perfil" autoCapitalize="off" />
            </Campo>
            <Campo id="maps" rotulo="Link do Google Maps">
              <input id="maps" type="url" inputMode="url" className="campo" value={f.maps_link} onChange={(e) => set('maps_link', e.target.value)} placeholder="https://maps.app.goo.gl/…" autoCapitalize="off" />
            </Campo>
            <div className="grid grid-cols-[7rem_1fr] gap-2">
              <Campo id="reg-tipo" rotulo="Registro">
                <select id="reg-tipo" className="campo" value={f.registro_tipo || reg || ''} onChange={(e) => set('registro_tipo', e.target.value as RegistroTipo | '')}>
                  <option value="">—</option>
                  <option value="CRO">CRO</option>
                  <option value="OAB">OAB</option>
                  <option value="outro">Outro</option>
                </select>
              </Campo>
              <Campo id="reg-num" rotulo={reg ? `Número (${reg} obrigatório no pacote)` : 'Número (opcional)'}>
                <input id="reg-num" className="campo" value={f.registro_numero} onChange={(e) => set('registro_numero', e.target.value)} />
              </Campo>
            </div>
            <Campo id="areas" rotulo="Áreas ou atendimentos citados">
              <textarea id="areas" rows={2} className="campo" value={f.areas} onChange={(e) => set('areas', e.target.value)} placeholder="Ex.: implante, clareamento, ortodontia" />
            </Campo>
            <Campo id="estilo" rotulo="Cor ou estilo preferido (opcional)">
              <input id="estilo" className="campo" value={f.estilo} onChange={(e) => set('estilo', e.target.value)} />
            </Campo>
            <Campo id="retorno" rotulo="Ligar em" ajuda="Aparece na lista Hoje a partir desta data.">
              <input id="retorno" type="date" className="campo num" value={f.retornar_em} onChange={(e) => set('retornar_em', e.target.value)} />
            </Campo>
            <Campo id="obs" rotulo="Observações">
              <textarea id="obs" rows={3} className="campo" value={f.observacoes} onChange={(e) => set('observacoes', e.target.value)} />
            </Campo>
          </div>
        </details>

        <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] -mx-4 flex gap-2 border-t border-fio bg-papel px-4 py-3 lg:static lg:mx-0 lg:border-0 lg:px-0">
          <button type="submit" className="botao-primario flex-1 !min-h-12 lg:flex-none" disabled={salvar.isPending}>
            {salvar.isPending ? 'Salvando…' : existente ? 'Salvar lead' : 'Cadastrar lead'}
          </button>
          <button type="button" className="botao-secundario !min-h-12" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  )
}
