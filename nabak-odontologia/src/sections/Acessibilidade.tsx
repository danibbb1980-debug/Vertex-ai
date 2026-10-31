import type { ComponentType, SVGProps } from 'react'
import { CONFIG } from '../config'
import { IconAccess, IconCalendar, IconCard, IconCheck, IconContactless } from '../components/Icons'
import { Reveal } from '../components/motion'
import { SectionHead } from '../components/SectionHead'

type Bloco = { titulo: string; icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>; itens: string[] }

export function Acessibilidade() {
  const blocos: Bloco[] = [
    { titulo: 'Acessibilidade', icon: IconAccess, itens: CONFIG.acessibilidade },
    { titulo: 'Estrutura', icon: IconCalendar, itens: CONFIG.estrutura },
    { titulo: 'Formas de pagamento', icon: IconCard, itens: CONFIG.pagamentos },
  ].filter((b) => b.itens.length > 0)
  if (!blocos.length) return null

  return (
    <section aria-labelledby="acess-titulo" className="py-24 md:py-36">
      <div className="container-n">
        <SectionHead eyebrow="Acessibilidade e estrutura" id="acess-titulo" title="Um espaço preparado para *receber* bem.">
          <p>Informações práticas para planejar a sua visita.</p>
        </SectionHead>

        <div className={`mt-16 grid gap-5 md:gap-6 ${blocos.length === 3 ? 'md:grid-cols-3' : blocos.length === 2 ? 'md:grid-cols-2' : ''}`}>
          {blocos.map(({ titulo, icon: Icon, itens }, i) => (
            <Reveal key={titulo} delay={i * 0.1} className="card relative overflow-hidden p-7 md:p-9">
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-40 w-32 rounded-[50%] border border-copper/35" />
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-copper-ink">
                <Icon size={22} />
              </span>
              <h3 className="mt-6 font-serif text-[1.75rem] leading-tight text-espresso">{titulo}</h3>
              <div className="rule my-5" aria-hidden />
              <ul className="space-y-3">
                {itens.map((it) => (
                  <li key={it} className="flex gap-3 text-[0.975rem] leading-snug text-ink">
                    {titulo === 'Formas de pagamento' && /aproxima/i.test(it) ? (
                      <IconContactless size={18} className="mt-0.5 shrink-0 text-copper-ink" />
                    ) : (
                      <IconCheck size={18} className="mt-0.5 shrink-0 text-copper-ink" />
                    )}
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
