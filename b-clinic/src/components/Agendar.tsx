import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { formAtivo } from './Header'
import { useMontado } from '../lib/hooks'

/* ---------- regras de agenda a partir de CONFIG.horarios ---------- */

const hojeISO = () => {
  const d = new Date()
  const z = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

/** dia da semana de "aaaa-mm-dd" sem efeito de fuso */
const diaDaSemana = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).getDay()
}

const horarioDoDia = (dia: number) => CONFIG.horarios.find((h) => h.dia === dia && h.abre && h.fecha)

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** blocos de 1 hora, excluindo o horário de fechamento */
function blocos(abre: string, fecha: string) {
  const out: string[] = []
  for (let t = minutos(abre); t + 60 <= minutos(fecha); t += 60) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
  }
  return out
}

function horariosPara(iso: string) {
  if (iso) {
    const h = horarioDoDia(diaDaSemana(iso))
    return h ? blocos(h.abre, h.fecha) : []
  }
  const todos = new Set<string>()
  CONFIG.horarios.filter((h) => h.abre && h.fecha).forEach((h) => blocos(h.abre, h.fecha).forEach((b) => todos.add(b)))
  return [...todos].sort()
}

const fechados = () =>
  CONFIG.horarios.filter((h) => !(h.abre && h.fecha)).map((h) => h.rotulo.toLowerCase())

const brData = (iso: string) => iso.split('-').reverse().join('/')

/* ---------- componente ---------- */

const LIMITE_OBS = 300

type Erros = Partial<Record<'nome' | 'data' | 'hora', string>>

