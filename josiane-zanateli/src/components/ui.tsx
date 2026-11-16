import type { ReactNode } from 'react'
import { CONFIG, linkWhatsApp } from '../config'

/** Botão de agendamento: sempre abre o WhatsApp em nova aba. */
export function BotaoWhats({
  children = 'Agendar horário',
  mensagem,
  variante = 'primario',
  className = '',
  rotuloAcessivel,
}: {
  children?: ReactNode
  mensagem?: string
  variante?: 'primario' | 'claro' | 'secundario' | 'contorno-claro'
  className?: string
  rotuloAcessivel?: string
}) {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variante} ${className}`}
      aria-label={rotuloAcessivel ? `${rotuloAcessivel} (abre o WhatsApp em nova aba)` : undefined}
    >
      <span>{children}</span>
      <span className="seta" aria-hidden="true" />
    </a>
  )
}

export function BotaoInstagram({ variante = 'secundario', className = '' }: { variante?: 'secundario' | 'contorno-claro'; className?: string }) {
  if (!CONFIG.instagram.url) return null
  return (
    <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className={`btn btn-${variante} ${className}`}>
      <span>Ver no Instagram</span>
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}

/** Título com UMA palavra em ênfase: use *palavra* no texto. */
export function Enfase({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*]+\*)/)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('*') ? (
          <em key={i} className="font-display italic">
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

/** Monograma JZ com contorno fino. */
export function Monograma({ className = '', cor = 'currentColor' }: { className?: string; cor?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden="true" focusable="false">
      <path
        d="M24 2.5C36 2.5 45.5 13 45.5 28.5S36 53.5 24 53.5 2.5 43.5 2.5 28.5 12 2.5 24 2.5Z"
        fill="none"
        stroke={cor}
        strokeWidth="1"
      />
      <text
        x="24"
        y="34.5"
        textAnchor="middle"
        fontFamily="Besley, Georgia, serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="19"
        letterSpacing="-0.5"
        fill={cor}
      >
        JZ
      </text>
    </svg>
  )
}

/** Assinatura tipográfica provisória (substituída por CONFIG.logo quando existir). */
export function Assinatura({ claro = false, compacta = false }: { claro?: boolean; compacta?: boolean }) {
  if (CONFIG.logo) {
    return <img src={CONFIG.logo} alt={`${CONFIG.nome} | ${CONFIG.descritor}`} className="h-12 w-auto" />
  }
  return (
    <span className="flex items-center gap-3">
      <Monograma className={compacta ? 'h-10 w-auto shrink-0' : 'h-12 w-auto shrink-0'} />
      <span className="flex flex-col leading-none">
        <span className={`font-display ${compacta ? 'text-[1.3rem]' : 'text-[1.55rem]'} tracking-[-0.02em]`}>{CONFIG.nome}</span>
        <span className={`rotulo mt-1.5 !text-[0.625rem] !tracking-[0.24em] ${claro ? 'text-areia-suave' : 'text-grafite-2'}`}>
          {CONFIG.descritor} · {CONFIG.cidade}
        </span>
      </span>
    </span>
  )
}
