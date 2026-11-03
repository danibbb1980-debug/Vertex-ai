import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { CONFIG, atendimentosVisiveis } from '../config'
import { horariosDoDia, waLink } from '../lib/contato'
import { IconeWhatsApp } from './Icones'
import { TituloRevelado } from './Movimento'

const LIMITE_OBS = 300

function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function diaDaSemana(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}
const brData = (iso: string) => iso.split('-').reverse().join('/')

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'horario' | 'obs', string>>

const campo =
  'block w-full min-h-12 border bg-gelo px-4 py-3 text-base text-taupe-950 transition-colors placeholder:text-taupe-500 focus:border-taupe-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota aria-[invalid=true]:border-terracota'

export function Agendamento() {
  const id = useId()
  const [comQuem, setComQuem] = useState('Sem preferência')
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<string | null>(null)
  const [bloqueado, setBloqueado] = useState(false)

  const opcoesAtendimento = [
    ...atendimentosVisiveis().map((a) => a.nomeCurto),
    'Primeira avaliação',
    'Ainda não sei, quero conversar',
  ]
  const profissionais = [...CONFIG.profissionais.map((p) => p.nome), 'Sem preferência']

  // a data de hoje só é lida no navegador (o HTML é pré-renderizado no build)
  const [hoje, setHoje] = useState('')
  useEffect(() => setHoje(hojeISO()), [])
  const diaFechado = data !== '' && !CONFIG.horarios[diaDaSemana(data)]
  const horarios = useMemo(() => {
    if (!data || diaFechado) return []
    let lista = horariosDoDia(diaDaSemana(data))
    if (data === hoje) {
      const agora = new Date()
      const minAgora = agora.getHours() * 60 + agora.getMinutes()
      lista = lista.filter((h) => {
        const [a, b] = h.split(':').map(Number)
        return a * 60 + b > minAgora
      })
    }
    return lista
  }, [data, diaFechado, hoje])

  function validar(): Erros {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a equipe saber como te chamar.'
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha um atendimento.'
    if (data) {
      if (hoje && data < hoje) e.data = 'Escolha uma data a partir de hoje.'
      else if (diaFechado) e.data = 'Dia sem atendimento, escolha outra data'
      else if (horarios.length === 0) e.data = 'Não há mais horários neste dia, escolha outra data.'
    }
    if (horario && !horarios.includes(horario)) e.horario = 'Escolha um horário da lista.'
    if (obs.length > LIMITE_OBS) e.obs = `Use até ${LIMITE_OBS} caracteres.`
    return e
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      const primeiro = Object.keys(e)[0]
      document.getElementById(`${id}-${primeiro}`)?.focus()
      return
    }
    const msg = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Com quem: ${comQuem}`,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? brData(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = waLink(msg)
    // sem a flag 'noopener' para saber se a aba abriu; o opener é zerado em seguida
    const janela = window.open(url, '_blank')
    if (janela) janela.opener = null
    setBloqueado(!janela)
    setEnviado(url)
  }

  const erroProps = (k: keyof Erros) =>
    erros[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-${k}-erro` } : { 'aria-invalid': false as const }

  const Erro = ({ k }: { k: keyof Erros }) =>
    erros[k] ? (
      <p id={`${id}-${k}-erro`} className="mt-2 text-[0.88rem] font-medium text-terracota">
        {erros[k]}
      </p>
    ) : null

  const Rotulo = ({ k, children, opcional }: { k: string; children: string; opcional?: boolean }) => (
    <label htmlFor={`${id}-${k}`} className="mb-2 flex items-baseline justify-between text-[0.92rem] font-medium text-taupe-900">
      {children}
      {opcional && <span className="text-[0.8rem] font-normal text-taupe-700">opcional</span>}
    </label>
  )

  return (
    <section id="agendar" className="py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="rotulo flex items-center gap-3 text-terracota">
            <span aria-hidden className="inline-block size-2.5 rounded-tl-full bg-current" />
            Praticidade
          </p>
          <TituloRevelado
            trechos={['Peça seu horário em poucos', { enfase: 'cliques.' }]}
            className="mt-4 text-[2rem] leading-[1.1] font-light text-taupe-950 sm:text-[2.6rem]"
          />
          <p className="mt-5 text-[1.05rem] text-taupe-800">
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
          <p className="mt-4 text-[0.95rem] text-taupe-700">
            Data e horário são preferências: a consulta só fica marcada depois da confirmação da clínica.
          </p>
        </div>

        <div className="relative border border-pedra-200 bg-pedra-50 p-6 sm:p-10">
          <span aria-hidden className="absolute -top-px -right-px size-14 rounded-bl-full border-b border-l border-pedra-200 bg-gelo" />
          {CONFIG.urgencia && (
            <div className="mb-8 flex flex-col gap-3 border-l-2 border-terracota bg-gelo p-4">
              <p className="font-medium">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 font-medium text-musgo">
                <IconeWhatsApp size={18} /> Falar agora
              </a>
            </div>
          )}

          {enviado ? (
            <div role="status" aria-live="polite" className="py-6">
              <p className="font-display text-[1.6rem] leading-tight font-light text-taupe-950">
                <span className="enfase">Pronto!</span> Abrimos o WhatsApp com sua solicitação.
              </p>
              <p className="mt-3 text-taupe-800">É só enviar a mensagem. A equipe confirma a disponibilidade.</p>
              <p className="mt-6 text-[0.95rem] text-taupe-800">
                {bloqueado ? 'O navegador bloqueou a nova aba. ' : 'Se a conversa não abriu, '}
                <a href={enviado} target="_blank" rel="noopener noreferrer" className="font-medium text-musgo underline underline-offset-4">
                  Abrir WhatsApp
                </a>
              </p>
              <button
                type="button"
                onClick={() => setEnviado(null)}
                className="mt-6 min-h-12 border border-taupe-700/35 px-5 text-[0.92rem] text-taupe-900 hover:border-taupe-900"
              >
                Fazer outra solicitação
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} className="grid gap-6">
              <fieldset>
                <legend className="mb-3 text-[0.92rem] font-medium text-taupe-900">Com quem?</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {profissionais.map((p) => (
                    <label
                      key={p}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 text-[0.95rem] transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-terracota ${
                        comQuem === p ? 'border-taupe-900 bg-gelo text-taupe-950' : 'border-pedra-200 bg-gelo/60 text-taupe-800 hover:border-taupe-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="com-quem"
                        value={p}
                        checked={comQuem === p}
                        onChange={() => setComQuem(p)}
                        className="size-4 accent-[var(--color-taupe-800)] focus:outline-none"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <Rotulo k="nome">Nome completo</Rotulo>
                <input
                  id={`${id}-nome`}
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`${campo} border-pedra-200`}
                  {...erroProps('nome')}
                />
                <Erro k="nome" />
              </div>

              <div>
                <Rotulo k="atendimento" opcional={!CONFIG.agendamento.exigirAtendimento}>
                  Atendimento desejado
                </Rotulo>
                <select
                  id={`${id}-atendimento`}
                  value={atendimento}
                  onChange={(e) => setAtendimento(e.target.value)}
                  className={`${campo} border-pedra-200`}
                  {...erroProps('atendimento')}
                >
                  <option value="">Escolha um atendimento</option>
                  {opcoesAtendimento.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <Erro k="atendimento" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Rotulo k="data" opcional>
                    Data preferida
                  </Rotulo>
                  <input
                    id={`${id}-data`}
                    type="date"
                    min={hoje || undefined}
                    value={data}
                    onChange={(e) => {
                      const v = e.target.value
                      setData(v)
                      setHorario('')
                      const fechado = v !== '' && !CONFIG.horarios[diaDaSemana(v)]
                      setErros((x) => ({ ...x, data: fechado ? 'Dia sem atendimento, escolha outra data' : v && hoje && v < hoje ? 'Escolha uma data a partir de hoje.' : undefined }))
                    }}
                    className={`${campo} border-pedra-200`}
                    {...erroProps('data')}
                  />
                  <div aria-live="polite">
                    <Erro k="data" />
                  </div>
                  {!erros.data && <p className="mt-2 text-[0.82rem] text-taupe-700">Segunda a sábado. Domingo fechado.</p>}
                </div>
                <div>
                  <Rotulo k="horario" opcional>
                    Horário preferido
                  </Rotulo>
                  <select
                    id={`${id}-horario`}
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    disabled={!data || diaFechado || horarios.length === 0}
                    className={`${campo} border-pedra-200 disabled:cursor-not-allowed disabled:bg-pedra-100 disabled:text-taupe-700`}
                    {...erroProps('horario')}
                  >
                    <option value="">{data && !diaFechado ? 'Escolha um horário' : 'Escolha a data primeiro'}</option>
                    {horarios.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <Erro k="horario" />
                </div>
              </div>

              <div>
                <Rotulo k="obs" opcional>
                  Observações
                </Rotulo>
                <textarea
                  id={`${id}-obs`}
                  rows={3}
                  maxLength={LIMITE_OBS}
                  placeholder="Se quiser, conte o que você precisa."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  className={`${campo} resize-y border-pedra-200`}
                  aria-describedby={`${id}-obs-ajuda`}
                />
                <p id={`${id}-obs-ajuda`} className="mt-2 flex justify-between gap-4 text-[0.82rem] text-taupe-700">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="shrink-0 tabular-nums">
                    {obs.length}/{LIMITE_OBS}
                  </span>
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative inline-flex min-h-14 w-full items-center justify-center gap-2.5 overflow-hidden bg-taupe-800 px-6 font-medium text-gelo transition-colors hover:bg-taupe-950"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -bottom-6 size-12 origin-bottom-right scale-0 rounded-tl-full bg-terracota/30 transition-transform duration-500 group-hover:scale-[2.6]"
                  />
                  <IconeWhatsApp size={18} />
                  <span className="relative">Enviar solicitação pelo WhatsApp</span>
                </button>
                <p className="mt-4 text-[0.85rem] text-taupe-700">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="underline underline-offset-4 hover:text-taupe-950">
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
