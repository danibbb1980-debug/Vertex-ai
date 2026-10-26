import { Fragment, type CSSProperties } from 'react'

/**
 * Adaptado de "Text Reveal" (21st.dev · @kuratlielia).
 * Mudanças: palavras entre *asteriscos* viram <em> (itálico em cobalto),
 * estilos em index.css, stagger curto e um único uso na página (hero).
 */
type Props = {
  text: string
  as?: 'h1' | 'h2' | 'p'
  className?: string
  id?: string
  delay?: number
}

const STAGGER = 0.06
const MAX_TOTAL = 0.6

export function TextReveal({ text, as: Tag = 'h1', className, id, delay = 0 }: Props) {
  const words = text.split(' ').filter(Boolean)
  const step = Math.min(STAGGER, MAX_TOTAL / Math.max(words.length, 1))
  const plain = text.replace(/\*/g, '')

  return (
    <Tag
      id={id}
      className={['reveal', className].filter(Boolean).join(' ')}
      style={{ '--reveal-blur': '10px' } as CSSProperties}
    >
      <span className="sr-only">{plain}</span>
      <span className="line" aria-hidden="true">
        {words.map((raw, i) => {
          const italic = /^\*.*\*[.,]?$/.test(raw)
          const word = raw.replace(/\*/g, '')
          const style = { '--reveal-delay': `${delay + i * step}s` } as CSSProperties
          return (
            <Fragment key={`${word}-${i}`}>
              <span className="clip">
                {italic ? (
                  <em className="word" style={style}>
                    {word}
                  </em>
                ) : (
                  <span className="word" style={style}>
                    {word}
                  </span>
                )}
              </span>
              {i < words.length - 1 ? ' ' : null}
            </Fragment>
          )
        })}
      </span>
    </Tag>
  )
}
