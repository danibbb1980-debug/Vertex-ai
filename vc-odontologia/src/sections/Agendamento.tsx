import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { horariosDoDia, lerData, montarMensagem, opcoesAtendimento, proximosDias, rotuloDia, urlWhatsApp, validar, dataISO, type Erros, type Pedido } from '../lib/agenda'
import { CabecalhoSecao, IconeConversa, IconeRelogio, IconeSeta, IconeWhatsApp, linkPrivacidade } from '../components/base'

const VAZIO: Pedido = { nome: '', atendimento: '', data: '', horario: '', observacoes: '' }
const ORDEM: (keyof Pedido)[] = ['nome', 'atendimento', 'data', 'horario', 'observacoes']

/** Resumo dos dias de atendimento, vindo do CONFIG (ex.: "Segunda a sexta, 09h às 19h · Sábado, 08h às 12h"). */
const resumoDias = CONFIG.horarios
  .filter((h) => h.abre)
  .map((h) => `${h.dias}, ${h.horas}`)
  .join(' · ')

/** Mensagem de erro do campo. A região fica sempre no DOM para o leitor de tela anunciar. */
function Erro({ id, texto }: { id: string; texto?: string }) {
  return (
    <div aria-live="polite">
      {texto && (
        <p id={id} className="mt-2 flex items-center gap-2 text-sm font-medium text-erro">
          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-current" />
          {texto}
        </p>
      )}
    </div>
  )
}

