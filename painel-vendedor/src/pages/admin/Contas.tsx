import { useAuth } from '../../auth/AuthProvider'
import { useProfiles, useSalvarPerfil } from '../../lib/api'
import { fmtData } from '../../lib/datas'
import { mensagemErro } from '../../lib/supabase'
import { useAviso } from '../../components/Aviso'
import { Carregando, Etiqueta, Secao } from '../../components/ui'

export default function Contas() {
  const { data: perfis = [], isLoading } = useProfiles()
  const { perfil } = useAuth()
  const salvar = useSalvarPerfil()
  const { avisar } = useAviso()

  if (isLoading) return <Carregando />
  return (
    <>
      <Secao titulo="Contas" contagem={perfis.length} id="s-contas">
        <ul>
          {perfis.map((p) => (
            <li key={p.user_id} className="flex flex-wrap items-center justify-between gap-3 border-b border-fio py-3">
              <span className="min-w-0">
                <span className="block font-semibold">{p.nome}</span>
                <span className="flex flex-wrap items-center gap-1.5 text-[0.9375rem] text-tinta-2">
                  {p.papel === 'admin' ? 'Admin' : 'Vendedor'}, desde {fmtData(p.created_at)}
                  {p.ativo ? <Etiqueta tom="verde">Ativa</Etiqueta> : <Etiqueta tom="vermelho">Desativada</Etiqueta>}
                </span>
              </span>
              {p.user_id !== perfil?.user_id && (
                <button
                  type="button"
                  className={p.ativo ? 'botao-secundario !text-vermelho' : 'botao-primario'}
                  disabled={salvar.isPending}
                  onClick={async () => {
                    if (p.ativo && !window.confirm(`Desativar ${p.nome}? A pessoa perde todo o acesso na hora.`)) return
                    try {
                      await salvar.mutateAsync({ id: p.user_id, dados: { ativo: !p.ativo } })
                      avisar(p.ativo ? `${p.nome} desativado.` : `${p.nome} ativado.`)
                    } catch (e) { avisar(mensagemErro(e), 'erro') }
                  }}
                >
                  {p.ativo ? 'Desativar' : 'Ativar'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </Secao>
      <Secao titulo="Como criar um vendedor" id="s-criar">
        <ol className="list-decimal space-y-1.5 pl-5 pt-3 text-[0.9375rem]">
          <li>No painel do Supabase, abra Authentication, Users, Add user, Create new user.</li>
          <li>Informe o e-mail e uma senha, marque "Auto Confirm User" e crie.</li>
          <li>A conta aparece aqui como vendedor desativado. Toque em "Ativar".</li>
          <li>Para mudar o nome exibido, edite a coluna <code>nome</code> na tabela <code>profiles</code>.</li>
        </ol>
      </Secao>
    </>
  )
}
