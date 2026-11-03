import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, waLink } from '../config'
import { dataBr, hojeIso, horarioDoDia, horariosDisponiveis } from '../lib/agenda'
import { Revelar, TituloSecao } from './ui'
import { IconeCheck, IconeWhatsApp } from './Icones'

const OPCOES_EXTRAS = ['Primeira avaliação', 'Ainda não sei, quero conversar']

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario', string>>

const campo =
  'block w-full min-h-12 rounded-xl border bg-white px-4 py-3 text-[1rem] text-grafite transition-[border-color,box-shadow] duration-200 placeholder:text-pedra/80 focus:outline-none focus-visible:outline-none focus:border-vinho focus:ring-4 focus:ring-vinho/15 disabled:cursor-not-allowed disabled:bg-areia/60'
const borda = (erro?: string) => (erro ? 'border-erro' : 'border-linha')

export function Agendar() {
  const id = useId()
  const opcoes = useMemo(() => [...CONFIG.atendimentos.map((a) => a.nome), ...OPCOES_EXTRAS], [])
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const [urlEnviada, setUrlEnviada] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const resumoRef = useRef<HTMLDivElement>(null)
  const sucessoRef = useRef<HTMLDivElement>(null)

  const hoje = hojeIso()
  const horarios = useMemo(() => (data ? horariosDisponiveis(data) : []), [data])
  const limite = CONFIG.agendamento.limiteObservacoes

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined
    if (v < hoje) return 'Escolha uma data a partir de hoje.'
    if (!horarioDoDia(v)) return 'Dia sem atendimento, escolha outra data.'
    if (horariosDisponiveis(v).length === 0) return 'Não há mais horários nesta data, escolha outra.'
    return undefined
  }

  const aoMudarData = (v: string) => {
    setData(v)
    setHorario('')
    setErros((e) => ({ ...e, data: validarData(v), horario: undefined }))
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const novos: Erros = {}
    if (nome.trim().length < 2) novos.nome = 'Informe seu nome completo.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) novos.atendimento = 'Escolha o atendimento desejado.'
    const ed = validarData(data)
    if (ed) novos.data = ed
    setErros(novos)
    if (Object.keys(novos).length) {
      requestAnimationFrame(() => {
        const primeiro = document.querySelector<HTMLElement>(`#agendar [aria-invalid="true"]`)
        primeiro?.focus()
      })
      return
    }

    setEnviando(true)
    const mensagem = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? dataBr(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = waLink(mensagem)
    const janela = window.open(url, '_blank')
    if (janela) {
      try {
        janela.opener = null
      } catch {
        /* ignora */
      }
    }
    setBloqueado(!janela)
    setUrlEnviada(url)
    setEnviando(false)
    requestAnimationFrame(() => sucessoRef.current?.focus())
  }

  const novaSolicitacao = () => {
    setUrlEnviada('')
    setBloqueado(false)
  }

  const listaErros = Object.values(erros).filter(Boolean)

  return (
    <section id="agendar" data-secao="Agendar" aria-labelledby="t-agendar" className="relative bg-areia/60 py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <TituloSecao
              id="t-agendar"
              rotulo="Praticidade"
              descricao="Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade."
            >
              Peça seu horário em poucos <em className="enfase">cliques</em>.
            </TituloSecao>
            <Revelar className="mt-8 space-y-3 text-[0.95rem] text-pedra">
              {[
                'Sem cadastro e sem senha.',
                'Data e horário são preferências; a clínica confirma o que estiver disponível.',
                'Este site não guarda os dados digitados.',
              ].map((t) => (
                <p key={t} className="flex gap-2.5">
                  <IconeCheck tamanho={18} className="mt-1 shrink-0 text-vinho" />
                  {t}
                </p>
              ))}
            </Revelar>
          </div>
        </div>

        <Revelar className="lg:col-span-7">
          {CONFIG.agendamento.urgencia && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-vinho/30 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium text-vinho-900">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-vinho px-5 text-creme">
                <IconeWhatsApp tamanho={18} /> Falar agora
              </a>
            </div>
          )}

          <div className="relative overflow-hidden rounded-[28px] border border-linha bg-marfim p-6 shadow-[0_30px_60px_-40px_rgba(74,29,34,.45)] sm:p-9">
            <span aria-hidden className="absolute left-0 top-9 h-16 w-[4px] bg-ouro" />

            {urlEnviada ? (
              <div ref={sucessoRef} tabIndex={-1} role="status" className="py-6 outline-none">
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-vinho text-creme">
                  <IconeCheck tamanho={26} />
                </span>
                <h3 className="mt-6 text-3xl text-vinho-900">Solicitação pronta</h3>
                <p className="mt-3 max-w-md text-lg text-pedra">
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                <p className={`mt-4 text-[0.95rem] ${bloqueado ? 'font-medium text-vinho-900' : 'text-pedra'}`}>
                  {bloqueado
                    ? 'Parece que o navegador bloqueou a nova aba. Use o botão abaixo para abrir a conversa.'
                    : 'Se a conversa não abriu, use o botão abaixo.'}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={urlEnviada}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-vinho px-6 font-medium text-creme hover:bg-vinho-900"
                  >
                    <IconeWhatsApp tamanho={18} /> Abrir WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={novaSolicitacao}
                    className="min-h-12 rounded-full border border-vinho/30 px-6 font-medium text-vinho-900 hover:border-vinho"
                  >
                    Editar solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby={`${id}-apoio`}>
                <div ref={resumoRef} aria-live="assertive" className="sr-only">
                  {listaErros.length > 0 && `Corrija ${listaErros.length === 1 ? 'o campo' : 'os campos'}: ${listaErros.join(' ')}`}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={`${id}-nome`} className="block font-medium text-vinho-900">
                      Nome completo <span className="text-erro" aria-hidden>*</span>
                      <span className="sr-only">(obrigatório)</span>
                    </label>
                    <input
                      id={`${id}-nome`}
                      name="nome"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={80}
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value)
                        if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                      }}
                      placeholder="Como devemos te chamar?"
                      aria-invalid={!!erros.nome}
                      aria-describedby={erros.nome ? `${id}-nome-erro` : undefined}
                      className={`mt-2 ${campo} ${borda(erros.nome)}`}
                    />
                    {erros.nome && (
                      <p id={`${id}-nome-erro`} className="mt-2 text-sm font-medium text-erro">
                        {erros.nome}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${id}-atend`} className="block font-medium text-vinho-900">
                      Atendimento desejado{' '}
                      {CONFIG.agendamento.exigirAtendimento ? (
                        <span className="text-erro" aria-hidden>*</span>
                      ) : (
                        <span className="font-normal text-pedra">(opcional)</span>
                      )}
                    </label>
                    <select
                      id={`${id}-atend`}
                      name="atendimento"
                      value={atendimento}
                      onChange={(e) => {
                        setAtendimento(e.target.value)
                        if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                      }}
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={erros.atendimento ? `${id}-atend-erro` : undefined}
                      className={`mt-2 ${campo} ${borda(erros.atendimento)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236a2c31' stroke-width='1.5'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11`}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {erros.atendimento && (
                      <p id={`${id}-atend-erro`} className="mt-2 text-sm font-medium text-erro">
                        {erros.atendimento}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${id}-data`} className="block font-medium text-vinho-900">
                      Data preferida <span className="font-normal text-pedra">(opcional)</span>
                    </label>
                    <input
                      id={`${id}-data`}
                      name="data"
                      type="date"
                      min={hoje}
                      value={data}
                      onChange={(e) => aoMudarData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={`${id}-data-ajuda${erros.data ? ` ${id}-data-erro` : ''}`}
                      className={`mt-2 ${campo} ${borda(erros.data)}`}
                    />
                    <p id={`${id}-data-ajuda`} className="mt-2 text-sm text-pedra">
                      Segunda a sábado. Domingo sem atendimento.
                    </p>
                    {erros.data && (
                      <p id={`${id}-data-erro`} className="mt-1 text-sm font-medium text-erro">
                        {erros.data}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={`${id}-hora`} className="block font-medium text-vinho-900">
                      Horário preferido <span className="font-normal text-pedra">(opcional)</span>
                    </label>
                    <select
                      id={`${id}-hora`}
                      name="horario"
                      value={horario}
                      disabled={!data || !!erros.data || horarios.length === 0}
                      onChange={(e) => setHorario(e.target.value)}
                      aria-describedby={`${id}-hora-ajuda`}
                      className={`mt-2 ${campo} border-linha appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%236a2c31' stroke-width='1.5'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11`}
                    >
                      <option value="">Escolha um horário</option>
                      {horarios.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <p id={`${id}-hora-ajuda`} className="mt-2 text-sm text-pedra">
                      {data ? 'Sujeito à confirmação da clínica.' : 'Escolha a data primeiro.'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={`${id}-obs`} className="block font-medium text-vinho-900">
                      Observações <span className="font-normal text-pedra">(opcional)</span>
                    </label>
                    <textarea
                      id={`${id}-obs`}
                      name="observacoes"
                      rows={3}
                      maxLength={limite}
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, limite))}
                      placeholder="Se quiser, conte o que você precisa."
                      aria-describedby={`${id}-obs-ajuda ${id}-obs-cont`}
                      className={`mt-2 resize-y ${campo} border-linha`}
                    />
                    <div className="mt-2 flex justify-between gap-4 text-sm text-pedra">
                      <p id={`${id}-obs-ajuda`}>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                      <p id={`${id}-obs-cont`} className="shrink-0 tabular-nums" aria-live="polite">
                        {obs.length}/{limite}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  aria-busy={enviando}
                  className="group mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-vinho px-3 text-[0.9rem] sm:gap-2.5 sm:px-6 sm:text-[1rem] font-medium text-creme shadow-[0_10px_30px_-12px_rgba(74,29,34,.55)] transition-[background-color,transform] duration-300 hover:bg-vinho-900 active:scale-[.99] disabled:opacity-70"
                >
                  <IconeWhatsApp tamanho={19} />
                  {enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                </button>
                <p id={`${id}-apoio`} className="mt-4 text-center text-sm leading-relaxed text-pedra">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados. Os
                  horários escolhidos são preferências, sujeitas à confirmação da clínica.{' '}
                  <a href="/privacidade.html" className="text-vinho underline underline-offset-2">
                    Saiba mais sobre privacidade
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  )
}
