import type { ReactNode } from 'react'
import { rich } from '../lib/rich'

export function SectionHead({
  id,
  eyebrow,
  title,
  intro,
  className = '',
}: {
  id: string
  eyebrow: string
  title: string
  intro?: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 id={id} className="h-section mt-5 text-balance" data-reveal style={{ ['--d' as string]: '80ms' }}>
        {rich(title)}
      </h2>
      {intro ? (
        <div className="lead mt-6 max-w-[34rem]" data-reveal style={{ ['--d' as string]: '160ms' }}>
          {intro}
        </div>
      ) : null}
    </div>
  )
}
