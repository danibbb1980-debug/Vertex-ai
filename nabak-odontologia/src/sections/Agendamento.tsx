import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { formatDataBR, horarioDoDia, horariosDisponiveis, isoHoje, parseDataLocal, resumoHorarios } from '../lib/horarios'
import { waLink } from '../lib/whatsapp'
import { IconCheck, IconWhatsApp } from '../components/Icons'
import { Reveal, useSpotlight } from '../components/motion'
import { SectionHead } from '../components/SectionHead'

const OPCOES_EXTRA = ['Primeira avaliação', 'Ainda não sei, quero conversar']
const MSG_DIA_FECHADO = 'Dia sem atendimento, escolha outra data'

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario', string>>

export function Agendamento() {
  const uid = useId()
  const ids = {
    nome: `${uid}-nome`,
    atendimento: `${uid}-atend`,
    data: `${uid}-data`,
    horario: `${uid}-hora`,
    obs: `${uid}-obs`,
  }
  const limite = CONFIG.agendamento.limiteObservacoes
  const opcoes = [...CONFIG.atendimentos.map((a) => a.nome), ...OPCOES_EXTRA]

  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{ url: string; bloqueado: boolean } | null>(null)
  const nomeRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef<HTMLInputElement>(null)
  const horaRef = useRef<HTMLSelectElement>(null)
  const atendRef = useRef<HTMLSelectElement>(null)
  const { ref: cardRef, onPointerMove } = useSpotlight<HTMLDivElement>()

  const hoje = isoHoje()
  const diasAbertos = resumoHorarios()
    .filter((h) => h.horas !== 'Fechado')
    .map((h) => h.dias.toLowerCase())
    .join(', ')
  const diaFechado = (iso: string) => {
    const d = parseDataLocal(iso)
    return !d || !horarioDoDia(d.getDay())
  }
  const horarios = useMemo(() => (data && !diaFechado(data) ? horariosDisponiveis(data) : []), [data])

  const validarData = (iso: string): string | undefined => {
    if (!iso) return undefined
    if (iso < hoje) return 'Escolha uma data a partir de hoje.'
    if (diaFechado(iso)) return MSG_DIA_FECHADO
    if (!horariosDisponiveis(iso).length) return 'Não há mais horários neste dia. Escolha outra data.'
    return undefined
  }

  const onData = (iso: string) => {
    setData(iso)
    setHorario('')
    setErros((e) => ({ ...e, data: validarData(iso), horario: undefined }))
  }

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome completo.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha o atendimento desejado.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (data && !ed && horario && !horarios.includes(horario)) e.horario = 'Escolha um horário da lista.'
    return e
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      if (e.nome) nomeRef.current?.focus()
      else if (e.atendimento) atendRef.current?.focus()
      else if (e.data) dataRef.current?.focus()
      else horaRef.current?.focus()
      return
    }
    setEnviando(true)
    const msg = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? formatDataBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = waLink(msg)
    // abre sem "noopener" na feature string para detectar bloqueio, e zera opener em seguida
    const w = window.open(url, '_blank')
    if (w) {
      try {
        w.opener = null
      } catch {
        /* ignore */
      }
    }
    setResultado({ url, bloqueado: !w })
    setEnviando(false)
  }

  const limpar = () => {
    setResultado(null)
    setNome('')
    setAtendimento('')
    setData('')
    setHorario('')
    setObs('')
    setErros({})
    requestAnimationFrame(() => nomeRef.current?.focus())
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `${uid}-${campo}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  if (!CONFIG.whatsapp) return null

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="relative overflow-hidden bg-cream py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-[34rem] w-[26rem] rounded-[50%] border border-copper/25" />
      <div className="container-n relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:pt-6">
          <SectionHead eyebrow="Praticidade" id="agendar-titulo" title="Peça seu horário em poucos *cliques*.">
            <p>
              Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a
              disponibilidade.
            </p>
          </SectionHead>
          <Reveal delay={0.2}>
            <ul className="mt-10 space-y-4 text-[0.975rem] text-ink">
              {[
                'Os horários escolhidos são preferências, sujeitas à confirmação da clínica.',
                'Não pedimos telefone, e-mail ou documentos: o próprio WhatsApp identifica o contato.',
                'Nada do que você digita fica guardado neste site.',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <IconCheck size={18} className="mt-1 shrink-0 text-copper-ink" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            ref={cardRef}
            onPointerMove={onPointerMove}
            className="spotlight rounded-[2rem] border border-line bg-paper p-6 shadow-[0_40px_80px_-50px_rgba(43,33,28,0.45)] sm:p-9 md:p-11"
          >
            {CONFIG.agendamento.urgencia && (
              <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-espresso">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-12">
                  <IconWhatsApp size={18} /> WhatsApp
                </a>
              </div>
            )}

            <div aria-live="polite" aria-atomic="true">
              {resultado && (
                <div className="flex flex-col items-start">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-copper-ink">
                    <IconCheck size={24} />
                  </span>
                  <h3 className="mt-6 font-serif text-[2rem] leading-tight text-espresso">
                    {resultado.bloqueado ? 'Quase lá.' : 'Solicitação preparada.'}
                  </h3>
                  {resultado.bloqueado ? (
                    <p className="mt-3 text-ink">
                      O navegador impediu a abertura automática do WhatsApp. Toque no botão abaixo para abrir a conversa com sua solicitação. É só enviar a
                      mensagem. A equipe confirma a disponibilidade.
                    </p>
                  ) : (
                    <p className="mt-3 text-ink">
                      Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                    </p>
                  )}
                  <a
                    href={resultado.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn mt-8 ${resultado.bloqueado ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    <IconWhatsApp size={18} /> Abrir WhatsApp
                  </a>
                  <button type="button" onClick={limpar} className="link-arrow mt-4">
                    Fazer outra solicitação
                  </button>
                </div>
              )}
            </div>

            {!resultado && (
              <form noValidate onSubmit={onSubmit} aria-describedby={`${uid}-aviso`}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor={ids.nome} className="field-label">
                      Nome completo <span className="text-copper-ink" aria-hidden>*</span>
                      <span className="sr-only">(obrigatório)</span>
                    </label>
                    <input
                      ref={nomeRef}
                      id={ids.nome}
                      name="nome"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={80}
                      placeholder="Como devemos te chamar?"
                      className="field"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value)
                        if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                      }}
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={desc('nome')}
                    />
                    {erros.nome && (
                      <p id={`${uid}-nome-erro`} className="field-error">
                        {erros.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={ids.atendimento} className="field-label">
                      Atendimento desejado{' '}
                      {CONFIG.agendamento.exigirAtendimento ? (
                        <>
                          <span className="text-copper-ink" aria-hidden>*</span>
                          <span className="sr-only">(obrigatório)</span>
                        </>
                      ) : (
                        <span className="font-normal text-muted">(opcional)</span>
                      )}
                    </label>
                    <select
                      ref={atendRef}
                      id={ids.atendimento}
                      name="atendimento"
                      className="field"
                      value={atendimento}
                      required={CONFIG.agendamento.exigirAtendimento}
                      onChange={(e) => {
                        setAtendimento(e.target.value)
                        if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                      }}
                      aria-invalid={Boolean(erros.atendimento)}
                      aria-describedby={desc('atendimento')}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {erros.atendimento && (
                      <p id={`${uid}-atendimento-erro`} className="field-error">
                        {erros.atendimento}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor={ids.data} className="field-label">
                        Data preferida <span className="font-normal text-muted">(opcional)</span>
                      </label>
                      <input
                        ref={dataRef}
                        id={ids.data}
                        name="data"
                        type="date"
                        min={hoje}
                        className="field"
                        value={data}
                        onChange={(e) => onData(e.target.value)}
                        aria-invalid={Boolean(erros.data)}
                        aria-describedby={desc('data', `${uid}-data-dica`)}
                      />
                      <p id={`${uid}-data-dica`} className="mt-1.5 text-[0.8125rem] text-muted">
                        Atendimento: {diasAbertos}.
                      </p>
                      {erros.data && (
                        <p id={`${uid}-data-erro`} className="field-error">
                          {erros.data}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={ids.horario} className="field-label">
                        Horário preferido <span className="font-normal text-muted">(opcional)</span>
                      </label>
                      <select
                        ref={horaRef}
                        id={ids.horario}
                        name="horario"
                        className="field"
                        value={horario}
                        disabled={!horarios.length}
                        onChange={(e) => {
                          setHorario(e.target.value)
                          if (erros.horario) setErros((x) => ({ ...x, horario: undefined }))
                        }}
                        aria-invalid={Boolean(erros.horario)}
                        aria-describedby={desc('horario', `${uid}-hora-dica`)}
                      >
                        <option value="">Escolha um horário</option>
                        {horarios.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <p id={`${uid}-hora-dica`} className="mt-1.5 text-[0.8125rem] text-muted">
                        {data ? 'Sujeito à confirmação da clínica.' : 'Escolha uma data para ver os horários.'}
                      </p>
                      {erros.horario && (
                        <p id={`${uid}-horario-erro`} className="field-error">
                          {erros.horario}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <label htmlFor={ids.obs} className="field-label">
                        Observações <span className="font-normal text-muted">(opcional)</span>
                      </label>
                      <span className="text-[0.8125rem] text-muted" aria-hidden>
                        {obs.length}/{limite}
                      </span>
                    </div>
                    <textarea
                      id={ids.obs}
                      name="observacoes"
                      rows={3}
                      maxLength={limite}
                      placeholder="Se quiser, conte o que você precisa."
                      className="field min-h-[6.5rem] resize-y"
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, limite))}
                      aria-describedby={`${uid}-obs-dica`}
                    />
                    <p id={`${uid}-obs-dica`} className="mt-1.5 text-[0.8125rem] text-muted">
                      Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp. Limite de {limite} caracteres.
                    </p>
                  </div>
                </div>

                <button type="submit" disabled={enviando} aria-busy={enviando} className="btn btn-primary mt-9 w-full whitespace-nowrap px-4 text-[0.875rem] disabled:opacity-70 sm:px-7 sm:text-[0.9375rem]">
                  <IconWhatsApp size={18} />
                  {enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                </button>

                <p id={`${uid}-aviso`} className="mt-5 text-center text-[0.8125rem] leading-relaxed text-muted">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="text-copper-ink underline underline-offset-2">
                    Privacidade
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
