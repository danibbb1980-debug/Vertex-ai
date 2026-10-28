import { PARA_QUEM } from '../content'
import { IconArrow } from './Icons'
import { SectionHead } from './SectionHead'

export function ParaQuem() {
  return (
    <section aria-labelledby="para-quem-titulo" className="py-24 md:py-32">
      <div className="shell">
        <SectionHead id="para-quem-titulo" eyebrow="Para quem" title="Talvez você esteja *aqui*." />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-soft)] border border-line bg-line sm:grid-cols-2">
          {PARA_QUEM.map((b, i) => (
            <li key={b.titulo} className="bg-ivory" data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
              <a
                href={`#atendimento-${b.alvo}`}
                className="group flex h-full flex-col justify-between gap-10 p-8 transition-colors duration-300 hover:bg-paper md:p-10"
              >
                <div>
                  <h3 className="text-[1.65rem] md:text-[1.9rem]">{b.titulo}</h3>
                  <p className="mt-3 max-w-[36ch] text-ink-2">{b.texto}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Ver {b.rotulo}
                  <IconArrow size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
