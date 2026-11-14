import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { CONFIG } from '../config'
import { agendarUrl, minusculaInicial } from '../lib/links'
import { Seta } from './Botao'

/**
 * Índice editorial em capítulos.
 * Base: "Editorial service list" (21st.dev, ibrandify) — linhas numeradas com
 * expansão por grid-rows; adaptado para capítulos com numerais romanos,
 * título fixo lateral, cantos retos e filetes de 1px.
 */
export function Tratamentos() {
  const caps = CONFIG.tratamentos.filter((c) => c.itens.length > 0)
  const [abertos, setAbertos] = useState<Set<number>>(() => new Set([0]))
  const id = useId()
  if (!caps.length) return null

  let contador = 0
  const total = caps.reduce((n, c) => n + c.itens.length, 0)

  const alternar = (i: number) =>
    setAbertos((s) => {
      const n = new Set(s)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })

  return (
    <section id="tratamentos" aria-labelledby="trat-titulo" className="bg-osso py-24 md:py-36">
      <div className="container-b grid gap-14 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo flex items-center gap-4 text-champanhe-escuro">
              <span aria-hidden="true" className="h-px w-10 bg-champanhe-escuro" />
              Tratamentos
            </p>
            <h2 id="trat-titulo" className="titulo mt-6 text-[clamp(2.4rem,5.4vw,4.25rem)]">
              Três capítulos, <span className="enfase">um</span> plano.
            </h2>
            <p className="mt-6 max-w-sm text-pedra">
              Harmonização, injetáveis e tecnologias estéticas em Pouso Alegre. A indicação de cada
              tratamento depende de avaliação individual.
            </p>
            <p className="rotulo num mt-10 text-pedra">
              {String(caps.length).padStart(2, '0')} capítulos · {String(total).padStart(2, '0')} tratamentos
            </p>
          </div>
        </header>

        <div className="lg:col-span-8">
          {caps.map((cap, ci) => {
            const aberto = abertos.has(ci)
            const inicio = contador
            contador += cap.itens.length
            return (
              <div key={cap.titulo} className="border-t border-preto/80 last:border-b last:border-b-filete">
                <h3>
                  <button
                    type="button"
                    id={`${id}-b-${ci}`}
                    aria-expanded={aberto}
                    aria-controls={`${id}-p-${ci}`}
                    onClick={() => alternar(ci)}
                    className="group grid w-full cursor-pointer grid-cols-[5.5rem_1fr_auto] items-center gap-4 py-7 text-left sm:grid-cols-[9rem_1fr_auto] md:py-9"
                  >
                    <span
                      aria-hidden="true"
                      className="enfase text-[3.5rem] leading-none text-champanhe-medio transition-colors duration-500 group-hover:text-champanhe-escuro sm:text-[5.5rem]"
                    >
                      {cap.numeral}
                    </span>
                    <span>
                      <span className="sr-only">Capítulo {cap.numeral}: </span>
                      <span className="block text-[clamp(1.6rem,3.4vw,2.6rem)] font-light leading-tight tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1.5">
                        {cap.titulo}
                      </span>
                      <span className="rotulo num mt-1 block text-pedra">
                        {cap.itens.length} {cap.itens.length === 1 ? 'tratamento' : 'tratamentos'}
                      </span>
                    </span>
                    <span aria-hidden="true" className="relative mr-1 h-6 w-6">
                      <span className="absolute left-0 top-1/2 h-px w-6 bg-preto" />
                      <span
                        className={`absolute left-1/2 top-0 h-6 w-px bg-preto transition-transform duration-300 ${
                          aberto ? 'scale-y-0' : 'scale-y-100'
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`${id}-p-${ci}`}
                  role="region"
                  aria-labelledby={`${id}-b-${ci}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-corte)] motion-reduce:transition-none ${
                    aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                  inert={!aberto}
                >
                  <div className="overflow-hidden">
                    <ol className="pb-8 sm:pl-[9rem] md:pb-12">
                      {cap.itens.map((t, ti) => (
                        <li key={t.nome} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-filete py-7 first:border-t-0 first:pt-2">
                          <motion.span
                            aria-hidden="true"
                            className="num pt-1.5 text-sm tracking-[0.12em]"
                            initial={{ color: '#6B635A' }}
                            whileInView={{ color: '#76603F' }}
                            viewport={{ once: true, amount: 1, margin: '0px 0px -12% 0px' }}
                            transition={{ duration: 0.7 }}
                          >
                            {String(inicio + ti + 1).padStart(2, '0')}
                          </motion.span>
                          <div>
                            <h4 className="text-[1.375rem] font-normal leading-snug tracking-[-0.01em] md:text-2xl">
                              {t.nome}
                            </h4>
                            <p className="mt-2 max-w-xl text-pedra">{t.descricao}</p>
                            <p className="rotulo mt-4 !tracking-[0.14em] text-pedra">
                              A indicação depende de avaliação individual.
                            </p>
                            <a
                              href={agendarUrl(CONFIG.mensagens.tratamento(minusculaInicial(t.nome)))}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/l mt-4 inline-flex min-h-12 items-center gap-3 text-[0.8125rem] font-medium uppercase tracking-[0.16em]"
                            >
                              <span className="border-b border-preto/30 pb-1 transition-colors group-hover/l:border-champanhe-escuro">
                                Agendar avaliação<span className="sr-only"> sobre {t.nome} (abre em nova aba)</span>
                              </span>
                              <Seta className="transition-transform duration-300 group-hover/l:translate-x-1" />
                            </a>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
