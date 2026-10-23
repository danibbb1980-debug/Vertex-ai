import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { CONFIG, type Trabalho } from '../config'
import { whatsappLink } from '../lib/links'
import { CabecalhoSecao, Foto, FotoMontada, FotoReservada, IconWhatsApp } from './ui'

const trabalhos: Trabalho[] = CONFIG.trabalhos

function Imagem({ t, tamanhoGrande }: { t: Trabalho; tamanhoGrande: string }) {
  if (!t.foto || !t.fotoTamanho) return <FotoReservada />
  if (t.fotoTamanho[0] >= 700)
    return (
      <Foto
        nome={t.foto}
        alt={t.fotoAlt ?? t.nome}
        tamanho={t.fotoTamanho}
        sizes={tamanhoGrande}
        className="h-full w-full object-cover"
      />
    )
  return <FotoMontada nome={t.foto} alt={t.fotoAlt ?? t.nome} tamanho={t.fotoTamanho} />
}

/**
 * Vitrine em índice editorial: lista numerada à direita e, no desktop, uma
 * prancha fixa à esquerda que troca a foto conforme o item em foco, hover ou
 * rolagem (padrão "hover image reveal list", adaptado).
 */
export function Trabalhos() {
  const [ativo, setAtivo] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtivo(Number((e.target as HTMLElement).dataset.indice))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const atual = trabalhos[ativo]

  return (
    <section id="trabalhos" aria-labelledby="titulo-trabalhos" className="py-24 sm:py-28 lg:py-36">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <CabecalhoSecao
            id="titulo-trabalhos"
            numero="01"
            rotulo="Trabalhos"
            titulo={
              <>
                Da prótese fixa à removível, <em className="font-normal text-petroleo-700">com o mesmo cuidado</em>.
              </>
            }
          />
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-cinza lg:pb-2">
            A indicação clínica é sempre do cirurgião-dentista responsável pelo caso. O laboratório executa a partir do modelo,
            dos registros e da prescrição.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Prancha fixa (desktop) */}
          <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
            <div className="sticky top-[calc(var(--faixa)+7rem)]">
              <div className="registro relative aspect-[4/5] overflow-hidden bg-marfim">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.div
                    key={atual.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Imagem t={atual} tamanhoGrande="40vw" />
                  </m.div>
                </AnimatePresence>
              </div>
              <p className="mt-4 flex items-baseline justify-between text-[0.75rem] text-cinza">
                <span>
                  <span className="rotulo mr-2 text-petroleo-600">Fig. {String(ativo + 1).padStart(2, '0')}</span>
                  {atual.nome}
                </span>
                <span className="rotulo">{atual.categoria}</span>
              </p>
            </div>
          </div>

          {/* Índice */}
          <ol className="border-t border-linha lg:col-span-7">
            {trabalhos.map((t, i) => {
              const ehAtivo = i === ativo
              return (
                <li
                  key={t.id}
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  data-indice={i}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setAtivo(i)}
                  onFocusCapture={() => setAtivo(i)}
                  className="group relative border-b border-linha py-8 sm:py-10"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-[-1px] left-0 h-px bg-petroleo-700 transition-[width] duration-700 ease-[var(--ease-atelie)] ${
                      ehAtivo ? 'w-full' : 'w-0'
                    }`}
                  />
                  <div className="grid gap-x-6 gap-y-4 sm:grid-cols-[3.5rem_1fr]">
                    <span
                      className={`font-serif text-[0.95rem] tabular-nums transition-colors duration-500 sm:pt-2 ${
                        ehAtivo ? 'text-terracota' : 'text-cinza'
                      }`}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="rotulo text-petroleo-600">{t.categoria}</p>
                      <h3
                        className={`mt-2 text-[1.75rem] leading-tight font-light transition-colors duration-500 sm:text-[2.125rem] ${
                          ehAtivo ? 'text-petroleo-900' : 'text-petroleo-900/80'
                        }`}
                      >
                        {t.nome}
                      </h3>

                      {/* imagem no celular/tablet */}
                      <div className={`registro mt-6 overflow-hidden bg-marfim lg:hidden ${t.foto ? 'aspect-[4/3]' : 'aspect-[5/2]'}`}>
                        <Imagem t={t} tamanhoGrande="90vw" />
                      </div>

                      <p className="mt-4 max-w-xl text-[0.9875rem] leading-relaxed text-cinza">{t.descricao}</p>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <ul className="flex flex-wrap gap-2" aria-label="Características">
                          {t.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-linha px-3 py-1 text-[0.75rem] font-medium text-tinta/75"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                        <a
                          href={whatsappLink(CONFIG.mensagens.trabalho(t.nome.charAt(0).toLowerCase() + t.nome.slice(1)))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-2 text-[0.875rem] font-semibold text-petroleo-700 underline decoration-petroleo-700/25 underline-offset-[6px] transition-colors hover:decoration-petroleo-700"
                        >
                          <IconWhatsApp size={17} />
                          Conversar sobre este trabalho
                          <span className="sr-only">: {t.nome} (abre o WhatsApp em nova aba)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
