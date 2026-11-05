import { useId, useState } from 'react'
import { m as motion } from 'motion/react'
import { areasVisiveis, whatsappTema } from '../config'
import { ArrowIcon } from './ui'

const num = (i: number) => String(i + 1).padStart(2, '0')

function TemaLink({ tema, className = '' }: { tema: string; className?: string }) {
  return (
    <a
      href={whatsappTema(tema)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group/link inline-flex items-center gap-2 text-[0.9rem] font-medium text-bronze-deep ${className}`}
    >
      <span className="border-b border-bronze-deep/30 pb-0.5 transition-colors duration-300 group-hover/link:border-bronze-deep">
        Conversar sobre este tema
      </span>
      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
      <span className="sr-only">(abre o WhatsApp)</span>
    </a>
  )
}

/**
 * Lista tipográfica numerada das áreas.
 * Desktop (lg+): lista à esquerda; passar o mouse, focar ou clicar ativa a linha
 * e o painel ao lado mostra a descrição (sem deslocar a lista).
 * Celular: acordeão acessível.
 */
export function AreasList() {
  const [ativa, setAtiva] = useState(0)
  const [aberta, setAberta] = useState<number | null>(0)
  const base = useId()
  const area = areasVisiveis[ativa]

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-10 lg:grid lg:grid-cols-12">
        <ol className="border-t border-line lg:col-span-7" aria-label="Áreas de atuação">
          {areasVisiveis.map((a, i) => {
            const on = i === ativa
            return (
              <li key={a.titulo} className="border-b border-line">
                <button
                  type="button"
                  aria-controls={`${base}-painel`}
                  aria-current={on ? 'true' : undefined}
                  onMouseEnter={() => setAtiva(i)}
                  onFocus={() => setAtiva(i)}
                  onClick={() => setAtiva(i)}
                  className="group relative flex w-full cursor-pointer items-baseline gap-6 py-[1.05rem] text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 -left-6 h-px -translate-y-1/2 bg-bronze-deep transition-[width] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${on ? 'w-4' : 'w-0'}`}
                  />
                  <span className={`label w-6 shrink-0 tabular-nums transition-colors duration-300 ${on ? 'text-bronze-deep' : 'text-muted'}`}>
                    {num(i)}
                  </span>
                  <span
                    className={`display text-[2rem] leading-tight transition-[color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] xl:text-[2.3rem] ${
                      on ? 'translate-x-1 text-text' : 'text-text/60 group-hover:text-text/80'
                    }`}
                  >
                    {a.titulo}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="lg:col-span-4 lg:col-start-9">
          <div id={`${base}-painel`} aria-live="polite" className="sticky top-[calc(var(--banner-h,0px)+7rem)] border-t border-bronze-deep/60 pt-8">
            <motion.div
              key={ativa}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block font-sans text-[3.4rem] leading-none font-light tracking-tight text-bronze-deep/45 tabular-nums">{num(ativa)}</span>
              <h3 className="display mt-5 text-[2rem] leading-tight">{area.titulo}</h3>
              <p className="mt-4 text-muted">{area.descricao}</p>
              <TemaLink tema={area.tema} className="mt-8" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Celular e tablet */}
      <ol className="border-t border-line lg:hidden" aria-label="Áreas de atuação">
        {areasVisiveis.map((a, i) => {
          const on = aberta === i
          const btn = `${base}-b${i}`
          const pnl = `${base}-p${i}`
          return (
            <li key={a.titulo} className="border-b border-line">
              <h3>
                <button
                  id={btn}
                  type="button"
                  aria-expanded={on}
                  aria-controls={pnl}
                  onClick={() => setAberta(on ? null : i)}
                  className="flex w-full cursor-pointer items-baseline gap-4 py-5 text-left"
                >
                  <span className={`label w-6 shrink-0 tabular-nums ${on ? 'text-bronze-deep' : 'text-muted'}`}>{num(i)}</span>
                  <span className={`display flex-1 text-[1.6rem] leading-snug transition-colors duration-300 sm:text-[1.9rem] ${on ? 'text-text' : 'text-text/75'}`}>
                    {a.titulo}
                  </span>
                  <span aria-hidden="true" className="relative top-[-0.2rem] h-3 w-3 shrink-0 self-center">
                    <span className="absolute top-1/2 left-0 h-px w-3 bg-text" />
                    <span className={`absolute top-0 left-1/2 h-3 w-px bg-text transition-transform duration-500 ${on ? 'scale-y-0' : 'scale-y-100'}`} />
                  </span>
                </button>
              </h3>
              <div
                id={pnl}
                role="region"
                aria-labelledby={btn}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden" inert={!on}>
                  <div className="pb-6 pl-10">
                    <p className="text-muted">{a.descricao}</p>
                    <TemaLink tema={a.tema} className="mt-5" />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </>
  )
}
