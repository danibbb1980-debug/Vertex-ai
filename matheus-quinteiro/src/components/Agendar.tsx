import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, atendimentosAtivos, linkWhatsapp } from '../config'
import { RevealTitle, SectionHead } from './ui'

type Erros = Partial<Record<'nome' | 'data' | 'horario', string>>

/** Hoje (aaaa-mm-dd) no fuso do consultório. */
function hojeISO() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CONFIG.fusoHorario,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  return parts // en-CA => 2026-11-25
}

/** Dia da semana de uma data aaaa-mm-dd (sem efeito de fuso). */
export function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** Blocos de 1 hora, do horário de abertura até 1 hora antes de fechar. */
export function horariosDoDia(iso: string): string[] {
  if (!iso) return []
  const h = CONFIG.horarios.find((x) => x.dia === diaDaSemana(iso))
  if (!h || !h.abre || !h.fecha) return []
  const ini = Number(h.abre.split(':')[0])
  const fim = Number(h.fecha.split(':')[0])
  const out: string[] = []
  for (let t = ini; t + 1 <= fim; t++) out.push(`${String(t).padStart(2, '0')}:00`)
  return out
}

const brData = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function Agendar({ n }: { n: string }) {
  const uid = useId()
  const ids = {
    nome: `${uid}-nome`,
    atend: `${uid}-atend`,
    data: `${uid}-data`,
    hora: `${uid}-hora`,
    obs: `${uid}-obs`,
  }
  const [hoje, setHoje] = useState('')
  const [nome, setNome] = useState('')
  const [atend, setAtend] = useState('Consulta')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<{ url: string; bloqueado: boolean } | null>(null)
  const [enviando, setEnviando] = useState(false)
  const okRef = useRef<HTMLDivElement>(null)
  const nomeRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef<HTMLInputElement>(null)
  const horaRef = useRef<HTMLSelectElement>(null)

  useEffect(() => setHoje(hojeISO()), [])

  const opcoesHora = useMemo(() => horariosDoDia(data), [data])
  const opcoesAtend = ['Consulta', ...atendimentosAtivos().map((a) => a.nome), 'Ainda não sei, quero conversar']

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (hoje && v < hoje) return 'Essa data já passou. Escolha a partir de hoje.'
    if (horariosDoDia(v).length === 0) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  function onData(v: string) {
    setData(v)
    setHorario('')
    setErros((e) => ({ ...e, data: validarData(v), horario: undefined }))
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a mensagem.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (data && !ed && horario && !opcoesHora.includes(horario)) e.horario = 'Escolha um horário dentro do atendimento desse dia.'
    setErros(e)
    if (e.nome) return nomeRef.current?.focus()
    if (e.data) return dataRef.current?.focus()
    if (e.horario) return horaRef.current?.focus()

    const atendimento = atend === 'Ainda não sei, quero conversar' ? 'a definir' : atend
    const msg = [
      `Olá! Vim pelo site do ${CONFIG.nome} e gostaria de solicitar um agendamento.`,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento}`,
      `Data preferida: ${data ? brData(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = linkWhatsapp(msg)
    setEnviando(true)
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    // Com "noopener" o retorno é null mesmo quando abre; checamos a perda de foco para detectar bloqueio.
    let abriu = !!w
    const onBlur = () => (abriu = true)
    window.addEventListener('blur', onBlur, { once: true })
    window.setTimeout(() => {
      window.removeEventListener('blur', onBlur)
      setEnviando(false)
      setEnviado({ url, bloqueado: !abriu && document.hasFocus() })
      requestAnimationFrame(() => okRef.current?.focus())
    }, 450)
  }

  const desc = (k: keyof Erros) => (erros[k] ? `${ids[k === 'horario' ? 'hora' : k]}-err` : undefined)

  return (
    <section id="agendar" className="section below" aria-labelledby="agendar-title">
      <div className="wrap grid12" style={{ rowGap: 'var(--s-5)' }}>
        <div className="col-span-4 md:col-span-5">
          <SectionHead n={n} label="Praticidade" />
          <RevealTitle
            id="agendar-title"
            className="title"
            lines={[
              'Peça sua consulta',
              <>
                em poucos <em style={{ fontFamily: 'var(--font-text)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.02em' }}>cliques</em>.
              </>,
            ]}
          />
          <p className="prose muted" style={{ marginTop: 'var(--s-4)', maxWidth: '40ch' }}>
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega pelo WhatsApp, e a confirmação
            da disponibilidade é feita pelo WhatsApp.
          </p>
        </div>

        <div className="col-span-4 md:col-start-7 md:col-span-6">
          <div className="form-card">
            <div className="form-card-head">
              <span className="label">Solicitação</span>
              <span className="ticks" aria-hidden="true">
                {Array.from({ length: 13 }).map((_, i) => (
                  <i key={i} />
                ))}
              </span>
            </div>

            {enviado ? (
              <div className="ok-box" style={{ margin: 'var(--s-3)' }} ref={okRef} tabIndex={-1} role="status">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem.
                </p>
                <p className="muted" style={{ margin: 'var(--s-1) 0 0' }}>
                  A confirmação da disponibilidade é feita pelo WhatsApp.
                </p>
                <p style={{ margin: 'var(--s-2) 0 0', fontSize: '0.9375rem' }}>
                  {enviado.bloqueado ? 'O navegador pode ter bloqueado a nova aba. ' : 'Se a conversa não abriu, '}
                  <a className="link-static" href={enviado.url} target="_blank" rel="noopener noreferrer">
                    Abrir WhatsApp
                  </a>
                  .
                </p>
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  style={{ marginTop: 'var(--s-3)' }}
                  onClick={() => setEnviado(null)}
                >
                  Voltar ao formulário
                </button>
              </div>
            ) : null}

            <form
              noValidate
              onSubmit={onSubmit}
              hidden={!!enviado}
              style={{ padding: 'var(--s-3)', display: 'grid', gap: 'var(--s-4)' }}
              aria-describedby={`${uid}-priv`}
            >
              <div className="field">
                <label htmlFor={ids.nome}>Nome completo</label>
                <input
                  ref={nomeRef}
                  id={ids.nome}
                  className="input"
                  name="nome"
                  autoComplete="name"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={!!erros.nome}
                  aria-describedby={desc('nome')}
                  required
                />
                <div aria-live="polite">
                  {erros.nome && (
                    <span className="err" id={`${ids.nome}-err`}>
                      {erros.nome}
                    </span>
                  )}
                </div>
              </div>

              <div className="field">
                <label htmlFor={ids.atend}>Atendimento desejado</label>
                <select id={ids.atend} className="input" value={atend} onChange={(e) => setAtend(e.target.value)}>
                  {opcoesAtend.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-[var(--s-4)] sm:grid-cols-2">
                <div className="field">
                  <label htmlFor={ids.data}>Data preferida</label>
                  <input
                    ref={dataRef}
                    id={ids.data}
                    type="date"
                    className="input tnum"
                    min={hoje || undefined}
                    value={data}
                    onChange={(e) => onData(e.target.value)}
                    aria-invalid={!!erros.data}
                    aria-describedby={[`${ids.data}-hint`, desc('data')].filter(Boolean).join(' ')}
                  />
                  <span className="hint" id={`${ids.data}-hint`}>
                    Sem atendimento aos domingos.
                  </span>
                  <div aria-live="polite">
                    {erros.data && (
                      <span className="err" id={`${ids.data}-err`}>
                        {erros.data}
                      </span>
                    )}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor={ids.hora}>Horário preferido</label>
                  <select
                    ref={horaRef}
                    id={ids.hora}
                    className="input tnum"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    disabled={!data || !!erros.data}
                    aria-invalid={!!erros.horario}
                    aria-describedby={[`${ids.hora}-hint`, desc('horario')].filter(Boolean).join(' ')}
                  >
                    <option value="">Escolha um horário</option>
                    {opcoesHora.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <span className="hint" id={`${ids.hora}-hint`}>
                    {data ? 'Horários de início, sujeitos à confirmação.' : 'Escolha a data primeiro.'}
                  </span>
                  <div aria-live="polite">
                    {erros.horario && (
                      <span className="err" id={`${ids.hora}-err`}>
                        {erros.horario}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor={ids.obs}>
                  Observações <span className="muted" style={{ fontWeight: 400 }}>(opcional)</span>
                </label>
                <textarea
                  id={ids.obs}
                  className="input"
                  maxLength={300}
                  placeholder="Se quiser, conte o que você procura."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-describedby={`${ids.obs}-hint`}
                />
                <span className="hint" id={`${ids.obs}-hint`}>
                  Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.{' '}
                  <span className="tnum">{`${obs.length}/300`}</span>
                </span>
              </div>

              <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
                <button className="btn" type="submit" disabled={enviando} aria-busy={enviando}>
                  <span className="dot" aria-hidden="true" />
                  {enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                </button>
                <p id={`${uid}-priv`} className="muted" style={{ fontSize: '0.8125rem', margin: 0, lineHeight: 1.5 }}>
                  Ao enviar, você abre uma conversa no WhatsApp com o {CONFIG.nome}. Este site não guarda os dados digitados.{' '}
                  <a className="link-static" href="/privacidade.html">
                    Privacidade
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
