import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { horariosDoDia, dataLocalISO, diaDaData, formatarData, montarMensagem } from '../lib/agenda'

type Erros = Partial<Record<'nome' | 'data' | 'horario', string>>
type Estado = 'editando' | 'abrindo' | 'aberto' | 'bloqueado'

const OPCAO_AVALIACAO = 'Avaliação inicial'
const OPCAO_CONVERSAR = 'Ainda não sei, quero conversar'

export function Agendar() {
  const uid = useId()
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<Estado>('editando')
  const [url, setUrl] = useState('')
  const statusRef = useRef<HTMLDivElement>(null)

  const [hoje, setHoje] = useState('')
  useEffect(() => setHoje(dataLocalISO(new Date())), [])
  const dia = data ? diaDaData(data) : undefined
  const fechado = !!data && (!dia || !dia.abre)
  const opcoesHorario = useMemo(() => (dia && dia.abre ? horariosDoDia(dia) : []), [dia])

  const id = (s: string) => `${uid}-${s}`

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (v < (hoje || dataLocalISO(new Date()))) return 'Escolha uma data a partir de hoje.'
    const d = diaDaData(v)
    if (!d || !d.abre) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  function aoMudarData(v: string) {
    setData(v)
    setHorario('')
    setErros((e) => ({ ...e, data: validarData(v), horario: undefined }))
  }

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a equipe saber como te chamar.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (horario && !opcoesHorario.includes(horario)) e.horario = 'Escolha um horário da lista.'
    return e
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    const primeiro = (['nome', 'data', 'horario'] as const).find((k) => e[k])
    if (primeiro) {
      document.getElementById(id(primeiro))?.focus()
      return
    }
    const mensagem = montarMensagem({
      nome: nome.trim(),
      atendimento,
      data: data ? formatarData(data) : '',
      horario,
      obs: obs.trim(),
    })
    const destino = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
    setUrl(destino)
    setEstado('abrindo')
    // abre de forma síncrona (dentro do clique) para não cair no bloqueador;
    // o opener é anulado, equivalente a noopener, e ainda dá para saber se abriu.
    const janela = window.open('', '_blank')
    if (janela) {
      try {
        janela.opener = null
      } catch {
        /* ignore */
      }
      janela.location.href = destino
    }
    window.setTimeout(() => {
      setEstado(janela ? 'aberto' : 'bloqueado')
      requestAnimationFrame(() => statusRef.current?.focus())
    }, 350)
  }

  function recomecar() {
    setEstado('editando')
    setTimeout(() => document.getElementById(id('nome'))?.focus(), 0)
  }

  const descr = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? id(`${campo}-erro`) : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="border-t border-filete bg-perola py-24 md:py-36">
      <div className="moldura grid grid-cols-12 gap-y-12 lg:gap-x-16">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <p className="rotulo mb-6 text-agua-escura">Praticidade</p>
            <h2 id="t-agendar" className="text-[clamp(2.4rem,5vw,4rem)] text-petroleo">
              Peça sua avaliação em poucos <em className="font-light">cliques</em>.
            </h2>
            <p className="mt-6 max-w-[40ch] text-grafite-2">
              Escolha o procedimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a equipe
              confirma a disponibilidade.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="relative border border-filete bg-perola p-6 sm:p-10">
            {/* filetes em verde-água nos cantos, como fitas */}
            <span aria-hidden="true" className="absolute -left-px -top-px h-px w-16 bg-agua" />
            <span aria-hidden="true" className="absolute -left-px -top-px h-16 w-px bg-agua" />
            <span aria-hidden="true" className="absolute -bottom-px -right-px h-px w-16 bg-agua-escura" />
            <span aria-hidden="true" className="absolute -bottom-px -right-px h-16 w-px bg-agua-escura" />

            {estado === 'aberto' || estado === 'bloqueado' ? (
              <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
                <p className="rotulo mb-5 text-agua-escura">{estado === 'aberto' ? 'Solicitação pronta' : 'Quase lá'}</p>
                {estado === 'aberto' ? (
                  <p className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light leading-[1.15] text-petroleo">
                    Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a
                    disponibilidade.
                  </p>
                ) : (
                  <p className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] font-light leading-[1.15] text-petroleo">
                    O navegador bloqueou a nova aba. Use o link abaixo para abrir o WhatsApp com a sua solicitação.
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                    Abrir WhatsApp
                    <span className="seta" aria-hidden="true" />
                  </a>
                  <button type="button" onClick={recomecar} className="botao botao-linha">
                    Editar solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby={id('aviso-form')}>
                <p id={id('aviso-form')} className="mb-8 text-[0.9rem] text-grafite-2">
                  Campos marcados com <span aria-hidden="true">*</span>
                  <span className="sr-only">asterisco</span> são obrigatórios.
                </p>

                <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={id('nome')} className="rotulo block text-grafite">
                      Nome completo <span aria-hidden="true" className="text-agua-escura">*</span>
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
                      aria-describedby={descr('nome')}
                      className="campo"
                    />
                    <Erro id={id('nome-erro')} msg={erros.nome} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={id('atendimento')} className="rotulo block text-grafite">
                      Atendimento desejado
                    </label>
                    <select
                      id={id('atendimento')}
                      name="atendimento"
                      value={atendimento}
                      onChange={(e) => setAtendimento(e.target.value)}
                      className="campo cursor-pointer"
                    >
                      <option value="">Escolha o atendimento</option>
                      <option value={OPCAO_AVALIACAO}>{OPCAO_AVALIACAO}</option>
                      {CONFIG.procedimentos.map((p) => (
                        <option key={p.id} value={p.nome}>
                          {p.nome}
                        </option>
                      ))}
                      <option value={OPCAO_CONVERSAR}>{OPCAO_CONVERSAR}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={id('data')} className="rotulo block text-grafite">
                      Data preferida
                    </label>
                    <input
                      id={id('data')}
                      name="data"
                      type="date"
                      min={hoje || undefined}
                      value={data}
                      onChange={(e) => aoMudarData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={descr('data', id('data-dica'))}
                      className="campo num cursor-pointer"
                    />
                    <p id={id('data-dica')} className="mt-2 text-[0.85rem] text-grafite-2">
                      Segunda a sexta-feira.
                    </p>
                    <Erro id={id('data-erro')} msg={erros.data} />
                  </div>

                  <div>
                    <label htmlFor={id('horario')} className="rotulo block text-grafite">
                      Horário preferido
                    </label>
                    <select
                      id={id('horario')}
                      name="horario"
                      value={horario}
                      onChange={(e) => {
                        setHorario(e.target.value)
                        setErros((x) => ({ ...x, horario: undefined }))
                      }}
                      aria-invalid={!!erros.horario}
                      aria-describedby={descr('horario', id('horario-dica'))}
                      className="campo num cursor-pointer"
                    >
                      <option value="">Escolha um horário</option>
                      {opcoesHorario.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <p id={id('horario-dica')} className="mt-2 text-[0.85rem] text-grafite-2" aria-live="polite">
                      {!data
                        ? 'Escolha a data para ver os horários do dia.'
                        : fechado
                          ? 'Sem horários neste dia.'
                          : `${opcoesHorario.length} opções para ${dia?.nome.toLowerCase()}. É uma preferência, sujeita à confirmação.`}
                    </p>
                    <Erro id={id('horario-erro')} msg={erros.horario} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={id('obs')} className="rotulo block text-grafite">
                      Observações <span className="font-sans normal-case tracking-normal text-grafite-2">(opcional)</span>
                    </label>
                    <textarea
                      id={id('obs')}
                      name="observacoes"
                      rows={3}
                      maxLength={300}
                      placeholder="Se quiser, conte o que você procura."
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, 300))}
                      aria-describedby={`${id('obs-aviso')} ${id('obs-cont')}`}
                      className="campo min-h-[6rem] resize-y"
                    />
                    <div className="mt-2 flex justify-between gap-6 text-[0.85rem] text-grafite-2">
                      <p id={id('obs-aviso')}>
                        Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.
                      </p>
                      <p id={id('obs-cont')} className="num shrink-0" aria-live="polite">
                        <span className="sr-only">Caracteres usados: </span>
                        {obs.length}/300
                      </p>
                    </div>
                  </div>
                </div>

                <div aria-live="assertive" className="sr-only">
                  {Object.values(erros).filter(Boolean).length > 0
                    ? `Há ${Object.values(erros).filter(Boolean).length} campo(s) para corrigir.`
                    : ''}
                </div>

                <button
                  type="submit"
                  className="botao botao-cheio mt-10 w-full sm:w-auto"
                  aria-busy={estado === 'abrindo'}
                  disabled={estado === 'abrindo'}
                >
                  {estado === 'abrindo' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                  <span className="seta" aria-hidden="true" />
                </button>
                <p className="mt-5 text-[0.85rem] text-grafite-2">
                  Ao enviar, você abre uma conversa no WhatsApp. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="underline underline-offset-4 hover:text-petroleo">
                    Saiba como funciona
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

function Erro({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-[0.9rem] font-medium text-erro">
      <span aria-hidden="true" className="mt-[0.55em] inline-block h-px w-3 shrink-0 bg-erro" />
      {msg}
    </p>
  )
}
