import { useCallback, useRef } from 'react'
import { useScrollProgress } from '../lib/scroll'
import { ETAPAS } from '../content'
import { waLink } from '../lib/links'
import { IconWhatsApp } from './Icons'
import { SectionHead } from './SectionHead'

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const fill = useCallback((p: number) => {
    if (bar.current) bar.current.style.transform = `scaleY(${p})`
  }, [])
  useScrollProgress(ref, fill, { start: 0.7, end: 0.55 })

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--banner-h)+var(--header-h)+2rem)]">
            <SectionHead
              id="como-titulo"
              eyebrow="Como funciona"
              title="Quatro etapas, *uma* de cada vez."
              intro={<p>Do primeiro contato ao acompanhamento, você sabe o que vem a seguir.</p>}
            />
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-primary mt-9" data-reveal>
              <IconWhatsApp size={18} />
              Começar pelo WhatsApp
            </a>
          </div>
        </div>

        <ol ref={ref} className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-line" />
          <span
            ref={bar}
            aria-hidden="true"
            className="absolute bottom-6 left-[1.375rem] top-6 w-px origin-top bg-accent"
            style={{ transform: 'scaleY(0)' }}
          />
          {ETAPAS.map((e, i) => (
            <li key={e.n} className="relative grid grid-cols-[2.75rem_1fr] gap-6 pb-14 last:pb-0" data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
              <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-accent/40 bg-ivory font-display text-[1.05rem] text-accent">
                {e.n}
              </span>
              <div className="pt-1.5">
                <h3 className="text-[1.6rem] md:text-[1.85rem]">{e.titulo}</h3>
                <p className="mt-3 max-w-[44ch] text-ink-2">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
