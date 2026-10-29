import type { CSSProperties } from 'react'
import { useScrollProgress } from '../lib/useInView'
import { CONFIG } from '../config'
import { SectionHeading } from '../components/SectionHeading'

const ETAPAS = [
  { t: 'Contato pelo WhatsApp e agendamento', d: `Você envia uma mensagem e combina dia e horário com a equipe do ${CONFIG.nomeCurto}.` },
  { t: 'Avaliação e escuta', d: 'Na consulta, o que você sente e o que deseja vêm primeiro. Depois, o exame cuidadoso.' },
  { t: 'Planejamento explicado com clareza', d: 'As possibilidades de tratamento são apresentadas em linguagem simples, para você decidir com segurança.' },
  { t: 'Tratamento e acompanhamento', d: 'As etapas seguem o que foi combinado, com retornos para acompanhar cada fase.' },
]

function Etapa({ i, t, d }: { i: number; t: string; d: string }) {
  return (
    <li className="relative pl-14 lg:pl-0 lg:pt-16">
      <div aria-hidden="true" className="absolute left-0 top-0 size-9 border border-ink/20 bg-ivory lg:left-0">
        <span className="step-fill absolute inset-[5px] origin-center bg-teal-deep" style={{ '--a': i / ETAPAS.length } as CSSProperties} />
      </div>
      <div>
        <span className="eyebrow text-teal-deep">Etapa {String(i + 1).padStart(2, '0')}</span>
        <h3 className="mt-3 text-[1.55rem] leading-snug text-ink">{t}</h3>
        <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-soft">{d}</p>
      </div>
    </li>
  )
}

export function ComoFunciona() {
  const ref = useScrollProgress<HTMLDivElement>(0.8, 0.6)
  return (
    <section id="como-funciona" aria-labelledby="titulo-como" className="relative overflow-hidden bg-ivory-2/70 py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading id="titulo-como" label="Como funciona" title="Do primeiro contato ao *acompanhamento*.">
          <p>Um caminho simples, combinado com você em cada etapa.</p>
        </SectionHeading>

        <div ref={ref} className="relative mt-16 lg:mt-24">
          <div aria-hidden="true" className="absolute bottom-0 left-[17.5px] top-0 w-px bg-sand lg:bottom-auto lg:left-0 lg:right-0 lg:top-[17.5px] lg:h-px lg:w-auto" />
          <div aria-hidden="true" className="progress-y absolute bottom-0 left-[17.5px] top-0 w-px origin-top bg-teal-deep lg:hidden" />
          <div aria-hidden="true" className="progress-x absolute left-0 right-0 top-[17.5px] hidden h-px origin-left bg-teal-deep lg:block" />
          <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-10">
            {ETAPAS.map((e, i) => (
              <Etapa key={e.t} i={i} t={e.t} d={e.d} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
