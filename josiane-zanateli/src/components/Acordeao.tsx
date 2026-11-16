import { useId, useState, type ReactNode } from 'react'

/** Acordeão acessível (botão com aria-expanded + região rotulada). Abre por grid-rows, sem JS de medida. */
export function ItemAcordeao({
  cabecalho,
  children,
  nivel = 3,
  classeBotao = '',
  classeConteudo = '',
  indicadorClaro = false,
}: {
  cabecalho: ReactNode
  children: ReactNode
  nivel?: 2 | 3 | 4
  classeBotao?: string
  classeConteudo?: string
  indicadorClaro?: boolean
}) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  const H = `h${nivel}` as 'h3'
  return (
    <div className="border-b border-fio" data-aberto={aberto}>
      <H className="!font-sans !tracking-normal" style={{ lineHeight: 'inherit' }}>
        <button
          type="button"
          id={`${id}-b`}
          aria-expanded={aberto}
          aria-controls={`${id}-p`}
          onClick={() => setAberto((v) => !v)}
          className={`group flex w-full items-center justify-between gap-6 text-left ${classeBotao}`}
        >
          <span className="min-w-0 flex-1">{cabecalho}</span>
          <span aria-hidden="true" className="relative mr-1 block h-4 w-4 shrink-0">
            <span className={`absolute left-0 top-1/2 h-px w-4 ${indicadorClaro ? 'bg-areia' : 'bg-grafite'}`} />
            <span
              className={`absolute left-0 top-1/2 h-px w-4 transition-transform duration-300 motion-reduce:transition-none ${
                indicadorClaro ? 'bg-areia' : 'bg-grafite'
              } ${aberto ? 'rotate-0' : 'rotate-90'}`}
            />
          </span>
        </button>
      </H>
      <div
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${
          aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        inert={!aberto}
      >
        <div className="overflow-hidden">
          <div className={classeConteudo}>{children}</div>
        </div>
      </div>
    </div>
  )
}
