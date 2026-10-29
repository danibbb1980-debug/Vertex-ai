import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { abreNoDia, blocosDoDia, hojeISO, waLink } from '../lib/util'
import { Reveal, SectionHead } from './Base'
import { IconChat, IconCheck, IconLock } from './Icons'

const OUTRAS = ['Primeira avaliação', 'Ainda não sei, quero conversar']
const LIMITE_OBS = 300

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'hora', string>>

function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}
function br(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function Agendar() {
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [status, setStatus] = useState<'idle' | 'enviando' | 'enviado'>('idle')
  const [bloqueado, setBloqueado] = useState(false)
  const [url, setUrl] = useState('')
  const [aviso, setAviso] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const okRef = useRef<HTMLDivElement>(null)

  // data de hoje só no navegador (o HTML é pré-renderizado no build)
  const [hoje, setHoje] = useState('')
  useEffect(() => setHoje(hojeISO()), [])
  const exigir = CONFIG.agendamento.exigirAtendimento
  const opcoes = [...CONFIG.atendimentos.map((a) => a.nome), ...OUTRAS]

  const diaRef = useMemo(() => {
    if (data && data >= hoje && abreNoDia(diaDaSemana(data))) return diaDaSemana(data)
    if (data) return null
    return CONFIG.horarios.find((h) => h.abre && h.fecha)?.dia ?? null
  }, [data, hoje])

  const horas = useMemo(() => {
    if (diaRef === null) return []
    let aPartir = 0
    if (data === hoje) {
      const n = new Date()
      aPartir = n.getHours() * 60 + n.getMinutes() + 60
    }
    return blocosDoDia(diaRef, aPartir)
  }, [diaRef, data, hoje])

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (v < hoje) return 'Escolha uma data a partir de hoje.'
    if (!abreNoDia(diaDaSemana(v))) return 'Dia sem atendimento, escolha outra data.'
    if (v === hoje && blocosDoDia(diaDaSemana(v), new Date().getHours() * 60 + new Date().getMinutes() + 60).length === 0)
      return 'Não há mais horários hoje, escolha outra data.'
    return undefined
  }

  function onData(v: string) {
    setData(v)
    setErros((e) => ({ ...e, data: validarData(v) }))
    setHora('')
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const novo: Erros = {}
    if (nome.trim().length < 2) novo.nome = 'Informe seu nome para a clínica saber com quem vai falar.'
    if (exigir && !atendimento) novo.atendimento = 'Escolha um atendimento.'
    const ed = validarData(data)
    if (ed) novo.data = ed
    if (hora && !horas.includes(hora)) novo.hora = 'Escolha um horário da lista.'
    setErros(novo)
    const primeiros = Object.keys(novo) as (keyof Erros)[]
    if (primeiros.length) {
      setAviso(`Revise ${primeiros.length === 1 ? 'o campo destacado' : 'os campos destacados'} antes de enviar.`)
      formRef.current?.querySelector<HTMLElement>(`[name="${primeiros[0]}"]`)?.focus()
      return
    }
    setAviso('')
    const msg = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? br(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = waLink(msg)
    setUrl(link)
    setStatus('enviando')
    // abre a aba já no clique (gesto do usuário) para não cair no bloqueador
    const w = window.open('', '_blank')
    if (w) {
      w.opener = null
      w.location.href = link
      setBloqueado(false)
    } else {
      setBloqueado(true)
    }
    window.setTimeout(() => {
      setStatus('enviado')
      requestAnimationFrame(() => okRef.current?.focus())
    }, 350)
  }

  function reiniciar() {
    setNome('')
    setAtendimento('')
    setData('')
    setHora('')
    setObs('')
    setErros({})
    setStatus('idle')
    setBloqueado(false)
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `err-${campo}` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  if (!CONFIG.secoes.agendar) return null

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="sec">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHead
            id="t-agendar"
            numero="08"
            rotulo="Praticidade"
            titulo={
              <>
                Peça seu horário em poucos <em>cliques</em>.
              </>
            }
            intro="Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade."
          />
          <Reveal delay={0.15}>
            <ul className="mt-8 space-y-3 text-[0.97rem] text-muted">
              <li className="flex gap-3">
                <IconCheck size={20} className="mt-0.5 shrink-0 text-sage-deep" /> Data e horário são preferências, sujeitas à confirmação da clínica.
              </li>
              <li className="flex gap-3">
                <IconCheck size={20} className="mt-0.5 shrink-0 text-sage-deep" /> Sem cadastro, telefone ou e-mail: o WhatsApp já identifica você.
              </li>
            </ul>
          </Reveal>
          {CONFIG.fotos.agendar && (
            <Reveal delay={0.2} className="mt-10 max-w-[360px]">
              <figure className="rounded-[20px] bg-paper p-2 shadow-[0_24px_50px_-30px_rgb(15_45_40/0.5)] ring-1 ring-line">
                <img
                  src={CONFIG.fotos.agendar.src}
                  alt={CONFIG.fotos.agendar.alt}
                  width={CONFIG.fotos.agendar.largura}
                  height={CONFIG.fotos.agendar.altura}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full rounded-[14px] object-cover"
                />
              </figure>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="relative rounded-[28px] border border-line bg-paper p-6 shadow-[0_40px_80px_-50px_rgb(15_45_40/0.45)] sm:p-8 md:p-10">
            <span className="crosshair -left-[6px] -top-[6px] text-sage-deep" />
            <span className="crosshair -bottom-[6px] -right-[6px] text-sage-deep" />

            {CONFIG.agendamento.urgencia && (
              <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-sand p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-ink">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <IconChat size={18} /> Falar agora
                </a>
              </div>
            )}

            {status === 'enviado' ? (
              <div ref={okRef} tabIndex={-1} role="status" className="py-6 outline-none">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/20 text-sage-deep">
                  <IconCheck size={28} />
                </span>
                <h3 className="mt-6 font-serif text-3xl text-ink">Pronto!</h3>
                <p className="mt-3 max-w-md text-lg text-text">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                {bloqueado && (
                  <p className="mt-4 rounded-xl bg-sand px-4 py-3 text-sm text-ink">
                    Parece que o navegador bloqueou a nova aba. Use o botão abaixo para abrir o WhatsApp.
                  </p>
                )}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <IconChat size={18} /> Abrir WhatsApp
                  </a>
                  <button type="button" onClick={reiniciar} className="btn btn-ghost">
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={submit} aria-describedby="form-apoio">
                <div aria-live="polite" className="sr-only">
                  {aviso}
                </div>
                {aviso && (
                  <p className="mb-6 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" aria-hidden="true">
                    {aviso}
                  </p>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="f-nome" className="mb-2 block text-sm font-semibold text-ink">
                      Nome completo
                    </label>
                    <input
                      id="f-nome"
                      name="nome"
                      type="text"
                      autoComplete="name"
                      required
                      aria-required="true"
                      aria-invalid={!!erros.nome}
                      aria-describedby={desc('nome')}
                      placeholder="Como devemos te chamar?"
                      className="field"
                      value={nome}
                      maxLength={80}
                      onChange={(e) => {
                        setNome(e.target.value)
                        if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                      }}
                    />
                    {erros.nome && (
                      <p id="err-nome" className="mt-2 text-sm text-danger">
                        {erros.nome}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="f-atendimento" className="mb-2 block text-sm font-semibold text-ink">
                      Atendimento desejado {!exigir && <span className="font-normal text-muted">(opcional)</span>}
                    </label>
                    <select
                      id="f-atendimento"
                      name="atendimento"
                      className="field"
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={desc('atendimento')}
                      aria-required={exigir || undefined}
                      value={atendimento}
                      onChange={(e) => {
                        setAtendimento(e.target.value)
                        if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                      }}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {erros.atendimento && (
                      <p id="err-atendimento" className="mt-2 text-sm text-danger">
                        {erros.atendimento}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="f-data" className="mb-2 block text-sm font-semibold text-ink">
                      Data preferida <span className="font-normal text-muted">(opcional)</span>
                    </label>
                    <input
                      id="f-data"
                      name="data"
                      type="date"
                      min={hoje || undefined}
                      className="field"
                      aria-invalid={!!erros.data}
                      aria-describedby={desc('data', 'ajuda-data')}
                      value={data}
                      onChange={(e) => onData(e.target.value)}
                    />
                    {erros.data ? (
                      <p id="err-data" role="alert" className="mt-2 text-sm text-danger">
                        {erros.data}
                      </p>
                    ) : null}
                    <p id="ajuda-data" className="mt-2 text-xs text-muted">
                      Atendimento de segunda a sexta.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="f-hora" className="mb-2 block text-sm font-semibold text-ink">
                      Horário preferido <span className="font-normal text-muted">(opcional)</span>
                    </label>
                    <select
                      id="f-hora"
                      name="hora"
                      className="field"
                      aria-invalid={!!erros.hora}
                      aria-describedby={desc('hora')}
                      value={hora}
                      disabled={horas.length === 0}
                      onChange={(e) => {
                        setHora(e.target.value)
                        if (erros.hora) setErros((x) => ({ ...x, hora: undefined }))
                      }}
                    >
                      <option value="">Escolha um horário</option>
                      {horas.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    {erros.hora && (
                      <p id="err-hora" className="mt-2 text-sm text-danger">
                        {erros.hora}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <label htmlFor="f-obs" className="block text-sm font-semibold text-ink">
                        Observações <span className="font-normal text-muted">(opcional)</span>
                      </label>
                      <span className="text-xs tabular-nums text-muted" aria-hidden="true">
                        {obs.length}/{LIMITE_OBS}
                      </span>
                    </div>
                    <textarea
                      id="f-obs"
                      name="obs"
                      rows={3}
                      maxLength={LIMITE_OBS}
                      placeholder="Se quiser, conte o que você precisa."
                      className="field resize-y"
                      aria-describedby="ajuda-obs"
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                    />
                    <p id="ajuda-obs" className="mt-2 text-xs text-muted">
                      Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp. Limite de {LIMITE_OBS} caracteres.
                    </p>
                  </div>
                </div>

                <button type="submit" disabled={status === 'enviando'} className="btn btn-primary mt-8 w-full disabled:opacity-80">
                  {status === 'enviando' ? (
                    <>
                      <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" />
                      Abrindo o WhatsApp…
                    </>
                  ) : (
                    <>
                      <IconChat size={19} /> Enviar solicitação pelo WhatsApp
                    </>
                  )}
                </button>
                <p id="form-apoio" className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
                  <IconLock size={16} className="mt-px shrink-0" />
                  <span>
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados. Data e horário
                    são preferências: a equipe confirma a disponibilidade na conversa.{' '}
                    <a href="/privacidade.html" className="link text-ink">
                      Privacidade
                    </a>
                    .
                  </span>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
