import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, linkWhats, type Horario } from '../config'
import { Botao, Reveal, Titulo } from './ui'
import { IconeCalendario, IconeCheck, IconeWhats } from './Icones'

const OPCOES_EXTRAS = ['Primeira avaliação', 'Ainda não sei, quero conversar']

const pad = (n: number) => String(n).padStart(2, '0')
const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const paraData = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const minutos = (h: string) => {
  const [hh, mm] = h.split(':').map(Number)
  return hh * 60 + mm
}

function horarioDoDia(iso: string): Horario | undefined {
  if (!iso) return undefined
  return CONFIG.horarios.find((h) => h.dia === paraData(iso).getDay())
}

/** Blocos de 1 hora entre abertura e fechamento, sem o intervalo e sem o horário de fechamento. */
export function horariosDisponiveis(iso: string, agora = new Date()): string[] {
  const h = horarioDoDia(iso)
  if (!h) return []
  const ehHoje = iso === hojeISO()
  const agoraMin = agora.getHours() * 60 + agora.getMinutes()
  const out: string[] = []
  for (let t = minutos(h.abre); t + 60 <= minutos(h.fecha); t += 60) {
    if (h.intervalo && t < minutos(h.intervalo.fim) && t + 60 > minutos(h.intervalo.inicio)) continue
    if (ehHoje && t <= agoraMin) continue
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`)
  }
  return out
}

type Erros = Partial<Record<'nome' | 'atendimento' | 'data', string>>
type Estado = 'editando' | 'enviando' | 'enviado'

export function Agendar() {
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<Estado>('editando')
  const [url, setUrl] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const [aviso, setAviso] = useState('')
  // data mínima calculada no navegador (o HTML é pré-renderizado no build)
  const [hoje, setHoje] = useState<string>()
  useEffect(() => setHoje(hojeISO()), [])
  const refs = {
    nome: useRef<HTMLInputElement>(null),
    atendimento: useRef<HTMLSelectElement>(null),
    data: useRef<HTMLInputElement>(null),
  }
  const confirmRef = useRef<HTMLDivElement>(null)

  const opcoes = [...CONFIG.atendimentos.map((a) => a.nome), ...OPCOES_EXTRAS]
  const slots = useMemo(() => horariosDisponiveis(data), [data])
  const limite = CONFIG.agendamento.limiteObservacoes
  const exigir = CONFIG.agendamento.exigirAtendimento

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (v < hojeISO()) return 'Escolha uma data a partir de hoje.'
    if (!horarioDoDia(v)) return 'Dia sem atendimento, escolha outra data.'
    if (!horariosDisponiveis(v).length) return 'Não há mais horários neste dia, escolha outra data.'
    return undefined
  }

  function onData(v: string) {
    setData(v)
    setHora('')
    setErros((e) => ({ ...e, data: validarData(v) }))
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a equipe saber como te chamar.'
    if (exigir && !atendimento) e.atendimento = 'Escolha o atendimento desejado.'
    const ed = validarData(data)
    if (ed) e.data = ed
    return e
  }

  function montarMensagem() {
    const dataFmt = data ? data.split('-').reverse().join('/') : 'a combinar'
    return [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${dataFmt}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'atendimento', 'data'] as const).find((k) => e[k])
    if (primeiro) {
      setAviso(`Revise ${Object.keys(e).length === 1 ? 'o campo destacado' : 'os campos destacados'} para continuar.`)
      refs[primeiro].current?.focus()
      return
    }
    setAviso('')
    setEstado('enviando')
    const destino = linkWhats(montarMensagem())
    setUrl(destino)
    // Abre já no clique (evita bloqueio) e corta o vínculo com esta página.
    const janela = window.open(destino, '_blank')
    if (janela) janela.opener = null
    setBloqueado(!janela)
    window.setTimeout(() => {
      setEstado('enviado')
      requestAnimationFrame(() => confirmRef.current?.focus())
    }, 350)
  }

  function nova() {
    setNome('')
    setAtendimento('')
    setData('')
    setHora('')
    setObs('')
    setErros({})
    setEstado('editando')
    setBloqueado(false)
    requestAnimationFrame(() => refs.nome.current?.focus())
  }

  const campo =
    'block min-h-12 w-full rounded-xl border bg-ivory px-4 py-3 text-base text-text transition-[border-color,box-shadow] duration-200 placeholder:text-muted/80 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60'
  const okCls = 'border-line focus:border-gold-deep focus:ring-gold/20'
  const errCls = 'border-error focus:border-error focus:ring-error/15'
  const rotulo = 'mb-2 block text-[0.92rem] font-semibold text-text'

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="bg-ivory py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="lg:pt-6">
          <Titulo id="t-agendar" rotulo="Praticidade" texto="Peça seu horário em poucos *cliques*." />
          <p className="mt-6 max-w-md text-[1.05rem] text-muted">
            Escolha o atendimento e o dia e horário que preferir. Sua solicitação chega à clínica pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
          <ul className="mt-8 space-y-3 text-[0.98rem] text-muted">
            {[
              'O dia e o horário escolhidos são preferências, sujeitas à confirmação da clínica.',
              'Não pedimos telefone, e-mail ou dados de saúde.',
              'Nada do que você digita fica guardado neste site.',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <IconeCheck className="mt-1 size-4 shrink-0 text-gold-deep" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          {CONFIG.agendamento.urgencia && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gold/50 bg-sand p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-text">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <Botao href={linkWhats()} externo variante="escuro">
                <IconeWhats className="size-5" /> Falar agora
              </Botao>
            </div>
          )}

          <div className="relative rounded-[1.75rem] border border-line bg-sand/60 p-6 shadow-[0_30px_60px_-40px_rgb(15_14_12/0.35)] sm:p-9">
            <span aria-hidden className="filete absolute inset-x-10 top-0" />
            {estado === 'enviado' ? (
              <div ref={confirmRef} tabIndex={-1} role="status" className="py-6 text-center focus:outline-none">
                <span className="mx-auto grid size-16 place-items-center rounded-full border border-gold text-gold-deep">
                  <IconeCheck className="size-7" />
                </span>
                <h3 className="mt-6 text-3xl text-text">Pronto!</h3>
                <p className="mx-auto mt-3 max-w-sm text-muted">
                  {bloqueado
                    ? 'Seu navegador impediu a abertura automática. Toque em "Abrir WhatsApp" para enviar sua solicitação. A equipe confirma a disponibilidade.'
                    : 'Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.'}
                </p>
                <div className="mt-7 flex flex-col items-center gap-3">
                  <Botao href={url} externo variante="escuro">
                    <IconeWhats className="size-5 text-gold-soft" />
                    Abrir WhatsApp
                  </Botao>
                  <button
                    type="button"
                    onClick={nova}
                    className="inline-flex min-h-12 items-center px-3 text-[0.95rem] font-semibold text-gold-deep underline decoration-gold/50 underline-offset-[6px] hover:text-ink"
                  >
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby="form-privacidade" className="space-y-6">
                <div>
                  <label htmlFor="ag-nome" className={rotulo}>
                    Nome completo <span aria-hidden className="text-gold-deep">*</span>
                    <span className="sr-only"> (obrigatório)</span>
                  </label>
                  <input
                    ref={refs.nome}
                    id="ag-nome"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                    }}
                    aria-invalid={!!erros.nome}
                    aria-describedby={erros.nome ? 'ag-nome-erro' : undefined}
                    className={`${campo} ${erros.nome ? errCls : okCls}`}
                  />
                  {erros.nome && (
                    <p id="ag-nome-erro" className="mt-2 text-sm font-medium text-error">
                      {erros.nome}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="ag-atendimento" className={rotulo}>
                    Atendimento desejado{' '}
                    {exigir ? (
                      <>
                        <span aria-hidden className="text-gold-deep">*</span>
                        <span className="sr-only"> (obrigatório)</span>
                      </>
                    ) : (
                      <span className="font-normal text-muted">(opcional)</span>
                    )}
                  </label>
                  <select
                    ref={refs.atendimento}
                    id="ag-atendimento"
                    name="atendimento"
                    value={atendimento}
                    required={exigir}
                    onChange={(e) => {
                      setAtendimento(e.target.value)
                      if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                    }}
                    aria-invalid={!!erros.atendimento}
                    aria-describedby={erros.atendimento ? 'ag-atendimento-erro' : undefined}
                    className={`${campo} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237a5b2a' stroke-width='1.6'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11 ${erros.atendimento ? errCls : okCls}`}
                  >
                    <option value="">Selecione</option>
                    {opcoes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {erros.atendimento && (
                    <p id="ag-atendimento-erro" className="mt-2 text-sm font-medium text-error">
                      {erros.atendimento}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ag-data" className={rotulo}>
                      Data preferida <span className="font-normal text-muted">(opcional)</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={refs.data}
                        id="ag-data"
                        name="data"
                        type="date"
                        min={hoje}
                        value={data}
                        onChange={(e) => onData(e.target.value)}
                        aria-invalid={!!erros.data}
                        aria-describedby={`ag-data-ajuda${erros.data ? ' ag-data-erro' : ''}`}
                        className={`${campo} ${erros.data ? errCls : okCls}`}
                      />
                    </div>
                    <p id="ag-data-ajuda" className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                      <IconeCalendario className="size-3.5 shrink-0" />
                      Segunda a sábado. Domingo sem atendimento.
                    </p>
                    {erros.data && (
                      <p id="ag-data-erro" className="mt-1 text-sm font-medium text-error">
                        {erros.data}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="ag-hora" className={rotulo}>
                      Horário preferido <span className="font-normal text-muted">(opcional)</span>
                    </label>
                    <select
                      id="ag-hora"
                      name="hora"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      disabled={!data || !!erros.data || !slots.length}
                      aria-describedby="ag-hora-ajuda"
                      className={`${campo} ${okCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237a5b2a' stroke-width='1.6'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
                    >
                      <option value="">Escolha um horário</option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p id="ag-hora-ajuda" className="mt-2 text-xs text-muted">
                      {data && !erros.data ? 'Horário sujeito à confirmação da clínica.' : 'Escolha a data para ver os horários.'}
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="ag-obs" className={rotulo}>
                    Observações <span className="font-normal text-muted">(opcional)</span>
                  </label>
                  <textarea
                    id="ag-obs"
                    name="observacoes"
                    rows={3}
                    maxLength={limite}
                    placeholder="Se quiser, conte o que você precisa."
                    value={obs}
                    onChange={(e) => setObs(e.target.value.slice(0, limite))}
                    aria-describedby="ag-obs-aviso ag-obs-contador"
                    className={`${campo} ${okCls} resize-y`}
                  />
                  <div className="mt-2 flex justify-between gap-4 text-xs text-muted">
                    <p id="ag-obs-aviso">Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                    <p id="ag-obs-contador" className="shrink-0 tabular-nums" aria-live="polite">
                      {obs.length}/{limite}
                    </p>
                  </div>
                </div>

                <p aria-live="assertive" className="text-sm font-semibold text-error empty:hidden">
                  {aviso}
                </p>

                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="group inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-ink px-6 text-base font-semibold text-ivory transition-[background-color,transform] duration-300 hover:bg-ink-3 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
                >
                  {estado === 'enviando' ? (
                    <>
                      <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-gold-soft border-t-transparent" />
                      Abrindo o WhatsApp…
                    </>
                  ) : (
                    <>
                      <IconeWhats className="size-5 text-gold-soft" />
                      Enviar solicitação pelo WhatsApp
                    </>
                  )}
                </button>

                <p id="form-privacidade" className="text-center text-xs leading-relaxed text-muted">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="font-semibold text-gold-deep underline underline-offset-2 hover:text-ink">
                    Política de privacidade
                  </a>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
