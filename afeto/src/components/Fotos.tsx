import { CONFIG, type Foto } from '../config'

/* Recortes inspirados nos segmentos do logo: arco, quarto de círculo, gota. */
const RECORTES = [
  'rounded-[2rem] rounded-tl-[50%]',
  'rounded-t-full rounded-b-[2rem]',
  'rounded-[2rem] rounded-br-[45%]',
  'rounded-[2rem] rounded-tr-[50%]',
  'rounded-[2rem] rounded-bl-[45%]',
  'rounded-b-full rounded-t-[2rem]',
]
/* Composição assimétrica em 12 colunas (desktop). Repete se houver mais fotos. */
const SPANS = [
  'lg:col-span-7',
  'lg:col-span-5 lg:mt-24',
  'lg:col-span-4',
  'lg:col-span-4 lg:mt-16',
  'lg:col-span-4 lg:-mt-10',
  'lg:col-span-6 lg:col-start-4',
]

function Figura({ f, i }: { f: Foto; i: number }) {
  const largo = f.largura > f.altura
  return (
    <figure className={`${SPANS[i % SPANS.length]} ${largo ? 'col-span-2' : 'col-span-1'} sm:col-span-1`}>
      <div className={`overflow-hidden bg-salvia-clara ${RECORTES[i % RECORTES.length]}`}>
        <img
          src={f.src}
          alt={f.alt}
          width={f.largura}
          height={f.altura}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
      {f.legenda && (
        <figcaption className="mt-3 flex items-baseline gap-3 text-[0.9rem] text-tinta-suave">
          <span className="num text-[1rem] text-terracota-texto">{String(i + 1).padStart(2, '0')}</span>
          {f.legenda}
        </figcaption>
      )}
    </figure>
  )
}

export function Fotos() {
  const fotos = CONFIG.fotos.filter((f) => f.src && f.alt)
  if (!fotos.length) return null
  return (
    <section aria-labelledby="titulo-fotos" className="mx-auto max-w-[84rem] px-4 pb-20 sm:px-6 lg:px-10 lg:pb-32">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="titulo-fotos" className="text-[clamp(2rem,4.2vw,3.2rem)] text-tinta">
          Por dentro do espaço
        </h2>
        <p className="max-w-[24rem] text-[0.95rem] text-tinta-suave">
          Algumas das salas onde acontecem os atendimentos.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12">
        {fotos.map((f, i) => (
          <Figura key={f.src} f={f} i={i} />
        ))}
      </div>
    </section>
  )
}
