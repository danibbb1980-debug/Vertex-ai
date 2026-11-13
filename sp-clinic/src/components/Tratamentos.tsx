import { useId, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { CONFIG, temWhatsapp, waLink } from '../config'
import { ArcoNumero, IconeWhatsapp } from './Icones'

/*
 * Índice editorial numerado (adaptado do componente "Editorial service list" do 21st.dev):
 * linhas separadas por fios, número dentro de um pequeno arco que se acende ao entrar
 * na tela, acordeão acessível (button + aria-expanded + region).
 */
export function Tratamentos() {
  const lista = CONFIG.tratamentos.filter((t) => t.nome)
  const [aberto, setAberto] = useState<number>(-1)
  const id = useId()
  if (!lista.length) return null

  return (
    <section id="tratamentos" aria-labelledby="titulo-tratamentos" className="bg-areia">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo text-caramelo-queimado">Tratamentos</p>
            <h2 id="titulo-tratamentos" className="mt-5 text-[clamp(2.4rem,6vw,4.2rem)]">
              Tudo começa por uma <em className="not-italic text-caramelo-queimado">avaliação</em>.
            </h2>
            <p className="mt-6 max-w-[22rem] text-cafe-suave">
              Os tratamentos informados pela clínica. Abra cada um para uma descrição geral; a indicação depende de
              avaliação individual.
            </p>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ul className="border-b border-fio">
            {lista.map((t, i) => (
              <Item
                key={t.nome}
                i={i}
                nome={t.nome}
                descricao={t.descricao}
                aberto={aberto === i}
                alternar={() => setAberto(aberto === i ? -1 : i)}
                id={`${id}-${i}`}
              />
            ))}
            {CONFIG.tratamentosComplemento && (
              <li className="flex items-center gap-5 border-t border-fio py-7 sm:gap-8">
                <span aria-hidden="true" className="flex w-8 justify-center text-cafe-suave">
                  +
                </span>
                <span className="font-display text-[clamp(1.5rem,3.6vw,2.2rem)] leading-tight text-cafe-suave">
                  {CONFIG.tratamentosComplemento}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Item({
  i,
  nome,
  descricao,
  aberto,
  alternar,
  id,
}: {
  i: number
  nome: string
  descricao: string
  aberto: boolean
  alternar: () => void
  id: string
}) {
  const ref = useRef<HTMLLIElement>(null)
  const visto = useInView(ref, { once: true, margin: '0px 0px -30% 0px' })
  return (
    <li ref={ref} className="border-t border-fio">
      <h3>
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={alternar}
          className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 sm:py-7"
        >
          <ArcoNumero n={i + 1} aceso={visto || aberto} />
          <span
            className={`font-display text-[clamp(2.1rem,6.2vw,4rem)] leading-[0.95] tracking-[-0.02em] transition-transform duration-300 ease-[var(--ease-suave)] ${
              aberto ? 'translate-x-2' : 'group-hover:translate-x-2'
            }`}
          >
            {nome}
          </span>
          <span
            aria-hidden="true"
            className="relative ml-auto size-11 shrink-0 rounded-full border border-cafe/30 transition-colors group-hover:border-cafe"
          >
            <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-cafe" />
            <span
              className={`absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-cafe transition-transform duration-300 ${
                aberto ? 'rotate-0' : 'rotate-90'
              }`}
            />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        hidden={!aberto}
        className="pb-9 pl-[3.25rem] pr-2 sm:pl-[4rem]"
      >
        <div className="animate-[abrir_.45s_var(--ease-suave)] grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
          <div>
            <p className="max-w-[34rem] text-[1.05rem] leading-relaxed">{descricao}</p>
            <p className="mt-3 text-[0.95rem] text-cafe-suave">A indicação depende de avaliação individual.</p>
          </div>
          {temWhatsapp && (
            <a
              href={waLink(CONFIG.mensagens.tratamento(nome))}
              target="_blank"
              rel="noopener noreferrer"
              className="botao botao-linha self-start"
            >
              <IconeWhatsapp />
              Conversar sobre {nome}
            </a>
          )}
        </div>
      </div>
    </li>
  )
}
