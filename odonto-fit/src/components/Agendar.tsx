import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { CONFIG } from '../config'
import { waLink } from '../lib/contato'
import { diaAberto, horariosDoDia } from '../lib/horarios'
import { BotaoWhatsApp, Reveal, SectionTitle } from './ui'
import { IconWhatsApp } from './icons'

const PRIMEIRA = 'Primeira avaliação'
const NAO_SEI = 'Ainda não sei, quero conversar'

const isoHoje = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const diaDaSemana = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).getDay()
}
const br = (iso: string) => iso.split('-').reverse().join('/')

type Erros = Partial<Record<'nome' | 'atendimento' | 'data', string>>

export function Agendar() {
  const uid = useId()
  const id = (s: string) => `${uid}-${s}`
  const limite = CONFIG.agendamento.limiteObservacoes
  const opcoes = [...CONFIG.atendimentos.map((a) => a.nome), PRIMEIRA, NAO_SEI]

  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'form' | 'enviando' | 'ok'>('form')
  const [bloqueado, setBloqueado] = useState(false)
  const [url, setUrl] = useState('')
  // Data mínima calculada no navegador (evita divergência com o HTML pré-renderizado).
  const [hoje, setHoje] = useState('')
  useEffect(() => setHoje(isoHoje()), [])
  const okRef = useRef<HTMLDivElement>(null)

  const slots = useMemo(() => {
    if (!data) return []
    const dia = diaDaSemana(data)
    if (data === hoje) {
      const n = new Date()
      return horariosDoDia(dia, n.getHours() * 60 + n.getMinutes())
    }
    return horariosDoDia(dia)
  }, [data, hoje])

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined
    if (hoje && v < hoje) return 'Escolha uma data a partir de hoje.'
    if (!diaAberto(diaDaSemana(v))) return 'Dia sem atendimento, escolha outra data.'
    const agora = new Date()
    if (v === hoje && horariosDoDia(diaDaSemana(v), agora.getHours() * 60 + agora.getMinutes()).length === 0)
      return 'Não há mais horários hoje, escolha outra data.'
    return undefined
  }

  const onData = (v: string) => {
    setData(v)
    setHora('')
    setErros((e) => ({ ...e, data: validarData(v) }))
  }

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a clínica saber com quem está falando.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const d = validarData(data)
    if (d) e.data = d
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'atendimento', 'data'] as const).find((k) => e[k])
    if (primeiro) {
      document.getElementById(id(primeiro))?.focus()
      return
    }
    setEstado('enviando')
    const msg = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? br(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = waLink(msg)
    setUrl(link)
    // Abre na mesma ação do clique (evita bloqueio); depois corta o vínculo com esta página (noopener).
    const w = window.open(link, '_blank')
    if (w) w.opener = null
    setBloqueado(!w)
    setEstado('ok')
  }

  useEffect(() => {
    if (estado === 'ok') okRef.current?.focus()
  }, [estado])

  const recomecar = () => {
    setEstado('form')
    setNome('')
    setAtendimento('')
    setData('')
    setHora('')
    setObs('')
    setErros({})
  }

  const erroDe = (k: keyof Erros) =>
    erros[k] ? (
      <p id={id(`${k}-erro`)} className="mt-2 flex items-start gap-1.5 text-[0.92rem] font-medium text-[#b42318]">
        <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
        {erros[k]}
      </p>
    ) : null
  const desc = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined

  const rotulo = 'mb-2 block font-semibold text-navy'
  const opcional = <span className="font-normal text-muted"> (opcional)</span>

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-mist" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:pt-6">
          <SectionTitle
            id="t-agendar"
            eyebrow="Praticidade"
            titulo="Peça seu horário em poucos"
            enfase="cliques"
            depois="."
            intro="Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade."
          />
          <Reveal className="mt-8 space-y-3 text-[0.98rem]">
            <p className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-ink" />
              Data e horário são preferências. A clínica confirma o que estiver disponível.
            </p>
            <p className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-ink" />
              Não pedimos telefone, e-mail nem dados de saúde: o próprio WhatsApp identifica o contato.
            </p>
          </Reveal>
        </div>

        <Reveal className="card relative p-6 sm:p-9">
          {CONFIG.agendamento.urgencia && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-sand p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-navy">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <BotaoWhatsApp className="btn-primary" mensagem="Olá! Estou com dor e gostaria de atendimento.">
                WhatsApp
              </BotaoWhatsApp>
            </div>
          )}

          {estado === 'ok' ? (
            <div ref={okRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-5 py-4 outline-none">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-aqua-soft text-aqua-ink">
                <CheckCircle2 size={30} aria-hidden="true" />
              </span>
              <h3 className="text-3xl">Pronto!</h3>
              <p className="text-lg">
                Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
              </p>
              <p className={bloqueado ? 'font-semibold text-navy' : 'text-muted'}>
                {bloqueado ? 'O navegador bloqueou a nova aba. Toque no botão abaixo para abrir o WhatsApp.' : 'Se o WhatsApp não abriu, use o botão abaixo.'}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-aqua">
                  <IconWhatsApp size={20} /> Abrir WhatsApp
                  <span className="sr-only"> (nova aba)</span>
                </a>
                <button type="button" onClick={recomecar} className="btn btn-ghost">
                  Fazer outra solicitação
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} aria-describedby={id('ajuda')} className="grid gap-6">
              <div>
                <label htmlFor={id('nome')} className={rotulo}>
                  Nome completo
                </label>
                <input
                  id={id('nome')}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  maxLength={80}
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (erros.nome && e.target.value.trim().length >= 2) setErros((x) => ({ ...x, nome: undefined }))
                  }}
                  aria-invalid={!!erros.nome}
                  aria-describedby={desc(erros.nome && id('nome-erro'))}
                  className="field"
                />
                {erroDe('nome')}
              </div>

              <div>
                <label htmlFor={id('atendimento')} className={rotulo}>
                  Atendimento desejado{!CONFIG.agendamento.exigirAtendimento && opcional}
                </label>
                <select
                  id={id('atendimento')}
                  name="atendimento"
                  value={atendimento}
                  onChange={(e) => {
                    setAtendimento(e.target.value)
                    setErros((x) => ({ ...x, atendimento: undefined }))
                  }}
                  aria-invalid={!!erros.atendimento}
                  aria-required={CONFIG.agendamento.exigirAtendimento}
                  aria-describedby={desc(erros.atendimento && id('atendimento-erro'))}
                  className="field appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20fill=%22none%22%20stroke=%22%2323224f%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%3E%3Cpath%20d=%22M5%207.5l5%205%205-5%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12"
                >
                  <option value="">Escolha um atendimento</option>
                  {opcoes.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {erroDe('atendimento')}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={id('data')} className={rotulo}>
                    Data preferida{opcional}
                  </label>
                  <input
                    id={id('data')}
                    name="data"
                    type="date"
                    min={hoje || undefined}
                    value={data}
                    onChange={(e) => onData(e.target.value)}
                    aria-invalid={!!erros.data}
                    aria-describedby={desc(id('data-ajuda'), erros.data && id('data-erro'))}
                    className="field"
                  />
                  <p id={id('data-ajuda')} className="mt-2 text-[0.85rem] text-muted">
                    Atendimento de segunda a sexta.
                  </p>
                  {erroDe('data')}
                </div>
                <div>
                  <label htmlFor={id('hora')} className={rotulo}>
                    Horário preferido{opcional}
                  </label>
                  <select
                    id={id('hora')}
                    name="hora"
                    value={hora}
                    disabled={!data || !!erros.data || slots.length === 0}
                    onChange={(e) => setHora(e.target.value)}
                    aria-describedby={id('hora-ajuda')}
                    className="field appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2220%22%20height=%2220%22%20fill=%22none%22%20stroke=%22%2323224f%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%3E%3Cpath%20d=%22M5%207.5l5%205%205-5%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12"
                  >
                    <option value="">Escolha um horário</option>
                    {slots.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(':', 'h')}
                      </option>
                    ))}
                  </select>
                  <p id={id('hora-ajuda')} className="mt-2 text-[0.85rem] text-muted">
                    {data ? 'Sujeito à confirmação da clínica.' : 'Escolha a data para ver os horários.'}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor={id('obs')} className={rotulo}>
                  Observações{opcional}
                </label>
                <textarea
                  id={id('obs')}
                  name="observacoes"
                  rows={3}
                  maxLength={limite}
                  placeholder="Se quiser, conte o que você precisa."
                  value={obs}
                  onChange={(e) => setObs(e.target.value.slice(0, limite))}
                  aria-describedby={id('obs-ajuda')}
                  className="field resize-y"
                />
                <div id={id('obs-ajuda')} className="mt-2 flex justify-between gap-4 text-[0.85rem] text-muted">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="shrink-0 tabular-nums" aria-label={`${obs.length} de ${limite} caracteres`}>
                    {obs.length}/{limite}
                  </span>
                </div>
              </div>

              <div aria-live="polite" className="sr-only">
                {Object.values(erros).filter(Boolean).length > 0 ? 'Há campos a corrigir no formulário.' : ''}
              </div>

              <div>
                <button type="submit" className="btn btn-primary w-full !min-h-14 text-[1.02rem]" aria-busy={estado === 'enviando'} disabled={estado === 'enviando'}>
                  {estado === 'enviando' ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Send size={19} aria-hidden="true" />}
                  Enviar solicitação pelo WhatsApp
                </button>
                <p id={id('ajuda')} className="mt-4 text-[0.88rem] text-muted">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="font-semibold text-aqua-ink underline underline-offset-4">
                    Privacidade
                  </a>
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
