import type { CSSProperties, ReactNode } from 'react'

type TagTitulo = 'h1' | 'h2' | 'h3'

/** Título revelado por linha, com máscara (mecanismo recorrente A). */
export function Titulo({
  linhas,
  as: Tag = 'h2',
  className = '',
  id,
}: {
  linhas: ReactNode[]
  as?: TagTitulo
  className?: string
  id?: string
}) {
  return (
    <Tag className={`titulo ${className}`} id={id} data-reveal="">
      {linhas.map((l, i) => (
        <span className="tl" key={i}>
          <span className="tl-i" style={{ '--i': i } as CSSProperties}>
            {l}
            {i < linhas.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/** Rótulo da seção com número que ganha peso ao entrar na tela (mecanismo C). */
export function Rotulo({ n, children, escuro }: { n?: number; children: ReactNode; escuro?: boolean }) {
  return (
    <p className={`rotulo${escuro ? ' rotulo--escuro' : ''}`}>
      {n !== undefined && (
        <span className="num-secao" data-reveal="" aria-hidden="true">
          {String(n).padStart(2, '0')}
        </span>
      )}
      <span>{children}</span>
    </p>
  )
}

/** Link externo de ação (WhatsApp, mapa, Instagram). */
export function Acao({
  href,
  children,
  variante = 'tinta',
  className = '',
  rotuloAcessivel,
}: {
  href: string
  children: ReactNode
  variante?: 'tinta' | 'papel' | 'contorno' | 'contorno-escuro' | 'texto' | 'texto-escuro'
  className?: string
  rotuloAcessivel?: string
}) {
  const externo = /^https?:/.test(href)
  return (
    <a
      className={`btn btn--${variante} ${className}`}
      href={href}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={rotuloAcessivel}
    >
      <span className="btn-txt">{children}</span>
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}
