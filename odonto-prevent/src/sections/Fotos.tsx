import { FOTOS } from '../lib/fotos'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { Revelar } from '../components/Revelar'

/** Aparece sozinha quando houver imagens em ./referencias/fotos/. */
export function Fotos() {
  if (FOTOS.length === 0) return null
  return (
    <section id="espaco" aria-labelledby="titulo-espaco" className="sobre-claro bg-gelo py-24 lg:py-32">
      <div className="container-site">
        <CabecalhoSecao id="titulo-espaco" rotulo="O espaço" titulo="Conheça a *clínica.*" />
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FOTOS.map((f, i) => (
            <Revelar key={f.url} como="li" atraso={(i % 3) * 0.06}>
              <img src={f.url} alt={f.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}
