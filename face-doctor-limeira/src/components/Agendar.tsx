import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, atendimentosAtivos } from '../config'
import {
  abreNoDia,
  agoraNaClinica,
  blocosDoDia,
  dataBR,
  diaDaData,
  paraMin,
} from '../lib/horarios'
import { waUrl } from '../lib/whatsapp'
import { Rotulo, Titulo } from './Base'

type Erros = Partial<Record<'nome' | 'data' | 'hora', string>>
const LIMITE_OBS = 300

export function montarMensagem(d: {
  nome: string
  atendimento: string
  data: string
  hora: string
  obs: string
}) {
  return [
    'Olá! Vim pelo site da Face Doctor Limeira e gostaria de solicitar um agendamento.',
    `Nome: ${d.nome.trim()}`,
    `Atendimento: ${d.atendimento || 'a definir'}`,
    `Data preferida: ${d.data ? dataBR(d.data) : 'a combinar'}`,
    `Horário preferido: ${d.hora || 'a combinar'}`,
    `Observações: ${d.obs.trim() || '-'}`,
  ].join('\n')
}

export function Agendar({ n }: { n: number }) {
  const opcoes = useMemo(
    () => ['Avaliação', ...atendimentosAtivos().map((a) => a.nome), 'Ainda não sei, quero conversar'],
    [],
  )
  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'editando' | 'enviando' | 'aberto' | 'bloqueado'>('editando')
  const [urlFinal, setUrlFinal] = useState('')
  const [hoje, setHoje] = useState('')
  const nomeRef = useRef<HTMLInputElement>(null)
  const dataRef = useRef<HTMLInputElement>(null)
  const horaRef = useRef<HTMLSelectElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => setHoje(agoraNaClinica().iso), [])

  const erroData = (v: string): string | undefined => {
    if (!v) return
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Use o formato dia/mês/ano.'
    if (hoje && v < hoje) return 'Escolha uma data a partir de hoje.'
    if (!abreNoDia(diaDaData(v))) return 'Dia sem atendimento, escolha outra data.'
  }

  const horarios = useMemo(() => {
    if (!data || erroData(data)) return []
    let blocos = blocosDoDia(diaDaData(data))
    const agora = agoraNaClinica()
    if (data === agora.iso) blocos = blocos.filter((b) => paraMin(b) > agora.minutos)
    return blocos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, hoje])

  useEffect(() => {
    if (hora && !horarios.includes(hora)) setHora('')
  }, [horarios, hora])

  const semHorarioHoje = !!data && !erroData(data) && horarios.length === 0

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a equipe saber com quem vai falar.'
    const ed = erroData(data)
    if (ed) e.data = ed
    else if (semHorarioHoje) e.data = 'Não há mais horários hoje. Escolha outra data.'
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      ;(e.nome ? nomeRef : dataRef).current?.focus()
      return
    }
    setEstado('enviando')
    const url = waUrl(montarMensagem({ nome, atendimento, data, hora, obs }))
    setUrlFinal(url)
    const janela = window.open(url, '_blank')
    if (janela) {
      try {
        janela.opener = null
      } catch {
        /* ignore */
      }
      setEstado('aberto')
    } else {
      setEstado('bloqueado')
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const recomecar = () => {
    setEstado('editando')
    requestAnimationFrame(() => nomeRef.current?.focus())
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `ag-${campo}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  return (
    <section className="secao ag" id="agendar" aria-labelledby="ag-t">
      <div className="grade ag-grade">
        <div className="ag-cab">
          <Rotulo n={n}>Praticidade</Rotulo>
          <Titulo
            id="ag-t"
            linhas={[
              'Peça sua avaliação',
              <>
                em poucos <em>cliques</em>.
              </>,
            ]}
          />
          <p className="ag-apoio">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a
            equipe da {CONFIG.nome} confirma a disponibilidade.
          </p>
        </div>

        <div className="ag-cartao">
          <div className="ag-marcas" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} />
            ))}
          </div>

          {estado === 'aberto' || estado === 'bloqueado' ? (
            <div className="ag-status" ref={statusRef} tabIndex={-1} role="status">
              {estado === 'aberto' ? (
                <>
                  <p className="ag-status-t">Pronto!</p>
                  <p>
                    Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe da {CONFIG.nome}{' '}
                    confirma a disponibilidade.
                  </p>
                  <p className="ag-pequeno">
                    O WhatsApp não abriu?{' '}
                    <a className="link" href={urlFinal} target="_blank" rel="noopener noreferrer">
                      Abrir WhatsApp
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p className="ag-status-t">Falta um toque.</p>
                  <p>O navegador impediu a abertura automática. Toque no botão para abrir a conversa com sua solicitação.</p>
                  <a className="btn btn--tinta" href={urlFinal} target="_blank" rel="noopener noreferrer">
                    <span className="btn-txt">Abrir WhatsApp</span>
                  </a>
                </>
              )}
              <button type="button" className="btn btn--texto ag-refazer" onClick={recomecar}>
                <span className="btn-txt">Editar solicitação</span>
              </button>
            </div>
          ) : (
            <form className="ag-form" noValidate onSubmit={enviar}>
              <div className={`campo${erros.nome ? ' campo--erro' : ''}`}>
                <label htmlFor="ag-nome">Nome completo</label>
                <input
                  ref={nomeRef}
                  id="ag-nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Como devemos te chamar?"
                  required
                  maxLength={80}
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                  }}
                  aria-invalid={!!erros.nome}
                  aria-describedby={desc('nome')}
                />
                {erros.nome && (
                  <p className="campo-erro" id="ag-nome-erro">
                    {erros.nome}
                  </p>
                )}
              </div>

              <div className="campo">
                <label htmlFor="ag-atend">Atendimento desejado</label>
                <select
                  id="ag-atend"
                  name="atendimento"
                  value={atendimento}
                  onChange={(e) => setAtendimento(e.target.value)}
                >
                  <option value="">Escolha uma opção</option>
                  {opcoes.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-par">
                <div className={`campo${erros.data ? ' campo--erro' : ''}`}>
                  <label htmlFor="ag-data">Data preferida</label>
                  <input
                    ref={dataRef}
                    id="ag-data"
                    name="data"
                    type="date"
                    min={hoje || undefined}
                    value={data}
                    onChange={(e) => {
                      const v = e.target.value
                      setData(v)
                      setErros((x) => ({ ...x, data: erroData(v) }))
                    }}
                    aria-invalid={!!erros.data}
                    aria-describedby={desc('data', 'ag-data-dica')}
                  />
                  <p className="campo-dica" id="ag-data-dica">
                    Segunda a sábado.
                  </p>
                  {erros.data && (
                    <p className="campo-erro" id="ag-data-erro">
                      {erros.data}
                    </p>
                  )}
                </div>

                <div className="campo">
                  <label htmlFor="ag-hora">Horário preferido</label>
                  <select
                    ref={horaRef}
                    id="ag-hora"
                    name="hora"
                    value={hora}
                    disabled={!horarios.length}
                    onChange={(e) => setHora(e.target.value)}
                    aria-describedby="ag-hora-dica"
                  >
                    <option value="">Escolha um horário</option>
                    {horarios.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <p className="campo-dica" id="ag-hora-dica">
                    {horarios.length ? 'Preferência, sujeita a confirmação.' : 'Escolha a data para ver os horários.'}
                  </p>
                </div>
              </div>

              <div className="campo">
                <label htmlFor="ag-obs">
                  Observações <span className="campo-opc">(opcional)</span>
                </label>
                <textarea
                  id="ag-obs"
                  name="obs"
                  rows={3}
                  maxLength={LIMITE_OBS}
                  placeholder="Se quiser, conte o que você procura."
                  value={obs}
                  onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                  aria-describedby="ag-obs-dica"
                />
                <p className="campo-dica campo-dica--linha" id="ag-obs-dica">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="campo-conta" aria-live="polite">
                    {obs.length}/{LIMITE_OBS}
                  </span>
                </p>
              </div>

              <div className="sr-only" aria-live="assertive">
                {Object.values(erros).filter(Boolean).length
                  ? `Revise o formulário: ${Object.values(erros).filter(Boolean).join(' ')}`
                  : ''}
              </div>

              <button type="submit" className="btn btn--tinta ag-enviar" disabled={estado === 'enviando'}>
                <span className="btn-txt">
                  {estado === 'enviando' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
                </span>
              </button>
              <p className="ag-pequeno ag-privacidade">
                Ao enviar, você abre uma conversa no WhatsApp com a {CONFIG.nome}. Este site não guarda os dados
                digitados.{' '}
                <a className="link" href="/privacidade.html">
                  Privacidade
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
