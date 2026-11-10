import { useEffect, useId, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { dataBR, diaAberto, horariosDoDia, isoHoje, parseData, waLink } from '../lib'
import { IcCheck, IcEnviar, IcSetaExterna } from './icones'
import { CabecalhoSecao, Revela } from './ui'

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario', string>>

const LIMITE_OBS = 300

/**
 * Solicitação de agendamento pelo WhatsApp.
 * Não há backend: o formulário só monta a mensagem e abre o WhatsApp da clínica.
 * Nada é guardado (sem localStorage, cookies ou envio a servidor).
 */
export function Agendamento() {
  const uid = useId()
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState<string | null>(null) // URL aberta
  const [bloqueado, setBloqueado] = useState(false)
  const [hoje, setHoje] = useState('')
  useEffect(() => setHoje(isoHoje()), [])

  const opcoes = [...CONFIG.atendimentos.map((a) => a.nome), ...CONFIG.agendamento.opcoesExtras]
  const semana = data ? parseData(data).getDay() : null
  const horarios = semana !== null && diaAberto(semana) ? horariosDoDia(semana) : []

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined // data é opcional ("a combinar")
    if (hoje && v < hoje) return 'Escolha uma data a partir de hoje.'
    if (!diaAberto(parseData(v).getDay())) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a clínica saber com quem está falando.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (horario && !horarios.includes(horario)) e.horario = 'Escolha um horário da lista.'
    return e
  }

  const mensagem = () =>
    [
      CONFIG.agendamento.mensagemInicial,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      const primeiro = (['nome', 'atendimento', 'data', 'horario'] as const).find((k) => e[k])
      document.getElementById(`${uid}-${primeiro}`)?.focus()
      return
    }
    setEnviando(true)
    const url = waLink(mensagem())
    const janela = window.open(url, '_blank', 'noopener,noreferrer')
    // Com "noopener" alguns navegadores retornam null mesmo abrindo; por isso o link visível fica sempre disponível.
    setBloqueado(!janela)
    setEnviado(url)
    setEnviando(false)
  }

  const campo =
    'mt-2 block min-h-12 w-full rounded-2xl border-0 bg-white px-4 py-3 text-base text-ameixa ring-1 ring-inset ring-ameixa/18 placeholder:text-tinta-2/80 transition-shadow focus:outline-none focus:ring-2 focus:ring-salvia-tinta aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#9b3b4f]'
  const rotulo = 'block text-[0.95rem] font-semibold text-ameixa'
  const erro = (k: keyof Erros) =>
    erros[k] ? (
      <p id={`${uid}-${k}-erro`} className="mt-2 text-[0.9rem] font-medium text-[#8a2f43]">
        {erros[k]}
      </p>
    ) : null
  const desc = (k: keyof Erros, extra?: string) =>
    [erros[k] ? `${uid}-${k}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" data-fio="agendar" className="relative py-24 lg:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <CabecalhoSecao
            id="titulo-agendar"
            rotulo="Praticidade"
            titulo="Peça seu horário em poucos *cliques*."
            texto="Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade."
          />
          <Revela atraso={0.1}>
            <p className="mt-6 text-[0.98rem] text-tinta-2">
              O dia e o horário escolhidos são preferências: a confirmação depende da disponibilidade da agenda.
            </p>
          </Revela>
        </div>

        <Revela>
          <div className="rounded-[2rem] bg-marfim-2 p-6 ring-1 ring-ameixa/8 sm:p-9">
            {enviado ? (
              <div role="status" className="flex flex-col items-start gap-5">
                <span className="flex size-12 items-center justify-center rounded-full bg-salvia-suave text-salvia-tinta">
                  <IcCheck size={24} />
                </span>
                <p className="font-serif text-[1.6rem] leading-snug text-ameixa">
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a
                  disponibilidade.
                </p>
                <a
                  href={enviado}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ameixa px-6 font-semibold text-marfim"
                >
                  Abrir WhatsApp <IcSetaExterna size={18} />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                {bloqueado && (
                  <p className="text-[0.92rem] text-tinta-2">Se a conversa não abriu, use o botão acima.</p>
                )}
                <button
                  type="button"
                  onClick={() => setEnviado(null)}
                  className="min-h-12 text-[0.95rem] font-semibold text-ameixa underline underline-offset-4"
                >
                  Editar solicitação
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby={`${uid}-aviso`}>
                <div aria-live="polite" className="sr-only">
                  {Object.keys(erros).length ? 'Há campos para revisar no formulário.' : ''}
                </div>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor={`${uid}-nome`} className={rotulo}>
                      Nome completo <span className="font-normal text-tinta-2">(obrigatório)</span>
                    </label>
                    <input
                      id={`${uid}-nome`}
                      name="nome"
                      autoComplete="name"
                      required
                      placeholder="Como devemos te chamar?"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      onBlur={() => nome && setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? 'Informe seu nome.' : undefined }))}
                      aria-invalid={!!erros.nome}
                      aria-describedby={desc('nome')}
                      className={campo}
                    />
                    {erro('nome')}
                  </div>

                  <div>
                    <label htmlFor={`${uid}-atendimento`} className={rotulo}>
                      Atendimento desejado{' '}
                      {!CONFIG.agendamento.exigirAtendimento && <span className="font-normal text-tinta-2">(opcional)</span>}
                    </label>
                    <select
                      id={`${uid}-atendimento`}
                      name="atendimento"
                      value={atendimento}
                      onChange={(e) => setAtendimento(e.target.value)}
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={desc('atendimento')}
                      className={campo}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {erro('atendimento')}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-data`} className={rotulo}>
                        Data preferida <span className="font-normal text-tinta-2">(opcional)</span>
                      </label>
                      <input
                        id={`${uid}-data`}
                        type="date"
                        name="data"
                        min={hoje || undefined}
                        value={data}
                        onChange={(e) => {
                          const v = e.target.value
                          setData(v)
                          setHorario('')
                          setErros((x) => ({ ...x, data: validarData(v), horario: undefined }))
                        }}
                        aria-invalid={!!erros.data}
                        aria-describedby={desc('data', `${uid}-data-ajuda`)}
                        className={campo}
                      />
                      <p id={`${uid}-data-ajuda`} className="mt-2 text-[0.85rem] text-tinta-2">
                        Atendimento de segunda a sexta.
                      </p>
                      {erro('data')}
                    </div>
                    <div>
                      <label htmlFor={`${uid}-horario`} className={rotulo}>
                        Horário preferido <span className="font-normal text-tinta-2">(opcional)</span>
                      </label>
                      <select
                        id={`${uid}-horario`}
                        name="horario"
                        value={horario}
                        disabled={horarios.length === 0}
                        onChange={(e) => setHorario(e.target.value)}
                        aria-invalid={!!erros.horario}
                        aria-describedby={desc('horario', `${uid}-horario-ajuda`)}
                        className={`${campo} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <option value="">Escolha um horário</option>
                        {horarios.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <p id={`${uid}-horario-ajuda`} className="mt-2 text-[0.85rem] text-tinta-2">
                        {horarios.length ? 'Sujeito à confirmação da clínica.' : 'Escolha uma data para ver os horários.'}
                      </p>
                      {erro('horario')}
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-obs`} className={rotulo}>
                      Observações <span className="font-normal text-tinta-2">(opcional)</span>
                    </label>
                    <textarea
                      id={`${uid}-obs`}
                      name="observacoes"
                      rows={3}
                      maxLength={LIMITE_OBS}
                      placeholder="Se quiser, conte o que você precisa."
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                      aria-describedby={`${uid}-obs-ajuda`}
                      className={`${campo} resize-y`}
                    />
                    <p id={`${uid}-obs-ajuda`} className="mt-2 flex justify-between gap-4 text-[0.85rem] text-tinta-2">
                      <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                      <span className="shrink-0 tabular-nums" aria-hidden="true">
                        {obs.length}/{LIMITE_OBS}
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    aria-busy={enviando}
                    className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-ameixa px-6 py-3.5 font-semibold text-marfim transition-colors hover:bg-ameixa-2 disabled:opacity-70"
                  >
                    <IcEnviar size={18} />
                    {enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                  </button>
                  <p id={`${uid}-aviso`} className="text-[0.88rem] leading-relaxed text-tinta-2">
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                    <a href="/privacidade" className="font-semibold text-ameixa underline underline-offset-4">
                      Privacidade
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </Revela>
      </div>
    </section>
  )
}
