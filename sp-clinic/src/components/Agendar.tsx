import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, waLink } from '../config'
import { Monograma } from './Logo'
import { IconeWhatsapp } from './Icones'

/*
 * Solicitação de agendamento SEM backend: valida no navegador, monta a mensagem e abre o
 * WhatsApp da clínica. Nenhum dado é enviado a servidor, salvo em cookie ou localStorage.
 */

const LIMITE_OBS = 300
const OPCOES_EXTRAS = ['Avaliação inicial', 'Ainda não sei, quero conversar']

const pad = (n: number) => String(n).padStart(2, '0')
const isoLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const paraData = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const brData = (iso: string) => iso.split('-').reverse().join('/')

function horariosDoDia(iso: string): string[] {
  if (!iso) return []
  const data = paraData(iso)
  const h = CONFIG.horarios.find((x) => x.diaSemana === data.getDay())
  if (!h?.abre || !h.fecha) return []
  const [ha, ma] = h.abre.split(':').map(Number)
  const [hf, mf] = h.fecha.split(':').map(Number)
  const inicio = ha * 60 + ma
  const fim = hf * 60 + mf
  const agora = new Date()
  const ehHoje = isoLocal(agora) === iso
  const lista: string[] = []
  // blocos de 1 hora que terminam até o fechamento (o horário de fechamento fica de fora)
  for (let t = inicio; t + 60 <= fim; t += 60) {
    if (ehHoje && t <= agora.getHours() * 60 + agora.getMinutes()) continue
    lista.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`)
  }
  return lista
}

type Erros = Partial<Record<'nome' | 'data' | 'horario' | 'obs', string>>

export function Agendar() {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [aviso, setAviso] = useState('')
  const [enviado, setEnviado] = useState<{ url: string; bloqueado: boolean } | null>(null)

  const hoje = isoLocal(new Date())
  const opcoesAtendimento = [...CONFIG.tratamentos.map((t) => t.nome), ...OPCOES_EXTRAS]
  const diasFechados = CONFIG.horarios.filter((h) => !h.abre).map((h) => h.dia.toLowerCase())

  const erroData = (iso: string): string => {
    if (!iso) return ''
    if (iso < hoje) return 'Escolha uma data a partir de hoje.'
    if (!horariosDoDia(iso).length) {
      const h = CONFIG.horarios.find((x) => x.diaSemana === paraData(iso).getDay())
      return h && !h.abre ? 'Dia sem atendimento, escolha outra data.' : 'Não há horários neste dia, escolha outra data.'
    }
    return ''
  }

  const horarios = useMemo(() => (data && !erroData(data) ? horariosDoDia(data) : []), [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const mudarData = (v: string) => {
    setData(v)
    setHorario('')
    setErros((e) => ({ ...e, data: erroData(v) || undefined, horario: undefined }))
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const novos: Erros = {}
    if (nome.trim().length < 2) novos.nome = 'Informe seu nome para a clínica saber com quem vai falar.'
    const ed = erroData(data)
    if (ed) novos.data = ed
    if (horario && !horarios.includes(horario)) novos.horario = 'Escolha um horário da lista.'
    if (obs.length > LIMITE_OBS) novos.obs = `Use no máximo ${LIMITE_OBS} caracteres.`
    setErros(novos)
    const chaves = Object.keys(novos) as (keyof Erros)[]
    if (chaves.length) {
      setAviso(
        chaves.length === 1 ? 'Há 1 campo para revisar.' : `Há ${chaves.length} campos para revisar.`,
      )
      const campo = formRef.current?.querySelector<HTMLElement>(`[name="${chaves[0]}"]`)
      campo?.focus()
      return
    }
    setAviso('')
    const mensagem = [
      CONFIG.mensagens.formulario,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? brData(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = waLink(mensagem)
    const janela = window.open(url, '_blank')
    if (janela) janela.opener = null
    setEnviado({ url, bloqueado: !janela })
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `${id}-${campo}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-marfim">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo text-caramelo-queimado">Praticidade</p>
            <h2 id="titulo-agendar" className="mt-5 text-[clamp(2.4rem,6vw,4.2rem)]">
              Peça seu horário em poucos <em className="not-italic text-caramelo-queimado">cliques</em>.
            </h2>
            <p className="mt-6 max-w-[26rem] text-cafe-suave">
              Escolha o atendimento, o dia e o horário de sua preferência. Sua solicitação chega à clínica pelo
              WhatsApp, e a equipe confirma a disponibilidade.
            </p>
            <p className="mt-4 max-w-[26rem] text-[0.95rem] text-cafe-suave">
              Os horários são preferências; a clínica responde com o que estiver disponível.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-t-[999px] rounded-b-[28px] bg-areia px-5 pb-8 pt-16 ring-1 ring-cafe/10 sm:px-10 sm:pb-10 sm:pt-24">
            <div className="flex flex-col items-center text-center">
              <Monograma className="h-14 w-auto text-caramelo-queimado sm:h-16" />
              <p className="rotulo mt-4 text-cafe-suave">Solicitar agendamento</p>
            </div>

            {enviado ? (
              <div className="mt-10 border-t border-fio pt-8" role="status" aria-live="polite">
                <p className="font-display text-[1.9rem] leading-tight">Pronto!</p>
                <p className="mt-3">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                <p className="mt-5 text-[0.95rem] text-cafe-suave">
                  {enviado.bloqueado
                    ? 'O navegador impediu a abertura automática. Use o botão abaixo:'
                    : 'Se o WhatsApp não abriu, use o botão abaixo:'}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={enviado.url} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                    <IconeWhatsapp />
                    Abrir WhatsApp
                  </a>
                  <button type="button" className="botao botao-linha" onClick={() => setEnviado(null)}>
                    Editar solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={enviar} className="mt-10 grid gap-6">
                <p className="sr-only" aria-live="assertive">
                  {aviso}
                </p>

                <div>
                  <label htmlFor={`${id}-nome`} className="mb-2 block font-medium">
                    Nome completo <span className="font-normal text-cafe-suave">(obrigatório)</span>
                  </label>
                  <input
                    id={`${id}-nome`}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    className="campo"
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                    }}
                    aria-invalid={!!erros.nome}
                    aria-describedby={desc('nome')}
                  />
                  {erros.nome && <Erro id={`${id}-nome-erro`} texto={erros.nome} />}
                </div>

                <div>
                  <label htmlFor={`${id}-atend`} className="mb-2 block font-medium">
                    Atendimento desejado
                  </label>
                  <select
                    id={`${id}-atend`}
                    name="atendimento"
                    className="campo"
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
                </div>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label htmlFor={`${id}-data`} className="mb-2 block font-medium">
                      Data preferida
                    </label>
                    <input
                      id={`${id}-data`}
                      name="data"
                      type="date"
                      min={hoje}
                      className="campo num"
                      value={data}
                      onChange={(e) => mudarData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={desc('data', `${id}-data-dica`)}
                    />
                    <p id={`${id}-data-dica`} className="mt-2 text-[0.85rem] text-cafe-suave">
                      {diasFechados.length ? `Sem atendimento: ${diasFechados.join(' e ')}.` : ''}
                    </p>
                    {erros.data && <Erro id={`${id}-data-erro`} texto={erros.data} />}
                  </div>
                  <div>
                    <label htmlFor={`${id}-hora`} className="mb-2 block font-medium">
                      Horário preferido
                    </label>
                    <select
                      id={`${id}-hora`}
                      name="horario"
                      className="campo num"
                      value={horario}
                      disabled={!horarios.length}
                      onChange={(e) => {
                        setHorario(e.target.value)
                        if (erros.horario) setErros((x) => ({ ...x, horario: undefined }))
                      }}
                      aria-invalid={!!erros.horario}
                      aria-describedby={desc('horario', `${id}-hora-dica`)}
                    >
                      <option value="">Escolha um horário</option>
                      {horarios.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <p id={`${id}-hora-dica`} className="mt-2 text-[0.85rem] text-cafe-suave">
                      {horarios.length ? 'Sujeito à disponibilidade.' : 'Escolha a data primeiro.'}
                    </p>
                    {erros.horario && <Erro id={`${id}-horario-erro`} texto={erros.horario} />}
                  </div>
                </div>

                <div>
                  <label htmlFor={`${id}-obs`} className="mb-2 block font-medium">
                    Observações <span className="font-normal text-cafe-suave">(opcional)</span>
                  </label>
                  <textarea
                    id={`${id}-obs`}
                    name="obs"
                    rows={3}
                    maxLength={LIMITE_OBS}
                    className="campo resize-y"
                    placeholder="Se quiser, conte o que você procura."
                    value={obs}
                    onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                    aria-invalid={!!erros.obs}
                    aria-describedby={desc('obs', `${id}-obs-dica`)}
                  />
                  <div id={`${id}-obs-dica`} className="mt-2 flex justify-between gap-4 text-[0.85rem] text-cafe-suave">
                    <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                    <span className="num shrink-0" aria-hidden="true">
                      {obs.length}/{LIMITE_OBS}
                    </span>
                  </div>
                  {erros.obs && <Erro id={`${id}-obs-erro`} texto={erros.obs} />}
                </div>

                <div className="border-t border-fio pt-6">
                  <button type="submit" className="botao botao-cheio w-full">
                    <IconeWhatsapp />
                    Enviar solicitação pelo WhatsApp
                  </button>
                  <p className="mt-4 text-[0.88rem] leading-relaxed text-cafe-suave">
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados
                    digitados.{' '}
                    <a href="/privacidade.html" className="link-sublinhado text-cafe hover:text-caramelo-queimado">
                      Privacidade
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Erro({ id, texto }: { id: string; texto: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-[0.9rem] font-medium text-[#8f2a1d]">
      <span aria-hidden="true" className="mt-[0.55em] block size-1.5 shrink-0 rounded-full bg-current" />
      {texto}
    </p>
  )
}
