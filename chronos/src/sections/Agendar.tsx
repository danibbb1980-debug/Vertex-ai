import { useMemo, useRef, useState, type FormEvent } from 'react'
import { CONFIG, servicosAtivos, waLink, type Dia } from '../config'
import { Arrow, Lines, SectionNum } from '../ui'

const A_DEFINIR = 'Ainda não sei, quero conversar'

// Data de hoje em Poços de Caldas, no formato do input (aaaa-mm-dd)
const hojeISO = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.fusoHorario, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  return parts
}

const diaDaSemana = (iso: string): Dia => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as Dia
}

// Blocos de 1 hora, sem o último: sobra ao menos 1 hora antes de fechar
export const horariosDoDia = (iso: string): string[] => {
  if (!iso) return []
  const h = CONFIG.horarios[diaDaSemana(iso)]
  if (!h) return []
  const out: string[] = []
  for (let x = h.abre; x <= h.fecha - 1; x++) out.push(`${String(x).padStart(2, '0')}:00`)
  return out
}

const brData = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

type Errors = Partial<Record<'nome' | 'veiculo' | 'data' | 'hora', string>>

export default function Agendar() {
  const servicos = servicosAtivos()
  const [nome, setNome] = useState('')
  const [servico, setServico] = useState(servicos.length === 1 ? servicos[0].nome : '')
  const [veiculo, setVeiculo] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [obs, setObs] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [url, setUrl] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const [min, setMin] = useState('')

  const slots = useMemo(() => horariosDoDia(data), [data])
  const domingo = !!data && CONFIG.horarios[diaDaSemana(data)] === null

  const validate = (): Errors => {
    const e: Errors = {}
    if (nome.trim().length < 2) e.nome = 'Escreva o seu nome para a Chronos saber com quem fala.'
    if (veiculo.trim().length < 2) e.veiculo = 'Conte qual é o veículo, por exemplo: Onix 2020.'
    if (data) {
      if (data < hojeISO()) e.data = 'Essa data já passou. Escolha outra.'
      else if (domingo) e.data = 'Dia sem atendimento, escolha outra data.'
    }
    if (hora && data && !slots.includes(hora)) e.hora = 'Escolha um horário da lista para esse dia.'
    return e
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const ordem: [keyof Errors, string][] = [['nome', 'f-nome'], ['veiculo', 'f-veic'], ['data', 'f-data'], ['hora', 'f-hora']]
    const primeiro = ordem.find(([k]) => e[k])
    if (primeiro) {
      document.getElementById(primeiro[1])?.focus()
      return
    }
    setStatus('sending')
    const msg = [
      'Olá! Vim pelo site da Chronos Estética Automotiva e gostaria de pedir um horário.',
      `Nome: ${nome.trim()}`,
      `Serviço: ${servico && servico !== A_DEFINIR ? servico : 'a definir'}`,
      `Veículo: ${veiculo.trim()}`,
      `Data preferida: ${data ? brData(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`
    ].join('\n')
    const link = waLink(msg)
    setUrl(link)
    // Com noopener o retorno é sempre null; por isso o cartão sempre mostra o link "Abrir WhatsApp"
    window.open(link, '_blank', 'noopener')
    setStatus('sent')
  }

  const field = (k: keyof Errors) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `err-${k}` : undefined
  })

  return (
    <section className='sec sec--page agendar' id='agendar' aria-labelledby='ag-t' data-reveal>
      <div className='wrap grid12'>
        <div className='ag-text'>
          <SectionNum n='08' label='Praticidade' />
          <Lines id='ag-t' className='t-2xl' lines={['Peça seu horário', <>em poucos <span className='accent'>cliques</span>.</>]} />
          <p className='ag-lead'>
            Escolha o serviço, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a confirmação da disponibilidade é feita por lá.
          </p>
        </div>

        <div className='ag-card'>
          <svg className='ag-trace' viewBox='0 0 200 60' aria-hidden='true' focusable='false'>
            <path d='M0 50 H120 L160 10 H200' />
            <circle cx='160' cy='10' r='4' />
          </svg>

          {status === 'sent' ? (
            <div className='ag-done' role='status' aria-live='polite'>
              <p className='ag-done-t'>Pronto! Abrimos o WhatsApp com sua solicitação.</p>
              <p>É só enviar a mensagem. A confirmação da disponibilidade é feita pelo WhatsApp.</p>
              <p className='ag-fallback'>
                Se a conversa não abriu,{' '}
                <a href={url} target='_blank' rel='noopener noreferrer' className='ulink'>
                  Abrir WhatsApp
                </a>
                .
              </p>
              <button type='button' className='btn btn--ghost' onClick={() => setStatus('idle')}>
                Editar a solicitação
              </button>
            </div>
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} onFocus={() => !min && setMin(hojeISO())} aria-describedby='ag-privacy'>
              <div className='fld'>
                <label htmlFor='f-nome'>Nome completo</label>
                <input id='f-nome' name='nome' autoComplete='name' required placeholder='Como devemos te chamar?' value={nome} onChange={e => setNome(e.target.value)} {...field('nome')} />
                {errors.nome && <p className='fld-err' id='err-nome'>{errors.nome}</p>}
              </div>

              <div className='fld'>
                <label htmlFor='f-serv'>Serviço desejado</label>
                <select id='f-serv' name='servico' value={servico} onChange={e => setServico(e.target.value)}>
                  {servicos.map(s => (
                    <option key={s.id} value={s.nome}>
                      {s.nome}
                    </option>
                  ))}
                  <option value={A_DEFINIR}>{A_DEFINIR}</option>
                </select>
              </div>

              <div className='fld'>
                <label htmlFor='f-veic'>Veículo</label>
                <input id='f-veic' name='veiculo' required maxLength={60} placeholder='Marca, modelo e ano, por exemplo: Onix 2020' value={veiculo} onChange={e => setVeiculo(e.target.value)} {...field('veiculo')} />
                {errors.veiculo && <p className='fld-err' id='err-veiculo'>{errors.veiculo}</p>}
              </div>

              <div className='fld-2'>
                <div className='fld'>
                  <label htmlFor='f-data'>
                    Data preferida <span className='opt'>opcional</span>
                  </label>
                  <input
                    id='f-data'
                    name='data'
                    type='date'
                    min={min || undefined}
                    value={data}
                    onChange={e => {
                      setData(e.target.value)
                      setHora('')
                      setErrors(x => ({ ...x, data: undefined, hora: undefined }))
                    }}
                    {...field('data')}
                    aria-describedby={errors.data ? 'err-data' : domingo ? 'hint-data' : 'hint-data-base'}
                  />
                  {errors.data ? (
                    <p className='fld-err' id='err-data'>{errors.data}</p>
                  ) : domingo ? (
                    <p className='fld-err' id='hint-data'>Dia sem atendimento, escolha outra data.</p>
                  ) : (
                    <p className='fld-hint' id='hint-data-base'>Segunda a sábado. Domingo, fechado.</p>
                  )}
                </div>

                <div className='fld'>
                  <label htmlFor='f-hora'>
                    Horário preferido <span className='opt'>opcional</span>
                  </label>
                  <select id='f-hora' name='hora' value={hora} onChange={e => setHora(e.target.value)} disabled={!data || domingo} {...field('hora')}>
                    <option value=''>Escolha um horário</option>
                    {slots.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.hora ? <p className='fld-err' id='err-hora'>{errors.hora}</p> : <p className='fld-hint'>{data ? 'Preferência, sujeita à confirmação.' : 'Escolha a data primeiro.'}</p>}
                </div>
              </div>

              <div className='fld'>
                <label htmlFor='f-obs'>
                  Observações <span className='opt'>opcional</span>
                </label>
                <textarea id='f-obs' name='obs' rows={3} maxLength={300} placeholder='Se quiser, conte o que o seu veículo precisa.' value={obs} onChange={e => setObs(e.target.value)} aria-describedby='obs-count' />
                <p className='fld-hint tnum' id='obs-count'>
                  {obs.length}/300
                </p>
              </div>

              <div className='sr-only' aria-live='polite'>
                {Object.keys(errors).filter(k => errors[k as keyof Errors]).length ? 'Há campos para revisar no formulário.' : ''}
              </div>

              <button type='submit' className='btn btn--primary btn--block' disabled={status === 'sending'} aria-busy={status === 'sending'}>
                <span>{status === 'sending' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}</span>
                <Arrow />
              </button>
              <p className='ag-privacy' id='ag-privacy'>
                Ao enviar, você abre uma conversa no WhatsApp com a Chronos Estética Automotiva. Este site não guarda os dados digitados.{' '}
                <a href='/privacidade.html' className='ulink'>
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
