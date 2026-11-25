import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, atendimentosAtivos } from '../config'
import { agoraNoFuso, minutos, opcoesDeHorario } from '../lib/horarios'
import { waLink } from '../lib/wa'
import { MarcaSecao, Titulo } from './ui'

const CONVERSAR_ANTES = 'Quero conversar antes'
const NAO_SEI = 'Ainda não sei, quero conversar'
const LIMITE_OBS = 300

/** "2026-11-27" -> dia da semana (0 = domingo), sem depender do fuso do navegador */
const diaDaSemana = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}
const dataBR = (iso: string) => iso.split('-').reverse().join('/')

type Erros = Partial<Record<'nome' | 'data' | 'horario', string>>

export const Agendar = ({ n }: { n: number }) => {
  const [nome, setNome] = useState('')
  const [atend, setAtend] = useState(CONVERSAR_ANTES)
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState<string | null>(null)
  const [hoje, setHoje] = useState<{ iso: string; min: number } | null>(null)
  const nomeRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef<HTMLInputElement>(null)
  const horaRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const a = agoraNoFuso()
    setHoje({ iso: a.iso, min: a.min })
  }, [])

  const diaSemana = data ? diaDaSemana(data) : null
  const fechado = diaSemana !== null && opcoesDeHorario(diaSemana).length === 0
  const opcoes = useMemo(() => {
    if (diaSemana === null) return []
    const base = opcoesDeHorario(diaSemana)
    // hoje: só horários que ainda não passaram
    if (hoje && data === hoje.iso) return base.filter((h) => minutos(h) > hoje.min)
    return base
  }, [diaSemana, data, hoje])

  useEffect(() => {
    if (horario && !opcoes.includes(horario)) setHorario('')
  }, [opcoes, horario])

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para sabermos como te chamar.'
    if (data) {
      if (hoje && data < hoje.iso) e.data = 'Essa data já passou. Escolha outra data.'
      else if (fechado) e.data = 'Dia sem atendimento, escolha outra data.'
      else if (!opcoes.length) e.data = 'Não há mais horários nesse dia. Escolha outra data.'
    }
    if (horario && !data) e.horario = 'Escolha uma data antes do horário.'
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      ;(e.nome ? nomeRef : e.data ? dataRef : horaRef).current?.focus()
      return
    }
    const atendimento =
      atend === CONVERSAR_ANTES || atend === NAO_SEI ? `a definir (${atend.toLowerCase()})` : atend
    const mensagem = [
      `Olá! Vim pelo site do ${CONFIG.nome} e gostaria de solicitar um agendamento.`,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento}`,
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const url = waLink(mensagem)
    window.open(url, '_blank', 'noopener')
    setEnviado(url)
  }

  const descr = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `erro-${campo}` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section className="secao abaixo" id="agendar" aria-labelledby="titulo-agendar">
      <div className="wrap agendar__grade">
        <header className="cab agendar__lado">
          <MarcaSecao n={n} texto="Praticidade" />
          <Titulo id="titulo-agendar" linhas={['Peça seu horário', <>em poucos <em>cliques</em>.</>]} />
          <p className="apoio" style={{ maxWidth: 'var(--medida)' }}>
            Escolha o atendimento e o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e o{' '}
            {CONFIG.nome} confirma a disponibilidade.
          </p>
        </header>

        <div className="cartao">
          <span className="cartao__regua" aria-hidden="true" />
          <noscript>
            <p>
              Para usar o formulário, ative o JavaScript. Ou chame direto pelo{' '}
              <a className="link" href={waLink()}>
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
              .
            </p>
          </noscript>
          <form className="form" onSubmit={enviar} noValidate aria-describedby="aviso-form">
            <div className="campo">
              <label htmlFor="f-nome">Nome completo</label>
              <input
                ref={nomeRef}
                id="f-nome"
                name="nome"
                autoComplete="name"
                placeholder="Como devemos te chamar?"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                aria-invalid={erros.nome ? true : undefined}
                aria-describedby={descr('nome')}
              />
              {erros.nome && (
                <p className="erro" id="erro-nome">
                  {erros.nome}
                </p>
              )}
            </div>

            <div className="campo">
              <label htmlFor="f-atend">Atendimento desejado</label>
              <select id="f-atend" name="atendimento" value={atend} onChange={(e) => setAtend(e.target.value)}>
                <option>{CONVERSAR_ANTES}</option>
                {atendimentosAtivos().map((a) => (
                  <option key={a.id}>{a.nome}</option>
                ))}
                <option>{NAO_SEI}</option>
              </select>
            </div>

            <div className="duas">
              <div className="campo">
                <label htmlFor="f-data">
                  Data preferida <span className="opcional">(opcional)</span>
                </label>
                <input
                  ref={dataRef}
                  id="f-data"
                  name="data"
                  type="date"
                  min={hoje?.iso}
                  value={data}
                  onChange={(e) => {
                    setData(e.target.value)
                    setErros((x) => ({ ...x, data: undefined }))
                  }}
                  aria-invalid={erros.data || fechado ? true : undefined}
                  aria-describedby={descr('data', 'dica-data')}
                />
                <p className="campo__dica" id="dica-data">
                  Domingo sem atendimento.
                </p>
                {(erros.data || fechado) && (
                  <p className="erro" id="erro-data" role="alert">
                    {erros.data ?? 'Dia sem atendimento, escolha outra data.'}
                  </p>
                )}
              </div>
              <div className="campo">
                <label htmlFor="f-hora">
                  Horário preferido <span className="opcional">(opcional)</span>
                </label>
                <select
                  ref={horaRef}
                  id="f-hora"
                  name="horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  disabled={!data || fechado || !opcoes.length}
                  aria-invalid={erros.horario ? true : undefined}
                  aria-describedby={descr('horario', 'dica-hora')}
                >
                  <option value="">Escolha um horário</option>
                  {opcoes.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <p className="campo__dica" id="dica-hora">
                  {data ? 'Opções do dia escolhido.' : 'Escolha a data primeiro.'}
                </p>
                {erros.horario && (
                  <p className="erro" id="erro-horario">
                    {erros.horario}
                  </p>
                )}
              </div>
            </div>

            <div className="campo">
              <label htmlFor="f-obs">
                Observações <span className="opcional">(opcional)</span>
              </label>
              <textarea
                id="f-obs"
                name="observacoes"
                maxLength={LIMITE_OBS}
                placeholder="Se quiser, conte o que você procura."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                aria-describedby="dica-obs"
              />
              <p className="campo__dica" id="dica-obs">
                Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.{' '}
                <span aria-live="polite">
                  {obs.length}/{LIMITE_OBS}
                </span>
              </p>
            </div>

            <button className="btn" type="submit">
              Enviar solicitação pelo WhatsApp
            </button>

            <div aria-live="polite">
              {enviado && (
                <div className="pronto">
                  <p>
                    <strong>Pronto!</strong> Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. O{' '}
                    {CONFIG.nome} confirma a disponibilidade.
                  </p>
                  <p className="nota">
                    O WhatsApp não abriu?{' '}
                    <a className="link" href={enviado} target="_blank" rel="noopener noreferrer">
                      Abrir WhatsApp
                    </a>
                  </p>
                </div>
              )}
            </div>

            <p className="nota" id="aviso-form">
              Ao enviar, você abre uma conversa no WhatsApp com o {CONFIG.nome}. Este site não guarda os dados
              digitados.{' '}
              <a className="link" href="/privacidade.html">
                Privacidade
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
