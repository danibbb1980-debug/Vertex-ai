import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, OPCOES_AGENDAMENTO } from '../config'
import { OrquideaTraco } from '../brand/OrquideaTraco'
import { Rotulo } from '../components/Comum'
import { IconeCheck, IconeWhatsApp } from '../components/Icones'
import { diaAberto, horarioDoDia, horariosResumidos, temWhatsApp } from '../lib/dados'

const LIMITE_OBS = 300
const MSG_INICIAL = 'Olá! Vim pelo site da Dra. Luciana Leão e gostaria de solicitar um agendamento.'

/** Data e hora atuais em Poços de Caldas (America/Sao_Paulo). */
function agoraSP() {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  )
  return { data: `${partes.year}-${partes.month}-${partes.day}`, minutos: Number(partes.hour) * 60 + Number(partes.minute) }
}

const paraMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const paraHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/** Dia da semana (0 a 6) de uma data "aaaa-mm-dd", sem depender do fuso do aparelho. */
function diaDaSemana(iso: string): number {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay()
}

/** Blocos de horário do dia: do horário de abertura até o último horário permitido, sem a pausa. */
export function horariosDisponiveis(iso: string): string[] {
  if (!iso) return []
  const h = horarioDoDia(diaDaSemana(iso))
  if (!h || h.fechado || !h.abre || !h.fecha) return []
  const { blocoMinutos, ultimoHorario, pausa } = CONFIG.agendamento
  const inicio = paraMin(h.abre)
  const fim = Math.min(paraMin(h.fecha) - blocoMinutos, ultimoHorario ? paraMin(ultimoHorario) : Infinity)
  const agora = agoraSP()
  const lista: string[] = []
  for (let t = inicio; t <= fim; t += blocoMinutos) {
    if (pausa && t < paraMin(pausa.fim) && t + blocoMinutos > paraMin(pausa.inicio)) continue
    if (iso === agora.data && t <= agora.minutos) continue
    lista.push(paraHHMM(t))
  }
  return lista
}

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

type Erros = Partial<Record<'nome' | 'atendimento' | 'data', string>>

