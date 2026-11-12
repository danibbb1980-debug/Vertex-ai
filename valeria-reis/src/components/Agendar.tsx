import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, atendimentosVisiveis, temWhatsapp, waLink, type Horario } from '../config'
import { IconeWhatsapp, Marca, Titulo } from './ui'

const EXTRAS = ['Primeira consulta', 'Ainda não sei, quero conversar']

const paraMin = (h: string) => {
  const [a, b] = h.split(':').map(Number)
  return a * 60 + b
}
const paraHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
/** dia da semana de "aaaa-mm-dd" sem efeito de fuso */
const diaSemana = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).getDay()
}
const dataBR = (iso: string) => iso.split('-').reverse().join('/')

function horariosDoDia(h: Horario | undefined): string[] {
  if (!h) return []
  const bloco = CONFIG.agendamento.blocoMinutos
  const abre = paraMin(h.abre)
  const fecha = paraMin(h.fecha)
  const out: string[] = []
  for (let t = abre; t + bloco <= fecha; t += bloco) {
    if (h.almoco) {
      const ai = paraMin(h.almoco.inicio)
      const af = paraMin(h.almoco.fim)
      if (t < af && t + bloco > ai) continue
    }
    out.push(paraHora(t))
  }
  return out
}

type Erros = Partial<Record<'nome' | 'atendimento' | 'data', string>>

