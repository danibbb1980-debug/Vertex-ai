import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { formatarData, hojeISO, horarioDoDia, parseData, resumoHorarios, slotsDoDia, slotsGerais } from '../lib/horarios'
import { cn } from '../lib/cn'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { IconAlert, IconCheck, IconWhatsApp } from '../components/Icons'

const OUTRAS = ['Primeira avaliação', 'Ainda não sei, quero conversar']
const LIMITE_OBS = 300

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'hora' | 'obs', string>>

function validarData(iso: string, hoje: string): string | undefined {
  if (!iso) return
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return 'Informe uma data válida.'
  if (iso < hoje) return 'Escolha uma data a partir de hoje.'
  if (!horarioDoDia(parseData(iso).getDay())) return 'Dia sem atendimento, escolha outra data.'
}

export function Agendamento() {
  const uid = useId()
  const f = (k: string) => `${uid}-${k}`
  const [hoje, setHoje] = useState('')
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'idle' | 'abrindo' | 'ok' | 'bloqueado'>('idle')
  const [url, setUrl] = useState('')

  // Data mínima calculada no navegador (o HTML é pré-renderizado no build).
  useEffect(() => setHoje(hojeISO()), [])

  const opcoes = [...CONFIG.atendimentos.map((a) => a.titulo), ...OUTRAS]

  const slots = useMemo(() => {
    if (data && !validarData(data, hoje || data)) {
      const h = horarioDoDia(parseData(data).getDay())
      return h ? slotsDoDia(h) : []
    }
    return slotsGerais()
  }, [data, hoje])

  // Se a data mudar e o horário escolhido não existir mais, limpa.
  useEffect(() => {
    if (hora && !slots.includes(hora)) setHora('')
  }, [slots, hora])

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a equipe saber com quem vai falar.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const d = validarData(data, hoje)
    if (d) e.data = d
    if (obs.length > LIMITE_OBS) e.obs = `Use no máximo ${LIMITE_OBS} caracteres.`
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      const primeiro = (['nome', 'atendimento', 'data', 'hora', 'obs'] as const).find((k) => e[k])
      if (primeiro) document.getElementById(f(primeiro))?.focus()
      return
    }
    const msg = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? formatarData(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = waLink(msg)
    setUrl(link)
    setEstado('abrindo')
    // Abre no mesmo gesto do clique para não ser bloqueado; depois corta o vínculo com esta página.
    const w = window.open(link, '_blank')
    if (w) {
      try {
        w.opener = null
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setEstado('ok'), 450)
    } else {
      setEstado('bloqueado')
    }
  }

  const campo =
    'mt-2 block min-h-12 w-full rounded-[2px] border bg-paper px-4 py-3 text-[1rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft/80 focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/25'
  const borda = (k: keyof Erros) => (erros[k] ? 'border-error ring-1 ring-error/30' : 'border-ink/20')
  const Erro = ({ k }: { k: keyof Erros }) =>
    erros[k] ? (
      <p id={f(`${k}-erro`)} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-error">
        <IconAlert className="mt-0.5 size-4 shrink-0" />
        {erros[k]}
      </p>
    ) : null
  const desc = (k: keyof Erros, extra?: string) => [erros[k] ? f(`${k}-erro`) : '', extra ?? ''].filter(Boolean).join(' ') || undefined
  const Label = ({ k, children, opc }: { k: string; children: string; opc?: boolean }) => (
    <label htmlFor={f(k)} className="text-[0.92rem] font-semibold text-ink">
      {children}
      {opc ? <span className="ml-1.5 font-normal text-ink-soft">(opcional)</span> : <span className="ml-1 text-error" aria-hidden="true">*</span>}
    </label>
  )

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative overflow-hidden bg-ivory-2/70 py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div>
            <SectionHeading id="titulo-agendar" label="Praticidade" title="Peça seu horário em poucos *cliques*.">
              <p>
                Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e
                a equipe confirma a disponibilidade.
              </p>
              <p className="mt-4 text-base">
                O dia e o horário escolhidos são uma preferência. O agendamento só vale depois da confirmação da equipe.
              </p>
            </SectionHeading>
            <div aria-hidden="true" className="mt-12 hidden grid-cols-6 gap-1 lg:grid lg:w-48">
              {['bg-sage', 'bg-mint', '', 'bg-teal', 'bg-mint/60', '', '', 'bg-sage/60', 'bg-teal', 'bg-teal', 'bg-sage', 'bg-mint'].map((c, i) => (
                <span key={i} className={`block aspect-square ${c}`} />
              ))}
            </div>
          </div>
        </div>

        <Reveal className="lg:col-span-7">
          {CONFIG.agendamento.urgencia && (
            <div className="mb-4 flex flex-col gap-3 border border-error/30 bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-ink">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <a href={waLink('Olá! Estou com dor ou urgência e preciso de atendimento.')} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <IconWhatsApp className="size-5" /> Falar agora
              </a>
            </div>
          )}

          <div className="relative border border-ink/10 bg-paper p-6 sm:p-10">
            <span aria-hidden="true" className="absolute left-0 top-0 size-3 border-l border-t border-teal-deep" />
            <span aria-hidden="true" className="absolute bottom-0 right-0 size-3 border-b border-r border-teal-deep" />

            <div aria-live="polite" role="status">
              {(estado === 'ok' || estado === 'bloqueado') && (
                <div className="mb-8 border-l-2 border-teal-deep bg-mint/50 p-5">
                  {estado === 'ok' ? (
                    <>
                      <p className="flex items-start gap-2 font-semibold text-ink">
                        <IconCheck className="mt-0.5 size-5 shrink-0 text-teal-deep" />
                        Pronto! Abrimos o WhatsApp com sua solicitação.
                      </p>
                      <p className="mt-1 pl-7 text-ink-soft">É só enviar a mensagem. A equipe confirma a disponibilidade.</p>
                      <p className="mt-3 pl-7 text-sm text-ink-soft">
                        O WhatsApp não abriu?{' '}
                        <a href={url} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-teal-deep">
                          Abrir WhatsApp
                        </a>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-ink">O navegador bloqueou a nova aba.</p>
                      <p className="mt-1 text-ink-soft">Sua mensagem está pronta. Toque no botão abaixo para abrir o WhatsApp.</p>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4" onClick={() => setEstado('ok')}>
                        <IconWhatsApp className="size-5" /> Abrir WhatsApp
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>

            <form noValidate onSubmit={enviar} className="grid gap-6 sm:grid-cols-2" aria-describedby={f('nota')}>
              <div className="sm:col-span-2">
                <Label k="nome">Nome completo</Label>
                <input
                  id={f('nome')}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => erros.nome && setErros((p) => ({ ...p, nome: nome.trim().length < 2 ? p.nome : undefined }))}
                  aria-required="true"
                  aria-invalid={!!erros.nome}
                  aria-describedby={desc('nome')}
                  className={cn(campo, borda('nome'))}
                />
                <Erro k="nome" />
              </div>

              <div className="sm:col-span-2">
                <Label k="atendimento" opc={!CONFIG.agendamento.exigirAtendimento}>
                  Atendimento desejado
                </Label>
                <select
                  id={f('atendimento')}
                  name="atendimento"
                  value={atendimento}
                  onChange={(e) => {
                    setAtendimento(e.target.value)
                    setErros((p) => ({ ...p, atendimento: undefined }))
                  }}
                  aria-required={CONFIG.agendamento.exigirAtendimento || undefined}
                  aria-invalid={!!erros.atendimento}
                  aria-describedby={desc('atendimento')}
                  className={cn(campo, borda('atendimento'), 'appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10')}
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5l5-5' fill='none' stroke='%2316302b' stroke-width='1.5'/%3E%3C/svg%3E\")" }}
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

              <div>
                <Label k="data" opc>
                  Data preferida
                </Label>
                <input
                  id={f('data')}
                  name="data"
                  type="date"
                  min={hoje || undefined}
                  value={data}
                  onChange={(e) => {
                    const v = e.target.value
                    setData(v)
                    setErros((p) => ({ ...p, data: validarData(v, hoje) }))
                  }}
                  aria-invalid={!!erros.data}
                  aria-describedby={desc('data', f('data-dica'))}
                  className={cn(campo, borda('data'))}
                />
                <p id={f('data-dica')} className="mt-2 text-xs text-ink-soft">
                  Atendimento: {resumoHorarios().filter((h) => h.horas !== 'Fechado').map((h) => h.dias.toLowerCase()).join(', ')}.
                </p>
                <Erro k="data" />
              </div>

              <div>
                <Label k="hora" opc>
                  Horário preferido
                </Label>
                <select
                  id={f('hora')}
                  name="hora"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  disabled={!!erros.data}
                  aria-describedby={desc('hora')}
                  className={cn(campo, borda('hora'), 'appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10 disabled:cursor-not-allowed disabled:opacity-60')}
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5l5-5' fill='none' stroke='%2316302b' stroke-width='1.5'/%3E%3C/svg%3E\")" }}
                >
                  <option value="">Escolha um horário</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Erro k="hora" />
              </div>

              <div className="sm:col-span-2">
                <Label k="obs" opc>
                  Observações
                </Label>
                <textarea
                  id={f('obs')}
                  name="obs"
                  rows={3}
                  maxLength={LIMITE_OBS}
                  placeholder="Se quiser, conte o que você precisa."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-invalid={!!erros.obs}
                  aria-describedby={desc('obs', `${f('obs-dica')} ${f('obs-cont')}`)}
                  className={cn(campo, borda('obs'), 'resize-y')}
                />
                <div className="mt-2 flex items-start justify-between gap-4 text-xs text-ink-soft">
                  <p id={f('obs-dica')}>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                  <p id={f('obs-cont')} className="shrink-0 tabular-nums" aria-live="off">
                    {obs.length}/{LIMITE_OBS}
                  </p>
                </div>
                <Erro k="obs" />
              </div>

              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary w-full sm:w-auto" aria-busy={estado === 'abrindo'}>
                  {estado === 'abrindo' ? (
                    <>
                      <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                      Abrindo o WhatsApp…
                    </>
                  ) : (
                    <>
                      <IconWhatsApp className="size-5" />
                      Enviar solicitação pelo WhatsApp
                    </>
                  )}
                </button>
                <p id={f('nota')} className="mt-4 text-sm leading-relaxed text-ink-soft">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="link-underline font-medium text-teal-deep">
                    Política de privacidade
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
