import type { ReactNode } from 'react'
import { CONFIG, PENDENTE, pendente, telLink, waLink } from '../config'
import { Phone, WhatsApp } from './icons'

/** Marcador visível de informação pendente. */
export function Pendente({ label = PENDENTE }: { label?: string }) {
  return (
    <span className="pendente" title="Informação a confirmar com a clínica">
      {label}
    </span>
  )
}

/** Mostra o valor ou o marcador [A CONFIRMAR]. */
export function Val({ v }: { v: string }) {
  return pendente(v) ? <Pendente /> : <>{v}</>
}

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

/** Bloco reservado elegante, enquanto não houver foto real da clínica. */
export function PhotoSlot({ label = 'Foto da clínica (substituir)', className = '', dark }: { label?: string; className?: string; dark?: boolean }) {
  return (
    <div
      role="img"
      aria-label="Espaço reservado para foto da clínica"
      className={`relative overflow-hidden ${dark ? 'photo-slot-dark' : 'photo-slot'} ${className}`}
    >
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ps" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00a346" stopOpacity=".0" />
            <stop offset="1" stopColor="#00a346" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#ps)" />
      </svg>
      <div className={`absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${dark ? 'text-white/60' : 'text-forest/55'}`}>
        <span className={`h-px w-6 ${dark ? 'bg-white/40' : 'bg-forest/30'}`} />
        {label}
      </div>
    </div>
  )
}
