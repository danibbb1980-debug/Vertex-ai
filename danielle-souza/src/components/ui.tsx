import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CONFIG, waLink } from '../config'

export function Logo({ tom = 'claro', className = '' }: { tom?: 'claro' | 'escuro'; className?: string }) {
  const l = CONFIG.logo
  const src = tom === 'claro' ? l.claro : l.escuro
  return (
    <img
      src={src}
      width={l.largura}
      height={l.altura}
      alt={`${CONFIG.nome} | ${CONFIG.descritor}`}
      className={`h-auto select-none ${className}`}
      draggable={false}
      decoding="async"
    />
  )
}

type BotaoProps = {
  children: ReactNode
  mensagem?: string
  variante?: 'cheio' | 'linha'
  className?: string
  rotuloAcessivel?: string
}

/** Todo botão de agendamento: WhatsApp em nova aba, sem opener. */
export function BotaoWa({ children, mensagem, variante = 'cheio', className = '', rotuloAcessivel }: BotaoProps) {
  if (!CONFIG.usarWhatsapp) return null
  return (
    <a
      href={waLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`botao botao-${variante} ${className}`}
      aria-label={rotuloAcessivel}
    >
      {children}
      <span className="seta" aria-hidden="true" />
    </a>
  )
}

export function BotaoLink({
  href,
  children,
  variante = 'linha',
  externo = false,
  className = '',
}: {
  href: string
  children: ReactNode
  variante?: 'cheio' | 'linha'
  externo?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      className={`botao botao-${variante} ${className}`}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}

/** true quando o elemento entra na viewport (uma vez). */
export function useEmVista<T extends Element>(margem = '0px 0px -15% 0px') {
  const ref = useRef<T>(null)
  const [visto, setVisto] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || visto) return
    if (!('IntersectionObserver' in window)) {
      setVisto(true)
      return
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setVisto(true)
          io.disconnect()
        }
      },
      { rootMargin: margem },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [margem, visto])
  return [ref, visto] as const
}

export function useMenosMovimento() {
  const [reduz, setReduz] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setReduz(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return reduz
}

/** Título com uma palavra em ênfase: "Cada rosto pede uma avaliação *individual*." */
export function Enfase({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*]+\*)/g)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className="font-light">
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

/** true só depois da hidratação (componentes que existem apenas no cliente). */
export function useMontado() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}
