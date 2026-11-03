import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { linkWhatsapp } from '../lib/whatsapp'
import { blocosDoDia, diaDaSemana, hojeIso, horarioDoDia, isoParaBr, paraMinutos, textoHorario } from '../lib/horarios'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { Revelar } from '../components/Revelar'
import { IconeCheck, IconeWhatsapp } from '../components/Icones'

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario', string>>
type Estado = 'editando' | 'enviando' | 'aberto' | 'bloqueado'

const OPCOES = [...CONFIG.atendimentos.filter((a) => a.nome).map((a) => a.nome), 'Avaliação e acompanhamento', 'Ainda não sei, quero conversar']

function erroDaData(iso: string, hoje: string): string | undefined {
  if (!iso) return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return 'Data inválida. Use o formato dia/mês/ano.'
  if (iso < hoje) return 'Escolha uma data a partir de hoje.'
  if (!horarioDoDia(diaDaSemana(iso))) return 'Dia sem atendimento, escolha outra data.'
  return undefined
}

function horariosDisponiveis(iso: string, hoje: string): string[] {
  if (!iso || erroDaData(iso, hoje)) return []
  const blocos = blocosDoDia(diaDaSemana(iso))
  if (iso !== hoje) return blocos
  const agora = new Date()
  const min = agora.getHours() * 60 + agora.getMinutes()
  return blocos.filter((b) => paraMinutos(b) > min)
}

export function montarMensagem(d: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  return [
    'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
    `Nome: ${d.nome.trim()}`,
    `Atendimento: ${d.atendimento || 'a definir'}`,
    `Data preferida: ${d.data ? isoParaBr(d.data) : 'a combinar'}`,
    `Horário preferido: ${d.horario || 'a combinar'}`,
    `Observações: ${d.obs.trim() || '-'}`,
  ].join('\n')
}

