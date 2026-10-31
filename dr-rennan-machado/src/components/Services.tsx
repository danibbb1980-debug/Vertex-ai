import { CONFIG, type Atendimento } from '../config';
import { waAtendimento } from '../lib/whatsapp';
import { Reveal, TextReveal } from './Motion';
import { Arch, ArrowUpRight, Implant, Tooth, ToothRoot } from './Icons';

const ICONES: Record<Atendimento['icone'], typeof Tooth> = { clinico: Tooth, endo: ToothRoot, orto: Arch, implante: Implant };

/**
 * Cartões de atendimento com hover refinado: borda que esquenta para dourado,
 * anel que se expande a partir do ícone e seta que avança. Só transform/opacity.
 */
export function Services() {
  const lista = CONFIG.atendimentos;
  if (!lista.length) return null;
  return (
    <section id="atendimentos" aria-labelledby="atendimentos-titulo" className="relative bg-cream-sand/60 py-24 sm:py-32">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-thread="services">Atendimentos</p>
            <TextReveal id="atendimentos-titulo" className="h2 mt-5" parts={['Cuidado para cada ', { em: 'etapa', }, ' do sorriso.']} />
          </div>
          <p className="lead lg:col-span-5">
            Do check-up ao planejamento de tratamentos mais complexos, tudo começa por uma avaliação individual.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {lista.map((a, i) => {
            const Icon = ICONES[a.icone] ?? Tooth;
            return (
              <Reveal as="li" key={a.id} delay={(i % 2) * 110}>
                <article className="card group relative flex h-full flex-col overflow-hidden p-7 transition-[border-color,box-shadow] duration-500 hover:border-gold/70 hover:shadow-[0_30px_60px_-40px_rgba(126,92,18,.55)] sm:p-9">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 scale-50 rounded-full border border-gold/40 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 text-gold-deep transition-colors duration-500 group-hover:bg-ink group-hover:text-gold-light">
                      <Icon size={30} />
                    </span>
                    <span className="font-serif text-sm italic text-gold-deep">0{i + 1}</span>
                  </div>
                  <p className="mt-8 text-[0.7rem] font-semibold uppercase tracking-label text-gold-deep">{a.resumo}</p>
                  <h3 className="mt-2 text-[1.9rem] font-normal">{a.nome}</h3>
                  <p className="mt-4 leading-relaxed text-ink-muted">{a.descricao}</p>
                  <p className="mt-4 text-sm italic text-ink-muted">A indicação depende de avaliação individual.</p>
                  <div className="mt-auto pt-8">
                    <a
                      href={waAtendimento(a.assunto)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center gap-2 border-b border-ink/20 font-semibold text-ink transition-colors hover:border-gold-deep hover:text-gold-deep"
                    >
                      Perguntar sobre {a.nome.toLowerCase()}
                      <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
                      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