export function Agendar() {
  const uid = useId()
  const montado = useMontado()
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [status, setStatus] = useState<'ocioso' | 'abrindo' | 'aberto' | 'bloqueado'>('ocioso')
  const [url, setUrl] = useState('')
  const nomeRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef<HTMLInputElement>(null)
  const horaRef = useRef<HTMLSelectElement>(null)
  const sucessoRef = useRef<HTMLDivElement>(null)

  const opcoesAtendimento = useMemo(
    () => [
      'Avaliação inicial',
      ...CONFIG.tratamentos.flatMap((c) => c.itens.map((t) => t.nome)),
      'Ainda não sei, quero conversar',
    ],
    [],
  )
  const slots = useMemo(() => horariosPara(data), [data])

  if (!formAtivo()) return null

  const validarData = (iso: string): string | undefined => {
    if (!iso) return undefined
    if (iso < hojeISO()) return 'Escolha uma data a partir de hoje.'
    if (!horarioDoDia(diaDaSemana(iso))) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe como devemos te chamar.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (hora && data && !slots.includes(hora)) e.hora = 'Escolha um horário disponível para esse dia.'
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      if (e.nome) nomeRef.current?.focus()
      else if (e.data) dataRef.current?.focus()
      else if (e.hora) horaRef.current?.focus()
      return
    }
    setStatus('abrindo')
    const msg = [
      'Olá! Vim pelo site da B Clinic e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? brData(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`
    setUrl(link)
    const w = window.open(link, '_blank')
    if (w) {
      try {
        w.opener = null
      } catch {
        /* noop */
      }
      setStatus('aberto')
    } else {
      setStatus('bloqueado')
    }
    requestAnimationFrame(() => sucessoRef.current?.focus())
  }

  const campo =
    'mt-2 block min-h-12 w-full rounded-none border border-preto/30 bg-osso px-4 py-3 text-base text-preto placeholder:text-pedra/80 transition-colors focus:border-preto focus:outline-2 focus:outline-offset-2 focus:outline-champanhe-escuro aria-[invalid=true]:border-erro'
  const rotulo = 'rotulo block text-preto'
  const erroCls = 'mt-2 text-[0.9375rem] text-erro'
  const descr = (k: keyof Erros, extra?: string) =>
    [erros[k] ? `${uid}-${k}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  const diasFechados = fechados()

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="bg-osso-2 py-24 md:py-36">
      <div className="container-b grid gap-14 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <p className="rotulo flex items-center gap-4 text-champanhe-escuro">
            <span aria-hidden="true" className="h-px w-10 bg-champanhe-escuro" />
            Praticidade
          </p>
          <h2 id="agendar-titulo" className="titulo mt-6 text-[clamp(2.4rem,5.4vw,4.25rem)]">
            Peça seu horário em poucos <span className="enfase">cliques</span>.
          </h2>
          <p className="mt-6 max-w-md text-pedra">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega à clínica pelo
            WhatsApp, e a equipe confirma a disponibilidade.
          </p>
          <svg aria-hidden="true" viewBox="0 0 200 200" className="mt-14 hidden h-40 w-40 lg:block">
            <circle cx="100" cy="100" r="99" fill="none" stroke="var(--color-champanhe)" strokeWidth="1" />
            <line x1="1" y1="100" x2="199" y2="100" stroke="var(--color-champanhe)" strokeWidth="1" />
          </svg>
        </header>

        <div className="lg:col-span-7">
          <div className="relative border border-champanhe bg-osso p-6 sm:p-10">
            <span aria-hidden="true" className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-champanhe-escuro" />
            <span aria-hidden="true" className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-champanhe-escuro" />

            {status === 'aberto' || status === 'bloqueado' ? (
              <div ref={sucessoRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
                <p className="rotulo text-champanhe-escuro">Solicitação pronta</p>
                {status === 'aberto' ? (
                  <p className="mt-5 text-[1.5rem] font-light leading-snug md:text-[1.75rem]">
                    Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a
                    disponibilidade.
                  </p>
                ) : (
                  <p className="mt-5 text-[1.5rem] font-light leading-snug md:text-[1.75rem]">
                    O navegador não abriu o WhatsApp automaticamente. Toque no botão abaixo para abrir a conversa com a
                    sua solicitação e enviar a mensagem. A equipe confirma a disponibilidade.
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center bg-preto px-6 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-osso"
                  >
                    Abrir WhatsApp<span className="sr-only"> (abre em nova aba)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('ocioso')
                      requestAnimationFrame(() => nomeRef.current?.focus())
                    }}
                    className="inline-flex min-h-12 cursor-pointer items-center text-[0.8125rem] font-medium uppercase tracking-[0.18em] underline decoration-preto/30 underline-offset-8"
                  >
                    Editar solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby={`${uid}-privacidade`}>
                <div aria-live="assertive" className="sr-only">
                  {Object.keys(erros).length ? 'Há campos para corrigir no formulário.' : ''}
                </div>

                <div>
                  <label htmlFor={`${uid}-nome`} className={rotulo}>
                    Nome completo <span aria-hidden="true">*</span>
                    <span className="sr-only"> (obrigatório)</span>
                  </label>
                  <input
                    ref={nomeRef}
                    id={`${uid}-nome`}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={!!erros.nome}
                    aria-describedby={descr('nome')}
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={() => erros.nome && setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? x.nome : undefined }))}
                    className={campo}
                  />
                  {erros.nome && (
                    <p id={`${uid}-nome-erro`} className={erroCls}>
                      {erros.nome}
                    </p>
                  )}
                </div>

                <div className="mt-7">
                  <label htmlFor={`${uid}-atend`} className={rotulo}>
                    Atendimento desejado
                  </label>
                  <div className="relative">
                    <select
                      id={`${uid}-atend`}
                      name="atendimento"
                      value={atendimento}
                      onChange={(e) => setAtendimento(e.target.value)}
                      className={`${campo} appearance-none pr-12`}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoesAtendimento.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Chevron />
                  </div>
                </div>

                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-data`} className={rotulo}>
                      Data preferida
                    </label>
                    <input
                      ref={dataRef}
                      id={`${uid}-data`}
                      name="data"
                      type="date"
                      min={montado ? hojeISO() : undefined}
                      aria-invalid={!!erros.data}
                      aria-describedby={descr('data', `${uid}-data-dica`)}
                      value={data}
                      onChange={(e) => {
                        const v = e.target.value
                        setData(v)
                        setErros((x) => ({ ...x, data: validarData(v) }))
                        if (hora && v && !horariosPara(v).includes(hora)) setHora('')
                      }}
                      className={campo}
                    />
                    {diasFechados.length > 0 && (
                      <p id={`${uid}-data-dica`} className="mt-2 text-sm text-pedra">
                        Sem atendimento: {diasFechados.join(', ')}.
                      </p>
                    )}
                    {erros.data && (
                      <p id={`${uid}-data-erro`} className={erroCls}>
                        {erros.data}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-hora`} className={rotulo}>
                      Horário preferido
                    </label>
                    <div className="relative">
                      <select
                        ref={horaRef}
                        id={`${uid}-hora`}
                        name="hora"
                        value={hora}
                        aria-invalid={!!erros.hora}
                        aria-describedby={descr('hora')}
                        disabled={!!data && slots.length === 0}
                        onChange={(e) => {
                          setHora(e.target.value)
                          setErros((x) => ({ ...x, hora: undefined }))
                        }}
                        className={`${campo} appearance-none pr-12 disabled:opacity-60`}
                      >
                        <option value="">Escolha um horário</option>
                        {slots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </div>
                    {erros.hora && (
                      <p id={`${uid}-hora-erro`} className={erroCls}>
                        {erros.hora}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor={`${uid}-obs`} className={rotulo}>
                      Observações <span className="font-normal normal-case tracking-normal text-pedra">(opcional)</span>
                    </label>
                    <span className="num text-sm text-pedra" aria-hidden="true">
                      {obs.length}/{LIMITE_OBS}
                    </span>
                  </div>
                  <textarea
                    id={`${uid}-obs`}
                    name="observacoes"
                    rows={3}
                    maxLength={LIMITE_OBS}
                    aria-describedby={`${uid}-obs-dica`}
                    placeholder="Se quiser, conte o que você procura."
                    value={obs}
                    onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                    className={`${campo} resize-y`}
                  />
                  <p id={`${uid}-obs-dica`} className="mt-2 text-sm text-pedra">
                    Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.
                    <span className="sr-only"> Limite de {LIMITE_OBS} caracteres.</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={status === 'abrindo'}
                  aria-busy={status === 'abrindo'}
                  className="group relative mt-9 inline-flex min-h-14 w-full cursor-pointer items-center justify-center overflow-hidden bg-preto px-6 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-osso transition-colors duration-300 hover:text-preto focus-visible:text-preto disabled:cursor-progress"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-champanhe transition-transform duration-500 ease-[var(--ease-corte)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
                  />
                  <span className="relative">
                    {status === 'abrindo' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                  </span>
                </button>
                <p id={`${uid}-privacidade`} className="mt-4 text-sm text-pedra">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="underline underline-offset-4">
                    Privacidade
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 8"
      className="pointer-events-none absolute right-4 top-1/2 mt-1 h-2 w-3 -translate-y-1/2"
      fill="none"
    >
      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
