import { CONFIG, type Atendimento } from '../config'
import { msgAtendimento, waLink } from '../lib/whatsapp'
import { IconArrow, IllClinica, IllEstetica, IllImplante } from '../components/Icons'
import { Reveal, useSpotlight } from '../components/motion'
import { SectionHead } from '../components/SectionHead'

const ILL = { implante: IllImplante, estetica: IllEstetica, clinica: IllClinica }

function Card({ a, i }: { a: Atendimento; i: number }) {
  const { ref, onPointerMove } = useSpotlight<HTMLElement>()
  const Ill = ILL[a.icone]
  const link = waLink(msgAtendimento(a.nome))
  return (
    <Reveal delay={i * 0.1} className="h-full">
      <article
        ref={ref}
        onPointerMove={onPointerMove}
        className="card spotlight group flex h-full flex-col p-7 transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-copper/50 hover:shadow-[0_30px_60px_-40px_rgba(43,33,28,0.45)] md:p-9"
      >
        <div className="flex items-start justify-between">
          <div className="relative flex h-[7.5rem] w-24 items-center justify-center text-copper-ink">
            <svg viewBox="0 0 96 120" className="absolute inset-0 h-full w-full" aria-hidden>
              <ellipse
                cx="48"
                cy="60"
                rx="47"
                ry="59"
                fill="none"
                stroke="#C49A6C"
                strokeWidth="0.9"
                className="origin-center opacity-60 transition-[opacity,transform] duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04] group-hover:opacity-100"
                style={{ transformBox: 'fill-box' }}
              />
            </svg>
            <Ill className="h-16 w-16" />
          </div>
          <span className="font-serif text-lg italic text-copper-ink" aria-hidden>
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 className="mt-8 font-serif text-[2rem] leading-tight text-espresso">{a.nome}</h3>
        <p className="mt-2 font-medium text-espresso/80">{a.resumo}</p>
        <div className="rule my-6" aria-hidden />
        <p className="text-[0.975rem] leading-relaxed text-ink">{a.descricao}</p>
        <p className="mt-5 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-muted">A indicação depende de avaliação individual.</p>

        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="link-arrow mt-auto self-start pt-6">
            Conversar sobre {a.nome.toLowerCase()} <IconArrow />
          </a>
        )}
      </article>
    </Reveal>
  )
}

export function Atendimentos() {
  const lista = CONFIG.atendimentos
  if (!lista.length) return null
  return (
    <section id="atendimentos" aria-labelledby="atendimentos-titulo" className="relative bg-cream py-24 md:py-36">
      <div className="container-n">
        <div className="grid items-end gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHead eyebrow="Atendimentos" id="atendimentos-titulo" title="Atendimentos com *indicação* individual." />
          </div>
          <Reveal delay={0.1}>
            <p className="lead max-w-md md:ml-auto">
              Conheça as áreas atendidas na clínica. Cada tratamento é indicado somente após avaliação, com as etapas explicadas.
            </p>
          </Reveal>
        </div>

        <div className={`mt-16 grid gap-5 md:gap-6 ${lista.length >= 3 ? 'lg:grid-cols-3' : lista.length === 2 ? 'md:grid-cols-2' : ''}`}>
          {lista.map((a, i) => (
            <Card key={a.id} a={a} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
