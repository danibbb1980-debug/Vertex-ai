import { CONFIG } from '../config'
import { IconAccess, IconClock, IconPlan } from '../components/Icons'
import { OvalFrame, Reveal, Stagger, StaggerItem } from '../components/motion'
import { Picture } from '../components/Picture'
import { SectionHead } from '../components/SectionHead'

const PILARES = [
  {
    icon: IconPlan,
    titulo: 'Planejamento caso a caso',
    texto: 'Cada plano parte da sua avaliação, e não de um roteiro pronto.',
  },
  {
    icon: IconClock,
    titulo: 'Hora marcada',
    texto: 'Agenda organizada para que a consulta aconteça com calma.',
  },
  {
    icon: IconAccess,
    titulo: 'Acessibilidade',
    texto: 'Entrada, assento e banheiro acessíveis para pessoas em cadeira de rodas.',
  },
]

export function Clinica() {
  const [, f1, f2] = CONFIG.fotos
  const temFotos = Boolean(f1 || f2)
  return (
    <section aria-labelledby="clinica-titulo" id="clinica" className="relative py-24 md:py-36">
      <div className={`container-n grid gap-16 ${temFotos ? 'lg:grid-cols-[1fr_0.85fr] lg:gap-24' : ''}`}>
        <div>
          <div>
            <SectionHead eyebrow="A clínica" id="clinica-titulo" title="Um consultório que *explica* antes de tratar.">
              <p>
                Na {CONFIG.nome}, o atendimento começa pela escuta. Avaliamos cada caso individualmente, explicamos as opções com clareza e organizamos
                a agenda com hora marcada, para que a consulta aconteça sem pressa.
              </p>
              <p className="mt-4">O espaço recebe bem a todos, com acessibilidade para pessoas em cadeira de rodas.</p>
            </SectionHead>
          </div>

          <Stagger className={`mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line ${temFotos ? '' : 'md:grid-cols-3'}`}>
            {PILARES.map(({ icon: Icon, titulo, texto }) => (
              <StaggerItem key={titulo} className="flex gap-5 bg-paper p-6 md:p-7">
                <span className="relative flex h-14 w-11 shrink-0 items-center justify-center text-copper-ink">
                  <svg viewBox="0 0 44 56" className="absolute inset-0 h-full w-full" aria-hidden>
                    <ellipse cx="22" cy="28" rx="21" ry="27" fill="none" stroke="#C49A6C" strokeWidth="0.8" />
                  </svg>
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-serif text-[1.5rem] leading-tight text-espresso">{titulo}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{texto}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {temFotos && (
          <div className="relative mx-auto w-full max-w-md lg:mt-10">
            {f1 && (
              <Reveal y={40} className="relative ml-auto w-[78%]">
                <div className="relative aspect-[200/260]">
                  <div className="absolute inset-[4%] overflow-hidden rounded-[50%] bg-sand">
                    <Picture foto={f1} sizes="(min-width: 1024px) 22rem, 70vw" className="h-full w-full object-cover object-[50%_25%]" />
                  </div>
                  <OvalFrame id="cl-oval-1" draw={false} className="absolute inset-0 h-full w-full" />
                </div>
              </Reveal>
            )}
            {f2 && (
              <Reveal y={60} delay={0.15} className="relative -mt-[38%] w-[52%]">
                <div className="relative aspect-[200/260]">
                  <div className="absolute inset-[5%] overflow-hidden rounded-[50%] border-[6px] border-paper bg-sand shadow-[0_30px_60px_-30px_rgba(43,33,28,0.45)]">
                    <Picture foto={f2} sizes="(min-width: 1024px) 15rem, 46vw" className="h-full w-full object-cover object-[50%_20%]" />
                  </div>
                  <OvalFrame id="cl-oval-2" draw={false} className="absolute inset-0 h-full w-full" style={{ transform: 'rotate(8deg)' }} />
                </div>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
