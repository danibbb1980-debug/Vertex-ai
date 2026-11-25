import { useId, useMemo, useRef, useState } from 'react'
import { CONFIG, atendimentosAtivos } from '../config'

const hojeSP = () => {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.fusoHorario, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  return p // yyyy-mm-dd
}
const diaDaSemana = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}
const horasDoDia = (iso: string): string[] => {
  if (!iso) return []
  const h = CONFIG.horarios[diaDaSemana(iso)]
  if (!h.abre || !h.fecha) return []
  const ini = Number(h.abre.slice(0, 2)), fim = Number(h.fecha.slice(0, 2))
  const out: string[] = []
  for (let x = ini; x < fim; x++) out.push(`${String(x).padStart(2, '0')}:00`)
  return out
}
const br = (iso: string) => iso.split('-').reverse().join('/')

type Erros = Partial<Record<'nome' | 'data' | 'hora', string>>

export function Agendar() {
  const uid = useId()
  const [nome, setNome] = useState('')
  const [atend, setAtend] = useState('Avaliação')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<string | null>(null)
  const [bloqueado, setBloqueado] = useState(false)
  const status = useRef<HTMLParagraphElement>(null)
  const minimo = useMemo(hojeSP, [])
  const horas = horasDoDia(data)

  const opcoes = ['Avaliação', ...atendimentosAtivos().map((a) => a.nome).filter((n) => n !== 'Avaliação'), 'Ainda não sei, quero conversar']

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a Dra. Ana Clara saber com quem fala.'
    if (data) {
      if (data < minimo) e.data = 'Essa data já passou. Escolha outra.'
      else if (horasDoDia(data).length === 0) e.data = 'Dia sem atendimento, escolha outra data.'
    }
    if (hora && data && !horasDoDia(data).includes(hora)) e.hora = 'Esse horário não existe nesse dia. Escolha outro.'
    return e
  }

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      const primeiro = (Object.keys(e) as (keyof Erros)[])[0]
      document.getElementById(`${uid}-${primeiro}`)?.focus()
      return
    }
    const msg = [
      `Olá! Vim pelo site da ${CONFIG.nome} e gostaria de solicitar um agendamento.`,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atend === 'Ainda não sei, quero conversar' ? 'a definir' : atend}`,
      `Data preferida: ${data ? br(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`
    const w = window.open(url, '_blank', 'noopener')
    setBloqueado(!w)
    setEnviado(url)
    requestAnimationFrame(() => status.current?.focus())
  }

  const desc = (k: keyof Erros, extra?: string) => [erros[k] ? `${uid}-${k}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  if (enviado)
    return (
      <div className="cartao sucesso" aria-live="polite">
        <span className="fulcro" aria-hidden="true"><i /></span>
        <p ref={status} tabIndex={-1} className="h2" style={{ fontSize: 'var(--t2)' }}>Pronto! Abrimos o WhatsApp com sua solicitação.</p>
        <p>É só enviar a mensagem. A confirmação da disponibilidade é feita pelo WhatsApp.</p>
        {bloqueado && <p>O navegador não abriu a nova aba. Use o botão abaixo.</p>}
        <div className="btns">
          <a className="btn btn-cheio" href={enviado} target="_blank" rel="noopener">Abrir WhatsApp</a>
          <button type="button" className="btn btn-linha" onClick={() => setEnviado(null)}>Editar solicitação</button>
        </div>
      </div>
    )

  return (
    <form className="cartao" noValidate onSubmit={enviar} aria-describedby={`${uid}-priv`}>
      <div className="campo">
        <label htmlFor={`${uid}-nome`}>Nome completo</label>
        <input id={`${uid}-nome`} name="nome" autoComplete="name" required placeholder="Como devemos te chamar?" value={nome}
          onChange={(e) => { setNome(e.target.value); if (erros.nome) setErros((x) => ({ ...x, nome: undefined })) }} aria-invalid={!!erros.nome} aria-describedby={desc('nome')} />
        {erros.nome && <span className="erro" id={`${uid}-nome-erro`}>{erros.nome}</span>}
      </div>
      <div className="campo">
        <label htmlFor={`${uid}-atend`}>Atendimento desejado</label>
        <select id={`${uid}-atend`} value={atend} onChange={(e) => setAtend(e.target.value)}>
          {opcoes.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="duas">
        <div className="campo">
          <label htmlFor={`${uid}-data`}>Data preferida</label>
          <input id={`${uid}-data`} type="date" min={minimo} value={data}
            onChange={(e) => {
              const v = e.target.value
              setData(v); setHora('')
              setErros((x) => ({ ...x, data: v && horasDoDia(v).length === 0 ? 'Dia sem atendimento, escolha outra data.' : v && v < minimo ? 'Essa data já passou. Escolha outra.' : undefined }))
            }}
            aria-invalid={!!erros.data} aria-describedby={desc('data', `${uid}-data-dica`)} />
          {erros.data ? <span className="erro" id={`${uid}-data-erro`}>{erros.data}</span>
            : <span className="dica" id={`${uid}-data-dica`}>Domingo não há atendimento.</span>}
        </div>
        <div className="campo">
          <label htmlFor={`${uid}-hora`}>Horário preferido</label>
          <select id={`${uid}-hora`} value={hora} onChange={(e) => setHora(e.target.value)} disabled={!horas.length}
            aria-invalid={!!erros.hora} aria-describedby={desc('hora', `${uid}-hora-dica`)}>
            <option value="">Escolha um horário</option>
            {horas.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
          {erros.hora ? <span className="erro" id={`${uid}-hora-erro`}>{erros.hora}</span>
            : <span className="dica" id={`${uid}-hora-dica`}>{data ? 'Preferência, sujeita a confirmação.' : 'Escolha a data primeiro.'}</span>}
        </div>
      </div>
      <div className="campo">
        <label htmlFor={`${uid}-obs`}>Observações (opcional)</label>
        <textarea id={`${uid}-obs`} maxLength={300} placeholder="Se quiser, conte o que você procura." value={obs}
          onChange={(e) => setObs(e.target.value)} aria-describedby={`${uid}-obs-dica`} />
        <span className="dica" id={`${uid}-obs-dica`}>
          Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp. <span className="num">{obs.length}/300</span>
        </span>
      </div>
      <button type="submit" className="btn btn-cheio" style={{ width: '100%' }}>Enviar solicitação pelo WhatsApp</button>
      <p className="form-rodape" id={`${uid}-priv`}>
        Ao enviar, você abre uma conversa no WhatsApp com a {CONFIG.nome}. Este site não guarda os dados digitados.{' '}
        <a className="link" style={{ minHeight: 0 }} href="/privacidade.html">Como tratamos a privacidade</a>
      </p>
    </form>
  )
}
