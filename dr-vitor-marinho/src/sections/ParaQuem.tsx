import { CONFIG } from '../config'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { IconArrow } from '../components/Icons'
import { scrollToHash } from '../lib/scroll'

const BLOCOS = [
  {
    t: 'Para quem precisa restaurar um dente',
    d: 'Cárie, fratura, desgaste ou uma restauração antiga que precisa ser refeita.',
    alvo: 'restauracoes-diretas',
  },
  {
    t: 'Para quem quer cuidar da estética do sorriso',
    d: 'Forma, cor e proporção dos dentes, avaliadas sempre a partir da saúde bucal.',
    alvo: 'odontologia-estetica',
  },
  {
    t: 'Para quem precisa repor dentes',
    d: 'Prótese fixa, removível, total ou sobre implante, conforme o que a avaliação indicar.',
    alvo: 'protese-fixa',
  },
]

export function ParaQuem() {
  const ids = new Set(CONFIG.atendimentos.map((a) => a.id))
  const blocos = BLOCOS.filter((b) => ids.has(b.alvo))
  if (blocos.length === 0) return null
  return (
    <section aria-labelledby="titulo-para-quem" className="relative py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading id="titulo-para-quem" label="Para quem" title="Talvez você esteja *procurando* por isto." />
        <ul className="mt-14 border-t border-ink/15">
          {blocos.map((b, i) => (
            <Reveal as="li" key={b.alvo} delay={i * 0.06} className="border-b border-ink/15">
              <a
                href={`#atendimento-${b.alvo}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToHash(`#atendimento-${b.alvo}`)
                }}
                className="group grid items-center gap-3 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10"
              >
                <span className="font-display text-sm italic text-teal-deep sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-[1.65rem] leading-tight text-ink transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-2 sm:col-span-6 sm:text-[2.1rem]">
                  {b.t}
                </span>
                <span className="text-ink-soft sm:col-span-4">{b.d}</span>
                <span aria-hidden="true" className="hidden size-12 items-center justify-center border border-ink/15 text-teal-deep transition-colors duration-300 group-hover:border-teal-deep group-hover:bg-teal-deep group-hover:text-paper sm:col-span-1 sm:flex sm:justify-self-end">
                  <IconArrow className="size-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
