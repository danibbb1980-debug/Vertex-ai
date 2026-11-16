import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { diaFechado, horariosDoDia } from '../horarios'
import { Enfase } from './ui'

const A_DEFINIR = 'Ainda não sei, quero conversar'
const LIMITE = 300

const doisDig = (n: number) => String(n).padStart(2, '0')
const isoLocal = (d: Date) => `${d.getFullYear()}-${doisDig(d.getMonth() + 1)}-${doisDig(d.getDate())}`
function lerData(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function montarMensagem(v: { nome: string; atendimento: string; data: string; hora: string; obs: string }) {
  const dt = v.data ? lerData(v.data) : null
  const data = dt ? `${doisDig(dt.getDate())}/${doisDig(dt.getMonth() + 1)}/${dt.getFullYear()}` : 'a combinar'
  const atend = !v.atendimento || v.atendimento === A_DEFINIR ? 'a definir' : v.atendimento
  return [
    `Olá! Vim pelo site da ${CONFIG.nome} Estética e gostaria de solicitar um agendamento.`,
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${atend}`,
    `Data preferida: ${data}`,
    `Horário preferido: ${v.hora || 'a combinar'}`,
    `Observações: ${v.obs.trim() || '-'}`,
  ].join('\n')
}

type Erros = Partial<Record<'nome' | 'data' | 'hora', string>>

export function Agendar() {
  const id = useId()
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'form' | 'abrindo' | 'enviado'>('form')
  const [bloqueado, setBloqueado] = useState(false)
  const [url, setUrl] = useState('')
  const [aviso, setAviso] = useState('')
  const refs = { nome: useRef<HTMLInputElement>(null), data: useRef<HTMLInputElement>(null), hora: useRef<HTMLSelectElement>(null) }
  const cartao = useRef<HTMLDivElement>(null)

  const hoje = isoLocal(new Date())
  const dt = data ? lerData(data) : null
  const dow = dt ? dt.getDay() : null

  const horas = useMemo(() => {
    let lista = horariosDoDia(dow)
    if (data === hoje) {
      const agora = new Date().getHours()
      lista = lista.filter((h) => Number(h.slice(0, 2)) > agora)
    }
    return lista
  }, [dow, data, hoje])

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    const d = lerData(v)
    if (!d) return 'Data inválida. Use o formato dia/mês/ano.'
    if (v < hoje) return 'Escolha uma data a partir de hoje.'
    if (diaFechado(d.getDay())) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  function aoMudarData(v: string) {
    setData(v)
    setErros((e) => ({ ...e, data: validarData(v) }))
    const d = v ? lerData(v) : null
    const disp = horariosDoDia(d ? d.getDay() : null)
    if (hora && !disp.includes(hora)) setHora('')
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const novos: Erros = {}
    if (nome.trim().length < 2) novos.nome = 'Informe o seu nome.'
    const ed = validarData(data)
    if (ed) novos.data = ed
    if (hora && !horas.includes(hora)) novos.hora = 'Escolha um horário disponível para o dia escolhido.'
    setErros(novos)
    const primeiro = (['nome', 'data', 'hora'] as const).find((k) => novos[k])
    if (primeiro) {
      setAviso(`Revise o formulário: ${Object.values(novos).filter(Boolean).join(' ')}`)
      refs[primeiro].current?.focus()
      return
    }
    setAviso('')
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(montarMensagem({ nome, atendimento, data, hora, obs }))}`
    setUrl(link)
    const janela = window.open(link, '_blank')
    if (janela) janela.opener = null
    setBloqueado(!janela)
    setEstado('abrindo')
    window.setTimeout(() => {
      setEstado('enviado')
      requestAnimationFrame(() => cartao.current?.querySelector<HTMLElement>('[data-foco]')?.focus())
    }, 650)
  }

  const desc = (campo: string, extra?: string) => [erros[campo as keyof Erros] ? `${id}-${campo}-erro` : '', extra].filter(Boolean).join(' ') || undefined

  return (
    <section data-sem-fixo id="agendar" aria-labelledby="titulo-agendar" className="border-t border-fio bg-areia-2">
      <div className="mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-12 px-5 py-24 sm:px-8 lg:py-36">
        <div className="col-span-12 lg:col-span-5">
          <p className="rotulo text-terracota-escuro">Praticidade</p>
          <h2 id="titulo-agendar" className="mt-6 text-[clamp(2.4rem,5vw,3.9rem)] tracking-[-0.03em]">
            <Enfase texto="Peça seu horário em poucos *cliques*." />
          </h2>
          <p className="mt-6 max-w-[38ch] text-grafite-2">
            Escolha o atendimento, o dia e o horário que quiser. Sua solicitação chega pelo WhatsApp, e a equipe
            confirma a disponibilidade.
          </p>
        </div>

        <div
          ref={cartao}
          className="relative col-span-12 border border-grafite bg-areia lg:col-span-6 lg:col-start-7"
        >
          <span className="absolute left-0 top-0 h-px w-24 bg-terracota" aria-hidden="true" />
          <span className="absolute left-0 top-0 h-24 w-px bg-terracota" aria-hidden="true" />
          <p className="sr-only" aria-live="assertive">
            {aviso}
          </p>
          <p className="sr-only" aria-live="polite">
            {estado === 'enviado' ? 'Pronto! Abrimos o WhatsApp com sua solicitação.' : ''}
          </p>

          {estado === 'enviado' ? (
            <div className="p-6 sm:p-10">
              <p className="rotulo text-terracota-escuro">Solicitação pronta</p>
              <p data-foco tabIndex={-1} className="mt-5 font-display text-[1.9rem] leading-[1.15] tracking-[-0.02em] outline-none">
                Pronto! Abrimos o WhatsApp com sua solicitação.
              </p>
              <p className="mt-4 max-w-[44ch] text-grafite-2">
                É só enviar a mensagem. A equipe confirma a disponibilidade.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={url} target="_blank" rel="noopener noreferrer" className={`btn ${bloqueado ? 'btn-primario' : 'btn-secundario'}`}>
                  <span>Abrir WhatsApp</span>
                  <span className="sr-only"> (nova aba)</span>
                </a>
                <button type="button" className="btn btn-secundario" onClick={() => setEstado('form')}>
                  Editar solicitação
                </button>
              </div>
              <p className="mt-5 text-[0.9rem] text-grafite-2">
                {bloqueado
                  ? 'O navegador bloqueou a nova aba. Use o botão "Abrir WhatsApp" acima.'
                  : 'Se o WhatsApp não abriu, use o botão "Abrir WhatsApp".'}
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} className="grid gap-6 p-6 sm:p-10" aria-describedby={`${id}-nota`}>
              <div>
                <label htmlFor={`${id}-nome`} className="mb-2 block font-semibold">
                  Nome completo <span className="font-normal text-grafite-2">(obrigatório)</span>
                </label>
                <input
                  ref={refs.nome}
                  id={`${id}-nome`}
                  name="nome"
                  className="campo"
                  autoComplete="name"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  required
                  aria-required="true"
                  aria-invalid={!!erros.nome}
                  aria-describedby={desc('nome')}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (erros.nome && e.target.value.trim().length >= 2) setErros((x) => ({ ...x, nome: undefined }))
                  }}
                />
                {erros.nome && (
                  <p id={`${id}-nome-erro`} className="mt-2 text-[0.9rem] font-semibold text-terracota-escuro">
                    {erros.nome}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`${id}-atend`} className="mb-2 block font-semibold">
                  Atendimento desejado
                </label>
                <select id={`${id}-atend`} name="atendimento" className="campo" value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
                  <option value="">Escolha um atendimento</option>
                  {CONFIG.atendimentos.map((a) => (
                    <option key={a.nome} value={a.nome}>
                      {a.nome}
                    </option>
                  ))}
                  <option value={A_DEFINIR}>{A_DEFINIR}</option>
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-data`} className="mb-2 block font-semibold">
                    Data preferida
                  </label>
                  <input
                    ref={refs.data}
                    id={`${id}-data`}
                    name="data"
                    type="date"
                    className="campo"
                    min={hoje}
                    value={data}
                    aria-invalid={!!erros.data}
                    aria-describedby={desc('data', `${id}-data-dica`)}
                    onChange={(e) => aoMudarData(e.target.value)}
                  />
                  <p id={`${id}-data-dica`} className="mt-2 text-[0.85rem] text-grafite-2">
                    Sem atendimento aos domingos.
                  </p>
                  {erros.data && (
                    <p id={`${id}-data-erro`} className="mt-1 text-[0.9rem] font-semibold text-terracota-escuro">
                      {erros.data}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${id}-hora`} className="mb-2 block font-semibold">
                    Horário preferido
                  </label>
                  <select
                    ref={refs.hora}
                    id={`${id}-hora`}
                    name="hora"
                    className="campo num"
                    value={hora}
                    aria-invalid={!!erros.hora}
                    aria-describedby={desc('hora')}
                    disabled={!!erros.data}
                    onChange={(e) => {
                      setHora(e.target.value)
                      setErros((x) => ({ ...x, hora: undefined }))
                    }}
                  >
                    <option value="">Escolha um horário</option>
                    {horas.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  {erros.hora && (
                    <p id={`${id}-hora-erro`} className="mt-2 text-[0.9rem] font-semibold text-terracota-escuro">
                      {erros.hora}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor={`${id}-obs`} className="mb-2 flex items-baseline justify-between font-semibold">
                  <span>
                    Observações <span className="font-normal text-grafite-2">(opcional)</span>
                  </span>
                  <span className="num text-[0.8rem] font-normal text-grafite-2" aria-hidden="true">
                    {obs.length}/{LIMITE}
                  </span>
                </label>
                <textarea
                  id={`${id}-obs`}
                  name="observacoes"
                  className="campo min-h-[7rem] resize-y"
                  maxLength={LIMITE}
                  rows={3}
                  placeholder="Se quiser, conte o que você procura."
                  value={obs}
                  aria-describedby={`${id}-obs-dica`}
                  onChange={(e) => setObs(e.target.value.slice(0, LIMITE))}
                />
                <p id={`${id}-obs-dica`} className="mt-2 text-[0.85rem] text-grafite-2">
                  Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp. Até {LIMITE} caracteres.
                </p>
              </div>

              <div>
                <button type="submit" className="btn btn-primario w-full" disabled={estado === 'abrindo'} aria-busy={estado === 'abrindo'}>
                  {estado === 'abrindo' ? (
                    <span className="flex items-center gap-3">
                      <span className="h-3 w-3 animate-spin border border-areia border-t-transparent motion-reduce:animate-none" aria-hidden="true" />
                      Abrindo o WhatsApp...
                    </span>
                  ) : (
                    <>
                      <span>Enviar solicitação pelo WhatsApp</span>
                      <span className="seta" aria-hidden="true" />
                    </>
                  )}
                </button>
                <p id={`${id}-nota`} className="mt-4 text-[0.85rem] text-grafite-2">
                  Ao enviar, você abre uma conversa no WhatsApp. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="link-sub text-grafite">
                    Privacidade
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
