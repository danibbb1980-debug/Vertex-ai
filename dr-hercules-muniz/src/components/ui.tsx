import type { CSSProperties, ReactNode, AnchorHTMLAttributes } from 'react'
import { CONFIG } from '../config'

/** Revelação suave ao entrar na viewport (CSS: opacity + transform; ver src/efeitos.ts). */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Comp = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}) {
  return (
    <Comp data-reveal="" className={className} style={delay ? ({ '--d': `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </Comp>
  )
}

/**
 * Título de seção: rótulo em caixa-alta + título em serifa com UMA palavra em ênfase.
 * Use *palavra* no texto para marcar a ênfase.
 */
export function Titulo({
  rotulo,
  texto,
  id,
  escuro = false,
  centro = false,
  nivel = 2,
}: {
  rotulo: string
  texto: string
  id?: string
  escuro?: boolean
  centro?: boolean
  nivel?: 2 | 3
}) {
  const H = nivel === 2 ? 'h2' : 'h3'
  return (
    <div className={centro ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`eyebrow flex items-center gap-3 ${centro ? 'justify-center' : ''} ${escuro ? 'text-gold-soft' : 'text-gold-deep'}`}>
        <span aria-hidden className={`h-px w-8 ${escuro ? 'bg-gold' : 'bg-gold-deep'}`} />
        {rotulo}
      </p>
      <H id={id} className={`mt-5 text-[2.15rem] sm:text-5xl ${escuro ? 'text-ivory' : 'text-text'}`}>
        <Enfase texto={texto} escuro={escuro} />
      </H>
    </div>
  )
}

export function Enfase({ texto, escuro = false }: { texto: string; escuro?: boolean }) {
  const partes = texto.split(/\*(.+?)\*/)
  return (
    <>
      {partes.map((p, i) =>
        i % 2 === 1 ? (
          <em key={i} className={`font-[350] ${escuro ? 'text-gold-soft' : 'text-gold-deep'}`}>
            {p}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

type BotaoProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: 'ouro' | 'escuro' | 'contorno-claro' | 'contorno-escuro'
  externo?: boolean
  children: ReactNode
}

/** Botão-link com efeito sutil: o filete dourado corre por baixo do texto no hover. */
export function Botao({ variante = 'ouro', externo, className = '', children, ...rest }: BotaoProps) {
  const estilos = {
    ouro: 'bg-gold text-ink hover:bg-gold-soft',
    escuro: 'bg-ink text-ivory hover:bg-ink-3',
    'contorno-claro': 'border border-gold/55 text-ivory hover:border-gold-soft hover:bg-ivory/[0.04]',
    'contorno-escuro': 'border border-text/25 text-text hover:border-gold-deep hover:bg-sand/60',
  }[variante]
  return (
    <a
      {...rest}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group relative inline-flex min-h-12 items-center justify-center gap-2.5 text-center [&_svg]:shrink-0 overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-semibold tracking-[0.01em] transition-[background-color,border-color,transform] duration-300 ease-out-soft active:scale-[0.98] ${estilos} ${className}`}
    >
      {children}
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}

/**
 * MOMENTO DE ASSINATURA: o anel dourado do medalhão que se desenha.
 * Aparece no hero (grande) e volta como moldura do botão de agendar.
 */
export function AnelDourado({
  className = '',
  espessura = 1,
  duracao = 2.2,
  atraso = 0,
  aneisInternos = true,
}: {
  className?: string
  espessura?: number
  duracao?: number
  atraso?: number
  aneisInternos?: boolean
}) {
  const estilo = { '--dur': `${duracao}s`, '--d': `${atraso}s` } as CSSProperties
  return (
    <svg data-reveal="anel" viewBox="0 0 200 200" className={`anel ${className}`} style={estilo} aria-hidden focusable="false" fill="none">
      <circle
        className="anel-traco"
        pathLength={1}
        cx="100"
        cy="100"
        r="98"
        stroke="var(--color-gold)"
        strokeWidth={espessura}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
      />
      {aneisInternos && (
        <>
          <circle
            className="anel-traco anel-traco-2"
            pathLength={1}
            cx="100"
            cy="100"
            r="90"
            stroke="var(--color-gold)"
            strokeOpacity=".35"
            strokeWidth={espessura * 0.6}
            transform="rotate(90 100 100)"
          />
          <circle className="anel-ponto" cx="100" cy="2" r="2.2" fill="var(--color-gold)" />
        </>
      )}
    </svg>
  )
}

/** Assinatura: logo (se houver arquivo em CONFIG.logo) ou composição tipográfica. */
export function Marca({ claro = true, compacta = false }: { claro?: boolean; compacta?: boolean }) {
  if (CONFIG.logo) {
    return (
      <img
        src={CONFIG.logo}
        alt={`${CONFIG.nome}, ${CONFIG.titulo.toLowerCase()}`}
        className={compacta ? 'h-11 w-auto' : 'h-14 w-auto'}
        width={56}
        height={56}
      />
    )
  }
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className={`relative grid size-10 shrink-0 place-items-center rounded-full border ${claro ? 'border-gold/70' : 'border-gold-deep/70'}`}
      >
        <span className={`absolute inset-[3px] rounded-full border ${claro ? 'border-gold/25' : 'border-gold-deep/25'}`} />
        <span className={`font-serif text-lg leading-none ${claro ? 'text-gold-soft' : 'text-gold-deep'}`}>H</span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-serif text-[1.15rem] font-[420] tracking-[-0.01em] ${claro ? 'text-ivory' : 'text-text'}`}>
          {CONFIG.nome}
        </span>
        {!compacta && (
          <span className={`text-[0.66rem] font-bold uppercase tracking-[0.2em] ${claro ? 'text-muted-dark' : 'text-muted'}`}>
            {CONFIG.titulo}
          </span>
        )}
      </span>
    </span>
  )
}
