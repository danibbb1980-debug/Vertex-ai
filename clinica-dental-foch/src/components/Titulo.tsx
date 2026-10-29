import { Fragment, type ElementType, type ReactNode } from 'react'

/** Converte "texto *ênfase* texto" em nós com a palavra em ênfase. */
export function comEnfase(texto: string): ReactNode {
  return texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith('*') ? (
      <em key={i} className="enfase">
        {parte.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{parte}</Fragment>
    ),
  )
}

interface Props {
  rotulo?: string
  titulo: string
  intro?: ReactNode
  as?: ElementType
  id?: string
  centro?: boolean
  escuro?: boolean
  className?: string
}

export function Cabecalho({ rotulo, titulo, intro, as: Tag = 'h2', id, centro, escuro, className = '' }: Props) {
  return (
    <div className={`${centro ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {rotulo && (
        <p className={`rotulo reveal mb-4 flex items-center gap-3 ${centro ? 'justify-center' : ''} ${escuro ? 'text-aqua-300' : 'text-teal-700'}`}>
          <OndaMini />
          {rotulo}
        </p>
      )}
      <Tag id={id} className={`reveal text-[2.1rem] sm:text-5xl ${escuro ? 'text-white' : ''}`} style={{ '--d': '80ms' } as React.CSSProperties}>
        {comEnfase(titulo)}
      </Tag>
      {intro && (
        <div className={`reveal mt-5 text-lg ${escuro ? 'text-aqua-100/90' : 'text-ink-soft'}`} style={{ '--d': '160ms' } as React.CSSProperties}>
          {intro}
        </div>
      )}
    </div>
  )
}

export function OndaMini({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 8" width="28" height="8" className={className}>
      <path d="M1 5 Q4.5 1 8 4 T15 4 T22 4 T27 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
