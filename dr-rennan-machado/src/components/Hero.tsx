import { CONFIG } from '../config';
import { waLink } from '../lib/whatsapp';
import { TextReveal } from './Motion';
import { Seal } from './Seal';
import { Arrow, WhatsApp } from './Icons';

export function Hero() {
  const f = CONFIG.foto;
  return (
    <section id="inicio" className="relative overflow-hidden pb-16 pt-[calc(var(--banner-h)+104px)] sm:pb-24 lg:pt-[calc(var(--banner-h)+128px)]">
      {/* grid fino de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(126,92,18,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(126,92,18,.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(236,207,126,.35),transparent_65%)]" />

      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className={f ? 'lg:col-span-7' : 'lg:col-span-10'}>
          <p className="eyebrow fade-load" style={{ ['--d' as string]: '0ms' }}>
            {CONFIG.titulo} · {CONFIG.cidade} - {CONFIG.uf}
          </p>
          <TextReveal
            as="h1"
            mode="load"
            className="mt-6 text-[2.75rem] font-light leading-[1.02] sm:text-6xl lg:text-[5.1rem]"
            parts={['Planejamento claro para o seu ', { em: 'sorriso' }, '.']}
          />
          <p className="lead fade-load mt-7 max-w-xl" style={{ ['--d' as string]: '450ms' }}>
            Avaliação individual, explicações claras e atendimento com hora marcada, em {CONFIG.cidade}.
          </p>
          <div className="fade-load mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ['--d' as string]: '600ms' }}>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsApp size={20} /> Agendar minha avaliação
            </a>
            <a href="#atendimentos" className="btn btn-ghost group">
              Ver atendimentos <Arrow size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
          <div className="fade-load mt-12 flex items-center gap-4" style={{ ['--d' as string]: '750ms' }}>
            <span data-thread="start" className="block h-[84px] w-[84px] shrink-0">
              <Seal className="h-full w-full" />
            </span>
            <p className="text-sm leading-snug text-ink-muted">
              <span className="block font-serif text-lg text-ink">{CONFIG.nome}</span>
              {CONFIG.titulo} · {CONFIG.cro}
            </p>
          </div>
        </div>

        {f && (
          <div className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none">
            <div className="fade-load relative" style={{ ['--d' as string]: '200ms' }}>
              {/* moldura em arco + anel dourado deslocado */}
              <div aria-hidden="true" className="absolute -inset-3 rounded-t-full border border-gold/50 sm:-inset-4" />
              <div aria-hidden="true" className="absolute -right-6 top-10 h-24 w-24 rounded-full border border-gold sm:h-32 sm:w-32" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-cream-sand">
                <img
                  src={f.src}
                  srcSet={f.srcSet}
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 420px, 90vw"
                  width={f.width}
                  height={f.height}
                  alt={f.alt}
                  {...{ fetchpriority: "high" }}
                  decoding="async"
                  className="h-full w-full object-cover object-[50%_20%]"
                />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent" />
              </div>
              <p className="absolute -bottom-5 left-6 rounded-full border border-cream-line bg-cream-ivory px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-label text-gold-deep shadow-[0_12px_30px_-18px_rgba(30,25,19,.5)]">
                {CONFIG.cro}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
