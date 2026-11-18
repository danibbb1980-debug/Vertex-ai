import { useEffect, useRef, useState } from 'react'

const dois = (n: number) => String(n).padStart(2, '0')

/** Acompanha a seção visível ("fls.") a partir dos elementos [data-fls]. */
export function useFolhaAtual() {
  const [atual, setAtual] = useState(1)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-fls]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setAtual(Number((e.target as HTMLElement).dataset.fls))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return atual
}

/** Progresso de leitura ligado à rolagem, gravado em --progresso (0..1). */
function useProgresso() {
  useEffect(() => {
    let raf = 0
    const set = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1
      document.documentElement.style.setProperty('--progresso', p.toFixed(4))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(set)
    }
    set()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [])
}

/** Número que troca com um fade curto. */
export function NumeroFolha({ n }: { n: number }) {
  const [mostrado, setMostrado] = useState(n)
  const [trocando, setTrocando] = useState(false)
  const t = useRef<number>(0)
  useEffect(() => {
    if (n === mostrado) return
    setTrocando(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => {
      setMostrado(n)
      setTrocando(false)
    }, 180)
    return () => window.clearTimeout(t.current)
  }, [n, mostrado])
  return (
    <span className="contador-num" data-trocando={trocando}>
      {dois(mostrado)}
    </span>
  )
}

export function Contador({ atual, total, className = '' }: { atual: number; total: number; className?: string }) {
  return (
    <p className={`rotulo tabular whitespace-nowrap text-caneta ${className}`} aria-hidden="true">
      fls. <NumeroFolha n={atual} /> <span className="text-apoio">/ {dois(total)}</span>
    </p>
  )
}

/** O fio da margem (fixo) + contador de folhas no desktop. */
export function Margem({ atual, total }: { atual: number; total: number }) {
  useProgresso()
  return (
    <>
      <div className="margem-fio" aria-hidden="true" />
      <div
        className="pointer-events-none fixed bottom-6 left-0 z-30 hidden w-[var(--margem)] justify-center md:flex"
        aria-hidden="true"
      >
        <p
          className="rotulo tabular text-caneta"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11 }}
        >
          fls. <NumeroFolha n={atual} /> <span className="text-apoio">/ {dois(total)}</span>
        </p>
      </div>
    </>
  )
}

export { dois }
