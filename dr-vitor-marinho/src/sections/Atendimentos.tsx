import type { ComponentType, SVGProps } from 'react'
import { CONFIG } from '../config'
import { waLink } from '../lib/whatsapp'
import { cn } from '../lib/cn'
import { SectionHeading } from '../components/SectionHeading'
import { SpotlightCard } from '../components/SpotlightCard'
import { Reveal } from '../components/Reveal'
import {
  IconArrowUpRight,
  IlluEstetica,
  IlluImplante,
  IlluProteseFixa,
  IlluRemovivel,
  IlluRestauracao,
} from '../components/Icons'

const ILLU: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  'restauracoes-diretas': IlluRestauracao,
  'odontologia-estetica': IlluEstetica,
  'protese-fixa': IlluProteseFixa,
  'proteses-sobre-implante': IlluImplante,
  'proteses-removiveis-totais': IlluRemovivel,
}

export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (lista.length === 0) return null
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative bg-ivory-2/70 py-24 lg:py-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="titulo-atendimentos" label="Atendimentos" title="O que é feito no *consultório*.">
            <p>
              Cada tratamento começa por uma avaliação. As descrições abaixo são informativas: a indicação de cada caso é
              feita na consulta.
            </p>
          </SectionHeading>
        </div>

        <ul className="mt-16 grid gap-4 md:grid-cols-6">
          {lista.map((a, i) => {
            const Illu = ILLU[a.id]
            const big = i < 2
            return (
              <Reveal as="li" key={a.id} delay={(i % 3) * 0.08} className={cn(big ? 'md:col-span-3' : 'md:col-span-2')}>
                <SpotlightCard id={`atendimento-${a.id}`} className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-sm italic text-teal-deep">{String(i + 1).padStart(2, '0')}</span>
                    {Illu && (
                      <Illu
                        className={cn(
                          'text-teal-deep transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:rotate-[-3deg]',
                          big ? 'size-20' : 'size-16',
                        )}
                      />
                    )}
                  </div>
                  <h3 className={cn('mt-8 text-ink', big ? 'text-[2rem]' : 'text-[1.6rem]')}>{a.titulo}</h3>
                  <p className="mt-2 font-display text-[1.05rem] italic text-teal-deep">{a.resumo}</p>
                  <p className="mt-4 text-[0.97rem] leading-relaxed text-ink-soft">{a.descricao}</p>
                  <p className="mt-5 flex items-center gap-2 text-[0.8rem] font-medium text-ink-soft">
                    <span aria-hidden="true" className="block size-1.5 bg-sage" />
                    Depende de avaliação individual.
                  </p>
                  <div className="mt-auto pt-8">
                    <a
                      href={waLink(a.mensagem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 border-t border-ink/15 pt-4 text-[0.92rem] font-semibold text-teal-deep transition-colors hover:text-teal-ink"
                    >
                      Conversar sobre este atendimento
                      <IconArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      <span className="sr-only">: {a.titulo} (abre o WhatsApp)</span>
                    </a>
                  </div>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
