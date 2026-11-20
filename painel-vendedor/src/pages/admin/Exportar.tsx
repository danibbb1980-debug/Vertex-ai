import { useState } from 'react'
import { useProfiles } from '../../lib/api'
import { baixar, paraCSV } from '../../lib/csv'
import { hojeSP } from '../../lib/datas'
import { mensagemErro, supabase } from '../../lib/supabase'
import { useAviso } from '../../components/Aviso'
import { Campo, Secao } from '../../components/ui'

const TABELAS = [
  { tabela: 'leads', rotulo: 'Leads' },
  { tabela: 'ligacoes', rotulo: 'Ligações' },
  { tabela: 'reunioes', rotulo: 'Reuniões' },
  { tabela: 'vendas', rotulo: 'Vendas' },
  { tabela: 'comissoes', rotulo: 'Comissões' },
] as const

export default function Exportar() {
  const { data: perfis = [] } = useProfiles()
  const vendedores = perfis.filter((p) => p.papel === 'vendedor')
  const [vid, setVid] = useState('')
  const [baixando, setBaixando] = useState<string | null>(null)
  const { avisar } = useAviso()
  const alvo = vid || vendedores[0]?.user_id || ''
  const nome = vendedores.find((v) => v.user_id === alvo)?.nome ?? 'vendedor'
  const slug = nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-')

  async function exportar(tabela: (typeof TABELAS)[number]['tabela']) {
    setBaixando(tabela)
    try {
      // inclui as linhas com deleted_at (o admin enxerga tudo)
      const { data, error } = await supabase.from(tabela).select('*').eq('vendedor_id', alvo)
      if (error) throw error
      baixar(`${slug}-${tabela}-${hojeSP()}.csv`, paraCSV((data ?? []) as Record<string, unknown>[]))
    } catch (e) {
      avisar(mensagemErro(e), 'erro')
    } finally {
      setBaixando(null)
    }
  }

  return (
    <Secao titulo="Exportar dados de um vendedor" id="s-exp">
      <div className="flex max-w-md flex-col gap-4 pt-3">
        <Campo id="exp-v" rotulo="Vendedor">
          <select id="exp-v" className="campo" value={alvo} onChange={(e) => setVid(e.target.value)}>
            {vendedores.map((v) => <option key={v.user_id} value={v.user_id}>{v.nome}{v.ativo ? '' : ' (desativado)'}</option>)}
          </select>
        </Campo>
        <div className="flex flex-wrap gap-2">
          {TABELAS.map((t) => (
            <button key={t.tabela} type="button" className="botao-secundario" disabled={!alvo || !!baixando} onClick={() => exportar(t.tabela)}>
              {baixando === t.tabela ? 'Gerando…' : `${t.rotulo} (.csv)`}
            </button>
          ))}
        </div>
        <p className="text-[0.9375rem] text-tinta-2">
          Arquivos com separador ";" que abrem direto no Excel. Para encerrar o acordo: exporte tudo, desative a conta em Contas e,
          se for preciso apagar os dados pessoais, siga a seção "Apagar os dados de um vendedor" do README.
        </p>
      </div>
    </Secao>
  )
}
