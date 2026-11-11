import { CONFIG } from '../config'
import { TituloEnfase } from './Enfase'

/** Texto grande intercalado com fios e numeração editorial. */
export function Espaco() {
  return (
    <section id="espaco" aria-labelledby="titulo-espaco" className="mx-auto max-w-[84rem] px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
      <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <p className="rotulo text-terracota-texto lg:col-span-3 lg:pt-4">O espaço</p>
        <div className="lg:col-span-9">
          <h2 id="titulo-espaco" className="text-[clamp(2.4rem,5.6vw,4.6rem)] text-tinta">
            <TituloEnfase texto="Diferentes áreas da saúde, no mesmo *lugar*." />
          </h2>
          <div className="mt-8 grid gap-6 text-[1.075rem] text-tinta-suave sm:grid-cols-2 sm:gap-10">
            <p>
              O {CONFIG.nome} é um espaço multiprofissional em {CONFIG.cidade}. Profissionais de diferentes áreas atendem
              no mesmo endereço, cada um na sua área de formação, com hora marcada.
            </p>
            <p>
              Todo atendimento começa por uma avaliação individual. É a partir dela que se define, junto com você, o que
              faz sentido para o seu momento.
            </p>
          </div>
        </div>
      </div>

      {CONFIG.dimensoes.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <p className="rotulo mb-6 text-tinta-suave">Três dimensões do cuidado, que caminham juntas</p>
          <ol className="grid border-t border-tinta/70 md:grid-cols-3">
            {CONFIG.dimensoes.map((d, i) => (
              <li
                key={d.nome}
                className="grid grid-cols-[auto_1fr] items-start gap-x-6 border-b border-fio py-8 md:block md:border-b-0 md:border-l md:px-8 md:py-10 md:first:border-l-0 md:first:pl-0"
              >
                <span className="num block text-[4.5rem] text-terracota md:text-[7rem]" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="md:mt-8">
                  <h3 className="text-[1.9rem] text-tinta">{d.nome}</h3>
                  <p className="mt-2 max-w-[22rem] text-tinta-suave">{d.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
