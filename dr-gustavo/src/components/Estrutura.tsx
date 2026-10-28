import { CONFIG } from '../config'
import { Confirmar } from './Confirmar'
import { IconAccess, IconCalendar, IconCard, IconContactless } from './Icons'
import { SectionHead } from './SectionHead'

export function Estrutura() {
  const foto = CONFIG.fotos.consultorio
  return (
    <section aria-labelledby="estrutura-titulo" className="py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead
            id="estrutura-titulo"
            eyebrow="Estrutura e conforto"
            title="Pensado para receber *bem*."
            intro={<p>Informações práticas para planejar a sua visita.</p>}
          />
          <figure className="relative mt-12 aspect-[4/3] overflow-hidden rounded-[var(--radius-soft)] border border-line bg-sand" data-reveal>
            {foto ? (
              <img src={foto.src} alt={foto.alt} loading="lazy" decoding="async" className="size-full object-cover" />
            ) : (
              <>
                <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute inset-0 size-full text-ink/15" fill="none" preserveAspectRatio="xMidYMid slice">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <path key={i} d={`M ${40 + i * 30} 300 V ${150 - i * 4} a ${160 - i * 30} ${160 - i * 30} 0 0 1 ${320 - i * 60} 0 V 300`} stroke="currentColor" />
                  ))}
                </svg>
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-2 text-xs font-semibold text-mute">
                  Foto do consultório (substituir)
                </figcaption>
              </>
            )}
          </figure>
        </div>

        <div className="grid content-start gap-5 lg:col-span-6 lg:col-start-7">
          <div className="card p-8" data-reveal>
            <div className="flex items-center gap-4">
              <IconCalendar size={24} className="text-accent" />
              <h3 className="text-[1.5rem]">Atendimento com hora marcada</h3>
            </div>
            <p className="mt-3 text-ink-2">{CONFIG.observacaoHorario}</p>
          </div>
          <div className="card p-8" data-reveal style={{ ['--d' as string]: '80ms' }}>
            <div className="flex items-center gap-4">
              <IconAccess size={24} className="text-accent" />
              <h3 className="text-[1.5rem]">Acessibilidade</h3>
            </div>
            <ul className="mt-4 space-y-2 text-ink-2">
              {CONFIG.acessibilidade.map((a) => (
                <li key={a} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-accent" />
                  <Confirmar tag={false}>{a}</Confirmar>
                </li>
              ))}
            </ul>
            {CONFIG.marcarPendencias ? <p className="mt-3"><span className="confirmar-tag !ml-0">a confirmar</span></p> : null}
          </div>
          <div className="card p-8" data-reveal style={{ ['--d' as string]: '160ms' }}>
            <div className="flex items-center gap-4">
              <IconCard size={24} className="text-accent" />
              <h3 className="text-[1.5rem]">Formas de pagamento</h3>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {CONFIG.pagamentos.map((p) => (
                <li key={p} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-2">
                  {p.includes('aproximação') ? <IconContactless size={16} /> : <IconCard size={16} />}
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
