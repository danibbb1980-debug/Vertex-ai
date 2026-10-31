import type { ReactNode } from 'react'
import { Reveal, TextReveal } from './motion'

export function SectionHead({
  eyebrow,
  title,
  id,
  children,
  center = false,
  className = '',
}: {
  eyebrow: string
  title: string
  id: string
  children?: ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Reveal>
        <p className={`eyebrow mb-6 flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
          <span className="inline-block h-px w-8 bg-copper" aria-hidden />
          {eyebrow}
          {center && <span className="inline-block h-px w-8 bg-copper" aria-hidden />}
        </p>
      </Reveal>
      <TextReveal as="h2" id={id} className="display h2" text={title} />
      {children && (
        <Reveal delay={0.15}>
          <div className={`lead mt-6 ${center ? 'mx-auto' : ''} max-w-2xl`}>{children}</div>
        </Reveal>
      )}
    </div>
  )
}
