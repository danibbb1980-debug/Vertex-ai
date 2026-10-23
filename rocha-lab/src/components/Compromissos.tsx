import { CONFIG } from '../config'
import { CabecalhoSecao, IconEstrela, IconSetaDiagonal } from './ui'

// CONFIRMAR COM O LABORATÓRIO: textos dos compromissos
const pilares = [
  { titulo: 'Precisão', texto: 'Respeito ao modelo, aos registros e à prescrição em cada etapa do trabalho.' },
  { titulo: 'Acabamento', texto: 'Atenção à forma, ao contorno e à superfície antes de a peça sair do laboratório.' },
  { titulo: 'Comunicação com o dentista', texto: 'Contato direto pelo WhatsApp para alinhar dúvidas e detalhes do caso.' },
  { titulo: 'Prazos combinados', texto: 'Prazo definido caso a caso e combinado antes do início do trabalho.' },
]

export function Compromissos() {
  return (
    <section aria-labelledby="titulo-compromissos" className="border-t border-linha bg-marfim py-24 sm:py-28 lg:py-32">
      <div className="container-site">
        <CabecalhoSecao
          id="titulo-compromissos"
          numero="05"
          rotulo="Compromissos de atendimento"
          titulo={
            <>
              O que orienta <em className="font-normal text-petroleo-700">cada caso</em>.
            </>
          }
        />
        <ol className="mt-14 grid border-t border-linha sm:grid-cols-2 lg:grid-cols-4">
          {pilares.map((p, i) => (
            <li
              key={p.titulo}
              className="border-b border-linha py-8 sm:pr-8 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-8 lg:border-b-0 lg:border-l lg:px-7 lg:[&:nth-child(even)]:pl-7 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="font-serif text-[0.95rem] text-terracota tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-[1.5rem] leading-tight font-light text-petroleo-900">{p.titulo}</h3>
              <p className="mt-3 text-[1rem] leading-relaxed text-cinza">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Avaliacoes() {
  const { nota, avaliacoes } = CONFIG.google
  const temNota = nota !== null && avaliacoes !== null
  return (
    <section aria-labelledby="titulo-avaliacoes" className="py-20 sm:py-24">
      <div className="container-site">
        <div className="registro flex flex-col gap-8 border border-linha bg-marfim p-8 sm:p-10 md:flex-row md:items-center md:justify-between lg:p-12">
          <div>
            <p className="rotulo text-petroleo-600">Avaliações no Google</p>
            <h2 id="titulo-avaliacoes" className="mt-3 text-[1.75rem] leading-tight font-light text-petroleo-900 sm:text-[2.125rem]">
              {temNota ? (
                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="flex items-center gap-2 text-[3rem] leading-none">
                    {nota!.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                    <IconEstrela size={26} className="text-terracota" />
                  </span>
                  <span className="text-[1.125rem] text-cinza">{avaliacoes} avaliações</span>
                </span>
              ) : (
                <>
                  Veja o que dizem <em className="text-petroleo-700">no Google</em>.
                </>
              )}
            </h2>
            <p className="mt-3 max-w-md text-[1rem] text-cinza">
              As avaliações públicas ficam na ficha do laboratório no Google Maps.
            </p>
          </div>
          <a
            href={CONFIG.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-full border border-petroleo-700/35 px-6 text-[0.9375rem] font-semibold text-petroleo-800 transition-[border-color,scale] duration-200 hover:border-petroleo-700 active:scale-[0.97]"
          >
            Ver avaliações no Google
            <IconSetaDiagonal size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
