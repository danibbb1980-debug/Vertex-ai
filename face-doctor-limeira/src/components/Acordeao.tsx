import { useId, useState, type ReactNode } from 'react'

export interface ItemAcordeao {
  id: string
  cabeca: ReactNode
  corpo: ReactNode
}

/** Acordeão acessível: botão com aria-expanded, painel com role=region. */
export function Acordeao({
  itens,
  className = '',
  nivel = 3,
}: {
  itens: ItemAcordeao[]
  className?: string
  nivel?: 2 | 3 | 4
}) {
  const [abertos, setAbertos] = useState<Set<string>>(new Set())
  const base = useId()
  const H = `h${nivel}` as 'h3'
  const alternar = (id: string) =>
    setAbertos((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  return (
    <ul className={`acordeao ${className}`}>
      {itens.map((it) => {
        const aberto = abertos.has(it.id)
        const bid = `${base}-b-${it.id}`
        const pid = `${base}-p-${it.id}`
        return (
          <li className={`ac-item linha-viva${aberto ? ' is-aberto' : ''}`} key={it.id}>
            <H className="ac-h">
              <button
                type="button"
                className="ac-botao"
                id={bid}
                aria-expanded={aberto}
                aria-controls={pid}
                onClick={() => alternar(it.id)}
              >
                {it.cabeca}
                <span className="ac-sinal" aria-hidden="true" />
              </button>
            </H>
            <div className="ac-painel" id={pid} role="region" aria-labelledby={bid} hidden={!aberto}>
              <div className="ac-corpo">{it.corpo}</div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
