import { useCallback, useEffect, useRef, useState } from 'react'
import type { Caso } from '../config'

/**
 * Comparador antes/depois. Adaptado do "Image Compare" (21st.dev, aadixc0de):
 * arrastar, clicar ou usar as setas; toque só vira arraste depois de 6 px na horizontal,
 * para não travar a rolagem. Aqui ganha a varredura de entrada (antes → depois → meio)
 * e a alça com o ponto vinho do fulcro.
 */
const SLOP = 6
const reduz = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Compara({ caso, rodar }: { caso: Caso; rodar: number }) {
  const [pos, setPos] = useState(50)
  const caixa = useRef<HTMLDivElement>(null)
  const anim = useRef<{ stop: () => void } | null>(null)
  const toque = useRef<{ x: number; y: number; arrastando: boolean; id: number } | null>(null)

  const parar = () => { anim.current?.stop(); anim.current = null }

  // varredura: mostra o antes inteiro, desliza até o depois e assenta no meio
  useEffect(() => {
    if (rodar === 0) return
    parar()
    if (reduz()) { setPos(50); return }
    let vivo = true
    setPos(100)
    import('motion').then(({ animate }) => {
      if (!vivo) return
      const a = animate(100, 0, {
        duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.35,
        onUpdate: (v) => setPos(v),
        onComplete: () => {
          if (!vivo) return
          anim.current = animate(0, 50, { type: 'spring', stiffness: 90, damping: 14, onUpdate: (v) => setPos(v) })
        },
      })
      anim.current = a
    })
    return () => { vivo = false; parar() }
  }, [rodar, caso.id])

  const deX = useCallback((clientX: number) => {
    const r = caixa.current!.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onDown = (e: React.PointerEvent) => {
    parar()
    if (e.pointerType === 'mouse') {
      deX(e.clientX)
      caixa.current!.setPointerCapture(e.pointerId)
      toque.current = { x: e.clientX, y: e.clientY, arrastando: true, id: e.pointerId }
    } else {
      toque.current = { x: e.clientX, y: e.clientY, arrastando: false, id: e.pointerId }
    }
  }
  const onMove = (e: React.PointerEvent) => {
    const t = toque.current
    if (!t) return
    if (!t.arrastando) {
      const dx = Math.abs(e.clientX - t.x), dy = Math.abs(e.clientY - t.y)
      if (dy > SLOP && dy > dx) { toque.current = null; return }
      if (dx > SLOP) { t.arrastando = true; caixa.current!.setPointerCapture(e.pointerId) } else return
    }
    deX(e.clientX)
  }
  const onUp = (e: React.PointerEvent) => {
    const t = toque.current
    if (t && !t.arrastando && e.pointerType !== 'mouse') deX(e.clientX) // toque curto = salto
    toque.current = null
  }

  const ratio = caso.antes.w / caso.antes.h
  return (
    <div
      ref={caixa}
      className="compara"
      style={{ '--pos': `${pos}%`, aspectRatio: `${caso.antes.w} / ${caso.antes.h}`, width: `min(100%, calc(74vh * ${ratio.toFixed(4)}))` } as React.CSSProperties}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={() => (toque.current = null)}
    >
      <img src={caso.antes.src} width={caso.antes.w} height={caso.antes.h} alt={caso.antes.alt} loading="lazy" decoding="async" draggable={false} />
      <img className="depois" src={caso.depois.src} width={caso.depois.w} height={caso.depois.h} alt={caso.depois.alt} loading="lazy" decoding="async" draggable={false} />
      <span className="tag tag-a" style={{ opacity: pos < 14 ? 0 : 1 }} aria-hidden="true">Antes</span>
      <span className="tag tag-d" style={{ opacity: pos > 86 ? 0 : 1 }} aria-hidden="true">Depois</span>
      <div className="divisor" aria-hidden="true"><span className="alca" /></div>
      <input
        type="range" min={0} max={100} step={1} value={Math.round(pos)}
        aria-label={`Comparar antes e depois, caso ${caso.rotulo.toLowerCase()}. Valor maior mostra mais do antes.`}
        aria-valuetext={`${Math.round(pos)}% do antes visível`}
        onChange={(e) => { parar(); setPos(Number(e.target.value)) }}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}
