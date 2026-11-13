import { useId, useState } from 'react'
import { CONFIG, temWhatsapp, waLink } from '../config'

/** Acordeão numerado sem bordas pesadas (inspirado em "Ghost Accordion" do 21st.dev). */
export function Duvidas() {
  const [aberto, setAberto] = useState<number>(0)
  const id = useId()
  if (!CONFIG.faq.length) return null
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="bg-marfim">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo text-caramelo-queimado">Dúvidas</p>
            <h2 id="titulo-duvidas" className="mt-5 text-[clamp(2.4rem,6vw,4.2rem)]">
              Perguntas <em className="not-italic text-caramelo-queimado">frequentes</em>.
            </h2>
            {temWhatsapp && (
              <p className="mt-6 max-w-[22rem] text-cafe-suave">
                Não encontrou a sua?{' '}
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-sublinhado text-cafe hover:text-caramelo-queimado"
                >
                  Pergunte pelo WhatsApp
                </a>
                .
              </p>
            )}
          </div>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {CONFIG.faq.map((f, i) => {
            const on = aberto === i
            return (
              <li key={f.pergunta} className="border-t border-fio last:border-b">
                <h3 className="font-sans text-[1.08rem] leading-snug tracking-normal">
                  <button
                    type="button"
                    id={`${id}-${i}-b`}
                    aria-expanded={on}
                    aria-controls={`${id}-${i}-p`}
                    onClick={() => setAberto(on ? -1 : i)}
                    className="group flex min-h-16 w-full items-center gap-5 py-5 text-left font-medium"
                  >
                    <span className="num w-6 shrink-0 text-xs font-normal text-cafe-suave">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="group-hover:text-caramelo-queimado">{f.pergunta}</span>
                    <span aria-hidden="true" className="relative ml-auto size-5 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-5 bg-cafe" />
                      <span
                        className={`absolute left-0 top-1/2 h-px w-5 bg-cafe transition-transform duration-300 ${
                          on ? 'rotate-0' : 'rotate-90'
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <div id={`${id}-${i}-p`} role="region" aria-labelledby={`${id}-${i}-b`} hidden={!on}>
                  <p className="animate-[abrir_.4s_var(--ease-suave)] max-w-[40rem] pb-7 pl-11 text-cafe-suave">
                    {f.resposta}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
