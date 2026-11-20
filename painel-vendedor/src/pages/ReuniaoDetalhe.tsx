import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAlvo } from '../auth/Alvo'
import { useConfig, useLeads, useReunioes, useSalvarReuniao, useSalvarVenda, useVendas } from '../lib/api'
import { fmtDataHora, isoParaLocalSP, localSPparaISO } from '../lib/datas'
import { fmtMoeda, lerMoeda } from '../lib/formato'
import {
  FORMA_PAGAMENTO, FORMATOS, RASCUNHO_STATUS, RESULTADO_REUNIAO, SEGMENTOS, STATUS_VENDA, WHATSAPP,
} from '../lib/rotulos'
import { checklistPacote, textoPacote } from '../lib/regras'
import { mensagemErro } from '../lib/supabase'
import type { FormaPagamento, Formato, Lead, RascunhoStatus, Reuniao, ResultadoReuniao } from '../lib/types'
import { useAviso } from '../components/Aviso'
import { Cabecalho, Campo, Carregando, Etiqueta, Faixa, Opcoes, Secao, Vazio } from '../components/ui'

async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    const t = document.createElement('textarea')
    t.value = texto
    t.setAttribute('readonly', '')
    t.style.position = 'fixed'
    t.style.opacity = '0'
    document.body.appendChild(t)
    t.select()
    const ok = document.execCommand('copy')
    t.remove()
    return ok
  }
}

export default function ReuniaoDetalhe() {
  const { id } = useParams()
  const { vendedorId } = useAlvo()
  const reunioes = useReunioes(vendedorId)
  const leads = useLeads(vendedorId)
  const r = reunioes.data?.find((x) => x.id === id)
  const lead = r ? leads.data?.find((l) => l.id === r.lead_id) : undefined
  if (reunioes.isLoading || leads.isLoading) return <Carregando />
  if (!r || !lead) return <Vazio>Reunião não encontrada. <Link to="/reunioes" className="font-semibold text-verde underline">Voltar</Link></Vazio>
  return <Detalhe key={r.id} r={r} lead={lead} />
}

