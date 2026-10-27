import type { ReactNode } from 'react'
import { CONFIG, telLink, waLink } from '../config'
import { Phone, WhatsApp } from './icons'

type BtnProps = { mensagem?: string; children?: ReactNode; className?: string; small?: boolean }

export function WaButton({ mensagem, children = 'Chamar no WhatsApp', className = '', small }: BtnProps) {
  return (
    <a
      href={waLink(mensagem)}
      target="_blank"
      rel="noopener"
      className={`btn btn-urgent ${small ? '!min-h-12 !px-4 !text-[0.95rem]' : ''} ${className}`}
    >
      <WhatsApp size={small ? 18 : 20} />
      <span>{children}</span>
      <span className="sr-only"> (abre o WhatsApp)</span>
    </a>
  )
}

export function CallButton({ children = 'Ligar agora', className = 'btn-line', small }: Omit<BtnProps, 'mensagem'>) {
  return (
    <a href={telLink} className={`btn ${className} ${small ? '!min-h-12 !px-4 !text-[0.95rem]' : ''}`}>
      <Phone size={small ? 18 : 20} />
      <span>{children}</span>
      <span className="sr-only"> para {CONFIG.telefoneExibicao}</span>
    </a>
  )
}

export function SectionHead({
  id,
  eyebrow,
  title,
  intro,
  dark,
  align = 'left',
}: {
  id: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  dark?: boolean
  align?: 'left' | 'center'
}) {
  return (
    <header className={`reveal max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className={`mt-4 text-[2.15rem] sm:text-5xl lg:text-[3.4rem] ${dark ? '!text-paper' : ''}`}>
        {title}
      </h2>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-white/75' : 'text-muted'} max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {intro}
        </p>
      )}
    </header>
  )
}

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <img
      src="/logo.webp"
      width={size}
      height={size}
      alt=""
      className="rounded-[22%] flex-none"
      decoding="async"
    />
  )
}
