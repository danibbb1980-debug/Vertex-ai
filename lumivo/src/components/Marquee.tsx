import { useRef } from 'react'
import { useEmTela } from '../motion/useEmTela'

export function Marquee({ itens }: { itens: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const ativo = useEmTela(ref)
  return (
    <div ref={ref} className={`marquee ${ativo ? 'marquee--ativo' : ''}`}>
      <ul className="marquee__trilho" aria-label="Tecnologias usadas">
        {itens.map((t) => (
          <li key={t}>{t}</li>
        ))}
        {itens.map((t) => (
          <li key={`${t}-copia`} aria-hidden="true">
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