export function Agendamento() {
  const uid = useId()
  const id = (campo: string) => `${uid}-${campo}`
  const [p, setP] = useState<Pedido>(VAZIO)
  const [erros, setErros] = useState<Erros>({})
  const [tentou, setTentou] = useState(false)
  const [estado, setEstado] = useState<'form' | 'abrindo' | 'pronto'>('form')
  const [bloqueado, setBloqueado] = useState(false)
  const [url, setUrl] = useState('')
  const [aviso, setAviso] = useState('')
  // A data mínima depende do relógio do visitante: calculada só no navegador.
  const [hoje, setHoje] = useState<string>()
  const [agora, setAgora] = useState<Date>()
  const [qtdDias, setQtdDias] = useState(12)
  const form = useRef<HTMLFormElement>(null)
  const confirmacao = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const n = new Date()
    setAgora(n)
    setHoje(dataISO(n))
  }, [])
  // Lista calculada só no navegador (depende do relógio do visitante)
  const dias = agora ? proximosDias(agora, qtdDias) : []
  useEffect(() => {
    if (estado === 'pronto') confirmacao.current?.focus()
  }, [estado])

  const d = lerData(p.data)
  const erroData = p.data ? validar({ ...VAZIO, nome: 'x', data: p.data }).data : undefined
  const horarios = d && !erroData ? horariosDoDia(d) : []

  const mudar = (campo: keyof Pedido, valor: string) => {
    const novo = { ...p, [campo]: valor }
    // Troca de data: descarta um horário que não existe no novo dia
    if (campo === 'data') {
      const nd = lerData(valor)
      if (!nd || !horariosDoDia(nd).includes(novo.horario)) novo.horario = ''
    }
    setP(novo)
    if (tentou) setErros(validar(novo))
    else if (campo === 'data') setErros((e) => ({ ...e, data: valor ? validar({ ...VAZIO, nome: 'x', data: valor }).data : undefined }))
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const er = validar(p)
    setErros(er)
    setTentou(true)
    const invalidos = ORDEM.filter((c) => er[c])
    if (invalidos.length) {
      setAviso(invalidos.length === 1 ? 'Revise o campo destacado.' : `Revise os ${invalidos.length} campos destacados.`)
      form.current?.querySelector<HTMLElement>(`#${CSS.escape(id(invalidos[0]))}`)?.focus()
      return
    }
    setAviso('')
    const u = urlWhatsApp(montarMensagem(p))
    setUrl(u)
    setEstado('abrindo')
    // Abre no mesmo clique (evita o bloqueador) e corta o vínculo com esta página (noopener)
    const janela = window.open(u, '_blank')
    if (janela) janela.opener = null
    setBloqueado(!janela)
    window.setTimeout(() => setEstado('pronto'), 450)
  }

  const novaSolicitacao = () => {
    setP(VAZIO)
    setErros({})
    setTentou(false)
    setEstado('form')
    setBloqueado(false)
    window.setTimeout(() => form.current?.querySelector<HTMLElement>('input')?.focus(), 0)
  }

  const descr = (campo: keyof Pedido, ...extras: string[]) =>
    [...extras, erros[campo] ? id(`${campo}-erro`) : ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-sand py-24 sm:py-32">
      <div className="container-vc grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:pt-4">
          <CabecalhoSecao
            id="titulo-agendar"
            rotulo="Praticidade"
            titulo={
              <>
                Peça seu horário em poucos <em>cliques</em>.
              </>
            }
            intro="Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade."
          />
          <ul className="revela mt-10 space-y-5 text-tinta-suave">
            <li className="flex gap-4">
              <IconeRelogio tamanho={22} className="mt-0.5 shrink-0 text-ouro" />
              <span>Data e horário são preferências: a clínica confirma a disponibilidade com você pelo WhatsApp.</span>
            </li>
            <li className="flex gap-4">
              <IconeConversa tamanho={22} className="mt-0.5 shrink-0 text-ouro" />
              <span>Não pedimos telefone, e-mail nem dados de saúde. A conversa segue no WhatsApp.</span>
            </li>
          </ul>
        </div>

        <div className="revela relative rounded-2xl border border-linho bg-[#fbf9f4] p-6 sm:p-10">
          {CONFIG.agendamento.atendeUrgencia && (
            <div className="mb-8 flex flex-col gap-3 rounded-xl border border-erro/30 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-tinta">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <a
                href={urlWhatsApp('Olá! Estou com dor ou urgência e gostaria de atendimento.')}
                target="_blank"
                rel="noopener noreferrer"
                className="botao botao-azul !min-h-12 shrink-0"
              >
                <IconeWhatsApp tamanho={18} /> Falar agora
              </a>
            </div>
          )}

          {estado === 'pronto' ? (
            <div role="status" className="flex min-h-[28rem] flex-col justify-center">
              <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full border border-ouro/60 text-ouro">
                <IconeWhatsApp tamanho={26} />
              </span>
              <h3 ref={confirmacao} tabIndex={-1} className="mt-6 text-4xl text-tinta outline-none">
                <em>Pronto!</em>
              </h3>
              {bloqueado ? (
                <p className="mt-4 text-lg leading-relaxed text-tinta-suave">
                  Seu navegador não abriu a nova aba. Toque em <strong className="text-tinta">Abrir WhatsApp</strong> para ver sua
                  solicitação e é só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
              ) : (
                <p className="mt-4 text-lg leading-relaxed text-tinta-suave">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={url} target="_blank" rel="noopener noreferrer" className={`botao ${bloqueado ? 'botao-azul' : 'botao-contorno-escuro'}`}>
                  <IconeWhatsApp tamanho={19} />
                  Abrir WhatsApp
                  <IconeSeta tamanho={16} className="seta" />
                </a>
                <button type="button" onClick={novaSolicitacao} className="botao botao-contorno-escuro">
                  Fazer outra solicitação
                </button>
              </div>
            </div>
          ) : (
            <form ref={form} noValidate onSubmit={enviar} aria-labelledby={id('titulo-form')}>
              <h3 id={id('titulo-form')} className="text-[1.9rem] leading-tight text-tinta">
                Solicitar agendamento
              </h3>
              <p className="mt-2 text-sm text-tinta-suave">
                Campos com <span aria-hidden="true">*</span>
                <span className="sr-only">asterisco</span> são obrigatórios.
              </p>

              <div className="mt-8 grid gap-6">
                <div>
                  <label htmlFor={id('nome')} className="rotulo-campo">
                    Nome completo <span aria-hidden="true" className="text-erro">*</span>
                  </label>
                  <input
                    id={id('nome')}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Como devemos te chamar?"
                    value={p.nome}
                    onChange={(e) => mudar('nome', e.target.value)}
                    aria-required="true"
                    aria-invalid={!!erros.nome}
                    aria-describedby={descr('nome')}
                    maxLength={120}
                    className="campo"
                  />
                  <Erro id={id('nome-erro')} texto={erros.nome} />
                </div>

                <div>
                  <label htmlFor={id('atendimento')} className="rotulo-campo">
                    Atendimento desejado{' '}
                    {CONFIG.agendamento.exigirAtendimento ? (
                      <span aria-hidden="true" className="text-erro">
                        *
                      </span>
                    ) : (
                      <span className="font-normal text-tinta-suave">(opcional)</span>
                    )}
                  </label>
                  <select
                    id={id('atendimento')}
                    name="atendimento"
                    value={p.atendimento}
                    onChange={(e) => mudar('atendimento', e.target.value)}
                    aria-required={CONFIG.agendamento.exigirAtendimento || undefined}
                    aria-invalid={!!erros.atendimento}
                    aria-describedby={descr('atendimento')}
                    className="campo campo-select"
                  >
                    <option value="">Escolha um atendimento</option>
                    {opcoesAtendimento().map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <Erro id={id('atendimento-erro')} texto={erros.atendimento} />
                </div>

                {/* Data: só os próximos dias de atendimento (dias fechados e passados não aparecem) */}
                <fieldset aria-describedby={descr('data', id('data-dica'))}>
                  <legend className="rotulo-campo">
                    Data preferida <span className="font-normal text-tinta-suave">(opcional)</span>
                  </legend>
                  <p id={id('data-dica')} className="-mt-1 mb-3 text-xs leading-relaxed text-tinta-suave">
                    {resumoDias}. Domingo fechado.
                  </p>
                  {dias.length ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      <label className="chip col-span-3 sm:col-span-4">
                        <input
                          type="radio"
                          name="data"
                          value=""
                          checked={!p.data}
                          onChange={() => mudar('data', '')}
                          className="sr-only"
                        />
                        Sem preferência de data
                      </label>
                      {dias.map((iso, i) => {
                        const r = rotuloDia(iso)
                        return (
                          <label key={iso} className="chip flex-col !gap-0" title={r.longo}>
                            <input
                              id={i === 0 ? id('data') : undefined}
                              type="radio"
                              name="data"
                              value={iso}
                              checked={p.data === iso}
                              onChange={() => mudar('data', iso)}
                              aria-label={r.longo}
                              className="sr-only"
                            />
                            <span aria-hidden="true" className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] opacity-75">
                              {iso === hoje ? 'Hoje' : r.semana}
                            </span>
                            <span aria-hidden="true" className="text-base font-semibold tabular-nums">
                              {r.data}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-tinta-suave">Carregando as próximas datas…</p>
                  )}
                  {dias.length > 0 && qtdDias < 36 && (
                    <button
                      type="button"
                      onClick={() => setQtdDias((n) => n + 12)}
                      className="link-sublinhado mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-azul"
                    >
                      Ver mais datas
                    </button>
                  )}
                  <Erro id={id('data-erro')} texto={erros.data} />
                </fieldset>

                {/* Horário: aparece depois de escolher a data, em blocos de 1 hora */}
                {d && horarios.length > 0 && (
                  <fieldset aria-describedby={descr('horario', id('horario-dica'))}>
                    <legend className="rotulo-campo">
                      Horário preferido <span className="font-normal text-tinta-suave">(opcional)</span>
                    </legend>
                    <p id={id('horario-dica')} className="-mt-1 mb-3 text-xs leading-relaxed text-tinta-suave">
                      {rotuloDia(p.data).longo}. Horários sujeitos à confirmação da clínica.
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      <label className="chip col-span-3 sm:col-span-5">
                        <input
                          id={id('horario')}
                          type="radio"
                          name="horario"
                          value=""
                          checked={!p.horario}
                          onChange={() => mudar('horario', '')}
                          className="sr-only"
                        />
                        Sem preferência de horário
                      </label>
                      {horarios.map((h) => (
                        <label key={h} className="chip tabular-nums">
                          <input
                            type="radio"
                            name="horario"
                            value={h}
                            checked={p.horario === h}
                            onChange={() => mudar('horario', h)}
                            className="sr-only"
                          />
                          {h}
                        </label>
                      ))}
                    </div>
                    <Erro id={id('horario-erro')} texto={erros.horario} />
                  </fieldset>
                )}

                <div>
                  <label htmlFor={id('observacoes')} className="rotulo-campo">
                    Observações <span className="font-normal text-tinta-suave">(opcional)</span>
                  </label>
                  <textarea
                    id={id('observacoes')}
                    name="observacoes"
                    rows={3}
                    maxLength={CONFIG.agendamento.limiteObservacoes}
                    placeholder="Se quiser, conte o que você precisa."
                    value={p.observacoes}
                    onChange={(e) => mudar('observacoes', e.target.value)}
                    aria-invalid={!!erros.observacoes}
                    aria-describedby={descr('observacoes', id('obs-dica'))}
                    className="campo min-h-28 resize-y py-3"
                  />
                  <div id={id('obs-dica')} className="mt-2 flex items-start justify-between gap-4 text-xs leading-relaxed text-tinta-suave">
                    <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                    <span className="shrink-0 tabular-nums" aria-label={`${p.observacoes.length} de ${CONFIG.agendamento.limiteObservacoes} caracteres`}>
                      {p.observacoes.length}/{CONFIG.agendamento.limiteObservacoes}
                    </span>
                  </div>
                  <Erro id={id('observacoes-erro')} texto={erros.observacoes} />
                </div>
              </div>

              <p aria-live="assertive" className="mt-6 text-sm font-semibold text-erro">
                {aviso}
              </p>

              <button type="submit" disabled={estado === 'abrindo'} aria-busy={estado === 'abrindo'} className="botao botao-azul mt-6 w-full sm:w-auto">
                {estado === 'abrindo' ? (
                  <>
                    <span aria-hidden="true" className="carregando" />
                    Abrindo o WhatsApp…
                  </>
                ) : (
                  <>
                    <IconeWhatsApp tamanho={19} />
                    Enviar solicitação pelo WhatsApp
                  </>
                )}
              </button>
              <p className="mt-5 text-xs leading-relaxed text-tinta-suave">
                Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                <a href={linkPrivacidade} className="link-sublinhado font-semibold text-azul">
                  Privacidade
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
