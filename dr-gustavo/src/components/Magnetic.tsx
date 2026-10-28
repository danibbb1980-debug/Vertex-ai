import { useRef, type ReactNode } from 'react'

/**
 * Efeito magnético sutil (inspirado no "Magnetic Button" do 21st.dev).
 * Só em ponteiro fino com hover e sem preferência por menos movimento.
 * Anima apenas transform.
 */
export function Magnetic({ children, strength = 0.18 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)
  const ok = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || !ok()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    })
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.transform = ''
  }

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className="inline-flex transition-transform duration-500 ease-[var(--ease-out-soft)]"
    >
      {children}
    </span>
  )
}
