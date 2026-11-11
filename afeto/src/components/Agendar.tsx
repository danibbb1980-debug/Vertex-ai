import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { blocosDoDia, blocosGerais, horarioDoDia, linkWhatsApp, profissionaisPublicaveis } from '../lib/dados'
import { TituloEnfase } from './Enfase'
import { IconeWhatsApp } from './Icones'

const PRIMEIRA = 'Primeira avaliação'
const NAO_SEI = 'Ainda não sei, quero conversar'

const hojeISO = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}
/** Dia da semana de "aaaa-mm-dd" sem erro de fuso. */
const diaDaSemana = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).getDay()
}
const dataBR = (iso: string) => iso.split('-').reverse().join('/')

/** Primeiro dia aberto a partir de hoje (para o mínimo do seletor). */
function proximoDiaAberto(iso: string) {
  const [a, m, d] = iso.split('-').map(Number)
  const data = new Date(a, m - 1, d)
  for (let i = 0; i < 14; i++) {
    if (horarioDoDia(data.getDay())) break
    data.setDate(data.getDate() + 1)
  }
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
}

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario' | 'obs', string>>

export function Agendar() {
  const uid = useId()
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [profissional, setProfissional] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'editando' | 'abrindo' | 'enviado'>('editando')
  const [bloqueado, setBloqueado] = useState(false)
  const [urlFinal, setUrlFinal] = useState('')
  const [minData, setMinData] = useState<string | undefined>(undefined)
  const [aviso, setAviso] = useState('')
  const confirmacaoRef = useRef<HTMLDivElement>(null)

  // Datas calculadas só no navegador (evita divergência com o HTML pré-gerado).
  useEffect(() => setMinData(proximoDiaAberto(hojeISO())), [])
  useEffect(() => {
    if (estado === 'enviado') confirmacaoRef.current?.focus()
  }, [estado])

  if (!CONFIG.whatsapp) return null

  const limite = CONFIG.agendamento.limiteObservacoes
  const opcoesAtendimento = [...CONFIG.atendimentos.filter(Boolean), PRIMEIRA, NAO_SEI]
  const profissionais = profissionaisPublicaveis()
  const blocos = data && !erros.data ? blocosDoDia(diaDaSemana(data)) : blocosGerais()

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (minData && v < hojeISO()) return 'Escolha uma data a partir de hoje.'
    if (!horarioDoDia(diaDaSemana(v))) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  function aoMudarData(v: string) {
    setData(v)
    const e = validarData(v)
    setErros((x) => ({ ...x, data: e }))
    if (!e && v && horario && !blocosDoDia(diaDaSemana(v)).includes(horario)) setHorario('')
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome completo.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (obs.length > limite) e.obs = `Use até ${limite} caracteres.`
    return e
  }

  function montarMensagem() {
    const linhas = [
      CONFIG.mensagens.formulario,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
    ]
    if (profissionais.length) linhas.push(`Profissional: ${profissional || 'sem preferência'}`)
    linhas.push(
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    )
    return linhas.join('\n')
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const campos = Object.keys(e) as (keyof Erros)[]
    if (campos.length) {
      setAviso(`Revise ${campos.length === 1 ? 'o campo destacado' : `os ${campos.length} campos destacados`}.`)
      document.getElementById(`${uid}-${campos[0]}`)?.focus()
      return
    }
    setAviso('')
    setEstado('abrindo')
    const url = linkWhatsApp(montarMensagem())
    setUrlFinal(url)
    // Abre sem passar referência da página (equivalente a noopener) e detecta bloqueio de pop-up.
    const janela = window.open(url, '_blank')
    if (janela) {
      janela.opener = null
      setBloqueado(false)
    } else {
      setBloqueado(true)
    }
    setEstado('enviado')
  }

  const descr = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `${uid}-${campo}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  const Erro = ({ campo }: { campo: keyof Erros }) =>
    erros[campo] ? (
      <p id={`${uid}-${campo}-erro`} className="mt-2 flex items-center gap-2 text-[0.9rem] font-medium text-[#a3261b]">
        <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.5v4.2M8 10.8v.7" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        {erros[campo]}
      </p>
    ) : null

  const rotulo = 'mb-2 block text-[0.95rem] font-semibold text-tinta'
  const opcional = <span className="font-normal text-tinta-suave"> (opcional)</span>

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative overflow-hidden py-20 lg:py-32">
      <div
        aria-hidden="true"
        className="absolute -left-40 top-24 -z-10 aspect-square w-[36rem] rounded-full rounded-br-none bg-ambar-claro"
      />
      <div className="mx-auto grid max-w-[84rem] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="lg:col-span-5 lg:pt-6">
          <p className="rotulo mb-5 text-terracota-texto">Praticidade</p>
          <h2 id="titulo-agendar" className="text-[clamp(2.4rem,5.4vw,4.4rem)] text-tinta">
            <TituloEnfase texto="Peça seu horário em poucos *cliques*." />
          </h2>
          <p className="mt-6 max-w-[28rem] text-tinta-suave">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega ao espaço pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
          <p className="mt-4 max-w-[28rem] text-[0.95rem] text-tinta-suave">
            Data e horário são preferências: o agendamento só vale depois da confirmação da equipe.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-[2rem] rounded-tr-[7rem] bg-papel p-6 ring-1 ring-fio sm:p-10 sm:rounded-tr-[10rem]">
            {estado === 'enviado' ? (
              <div ref={confirmacaoRef} tabIndex={-1} role="status" className="outline-none">
                <svg viewBox="0 0 48 48" className="mb-6 size-12" aria-hidden="true">
                  <path d="M0 48A48 48 0 0 1 48 0v48Z" fill="var(--color-salvia)" />
                  <path d="M14 26l7 7 14-15" fill="none" stroke="var(--color-tinta)" strokeWidth="2.4" />
                </svg>
                <p className="font-display text-[2.2rem] leading-tight text-tinta">Pronto!</p>
                <p className="mt-3 text-tinta">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                <p className={`mt-6 text-[0.95rem] ${bloqueado ? 'font-semibold text-tinta' : 'text-tinta-suave'}`}>
                  {bloqueado ? 'O navegador não abriu a nova aba.' : 'O WhatsApp não abriu?'}
                </p>
                <a href={urlFinal} target="_blank" rel="noopener noreferrer" className="botao botao-primario mt-3">
                  <IconeWhatsApp /> Abrir WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setEstado('editando')}
                  className="link-fio mt-6 block min-h-12 text-[0.95rem] text-terracota-texto"
                >
                  Voltar e editar a solicitação
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby={`${uid}-nota`}>
                <p className="mb-6 text-[0.9rem] text-tinta-suave">
                  Campos marcados com <span aria-hidden="true">*</span>
                  <span className="sr-only">asterisco</span> são obrigatórios.
                </p>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor={`${uid}-nome`} className={rotulo}>
                      Nome completo <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id={`${uid}-nome`}
                      name="nome"
                      className="campo"
                      autoComplete="name"
                      placeholder="Como devemos te chamar?"
                      required
                      aria-required="true"
                      aria-invalid={!!erros.nome}
                      aria-describedby={descr('nome')}
                      value={nome}
                      maxLength={120}
                      onChange={(e) => setNome(e.target.value)}
                      onBlur={() => nome && setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? 'Informe seu nome completo.' : undefined }))}
                    />
                    <Erro campo="nome" />
                  </div>

                  <div>
                    <label htmlFor={`${uid}-atendimento`} className={rotulo}>
                      Atendimento desejado{' '}
                      {CONFIG.agendamento.exigirAtendimento ? <span aria-hidden="true">*</span> : opcional}
                    </label>
                    <select
                      id={`${uid}-atendimento`}
                      name="atendimento"
                      className="campo"
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={descr('atendimento')}
                      required={CONFIG.agendamento.exigirAtendimento}
                      value={atendimento}
                      onChange={(e) => setAtendimento(e.target.value)}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoesAtendimento.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Erro campo="atendimento" />
                  </div>

                  {profissionais.length > 0 && (
                    <div>
                      <label htmlFor={`${uid}-prof`} className={rotulo}>
                        Profissional{opcional}
                      </label>
                      <select
                        id={`${uid}-prof`}
                        className="campo"
                        value={profissional}
                        onChange={(e) => setProfissional(e.target.value)}
                      >
                        <option value="">Sem preferência</option>
                        {profissionais.map((p) => (
                          <option key={p.nome} value={`${p.nome} (${p.profissao})`}>
                            {p.nome}, {p.profissao}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label htmlFor={`${uid}-data`} className={rotulo}>
                        Data preferida{opcional}
                      </label>
                      <input
                        id={`${uid}-data`}
                        name="data"
                        type="date"
                        className="campo"
                        min={minData}
                        aria-invalid={!!erros.data}
                        aria-describedby={descr('data', `${uid}-data-ajuda`)}
                        value={data}
                        onChange={(e) => aoMudarData(e.target.value)}
                      />
                      <p id={`${uid}-data-ajuda`} className="mt-2 text-[0.85rem] text-tinta-suave">
                        Atendimento de segunda a sexta.
                      </p>
                      <Erro campo="data" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-horario`} className={rotulo}>
                        Horário preferido{opcional}
                      </label>
                      <select
                        id={`${uid}-horario`}
                        name="horario"
                        className="campo"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                      >
                        <option value="">Escolha um horário</option>
                        {blocos.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-obs`} className={rotulo}>
                      Observações{opcional}
                    </label>
                    <textarea
                      id={`${uid}-obs`}
                      name="observacoes"
                      rows={3}
                      className="campo resize-y"
                      placeholder="Se quiser, conte o que você precisa."
                      maxLength={limite}
                      aria-invalid={!!erros.obs}
                      aria-describedby={descr('obs', `${uid}-obs-ajuda`)}
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, limite))}
                    />
                    <div id={`${uid}-obs-ajuda`} className="mt-2 flex justify-between gap-4 text-[0.85rem] text-tinta-suave">
                      <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                      <span className="shrink-0 tabular-nums" aria-hidden="true">
                        {obs.length}/{limite}
                      </span>
                    </div>
                    <Erro campo="obs" />
                  </div>
                </div>

                <p aria-live="polite" role="status" className="mt-6 text-[0.95rem] font-medium text-[#a3261b] empty:hidden">
                  {aviso}
                </p>

                <button type="submit" className="botao botao-primario mt-6 w-full" disabled={estado === 'abrindo'}>
                  <IconeWhatsApp />
                  {estado === 'abrindo' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                </button>
                <p id={`${uid}-nota`} className="mt-4 text-[0.85rem] leading-relaxed text-tinta-suave">
                  Ao enviar, você abre uma conversa no WhatsApp com o espaço. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="link-fio text-terracota-texto">
                    Privacidade
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
