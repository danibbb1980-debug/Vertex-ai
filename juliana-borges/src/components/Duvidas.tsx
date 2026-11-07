import { useId, useState } from 'react'
import { CONFIG } from '../config'
import { perguntas } from '../content'
import { BotaoWhatsApp, CabecalhoSecao, Revelar } from './ui'

function Item({ p, r, aberto, onToggle }: { p: string; r: string; aberto: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-choco/12">
      <h3>
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-r`}
          onClick={onToggle}
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-serif text-[1.25rem] leading-snug text-choco md:text-[1.4rem]"
        >
          <span>{p}</span>
          <span
            aria-hidden="true"
            className={`relative flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              aberto ? 'border-choco bg-choco text-creme' : 'border-choco/25 group-hover:border-choco'
            }`}
          >
            <span className="absolute h-px w-3.5 bg-current" />
            <span className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ${aberto ? 'scale-y-0' : ''}`} />
          </span>
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-b`} hidden={!aberto}>
        <p className="acordeao-resposta max-w-2xl pb-7 pr-14 text-choco/85">{r}</p>
      </div>
    </li>
  )
}

export function Duvidas() {
  const lista = perguntas()
  const [aberto, setAberto] = useState<number | null>(0)
  if (!lista.length) return null
  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <CabecalhoSecao
              id="titulo-duvidas"
              rotulo="Dúvidas frequentes"
              titulo={
                <>
                  Perguntas <em>comuns</em>.
                </>
              }
            >
              <p>Não encontrou sua dúvida? Pergunte pelo WhatsApp.</p>
            </CabecalhoSecao>
            {CONFIG.whatsapp && (
              <Revelar atraso={0.1} className="mt-8">
                <BotaoWhatsApp variante="secundario" mensagem="Olá! Vi o site da Juliana Borges e tenho uma dúvida.">
                  Tirar uma dúvida
                </BotaoWhatsApp>
              </Revelar>
            )}
          </div>
        </div>
        <Revelar className="lg:col-span-8">
          <ul className="border-t border-choco/12">
            {lista.map((q, i) => (
              <Item key={q.p} p={q.p} r={q.r} aberto={aberto === i} onToggle={() => setAberto(aberto === i ? null : i)} />
            ))}
          </ul>
        </Revelar>
      </div>
    </section>
  )
}
