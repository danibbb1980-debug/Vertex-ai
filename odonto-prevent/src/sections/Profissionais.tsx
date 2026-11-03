import { CONFIG } from '../config'
import { CabecalhoSecao } from '../components/CabecalhoSecao'
import { CartaoLuz } from '../components/CartaoLuz'
import { Revelar } from '../components/Revelar'

/** Só aparece quando houver dentistas com nome e CRO no config. */
export function Profissionais() {
  const lista = CONFIG.profissionais.filter((p) => p.nome && p.cro)
  if (lista.length === 0) return null
  return (
    <section id="equipe" aria-labelledby="titulo-equipe" className="sobre-claro bg-white py-24 lg:py-32">
      <div className="container-site">
        <CabecalhoSecao id="titulo-equipe" rotulo="Equipe" titulo="Quem *cuida* de você." />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, i) => (
            <Revelar key={p.cro} como="li" atraso={i * 0.06}>
              <CartaoLuz como="div" className="h-full p-7">
                <h3 className="text-2xl text-tinta">{p.nome}</h3>
                <p className="rotulo mt-2 text-[0.7rem] text-menta-texto">{p.cro}</p>
                {p.formacao && <p className="mt-4 leading-relaxed text-tinta-suave">{p.formacao}</p>}
              </CartaoLuz>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}
