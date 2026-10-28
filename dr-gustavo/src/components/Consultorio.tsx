import { PILARES } from '../content'
import { Confirmar } from './Confirmar'
import { IconAccess, IconCalendar, IconPlan } from './Icons'
import { SectionHead } from './SectionHead'

const ICONES = { calendar: IconCalendar, plan: IconPlan, access: IconAccess }

export function Consultorio() {
  return (
    <section id="consultorio" aria-labelledby="consultorio-titulo" className="py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <SectionHead
          id="consultorio-titulo"
          className="lg:col-span-5"
          eyebrow="O consultório"
          title="Um horário que é *seu*, do começo ao fim."
        />
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="lead space-y-5" data-reveal style={{ ['--d' as string]: '120ms' }}>
            <p>
              No consultório do Dr. Gustavo, o atendimento é com hora marcada. Cada consulta tem o seu tempo reservado,
              para ouvir com atenção, examinar com calma e explicar o que foi observado antes de qualquer decisão.
            </p>
            <p>
              Você entende o porquê de cada etapa, tira suas dúvidas e participa das escolhas do próprio tratamento.
            </p>
          </div>
        </div>
      </div>

      <div className="shell mt-16 md:mt-24">
        <p className="num mb-6 text-mute" data-reveal>
          Nossos compromissos
        </p>
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-soft)] border border-line bg-line lg:grid-cols-3">
          {PILARES.map((p, i) => {
            const Icon = ICONES[p.icone]
            return (
              <li key={p.n} className="bg-paper p-8 md:p-10" data-reveal style={{ ['--d' as string]: `${i * 110}ms` }}>
                <div className="flex items-center justify-between">
                  <Icon size={26} className="text-accent" />
                  <span className="num text-mute">{p.n}</span>
                </div>
                <h3 className="mt-10 text-[1.6rem]">{p.titulo}</h3>
                <p className="mt-3 text-[0.97rem] text-ink-2">
                  {'confirmar' in p && p.confirmar ? <Confirmar>{p.texto}</Confirmar> : p.texto}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
