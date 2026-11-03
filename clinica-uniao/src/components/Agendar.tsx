import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG } from '../config'
import { dataBR, dicaDias, dataLocal, expedienteDoDia, hojeISO, horariosDisponiveis } from '../lib/horarios'
import { waLink } from '../lib/links'
import { IconeWhats } from './Icones'
import { Reveal, Titulo } from './ui'

const OPCOES_EXTRA = ['Primeira avaliação', 'Ainda não sei, quero conversar']
const LIMITE_OBS = 300

type Erros = Partial<Record<'nome' | 'atendimento' | 'data' | 'hora', string>>

function validarData(iso: string): string | undefined {
  if (!iso) return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || isNaN(dataLocal(iso).getTime())) return 'Data inválida. Use o formato dd/mm/aaaa.'
  if (iso < hojeISO()) return 'Escolha uma data a partir de hoje.'
  if (!expedienteDoDia(iso)) return 'Dia sem atendimento, escolha outra data.'
  if (horariosDisponiveis(iso).length === 0) return 'Não há mais horários nesta data, escolha outra data.'
  return undefined
}

export function Agendar() {
  const opcoes = [...CONFIG.atendimentos.map((a) => a.nome), ...OPCOES_EXTRA]
  const exigir = CONFIG.agendamento.exigirAtendimento

  const [nome, setNome] = useState('')
  const [atendimento, setAtendimento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'editando' | 'enviando' | 'enviado'>('editando')
  const [bloqueado, setBloqueado] = useState(false)
  const [url, setUrl] = useState('')
  const statusRef = useRef<HTMLDivElement>(null)
  const nomeRef = useRef<HTMLInputElement>(null)

  // data de hoje só no navegador (o HTML é gerado no build)
  const [hoje, setHoje] = useState('')
  useEffect(() => setHoje(hojeISO()), [])
  const erroData = validarData(data)
  const horarios = useMemo(() => (data && !erroData ? horariosDisponiveis(data) : []), [data, erroData])

  const validar = (): Erros => {
    const e: Erros = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome para a clínica saber com quem vai falar.'
    if (exigir && !atendimento) e.atendimento = 'Escolha o atendimento desejado.'
    if (erroData) e.data = erroData
    if (hora && !horarios.includes(hora)) e.hora = 'Escolha um horário disponível para a data.'
    return e
  }

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validar()
    setErros(e)
    if (Object.keys(e).length) {
      const primeiro = Object.keys(e)[0]
      document.getElementById(`ag-${primeiro}`)?.focus()
      return
    }
    setEstado('enviando')
    const mensagem = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? dataBR(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n')
    const link = waLink(mensagem)
    setUrl(link)
    // abre na mesma interação do clique (evita bloqueio de pop-up)
    const janela = window.open(link, '_blank')
    if (janela) janela.opener = null
    setBloqueado(!janela)
    setEstado('enviado')
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const recomecar = () => {
    setNome('')
    setAtendimento('')
    setData('')
    setHora('')
    setObs('')
    setErros({})
    setEstado('editando')
    setBloqueado(false)
    requestAnimationFrame(() => nomeRef.current?.focus())
  }

  const descr = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `ag-${campo}-erro` : '', extra ?? ''].filter(Boolean).join(' ') || undefined

  const Erro = ({ campo }: { campo: keyof Erros }) =>
    erros[campo] ? (
      <p id={`ag-${campo}-erro`} className="mt-2 flex items-start gap-1.5 text-[0.92rem] font-medium text-[#9b3d24]">
        <span aria-hidden>!</span> {erros[campo]}
      </p>
    ) : null

  if (!CONFIG.whatsapp) return null

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="relative overflow-hidden py-20 sm:py-28">
      <svg aria-hidden viewBox="0 0 600 600" className="pointer-events-none absolute -right-64 bottom-0 h-[600px] w-[600px] text-camel-400/20" fill="none">
        <path d="M200 30a270 270 0 1 1 0 540" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <div className="container-site relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="rotulo">Praticidade</p>
          <Titulo id="t-agendar" antes="Peça seu horário em poucos" enfase="cliques" depois="." className="titulo-secao mt-4" />
          <p className="mt-6 text-lg text-choco-700">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega à clínica pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
          <ul className="mt-8 space-y-3 text-choco-800">
            {['Sem cadastro e sem senha', 'Data e horário são preferências, sujeitas à agenda da clínica', 'Nada fica guardado neste site'].map((t) => (
              <li key={t} className="flex gap-3">
                <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-olive" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="rounded-[1.75rem] border border-choco-700/[0.12] bg-white p-6 shadow-lift sm:p-9">
            {CONFIG.agendamento.urgencia && (
              <div className="mb-7 flex flex-col gap-3 rounded-xl2 bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-choco-900">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
                <a href={waLink('Olá! Estou com dor/urgência e gostaria de atendimento.')} target="_blank" rel="noopener noreferrer" className="btn btn-primario shrink-0">
                  <IconeWhats /> Falar agora
                </a>
              </div>
            )}

            {estado === 'enviado' ? (
              <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="py-6 text-center outline-none">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-100 text-olive-700">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <p className="mx-auto mt-6 max-w-md font-serif text-2xl leading-snug text-choco-900">
                  Pronto! Abrimos o WhatsApp com sua solicitação.
                </p>
                <p className="mx-auto mt-3 max-w-md text-choco-700">É só enviar a mensagem. A equipe confirma a disponibilidade.</p>
                {bloqueado && (
                  <p className="mx-auto mt-4 max-w-md text-[0.95rem] text-choco-800">
                    Se o WhatsApp não abriu, seu navegador pode ter bloqueado a nova aba. Use o botão abaixo.
                  </p>
                )}
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                    <IconeWhats /> Abrir WhatsApp
                  </a>
                  <button type="button" onClick={recomecar} className="btn btn-contorno">
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby="ag-aviso">
                <div aria-live="polite" className="sr-only">
                  {Object.keys(erros).length ? `Há ${Object.keys(erros).length} campo(s) para corrigir.` : ''}
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="ag-nome" className="mb-2 block font-semibold text-choco-900">
                      Nome completo <span className="font-normal text-choco-700">(obrigatório)</span>
                    </label>
                    <input
                      ref={nomeRef}
                      id="ag-nome"
                      name="nome"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={80}
                      placeholder="Como devemos te chamar?"
                      className="campo"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value)
                        if (erros.nome) setErros((x) => ({ ...x, nome: undefined }))
                      }}
                      onBlur={() => nome && nome.trim().length < 2 && setErros((x) => ({ ...x, nome: 'Informe seu nome para a clínica saber com quem vai falar.' }))}
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={descr('nome')}
                    />
                    <Erro campo="nome" />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="ag-atendimento" className="mb-2 block font-semibold text-choco-900">
                      Atendimento desejado{' '}
                      <span className="font-normal text-choco-700">{exigir ? '(obrigatório)' : '(opcional)'}</span>
                    </label>
                    <select
                      id="ag-atendimento"
                      name="atendimento"
                      className="campo appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22%23624B36%22 stroke-width=%221.8%22><path d=%22m5 8 5 5 5-5%22/></svg>')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12"
                      value={atendimento}
                      required={exigir}
                      onChange={(e) => {
                        setAtendimento(e.target.value)
                        if (erros.atendimento) setErros((x) => ({ ...x, atendimento: undefined }))
                      }}
                      aria-invalid={Boolean(erros.atendimento)}
                      aria-describedby={descr('atendimento')}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Erro campo="atendimento" />
                  </div>

                  <div>
                    <label htmlFor="ag-data" className="mb-2 block font-semibold text-choco-900">
                      Data preferida <span className="font-normal text-choco-700">(opcional)</span>
                    </label>
                    <input
                      id="ag-data"
                      name="data"
                      type="date"
                      min={hoje || undefined}
                      className="campo"
                      value={data}
                      onChange={(e) => {
                        const v = e.target.value
                        setData(v)
                        setHora('')
                        setErros((x) => ({ ...x, data: validarData(v), hora: undefined }))
                      }}
                      aria-invalid={Boolean(erros.data)}
                      aria-describedby={descr('data', 'ag-data-dica')}
                    />
                    <p id="ag-data-dica" className="mt-2 text-[0.88rem] text-choco-700">
                      {dicaDias()}
                    </p>
                    <Erro campo="data" />
                  </div>

                  <div>
                    <label htmlFor="ag-hora" className="mb-2 block font-semibold text-choco-900">
                      Horário preferido <span className="font-normal text-choco-700">(opcional)</span>
                    </label>
                    <select
                      id="ag-hora"
                      name="hora"
                      className="campo appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22%23624B36%22 stroke-width=%221.8%22><path d=%22m5 8 5 5 5-5%22/></svg>')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12"
                      value={hora}
                      disabled={horarios.length === 0}
                      onChange={(e) => {
                        setHora(e.target.value)
                        if (erros.hora) setErros((x) => ({ ...x, hora: undefined }))
                      }}
                      aria-invalid={Boolean(erros.hora)}
                      aria-describedby={descr('hora', 'ag-hora-dica')}
                    >
                      <option value="">Escolha um horário</option>
                      {horarios.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <p id="ag-hora-dica" className="mt-2 text-[0.88rem] text-choco-700">
                      {data && !erroData ? 'Horários de início, em blocos de 1 hora.' : 'Escolha uma data para ver os horários.'}
                    </p>
                    <Erro campo="hora" />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="ag-obs" className="mb-2 block font-semibold text-choco-900">
                      Observações <span className="font-normal text-choco-700">(opcional)</span>
                    </label>
                    <textarea
                      id="ag-obs"
                      name="observacoes"
                      rows={3}
                      maxLength={LIMITE_OBS}
                      placeholder="Se quiser, conte o que você precisa."
                      className="campo resize-y"
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                      aria-describedby="ag-obs-dica ag-obs-cont"
                    />
                    <div className="mt-2 flex justify-between gap-4 text-[0.85rem] text-choco-700">
                      <p id="ag-obs-dica">Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                      <p id="ag-obs-cont" className="shrink-0 tabular-nums" aria-live="off">
                        {obs.length}/{LIMITE_OBS}
                      </p>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={estado === 'enviando'} className="btn btn-primario btn-brilho mt-8 w-full sm:w-auto disabled:opacity-70">
                  {estado === 'enviando' ? (
                    <>
                      <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" />
                      Abrindo o WhatsApp…
                    </>
                  ) : (
                    <>
                      <IconeWhats /> Enviar solicitação pelo WhatsApp
                    </>
                  )}
                </button>
                <p id="ag-aviso" className="mt-5 text-[0.88rem] leading-relaxed text-choco-700">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados. A data
                  e o horário escolhidos são preferências, sujeitas à agenda da clínica.{' '}
                  <a href="/privacidade.html" className="link-sublinhado font-medium text-choco-900">
                    Política de privacidade
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