export function Agendamento() {
  const base = useId()
  const id = (n: string) => `${base}-${n}`
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'editando' | 'enviando' | 'aberto' | 'bloqueado'>('editando')
  const [url, setUrl] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // calculado só no navegador (o HTML é pré-renderizado no build)
  const [hoje, setHoje] = useState<string | undefined>(undefined)
  useEffect(() => setHoje(agoraSP().data), [])
  const horarios = useMemo(() => horariosDisponiveis(data), [data])
  const abertos = horariosResumidos().filter((g) => !g.fechado)
  const diasDeAtendimento = abertos.length ? `Atendimento: ${abertos.map((g) => g.rotulo.toLowerCase()).join(', ')}.` : ''

  if (!temWhatsApp || !CONFIG.secoes.agendar) return null

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Informe uma data válida.'
    if (v < agoraSP().data) return 'Escolha uma data a partir de hoje.'
    if (!diaAberto(diaDaSemana(v))) return 'Dia sem atendimento, escolha outra data.'
    if (!horariosDisponiveis(v).length) return 'Não há mais horários neste dia, escolha outra data.'
    return undefined
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a equipe saber com quem vai falar.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const ed = validarData(data)
    if (ed) e.data = ed
    return e
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'atendimento', 'data'] as const).find((k) => e[k])
    if (primeiro) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(primeiro))}`)?.focus()
      return
    }
    setEstado('enviando')
    const mensagem = [
      MSG_INICIAL,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? formatarData(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
    setUrl(link)
    const janela = window.open(link, '_blank')
    if (janela) {
      try {
        janela.opener = null
      } catch {
        /* sem acesso à janela: tudo bem */
      }
      setEstado('aberto')
    } else {
      setEstado('bloqueado')
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  function novaSolicitacao() {
    setEstado('editando')
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id('nome'))}`)?.focus())
  }

  const desc = (campo: keyof Erros, extra?: string) => [erros[campo] ? id(`${campo}-erro`) : '', extra ?? ''].filter(Boolean).join(' ') || undefined
  const Erro = ({ campo }: { campo: keyof Erros }) =>
    erros[campo] ? (
      <p id={id(`${campo}-erro`)} className="mt-2 flex items-start gap-2 text-[0.92rem] font-medium text-[#9b2238]">
        <span aria-hidden="true">●</span>
        {erros[campo]}
      </p>
    ) : null

  const concluido = estado === 'aberto' || estado === 'bloqueado'

  return (
    <section id="agendar" className="secao relative overflow-hidden bg-rose-200/60" aria-labelledby="titulo-agendar">
      <OrquideaTraco className="pointer-events-none absolute -left-24 bottom-0 hidden w-[28rem] text-rose lg:block" espessura={0.6} />
      <div className="container-site relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-revelar>
          <div className="lg:sticky lg:top-36">
            <Rotulo className="mb-6">Praticidade</Rotulo>
            <h2 id="titulo-agendar" className="titulo-secao">
              Peça seu horário em poucos <em>cliques</em>.
            </h2>
            <p className="mt-6 text-lg text-tinta-suave">
              Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a
              disponibilidade.
            </p>
            <p className="mt-4 text-tinta-suave">Os horários escolhidos aqui são preferências e dependem da agenda da clínica.</p>
          </div>
        </div>

        <div className="lg:col-span-7" data-revelar>
          <div className="rounded-[1.75rem] border border-filete bg-pedra-50 p-6 shadow-cartao sm:p-10">
            <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
              {concluido && (
                <div className="py-4 text-center sm:py-8">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-vinho text-pedra">
                    <IconeCheck width={28} height={28} />
                  </span>
                  {estado === 'aberto' ? (
                    <>
                      <h3 className="mt-6 text-3xl">Pronto!</h3>
                      <p className="mx-auto mt-4 max-w-md text-lg text-tinta-suave">
                        Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                      </p>
                      <p className="mt-6 text-[0.95rem] text-tinta-suave">
                        O WhatsApp não abriu?{' '}
                        <a href={url} target="_blank" rel="noopener noreferrer" className="link-sublinhado font-semibold text-vinho">
                          Abrir WhatsApp
                        </a>
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-6 text-3xl">Quase lá</h3>
                      <p className="mx-auto mt-4 max-w-md text-lg text-tinta-suave">
                        O navegador impediu a abertura automática. Toque no botão abaixo para abrir o WhatsApp com a sua solicitação e enviar a
                        mensagem.
                      </p>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-7" onClick={() => setEstado('aberto')}>
                        <IconeWhatsApp />
                        Abrir WhatsApp
                      </a>
                    </>
                  )}
                  <div>
                    <button type="button" onClick={novaSolicitacao} className="link-sublinhado mt-8 min-h-12 px-2 text-[0.95rem] font-medium text-tinta-suave hover:text-vinho">
                      Fazer outra solicitação
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form ref={formRef} onSubmit={enviar} noValidate hidden={concluido} aria-labelledby="titulo-agendar" className="space-y-6">
              <div>
                <label htmlFor={id('nome')} className="mb-2 block font-medium text-tinta">
                  Nome completo <span className="text-[#9b2238]" aria-hidden="true">*</span>
                  <span className="sr-only">(obrigatório)</span>
                </label>
                <input
                  id={id('nome')}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  className="campo"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => nome && setErros((er) => ({ ...er, nome: nome.trim().length < 2 ? 'Informe seu nome para a equipe saber com quem vai falar.' : undefined }))}
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={desc('nome')}
                />
                <Erro campo="nome" />
              </div>

              <div>
                <label htmlFor={id('atendimento')} className="mb-2 block font-medium text-tinta">
                  Atendimento desejado{' '}
                  {CONFIG.agendamento.exigirAtendimento ? (
                    <span className="text-[#9b2238]" aria-hidden="true">
                      *
                    </span>
                  ) : (
                    <span className="font-normal text-tinta-suave">(opcional)</span>
                  )}
                </label>
                <select
                  id={id('atendimento')}
                  name="atendimento"
                  className="campo"
                  value={atendimento}
                  onChange={(e) => setAtendimento(e.target.value)}
                  aria-invalid={Boolean(erros.atendimento)}
                  aria-describedby={desc('atendimento')}
                  required={CONFIG.agendamento.exigirAtendimento}
                >
                  <option value="">Escolha um atendimento</option>
                  {OPCOES_AGENDAMENTO.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <Erro campo="atendimento" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={id('data')} className="mb-2 block font-medium text-tinta">
                    Data preferida <span className="font-normal text-tinta-suave">(opcional)</span>
                  </label>
                  <input
                    id={id('data')}
                    name="data"
                    type="date"
                    min={hoje}
                    className="campo"
                    value={data}
                    onChange={(e) => {
                      const v = e.target.value
                      setData(v)
                      setHora('')
                      setErros((er) => ({ ...er, data: validarData(v) }))
                    }}
                    aria-invalid={Boolean(erros.data)}
                    aria-describedby={desc('data', id('data-ajuda'))}
                  />
                  <p id={id('data-ajuda')} className="mt-2 text-[0.88rem] text-tinta-suave">
                    {diasDeAtendimento}
                  </p>
                  <Erro campo="data" />
                </div>
                <div>
                  <label htmlFor={id('hora')} className="mb-2 block font-medium text-tinta">
                    Horário preferido <span className="font-normal text-tinta-suave">(opcional)</span>
                  </label>
                  <select
                    id={id('hora')}
                    name="hora"
                    className="campo disabled:cursor-not-allowed disabled:opacity-70"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    disabled={!data || Boolean(erros.data) || horarios.length === 0}
                    aria-describedby={id('hora-ajuda')}
                  >
                    <option value="">Escolha um horário</option>
                    {!erros.data &&
                      horarios.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                  </select>
                  <p id={id('hora-ajuda')} className="mt-2 text-[0.88rem] text-tinta-suave">
                    {data && !erros.data ? 'Horários de início, sujeitos à agenda.' : 'Escolha uma data para ver os horários.'}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor={id('obs')} className="mb-2 block font-medium text-tinta">
                  Observações <span className="font-normal text-tinta-suave">(opcional)</span>
                </label>
                <textarea
                  id={id('obs')}
                  name="observacoes"
                  rows={3}
                  maxLength={LIMITE_OBS}
                  className="campo resize-y"
                  placeholder="Se quiser, conte o que você precisa."
                  value={obs}
                  onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                  aria-describedby={`${id('obs-aviso')} ${id('obs-cont')}`}
                />
                <div className="mt-2 flex items-start justify-between gap-4 text-[0.88rem] text-tinta-suave">
                  <p id={id('obs-aviso')}>Não envie fotos nem informações de saúde por aqui. Isso é tratado na consulta.</p>
                  <p id={id('obs-cont')} className="shrink-0 tabular-nums" aria-live={obs.length > LIMITE_OBS - 30 ? 'polite' : 'off'}>
                    {obs.length}/{LIMITE_OBS}
                    <span className="sr-only"> caracteres</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-filete pt-6">
                <button type="submit" className="btn btn-primario w-full disabled:opacity-80" disabled={estado === 'enviando'}>
                  <IconeWhatsApp />
                  {estado === 'enviando' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                </button>
                <p className="mt-4 text-center text-[0.88rem] leading-relaxed text-tinta-suave">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="link-sublinhado font-medium text-vinho">
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
