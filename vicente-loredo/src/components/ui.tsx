import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Observa a entrada na viewport uma única vez (para a régua de abertura de seção). */
export function useInView<T extends Element>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, rootMargin])
  return { ref, inView }
}

/** Abertura de seção: número tabular + rótulo + linha de régua que se traça. */
export function SectionHead({
  n,
  label,
  dark = false,
}: {
  n: string
  label: string
  dark?: boolean
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`mb-10 sm:mb-14 ${inView ? 'is-in' : ''}`}>
      <div className="flex items-baseline gap-4">
        <span className={`num label ${dark ? 'text-brick-soft' : 'text-brick'}`} aria-hidden="true">
          {n}
        </span>
        <span className={`label ${dark ? 'text-paper/80' : 'text-slate'}`}>{label}</span>
      </div>
      <span
        className={`rule rule-draw mt-3 ${dark ? '!bg-paper/25' : ''}`}
        aria-hidden="true"
      />
    </div>
  )
}

export function WhatsIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.6-4.4A8.4 8.4 0 1 1 20.5 11.6Z" />
      <path d="M9 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.2.6-.5.8-.6.4-1.4.5-2.1.3-2.6-.8-4.6-2.8-5.4-5.4-.2-.7-.1-1.5.3-2.1Z" />
    </svg>
  )
}

export function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  )
}

export function ExternalNote({ children }: { children: ReactNode }) {
  return <span className="sr-only"> {children}</span>
}
