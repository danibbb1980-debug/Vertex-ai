import { CONFIG } from '../config'
import { OvalFrame, Reveal } from '../components/motion'
import { Picture } from '../components/Picture'
import { SectionHead } from '../components/SectionHead'

/** Só aparece quando CONFIG.profissionais tiver ao menos um nome. */
export function Equipe() {
  const lista = CONFIG.profissionais.filter((p) => p.nome.trim())
  if (!lista.length) return null
  return (
    <section aria-labelledby="equipe-titulo" className="bg-cream py-24 md:py-36">
      <div className="container-n">
        <SectionHead eyebrow="Equipe" id="equipe-titulo" title="Quem *cuida* do seu atendimento." />
        <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p, i) => (
            <Reveal as="li" key={p.nome} delay={i * 0.1}>
              {p.foto && (
                <div className="relative mx-auto mb-8 aspect-[200/260] w-3/4">
                  <div className="absolute inset-[5%] overflow-hidden rounded-[50%] bg-sand">
                    <Picture foto={p.foto} sizes="20rem" className="h-full w-full object-cover" />
                  </div>
                  <OvalFrame id={`eq-${i}`} draw={false} className="absolute inset-0 h-full w-full" />
                </div>
              )}
              <h3 className="font-serif text-[1.75rem] text-espresso">{p.nome}</h3>
              {p.formacao && <p className="mt-1 text-ink">{p.formacao}</p>}
              {p.cro && <p className="eyebrow mt-3 text-[0.6875rem]">{p.cro}</p>}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
