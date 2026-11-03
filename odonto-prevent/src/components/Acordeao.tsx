import { useId, useState, type ReactNode } from 'react'

export interface ItemAcordeao {
  pergunta: string
  resposta: ReactNode
}

/**
 * Acordeão acessível (botão com aria-expanded + região com aria-labelledby),
 * com destaque do item aberto e ícone + que gira para ×
 * (adaptado de "Animated Line Accordion" do 21st.dev).
 */
export function Acordeao({ itens }: { itens: ItemAcordeao[] }) {
  const [aberto, setAberto] = useState<number | null>(0)
  const base = useId()
  return (
    <ul className="divide-y divide-linha border-y border-linha">
      {itens.map((item, i) => {
        const estaAberto = aberto === i
        const idBotao = `${base}-b${i}`
        const idPainel = `${base}-p${i}`
        return (
          <li key={item.pergunta} className="relative">
            <h3 className="text-base">
              <button
                id={idBotao}
                type="button"
                aria-expanded={estaAberto}
                aria-controls={idPainel}
                onClick={() => setAberto(estaAberto ? null : i)}
                className="group flex min-h-16 w-full items-center gap-5 py-5 text-left font-display text-lg font-medium tracking-[-0.01em] text-tinta transition-colors hover:text-menta-texto sm:text-xl"
              >
                <span className="rotulo w-8 shrink-0 text-[0.7rem] text-grafite-300 tabular-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">{item.pergunta}</span>
                <span
                  aria-hidden="true"
                  className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-suave motion-reduce:transition-none ${
                    estaAberto ? 'rotate-45 border-grafite-900 bg-grafite-900 text-white' : 'border-linha text-tinta group-hover:border-menta-texto'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={idPainel}
              role="region"
              aria-labelledby={idBotao}
              hidden={!estaAberto}
              className="painel-aparece pb-6 pl-[3.25rem] pr-14 text-[1.02rem] leading-relaxed text-tinta-suave"
            >
              {item.resposta}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
