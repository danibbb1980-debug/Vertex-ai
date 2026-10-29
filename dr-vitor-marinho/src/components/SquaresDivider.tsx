import type { CSSProperties } from 'react'
import { cn } from '../lib/cn'
import { useInView } from '../lib/useInView'

const TONS = ['bg-sage', 'bg-mint', 'bg-teal', 'bg-sage/60', 'bg-mint']

/** Separador discreto: pequenos quadrados do logo que se alinham ao entrar na tela. */
export function SquaresDivider({ className, dark }: { className?: string; dark?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={cn('flex items-center gap-4', className)} aria-hidden="true" data-in={inView}>
      <div className={cn('h-px flex-1', dark ? 'bg-paper/15' : 'bg-sand/70')} />
      <div className="flex items-end gap-1">
        {TONS.map((t, i) => (
          <span key={i} className={cn('mini-sq block', t, i === 2 ? 'size-3' : 'size-2')} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <div className={cn('h-px flex-1', dark ? 'bg-paper/15' : 'bg-sand/70')} />
    </div>
  )
}
