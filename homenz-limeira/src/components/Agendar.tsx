import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CONFIG, atendimentosAtivos } from '../config'
import { useSelecao } from '../estado'
import { dataBR, diaAberto, diaDaSemana, frasesDe, hojeISO, horariosDoDia, waLink } from '../lib'
import { Traco, NumSecao } from './Marca'
import { Titulo } from './Reveal'

const LIMITE = 300

export function Agendar() {
  const { sel, alternar } = useSelecao()
  const itens = atendimentosAtivos()
  const [nome, setNome] = useState('')
  const [naoSei, setNaoSei] = useState(false)
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [hoje, setHoje] = useState('')
  const [erros, setErros] = useState<{ nome?: string; data?: string }>({})
  const [enviado, setEnviado] = useState('')
  const nomeRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef<HTMLInputElement>(null)

  useEffect(() => setHoje(hojeISO()), [])

  const dataValida = data && !erros.data
  let horas = dataValida ? horariosDoDia(diaDaSemana(data)) : []
  if (dataValida && data === hoje) {
    const agora = Number(
      new Intl.DateTimeFormat('en-GB', { timeZone: CONFIG.fusoHorario, hour: '2-digit', hour12: false }).format(new Date()),
    )
    horas = horas.filter((h) => Number(h.slice(0, 2)) > agora)
  }

  function validarData(v: string): string | undefined {
    if (!v) return undefined
    if (hoje && v < hoje) return 'Escolha uma data a partir de hoje.'
    if (!diaAberto(diaDaSemana(v))) return 'Dia sem atendimento, escolha outra data.'
    return undefined
  }

  function mudarData(v: string) {
    setData(v)
    setHora('')
    setErros((e) => ({ ...e, data: validarData(v) }))
  }

  function montar(): string {
    const areas = frasesDe(sel)
    if (naoSei) areas.push('ainda não sei, quero conversar')
    return [
      'Olá! Vim pelo site da Homenz Limeira e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Quero avaliar: ${areas.length ? areas.join(', ') : 'a definir'}`,
      `Data preferida: ${data && !erros.data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
  }

  function enviar(e: FormEvent) {
    e.preventDefault()
    const n: typeof erros = {}
    if (nome.trim().length < 2) n.nome = 'Escreva seu nome para a equipe saber com quem vai falar.'
    const ed = validarData(data)
    if (ed) n.data = ed
    setErros(n)
    if (n.nome) return nomeRef.current?.focus()
    if (n.data) return dataRef.current?.focus()
    const url = waLink(montar())
    const w = window.open(url, '_blank')
    if (w) w.opener = null
    setEnviado(url)
  }

  return (
    <section className="agendar" id="agendar" aria-labelledby="agendar-titulo">
      <div className="grade agendar-grade">
        <div className="agendar-texto">
          <NumSecao n="08" rotulo="Praticidade" />
          <Titulo
            id="agendar-titulo"
            className="titulo-secao"
            linhas={['Peça sua avaliação', <>em poucos <em>cliques</em>.</>]}
          />
          <p className="texto-apoio">
            Marque o que lhe interessa e escolha o melhor dia e horário para você. Sua solicitação chega pelo WhatsApp,
            e a equipe da Homenz Limeira confirma a disponibilidade.
          </p>
        </div>

        <form className="cartao-form" noValidate onSubmit={enviar} aria-describedby="form-privacidade">
          <div className="campo">
            <label htmlFor="f-nome">
              Nome completo <span className="obrig">(obrigatório)</span>
            </label>
            <input
              ref={nomeRef}
              id="f-nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Como devemos te chamar?"
              value={nome}
              required
              aria-invalid={!!erros.nome}
              aria-describedby={erros.nome ? 'f-nome-erro' : undefined}
              onChange={(e) => {
                setNome(e.target.value)
                if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
              }}
            />
            {erros.nome && (
              <p className="erro" id="f-nome-erro">
                {erros.nome}
              </p>
            )}
          </div>

          <fieldset className="campo">
            <legend>O que você quer avaliar</legend>
            <div className="marcas">
              {itens.map((a) => (
                <label className="marca-op" key={a.id} htmlFor={`f-${a.area}`}>
                  <input
                    id={`f-${a.area}`}
                    type="checkbox"
                    className="ficha-input"
                    checked={sel.has(a.area)}
                    onChange={(e) => alternar(a.area, e.target.checked)}
                  />
                  <span className="caixa" aria-hidden="true">
                    <Traco />
                  </span>
                  {a.rotulo}
                </label>
              ))}
              <label className="marca-op" htmlFor="f-naosei">
                <input
                  id="f-naosei"
                  type="checkbox"
                  className="ficha-input"
                  checked={naoSei}
                  onChange={(e) => setNaoSei(e.target.checked)}
                />
                <span className="caixa" aria-hidden="true">
                  <Traco />
                </span>
                Ainda não sei, quero conversar
              </label>
            </div>
          </fieldset>

          <div className="campo-par">
            <div className="campo">
              <label htmlFor="f-data">Data preferida</label>
              <input
                ref={dataRef}
                id="f-data"
                name="data"
                type="date"
                min={hoje || undefined}
                value={data}
                aria-invalid={!!erros.data}
                aria-describedby={erros.data ? 'f-data-erro' : 'f-data-dica'}
                onChange={(e) => mudarData(e.target.value)}
              />
              {erros.data ? (
                <p className="erro" id="f-data-erro">
                  {erros.data}
                </p>
              ) : (
                <p className="dica" id="f-data-dica">
                  Domingo sem atendimento.
                </p>
              )}
            </div>
            <div className="campo">
              <label htmlFor="f-hora">Horário preferido</label>
              <select
                id="f-hora"
                name="hora"
                value={hora}
                disabled={!dataValida || horas.length === 0}
                aria-describedby="f-hora-dica"
                onChange={(e) => setHora(e.target.value)}
              >
                <option value="">Escolha um horário</option>
                {horas.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <p className="dica" id="f-hora-dica">
                {!dataValida
                  ? 'Escolha a data primeiro.'
                  : horas.length
                    ? 'Preferência, sujeita a confirmação.'
                    : 'Sem horários restantes nesta data.'}
              </p>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="f-obs">
              Observações <span className="obrig">(opcional)</span>
            </label>
            <textarea
              id="f-obs"
              name="obs"
              rows={3}
              maxLength={LIMITE}
              placeholder="Se quiser, conte o que você procura."
              value={obs}
              aria-describedby="f-obs-dica"
              onChange={(e) => setObs(e.target.value)}
            />
            <p className="dica" id="f-obs-dica">
              Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.{' '}
              <span className="num-tab">
                {obs.length}/{LIMITE}
              </span>
            </p>
          </div>

          <button type="submit" className="botao botao-cheio botao-largo">
            Enviar solicitação pelo WhatsApp
          </button>
          <p className="nota" id="form-privacidade">
            Ao enviar, você abre uma conversa no WhatsApp com a Homenz Limeira. Este site não guarda os dados digitados.{' '}
            <a className="link" href="/privacidade.html">
              Privacidade
            </a>
          </p>

          <div aria-live="polite" className="form-status">
            {enviado && (
              <div className="pronto">
                <p>
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe da Homenz Limeira
                  confirma a disponibilidade.
                </p>
                <p>
                  Se a conversa não abriu,{' '}
                  <a className="link" href={enviado} target="_blank" rel="noopener noreferrer">
                    Abrir WhatsApp
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
