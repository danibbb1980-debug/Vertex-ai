import { useId, useMemo, useState, type FormEvent } from 'react'
import { CONFIG, waLink } from '../config'
import { SectionHead, WhatsIcon } from './ui'

const OPCOES_FIXAS = ['Primeiro atendimento', 'Ainda não sei, quero conversar']

function hojeISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

const toMin = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const toHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Blocos de 1 hora que terminam até o fechamento, excluindo a pausa (se houver). */
export function horariosDoDia(dia: number): string[] {
  const h = CONFIG.horarios.find((x) => x.dia === dia)
  if (!h || !h.abre) return []
  const out: string[] = []
  for (let t = toMin(h.abre); t + 60 <= toMin(h.fecha); t += 60) {
    if (h.pausa && t < toMin(h.pausa.fim) && t + 60 > toMin(h.pausa.inicio)) continue
    out.push(toHora(t))
  }
  return out
}

const diasAbertos = CONFIG.horarios.filter((h) => h.abre).map((h) => h.dia)

function dataBR(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

type Erros = Partial<Record<'nome' | 'atendimento' | 'data', string>>

export function Agendar() {
  const uid = useId()
  const atendimentos = [...CONFIG.atendimentos, ...OPCOES_FIXAS]
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const min = hojeISO()
  const horas = useMemo(() => (data ? horariosDoDia(diaDaSemana(data)) : []), [data])

  function onData(v: string) {
    setHora('')
    if (!v) {
      setData('')
      setErros((e) => ({ ...e, data: undefined }))
      return
    }
    if (v < min) {
      setData(v)
      setErros((e) => ({ ...e, data: 'Escolha uma data a partir de hoje.' }))
      return
    }
    if (!diasAbertos.includes(diaDaSemana(v) as never)) {
      setData(v)
      setErros((e) => ({ ...e, data: 'Dia sem atendimento, escolha outra data.' }))
      return
    }
    setData(v)
    setErros((e) => ({ ...e, data: undefined }))
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha o atendimento desejado.'
    if (data) {
      if (data < min) e.data = 'Escolha uma data a partir de hoje.'
      else if (!diasAbertos.includes(diaDaSemana(data) as never)) e.data = 'Dia sem atendimento, escolha outra data.'
    }
    return e
  }

  function montarMensagem() {
    return [
      'Olá, Dr. Vicente! Vim pelo site e gostaria de solicitar um atendimento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'atendimento', 'data'] as const).find((k) => e[k])
    if (primeiro) {
      document.getElementById(`${uid}-${primeiro}`)?.focus()
      return
    }
    setEnviando(true)
    const url = waLink(montarMensagem())
    const w = window.open(url, '_blank', 'noopener')
    setEnviado(url)
    setEnviando(false)
    // Se o navegador bloquear a janela, o link visível abaixo continua disponível.
    void w
  }

  const descr = (k: string, extra?: string) => [erros[k as keyof Erros] ? `${uid}-${k}-erro` : '', extra].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="py-20 sm:py-28">
      <div className="wrap">
        <SectionHead n="§ 07" label="Solicitar agendamento" />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="label text-brick">Praticidade</p>
            <h2 id="t-agendar" className="mt-4 text-[clamp(2rem,5vw,3.4rem)]">
              Peça seu horário em poucos <em>cliques</em>.
            </h2>
            <p className="mt-6 max-w-[28rem] text-ink-2">
              Escolha a área e o dia e horário de sua preferência. Sua solicitação chega ao escritório pelo WhatsApp, e a
              equipe confirma a disponibilidade.
            </p>
            <p className="mt-4 max-w-[28rem] text-sm text-slate">
              Data e horário são preferências, sujeitas à confirmação do escritório.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="relative border border-ink bg-card p-5 sm:p-8">
              <span className="absolute inset-x-0 top-0 h-[3px] bg-brick" aria-hidden="true" />
              {enviado ? (
                <div role="status" aria-live="polite" className="py-4">
                  <p className="label text-ok">Solicitação pronta</p>
                  <p className="mt-4 font-serif text-2xl text-ink sm:text-3xl">
                    Pronto! Abrimos o WhatsApp com sua solicitação.
                  </p>
                  <p className="mt-3 text-ink-2">É só enviar a mensagem. A equipe confirma a disponibilidade.</p>
                  <p className="mt-6 text-sm text-slate">O WhatsApp não abriu?</p>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <a href={enviado} target="_blank" rel="noopener" className="btn btn-ink">
                      <WhatsIcon /> Abrir WhatsApp
                      <span className="sr-only"> (nova aba)</span>
                    </a>
                    <button type="button" className="btn btn-line" onClick={() => setEnviado(null)}>
                      Editar solicitação
                    </button>
                  </div>
                </div>
              ) : (
                <form noValidate onSubmit={onSubmit} aria-describedby={`${uid}-privacidade`}>
                  <div aria-live="polite" className="sr-only">
                    {Object.values(erros).filter(Boolean).length > 0 &&
                      `Há ${Object.values(erros).filter(Boolean).length} campo(s) para corrigir.`}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor={`${uid}-nome`} className="mb-2 block font-semibold text-ink">
                        Nome completo <span className="font-normal text-slate">(obrigatório)</span>
                      </label>
                      <input
                        id={`${uid}-nome`}
                        name="nome"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={120}
                        placeholder="Como devemos te chamar?"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-invalid={!!erros.nome}
                        aria-describedby={descr('nome')}
                        className="field"
                      />
                      {erros.nome && (
                        <p id={`${uid}-nome-erro`} className="mt-2 text-sm font-semibold text-brick">
                          {erros.nome}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor={`${uid}-atendimento`} className="mb-2 block font-semibold text-ink">
                        Atendimento desejado{' '}
                        <span className="font-normal text-slate">
                          {CONFIG.agendamento.exigirAtendimento ? '(obrigatório)' : '(opcional)'}
                        </span>
                      </label>
                      <select
                        id={`${uid}-atendimento`}
                        name="atendimento"
                        value={atendimento}
                        onChange={(e) => setAtendimento(e.target.value)}
                        aria-invalid={!!erros.atendimento}
                        aria-describedby={descr('atendimento')}
                        className="field"
                      >
                        <option value="">Escolha uma opção</option>
                        {atendimentos.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      {erros.atendimento && (
                        <p id={`${uid}-atendimento-erro`} className="mt-2 text-sm font-semibold text-brick">
                          {erros.atendimento}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`${uid}-data`} className="mb-2 block font-semibold text-ink">
                        Data preferida <span className="font-normal text-slate">(opcional)</span>
                      </label>
                      <input
                        id={`${uid}-data`}
                        name="data"
                        type="date"
                        min={min}
                        value={data}
                        onChange={(e) => onData(e.target.value)}
                        aria-invalid={!!erros.data}
                        aria-describedby={descr('data', `${uid}-data-dica`)}
                        className="field num"
                      />
                      <p id={`${uid}-data-dica`} className="mt-2 text-sm text-slate">
                        Atendimento de segunda a sexta.
                      </p>
                      {erros.data && (
                        <p id={`${uid}-data-erro`} className="mt-1 text-sm font-semibold text-brick">
                          {erros.data}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`${uid}-hora`} className="mb-2 block font-semibold text-ink">
                        Horário preferido <span className="font-normal text-slate">(opcional)</span>
                      </label>
                      <select
                        id={`${uid}-hora`}
                        name="hora"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        disabled={!data || !!erros.data || horas.length === 0}
                        aria-describedby={`${uid}-hora-dica`}
                        className="field num disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">Escolha um horário</option>
                        {horas.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <p id={`${uid}-hora-dica`} className="mt-2 text-sm text-slate">
                        {data && !erros.data ? 'Blocos de uma hora.' : 'Disponível após escolher a data.'}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor={`${uid}-obs`} className="mb-2 block font-semibold text-ink">
                        Observações <span className="font-normal text-slate">(opcional)</span>
                      </label>
                      <textarea
                        id={`${uid}-obs`}
                        name="obs"
                        rows={3}
                        maxLength={300}
                        placeholder="Se quiser, conte o que você precisa."
                        value={obs}
                        onChange={(e) => setObs(e.target.value)}
                        aria-describedby={`${uid}-obs-dica`}
                        className="field min-h-24 resize-y"
                      />
                      <div id={`${uid}-obs-dica`} className="mt-2 flex justify-between gap-4 text-sm text-slate">
                        <p>
                          Não é preciso detalhar o caso aqui, nem enviar documentos ou dados sigilosos. Conversamos com
                          calma pelo WhatsApp.
                        </p>
                        <span className="num shrink-0" aria-label={`${obs.length} de 300 caracteres`}>
                          {obs.length}/300
                        </span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={enviando} className="btn btn-ink mt-8 w-full disabled:opacity-70 sm:w-auto">
                    <WhatsIcon />
                    {enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                  </button>
                  <p id={`${uid}-privacidade`} className="mt-4 text-sm text-slate">
                    Ao enviar, você abre uma conversa no WhatsApp com o escritório. Este site não guarda os dados
                    digitados.{' '}
                    <a href="/privacidade.html" className="link">
                      Privacidade
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
