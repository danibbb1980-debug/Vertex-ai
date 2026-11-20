import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegistrarLigacao } from '../lib/api'
import { fmtDataCurta, hojeSP, proximoDiaUtil, somarDias } from '../lib/datas'
import { RESULTADOS_LIGACAO } from '../lib/rotulos'
import { proximoRetorno, statusTentativas } from '../lib/regras'
import { mensagemErro } from '../lib/supabase'
import type { Lead, ResultadoLigacao } from '../lib/types'
import { useAviso } from './Aviso'
import { Faixa } from './ui'

interface Props {
  lead: Lead
  feitas: number
  aberto: boolean
  onFechar: () => void
}

/**
 * Painel que abre junto com o discador: um toque registra o resultado.
 * Só "Retornar depois" pede um segundo toque (a data).
 */
export default function RegistrarLigacao({ lead, feitas, aberto, onFechar }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const tituloId = useId()
  const [obs, setObs] = useState('')
  const [pedindoData, setPedindoData] = useState(false)
  const [dataCustom, setDataCustom] = useState('')
  const registrar = useRegistrarLigacao()
  const { avisar } = useAviso()
  const navigate = useNavigate()
  const st = statusTentativas(feitas)
  const hoje = hojeSP()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (aberto && !d.open) {
      setObs('')
      setPedindoData(false)
      setDataCustom('')
      d.showModal()
    } else if (!aberto && d.open) d.close()
  }, [aberto])

  async function salvar(resultado: ResultadoLigacao, data?: string) {
    const retornar_em = proximoRetorno(resultado, hoje, feitas + 1, data)
    try {
      await registrar.mutateAsync({
        lead_id: lead.id,
        resultado,
        observacao: obs.trim() || null,
        retornar_em,
      })
      const rotulo = RESULTADOS_LIGACAO.find((r) => r.valor === resultado)!.rotulo
      const saiu = (resultado === 'nao_atendeu' || resultado === 'recepcao') && !retornar_em
      avisar(retornar_em ? `${rotulo}. Retorno em ${fmtDataCurta(retornar_em)}.` : saiu ? `${rotulo}. Duas tentativas feitas: o lead saiu da lista.` : `${rotulo}. Registrado.`)
      onFechar()
      if (resultado === 'reuniao_marcada') navigate(`/reunioes/nova?lead=${lead.id}`)
    } catch (e) {
      avisar(mensagemErro(e), 'erro')
    }
  }

  const opcoesData = [
    { rotulo: 'Amanhã', valor: somarDias(hoje, 1) },
    { rotulo: 'Em 2 dias úteis', valor: proximoDiaUtil(hoje, 2) },
    { rotulo: 'Em 1 semana', valor: somarDias(hoje, 7) },
  ]

  return (
    <dialog
      ref={ref}
      aria-labelledby={tituloId}
      onClose={onFechar}
      onClick={(e) => e.target === ref.current && onFechar()}
      className="m-0 mt-auto w-full max-w-none bg-transparent p-0 backdrop:bg-tinta/40 sm:m-auto sm:max-w-md"
    >
      <div className="anima-subir rounded-t-xl border-t border-fio bg-papel px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:rounded-xl sm:border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-micro text-tinta-2">Resultado da {st.proxima}ª tentativa</p>
            <h2 id={tituloId} className="truncate text-[1.25rem] font-bold leading-snug">
              {lead.nome}
            </h2>
          </div>
          <button type="button" onClick={onFechar} className="botao-texto -mr-1 shrink-0 text-tinta-2">
            Fechar
          </button>
        </div>

        {st.aviso && (
          <div className="mt-3">
            <Faixa>{st.aviso}</Faixa>
          </div>
        )}

        <label htmlFor={`${tituloId}-obs`} className="mt-4 block text-[0.9375rem] font-medium">
          Observação <span className="font-normal text-tinta-2">(opcional)</span>
        </label>
        <input
          id={`${tituloId}-obs`}
          className="campo mt-1"
          value={obs}
          maxLength={500}
          onChange={(e) => setObs(e.target.value)}
          placeholder="Ex.: falar com a Dra. depois das 14h"
          autoComplete="off"
        />

        {!pedindoData ? (
          <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Resultado da ligação">
            {RESULTADOS_LIGACAO.map((r) => (
              <button
                key={r.valor}
                type="button"
                disabled={registrar.isPending}
                onClick={() => (r.valor === 'retornar_depois' ? setPedindoData(true) : salvar(r.valor))}
                className={`botao !min-h-14 text-base ${
                  r.valor === 'reuniao_marcada'
                    ? 'bg-verde text-white hover:bg-verde-escuro'
                    : r.valor === 'nao_ligar_mais'
                      ? 'border border-vermelho/40 bg-superficie text-vermelho'
                      : 'border border-fio-forte bg-superficie text-tinta hover:border-tinta-2'
                }`}
              >
                {r.rotulo}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-[0.9375rem] font-medium">Retornar quando?</p>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {opcoesData.map((o) => (
                <button
                  key={o.rotulo}
                  type="button"
                  disabled={registrar.isPending}
                  onClick={() => salvar('retornar_depois', o.valor)}
                  className="botao-secundario !min-h-14 !px-2 flex-col !gap-0 text-[0.9375rem]"
                >
                  {o.rotulo}
                  <span className="num text-micro font-normal text-tinta-2">{fmtDataCurta(o.valor)}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <label htmlFor={`${tituloId}-data`} className="sr-only">
                Outra data
              </label>
              <input
                id={`${tituloId}-data`}
                type="date"
                className="campo"
                min={somarDias(hoje, 1)}
                value={dataCustom}
                onChange={(e) => setDataCustom(e.target.value)}
              />
              <button
                type="button"
                className="botao-primario"
                disabled={!dataCustom || registrar.isPending}
                onClick={() => salvar('retornar_depois', dataCustom)}
              >
                Salvar
              </button>
            </div>
            <button type="button" className="botao-texto mt-1" onClick={() => setPedindoData(false)}>
              Voltar aos resultados
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}
