import { useId, useState } from 'react'
import { duvidas, linkWhatsApp } from '../lib/dados'
import { TituloEnfase } from './Enfase'

function Item({ pergunta, resposta, n }: { pergunta: string; resposta: string; n: number }) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  return (
    <li className="border-b border-fio">
      <h3 className="font-sans text-[1.075rem] font-medium leading-snug tracking-normal">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          id={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className="group flex min-h-16 w-full items-center gap-4 py-5 text-left text-tinta"
        >
          <span className="num w-7 shrink-0 text-[1rem] text-terracota-texto" aria-hidden="true">
            {String(n).padStart(2, '0')}
          </span>
          <span className="flex-1">{pergunta}</span>
          <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden="true">
            <path
              d="M2 12a10 10 0 0 1 20 0Z"
              className={`origin-center fill-ambar transition-transform duration-500 ${aberto ? 'rotate-180' : ''}`}
            />
            <path d="M2 12h20" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-p`} hidden={!aberto}>
        <p className="resposta max-w-[40rem] pb-6 pl-11 text-tinta-suave">{resposta}</p>
      </div>
    </li>
  )
}

export function Duvidas() {
  const lista = duvidas()
  if (!lista.length) return null
  const zap = linkWhatsApp()
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="mx-auto max-w-[84rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="rotulo mb-5 text-terracota-texto">Dúvidas frequentes</p>
          <h2 id="titulo-duvidas" className="text-[clamp(2.4rem,5vw,4rem)] text-tinta">
            <TituloEnfase texto="Antes de *marcar*." />
          </h2>
          {zap && (
            <p className="mt-6 max-w-[20rem] text-tinta-suave">
              Ficou outra pergunta?{' '}
              <a href={zap} target="_blank" rel="noopener noreferrer" className="link-fio font-semibold text-terracota-texto">
                Fale com a equipe pelo WhatsApp
              </a>
              .
            </p>
          )}
        </div>
        <ul className="border-t border-tinta/70 lg:col-span-8">
          {lista.map((d, i) => (
            <Item key={d.pergunta} n={i + 1} {...d} />
          ))}
        </ul>
      </div>
    </section>
  )
}
