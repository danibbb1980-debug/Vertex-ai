import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { CONFIG, nomeCompleto, temHorarios, waLink, type Horario } from '../config'
import { Seta } from './Icones'
import { dois } from './Margem'

const NAO_SEI = 'Ainda não sei, quero conversar'
const MAX_OBS = 300

const paraMin = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + (b || 0)
}
const paraHora = (m: number) => `${dois(Math.floor(m / 60))}:${dois(m % 60)}`

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`
}
function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}
function horarioDoDia(iso: string): Horario | undefined {
  if (!iso) return undefined
  return CONFIG.horarios.find((h) => h.dia === diaDaSemana(iso))
}
/** Blocos de 1 hora, sem pausas e sem o horário de fechamento. */
function blocos(h: Horario | undefined, iso: string) {
  if (!h) return []
  const out: string[] = []
  const agora = new Date()
  const ehHoje = iso === hojeISO()
  for (let m = paraMin(h.abre); m + 60 <= paraMin(h.fecha); m += 60) {
    if (h.pausa && m < paraMin(h.pausa.fim) && m + 60 > paraMin(h.pausa.inicio)) continue
    if (ehHoje && m <= agora.getHours() * 60 + agora.getMinutes()) continue
    out.push(paraHora(m))
  }
  return out
}

type Erros = Partial<Record<'nome' | 'data' | 'hora' | 'obs', string>>

export function Agendar({ fls }: { fls: number }) {
  const uid = useId()
  const reduz = useReducedMotion()
  const [nome, setNome] = useState('')
  const [area, setArea] = useState('')
  const [pref, setPref] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [bloqueado, setBloqueado] = useState(false)
  const nomeRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef<HTMLInputElement>(null)
  const horaRef = useRef<HTMLSelectElement>(null)
  const sucessoRef = useRef<HTMLDivElement>(null)

  const hDia = horarioDoDia(data)
  const opcoesHora = useMemo(() => blocos(hDia, data), [hDia, data])

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome completo.'
    if (temHorarios) {
      if (data) {
        if (data < hojeISO()) e.data = 'Escolha uma data a partir de hoje.'
        else if (!hDia) e.data = 'Dia sem atendimento, escolha outra data.'
        else if (opcoesHora.length === 0) e.data = 'Não há horários disponíveis nesta data, escolha outra.'
      }
      if (data && hDia && !hora && !e.data) e.hora = 'Escolha um horário ou deixe a data em branco.'
    }
    if (obs.length > MAX_OBS) e.obs = `Use no máximo ${MAX_OBS} caracteres.`
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (e.nome) return nomeRef.current?.focus()
    if (e.data) return dataRef.current?.focus()
    if (e.hora) return horaRef.current?.focus()
    if (e.obs) return

    setEnviando(true)
    let preferencia = 'a combinar'
    if (temHorarios && data && hora) {
      const [y, m, d] = data.split('-')
      preferencia = `${d}/${m}/${y} às ${hora}`
    } else if (!temHorarios && pref.trim()) preferencia = pref.trim()

    const mensagem = [
      `Olá! Vim pelo site do advogado ${nomeCompleto} e gostaria de solicitar um atendimento.`,
      `Nome: ${nome.trim()}`,
      `Área: ${area && area !== NAO_SEI ? area : 'a definir'}`,
      `Preferência de dia e horário: ${preferencia}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = waLink(mensagem)

    // abre a aba sincronamente (gesto do usuário) e corta o vínculo com esta página
    const w = window.open('', '_blank')
    if (w) {
      w.opener = null
      w.location.href = link
    }
    setBloqueado(!w)
    setUrl(link)
    setEnviando(false)
    requestAnimationFrame(() => sucessoRef.current?.focus())
  }

  const novo = () => {
    setUrl(null)
    setBloqueado(false)
    requestAnimationFrame(() => nomeRef.current?.focus())
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `${uid}-${campo}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  const Erro = ({ campo }: { campo: keyof Erros }) =>
    erros[campo] ? (
      <p id={`${uid}-${campo}-erro`} className="mt-2 text-[14px] font-semibold text-erro">
        {erros[campo]}
      </p>
    ) : null

  const anim = reduz
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35 } }

  return (
    <section id="agendar" data-fls={fls} aria-labelledby="agendar-titulo" className="folha relative border-t border-fio py-20 md:py-32">
      <p className="rotulo fls fls-margem hidden md:top-32 md:flex" aria-hidden="true">
        <span>fls.</span>
        <span className="tabular">{dois(fls)}</span>
      </p>
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="rotulo flex items-center gap-3 text-apoio">
            <span className="fls md:hidden">fls. {dois(fls)}</span>
            Praticidade
          </p>
          <h2 id="agendar-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,3.75rem)]">
            Peça seu atendimento em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-[26rem] text-apoio">
            Escolha a área e conte sua preferência de dia e horário. Sua solicitação chega pelo WhatsApp e o advogado
            confirma a disponibilidade. A preferência informada está sujeita a essa confirmação.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="relative border border-grafite bg-papel">
            {/* margem azul do cartão */}
            <span className="absolute top-0 bottom-0 left-[38px] w-px bg-caneta md:left-[46px]" aria-hidden="true" />
            <div className="flex items-center justify-between border-b border-grafite py-2.5 pr-4 pl-[54px] md:pl-[64px]">
              <span className="rotulo">Solicitação de atendimento</span>
              <span className="rotulo fls whitespace-nowrap">fls. {dois(fls)}</span>
            </div>

            <div className="py-8 pr-5 pl-[54px] md:py-10 md:pr-10 md:pl-[64px]">
              <LazyMotion features={domAnimation} strict>
              <AnimatePresence mode="wait" initial={false}>
                {url ? (
                  <m.div key="ok" {...anim}>
                    <div ref={sucessoRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
                      <p className="serif text-[26px] leading-snug">Pronto!</p>
                      <p className="mt-3">
                        Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. O advogado confirma a
                        disponibilidade.
                      </p>
                      {bloqueado && (
                        <p className="mt-3 text-[15px] text-apoio">O navegador não abriu uma nova aba. Use o link abaixo.</p>
                      )}
                    </div>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-tinta">
                        Abrir WhatsApp
                        <Seta />
                      </a>
                      <button type="button" onClick={novo} className="btn btn-linha">
                        Fazer outra solicitação
                      </button>
                    </div>
                  </m.div>
                ) : (
                  <m.form key="form" {...anim} noValidate onSubmit={enviar} aria-describedby={`${uid}-aviso`}>
                    <div className="space-y-7">
                      <div>
                        <label htmlFor={`${uid}-nome`} className="rotulo block text-apoio">
                          Nome completo <span aria-hidden="true">*</span>
                          <span className="sr-only">(obrigatório)</span>
                        </label>
                        <input
                          ref={nomeRef}
                          id={`${uid}-nome`}
                          className="campo mt-1"
                          type="text"
                          autoComplete="name"
                          placeholder="Como devemos te chamar?"
                          required
                          maxLength={80}
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          aria-invalid={!!erros.nome}
                          aria-describedby={desc('nome')}
                        />
                        <Erro campo="nome" />
                      </div>

                      <div>
                        <label htmlFor={`${uid}-area`} className="rotulo block text-apoio">
                          Área desejada
                        </label>
                        <select id={`${uid}-area`} className="campo mt-1" value={area} onChange={(e) => setArea(e.target.value)}>
                          <option value="">Selecione</option>
                          {CONFIG.areas.map((a) => (
                            <option key={a.nome} value={a.nome}>
                              {a.nome}
                            </option>
                          ))}
                          <option value={NAO_SEI}>{NAO_SEI}</option>
                        </select>
                      </div>

                      {temHorarios ? (
                        <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
                          <div>
                            <label htmlFor={`${uid}-data`} className="rotulo block text-apoio">
                              Data de preferência (opcional)
                            </label>
                            <input
                              ref={dataRef}
                              id={`${uid}-data`}
                              type="date"
                              className="campo mt-1"
                              min={hojeISO()}
                              value={data}
                              onChange={(e) => {
                                setData(e.target.value)
                                setHora('')
                                const h = horarioDoDia(e.target.value)
                                setErros((x) => ({
                                  ...x,
                                  data: e.target.value && !h ? 'Dia sem atendimento, escolha outra data.' : undefined,
                                  hora: undefined,
                                }))
                              }}
                              aria-invalid={!!erros.data}
                              aria-describedby={desc('data', `${uid}-dias`)}
                            />
                            <p id={`${uid}-dias`} className="mt-2 text-[13px] text-apoio">
                              Dias de atendimento:{' '}
                              {CONFIG.horarios
                                .map((h) => ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][h.dia])
                                .join(', ')}
                              .
                            </p>
                            <Erro campo="data" />
                          </div>
                          <div>
                            <label htmlFor={`${uid}-hora`} className="rotulo block text-apoio">
                              Horário
                            </label>
                            <select
                              ref={horaRef}
                              id={`${uid}-hora`}
                              className="campo mt-1"
                              value={hora}
                              disabled={!data || !hDia}
                              onChange={(e) => setHora(e.target.value)}
                              aria-invalid={!!erros.hora}
                              aria-describedby={desc('hora')}
                            >
                              <option value="">{data && hDia ? 'Selecione' : 'Escolha a data'}</option>
                              {opcoesHora.map((h) => (
                                <option key={h} value={h}>
                                  {h}
                                </option>
                              ))}
                            </select>
                            <Erro campo="hora" />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label htmlFor={`${uid}-pref`} className="rotulo block text-apoio">
                            Melhor dia e horário (opcional)
                          </label>
                          <input
                            id={`${uid}-pref`}
                            className="campo mt-1"
                            type="text"
                            maxLength={60}
                            placeholder="Ex.: terça à tarde"
                            value={pref}
                            onChange={(e) => setPref(e.target.value)}
                          />
                        </div>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between gap-4">
                          <label htmlFor={`${uid}-obs`} className="rotulo block text-apoio">
                            Observações (opcional)
                          </label>
                          <span className="rotulo tabular text-[11px] text-apoio" aria-hidden="true">
                            {obs.length}/{MAX_OBS}
                          </span>
                        </div>
                        <textarea
                          id={`${uid}-obs`}
                          className="campo mt-1"
                          rows={3}
                          maxLength={MAX_OBS}
                          placeholder="Se quiser, conte o que você precisa."
                          value={obs}
                          onChange={(e) => setObs(e.target.value)}
                          aria-invalid={!!erros.obs}
                          aria-describedby={desc('obs', `${uid}-obs-ajuda`)}
                        />
                        <p id={`${uid}-obs-ajuda`} className="mt-2 text-[13px] leading-relaxed text-apoio">
                          Não é preciso detalhar o caso aqui, nem enviar documentos ou dados sigilosos. Conversamos com
                          calma pelo WhatsApp.
                        </p>
                        <Erro campo="obs" />
                      </div>
                    </div>

                    <div aria-live="polite" className="sr-only">
                      {Object.values(erros).filter(Boolean).length > 0 ? 'Há campos para corrigir no formulário.' : ''}
                    </div>

                    <button type="submit" className="btn btn-tinta mt-9 w-full sm:w-auto" disabled={enviando} aria-busy={enviando}>
                      {enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                      <Seta />
                    </button>
                    <p id={`${uid}-aviso`} className="mt-4 text-[13px] leading-relaxed text-apoio">
                      Ao enviar, você abre uma conversa no WhatsApp com o advogado. Este site não guarda os dados
                      digitados.{' '}
                      <a href="/privacidade.html" className="link">
                        Privacidade
                      </a>
                    </p>
                  </m.form>
                )}
              </AnimatePresence>
              </LazyMotion>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
