import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

/** Converte "texto com *ênfase*" em JSX: a palavra entre asteriscos ganha cor de ouro e um traço fino. */
export function Titulo({ texto, desenharTraco = true }: { texto: string; desenharTraco?: boolean }) {
  const partes = texto.split(/(\*[^*]+\*)/g)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className="enfase">
            {p.slice(1, -1)}
            {desenharTraco && <Sublinhado />}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

/** traço fino sob a palavra em ênfase, com a curvatura do monograma */
function Sublinhado() {
  return (
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path
        d="M2 14C40 8 90 6 130 9C160 11 182 13 198 8"
        fill="none"
        stroke="#B48E57"
        strokeWidth="1.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** rótulo de seção ligado ao fio por um nó que se preenche quando a seção está em foco */
export function Marca({ children, id, claro }: { children: ReactNode; id?: string; claro?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const ativo = useEmFoco(ref)
  return (
    <p ref={ref} id={id} className={`rotulo relative flex items-center ${claro ? 'text-champagne' : 'text-ouro-texto'}`}>
      <span className="no top-1/2 -translate-y-1/2" data-ativo={ativo} aria-hidden="true" />
      {children}
    </p>
  )
}

/** true quando o elemento passa pela faixa central da tela (e continua true depois) */
export function useEmFoco(ref: RefObject<Element | null>, margem = '0px 0px -40% 0px') {
  const [ativo, setAtivo] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || ativo) return
    if (typeof IntersectionObserver === 'undefined') {
      setAtivo(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAtivo(true)
          io.disconnect()
        }
      },
      { rootMargin: margem },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margem, ativo])
  return ativo
}

export function IconeWhatsapp({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M4.2 19.8l1.1-3.6A8.2 8.2 0 1 1 8 19z" />
      <path d="M9.2 8.4c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1.1 1.5 2 2.6 2.6.2.1.4.1.5 0l.6-.6c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.6.8-.6.3-1.6.4-3-.2a8.6 8.6 0 0 1-4.5-4.5c-.5-1.3-.4-2.3-.1-2.8z" />
    </svg>
  )
}

export function IconeInstagram({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r=".4" fill="currentColor" />
    </svg>
  )
}

export function IconeMapa({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  )
}

/** link externo (abre em nova aba) */
export function LinkExterno({ href, className, children, rotuloAcessivel }: { href: string; className?: string; children: ReactNode; rotuloAcessivel?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={rotuloAcessivel}>
      {children}
    </a>
  )
}

/** "Espaço / Saúde e Mulher" no desenho do logo */
export function Assinatura({ claro = false, compacta = false }: { claro?: boolean; compacta?: boolean }) {
  return (
    <span className={`flex flex-col leading-none ${claro ? 'text-creme' : 'text-bronze'}`}>
      <span className={`font-sans font-medium uppercase ${compacta ? 'text-[0.55rem] tracking-[0.42em]' : 'text-[0.62rem] tracking-[0.46em]'} ${claro ? 'text-champagne' : 'text-taupe'}`}>
        Espaço
      </span>
      <span className={`font-display uppercase tracking-[0.09em] ${compacta ? 'mt-1 text-[0.95rem]' : 'mt-1.5 text-[1.1rem]'}`}>
        Saúde e Mulher
      </span>
    </span>
  )
}
