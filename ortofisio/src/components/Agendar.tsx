import { useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, waLink } from '../config'
import { IconeWhatsApp } from './icones'

// O formulário só monta uma mensagem e abre o WhatsApp da clínica.
// Nada é enviado a servidor, nada é guardado (sem localStorage, sem cookies).

const pad = (n: number) => String(n).padStart(2, '0')
const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const diaDaSemana = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).getDay()
}
const paraBR = (iso: string) => iso.split('-').reverse().join('/')
const minutos = (h: string) => {
  const [hh, mm] = h.split(':').map(Number)
  return hh * 60 + mm
}
const paraHora = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`

export function horariosDoDia(iso: string): string[] {
  if (!iso) return []
  const dia = diaDaSemana(iso)
  const h = CONFIG.horarios.find((x) => x.dias.includes(dia as never))
  if (!h) return []
  const lista: string[] = []
  for (let t = minutos(h.abre); t + 60 <= minutos(h.fecha); t += 60) {
    const a = CONFIG.almoco
    if (a && t < minutos(a.fim) && t + 60 > minutos(a.inicio)) continue
    lista.push(paraHora(t))
  }
  return lista
}

const diaAberto = (iso: string) => horariosDoDia(iso).length > 0

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario', string>>

export function Agendar() {
  const opcoes = [...CONFIG.atendimentos.map((a) => a.nome), 'Primeira avaliação', 'Ainda não sei, quero conversar']

  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<null | { url: string; bloqueado: boolean }>(null)
  const [abrindo, setAbrindo] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const confirmacaoRef = useRef<HTMLDivElement>(null)

  const slots = useMemo(() => (data && diaAberto(data) ? horariosDoDia(data) : []), [data])
  const limite = CONFIG.agendamento.limiteObservacoes

  if (!CONFIG.whatsapp) return null

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined
    if (v < hojeISO()) return 'Escolha uma data a partir de hoje.'
    if (!diaAberto(v)) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  const onData = (v: string) => {
    setData(v)
    setHorario('')
    setErros((e) => ({ ...e, data: validarData(v) }))
  }

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a clínica saber com quem está falando.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const ed = validarData(data)
    if (ed) e.data = ed
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (Object.keys(e) as (keyof Erros)[])[0]
    if (primeiro) {
      formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus()
      return
    }
    setAbrindo(true)
    const mensagem = [
      CONFIG.mensagens.formulario,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? paraBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = waLink(mensagem)
    const janela = window.open(url, '_blank')
    if (janela) janela.opener = null
    setAbrindo(false)
    setEnviado({ url, bloqueado: !janela })
    requestAnimationFrame(() => confirmacaoRef.current?.focus())
  }

  const recomecar = () => {
    setEnviado(null)
    setNome('')
    setAtendimento('')
    setData('')
    setHorario('')
    setObs('')
    setErros({})
  }

  const descr = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `erro-${campo}` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-papel py-24 md:py-36">
      <div className="mx-auto grid max-w-[86rem] gap-12 px-5 md:grid-cols-12 md:gap-x-6 lg:gap-x-8 md:px-10">
        <div className="md:col-span-5">
          <p className="rotulo">Praticidade</p>
          <h2 id="titulo-agendar" className="titulo-secao mt-5">
            Peça seu horário em poucos <span className="enfase">cliques</span>.
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg">
            Escolha o atendimento e o dia e horário que preferir. Sua solicitação chega à clínica pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
          <p className="mt-4 max-w-[40ch] text-salvia-escuro">
            Data e horário são preferências. O horário só fica marcado depois da resposta da clínica.
          </p>
        </div>

        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
          <div className="rounded-[1.75rem] rounded-tl-[3rem] border border-ardosia/15 bg-white p-6 sm:p-9">
            {enviado ? (
              <div ref={confirmacaoRef} tabIndex={-1} role="status" className="outline-none">
                <p className="font-display text-[1.9rem] font-light leading-tight tracking-[-0.02em] text-ardosia">
                  Pronto! Abrimos o WhatsApp com sua solicitação.
                </p>
                <p className="mt-4">É só enviar a mensagem. A equipe confirma a disponibilidade.</p>
                {enviado.bloqueado && (
                  <p className="mt-4 text-salvia-escuro">
                    Se a nova aba não abriu, use o botão abaixo.
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={enviado.url} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                    <IconeWhatsApp />
                    Abrir WhatsApp
                  </a>
                  <button type="button" onClick={recomecar} className="btn btn-secundario">
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={enviar} noValidate aria-busy={abrindo}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="f-nome" className="mb-2 block font-semibold text-ardosia">
                      Nome completo <span className="font-normal text-salvia-escuro">(obrigatório)</span>
                    </label>
                    <input
                      id="f-nome"
                      name="nome"
                      className="campo"
                      autoComplete="name"
                      placeholder="Como devemos te chamar?"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      aria-required="true"
                      aria-invalid={!!erros.nome}
                      aria-describedby={descr('nome')}
                    />
                    <Erro id="erro-nome" texto={erros.nome} />
                  </div>

                  <div>
                    <label htmlFor="f-atendimento" className="mb-2 block font-semibold text-ardosia">
                      Atendimento desejado{' '}
                      {!CONFIG.agendamento.exigirAtendimento && <span className="font-normal text-salvia-escuro">(opcional)</span>}
                    </label>
                    <select
                      id="f-atendimento"
                      name="atendimento"
                      className="campo"
                      value={atendimento}
                      onChange={(e) => setAtendimento(e.target.value)}
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={descr('atendimento')}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Erro id="erro-atendimento" texto={erros.atendimento} />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="f-data" className="mb-2 block font-semibold text-ardosia">
                        Data preferida <span className="font-normal text-salvia-escuro">(opcional)</span>
                      </label>
                      <input
                        id="f-data"
                        name="data"
                        type="date"
                        className="campo tabular"
                        min={hojeISO()}
                        value={data}
                        onChange={(e) => onData(e.target.value)}
                        aria-invalid={!!erros.data}
                        aria-describedby={descr('data', 'ajuda-data')}
                      />
                      <p id="ajuda-data" className="mt-2 text-[0.85rem] text-salvia-escuro">
                        Segunda a sexta. Sábado e domingo a clínica fica fechada.
                      </p>
                      <Erro id="erro-data" texto={erros.data} />
                    </div>
                    <div>
                      <label htmlFor="f-horario" className="mb-2 block font-semibold text-ardosia">
                        Horário preferido <span className="font-normal text-salvia-escuro">(opcional)</span>
                      </label>
                      <select
                        id="f-horario"
                        name="horario"
                        className="campo tabular"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        disabled={!slots.length}
                        aria-describedby={!slots.length ? 'ajuda-horario' : undefined}
                      >
                        <option value="">Escolha um horário</option>
                        {slots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {!slots.length && (
                        <p id="ajuda-horario" className="mt-2 text-[0.85rem] text-salvia-escuro">
                          Escolha uma data para ver os horários.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="f-obs" className="mb-2 block font-semibold text-ardosia">
                      Observações <span className="font-normal text-salvia-escuro">(opcional)</span>
                    </label>
                    <textarea
                      id="f-obs"
                      name="obs"
                      className="campo"
                      maxLength={limite}
                      placeholder="Se quiser, conte o que você precisa."
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      aria-describedby="ajuda-obs contador-obs"
                    />
                    <div className="mt-2 flex justify-between gap-4 text-[0.85rem] text-salvia-escuro">
                      <p id="ajuda-obs">Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                      <p id="contador-obs" className="tabular shrink-0" aria-live="polite">
                        {obs.length}/{limite}
                      </p>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primario mt-8 w-full" disabled={abrindo}>
                  <IconeWhatsApp />
                  {abrindo ? 'Abrindo o WhatsApp...' : 'Enviar solicitação pelo WhatsApp'}
                </button>
                <p className="mt-4 text-[0.85rem] leading-relaxed text-salvia-escuro">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="link-fino text-ardosia">
                    Saiba como funciona a privacidade
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Erro({ id, texto }: { id: string; texto?: string }) {
  return (
    <p id={id} aria-live="polite" className="mt-2 text-[0.9rem] font-medium text-erro empty:hidden">
      {texto}
    </p>
  )
}
