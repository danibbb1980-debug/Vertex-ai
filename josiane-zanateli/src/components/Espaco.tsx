import { CONFIG } from '../config'
import { Enfase } from './ui'
import { resumoHorarios } from '../horarios'

export function Espaco() {
  const linhas = [
    { titulo: 'Atendimento *individual*.', texto: 'Cada horário é reservado para uma pessoa.' },
    { titulo: 'De segunda a *sábado*.', texto: resumoHorarios() },
    { titulo: `No Centro de *${CONFIG.cidade}*.`, texto: `${CONFIG.endereco.logradouro}.` },
  ]
  return (
    <section id="espaco" aria-labelledby="titulo-espaco" className="on-musgo grao relative bg-musgo text-areia">
      <div className="relative z-[2] mx-auto max-w-[1320px] px-5 py-24 sm:px-8 lg:py-36">
        <h2 id="titulo-espaco" className="rotulo text-terracota-clara">
          O espaço
        </h2>
        <ul className="mt-10 border-t border-areia/20">
          {linhas.map((l, i) => (
            <li
              key={i}
              className="grid grid-cols-12 items-end gap-x-6 gap-y-3 border-b border-areia/20 py-9 lg:py-12"
            >
              <p
                className={`col-span-12 font-display text-[clamp(2.1rem,6vw,4.8rem)] leading-[1] tracking-[-0.03em] lg:col-span-8 ${
                  ['', 'lg:col-start-2', 'lg:col-start-3'][i]
                }`}
              >
                <Enfase texto={l.titulo} />
              </p>
              <p
                className={`col-span-12 max-w-[30ch] text-[1rem] text-areia-suave lg:col-span-3 lg:pb-2 ${
                  ['lg:col-start-10', 'lg:col-start-10', 'lg:col-start-10'][i]
                }`}
              >
                {l.texto}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