export function Agendar() {
  const id = useId()
  const [hoje, setHoje] = useState('')
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<Estado>('editando')
  const [url, setUrl] = useState('')
  const limite = CONFIG.agendamento.limiteObservacoes
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (estado === 'aberto' || estado === 'bloqueado') statusRef.current?.focus()
  }, [estado])

  useEffect(() => setHoje(hojeIso()), [])

  const horarios = useMemo(() => horariosDisponiveis(data, hoje || hojeIso()), [data, hoje])
  const diasAtendimento = CONFIG.horarios.map((h) => `${h.rotulo.toLowerCase()}, ${textoHorario(h)}`).join('; ')

  function aoMudarData(v: string) {
    setData(v)
    setHorario('')
    const ref = hoje || hojeIso()
    let erro = erroDaData(v, ref)
    if (!erro && v && horariosDisponiveis(v, ref).length === 0) erro = 'Não há mais horários neste dia, escolha outra data.'
    setErros((e) => ({ ...e, data: erro }))
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a clínica saber com quem vai falar.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha uma opção de atendimento.'
    const ref = hoje || hojeIso()
    const ed = erroDaData(data, ref)
    if (ed) e.data = ed
    else if (data && horariosDisponiveis(data, ref).length === 0) e.data = 'Não há mais horários neste dia, escolha outra data.'
    if (horario && !horarios.includes(horario)) e.horario = 'Escolha um horário da lista.'
    return e
  }

  function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'atendimento', 'data', 'horario'] as const).find((k) => e[k])
    if (primeiro) {
      document.getElementById(`${id}-${primeiro}`)?.focus()
      return
    }
    setEstado('enviando')
    const link = linkWhatsapp(montarMensagem({ nome, atendimento, data, horario, obs }))
    setUrl(link)
    // Abre direto no clique (evita bloqueio de pop-up); sem acesso de volta à página (opener = null).
    const janela = window.open(link, '_blank')
    if (janela) {
      janela.opener = null
      setEstado('aberto')
    } else {
      setEstado('bloqueado')
    }
  }

  const ajuda = (campo: string) => `${id}-${campo}-ajuda`
  const erroId = (campo: string) => `${id}-${campo}-erro`
  const descr = (campo: keyof Erros, temAjuda = false) =>
    [temAjuda && ajuda(campo), erros[campo] && erroId(campo)].filter(Boolean).join(' ') || undefined
  const Erro = ({ campo }: { campo: keyof Erros }) =>
    erros[campo] ? (
      <p id={erroId(campo)} className="mt-2 flex items-start gap-2 text-sm font-medium text-[#a3392b]">
        <span aria-hidden="true">!</span>
        {erros[campo]}
      </p>
    ) : null
  const rotulo = 'mb-2 block font-display text-[0.95rem] font-medium text-tinta'
  const qtdErros = Object.values(erros).filter(Boolean).length

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="sobre-claro relative overflow-hidden bg-perola py-24 lg:py-36">
      <div aria-hidden="true" className="absolute -right-56 -top-56 size-[40rem] rounded-full border border-menta-texto/10" />
      <div className="container-site relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <CabecalhoSecao id="titulo-agendar" rotulo="Praticidade" titulo="Peça seu horário em poucos *cliques.*">
            <p>
              Escolha o atendimento, o dia e o horário que você prefere. Sua solicitação chega à clínica pelo WhatsApp, e a equipe
              confirma a disponibilidade.
            </p>
            <p className="mt-4 text-base">
              O dia e o horário escolhidos são uma indicação sua, sujeita à confirmação da clínica. Atendimento: {diasAtendimento}.
            </p>
          </CabecalhoSecao>
        </div>

        <Revelar atraso={0.1}>
          <div className="rounded-[2rem] border border-linha bg-white p-6 shadow-[0_30px_80px_-40px_rgba(35,36,39,0.35)] sm:p-10">
            {CONFIG.urgencia && (
              <div className="mb-8 rounded-2xl bg-grafite-900 p-5 text-white">
                <p className="font-display text-lg">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
                <a
                  href={linkWhatsapp('Olá! Estou com dor ou urgência e gostaria de atendimento.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-full bg-menta px-5 font-display font-medium text-grafite-950"
                >
                  <IconeWhatsapp tamanho={18} /> Falar agora
                </a>
              </div>
            )}

            {estado === 'aberto' || estado === 'bloqueado' ? (
              <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="py-4 outline-none">
                <span className="grid size-14 place-items-center rounded-full bg-menta-suave text-menta-texto">
                  <IconeCheck tamanho={28} />
                </span>
                {estado === 'aberto' ? (
                  <p className="mt-6 font-display text-2xl leading-snug text-tinta">
                    Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                  </p>
                ) : (
                  <p className="mt-6 font-display text-2xl leading-snug text-tinta">
                    Sua mensagem está pronta. O navegador não abriu uma nova aba, então toque em “Abrir WhatsApp” para enviar.
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-grafite-900 px-6 font-display font-medium text-white transition-colors hover:bg-grafite-700"
                  >
                    <IconeWhatsapp tamanho={18} /> Abrir WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setEstado('editando')}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-linha px-6 font-display font-medium text-tinta transition-colors hover:border-menta-texto"
                  >
                    Editar solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby={`${id}-aviso`} aria-busy={estado === 'enviando'}>
                <p className="sr-only" aria-live="assertive">
                  {qtdErros > 0 ? `${qtdErros === 1 ? 'Há 1 campo' : `Há ${qtdErros} campos`} para corrigir.` : ''}
                </p>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor={`${id}-nome`} className={rotulo}>
                      Nome completo <span className="text-menta-texto">*</span>
                      <span className="sr-only"> (obrigatório)</span>
                    </label>
                    <input
                      id={`${id}-nome`}
                      name="nome"
                      className="campo"
                      autoComplete="name"
                      placeholder="Como devemos te chamar?"
                      required
                      maxLength={120}
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value)
                        if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                      }}
                      aria-invalid={!!erros.nome}
                      aria-describedby={descr('nome')}
                    />
                    <Erro campo="nome" />
                  </div>

                  <div>
                    <label htmlFor={`${id}-atendimento`} className={rotulo}>
                      Atendimento desejado{' '}
                      {CONFIG.agendamento.exigirAtendimento ? (
                        <span className="text-menta-texto">*</span>
                      ) : (
                        <span className="font-sans text-sm font-normal text-tinta-suave">(opcional)</span>
                      )}
                    </label>
                    <select
                      id={`${id}-atendimento`}
                      name="atendimento"
                      className="campo"
                      value={atendimento}
                      onChange={(e) => {
                        setAtendimento(e.target.value)
                        if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                      }}
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={descr('atendimento')}
                    >
                      <option value="">Escolha uma opção</option>
                      {OPCOES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Erro campo="atendimento" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${id}-data`} className={rotulo}>
                        Data preferida <span className="font-sans text-sm font-normal text-tinta-suave">(opcional)</span>
                      </label>
                      <input
                        id={`${id}-data`}
                        name="data"
                        type="date"
                        className="campo"
                        min={hoje || undefined}
                        value={data}
                        onChange={(e) => aoMudarData(e.target.value)}
                        aria-invalid={!!erros.data}
                        aria-describedby={descr('data', true)}
                      />
                      <p id={ajuda('data')} className="mt-2 text-sm text-tinta-suave">
                        Atendimento: {CONFIG.horarios.map((h, i) => (i ? h.rotulo.toLowerCase() : h.rotulo)).join(' e ')}.
                      </p>
                      <Erro campo="data" />
                    </div>
                    <div>
                      <label htmlFor={`${id}-horario`} className={rotulo}>
                        Horário preferido <span className="font-sans text-sm font-normal text-tinta-suave">(opcional)</span>
                      </label>
                      <select
                        id={`${id}-horario`}
                        name="horario"
                        className="campo"
                        value={horario}
                        disabled={horarios.length === 0}
                        onChange={(e) => setHorario(e.target.value)}
                        aria-invalid={!!erros.horario}
                        aria-describedby={descr('horario', true)}
                      >
                        <option value="">Escolha um horário</option>
                        {horarios.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <p id={ajuda('horario')} className="mt-2 text-sm text-tinta-suave">
                        {horarios.length === 0 ? 'Escolha a data para ver os horários.' : 'Blocos de 1 hora, conforme o dia.'}
                      </p>
                      <Erro campo="horario" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${id}-obs`} className={rotulo}>
                      Observações <span className="font-sans text-sm font-normal text-tinta-suave">(opcional)</span>
                    </label>
                    <textarea
                      id={`${id}-obs`}
                      name="observacoes"
                      className="campo min-h-28 resize-y"
                      rows={3}
                      maxLength={limite}
                      placeholder="Se quiser, conte o que você precisa."
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, limite))}
                      aria-describedby={`${ajuda('obs')} ${id}-contador`}
                    />
                    <div className="mt-2 flex items-start justify-between gap-4 text-xs text-tinta-suave">
                      <p id={ajuda('obs')}>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                      <p id={`${id}-contador`} className="shrink-0 tabular-nums" aria-label={`${obs.length} de ${limite} caracteres`}>
                        {obs.length}/{limite}
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={estado === 'enviando'}
                    className="group inline-flex min-h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-grafite-900 px-4 font-display text-[0.95rem] sm:gap-2.5 sm:px-6 sm:text-[1.02rem] font-medium text-white transition-colors hover:bg-grafite-700 disabled:opacity-70"
                  >
                    {estado === 'enviando' ? (
                      <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden="true" />
                    ) : (
                      <IconeWhatsapp tamanho={20} className="text-menta transition-transform duration-300 group-hover:-rotate-6" />
                    )}
                    {estado === 'enviando' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                  </button>
                  <p id={`${id}-aviso`} className="text-center text-xs leading-relaxed text-tinta-suave">
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                    <a href="/privacidade.html" className="font-medium text-menta-texto underline underline-offset-2">
                      Privacidade
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  )
}
