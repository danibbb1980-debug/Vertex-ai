import { CONFIG } from '../config';
import { Reveal, Rings, TextReveal } from './Motion';
import { Document, Ear, Compass } from './Icons';

const PRINCIPIOS = [
  { Icon: Ear, t: 'Escuta', d: 'A consulta começa pelo que você sente, pelo que incomoda e pelo que você espera do tratamento.' },
  { Icon: Document, t: 'Explicações claras', d: 'Cada achado é mostrado e explicado em linguagem simples, com as possibilidades de tratamento.' },
  { Icon: Compass, t: 'Planejamento individual', d: 'As etapas são definidas para o seu caso, no seu tempo, com espaço para dúvidas.' },
];

export function Dentist() {
  const foto = CONFIG.fotoSecundaria ?? null;
  const esp = CONFIG.mostrarEspecialidades ? CONFIG.especialidades.filter((e) => e.nome && e.registro) : [];
  return (
    <section id="dentista" aria-labelledby="dentista-titulo" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-5">
          {foto ? (
            <Reveal className="relative mx-auto max-w-[400px] lg:sticky lg:top-36">
              <Rings className="absolute -left-5 -top-5 h-[calc(100%+40px)] w-[calc(100%+40px)] text-gold sm:-left-8 sm:-top-8 sm:h-[calc(100%+64px)] sm:w-[calc(100%+64px)]" />
              <div className="relative aspect-square overflow-hidden rounded-full bg-cream-sand">
                <img
                  src={foto.src}
                  srcSet={foto.srcSet}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 400px, calc(100vw - 80px)"
                  width={foto.width}
                  height={foto.height}
                  alt={foto.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[55%_25%]"
                />
              </div>
            </Reveal>
          ) : (
            <Reveal className="relative mx-auto flex aspect-square max-w-[400px] items-center justify-center">
              <Rings strong className="absolute inset-0 h-full w-full text-gold" />
              <p className="text-center font-serif text-[5.5rem] font-light leading-none text-ink">
                R<em className="enfase">M</em>
              </p>
            </Reveal>
          )}
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow">O dentista</p>
          <TextReveal id="dentista-titulo" className="h2 mt-5" parts={[CONFIG.nome.replace(/\s\S+$/, ' '), { em: CONFIG.nome.split(' ').pop() ?? '' }]} />
          <p className="mt-4 text-[0.78rem] font-semibold uppercase tracking-label text-gold-deep">
            {CONFIG.titulo} · {CONFIG.cro}
          </p>
          {esp.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {esp.map((e) => (
                <li key={e.nome} className="rounded-full border border-gold/50 px-4 py-2 text-sm text-ink-soft">
                  Especialista em {e.nome} · Registro {e.registro}
                </li>
              ))}
            </ul>
          )}
          <Reveal>
            <p className="mt-8 font-serif text-2xl font-light leading-snug text-ink sm:text-[1.75rem]">
              Um bom tratamento começa por uma boa conversa.
            </p>
            <p className="lead mt-5 max-w-2xl">
              Antes de qualquer procedimento, o {CONFIG.nomeCurto} explica o que observou, quais são as possibilidades e o
              que esperar de cada etapa. A ideia é simples: você entende o próprio caso e decide com tranquilidade.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-cream-line bg-cream-line sm:grid-cols-3">
            {PRINCIPIOS.map(({ Icon, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 90} className="bg-cream-ivory p-7">
                <Icon size={28} className="text-gold-deep" />
                <h3 className="mt-5 text-xl">{t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{d}</p>
              </Reveal>
            ))}
          </ul>

          {CONFIG.formacao.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl">Formação</h3>
              <ul className="mt-4 space-y-2 text-ink-muted">
                {CONFIG.formacao.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-[0.7em] h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
