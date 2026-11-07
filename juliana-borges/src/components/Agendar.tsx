import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { agoraSP, blocosDoDia, diaDaSemana, estaFechado, horarioDoDia, isoParaBR, minutosDe, temTexto } from '../lib/utils'
import { CabecalhoSecao, IconeWhatsApp, Revelar } from './ui'

const NAO_SEI = 'Ainda não sei, quero conversar'

type Erros = Partial<Record<'nome' | 'atendimento' | 'data', string>>

function somarDias(iso: string, n: number) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + n))
  return dt.toISOString().slice(0, 10)
}

export function montarMensagem(v: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  return [
    CONFIG.mensagens.solicitacao,
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${v.atendimento || 'a definir'}`,
    `Data preferida: ${v.data ? isoParaBR(v.data) : 'a combinar'}`,
    `Horário preferido: ${v.horario || 'a combinar'}`,
    `Observações: ${v.obs.trim() || '-'}`,
  ].join('\n')
}

export function Agendar() {
  const uid = useId()
  const id = (s: string) => `${uid}-${s}`
  const [hoje, setHoje] = useState<{ iso: string; minutos: number } | null>(null)
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [status, setStatus] = useState<'editando' | 'enviando' | 'pronto'>('editando')
  const [urlFinal, setUrlFinal] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const prontoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const a = agoraSP()
    setHoje({ iso: a.iso, minutos: a.minutos })
  }, [])

  const opcoes = useMemo(() => [...CONFIG.atendimentos.map((a) => a.nome), NAO_SEI], [])
  const limite = CONFIG.agendamento.limiteObservacoes

  const blocos = useMemo(() => {
    if (!data || erroData(data)) return []
    let b = blocosDoDia(diaDaSemana(data))
    if (hoje && data === hoje.iso) b = b.filter((h) => minutosDe(h) > hoje.minutos)
    return b
  }, [data, hoje])

  function erroData(v: string): string | undefined {
    if (!v) return undefined
    if (hoje && v < hoje.iso) return 'Escolha uma data a partir de hoje.'
    if (estaFechado(horarioDoDia(diaDaSemana(v)))) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  function validar(): Erros {
    const e: Erros = {}
    if (!temTexto(nome) || nome.trim().length < 2) e.nome = 'Informe seu nome.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const ed = erroData(data)
    if (ed) e.data = ed
    if (!ed && data && blocos.length === 0) e.data = 'Sem horários disponíveis nesta data. Escolha outra.'
    return e
  }

  if (!CONFIG.whatsapp) return null

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'atendimento', 'data'] as const).find((k) => e[k])
    if (primeiro) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(primeiro))}`)?.focus()
      return
    }
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(montarMensagem({ nome, atendimento, data, horario, obs }))}`
    setStatus('enviando')
    // abre em nova aba sem dar acesso a esta página (equivalente a noopener)
    const w = window.open('', '_blank')
    if (w) {
      w.opener = null
      w.location.href = url
    }
    setBloqueado(!w)
    setUrlFinal(url)
    window.setTimeout(() => {
      setStatus('pronto')
      requestAnimationFrame(() => prontoRef.current?.focus())
    }, 450)
  }

  function novaSolicitacao() {
    setNome('')
    setAtendimento('')
    setData('')
    setHorario('')
    setObs('')
    setErros({})
    setStatus('editando')
    setUrlFinal('')
    setBloqueado(false)
  }

  const campoErro = (k: keyof Erros) =>
    erros[k] ? { 'aria-invalid': true as const, 'aria-describedby': id(`${k}-erro`) } : { 'aria-invalid': false as const }

  const Erro = ({ k }: { k: keyof Erros }) =>
    erros[k] ? (
      <p id={id(`${k}-erro`)} className="mt-2 flex items-center gap-2 text-sm font-medium text-[#a3341f]">
        <span aria-hidden="true">!</span> {erros[k]}
      </p>
    ) : null

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <CabecalhoSecao
            id="titulo-agendar"
            rotulo="Praticidade"
            titulo={
              <>
                Peça seu horário em poucos <em>cliques</em>.
              </>
            }
          >
            <p>
              Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega à Juliana pelo WhatsApp, e ela confirma a
              disponibilidade.
            </p>
            <p className="mt-4 text-[0.98rem] text-choco/80">
              O dia e o horário escolhidos aqui são preferências. Eles ainda dependem da confirmação da Juliana na conversa.
            </p>
          </CabecalhoSecao>
        </div>

        <Revelar atraso={0.08} className="lg:col-span-7">
          <div className="relative rounded-[2rem] border border-choco/10 bg-nude-claro/55 p-6 shadow-[0_40px_70px_-50px_rgb(78_50_38/0.6)] sm:p-9">
            <span aria-hidden="true" className="absolute left-9 top-0 h-10 w-px bg-ouro" />
            <div aria-live="polite" className="sr-only">
              {Object.values(erros).filter(Boolean).length > 0 ? `Corrija os campos indicados: ${Object.values(erros).filter(Boolean).join(' ')}` : ''}
            </div>

            {status === 'pronto' ? (
              <div ref={prontoRef} tabIndex={-1} className="py-6 text-center outline-none" role="status">
                <span aria-hidden="true" className="mx-auto flex size-14 items-center justify-center rounded-full bg-choco text-creme">
                  <IconeWhatsApp className="size-6" />
                </span>
                <p className="mx-auto mt-6 max-w-md font-serif text-[1.5rem] leading-snug text-choco">
                  Pronto! Abrimos o WhatsApp com sua solicitação.
                </p>
                <p className="mx-auto mt-3 max-w-md text-choco/85">É só enviar a mensagem. A Juliana confirma a disponibilidade.</p>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <a href={urlFinal} target="_blank" rel="noopener noreferrer" className={`btn ${bloqueado ? 'btn-primario' : 'btn-secundario'}`}>
                    <IconeWhatsApp className="size-5" /> Abrir WhatsApp
                  </a>
                  {bloqueado && <p className="text-sm text-choco/80">Se o WhatsApp não abriu sozinho, use o botão acima.</p>}
                  <button type="button" onClick={novaSolicitacao} className="link-sublinhado mt-2 min-h-12 px-2 text-[0.95rem] text-choco">
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-6" aria-describedby={id('apoio')}>
                <div>
                  <label htmlFor={id('nome')} className="mb-2 block font-medium text-choco">
                    Nome completo <span className="text-sm font-normal text-choco/75">(obrigatório)</span>
                  </label>
                  <input
                    id={id('nome')}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={() => setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? 'Informe seu nome.' : undefined }))}
                    className="campo"
                    {...campoErro('nome')}
                  />
                  <Erro k="nome" />
                </div>

                <div>
                  <label htmlFor={id('atendimento')} className="mb-2 block font-medium text-choco">
                    Atendimento desejado{' '}
                    <span className="text-sm font-normal text-choco/75">{CONFIG.agendamento.exigirAtendimento ? '(obrigatório)' : '(opcional)'}</span>
                  </label>
                  <select
                    id={id('atendimento')}
                    name="atendimento"
                    value={atendimento}
                    onChange={(e) => {
                      setAtendimento(e.target.value)
                      setErros((x) => ({ ...x, atendimento: undefined }))
                    }}
                    className="campo"
                    {...campoErro('atendimento')}
                  >
                    <option value="">Escolha um atendimento</option>
                    {opcoes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <Erro k="atendimento" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor={id('data')} className="mb-2 block font-medium text-choco">
                      Data preferida <span className="text-sm font-normal text-choco/75">(opcional)</span>
                    </label>
                    <input
                      id={id('data')}
                      name="data"
                      type="date"
                      min={hoje?.iso}
                      max={hoje ? somarDias(hoje.iso, 120) : undefined}
                      value={data}
                      onChange={(e) => {
                        const v = e.target.value
                        setData(v)
                        setHorario('')
                        setErros((x) => ({ ...x, data: erroData(v) }))
                      }}
                      className="campo"
                      {...campoErro('data')}
                      aria-describedby={[erros.data ? id('data-erro') : '', id('data-dica')].filter(Boolean).join(' ')}
                    />
                    <p id={id('data-dica')} className="mt-2 text-sm text-choco/75">
                      Domingo sem atendimento.
                    </p>
                    <Erro k="data" />
                  </div>
                  <div>
                    <label htmlFor={id('horario')} className="mb-2 block font-medium text-choco">
                      Horário preferido <span className="text-sm font-normal text-choco/75">(opcional)</span>
                    </label>
                    <select
                      id={id('horario')}
                      name="horario"
                      value={horario}
                      disabled={blocos.length === 0}
                      onChange={(e) => setHorario(e.target.value)}
                      className="campo"
                      aria-describedby={id('horario-dica')}
                    >
                      <option value="">Escolha um horário</option>
                      {blocos.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <p id={id('horario-dica')} className="mt-2 text-sm text-choco/75">
                      {data && blocos.length ? 'Horários de início, sujeitos à disponibilidade.' : 'Escolha uma data para ver os horários.'}
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor={id('obs')} className="mb-2 block font-medium text-choco">
                    Observações <span className="text-sm font-normal text-choco/75">(opcional)</span>
                  </label>
                  <textarea
                    id={id('obs')}
                    name="observacoes"
                    rows={3}
                    maxLength={limite}
                    placeholder="Se quiser, conte o que você precisa."
                    value={obs}
                    onChange={(e) => setObs(e.target.value.slice(0, limite))}
                    className="campo resize-y"
                    aria-describedby={`${id('obs-aviso')} ${id('obs-cont')}`}
                  />
                  <div className="mt-2 flex items-start justify-between gap-4 text-sm text-choco/75">
                    <p id={id('obs-aviso')}>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                    <p id={id('obs-cont')} className="shrink-0 tabular-nums" aria-live="polite">
                      {obs.length}/{limite}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button type="submit" className="btn btn-primario w-full sm:w-auto" disabled={status === 'enviando'} aria-busy={status === 'enviando'}>
                    {status === 'enviando' ? (
                      <>
                        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-creme/40 border-t-creme" />
                        Abrindo o WhatsApp…
                      </>
                    ) : (
                      <>
                        <IconeWhatsApp className="size-5" /> Enviar solicitação pelo WhatsApp
                      </>
                    )}
                  </button>
                  <p id={id('apoio')} className="mt-4 text-sm leading-relaxed text-choco/80">
                    Ao enviar, você abre uma conversa no WhatsApp com a Juliana. Este site não guarda os dados digitados.{' '}
                    <a href="/privacidade.html" className="underline underline-offset-2 hover:text-ouro-esc">
                      Privacidade
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  )
}
