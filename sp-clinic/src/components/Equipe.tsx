import { equipe, linhaRegistro, type Profissional } from '../config'

/*
 * Equipe: cada pessoa dentro de uma "porta" em traço fino, como o arco do logo.
 * O avatar ocupa o lugar do monograma (no centro do semicírculo) e o nome fica na base
 * da porta, como uma placa. Portas de alturas diferentes e desencontradas (não são cartões).
 * Só mostra cargo, profissão e registro quando informados em CONFIG.profissionais.
 */
export function Equipe() {
  const lista = equipe()
  if (!lista.length) return null
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="bg-marfim">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo text-caramelo-queimado">Equipe</p>
            <h2 id="titulo-equipe" className="mt-5 text-[clamp(2.4rem,6vw,4.2rem)]">
              Quem está por trás da <em className="not-italic text-caramelo-queimado">porta</em>.
            </h2>
          </div>
        </div>
        <ul className="grid gap-16 sm:grid-cols-2 sm:gap-8 lg:col-span-8 lg:gap-12">
          {lista.map((p, i) => (
            <Pessoa key={p.nome} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function Pessoa({ p, i }: { p: Profissional; i: number }) {
  const alta = i % 2 === 0
  const registro = linhaRegistro(p)
  const rotulo = [p.cargo, p.profissao].filter((x) => x?.trim()).join(' · ')
  return (
    <li
      className={`${
        alta ? 'w-[86%] sm:w-full' : 'ml-auto w-[76%] sm:ml-0 sm:mt-40 sm:w-[88%] sm:justify-self-end'
      }`}
    >
      <figure className="relative">
        {/* a porta: arco fino com base aberta, como no logo */}
        <div
          className={`moldura-arco relative border border-b-0 border-cafe/35 ${
            alta ? 'aspect-[3/4.75]' : 'aspect-[3/4.45]'
          }`}
        >
          <span aria-hidden="true" className="moldura-arco absolute inset-3 border border-b-0 border-caramelo/60" />
          {p.foto && (
            // janela redonda concêntrica ao topo da porta (mt em % = % da largura)
            <div className="absolute inset-x-[8%] top-0 mt-[8%] aspect-square overflow-hidden rounded-full ring-1 ring-caramelo ring-offset-[6px] ring-offset-marfim">
              <img
                src={p.foto}
                alt={`Retrato de ${p.nome}`}
                width={760}
                height={760}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-7 sm:pb-8">
            <span aria-hidden="true" className="num mb-4 block text-xs text-cafe-suave">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-[clamp(2rem,4.4vw,3rem)] leading-[0.98]">{p.nome}</h3>
            {rotulo && <p className="rotulo mt-4 border-t border-fio pt-3 text-caramelo-queimado">{rotulo}</p>}
            {registro && <p className="num mt-2 text-[0.92rem] text-cafe-suave">{registro}</p>}
            {p.especialidade?.titulo && p.especialidade.registro && (
              <p className="mt-1 text-[0.92rem] text-cafe-suave">
                {p.especialidade.titulo} · <span className="num">{p.especialidade.registro}</span>
              </p>
            )}
          </figcaption>
        </div>
      </figure>
    </li>
  )
}
