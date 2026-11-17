import { useEffect, useMemo, useState } from 'react'
import { CONFIG, wa } from '../config'

const wrap = 'mx-auto w-full max-w-[1360px] px-4 sm:px-8'

const pad = (n: number) => String(n).padStart(2, '0')
const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const diaDaSemana = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}
const abertoNo = (iso: string) => {
  if (!iso) return false
  const h = CONFIG.horarios[diaDaSemana(iso)]
  return !!(h && h.abre && h.fecha)
}
/** blocos de 1 hora, do horário de abertura até 1h antes do fechamento */
export const horariosDoDia = (iso: string): string[] => {
  if (!abertoNo(iso)) return []
  const h = CONFIG.horarios[diaDaSemana(iso)]
  const ini = Number(h.abre!.split(':')[0])
  const fim = Number(h.fecha!.split(':')[0])
  const out: string[] = []
  for (let x = ini; x < fim; x++) out.push(`${pad(x)}:00`)
  return out
}
const brData = (iso: string) => iso.split('-').reverse().join('/')

type Erros = Partial<Record<'nome' | 'data' | 'hora', string>>

export function Agendar() {
  const [nome, setNome] = useState('')
  const [atend, setAtend] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<string | null>(null)
  const [bloqueado, setBloqueado] = useState(false)
  const [min, setMin] = useState('')
  useEffect(() => setMin(hojeISO()), [])
  const horas = useMemo(() => horariosDoDia(data), [data])

  const opcoes = [
    'Avaliação inicial',
    ...CONFIG.atendimentos.map((a) => a.nome),
    ...(CONFIG.cursos.length ? ['Cursos (quero informações)'] : []),
    'Ainda não sei, quero conversar',
  ]

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a equipe saber com quem fala.'
    if (data) {
      if (min && data < min) e.data = 'Escolha uma data a partir de hoje.'
      else if (!abertoNo(data)) e.data = 'Dia sem atendimento, escolha outra data.'
    }
    if (hora && data && !horas.includes(hora)) e.hora = 'Escolha um horário da lista.'
    return e
  }

  const onData = (v: string) => {
    setData(v)
    setHora('')
    setErros((er) => ({
      ...er,
      data: v && !abertoNo(v) ? 'Dia sem atendimento, escolha outra data.' : v && min && v < min ? 'Escolha uma data a partir de hoje.' : undefined,
    }))
  }

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      const first = (['nome', 'data', 'hora'] as const).find((k) => e[k])
      if (first) document.getElementById(`ag-${first}`)?.focus()
      return
    }
    const msg = [
      'Olá! Vim pelo site da Trinity e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atend || 'a definir'}`,
      `Data preferida: ${data ? brData(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = wa(msg)
    const w = window.open(url, '_blank')
    if (w) w.opener = null
    setBloqueado(!w)
    setEnviado(url)
  }

  const err = (k: keyof Erros) =>
    erros[k] ? (
      <p id={`ag-${k}-err`} className="mt-2 text-[0.92rem] font-medium text-[#9b2c1f]">
        {erros[k]}
      </p>
    ) : null

  return (
    <section id="agendar" data-chapter="2" aria-labelledby="ag-title">
      <div className={`${wrap} grid gap-12 py-20 sm:py-28 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <p className="label text-bronze">Praticidade</p>
          <h2 id="ag-title" className="display mt-5 text-[clamp(2.4rem,5vw,3.8rem)]">
            Peça sua avaliação em poucos <em className="text-bronze">cliques</em>.
          </h2>
          <p className="mt-6 max-w-[28rem] text-stone">
            Escolha o atendimento, o dia e o horário de sua preferência. Sua solicitação chega pelo WhatsApp, e a equipe confirma a disponibilidade.
          </p>
        </div>

        <div className="border border-bronze/60 bg-paper p-5 sm:p-9 lg:col-span-6 lg:col-start-7">
          <form noValidate onSubmit={enviar} className="grid gap-6">
            <div>
              <label htmlFor="ag-nome" className="mb-2 block font-medium">
                Nome completo <span className="text-stone">(obrigatório)</span>
              </label>
              <input
                id="ag-nome"
                className="field"
                autoComplete="name"
                required
                placeholder="Como devemos te chamar?"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                aria-invalid={!!erros.nome}
                aria-describedby={erros.nome ? 'ag-nome-err' : undefined}
              />
              {err('nome')}
            </div>

            <div>
              <label htmlFor="ag-atend" className="mb-2 block font-medium">
                Atendimento desejado
              </label>
              <select id="ag-atend" className="field" value={atend} onChange={(e) => setAtend(e.target.value)}>
                <option value="">Escolha uma opção</option>
                {opcoes.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="ag-data" className="mb-2 block font-medium">
                  Data preferida
                </label>
                <input
                  id="ag-data"
                  type="date"
                  className="field"
                  min={min || undefined}
                  value={data}
                  onChange={(e) => onData(e.target.value)}
                  aria-invalid={!!erros.data}
                  aria-describedby={`ag-data-dica${erros.data ? ' ag-data-err' : ''}`}
                />
                <p id="ag-data-dica" className="mt-2 text-[0.85rem] text-stone">
                  Segunda a sexta.
                </p>
                {err('data')}
              </div>
              <div>
                <label htmlFor="ag-hora" className="mb-2 block font-medium">
                  Horário preferido
                </label>
                <select
                  id="ag-hora"
                  className="field tnum"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  disabled={!horas.length}
                  aria-invalid={!!erros.hora}
                  aria-describedby={`ag-hora-dica${erros.hora ? ' ag-hora-err' : ''}`}
                >
                  <option value="">Escolha um horário</option>
                  {horas.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
                <p id="ag-hora-dica" className="mt-2 text-[0.85rem] text-stone">
                  {horas.length ? 'Preferência, sujeita a confirmação.' : 'Escolha antes um dia útil.'}
                </p>
                {err('hora')}
              </div>
            </div>

            <div>
              <label htmlFor="ag-obs" className="mb-2 block font-medium">
                Observações <span className="text-stone">(opcional)</span>
              </label>
              <textarea
                id="ag-obs"
                className="field"
                maxLength={300}
                placeholder="Se quiser, conte o que você procura."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                aria-describedby="ag-obs-dica"
              />
              <p id="ag-obs-dica" className="mt-2 flex justify-between gap-4 text-[0.85rem] text-stone">
                <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                <span className="tnum shrink-0">{obs.length}/300</span>
              </p>
            </div>

            <div>
              <button type="submit" className="btn btn-ink w-full">
                Enviar solicitação pelo WhatsApp
              </button>
              <p className="mt-4 text-[0.85rem] leading-relaxed text-stone">
                Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                <a href="/privacidade.html" className="link-u">
                  Saiba como funciona a privacidade
                </a>
                .
              </p>
            </div>

            <div aria-live="polite" role="status">
              {enviado && (
                <div className="border-t border-bronze pt-5">
                  <p className="font-medium">
                    Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                  </p>
                  {bloqueado && <p className="mt-2 text-stone">Se a janela não abriu, use o link abaixo.</p>}
                  <a href={enviado} target="_blank" rel="noopener noreferrer" className="link-u mt-3 inline-flex min-h-12 items-center font-medium text-bronze">
                    Abrir WhatsApp
                  </a>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
