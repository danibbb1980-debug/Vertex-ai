import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { agoraSP, aberto, diaPorDow, diasFechados, dowDeYmd, linkWhatsapp, slotsDoDia, somarDias, temWhatsapp, ymdParaBr } from '../lib/dados'
import { IconeEnviar, IconeWhatsapp } from './Icones'

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario' | 'obs', string>>
type Estado = 'editando' | 'abrindo' | 'enviado' | 'bloqueado'

export function montarMensagem(v: { nome: string; atendimento: string; data: string; horario: string; obs: string }): string {
  return [
    CONFIG.mensagens.solicitacao,
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${v.atendimento || 'a definir'}`,
    `Data preferida: ${v.data ? ymdParaBr(v.data) : 'a combinar'}`,
    `Horário preferido: ${v.horario || 'a combinar'}`,
    `Observações: ${v.obs.trim() || '-'}`,
  ].join('\n')
}

function Campo({
  id,
  rotulo,
  opcional,
  erro,
  ajuda,
  children,
}: {
  id: string
  rotulo: string
  opcional?: boolean
  erro?: string
  ajuda?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.95rem] font-semibold text-grafite">
        {rotulo}
        {opcional && <span className="text-[0.8rem] font-medium text-suave">opcional</span>}
      </label>
      {children}
      {ajuda && !erro && (
        <p id={`${id}-ajuda`} className="text-[0.85rem] text-suave">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="flex items-center gap-1.5 text-[0.88rem] font-semibold text-erro">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
          </svg>
          {erro}
        </p>
      )}
    </div>
  )
}

export function Agendamento() {
  const uid = useId()
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<Estado>('editando')
  const [url, setUrl] = useState('')
  const [hoje, setHoje] = useState<{ ymd: string; minutos: number } | null>(null)
  const aviso = useRef<HTMLDivElement>(null)
  const nomeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const a = agoraSP()
    setHoje({ ymd: a.ymd, minutos: a.minutos })
  }, [])

  const opcoes = useMemo(() => [...CONFIG.atendimentos.map((a) => a.nome), ...CONFIG.agendamento.opcoesExtras], [])

  const slots = useMemo(() => {
    if (!data) return []
    const s = slotsDoDia(diaPorDow(dowDeYmd(data)))
    if (hoje && data === hoje.ymd) {
      return s.filter((h) => {
        const [hh, mm] = h.split(':').map(Number)
        return hh * 60 + mm > hoje.minutos + 30
      })
    }
    return s
  }, [data, hoje])

  if (!CONFIG.secoes.agendamento || !temWhatsapp) return null

  const ids = {
    nome: `${uid}-nome`,
    atendimento: `${uid}-atendimento`,
    data: `${uid}-data`,
    horario: `${uid}-horario`,
    obs: `${uid}-obs`,
  }

  const fechadosTexto = diasFechados.map((d) => d.nome.replace('-feira', '').toLowerCase()).join(' e ')

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Use uma data válida.'
    if (hoje && v < hoje.ymd) return 'Escolha uma data a partir de hoje.'
    if (!aberto(diaPorDow(dowDeYmd(v)))) return 'Dia sem atendimento, escolha outra data.'
    if (hoje && v > somarDias(hoje.ymd, CONFIG.agendamento.diasAFrente)) return 'Escolha uma data mais próxima.'
    return undefined
  }

  function onData(v: string) {
    setData(v)
    setHorario('')
    setErros((e) => ({ ...e, data: validarData(v), horario: undefined }))
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (data && !ed && slots.length === 0) e.data = 'Não há mais horários nesta data, escolha outra.'
    if (horario && !slots.includes(horario)) e.horario = 'Escolha um horário da lista.'
    if (obs.length > CONFIG.agendamento.limiteObservacoes) e.obs = `Use até ${CONFIG.agendamento.limiteObservacoes} caracteres.`
    return e
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
    const link = linkWhatsapp(montarMensagem({ nome, atendimento, data, horario, obs }))
    setUrl(link)
    setEstado('abrindo')
    // Abre dentro do clique (evita bloqueio). Com a flag "noopener" o navegador sempre
    // devolve null e não daria para saber se abriu; por isso cortamos o opener à mão.
    const w = window.open(link, '_blank')
    if (w) {
      try {
        w.opener = null
      } catch {
        /* nada */
      }
    }
    window.setTimeout(() => {
      setEstado(w ? 'enviado' : 'bloqueado')
      requestAnimationFrame(() => aviso.current?.focus())
    }, 450)
  }

  function recomecar() {
    setEstado('editando')
    setUrl('')
    requestAnimationFrame(() => nomeRef.current?.focus())
  }

  const desc = (k: keyof Erros, ajuda?: boolean) => (erros[k] ? `${ids[k]}-erro` : ajuda ? `${ids[k]}-ajuda` : undefined)
  const minData = hoje?.ymd
  const maxData = hoje ? somarDias(hoje.ymd, CONFIG.agendamento.diasAFrente) : undefined
  const restante = CONFIG.agendamento.limiteObservacoes - obs.length

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative overflow-hidden bg-areia py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(246_240_230/0.9),transparent)]" />
      <div className="container-site relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:pt-6">
          <p className="rotulo revela">Praticidade</p>
          <h2 id="titulo-agendar" className="revela mt-4 text-[clamp(2.1rem,5vw,3.3rem)]" style={{ ['--atraso' as string]: '80ms' }}>
            Peça seu horário em poucos <em>cliques</em>.
          </h2>
          <p className="revela mt-5 max-w-[30rem] text-[1.08rem] text-suave" style={{ ['--atraso' as string]: '160ms' }}>
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega pelo WhatsApp, e a equipe responde com a disponibilidade.
          </p>
          <ul className="revela mt-8 space-y-3 text-[0.98rem] text-grafite" style={{ ['--atraso' as string]: '240ms' }}>
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-mel" aria-hidden="true" />O dia e o horário escolhidos são preferências, sujeitas à disponibilidade.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-mel" aria-hidden="true" />
              {fechadosTexto ? `Sem atendimento: ${fechadosTexto}.` : 'Atendimento de segunda a sábado.'} {CONFIG.avisoHorarios}
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-mel" aria-hidden="true" />
              Nada é enviado pelo site: a mensagem só sai quando você toca em enviar no WhatsApp.
            </li>
          </ul>
        </div>

        <div className="revela rounded-[var(--radius-card)] bg-aveia p-6 shadow-[var(--shadow-macia)] sm:p-8 md:p-10" style={{ ['--atraso' as string]: '120ms' }}>
          {estado === 'editando' || estado === 'abrindo' ? (
            <form noValidate onSubmit={enviar} className="grid gap-6" aria-describedby={`${uid}-privacidade`}>
              <Campo id={ids.nome} rotulo="Nome completo" erro={erros.nome}>
                <input
                  ref={nomeRef}
                  id={ids.nome}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={80}
                  placeholder="Como devemos te chamar?"
                  className="campo"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (erros.nome && e.target.value.trim().length >= 2) setErros((x) => ({ ...x, nome: undefined }))
                  }}
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={desc('nome')}
                />
              </Campo>

              <Campo id={ids.atendimento} rotulo="Atendimento desejado" opcional={!CONFIG.agendamento.exigirAtendimento} erro={erros.atendimento}>
                <select
                  id={ids.atendimento}
                  name="atendimento"
                  className="campo"
                  value={atendimento}
                  onChange={(e) => {
                    setAtendimento(e.target.value)
                    setErros((x) => ({ ...x, atendimento: undefined }))
                  }}
                  aria-invalid={Boolean(erros.atendimento)}
                  aria-describedby={desc('atendimento')}
                  required={CONFIG.agendamento.exigirAtendimento}
                >
                  <option value="">Escolha um atendimento</option>
                  {opcoes.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Campo>

              <div className="grid gap-6 sm:grid-cols-2">
                <Campo id={ids.data} rotulo="Data preferida" opcional erro={erros.data} ajuda={fechadosTexto ? `Sem atendimento aos ${fechadosTexto === 'domingo' ? 'domingos' : fechadosTexto}.` : undefined}>
                  <input
                    id={ids.data}
                    name="data"
                    type="date"
                    className="campo"
                    min={minData}
                    max={maxData}
                    value={data}
                    onChange={(e) => onData(e.target.value)}
                    aria-invalid={Boolean(erros.data)}
                    aria-describedby={desc('data', true)}
                  />
                </Campo>
                <Campo
                  id={ids.horario}
                  rotulo="Horário preferido"
                  opcional
                  erro={erros.horario}
                  ajuda={!data || erros.data ? 'Escolha uma data para ver os horários.' : undefined}
                >
                  <select
                    id={ids.horario}
                    name="horario"
                    className="campo"
                    value={horario}
                    disabled={!data || Boolean(erros.data) || slots.length === 0}
                    onChange={(e) => {
                      setHorario(e.target.value)
                      setErros((x) => ({ ...x, horario: undefined }))
                    }}
                    aria-invalid={Boolean(erros.horario)}
                    aria-describedby={desc('horario', !data || Boolean(erros.data))}
                  >
                    <option value="">Escolha um horário</option>
                    {slots.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>

              <Campo id={ids.obs} rotulo="Observações" opcional erro={erros.obs}>
                <textarea
                  id={ids.obs}
                  name="observacoes"
                  rows={3}
                  maxLength={CONFIG.agendamento.limiteObservacoes}
                  placeholder="Se quiser, conte o que você precisa."
                  className="campo min-h-[6.5rem] resize-y"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-invalid={Boolean(erros.obs)}
                  aria-describedby={[desc('obs'), `${ids.obs}-nota`, `${ids.obs}-contador`].filter(Boolean).join(' ')}
                />
                <div className="flex items-start justify-between gap-4">
                  <p id={`${ids.obs}-nota`} className="text-[0.82rem] text-suave">
                    Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.
                  </p>
                  <p id={`${ids.obs}-contador`} className="shrink-0 text-[0.82rem] tabular-nums text-suave" aria-live="polite">
                    {restante <= 60 ? `${restante} restantes` : <span className="sr-only">Até {CONFIG.agendamento.limiteObservacoes} caracteres</span>}
                  </p>
                </div>
              </Campo>

              <div aria-live="assertive" className="sr-only">
                {Object.values(erros).filter(Boolean).length > 0 ? `Revise o formulário: ${Object.values(erros).filter(Boolean).join(' ')}` : ''}
              </div>

              <div className="grid gap-4">
                <button
                  type="submit"
                  disabled={estado === 'abrindo'}
                  className="group/botao relative inline-flex min-h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-oliva px-6 py-3.5 text-[1.02rem] font-semibold text-aveia transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-85"
                >
                  <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-oliva-escuro transition-transform duration-500 ease-[var(--ease-mel)] group-hover/botao:scale-y-100" />
                  <span className="relative inline-flex items-center gap-2.5">
                    {estado === 'abrindo' ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-aveia/40 border-t-aveia" aria-hidden="true" />
                        Abrindo o WhatsApp…
                      </>
                    ) : (
                      <>
                        <IconeEnviar tamanho={18} /> Enviar solicitação pelo WhatsApp
                      </>
                    )}
                  </span>
                </button>
                <p id={`${uid}-privacidade`} className="text-center text-[0.85rem] leading-relaxed text-suave">
                  Ao enviar, você abre uma conversa no WhatsApp com a {CONFIG.marca.nomeCompleto}. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="font-semibold text-oliva underline underline-offset-2">
                    Privacidade
                  </a>
                </p>
              </div>
            </form>
          ) : (
            <div ref={aviso} tabIndex={-1} role="status" className="surge flex flex-col items-start gap-5 outline-none">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mel text-grafite">
                <IconeWhatsapp tamanho={26} />
              </span>
              {estado === 'enviado' ? (
                <>
                  <h3 className="text-[1.9rem]">
                    Pronto<em>!</em>
                  </h3>
                  <p className="text-[1.08rem] text-grafite">
                    Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe responde com a disponibilidade.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-[1.9rem]">
                    Falta só <em>abrir</em>.
                  </h3>
                  <p className="text-[1.08rem] text-grafite">O navegador impediu a abertura automática. Toque no botão abaixo para abrir o WhatsApp com a mensagem pronta.</p>
                </>
              )}
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-oliva px-6 font-semibold text-aveia">
                  <IconeWhatsapp tamanho={18} /> Abrir WhatsApp<span className="sr-only"> (abre em nova aba)</span>
                </a>
                <button type="button" onClick={recomecar} className="inline-flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-oliva/50 px-6 font-semibold text-oliva hover:border-oliva">
                  Editar solicitação
                </button>
              </div>
              <p className="text-[0.85rem] text-suave">Se o WhatsApp não abriu, use o botão "Abrir WhatsApp". Este site não guarda os dados digitados.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