function Detalhe({ r, lead }: { r: Reuniao; lead: Lead }) {
  const { podeEditar, podeEditarAdmin, vendedorId } = useAlvo()
  const salvar = useSalvarReuniao()
  const { avisar } = useAviso()
  const navigate = useNavigate()
  const itens = checklistPacote(lead, r)
  const faltando = itens.filter((i) => !i.ok)
  const segmento = lead.segmento === 'outro' && lead.segmento_outro ? lead.segmento_outro : SEGMENTOS[lead.segmento]

  const texto = textoPacote(lead, r, {
    segmento,
    dataHora: fmtDataHora(r.data_hora),
    formato: FORMATOS[r.formato],
    whatsapp: WHATSAPP[lead.whatsapp],
  })

  async function atualizar(dados: Partial<Reuniao>, msg: string) {
    try {
      await salvar.mutateAsync({ id: r.id, dados })
      avisar(msg)
      return true
    } catch (e) {
      avisar(mensagemErro(e), 'erro')
      return false
    }
  }

  // ---- data, hora e formato
  const [quando, setQuando] = useState(isoParaLocalSP(r.data_hora))
  const [formato, setFormato] = useState<Formato>(r.formato)
  const agendaMudou = quando !== isoParaLocalSP(r.data_hora) || formato !== r.formato

  // ---- rascunho (admin)
  const [rStatus, setRStatus] = useState<RascunhoStatus>(r.rascunho_status)
  const [rLink, setRLink] = useState(r.rascunho_link ?? '')
  const rascunhoMudou = rStatus !== r.rascunho_status || rLink.trim() !== (r.rascunho_link ?? '')

  // ---- resultado
  const [resultado, setResultado] = useState<ResultadoReuniao | null>(r.resultado)
  const [motivo, setMotivo] = useState(r.motivo_perda ?? '')
  const [novaData, setNovaData] = useState('')

  async function salvarResultado() {
    if (!resultado) return
    const ok = await atualizar(
      { resultado, motivo_perda: resultado === 'fechou' ? null : motivo.trim() || null },
      'Resultado registrado.',
    )
    if (ok && resultado === 'remarcou' && novaData) {
      try {
        const nova = await salvar.mutateAsync({ dados: { lead_id: r.lead_id, formato: r.formato, data_hora: localSPparaISO(novaData) } })
        avisar('Nova reunião marcada.')
        navigate(`/reunioes/${nova.id}`)
      } catch (e) {
        avisar(mensagemErro(e), 'erro')
      }
    }
  }

  return (
    <>
      <Cabecalho
        titulo={lead.nome}
        sub={
          <>
            Reunião {r.data_hora ? <span className="num">{fmtDataHora(r.data_hora)}</span> : 'sem data'}, {FORMATOS[r.formato].toLowerCase()}.{' '}
            <Link to={`/leads/${lead.id}`} className="font-semibold text-verde underline underline-offset-4">Ver lead</Link>
          </>
        }
      />

      <div className="lg:grid lg:grid-cols-2 lg:gap-10">
        <div>
          <Secao
            titulo="Pacote para o rascunho"
            id="s-pacote"
            acao={faltando.length === 0 ? <Etiqueta tom="verde">Completo</Etiqueta> : <Etiqueta tom="ambar">Faltam {faltando.length}</Etiqueta>}
          >
            {faltando.length > 0 && (
              <div className="mt-3">
                <Faixa>
                  <p className="font-semibold">Falta: {faltando.map((f) => f.rotulo).join(', ')}</p>
                  <p className="mt-0.5">O Pedro só começa o rascunho com o pacote completo.</p>
                  {podeEditar && (
                    <Link to={`/leads/${lead.id}/editar`} className="mt-1 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                      Completar no lead
                    </Link>
                  )}
                </Faixa>
              </div>
            )}
            <ul className="mt-1">
              {itens.map((i) => (
                <li key={i.campo} className={`flex items-center gap-3 border-b border-fio py-2 ${i.ok ? '' : 'font-semibold text-ambar'}`}>
                  <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-full text-[0.75rem] ${i.ok ? 'bg-verde text-white' : 'border-2 border-ambar'}`}>
                    {i.ok ? '✓' : ''}
                  </span>
                  <span className="flex-1">{i.rotulo}</span>
                  <span className="text-micro">{i.ok ? <span className="sr-only">preenchido</span> : 'falta'}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="botao-primario !min-h-12"
                onClick={async () => avisar((await copiar(texto)) ? 'Pacote copiado. Cole no WhatsApp do Pedro.' : 'Não foi possível copiar.', 'ok')}
              >
                Copiar pacote para o Pedro
              </button>
            </div>
            <details className="mt-2">
              <summary className="botao-texto">Ver o texto que será copiado</summary>
              <pre className="mt-1 whitespace-pre-wrap rounded-md border border-fio bg-superficie p-3 font-sans text-[0.9375rem]">{texto}</pre>
            </details>
          </Secao>

          <Secao titulo="Rascunho" id="s-rascunho" acao={<Etiqueta tom={r.rascunho_status === 'pronto' || r.rascunho_status === 'enviado' ? 'verde' : 'neutro'}>{RASCUNHO_STATUS[r.rascunho_status]}</Etiqueta>}>
            {podeEditarAdmin ? (
              <div className="flex flex-col gap-3 pt-3">
                <Campo id="r-status" rotulo="Status do rascunho (admin)">
                  <select id="r-status" className="campo" value={rStatus} onChange={(e) => setRStatus(e.target.value as RascunhoStatus)}>
                    {Object.entries(RASCUNHO_STATUS).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                  </select>
                </Campo>
                <Campo id="r-link" rotulo="Link do rascunho (admin)">
                  <input id="r-link" type="url" className="campo" value={rLink} onChange={(e) => setRLink(e.target.value)} placeholder="https://" />
                </Campo>
                <button type="button" className="botao-primario self-start" disabled={!rascunhoMudou || salvar.isPending}
                  onClick={() => atualizar({ rascunho_status: rStatus, rascunho_link: rLink.trim() || null }, 'Rascunho atualizado.')}>
                  Salvar rascunho
                </button>
              </div>
            ) : r.rascunho_link ? (
              <p className="pt-3">
                <a href={r.rascunho_link} target="_blank" rel="noreferrer noopener" className="botao-secundario">Abrir o rascunho</a>
              </p>
            ) : (
              <Vazio>O link aparece aqui quando o Pedro terminar o rascunho.</Vazio>
            )}
          </Secao>
        </div>

        <div>
          {podeEditar && !r.resultado && (
            <Secao titulo="Data e formato" id="s-agenda">
              <div className="flex flex-col gap-3 pt-3">
                <Campo id="quando" rotulo="Data e hora (horário de Brasília)">
                  <input id="quando" type="datetime-local" className="campo num" value={quando} onChange={(e) => setQuando(e.target.value)} />
                </Campo>
                <Opcoes nome="formato" rotulo="Formato" valor={formato} colunas={2}
                  opcoes={Object.entries(FORMATOS).map(([valor, rotulo]) => ({ valor: valor as Formato, rotulo }))} onChange={setFormato} />
                <button type="button" className="botao-secundario self-start" disabled={!agendaMudou || salvar.isPending}
                  onClick={() => atualizar({ data_hora: quando ? localSPparaISO(quando) : null, formato }, 'Reunião atualizada.')}>
                  Salvar data e formato
                </button>
              </div>
            </Secao>
          )}

          <Secao titulo="Resultado da reunião" id="s-resultado">
            {podeEditar ? (
              <div className="flex flex-col gap-3 pt-3">
                <Opcoes
                  nome="resultado"
                  rotulo="Como foi?"
                  valor={resultado}
                  colunas={2}
                  opcoes={Object.entries(RESULTADO_REUNIAO).map(([valor, rotulo]) => ({ valor: valor as ResultadoReuniao, rotulo }))}
                  onChange={setResultado}
                />
                {resultado && resultado !== 'fechou' && (
                  <Campo id="motivo" rotulo="Motivo, com as palavras do lead" ajuda='Ex.: "achei caro agora", "vou ver com meu sócio".'>
                    <textarea id="motivo" rows={2} className="campo" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                  </Campo>
                )}
                {resultado === 'remarcou' && !r.resultado && (
                  <Campo id="nova" rotulo="Nova data e hora">
                    <input id="nova" type="datetime-local" className="campo num" value={novaData} onChange={(e) => setNovaData(e.target.value)} />
                  </Campo>
                )}
                <button
                  type="button"
                  className="botao-primario self-start !min-h-12"
                  disabled={!resultado || salvar.isPending || (resultado === r.resultado && (motivo.trim() || null) === r.motivo_perda)}
                  onClick={salvarResultado}
                >
                  Registrar resultado
                </button>
              </div>
            ) : r.resultado ? (
              <p className="pt-3">
                <strong>{RESULTADO_REUNIAO[r.resultado]}</strong>
                {r.motivo_perda && <span className="block text-tinta-2">“{r.motivo_perda}”</span>}
              </p>
            ) : (
              <Vazio>Sem resultado registrado.</Vazio>
            )}
          </Secao>

          {(r.resultado === 'fechou') && <VendaDoLead lead={lead} vendedorId={vendedorId!} />}
        </div>
      </div>
    </>
  )
}

function VendaDoLead({ lead, vendedorId }: { lead: Lead; vendedorId: string }) {
  const { podeEditar } = useAlvo()
  const vendas = useVendas(vendedorId)
  const { data: config } = useConfig()
  const salvar = useSalvarVenda()
  const { avisar } = useAviso()
  const existente = useMemo(() => vendas.data?.find((v) => v.lead_id === lead.id && v.status !== 'cancelada'), [vendas.data, lead.id])
  const padrao = config?.preco_padrao ?? 797
  const piso = config?.preco_piso ?? 597
  const [valor, setValor] = useState('')
  const [forma, setForma] = useState<FormaPagamento>('cartao')
  const [parcelas, setParcelas] = useState(1)
  useEffect(() => {
    if (!valor && config) setValor(String(padrao).replace('.', ','))
  }, [config, padrao, valor])

  const n = lerMoeda(valor)
  const abaixoPadrao = n !== null && n < padrao && n >= piso
  const abaixoPiso = n !== null && n < piso

  if (existente) {
    return (
      <Secao titulo="Venda" id="s-venda">
        <dl className="divide-y divide-fio">
          <div className="flex justify-between py-2.5"><dt className="text-tinta-2">Valor combinado</dt><dd className="num font-semibold">{fmtMoeda(existente.valor_combinado)}</dd></div>
          <div className="flex justify-between py-2.5"><dt className="text-tinta-2">Pagamento</dt><dd>{FORMA_PAGAMENTO[existente.forma_pagamento]}{existente.forma_pagamento === 'cartao' ? ` em ${existente.parcelas}x` : ''}</dd></div>
          <div className="flex justify-between py-2.5"><dt className="text-tinta-2">Status</dt><dd>{STATUS_VENDA[existente.status]}</dd></div>
        </dl>
        {podeEditar && existente.status === 'aguardando_aprovacao' && (
          <button type="button" className="botao-secundario mt-3" disabled={salvar.isPending}
            onClick={async () => {
              try {
                await salvar.mutateAsync({ id: existente.id, dados: { status: 'aguardando_pagamento' } })
                avisar('Site aprovado. Aguardando pagamento.')
              } catch (e) { avisar(mensagemErro(e), 'erro') }
            }}>
            Cliente aprovou o site
          </button>
        )}
      </Secao>
    )
  }
  if (!podeEditar) return null

  return (
    <Secao titulo="Registrar venda" id="s-venda">
      <form
        className="flex flex-col gap-3 pt-3"
        onSubmit={async (e) => {
          e.preventDefault()
          if (n === null || abaixoPiso) return
          try {
            await salvar.mutateAsync({ dados: { lead_id: lead.id, valor_combinado: n, forma_pagamento: forma, parcelas: forma === 'cartao' ? parcelas : 1 } })
            avisar('Venda registrada. O pagamento acontece depois que o cliente aprovar o site.')
          } catch (err) { avisar(mensagemErro(err), 'erro') }
        }}
      >
        <Campo id="valor" rotulo="Valor combinado (R$)" ajuda={`Preço padrão ${fmtMoeda(padrao)}, até 6x no cartão.`}
          erro={abaixoPiso ? `Abaixo do piso de ${fmtMoeda(piso)}. Não é possível registrar.` : null}>
          <input id="valor" inputMode="decimal" className="campo num" value={valor} onChange={(e) => setValor(e.target.value)} aria-invalid={abaixoPiso} />
        </Campo>
        {abaixoPadrao && <Faixa>Abaixo de {fmtMoeda(padrao)}: só vale com aprovação do Pedro. Confirme com ele antes.</Faixa>}
        <Opcoes nome="forma" rotulo="Forma de pagamento" valor={forma} colunas={2}
          opcoes={Object.entries(FORMA_PAGAMENTO).map(([valor, rotulo]) => ({ valor: valor as FormaPagamento, rotulo }))} onChange={setForma} />
        {forma === 'cartao' && (
          <Campo id="parcelas" rotulo="Parcelas">
            <select id="parcelas" className="campo num" value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((p) => <option key={p} value={p}>{p}x{n ? ` de ${fmtMoeda(Math.round((n / p) * 100) / 100)}` : ''}</option>)}
            </select>
          </Campo>
        )}
        <button type="submit" className="botao-primario self-start !min-h-12" disabled={n === null || abaixoPiso || salvar.isPending}>
          Registrar venda
        </button>
      </form>
    </Secao>
  )
}
