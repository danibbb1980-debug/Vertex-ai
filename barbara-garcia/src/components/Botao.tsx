import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variante = 'mel' | 'oliva' | 'contorno' | 'contorno-claro' | 'texto'

const base =
  'group/botao relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-[0.98rem] font-semibold leading-tight tracking-[0.01em] transition-[transform,box-shadow,color,background-color] duration-300 ease-[var(--ease-mel)] active:scale-[0.98] select-none'

const variantes: Record<Variante, string> = {
  mel: 'bg-mel text-grafite shadow-[var(--shadow-mel)] hover:-translate-y-0.5',
  oliva: 'bg-oliva text-aveia hover:-translate-y-0.5 hover:shadow-[var(--shadow-macia)]',
  contorno: 'border-[1.5px] border-oliva/70 text-oliva hover:border-oliva bg-transparent',
  'contorno-claro': 'border-[1.5px] border-aveia/60 text-aveia hover:border-aveia bg-transparent',
  texto: 'px-2 text-oliva underline decoration-mel decoration-2 underline-offset-[6px] hover:decoration-oliva',
}

/** O preenchimento sobe como mel (só transform), sem mudar o tamanho do botão. */
const brilho: Record<Variante, string> = {
  mel: 'bg-mel-claro',
  oliva: 'bg-oliva-escuro',
  contorno: 'bg-areia',
  'contorno-claro': 'bg-aveia/10',
  texto: '',
}

export function Botao({
  variante = 'mel',
  children,
  className = '',
  externo,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variante?: Variante; externo?: boolean; children: ReactNode }) {
  const ext = externo ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a className={`${base} ${variantes[variante]} ${className}`} {...ext} {...rest}>
      {variante !== 'texto' && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-0 origin-bottom scale-y-0 rounded-[inherit] transition-transform duration-500 ease-[var(--ease-mel)] group-hover/botao:scale-y-100 ${brilho[variante]}`}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}
