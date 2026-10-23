import { useRef, type ReactNode, type SVGProps } from 'react'
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { externo } from '../lib/links'

/* ---------- Ícones de traço fino ---------- */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }
function Icon({ size = 18, children, ...p }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...p}
    >
      {children}
    </svg>
  )
}

export const IconWhatsApp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 19.5l1.1-3.9A8 8 0 1 1 8.6 18.5z" />
    <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.6.3-1.6.4-3-.3a8 8 0 0 1-3.5-3.5c-.7-1.4-.6-2.4-.3-3z" />
  </Icon>
)
export const IconInstagram = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </Icon>
)
export const IconSeta = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
export const IconSetaDiagonal = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Icon>
)
export const IconPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Icon>
)
export const IconRelogio = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
)
export const IconMais = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const IconEstrela = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.8l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8z" />
  </Icon>
)

/* ---------- Marca ---------- */

/** Símbolo inspirado na logo real (contorno de dente). Substituir pelo vetor oficial quando disponível. */
export function Simbolo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path
        d="M50.5 24A20 20 0 1 0 47 45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity=".5"
      />
      <path
        d="M19 23.5c0-7 5.5-9.6 10.5-7 1.6.8 3.4.8 5 0 5-2.6 10.5 0 10.5 7 0 7.2-3 10.6-4 16.5-.8 4.8-1.8 10-4 10-2.4 0-2.6-7.8-5-7.8s-2.6 7.8-5 7.8c-2.2 0-3.2-5.2-4-10-1-5.9-4-9.3-4-16.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Assinatura temporária: símbolo + "Rocha" + descritor. */
export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${claro ? 'text-perola' : 'text-petroleo-700'}`}>
      <Simbolo className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.6rem] font-normal italic tracking-[-0.01em]">Rocha</span>
        <span
          className={`mt-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase ${claro ? 'text-petroleo-200' : 'text-cinza'}`}
        >
          Laboratório de Prótese Dentária
        </span>
      </span>
    </span>
  )
}

/* ---------- Botões ---------- */

type BotaoProps = {
  href: string
  children: ReactNode
  variante?: 'primario' | 'secundario' | 'claro' | 'contorno-claro'
  icone?: ReactNode
  externoLink?: boolean
  className?: string
  magnetico?: boolean
  ariaLabel?: string
}

const estilos: Record<NonNullable<BotaoProps['variante']>, string> = {
  primario: 'bg-petroleo-700 text-perola hover:bg-petroleo-800',
  secundario: 'border border-petroleo-700/35 text-petroleo-800 hover:border-petroleo-700 hover:bg-petroleo-700/[0.04]',
  claro: 'bg-perola text-petroleo-900 hover:bg-white',
  'contorno-claro': 'border border-perola/35 text-perola hover:border-perola hover:bg-perola/[0.06]',
}

/**
 * Botão-link com efeito magnético sutil (padrão "magnetic button",
 * implementado com motion). Desligado em telas de toque e com prefers-reduced-motion.
 */
export function Botao({
  href,
  children,
  variante = 'primario',
  icone,
  externoLink,
  className = '',
  magnetico = true,
  ariaLabel,
}: BotaoProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduzir = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })
  const ativo = magnetico && !reduzir

  function mover(e: React.PointerEvent) {
    if (!ativo || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28)
  }
  function sair() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      {...(externoLink ? externo : {})}
      onPointerMove={mover}
      onPointerLeave={sair}
      style={ativo ? { x: sx, y: sy } : undefined}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.9375rem] font-semibold tracking-[-0.005em] transition-[color,background-color,border-color,scale] duration-200 active:scale-[0.97] ${estilos[variante]} ${className}`}
    >
      {icone}
      <span className="whitespace-nowrap">{children}</span>
      {externoLink && <span className="sr-only">(abre em nova aba)</span>}
    </m.a>
  )
}

/** Link de texto com seta, para CTAs secundários. */
export function LinkSeta({
  href,
  children,
  externoLink,
  className = '',
}: {
  href: string
  children: ReactNode
  externoLink?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      {...(externoLink ? externo : {})}
      className={`group inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-current/25 underline-offset-[6px] transition-colors hover:decoration-current ${className}`}
    >
      {children}
      <IconSetaDiagonal size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      {externoLink && <span className="sr-only">(abre em nova aba)</span>}
    </a>
  )
}

/* ---------- Conteúdo pendente ---------- */

