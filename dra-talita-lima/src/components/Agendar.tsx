import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { CONFIG } from '../config'
import { blocosDoDia, hhmm, horarioDoDia, linkWhatsApp, minutos } from '../lib/util'
import { BotaoLigar, BotaoWhatsApp, Enfase, IconeWhatsApp, Revela } from './base'

const OPCOES_EXTRAS = ['Primeira avaliação', 'Ainda não sei, quero conversar']

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function diaDaSemana(iso: string) {
  const [a, mes, d] = iso.split('-').map(Number)
  return new Date(a, mes - 1, d).getDay()
}
function dataBR(iso: string) {
  const [a, mes, d] = iso.split('-')
  return `${d}/${mes}/${a}`
}

/** Mancha de aquarela onde a linha de fluxo termina, envolvendo o botão de envio. */
function ManchaFim() {
  return (
    <svg className="mancha-fim pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 h-[calc(100%+3rem)] w-[calc(100%+4rem)]" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="mancha-fim-aq" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="12" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>
      <g filter="url(#mancha-fim-aq)">
        <ellipse cx="96" cy="41" rx="92" ry="33" fill="#f0ddc9" />
        <ellipse cx="70" cy="44" rx="58" ry="22" fill="#e8cbb3" opacity=".6" />
        <ellipse cx="150" cy="34" rx="40" ry="16" fill="#f3e4d5" opacity=".8" />
      </g>
    </svg>
  )
}

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario' | 'obs', string>>

