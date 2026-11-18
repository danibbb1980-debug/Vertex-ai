import { useEffect, useId, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { Onda } from './base'

const NAO_SEI = 'Ainda não sei, quero conversar'
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

function hojeISO() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function validarData(v: string): string {
  if (!v) return ''
  const [a, m, d] = v.split('-').map(Number)
  if (!a || !m || !d) return 'Data inválida. Use o formato dia/mês/ano.'
  const data = new Date(a, m - 1, d)
  if (v < hojeISO()) return 'Essa data já passou. Escolha uma data a partir de hoje.'
  if (!CONFIG.horarios.diasJs.includes(data.getDay()))
    return `Dia sem atendimento (${DIAS[data.getDay()]}), escolha de quarta a sábado.`
  return ''
}

const br = (v: string) => {
  const [a, m, d] = v.split('-')
  return `${d}/${m}/${a}`
}

export function montarMensagem(c: { nome: string; servico: string; data: string; periodo: string; obs: string }) {
  return [
    'Olá! Vim pelo site da Ivete Valério Estética e gostaria de solicitar um agendamento.',
    `Nome: ${c.nome.trim()}`,
    `Atendimento: ${c.servico && c.servico !== NAO_SEI ? c.servico : 'a definir'}`,
    `Data preferida: ${c.data ? br(c.data) : 'a combinar'}`,
    `Período preferido: ${c.periodo && c.periodo !== 'A combinar' ? c.periodo.toLowerCase() : 'a combinar'}`,
    `Observações: ${c.obs.trim() || '-'}`,
  ].join('\n')
}

export function Solicitar() {
  const id = useId()
  const [nome, setNome] = useState('')
  const [servico, setServico] = useState('')
  const [data, setData] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Record<string, string>>({})
  const [aviso, setAviso] = useState('')
  const [url, setUrl] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const [ok, setOk] = useState(false)
  // data mínima calculada no navegador (o HTML é pré-renderizado no build)
  const [hoje, setHoje] = useState('')
  useEffect(() => setHoje(hojeISO()), [])

  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a Ivete saber com quem está falando.'
    const ed = validarData(data)
    if (ed) e.data = ed
    if (obs.length > 300) e.obs = 'Use no máximo 300 caracteres.'
    setErros(e)
    setOk(false)
    if (Object.keys(e).length) {
      setAviso('Revise os campos marcados.')
      const primeiro = Object.keys(e)[0]
      document.getElementById(`${id}-${primeiro}`)?.focus()
      return
    }
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
      montarMensagem({ nome, servico, data, periodo, obs }),
    )}`
    setUrl(link)
    // abre sem referência de volta (equivale a noopener) e detecta bloqueio de pop-up
    const w = window.open(link, '_blank')
    if (w) w.opener = null
    setBloqueado(!w)
    setOk(true)
    setAviso('Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A Ivete confirma a disponibilidade.')
  }

  const desc = (campo: string, extra?: string) =>
    [erros[campo] ? `${id}-${campo}-erro` : '', extra || ''].filter(Boolean).join(' ') || undefined

  return (
    <section id="agendar" data-linha-borda className="relative py-24 md:py-32" aria-labelledby="t-solicitar">
      <div className="conteudo mx-auto grid w-full max-w-[1200px] gap-12 px-5 md:grid-cols-12 md:gap-10 md:px-8">
        <div className="md:col-span-5">
          <p className="rotulo text-argila">Praticidade</p>
          <h2 id="t-solicitar" className="display mt-5 text-[40px] md:text-[54px]">
            Peça seu horário em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-[38ch] text-[18px]">
            Escolha o serviço, o dia e o período que preferir. Sua solicitação chega pelo WhatsApp, e a Ivete confirma a
            disponibilidade.
          </p>
        </div>

        <form
          noValidate
          onSubmit={enviar}
          className="rounded-[var(--radius-suave)] border fio bg-cru p-5 sm:p-8 md:col-span-7"
          aria-describedby={`${id}-priv`}
        >
          <div className="grid gap-6">
            <div>
              <label htmlFor={`${id}-nome`} className="mb-2 block font-semibold">
                Nome completo <span className="font-normal">(obrigatório)</span>
              </label>
              <input
                id={`${id}-nome`}
                className="campo"
                type="text"
                autoComplete="name"
                required
                placeholder="Como devemos te chamar?"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                aria-invalid={!!erros.nome}
                aria-describedby={desc('nome')}
              />
              {erros.nome && (
                <p id={`${id}-nome-erro`} className="mt-2 text-[15px] text-[#9b2c1f]">
                  {erros.nome}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${id}-servico`} className="mb-2 block font-semibold">
                Serviço desejado
              </label>
              <select id={`${id}-servico`} className="campo" value={servico} onChange={(e) => setServico(e.target.value)}>
                <option value="">Escolha um serviço</option>
                {CONFIG.servicos.map((s) => (
                  <option key={s.id} value={s.nome}>
                    {s.nome}
                  </option>
                ))}
                <option value={NAO_SEI}>{NAO_SEI}</option>
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={`${id}-data`} className="mb-2 block font-semibold">
                  Data preferida
                </label>
                <input
                  id={`${id}-data`}
                  className="campo"
                  type="date"
                  min={hoje || undefined}
                  value={data}
                  onChange={(e) => {
                    setData(e.target.value)
                    const m = validarData(e.target.value)
                    setErros((x) => ({ ...x, data: m }))
                  }}
                  aria-invalid={!!erros.data}
                  aria-describedby={desc('data', `${id}-data-ajuda`)}
                />
                <p id={`${id}-data-ajuda`} className="mt-2 text-[14px]">
                  Atendimento de quarta a sábado.
                </p>
                {erros.data && (
                  <p id={`${id}-data-erro`} className="mt-1 text-[15px] text-[#9b2c1f]" role="alert">
                    {erros.data}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`${id}-periodo`} className="mb-2 block font-semibold">
                  Período preferido
                </label>
                <select id={`${id}-periodo`} className="campo" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                  <option value="">Escolha um período</option>
                  <option>Manhã</option>
                  <option>Tarde</option>
                  <option>A combinar</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={`${id}-obs`} className="mb-2 block font-semibold">
                Observações <span className="font-normal">(opcional)</span>
              </label>
              <textarea
                id={`${id}-obs`}
                className="campo min-h-[104px] resize-y"
                maxLength={300}
                rows={3}
                placeholder="Se quiser, conte o que você procura."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                aria-invalid={!!erros.obs}
                aria-describedby={desc('obs', `${id}-obs-ajuda`)}
              />
              <p id={`${id}-obs-ajuda`} className="mt-2 flex justify-between gap-4 text-[14px]">
                <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                <span className="num shrink-0" aria-hidden="true">
                  {obs.length}/300
                </span>
              </p>
              {erros.obs && (
                <p id={`${id}-obs-erro`} className="mt-1 text-[15px] text-[#9b2c1f]">
                  {erros.obs}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-argila w-full">
              Enviar solicitação pelo WhatsApp
              <Onda />
            </button>

            <div aria-live="polite" className="empty:hidden">
              {aviso && (
                <div className={`rounded-[var(--radius-suave)] text-[16px] ${ok ? 'bg-areia p-4' : 'font-semibold text-[#9b2c1f]'}`}>
                  <p>{aviso}</p>
                  {ok && url && (
                    <p className="mt-2 text-[15px]">
                      {bloqueado ? 'O navegador bloqueou a nova aba. ' : 'Se o WhatsApp não abriu, '}
                      <a href={url} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                        Abrir WhatsApp
                      </a>
                      .
                    </p>
                  )}
                </div>
              )}
            </div>

            <p id={`${id}-priv`} className="text-[14px]">
              Ao enviar, você abre uma conversa no WhatsApp com a {CONFIG.nome}. Este site não guarda os dados digitados.{' '}
              <a href="/privacidade.html" className="link">
                Privacidade
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
