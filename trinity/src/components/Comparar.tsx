import { useCallback, useId, useRef, useState } from 'react'
import type { Foto } from '../config'

const srcset = (src: string, w: number) => `${src.replace('.webp', '-600.webp')} 600w, ${src} ${w}w`

/**
 * Comparativo arrastável: a foto "depois" fica por cima, recortada até a alça.
 * Arraste com o dedo ou o mouse, clique em qualquer ponto ou use as setas do teclado.
 */
export function Comparar({ f, className = '', sizes }: { f: Foto; className?: string; sizes?: string }) {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const id = useId()

  const fromX = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  if (!f.antes || !f.depois) return null

  return (
    <figure className={`m-0 ${className}`}>
      <div
        ref={box}
        className="group relative cursor-ew-resize select-none overflow-hidden bg-paper-2 [touch-action:pan-y]"
        style={{ aspectRatio: `${f.largura} / ${f.altura}` }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          fromX(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && fromX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <img
          src={f.antes}
          srcSet={srcset(f.antes, f.largura)}
          sizes={sizes}
          alt={`Antes: ${f.alt}`}
          width={f.largura}
          height={f.altura}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover text-transparent"
        />
        <img
          src={f.depois}
          srcSet={srcset(f.depois, f.largura)}
          sizes={sizes}
          alt={`Depois: ${f.alt}`}
          width={f.largura}
          height={f.altura}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover text-transparent"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        />

        <span className="label pointer-events-none absolute left-3 top-3 bg-ink/80 px-2.5 py-1.5 text-[0.68rem] text-paper">Antes</span>
        <span className="label pointer-events-none absolute right-3 top-3 bg-paper/90 px-2.5 py-1.5 text-[0.68rem] text-ink">Depois</span>

        {/* alça */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0" style={{ left: `${pos}%` }}>
          <span className="absolute inset-y-0 -left-px w-[2px] bg-paper shadow-[0_0_0_1px_rgba(29,25,21,.25)]" />
          <span className="absolute left-0 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-paper bg-ink text-paper transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none">
            <svg viewBox="0 0 24 12" width="22" height="11" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 1L2 6l5 5M17 1l5 5-5 5" />
            </svg>
          </span>
        </span>

        {/* controle acessível: teclado e leitor de tela */}
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Comparar antes e depois: ${f.legenda ?? f.alt}`}
          aria-valuetext={`${Math.round(pos)}% mostrando o antes`}
          className="peer absolute inset-0 h-full w-full cursor-ew-resize opacity-0 [touch-action:pan-y]"
          onPointerDown={(e) => e.preventDefault()}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden outline outline-2 -outline-offset-2 outline-bronze-soft peer-focus-visible:block" />
      </div>
      {f.legenda && (
        <figcaption className="mt-3 flex justify-between gap-4 text-[0.88rem] text-stone">
          <span>{f.legenda}</span>
          <span aria-hidden="true">Arraste para comparar</span>
        </figcaption>
      )}
    </figure>
  )
}
