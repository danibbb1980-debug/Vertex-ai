import { antesDeAgendar } from '../content'
import { CabecalhoSecao, Revelar } from './ui'

export function AntesDeAgendar() {
  if (!antesDeAgendar.length) return null
  return (
    <section id="antes-de-agendar" aria-labelledby="titulo-antes" className="py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <CabecalhoSecao
              id="titulo-antes"
              rotulo="Antes de agendar"
              titulo={
                <>
                  Algumas orientações <em>gerais</em>.
                </>
              }
            >
              <p>Informações simples para o seu primeiro contato.</p>
            </CabecalhoSecao>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ol className="divide-y divide-choco/12 border-y border-choco/12">
            {antesDeAgendar.map((item, i) => (
              <Revelar como="li" key={item.titulo} atraso={i * 0.05} className="grid grid-cols-[3rem_1fr] gap-4 py-7 md:grid-cols-[4.5rem_1fr]">
                <span aria-hidden="true" className="font-serif text-[1.6rem] italic leading-none text-ouro">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-[1.35rem] leading-snug text-choco">{item.titulo}</h3>
                  <p className="mt-2 text-choco/85">{item.texto}</p>
                </div>
              </Revelar>
            ))}
          </ol>
          <p className="mt-8 font-serif text-[1.2rem] italic text-ouro-esc">As orientações são dadas no atendimento.</p>
        </div>
      </div>
    </section>
  )
}
