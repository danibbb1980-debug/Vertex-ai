import { CONFIG } from '../config'

const deslocamentos = ['lg:mt-0', 'lg:mt-28', 'lg:mt-10', 'lg:mt-40']
const larguras = [760, 760, 760, 760]

export function Espaco() {
  const fotos = CONFIG.fotos.filter((f) => f.src)
  if (!fotos.length) return null
  return (
    <section id="espaco" aria-labelledby="titulo-espaco" className="bg-areia">
      <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <p className="rotulo text-caramelo-queimado lg:col-span-12">O espaço</p>
          <h2 id="titulo-espaco" className="text-[clamp(2.4rem,6.4vw,4.6rem)] lg:col-span-7">
            Um lugar para <em className="not-italic text-caramelo-queimado">conversar</em> com calma.
          </h2>
          <p className="max-w-[26rem] text-cafe-suave lg:col-span-4 lg:col-start-9 lg:pb-2">
            {CONFIG.endereco.rua}, no bairro {CONFIG.endereco.bairro}, em {CONFIG.endereco.cidade}.
          </p>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-20 lg:grid-cols-4 lg:gap-x-8">
          {fotos.map((f, i) => (
            <li key={f.src} className={`${deslocamentos[i % 4]} ${i % 2 === 1 ? 'mt-14 lg:mt-0' : ''}`}>
              <figure>
                <div className="moldura-arco overflow-hidden bg-marfim">
                  <img
                    src={f.src}
                    alt={f.alt}
                    width={larguras[i % 4]}
                    height={1050}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/4.2] h-auto w-full object-cover"
                  />
                </div>
                {f.legenda && (
                  <figcaption className="mt-4 flex items-baseline gap-3 border-t border-fio pt-3 text-[0.92rem]">
                    <span className="num text-xs text-cafe-suave">{String(i + 1).padStart(2, '0')}</span>
                    {f.legenda}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
