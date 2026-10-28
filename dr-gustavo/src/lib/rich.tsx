import { Fragment, type ReactNode } from 'react'

/** Converte "*palavra*" em <em>palavra</em>. */
export function rich(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
  )
}
