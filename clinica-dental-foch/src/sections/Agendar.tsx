import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, LoaderCircle, RotateCcw } from 'lucide-react'
import { CONFIG } from '../config'
import { useUnidade } from '../context/unidade'
import { linkGeral, linkWhatsapp } from '../lib/whatsapp'
import { dataBR, dataCurta, expedienteDoDia, isoLocal, proximosDiasAbertos, resumoHorarios, slotsDoDia } from '../lib/horarios'
import { Cabecalho } from '../components/Titulo'
import { IconeWhatsapp } from '../components/Marcas'

const atraso = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

const PRIMEIRA = 'Primeira avaliação'
const NAO_SEI = 'Ainda não sei, quero conversar'

type Campo = 'unidade' | 'nome' | 'atendimento' | 'data' | 'horario' | 'obs'
type Erros = Partial<Record<Campo, string>>

function Rotulo({ htmlFor, children, opcional }: { htmlFor: string; children: string; opcional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-semibold text-teal-900">
      {children}
      {opcional ? (
        <span className="ml-2 text-sm font-normal text-ink-soft">(opcional)</span>
      ) : (
        <span className="ml-1 text-erro" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

function MsgErro({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-erro">
      <AlertCircle aria-hidden="true" size={16} className="shrink-0" />
      {msg}
    </p>
  )
}

export function Agendar() {
  const { unidade: unidadeAtual, multiplas } = useUnidade()
  const uid = useId()
  const ids = {
    unidade: `${uid}-unidade`,
    nome: `${uid}-nome`,
    atendimento: `${uid}-atendimento`,
    data: `${uid}-data`,
    horario: `${uid}-horario`,
    obs: `${uid}-obs`,
  }
  const [unidadeId, setUnidadeId] = useState(unidadeAtual.id)
  useEffect(() => setUnidadeId(unidadeAtual.id), [unidadeAtual.id])
  const unidade = CONFIG.unidades.find((u) => u.id === unidadeId) ?? unidadeAtual

  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [status, setStatus] = useState<'idle' | 'enviando' | 'ok'>('idle')
  const [url, setUrl] = useState('')
  const [hoje, setHoje] = useState('')
  const [agora, setAgora] = useState<Date | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const okRef = useRef<HTMLHeadingElement>(null)

  // Datas só no navegador (evita divergência com o HTML pré-renderizado)
  useEffect(() => {
    const d = new Date()
    setAgora(d)
    setHoje(isoLocal(d))
  }, [])

  const opcoes = [...CONFIG.atendimentos.map((a) => a.titulo), PRIMEIRA, NAO_SEI]
  const slots = useMemo(() => (data && agora ? slotsDoDia(unidade.horarios, data, agora) : []), [data, agora, unidade])
  const sugestoes = useMemo(() => (agora ? proximosDiasAbertos(unidade.horarios, 4, agora) : []), [agora, unidade])

  const erroData = (iso: string): string | undefined => {
    if (!iso) return undefined
    if (hoje && iso < hoje) return 'Escolha uma data a partir de hoje.'
    if (!expedienteDoDia(unidade.horarios, iso)) return 'Dia sem atendimento, escolha outra data.'
    if (agora && slotsDoDia(unidade.horarios, iso, agora).length === 0) return 'Não há mais horários hoje, escolha outra data.'
    return undefined
  }

  const escolherData = (iso: string) => {
    setData(iso)
    setHorario('')
    setErros((e) => ({ ...e, data: erroData(iso), horario: undefined }))
  }

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a equipe saber como te chamar.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha uma opção de atendimento.'
    const ed = erroData(data)
    if (ed) e.data = ed
    if (obs.length > CONFIG.agendamento.limiteObservacoes)
      e.obs = `Use no máximo ${CONFIG.agendamento.limiteObservacoes} caracteres.`
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (Object.keys(e) as Campo[])[0]
    if (primeiro) {
      document.getElementById(ids[primeiro])?.focus()
      return
    }
    const linhas = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      ...(multiplas ? [`Unidade: ${unidade.rotulo}`] : []),
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ]
    const link = linkWhatsapp(unidade.whatsapp, linhas.join('\n'))
    setUrl(link)
    setStatus('enviando')
    // Abre de forma síncrona ao clique (evita bloqueio de pop-up) e sem acesso à página de origem.
    const janela = window.open(link, '_blank')
    if (janela) janela.opener = null
    window.setTimeout(() => setStatus('ok'), 450)
  }

  useEffect(() => {
    if (status === 'ok') okRef.current?.focus()
  }, [status])

  const novaSolicitacao = () => {
    setStatus('idle')
    setNome('')
    setAtendimento('')
    setData('')
    setHorario('')
    setObs('')
    setErros({})
    window.setTimeout(() => document.getElementById(ids.nome)?.focus(), 50)
  }

  const nErros = Object.values(erros).filter(Boolean).length
  const desc = (c: Campo, extra?: string) => [erros[c] ? `${ids[c]}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-sand py-20 sm:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:pt-6">
          <Cabecalho
            id="titulo-agendar"
            rotulo="Praticidade"
            titulo="Peça seu horário em poucos *cliques*."
            intro={
              <>
                <p>
                  Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo
                  WhatsApp, e a equipe confirma a disponibilidade.
                </p>
                <p className="mt-4 text-base">
                  Os horários escolhidos aqui são preferências: o agendamento só vale depois da confirmação da equipe.
                </p>
              </>
            }
          />
          <ol className="mt-10 space-y-4">
            {[
              'Preencha seu nome e, se quiser, a data e o horário de preferência.',
              'O WhatsApp abre com a mensagem pronta. É só enviar.',
              'A equipe responde e confirma a disponibilidade.',
            ].map((t, i) => (
              <li key={t} className="reveal flex items-start gap-4" style={atraso(200 + i * 90)}>
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-teal-800/20 bg-white font-display text-teal-800">
                  {i + 1}
                </span>
                <span className="pt-1 text-ink-soft">{t}</span>
              </li>
            ))}
          </ol>
          {CONFIG.urgencia && (
            <div className="reveal mt-8 rounded-[var(--radius-soft)] border border-teal-800/15 bg-white p-6" style={atraso(200)}>
              <p className="font-semibold text-teal-900">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <a href={linkGeral(unidade)} target="_blank" rel="noopener" className="btn btn-primario mt-4">
                <IconeWhatsapp size={18} />
                Falar agora
              </a>
            </div>
          )}
        </div>

        <div className="reveal" style={atraso(120)}>
          <div className="relative rounded-[var(--radius-card)] bg-white p-6 shadow-[0_0_0_1px_rgb(27_77_82/0.08),0_30px_60px_-40px_rgb(19_63_68/0.45)] sm:p-9">
            <div aria-live="polite" className="sr-only">
              {status === 'idle' && nErros > 0
                ? `${nErros === 1 ? 'Há 1 campo' : `Há ${nErros} campos`} para corrigir.`
                : ''}
            </div>

            {status === 'ok' ? (
              <div className="surge py-6 text-center" role="status">
                <CheckCircle2 aria-hidden="true" size={52} strokeWidth={1.4} className="mx-auto text-teal-600" />
                <h3 ref={okRef} tabIndex={-1} className="mt-5 text-3xl outline-none">
                  Pronto!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                <p className="mt-6 text-ink-soft">
                  O WhatsApp não abriu?{' '}
                  <a href={url} target="_blank" rel="noopener" className="font-semibold text-teal-800 underline decoration-aqua-400 decoration-2 underline-offset-4">
                    Abrir WhatsApp
                  </a>
                </p>
                <button type="button" onClick={novaSolicitacao} className="btn btn-secundario mt-8">
                  <RotateCcw aria-hidden="true" size={18} />
                  Fazer outra solicitação
                </button>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={enviar} className="grid gap-6" aria-describedby={`${uid}-aviso`}>
                {multiplas && (
                  <div>
                    <Rotulo htmlFor={ids.unidade}>Unidade</Rotulo>
                    <select
                      id={ids.unidade}
                      value={unidadeId}
                      onChange={(e) => {
                        setUnidadeId(e.target.value)
                        setData('')
                        setHorario('')
                      }}
                      className="campo"
                    >
                      {CONFIG.unidades.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.rotulo}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <Rotulo htmlFor={ids.nome}>Nome completo</Rotulo>
                  <input
                    id={ids.nome}
                    type="text"
                    autoComplete="name"
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                    }}
                    aria-required="true"
                    aria-invalid={!!erros.nome}
                    aria-describedby={desc('nome')}
                    className="campo"
                  />
                  <MsgErro id={`${ids.nome}-erro`} msg={erros.nome} />
                </div>

                <div>
                  <Rotulo htmlFor={ids.atendimento} opcional={!CONFIG.agendamento.exigirAtendimento}>
                    Atendimento desejado
                  </Rotulo>
                  <select
                    id={ids.atendimento}
                    value={atendimento}
                    onChange={(e) => {
                      setAtendimento(e.target.value)
                      if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                    }}
                    aria-required={CONFIG.agendamento.exigirAtendimento}
                    aria-invalid={!!erros.atendimento}
                    aria-describedby={desc('atendimento')}
                    className="campo"
                  >
                    <option value="">Escolha uma opção</option>
                    {opcoes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <MsgErro id={`${ids.atendimento}-erro`} msg={erros.atendimento} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Rotulo htmlFor={ids.data} opcional>
                      Data preferida
                    </Rotulo>
                    <input
                      id={ids.data}
                      type="date"
                      min={hoje || undefined}
                      value={data}
                      onChange={(e) => escolherData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={desc('data', `${ids.data}-dica`)}
                      className="campo"
                    />
                    <p id={`${ids.data}-dica`} className="mt-2 text-sm text-ink-soft">
                      Atendimento: {resumoHorarios(unidade.horarios).filter((h) => h.aberto).map((h) => h.dias.toLowerCase()).join(', ')}.
                    </p>
                    <MsgErro id={`${ids.data}-erro`} msg={erros.data} />
                  </div>
                  <div>
                    <Rotulo htmlFor={ids.horario} opcional>
                      Horário preferido
                    </Rotulo>
                    <select
                      id={ids.horario}
                      value={horario}
                      onChange={(e) => setHorario(e.target.value)}
                      disabled={!data || !!erros.data || slots.length === 0}
                      aria-describedby={`${ids.horario}-dica`}
                      className="campo disabled:cursor-not-allowed disabled:bg-ice disabled:text-ink-soft"
                    >
                      <option value="">Escolha um horário</option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(':', 'h')}
                        </option>
                      ))}
                    </select>
                    <p id={`${ids.horario}-dica`} className="mt-2 text-sm text-ink-soft">
                      {data && !erros.data ? 'Sujeito à confirmação da equipe.' : 'Escolha a data para ver os horários.'}
                    </p>
                  </div>
                </div>

                {sugestoes.length > 0 && (
                  <fieldset className="-mt-2">
                    <legend className="mb-2 text-sm text-ink-soft">Próximos dias com atendimento:</legend>
                    <div className="flex flex-wrap gap-2">
                      {sugestoes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={data === s}
                          onClick={() => escolherData(s)}
                          className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                            data === s
                              ? 'border-teal-800 bg-teal-800 text-white'
                              : 'border-teal-800/20 bg-white text-teal-800 hover:border-teal-700'
                          }`}
                        >
                          {dataCurta(s)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                <div>
                  <Rotulo htmlFor={ids.obs} opcional>
                    Observações
                  </Rotulo>
                  <textarea
                    id={ids.obs}
                    rows={3}
                    maxLength={CONFIG.agendamento.limiteObservacoes}
                    placeholder="Se quiser, conte o que você precisa."
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    aria-invalid={!!erros.obs}
                    aria-describedby={desc('obs', `${ids.obs}-aviso ${ids.obs}-contador`)}
                    className="campo resize-y"
                  />
                  <div className="mt-2 flex justify-between gap-4 text-sm text-ink-soft">
                    <p id={`${ids.obs}-aviso`}>
                      Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.
                    </p>
                    <p id={`${ids.obs}-contador`} className="shrink-0 tabular-nums">
                      <span className="sr-only">Caracteres usados: </span>
                      {obs.length}/{CONFIG.agendamento.limiteObservacoes}
                    </p>
                  </div>
                  <MsgErro id={`${ids.obs}-erro`} msg={erros.obs} />
                </div>

                <div>
                  <button type="submit" className="btn btn-primario w-full text-center sm:w-auto" disabled={status === 'enviando'} aria-busy={status === 'enviando'}>
                    {status === 'enviando' ? (
                      <LoaderCircle aria-hidden="true" size={20} className="carregando" />
                    ) : (
                      <IconeWhatsapp size={20} />
                    )}
                    {status === 'enviando' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                  </button>
                  <p id={`${uid}-aviso`} className="mt-4 text-sm text-ink-soft">
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados
                    digitados.{' '}
                    <a href="/privacidade.html" className="font-medium text-teal-800 underline underline-offset-4">
                      Saiba mais sobre privacidade
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
