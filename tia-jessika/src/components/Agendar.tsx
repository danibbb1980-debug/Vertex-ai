import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { abertoNoDia, blocosDoDia, diaDaSemanaISO, hojeISO, isoParaBR, linhasHorario } from '../lib/horarios'
import { waLink } from '../lib/whatsapp'
import { Brilho, Laco } from './Decor'
import { IconAlerta, IconCheck, IconWhats } from './Icons'
import { TextReveal, Revela } from './TextReveal'

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario', string>>

const OPCOES = [...CONFIG.atendimentos, 'Primeira avaliação', 'Ainda não sei, quero conversar']

function blocosPara(iso: string) {
  if (!iso) {
    // sem data escolhida: horários de um dia útil típico
    const dia = CONFIG.horarios.find((h) => h.abre)?.dia ?? 1
    return blocosDoDia(dia)
  }
  const dia = diaDaSemanaISO(iso)
  let blocos = blocosDoDia(dia)
  if (iso === hojeISO()) {
    const agora = new Date()
    const m = agora.getHours() * 60 + agora.getMinutes()
    blocos = blocos.filter((b) => {
      const [h, mm] = b.split(':').map(Number)
      return h * 60 + mm > m
    })
  }
  return blocos
}

export function Agendar() {
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'pronto' | 'abrindo' | 'enviado'>('pronto')
  const [url, setUrl] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const limite = CONFIG.agendamento.limiteObservacoes

  // a data mínima é calculada no navegador (o HTML é pré-renderizado no build)
  const [min, setMin] = useState('')
  useEffect(() => setMin(hojeISO()), [])
  const blocos = useMemo(() => blocosPara(data), [data])

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (v < hojeISO()) return 'Escolha uma data a partir de hoje.'
    if (!abertoNoDia(diaDaSemanaISO(v))) return 'Dia sem atendimento, escolha outra data.'
    if (!blocosPara(v).length) return 'Não há mais horários hoje, escolha outra data.'
    return undefined
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe o seu nome completo.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha o atendimento desejado.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (horario && !blocos.includes(horario)) e.horario = 'Escolha um horário disponível para este dia.'
    return e
  }

  function onData(v: string) {
    setData(v)
    const ed = validarData(v)
    setErros((p) => ({ ...p, data: ed }))
    if (horario && !blocosPara(v).includes(horario)) setHorario('')
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (Object.keys(e) as (keyof Erros)[]).find((k) => e[k])
    if (primeiro) {
      document.getElementById(`ag-${primeiro}`)?.focus()
      return
    }
    setEstado('abrindo')
    const msg = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? isoParaBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = waLink(msg)
    setUrl(link)
    const w = window.open(link, '_blank')
    if (w) {
      try {
        w.opener = null
      } catch {
        /* sem acesso: segue */
      }
      setBloqueado(false)
    } else {
      setBloqueado(true)
    }
    window.setTimeout(() => {
      setEstado('enviado')
      requestAnimationFrame(() => statusRef.current?.focus())
    }, 350)
  }

  const desc = (campo: keyof Erros, extra?: string) => [erros[campo] ? `ag-${campo}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="relative py-20 md:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:pt-6">
          <p className="rotulo">praticidade</p>
          <h2 id="t-agendar" className="mt-3 text-[2.15rem] sm:text-5xl lg:text-[3.3rem]">
            <TextReveal partes={['Peça seu horário em poucos', { em: 'cliques.' }]} />
          </h2>
          <Revela delay={0.1}>
            <p className="mt-5 text-lg text-tinta-2">
              Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a
              disponibilidade.
            </p>
            <p className="mt-4 text-tinta-2">
              Os dias e horários escolhidos são uma <strong className="font-extrabold text-tinta">preferência</strong>, sujeita à confirmação da
              clínica.
            </p>
            <Laco className="mt-8 hidden w-52 text-framboesa/55 lg:block" />
          </Revela>
        </div>

        <Revela delay={0.05}>
          <div className="cartao relative !bg-white/85 p-6 shadow-[0_30px_70px_-45px_rgb(28_41_67/0.45)] sm:p-9">
            <Brilho className="absolute -right-3 -top-4 size-9 text-framboesa" />
            {estado === 'enviado' ? (
              <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="py-6 text-center outline-none">
                <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-ceu-50 text-ceu-700">
                  <IconCheck size={30} />
                </span>
                <h3 className="mt-5 text-3xl">Pronto!</h3>
                <p className="mx-auto mt-3 max-w-md text-lg text-tinta-2">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                <p className="mt-6 text-sm text-tinta-3">
                  {bloqueado ? 'O navegador bloqueou a nova aba. ' : 'O WhatsApp não abriu? '}
                  Use o botão abaixo.
                </p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-3">
                  <IconWhats size={20} /> Abrir WhatsApp
                </a>
                <p className="mt-6">
                  <button
                    type="button"
                    onClick={() => setEstado('pronto')}
                    className="inline-flex min-h-12 items-center font-bold text-tinta-2 underline decoration-2 underline-offset-4 hover:text-tinta"
                  >
                    Fazer outra solicitação
                  </button>
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby="ag-aviso">
                {CONFIG.agendamento.urgencia && (
                  <div className="mb-6 rounded-2xl bg-framboesa-50 p-4">
                    <p className="font-bold">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-3">
                      <IconWhats size={20} /> Falar agora
                    </a>
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="ag-nome" className="mb-2 block font-extrabold">
                      Nome completo <span className="text-framboesa-600" aria-hidden="true">*</span>
                      <span className="sr-only"> (obrigatório)</span>
                    </label>
                    <input
                      id="ag-nome"
                      name="nome"
                      className="campo"
                      autoComplete="name"
                      placeholder="Como devemos te chamar?"
                      value={nome}
                      required
                      aria-required="true"
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={desc('nome')}
                      onChange={(e) => setNome(e.target.value)}
                      onBlur={() => nome && setErros((p) => ({ ...p, nome: nome.trim().length < 2 ? 'Informe o seu nome completo.' : undefined }))}
                    />
                    <Erro id="ag-nome-erro" msg={erros.nome} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="ag-atendimento" className="mb-2 block font-extrabold">
                      Atendimento desejado{' '}
                      {CONFIG.agendamento.exigirAtendimento ? (
                        <span className="text-framboesa-600">*</span>
                      ) : (
                        <span className="font-semibold text-tinta-3">(opcional)</span>
                      )}
                    </label>
                    <select
                      id="ag-atendimento"
                      name="atendimento"
                      className="campo"
                      value={atendimento}
                      aria-invalid={Boolean(erros.atendimento)}
                      aria-describedby={desc('atendimento')}
                      onChange={(e) => setAtendimento(e.target.value)}
                    >
                      <option value="">Escolha um atendimento</option>
                      {OPCOES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Erro id="ag-atendimento-erro" msg={erros.atendimento} />
                  </div>

                  <div>
                    <label htmlFor="ag-data" className="mb-2 block font-extrabold">
                      Data preferida <span className="font-semibold text-tinta-3">(opcional)</span>
                    </label>
                    <input
                      id="ag-data"
                      name="data"
                      type="date"
                      className="campo"
                      min={min || undefined}
                      value={data}
                      aria-invalid={Boolean(erros.data)}
                      aria-describedby={desc('data', 'ag-data-ajuda')}
                      onChange={(e) => onData(e.target.value)}
                    />
                    <p id="ag-data-ajuda" className="mt-1.5 text-sm text-tinta-3">
                      {linhasHorario().map((l) => `${l.dias}: ${l.horas.toLowerCase()}`).join('. ')}.
                    </p>
                    <Erro id="ag-data-erro" msg={erros.data} />
                  </div>

                  <div>
                    <label htmlFor="ag-horario" className="mb-2 block font-extrabold">
                      Horário preferido <span className="font-semibold text-tinta-3">(opcional)</span>
                    </label>
                    <select
                      id="ag-horario"
                      name="horario"
                      className="campo"
                      value={horario}
                      disabled={Boolean(erros.data) || !blocos.length}
                      aria-invalid={Boolean(erros.horario)}
                      aria-describedby={desc('horario')}
                      onChange={(e) => {
                        setHorario(e.target.value)
                        setErros((p) => ({ ...p, horario: undefined }))
                      }}
                    >
                      <option value="">Escolha um horário</option>
                      {blocos.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <Erro id="ag-horario-erro" msg={erros.horario} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="ag-obs" className="mb-2 block font-extrabold">
                      Observações <span className="font-semibold text-tinta-3">(opcional)</span>
                    </label>
                    <textarea
                      id="ag-obs"
                      name="observacoes"
                      className="campo min-h-28 resize-y"
                      rows={3}
                      maxLength={limite}
                      placeholder="Se quiser, conte o que você precisa."
                      value={obs}
                      aria-describedby="ag-obs-ajuda ag-obs-cont"
                      onChange={(e) => setObs(e.target.value.slice(0, limite))}
                    />
                    <div className="mt-1.5 flex justify-between gap-4 text-sm text-tinta-3">
                      <p id="ag-obs-ajuda">Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                      <p id="ag-obs-cont" className="shrink-0 tabular-nums" aria-live="polite" aria-atomic="true">
                        <span className="sr-only">Caracteres usados: </span>
                        {obs.length}/{limite}
                      </p>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primario mt-7 w-full" disabled={estado === 'abrindo'} aria-busy={estado === 'abrindo'}>
                  {estado === 'abrindo' ? (
                    <>
                      <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                      Abrindo o WhatsApp…
                    </>
                  ) : (
                    <>
                      <IconWhats size={20} /> Enviar solicitação pelo WhatsApp
                    </>
                  )}
                </button>
                <p id="ag-aviso" className="mt-4 text-center text-sm text-tinta-3">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="font-bold text-tinta-2 underline underline-offset-2">
                    Privacidade
                  </a>
                </p>
                <div className="sr-only" aria-live="assertive">
                  {Object.values(erros).filter(Boolean).length ? 'Há campos para corrigir no formulário.' : ''}
                </div>
              </form>
            )}
          </div>
        </Revela>
      </div>
    </section>
  )
}

function Erro({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm font-bold text-framboesa-700">
      <IconAlerta size={16} /> {msg}
    </p>
  )
}
