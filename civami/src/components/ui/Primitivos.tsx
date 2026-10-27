import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { CONFIG } from '../../config'

/**
 * Botão com efeito magnético sutil (adaptado do padrão "Magnetic Button" do 21st.dev):
 * só transform, só com mouse, desligado com movimento reduzido.
 */
export function BotaoMagnetico({
  href,
  children,
  variante = 'primario',
  className = '',
  externo = false,
  ariaLabel,
}: {
  href: string
  children: ReactNode
  variante?: 'primario' | 'secundario' | 'claro' | 'contorno-claro'
  className?: string
  externo?: boolean
  ariaLabel?: string
}) {
  const mover = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  }
  const soltar = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = ''
  }

  const estilos = {
    primario: 'bg-tinta text-marfim hover:bg-azul',
    secundario: 'border border-tinta/25 text-tinta hover:border-tinta hover:bg-tinta/[0.04]',
    claro: 'bg-marfim text-tinta hover:bg-white',
    'contorno-claro': 'border border-marfim/35 text-marfim hover:border-marfim hover:bg-marfim/[0.06]',
  }[variante]

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onPointerMove={mover}
      onPointerLeave={soltar}
      className={`magnetico group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.95rem] font-semibold tracking-[0.01em] ${estilos} ${className}`}
    >
      {children}
    </a>
  )
}

/** Aparição suave ao entrar na tela (só opacity + transform, via CSS + um observer). */
export function Revelar({
  children,
  atraso = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  atraso?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  return (
    <Tag data-revelar="" className={className} style={atraso ? ({ '--atraso': `${Math.round(atraso * 1000)}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  )
}

/** Título de seção: eyebrow + H2 com uma palavra em itálico. */
export function TituloSecao({
  id,
  eyebrow,
  children,
  apoio,
  claro = false,
  className = '',
}: {
  id: string
  eyebrow: string
  children: ReactNode
  apoio?: ReactNode
  claro?: boolean
  className?: string
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Revelar>
        <p className={`eyebrow flex items-center gap-3 ${claro ? '!text-verde-claro' : ''}`}>
          <span aria-hidden className={`h-px w-8 ${claro ? 'bg-verde-claro/60' : 'bg-areia'}`} />
          {eyebrow}
        </p>
        <h2
          id={id}
          className={`mt-5 text-[2.35rem] sm:text-5xl lg:text-[3.6rem] ${claro ? '!text-marfim' : ''}`}
        >
          {children}
        </h2>
        {apoio && (
          <p className={`mt-6 max-w-2xl text-lg ${claro ? 'text-marfim/80' : 'text-suave'}`}>{apoio}</p>
        )}
      </Revelar>
    </div>
  )
}

/** Marca: o próprio símbolo do logo (sem redesenho) + nome em texto. */
export function Marca({ claro = false, tamanho = 44 }: { claro?: boolean; tamanho?: number }) {
  return (
    <span className="flex items-center gap-3">
      <span
        className={`grid shrink-0 place-items-center rounded-full ${claro ? 'bg-marfim' : ''}`}
        style={{ width: tamanho, height: tamanho }}
      >
        <img
          src="/brand/civami-simbolo.png"
          alt=""
          width={83}
          height={75}
          className="h-auto"
          style={{ width: claro ? tamanho * 0.74 : tamanho }}
        />
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-[1.35rem] font-medium tracking-[0.08em] ${claro ? 'text-marfim' : 'text-tinta'}`}
        >
          {CONFIG.nomeCurto}
        </span>{' '}
        <span
          className={`mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.26em] ${claro ? 'text-marfim/70' : 'text-suave'}`}
        >
          Clínica de Saúde
        </span>
      </span>
    </span>
  )
}

export const Placeholder = ({ children = '[A CONFIRMAR COM A CLÍNICA]' }: { children?: ReactNode }) => (
  // CONFIRMAR COM A CLÍNICA
  <span className="placeholder">{children}</span>
)
