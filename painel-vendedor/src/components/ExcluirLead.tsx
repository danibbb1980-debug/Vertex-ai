import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useExcluirLead } from '../lib/api'
import { mensagemErro } from '../lib/supabase'
import type { Lead } from '../lib/types'
import { useAviso } from './Aviso'
import Dialogo from './Dialogo'
import { Faixa } from './ui'

/**
 * Botão "Excluir lead" com confirmação. O lead some das listas junto com
 * as reuniões e ligações dele (fica guardado no banco e na exportação).
 * Vendedor não exclui lead com venda em aberto ou paga.
 */
export default function ExcluirLead({
  lead, temVenda, reunioes = 0, ligacoes = 0, compacto = false, onExcluido,
}: {
  lead: Pick<Lead, 'id' | 'nome'>
  temVenda: boolean
  reunioes?: number
  ligacoes?: number
  compacto?: boolean
  onExcluido?: () => void
}) {
  const { isAdmin } = useAuth()
  const [aberto, setAberto] = useState(false)
  const excluir = useExcluirLead()
  const { avisar } = useAviso()
  const bloqueado = temVenda && !isAdmin

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className={compacto ? 'botao-texto !min-h-11 !px-2 text-[0.9375rem] !font-medium !text-tinta-2 hover:!text-vermelho' : 'botao-secundario !text-vermelho'}
        aria-label={compacto ? `Excluir o lead ${lead.nome}` : undefined}
      >
        Excluir{compacto ? '' : ' lead'}
      </button>
      {aberto && (
        <Dialogo aberto onFechar={() => setAberto(false)} titulo="Excluir lead?">
          <p>
            <strong>{lead.nome}</strong>
          </p>
          {bloqueado ? (
            <div className="mt-3">
              <Faixa>Este lead tem venda registrada, por isso só o Pedro pode excluí-lo. Se quiser tirá-lo da lista, use "Arquivar".</Faixa>
            </div>
          ) : (
            <>
              <p className="mt-2 text-[0.9375rem] text-tinta-2">
                Ele some das listas
                {reunioes + ligacoes > 0 && (
                  <>
                    {' '}junto com {reunioes > 0 && `${reunioes} ${reunioes === 1 ? 'reunião' : 'reuniões'}`}
                    {reunioes > 0 && ligacoes > 0 && ' e '}
                    {ligacoes > 0 && `${ligacoes} ${ligacoes === 1 ? 'ligação' : 'ligações'}`}
                  </>
                )}
                . Não dá para desfazer pelo app.
              </p>
              {temVenda && isAdmin && (
                <div className="mt-3">
                  <Faixa>Este lead tem venda. A venda e a comissão continuam em Admin &gt; Vendas.</Faixa>
                </div>
              )}
            </>
          )}
          <div className="mt-4 flex gap-2">
            {!bloqueado && (
              <button
                type="button"
                className="botao !min-h-12 flex-1 bg-vermelho text-white sm:flex-none"
                disabled={excluir.isPending}
                onClick={async () => {
                  try {
                    await excluir.mutateAsync(lead.id)
                    avisar('Lead excluído.')
                    setAberto(false)
                    onExcluido?.()
                  } catch (e) {
                    avisar(mensagemErro(e), 'erro')
                  }
                }}
              >
                {excluir.isPending ? 'Excluindo…' : 'Excluir lead'}
              </button>
            )}
            <button type="button" className="botao-secundario !min-h-12" onClick={() => setAberto(false)}>
              {bloqueado ? 'Entendi' : 'Cancelar'}
            </button>
          </div>
        </Dialogo>
      )}
    </>
  )
}
