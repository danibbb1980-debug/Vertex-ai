import { useEffect, useState, type FormEvent } from 'react'
import { useConfig, useSalvarConfig } from '../../lib/api'
import { lerMoeda } from '../../lib/formato'
import { mensagemErro } from '../../lib/supabase'
import { useAviso } from '../../components/Aviso'
import { Campo, Carregando, Secao } from '../../components/ui'

export default function Config() {
  const { data: c, isLoading } = useConfig()
  const salvar = useSalvarConfig()
  const { avisar } = useAviso()
  const [pct, setPct] = useState('')
  const [meta, setMeta] = useState('')
  const [padrao, setPadrao] = useState('')
  const [piso, setPiso] = useState('')
  useEffect(() => {
    if (!c) return
    setPct(String(c.percentual_comissao).replace('.', ','))
    setMeta(c.meta_ligacoes_dia ? String(c.meta_ligacoes_dia) : '')
    setPadrao(String(c.preco_padrao).replace('.', ','))
    setPiso(String(c.preco_piso).replace('.', ','))
  }, [c])
  if (isLoading) return <Carregando />

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const p = lerMoeda(pct), pd = lerMoeda(padrao), ps = lerMoeda(piso)
    if (p === null || pd === null || ps === null) return avisar('Preencha os valores numéricos.', 'erro')
    try {
      await salvar.mutateAsync({ percentual_comissao: p, meta_ligacoes_dia: meta ? Number(meta) : null, preco_padrao: pd, preco_piso: ps })
      avisar('Configurações salvas.')
    } catch (err) { avisar(mensagemErro(err), 'erro') }
  }

  return (
    <Secao titulo="Configurações" id="s-config">
      <form onSubmit={enviar} className="flex max-w-md flex-col gap-4 pt-3">
        <Campo id="pct" rotulo="Percentual padrão de comissão (%)" ajuda="Vale para as próximas comissões. As já criadas não mudam.">
          <input id="pct" inputMode="decimal" className="campo num" value={pct} onChange={(e) => setPct(e.target.value)} />
        </Campo>
        <Campo id="meta" rotulo="Meta de ligações por dia (opcional)" ajuda="Deixe em branco para não mostrar meta.">
          <input id="meta" type="number" min={1} inputMode="numeric" className="campo num" value={meta} onChange={(e) => setMeta(e.target.value)} />
        </Campo>
        <Campo id="padrao" rotulo="Preço padrão (R$)">
          <input id="padrao" inputMode="decimal" className="campo num" value={padrao} onChange={(e) => setPadrao(e.target.value)} />
        </Campo>
        <Campo id="piso" rotulo="Piso (R$)" ajuda="O vendedor não consegue registrar venda abaixo disso.">
          <input id="piso" inputMode="decimal" className="campo num" value={piso} onChange={(e) => setPiso(e.target.value)} />
        </Campo>
        <button type="submit" className="botao-primario self-start" disabled={salvar.isPending}>Salvar configurações</button>
      </form>
    </Secao>
  )
}
