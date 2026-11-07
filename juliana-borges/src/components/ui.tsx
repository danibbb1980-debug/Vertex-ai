import React, { type ReactNode, type CSSProperties, useId } from 'react'
import { useAoAparecer } from '../lib/movimento'
import logoCompleto from '../assets/brand/logo-juliana-borges.svg?raw'
import logoNome from '../assets/brand/logo-juliana-borges-nome.svg?raw'
import monograma from '../assets/brand/monograma.svg?raw'
import { linkWhatsApp } from '../lib/utils'

const svgs = { completo: logoCompleto, nome: logoNome, monograma }

/** Logo vetorial (reprodução do logo existente). Usa a cor do texto (currentColor). */
export function Logo({
  variante = 'nome',
  className = '',
  decorativo = false,
}: {
  variante?: keyof typeof svgs
  className?: string
  decorativo?: boolean
}) {
  let svg = svgs[variante]
  // ids únicos por instância (máscara do logo)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  svg = svg.replace(/id="m"/g, `id="m-${uid}"`).replace(/url\(#m\)/g, `url(#m-${uid})`)
  svg = svg.replace(/id="t"/g, `id="t-${uid}"`).replace(/aria-labelledby="t"/g, `aria-labelledby="t-${uid}"`)
  if (decorativo) svg = svg.replace(/role="img"[^>]*?>/, 'aria-hidden="true" focusable="false">')
  return <span className={`block [&>svg]:h-full [&>svg]:w-auto ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />
}

export function IconeWhatsApp({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

export function IconeInstagram({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconeMapa({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

export function IconeRelogio({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function Seta({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`seta ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  )
}

export function BotaoWhatsApp({
  mensagem,
  children = 'Agendar pelo WhatsApp',
  variante = 'primario',
  className = '',
  rotuloAcessivel,
}: {
  mensagem?: string
  children?: ReactNode
  variante?: 'primario' | 'secundario'
  className?: string
  rotuloAcessivel?: string
}) {
  const href = linkWhatsApp(mensagem)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variante} ${className}`}
      aria-label={rotuloAcessivel ? `${rotuloAcessivel} (abre o WhatsApp em nova aba)` : undefined}
    >
      <IconeWhatsApp className="size-[1.15rem] shrink-0" />
      <span>{children}</span>
    </a>
  )
}

const larguras: Record<string, number[]> = {
  juliana: [400, 600, 800],
  default: [400, 560, 739],
}
const dimensoes: Record<string, [number, number]> = {
  juliana: [800, 843],
  default: [739, 982],
}

export function Foto({
  src,
  alt,
  sizes,
  className = '',
  imgClassName = '',
  prioridade = false,
  style,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  imgClassName?: string
  prioridade?: boolean
  style?: CSSProperties
}) {
  if (!src) return null
  const ws = larguras[src] ?? larguras.default
  const [w, h] = dimensoes[src] ?? dimensoes.default
  const set = (ext: string) => ws.map((x) => `/img/${src}-${x}.${ext} ${x}w`).join(', ')
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/img/${src}-${ws[ws.length - 1]}.webp`}
        alt={alt}
        width={w}
        height={h}
        loading={prioridade ? 'eager' : 'lazy'}
        decoding={prioridade ? 'sync' : 'async'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        className={imgClassName}
      />
    </picture>
  )
}

/** Entrada suave ao aparecer na tela (só opacity + transform). */
export function Revelar({
  children,
  atraso = 0,
  className = '',
  como = 'div',
}: {
  children: ReactNode
  atraso?: number
  className?: string
  como?: 'div' | 'li' | 'article'
}) {
  const [ref, visivel] = useAoAparecer<HTMLElement>()
  const Tag = como as 'div'
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`revelar ${className}`}
      data-visivel={visivel || undefined}
      style={atraso ? { transitionDelay: `${atraso}s` } : undefined}
    >
      {children}
    </Tag>
  )
}

export function CabecalhoSecao({
  rotulo,
  titulo,
  id,
  children,
  centro = false,
}: {
  rotulo: string
  titulo: ReactNode
  id: string
  children?: ReactNode
  centro?: boolean
}) {
  return (
    <Revelar className={`max-w-2xl ${centro ? 'mx-auto text-center' : ''}`}>
      <p className="rotulo mb-5 flex items-center gap-3" style={centro ? { justifyContent: 'center' } : undefined}>
        <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
        {rotulo}
      </p>
      <h2 id={id} className="titulo-secao">
        {titulo}
      </h2>
      {children && <div className="mt-6 text-[1.075rem] leading-relaxed text-choco/85">{children}</div>}
    </Revelar>
  )
}
