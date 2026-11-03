import type { ReactNode } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { IconeWhatsApp } from './Icones'

/** Revela o conteúdo ao entrar na tela (só opacity e transform). */
export function Revelar({
  children,
  atraso = 0,
  className,
  como = 'div',
}: {
  children: ReactNode
  atraso?: number
  className?: string
  como?: 'div' | 'li' | 'article'
}) {
  // Mesma marcação no servidor e no navegador (o HTML é pré-renderizado).
  // Com movimento reduzido, o conteúdo aparece na hora, sem animação.
  const reduzir = useReducedMotion()
  const Comp = m[como]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: '0px 0px -40px 0px' }}
      transition={reduzir ? { duration: 0 } : { duration: 0.55, delay: Math.min(atraso, 0.15), ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}

/** Cabeçalho de seção: rótulo + título com ênfase. */
export function TituloSecao({
  rotulo,
  children,
  id,
  descricao,
  claro = false,
  centro = false,
}: {
  rotulo: string
  children: ReactNode
  id: string
  descricao?: ReactNode
  claro?: boolean
  centro?: boolean
}) {
  return (
    <Revelar className={`max-w-2xl ${centro ? 'mx-auto text-center' : ''}`}>
      <p className={`rotulo flex items-center gap-3 ${centro ? 'justify-center' : ''} ${claro ? 'text-ouro' : 'text-ouro-escuro'}`}>
        <span aria-hidden className={`inline-block h-4 w-[3px] ${claro ? 'bg-ouro' : 'bg-ouro'}`} />
        {rotulo}
      </p>
      <h2 id={id} className={`mt-4 text-[2.15rem] sm:text-5xl ${claro ? 'text-creme' : 'text-vinho-900'}`}>
        {children}
      </h2>
      {descricao && (
        <p className={`mt-5 text-lg leading-relaxed ${claro ? 'text-ouro-claro' : 'text-pedra'}`}>{descricao}</p>
      )}
    </Revelar>
  )
}

type Variante = 'primario' | 'secundario' | 'claro' | 'contorno-claro'

const estilos: Record<Variante, string> = {
  primario: 'bg-vinho text-creme hover:bg-vinho-900 shadow-[0_10px_30px_-12px_rgba(74,29,34,.55)]',
  secundario: 'border border-vinho/30 text-vinho-900 hover:border-vinho hover:bg-vinho/[.04]',
  claro: 'bg-creme text-vinho-900 hover:bg-white',
  'contorno-claro': 'border border-ouro/60 text-creme hover:border-ouro hover:bg-white/5',
}

/** Botão-link com detalhe dourado que corre na base ao passar o mouse. */
export function BotaoLink({
  href,
  children,
  variante = 'primario',
  whatsapp = false,
  externo = false,
  className = '',
  ariaLabel,
}: {
  href: string
  children: ReactNode
  variante?: Variante
  whatsapp?: boolean
  externo?: boolean
  className?: string
  ariaLabel?: string
}) {
  const novaAba = externo || whatsapp
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(novaAba ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full px-6 py-3 text-[0.95rem] font-medium tracking-[0.01em] transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-suave)] active:scale-[.98] ${estilos[variante]} ${className}`}
    >
      {whatsapp && <IconeWhatsApp tamanho={18} className="shrink-0" />}
      <span className="relative">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-2 h-px origin-left scale-x-0 bg-ouro transition-transform duration-500 ease-[var(--ease-suave)] group-hover:scale-x-100"
      />
    </a>
  )
}

/** Imagem com webp + jpg e dimensões reservadas (evita CLS). */
export function Foto({
  src,
  alt,
  largura,
  altura,
  className = '',
  prioridade = false,
}: {
  src: string
  alt: string
  largura: number
  altura: number
  className?: string
  prioridade?: boolean
}) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.jpg`}
        alt={alt}
        width={largura}
        height={altura}
        loading={prioridade ? 'eager' : 'lazy'}
        decoding="async"
        {...(prioridade ? { fetchPriority: 'high' as const } : {})}
        className={className}
      />
    </picture>
  )
}
