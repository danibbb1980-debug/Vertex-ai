import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Reveal } from './Reveal'

/** Título de seção: rótulo + H2 (palavra entre *asteriscos* em itálico) + apoio opcional. */
export function SectionHeading({
  label,
  title,
  id,
  children,
  dark,
  className,
}: {
  label: string
  title: string
  id: string
  children?: ReactNode
  dark?: boolean
  className?: string
}) {
  const parts = title.split(/(\*[^*]+\*)/g)
  return (
    <Reveal className={cn('max-w-2xl', className)}>
      <p className={cn('eyebrow mb-5 flex items-center gap-3', dark ? 'text-teal' : 'text-teal-deep')}>
        <span aria-hidden="true" className={cn('block size-2', dark ? 'bg-teal' : 'bg-teal-deep')} />
        {label}
      </p>
      <h2 id={id} className={cn('text-[2.2rem] sm:text-5xl lg:text-[3.4rem]', dark ? 'text-paper' : 'text-ink')}>
        {parts.map((p, i) =>
          p.startsWith('*') ? (
            <em key={i} className={dark ? 'text-sage' : 'text-teal-deep'}>
              {p.slice(1, -1)}
            </em>
          ) : (
            p
          ),
        )}
      </h2>
      {children && (
        <div className={cn('mt-6 text-lg leading-relaxed', dark ? 'text-paper/75' : 'text-ink-soft')}>{children}</div>
      )}
    </Reveal>
  )
}
