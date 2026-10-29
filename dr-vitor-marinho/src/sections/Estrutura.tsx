import type { ReactNode } from 'react'
import { CONFIG } from '../config'
import { resumoHorarios } from '../lib/horarios'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { IconAccess, IconCalendar, IconCard, IconContactless, IconEmbrace, IconParking } from '../components/Icons'

export function Estrutura() {
  const e = CONFIG.estrutura
  const h = resumoHorarios()[0]
  const itens: { icon: ReactNode; t: string; d: ReactNode }[] = []
  if (e.acessibilidade) itens.push({ icon: <IconAccess />, t: 'Acessibilidade', d: e.acessibilidade })
  if (e.estacionamento) itens.push({ icon: <IconParking />, t: 'Estacionamento', d: e.estacionamento })
  if (e.pagamentos.length)
    itens.push({
      icon: <IconCard />,
      t: 'Formas de pagamento',
      d: (
        <ul className="space-y-1">
          {e.pagamentos.map((p) => (
            <li key={p} className="flex items-center gap-2">
              {/aproxima/i.test(p) ? <IconContactless className="size-4 text-teal-deep" /> : <span aria-hidden="true" className="block size-1.5 bg-sage" />}
              {p}
            </li>
          ))}
        </ul>
      ),
    })
  if (h) itens.push({ icon: <IconCalendar />, t: 'Com agendamento', d: `Atendimento com hora marcada: ${h.dias.toLowerCase()}, das ${h.horas}.` })

  return (
    <section aria-labelledby="titulo-estrutura" className="relative py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading id="titulo-estrutura" label="Estrutura e conforto" title="Detalhes que tornam a visita mais *tranquila*." />
        {CONFIG.fotos.consultorio.length > 0 && (
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG.fotos.consultorio.map((f) => (
              <Reveal as="li" key={f.src}>
                <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full border border-ink/10 object-cover" />
              </Reveal>
            ))}
          </ul>
        )}
        <ul className="mt-14 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map((it, i) => (
            <Reveal as="li" key={it.t} delay={i * 0.07} className="flex flex-col bg-ivory p-7">
              <span className="inline-flex size-12 items-center justify-center bg-mint/70 text-[1.5rem] text-teal-deep">{it.icon}</span>
              <h3 className="mt-7 font-sans text-[1.02rem] font-semibold tracking-[-0.005em] text-ink">{it.t}</h3>
              <div className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{it.d}</div>
            </Reveal>
          ))}
        </ul>
        {CONFIG.mostrarAcolhimento && CONFIG.acolhimento && (
          <Reveal className="mt-8 flex items-center gap-3 text-[0.95rem] text-ink-soft">
            <IconEmbrace className="size-5 shrink-0 text-teal-deep" />
            <p>{CONFIG.acolhimento}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
