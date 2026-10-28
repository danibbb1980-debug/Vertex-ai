import { useId, useState } from 'react'
import { FAQ } from '../content'
import { waLink } from '../lib/links'
import { IconPlus, IconWhatsApp } from './Icons'
import { SectionHead } from './SectionHead'

/**
 * Acordeão acessível (inspirado no "Ghost Accordion" do 21st.dev: sem bordas
 * pesadas, itens numerados, + que gira para ×). Botões com aria-expanded,
 * painéis com role=region; o conteúdo fechado fica inerte.
 */
export function Faq() {
  const [aberto, setAberto] = useState<number | null>(0)
  const uid = useId()
  return (
    <section id="duvidas" aria-labelledby="faq-titulo" className="py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--banner-h)+var(--header-h)+2rem)]">
            <SectionHead
              id="faq-titulo"
              eyebrow="Dúvidas frequentes"
              title="Perguntas que *costumam* aparecer."
              intro={<p>Respostas gerais. Na avaliação, cada situação é vista em detalhe.</p>}
            />
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-ghost mt-9" data-reveal>
              <IconWhatsApp size={18} />
              Perguntar pelo WhatsApp
            </a>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="border-t border-line">
            {FAQ.map((f, i) => {
              const open = aberto === i
              const bid = `${uid}-b${i}`
              const pid = `${uid}-p${i}`
              return (
                <li key={f.p} className="border-b border-line">
                  <h3 className="font-sans text-base">
                    <button
                      id={bid}
                      type="button"
                      aria-expanded={open}
                      aria-controls={pid}
                      onClick={() => setAberto(open ? null : i)}
                      className="group flex min-h-16 w-full items-center gap-5 py-5 text-left"
                    >
                      <span className="num w-7 shrink-0 text-mute">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`flex-1 font-display text-[1.25rem] leading-snug transition-colors md:text-[1.4rem] ${open ? 'text-accent' : 'text-ink group-hover:text-accent'}`}>
                        {f.p}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-[var(--ease-out-soft)] ${
                          open ? 'rotate-45 border-accent bg-accent text-white' : 'border-line text-ink'
                        }`}
                      >
                        <IconPlus size={16} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={pid}
                    role="region"
                    aria-labelledby={bid}
                    inert={!open}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-soft)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`max-w-[58ch] pb-7 pl-12 pr-4 text-ink-2 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
                      >
                        {f.r}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
