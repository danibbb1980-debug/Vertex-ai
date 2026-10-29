import { useScrollProgress } from '../lib/useInView'
import { CONFIG } from '../config'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Formacao() {
  const ref = useScrollProgress<HTMLOListElement>(0.75, 0.55)
  if (CONFIG.formacao.length === 0) return null

  return (
    <section id="formacao" aria-labelledby="titulo-formacao" className="relative py-24 lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-40">
            <SectionHeading id="titulo-formacao" label="Formação" title="Uma trajetória dedicada à *Dentística*.">
              <p>
                Dentística é a área da odontologia que trata da restauração dos dentes: forma, função e aparência. É nela
                que se concentram o mestrado e o doutorado do {CONFIG.nomeCurto}.
              </p>
            </SectionHeading>
          </div>
        </div>

        <ol ref={ref} className="relative lg:col-span-7 lg:col-start-6">
          <div aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-sand/80" />
          <div aria-hidden="true" className="progress-y absolute bottom-3 left-[7px] top-3 w-px origin-top bg-teal-deep" />
          {CONFIG.formacao.map((f, i) => (
            <Reveal as="li" key={f.ano} delay={i * 0.06} className="relative pb-14 pl-12 last:pb-0 sm:pl-16">
              <span aria-hidden="true" className="absolute left-0 top-3 block size-[15px] border border-teal-deep bg-ivory">
                <span className="absolute inset-[3px] bg-teal" />
              </span>
              <p className="font-display text-[3.6rem] font-light leading-none text-ink/90 sm:text-[4.6rem]">{f.ano}</p>
              <h3 className="mt-4 text-[1.6rem] text-ink sm:text-[1.9rem]">{f.titulo}</h3>
              <p className="mt-2 text-[0.98rem] text-ink-soft">
                <span className="eyebrow mr-2 text-teal-deep">{f.sigla}</span>
                {f.instituicao}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