export function Agendar() {
  const uid = useId()
  const ids = {
    nome: `${uid}-nome`,
    atendimento: `${uid}-atend`,
    data: `${uid}-data`,
    horario: `${uid}-hora`,
    obs: `${uid}-obs`,
  }
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [urlEnviada, setUrlEnviada] = useState<string | null>(null)
  const [bloqueado, setBloqueado] = useState(false)
  const [hoje, setHoje] = useState('')
  const focarNome = useRef(false)

  // data mínima calculada no navegador (evita divergência com o HTML pré-renderizado)
  const [pronto, setPronto] = useState(false)
  useEffect(() => {
    setHoje(hojeISO())
    setPronto(true)
  }, [])

  const opcoesAtendimento = useMemo(
    () => [...CONFIG.atendimentos.filter((a) => a.titulo).map((a) => (a.id === 'fleboestetica' ? 'Fleboestética (varizes e vasinhos)' : a.titulo)), ...OPCOES_EXTRAS],
    [],
  )

  const diaFechado = data !== '' && !horarioDoDia(diaDaSemana(data))
  const dataPassada = data !== '' && hoje !== '' && data < hoje

  const blocos = useMemo(() => {
    if (!data || diaFechado) return []
    let b = blocosDoDia(diaDaSemana(data))
    if (data === hoje) {
      const agora = new Date()
      const min = agora.getHours() * 60 + agora.getMinutes()
      b = b.filter((h) => minutos(h) > min)
    }
    return b
  }, [data, diaFechado, hoje])

  useEffect(() => {
    if (horario && !blocos.includes(horario)) setHorario('')
  }, [blocos, horario])

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome completo.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    if (data) {
      if (dataPassada) e.data = 'Escolha uma data a partir de hoje.'
      else if (diaFechado) e.data = 'Dia sem atendimento, escolha outra data.'
      else if (blocos.length === 0) e.data = 'Não há mais horários neste dia, escolha outra data.'
    }
    if (obs.length > CONFIG.agendamento.limiteObservacoes) e.obs = `Use no máximo ${CONFIG.agendamento.limiteObservacoes} caracteres.`
    return e
  }

  function montarMensagem() {
    return [
      CONFIG.mensagens.agendamento,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (Object.keys(e) as (keyof Erros)[])[0]
    if (primeiro) {
      document.getElementById(ids[primeiro])?.focus()
      return
    }
    setEnviando(true)
    const url = linkWhatsApp(montarMensagem())
    const janela = window.open(url, '_blank')
    if (janela) janela.opener = null
    setBloqueado(!janela)
    setUrlEnviada(url)
    setEnviando(false)
  }

  function novaSolicitacao() {
    setUrlEnviada(null)
    setBloqueado(false)
    focarNome.current = true
  }

  const erroData = erros.data || (diaFechado ? 'Dia sem atendimento, escolha outra data.' : dataPassada ? 'Escolha uma data a partir de hoje.' : '')

  const rotuloCampo = 'block text-[0.95rem] font-medium text-marinho'
  const ajuda = 'mt-1.5 text-[0.82rem] text-tinta'
  const erro = 'mt-1.5 text-[0.85rem] font-medium text-[#b42318]'

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative py-24 md:py-36">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Revela className="lg:pt-6">
          <p className="rotulo">Praticidade</p>
          <h2 id="titulo-agendar" className="titulo-secao mt-5 text-marinho">
            <Enfase texto="Peça seu horário em poucos *cliques*." />
          </h2>
          <p className="mt-6 max-w-md text-[1.08rem] text-tinta">
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
          <p className="mt-4 max-w-md text-[0.98rem] text-tinta">
            O dia e o horário escolhidos são uma preferência. A confirmação acontece na conversa com a clínica.
          </p>
          <ul className="mt-8 space-y-3 text-[0.98rem] text-marinho">
            {['Sem cadastro e sem senha', 'Nenhum dado fica guardado neste site', 'Você revisa a mensagem antes de enviar'].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-px w-6 bg-vinho" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </Revela>

        <Revela atraso={100}>
          {CONFIG.agendamento.atendeUrgencia && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-vinho/30 bg-white/70 p-5">
              <p className="font-medium text-marinho">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <BotaoWhatsApp>Falar agora</BotaoWhatsApp>
            </div>
          )}

          <div className="relative">
            {/* mancha de aquarela que recebe o fim da linha de fluxo */}
            <div className="pointer-events-none absolute -inset-6 -z-0 rounded-[3rem] bg-pessego/55 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[2rem] border border-linha bg-white p-6 shadow-[0_40px_80px_-55px_rgba(37,42,69,.6)] sm:p-9">
              <AnimatePresence mode="wait" initial={false}>
                {urlEnviada ? (
                  <m.div
                    key="ok"
                    ref={(el: HTMLDivElement | null) => el?.focus({ preventScroll: true })}
                    tabIndex={-1}
                    role="status"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex min-h-[28rem] flex-col items-start justify-center outline-none"
                  >
                    <CheckCircle2 className="size-10 text-vinho" strokeWidth={1.3} aria-hidden="true" />
                    <p className="mt-6 font-serif text-[2rem] leading-tight text-marinho">Pronto!</p>
                    <p className="mt-3 max-w-md text-[1.05rem] text-tinta">
                      Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <a href={urlEnviada} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                        <IconeWhatsApp />
                        <span>Abrir WhatsApp</span>
                      </a>
                      <button type="button" onClick={novaSolicitacao} className="btn btn-secundario">
                        Fazer outra solicitação
                      </button>
                    </div>
                    <p className="mt-4 text-[0.85rem] text-tinta">
                      {bloqueado
                        ? 'O navegador bloqueou a nova aba. Toque em “Abrir WhatsApp” para continuar.'
                        : 'Se o WhatsApp não abriu, toque em “Abrir WhatsApp”.'}
                    </p>
                  </m.div>
                ) : (
                  <m.form
                    key="form"
                    ref={(el: HTMLFormElement | null) => {
                      if (el && focarNome.current) {
                        focarNome.current = false
                        document.getElementById(ids.nome)?.focus()
                      }
                    }}
                    noValidate
                    onSubmit={enviar}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    aria-describedby={`${uid}-aviso`}
                    className="grid gap-6"
                  >
                    <div>
                      <label htmlFor={ids.nome} className={rotuloCampo}>
                        Nome completo <span className="text-vinho" aria-hidden="true">*</span>
                        <span className="sr-only"> (obrigatório)</span>
                      </label>
                      <input
                        id={ids.nome}
                        name="nome"
                        type="text"
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-invalid={!!erros.nome}
                        aria-describedby={erros.nome ? `${ids.nome}-erro` : undefined}
                        placeholder="Como devemos te chamar?"
                        value={nome}
                        onChange={(e) => {
                          setNome(e.target.value)
                          if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                        }}
                        className="campo mt-2"
                      />
                      <div aria-live="polite">{erros.nome && <p id={`${ids.nome}-erro`} className={erro}>{erros.nome}</p>}</div>
                    </div>

                    <div>
                      <label htmlFor={ids.atendimento} className={rotuloCampo}>
                        Atendimento desejado{' '}
                        {CONFIG.agendamento.exigirAtendimento ? (
                          <span className="text-vinho" aria-hidden="true">*</span>
                        ) : (
                          <span className="font-normal text-tinta">(opcional)</span>
                        )}
                      </label>
                      <select
                        id={ids.atendimento}
                        name="atendimento"
                        aria-invalid={!!erros.atendimento}
                        aria-describedby={erros.atendimento ? `${ids.atendimento}-erro` : undefined}
                        value={atendimento}
                        onChange={(e) => setAtendimento(e.target.value)}
                        className="campo mt-2"
                      >
                        <option value="">Escolha um atendimento</option>
                        {opcoesAtendimento.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      <div aria-live="polite">
                        {erros.atendimento && <p id={`${ids.atendimento}-erro`} className={erro}>{erros.atendimento}</p>}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor={ids.data} className={rotuloCampo}>
                          Data preferida <span className="font-normal text-tinta">(opcional)</span>
                        </label>
                        <input
                          id={ids.data}
                          name="data"
                          type="date"
                          min={hoje || undefined}
                          aria-invalid={!!erroData}
                          aria-describedby={`${ids.data}-ajuda${erroData ? ` ${ids.data}-erro` : ''}`}
                          value={data}
                          onChange={(e) => {
                            setData(e.target.value)
                            setErros((x) => ({ ...x, data: undefined }))
                          }}
                          className="campo mt-2"
                        />
                        <p id={`${ids.data}-ajuda`} className={ajuda}>
                          Atendimento de segunda a sexta.
                        </p>
                        <div aria-live="polite">{erroData && <p id={`${ids.data}-erro`} className={erro}>{erroData}</p>}</div>
                      </div>
                      <div>
                        <label htmlFor={ids.horario} className={rotuloCampo}>
                          Horário preferido <span className="font-normal text-tinta">(opcional)</span>
                        </label>
                        <select
                          id={ids.horario}
                          name="horario"
                          value={horario}
                          disabled={!data || !!erroData || blocos.length === 0}
                          aria-describedby={`${ids.horario}-ajuda`}
                          onChange={(e) => setHorario(e.target.value)}
                          className="campo mt-2 disabled:cursor-not-allowed disabled:bg-marfim-2 disabled:text-tinta"
                        >
                          <option value="">Escolha um horário</option>
                          {blocos.map((b) => (
                            <option key={b} value={b}>
                              {b} às {hhmm(minutos(b) + CONFIG.agendamento.duracaoBlocoMin)}
                            </option>
                          ))}
                        </select>
                        <p id={`${ids.horario}-ajuda`} className={ajuda}>
                          {data ? 'Sujeito à confirmação da clínica.' : 'Escolha uma data para ver os horários.'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor={ids.obs} className={rotuloCampo}>
                        Observações <span className="font-normal text-tinta">(opcional)</span>
                      </label>
                      <textarea
                        id={ids.obs}
                        name="observacoes"
                        rows={3}
                        maxLength={CONFIG.agendamento.limiteObservacoes}
                        placeholder="Se quiser, conte o que você precisa."
                        aria-invalid={!!erros.obs}
                        aria-describedby={`${ids.obs}-ajuda ${ids.obs}-contador`}
                        value={obs}
                        onChange={(e) => setObs(e.target.value)}
                        className="campo mt-2 min-h-28 resize-y"
                      />
                      <div className="mt-1.5 flex justify-between gap-4">
                        <p id={`${ids.obs}-ajuda`} className="text-[0.82rem] text-tinta">
                          Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.
                        </p>
                        <p id={`${ids.obs}-contador`} className="shrink-0 text-[0.82rem] tabular-nums text-tinta">
                          {obs.length}/{CONFIG.agendamento.limiteObservacoes}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <span data-fluxo="fim" className="relative inline-flex grow sm:grow-0">
                        <ManchaFim />
                        <button type="submit" className="btn btn-primario relative grow" aria-busy={enviando} disabled={enviando || !pronto}>
                          <IconeWhatsApp />
                          <span>{enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}</span>
                        </button>
                      </span>
                      <BotaoLigar className="grow sm:grow-0" />
                    </div>
                    <p id={`${uid}-aviso`} className="-mt-1 text-[0.85rem] leading-relaxed text-tinta">
                      Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                      <a href="/privacidade.html" className="link-sublinhado text-marinho">
                        Saiba mais sobre privacidade
                      </a>
                      .
                    </p>
                  </m.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Revela>
      </div>
    </section>
  )
}
