import { useEffect, useRef, type ReactNode } from 'react'
import { CONFIG, waLink } from '../config'

/** A pequena onda da marca, usada no lugar de ícones prontos. */
export function Onda({ className = 'onda' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 10" aria-hidden="true" fill="none">
      <path
        d="M1 7.5C3.5 2 6.5 1.5 9 5s5.5 4 7.5 1.5S19.8 3 21 3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BotaoWhats({
  texto = 'Marcar horário',
  mensagem,
  variante = 'argila',
  className = '',
  rotuloAcessivel,
}: {
  texto?: string
  mensagem?: string
  variante?: 'argila' | 'linha'
  className?: string
  rotuloAcessivel?: string
}) {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null
  return (
    <a
      href={waLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variante} ${className}`}
      aria-label={rotuloAcessivel ? `${rotuloAcessivel} (abre o WhatsApp em nova aba)` : `${texto} pelo WhatsApp (abre em nova aba)`}
    >
      {texto}
      <Onda />
    </a>
  )
}

export function BotaoInstagram({ className = '' }: { className?: string }) {
  if (!CONFIG.instagram.url) return null
  return (
    <a
      href={CONFIG.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-linha ${className}`}
      aria-label="Ver no Instagram (abre em nova aba)"
    >
      Ver no Instagram
    </a>
  )
}

export function Logo({ escuro = false, className = '' }: { escuro?: boolean; className?: string }) {
  const l = CONFIG.logo
  return (
    <img
      src={escuro ? l.escuro : l.claro}
      width={l.largura}
      height={l.altura}
      alt={CONFIG.nome}
      className={className}
      decoding="async"
    />
  )
}

/** Acende a numeração quando entra na tela. */
export function Acende({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('aceso')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <span ref={ref} className={`acende num ${className}`} aria-hidden="true">
      {children}
    </span>
  )
}

/** Divide o texto em palavras com revelação; *palavra* vira itálico. */
export function Revela({ texto, atraso = 0 }: { texto: string; atraso?: number }) {
  const partes = texto.split(' ')
  return (
    <>
      {partes.map((p, i) => {
        const enfase = p.startsWith('*')
        const limpo = p.replace(/\*/g, '')
        const m = limpo.match(/^(.*?)([.,;:!?]*)$/)
        const palavra = m ? m[1] : limpo
        const pont = m ? m[2] : ''
        const estilo = { animationDelay: `${atraso + i * 70}ms` }
        return (
          <span key={i}>
            <span className="revela">
              <span style={estilo}>
                {enfase ? <em>{palavra}</em> : palavra}
                {pont}
              </span>
            </span>
            {i < partes.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </>
  )
}