/** Placeholder visível para dados que o laboratório ainda precisa confirmar. */
export function Pendente({ children, claro = false }: { children?: ReactNode; claro?: boolean }) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 rounded-[3px] border border-dashed px-2 py-0.5 ${
        claro ? 'border-pessego/50 text-pessego-claro' : 'border-terracota/45 text-terracota'
      }`}
    >
      {children && <span>{children}</span>}
      <span className={`rotulo text-[0.6875rem] ${children ? 'tracking-[0.14em]' : ''}`}>a confirmar</span>
    </span>
  )
}

/* ---------- Cabeçalho de seção ---------- */

export function CabecalhoSecao({
  numero,
  rotulo,
  titulo,
  texto,
  id,
  claro = false,
  className = '',
}: {
  numero: string
  rotulo: string
  titulo: ReactNode
  texto?: ReactNode
  id: string
  claro?: boolean
  className?: string
}) {
  return (
    <header className={`max-w-3xl ${className}`}>
      <p className={`rotulo flex items-center gap-3 ${claro ? 'text-pessego' : 'text-petroleo-600'}`}>
        <span className="tabular-nums">{numero}</span>
        <span className={`h-px w-8 ${claro ? 'bg-pessego/50' : 'bg-petroleo-600/40'}`} aria-hidden="true" />
        <span>{rotulo}</span>
      </p>
      <h2
        id={id}
        className={`mt-5 text-[2.125rem] leading-[1.08] font-light sm:text-[2.75rem] lg:text-[3.25rem] ${
          claro ? 'text-perola' : 'text-petroleo-900'
        }`}
      >
        {titulo}
      </h2>
      {texto && (
        <p className={`mt-5 max-w-xl text-[1.0625rem] leading-relaxed ${claro ? 'text-petroleo-200' : 'text-cinza'}`}>
          {texto}
        </p>
      )}
    </header>
  )
}

/* ---------- Fotos ---------- */

/**
 * Foto real do laboratório em WebP. Fotos grandes (1080 px) recebem srcset.
 * Fotos pequenas (vindas do Google Maps) nunca são ampliadas além de ~1,6x:
 * aparecem "montadas" sobre um passe-partout, como uma prova fotográfica.
 */
export function Foto({
  nome,
  alt,
  tamanho,
  sizes = '(min-width: 1024px) 40vw, 90vw',
  prioridade = false,
  className = '',
  imgClassName = '',
}: {
  nome: string
  alt: string
  tamanho: [number, number]
  sizes?: string
  prioridade?: boolean
  className?: string
  imgClassName?: string
}) {
  const [w, h] = tamanho
  const grande = w >= 700
  return (
    <img
      src={grande ? `/fotos/${nome}-640.webp` : `/fotos/${nome}.webp`}
      srcSet={grande ? `/fotos/${nome}-640.webp 640w, /fotos/${nome}.webp ${w}w` : undefined}
      sizes={grande ? sizes : undefined}
      width={w}
      height={h}
      alt={alt}
      loading={prioridade ? 'eager' : 'lazy'}
      decoding={prioridade ? 'sync' : 'async'}
      fetchPriority={prioridade ? 'high' : undefined}
      className={`${imgClassName} ${className}`}
    />
  )
}

/** Moldura com passe-partout para fotos pequenas. */
export function FotoMontada({
  nome,
  alt,
  tamanho,
  legenda,
  className = '',
}: {
  nome: string
  alt: string
  tamanho: [number, number]
  legenda?: string
  className?: string
}) {
  const [w, h] = tamanho
  return (
    <figure className={`flex h-full flex-col items-center justify-center bg-marfim p-6 ${className}`}>
      {/* limita a ampliação a ~1,6x para não perder nitidez */}
      <div
        className="registro w-full bg-white p-2 shadow-[0_1px_0_rgb(0_0_0/0.04),0_12px_30px_-18px_rgb(15_51_53/0.35)]"
        style={{ maxWidth: Math.round(w * 1.6) + 16 }}
      >
        <Foto nome={nome} alt={alt} tamanho={[w, h]} className="block h-auto w-full" />
      </div>
      {legenda && <figcaption className="rotulo mt-4 text-center text-cinza">{legenda}</figcaption>}
    </figure>
  )
}

/** Bloco reservado para foto que ainda será enviada pelo laboratório. */
export function FotoReservada({ legenda = 'Foto do trabalho (substituir)', className = '' }: { legenda?: string; className?: string }) {
  return (
    <div
      className={`milimetrado relative flex h-full min-h-[140px] w-full flex-col items-center justify-center gap-4 bg-marfim text-petroleo-400 ${className}`}
      role="img"
      aria-label={legenda}
    >
      <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 4" />
        <path
          d="M38 46c0-11 9-15 17-11 3 1.3 7 1.3 10 0 8-4 17 0 17 11 0 11-5 16-6.5 25-1.3 7.5-2.8 15.5-6.3 15.5-3.7 0-4-12-7.7-12s-4 12-7.7 12c-3.5 0-5-8-6.3-15.5C43 62 38 57 38 46z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M14 60h12M94 60h12M60 14v12M60 94v12" stroke="currentColor" strokeWidth=".8" />
      </svg>
      <span className="rotulo text-cinza">{legenda}</span>
    </div>
  )
}
