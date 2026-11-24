import type { ElementType, ReactNode } from 'react'

/** Título revelado por linha, com máscara. Sem JS, aparece normalmente. */
export function Titulo({
  as: Tag = 'h2',
  linhas,
  className = '',
  id,
}: {
  as?: ElementType
  linhas: ReactNode[]
  className?: string
  id?: string
}) {
  return (
    <Tag className={`revela ${className}`} id={id} data-io>
      {linhas.map((l, i) => (
        <span className="revela-linha" key={i}>
          <span className="revela-in" style={{ ['--i' as string]: i }}>
            {l}
          </span>
        </span>
      ))}
    </Tag>
  )
}