export function Agendar() {
  const base = useId()
  const ids = {
    nome: `${base}-nome`,
    atendimento: `${base}-atend`,
    data: `${base}-data`,
    hora: `${base}-hora`,
    obs: `${base}-obs`,
  }
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<{ url: string; abriu: boolean } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const confirmacaoRef = useRef<HTMLHeadingElement>(null)

  const opcoes = useMemo(() => {
    const configurados = atendimentosVisiveis()
      .filter((a) => a.noFormulario)
      .map((a) => ({ valor: a.nomeCurto, rotulo: a.rotuloFormulario || a.titulo }))
    // ordem pedida: Ginecologia antes de Obstetrícia
    configurados.sort((a, b) => (a.valor === 'Ginecologia' ? -1 : b.valor === 'Ginecologia' ? 1 : 0))
    return [...configurados, ...EXTRAS.map((e) => ({ valor: e, rotulo: e }))]
  }, [])

  const diasAbertos = useMemo(() => new Set(CONFIG.horarios.flatMap((h) => h.dias)), [])
  const min = hojeISO()

  const erroData = (v: string): string | undefined => {
    if (!v) return
    if (v < min) return 'Escolha uma data a partir de hoje.'
    if (!diasAbertos.has(diaSemana(v) as Horario['dias'][number])) return 'Dia sem atendimento, escolha outra data.'
  }

  const horarios = useMemo(() => {
    let lista: string[]
    if (data && !erroData(data)) {
      lista = horariosDoDia(CONFIG.horarios.find((h) => h.dias.includes(diaSemana(data) as Horario['dias'][number])))
      if (data === min) {
        const agora = new Date()
        const limite = agora.getHours() * 60 + agora.getMinutes() + 60
        lista = lista.filter((t) => paraMin(t) >= limite)
      }
    } else {
      lista = [...new Set(CONFIG.horarios.flatMap(horariosDoDia))].sort()
    }
    return lista
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (!temWhatsapp()) return null

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const d = erroData(data)
    if (d) e.data = d
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'atendimento', 'data'] as const).find((k) => e[k])
    if (primeiro) {
      document.getElementById(ids[primeiro])?.focus()
      return
    }
    const horaValida = hora && horarios.includes(hora) ? hora : ''
    const mensagem = [
      CONFIG.mensagens.formularioAbertura,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${horaValida || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = waLink(mensagem)
    const janela = window.open(url, '_blank')
    if (janela) janela.opener = null
    setEnviado({ url, abriu: !!janela })
    requestAnimationFrame(() => confirmacaoRef.current?.focus())
  }

  const novaSolicitacao = () => {
    setEnviado(null)
    setNome('')
    setAtendimento('')
    setData('')
    setHora('')
    setObs('')
    setErros({})
    requestAnimationFrame(() => document.getElementById(ids.nome)?.focus())
  }

  const descricao = (campo: keyof Erros, ajuda?: string) =>
    [erros[campo] ? `${ids[campo]}-erro` : '', ajuda || ''].filter(Boolean).join(' ') || undefined

  const Erro = ({ campo }: { campo: keyof Erros }) =>
    erros[campo] ? (
      <p id={`${ids[campo]}-erro`} className="mt-2 flex items-center gap-2 text-[0.92rem] font-medium text-erro">
        <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-erro" />
        {erros[campo]}
      </p>
    ) : null

  const rotulo = 'mb-2 block text-[0.95rem] font-medium text-tinta'
  const opcional = <span className="font-normal text-taupe"> (opcional)</span>

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="py-24 md:py-32">
      <div className="wrap">
        <div className="no-trilho grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div data-fim-do-fio>
              <Marca>Praticidade</Marca>
            </div>
            <h2 id="titulo-agendar" className="display mt-6 text-[clamp(2.3rem,5vw,3.6rem)] text-bronze">
              <Titulo texto="Peça seu horário em poucos *cliques*." />
            </h2>
            <p className="mt-6 max-w-[26rem] text-[1.08rem] leading-relaxed">
              Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a
              equipe confirma a disponibilidade.
            </p>
            <p className="mt-4 max-w-[26rem] text-taupe">
              Dia e horário são preferências: a consulta só fica marcada depois da confirmação da equipe.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[18px] border border-linha bg-papel p-6 sm:p-9">
              {enviado ? (
                <div role="status" aria-live="polite" className="py-4">
                  <p className="rotulo text-ouro-texto">Solicitação pronta</p>
                  <h3 ref={confirmacaoRef} tabIndex={-1} className="display mt-4 text-[1.9rem] leading-tight text-bronze outline-none">
                    Pronto! Abrimos o WhatsApp com sua solicitação.
                  </h3>
                  <p className="mt-4 max-w-[30rem] text-[1.05rem] leading-relaxed">
                    É só enviar a mensagem. A equipe confirma a disponibilidade.
                  </p>
                  <p className="mt-6 text-[0.98rem] text-taupe">
                    {enviado.abriu ? 'O WhatsApp não abriu?' : 'O navegador bloqueou a nova aba.'} Use o link:
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <a href={enviado.url} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                      <IconeWhatsapp /> Abrir WhatsApp
                    </a>
                    <button type="button" onClick={novaSolicitacao} className="botao botao-linha">
                      Fazer outra solicitação
                    </button>
                  </div>
                </div>
              ) : (
                <form ref={formRef} noValidate onSubmit={enviar} aria-describedby={`${base}-aviso`}>
                  <div aria-live="polite" className="sr-only">
                    {Object.values(erros).filter(Boolean).length > 0 ? 'Há campos para corrigir no formulário.' : ''}
                  </div>
                  <div className="grid gap-6">
                    <div>
                      <label htmlFor={ids.nome} className={rotulo}>
                        Nome completo
                      </label>
                      <input
                        id={ids.nome}
                        name="nome"
                        type="text"
                        autoComplete="name"
                        required
                        aria-required="true"
                        maxLength={120}
                        placeholder="Como devemos te chamar?"
                        className="campo"
                        value={nome}
                        aria-invalid={!!erros.nome}
                        aria-describedby={descricao('nome')}
                        onChange={(e) => {
                          setNome(e.target.value)
                          if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                        }}
                      />
                      <Erro campo="nome" />
                    </div>

                    <div>
                      <label htmlFor={ids.atendimento} className={rotulo}>
                        Atendimento desejado{!CONFIG.agendamento.exigirAtendimento && opcional}
                      </label>
                      <select
                        id={ids.atendimento}
                        name="atendimento"
                        className="campo"
                        value={atendimento}
                        aria-invalid={!!erros.atendimento}
                        aria-describedby={descricao('atendimento')}
                        aria-required={CONFIG.agendamento.exigirAtendimento || undefined}
                        onChange={(e) => {
                          setAtendimento(e.target.value)
                          if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                        }}
                      >
                        <option value="">Escolha um atendimento</option>
                        {opcoes.map((o) => (
                          <option key={o.valor} value={o.valor}>
                            {o.rotulo}
                          </option>
                        ))}
                      </select>
                      <Erro campo="atendimento" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor={ids.data} className={rotulo}>
                          Data preferida{opcional}
                        </label>
                        <input
                          id={ids.data}
                          name="data"
                          type="date"
                          min={min}
                          suppressHydrationWarning
                          className="campo num"
                          value={data}
                          aria-invalid={!!erros.data}
                          aria-describedby={descricao('data', `${ids.data}-ajuda`)}
                          onChange={(e) => {
                            const v = e.target.value
                            setData(v)
                            setErros((x) => ({ ...x, data: erroData(v) }))
                          }}
                        />
                        <p id={`${ids.data}-ajuda`} className="mt-2 text-[0.85rem] text-taupe">
                          Atendimento de {CONFIG.horarios.map((h) => h.rotulo.toLowerCase()).join(', ')}.
                        </p>
                        <Erro campo="data" />
                      </div>
                      <div>
                        <label htmlFor={ids.hora} className={rotulo}>
                          Horário preferido{opcional}
                        </label>
                        <select
                          id={ids.hora}
                          name="hora"
                          className="campo num"
                          value={horarios.includes(hora) ? hora : ''}
                          disabled={!!erros.data || horarios.length === 0}
                          onChange={(e) => setHora(e.target.value)}
                        >
                          <option value="">Escolha um horário</option>
                          {horarios.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        {data && !erros.data && horarios.length === 0 && (
                          <p className="mt-2 text-[0.85rem] text-taupe">Sem horários restantes nesta data. Escolha outro dia.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor={ids.obs} className={rotulo}>
                        Observações{opcional}
                      </label>
                      <textarea
                        id={ids.obs}
                        name="observacoes"
                        maxLength={CONFIG.agendamento.limiteObservacoes}
                        placeholder="Se quiser, conte o que você precisa."
                        className="campo"
                        value={obs}
                        aria-describedby={`${ids.obs}-aviso ${ids.obs}-cont`}
                        onChange={(e) => setObs(e.target.value)}
                      />
                      <div className="mt-2 flex justify-between gap-4 text-[0.85rem] text-taupe">
                        <p id={`${ids.obs}-aviso`}>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                        <p id={`${ids.obs}-cont`} className="num shrink-0" aria-label={`${obs.length} de ${CONFIG.agendamento.limiteObservacoes} caracteres`}>
                          {obs.length}/{CONFIG.agendamento.limiteObservacoes}
                        </p>
                      </div>
                    </div>

                    <div>
                      <button type="submit" className="botao botao-cheio w-full">
                        <IconeWhatsapp /> Enviar solicitação pelo WhatsApp
                      </button>
                      <div id={`${base}-aviso`} className="mt-4 space-y-2 text-[0.85rem] leading-snug text-taupe">
                        <p>
                          Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                          <a href="/privacidade.html" className="link-sutil text-tinta">
                            Privacidade
                          </a>
                          .
                        </p>
                        <p>{CONFIG.mensagens.avisoWhatsapp}</p>
                        <p>
                          Em caso de urgência ou sinais de alerta, procure um pronto atendimento ou ligue 192 (SAMU).
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
