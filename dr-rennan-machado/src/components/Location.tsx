import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { linhasHorario } from '../lib/horarios';
import { waLink } from '../lib/whatsapp';
import { Reveal, TextReveal } from './Motion';
import { ArrowUpRight, Clock, Instagram, Pin, WhatsApp } from './Icons';

/** Mapa do Google carregado só quando a seção se aproxima da tela. */
function LazyMap({ query }: { query: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-full min-h-[340px] overflow-hidden rounded-[1.75rem] border border-cream-line bg-cream-sand">
      {/* ilustração de traço enquanto o mapa carrega */}
      <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-gold-deep/30">
        <path d="M-10 80 Q120 60 200 120 T410 140M60 -10 Q90 150 40 310M250 -10 Q230 160 300 310M-10 230 Q180 200 410 250" fill="none" stroke="currentColor" />
        <circle cx="200" cy="140" r="28" fill="none" stroke="#D9AE3F" />
        <circle cx="200" cy="140" r="4" fill="#7E5C12" />
      </svg>
      {load && (
        <iframe
          title={`Mapa: ${CONFIG.endereco.rua}, ${CONFIG.endereco.cidade}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 [filter:sepia(.25)_saturate(.85)]"
        />
      )}
    </div>
  );
}

export function Location() {
  const e = CONFIG.endereco;
  const horas = linhasHorario();
  const q = `${e.rua} - ${e.bairro}, ${e.cidade} - ${e.uf}, ${e.cep}`;
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="py-24 sm:py-32">
      <div className="wrap">
        <p className="eyebrow" data-thread="contact">Localização e contato</p>
        <TextReveal id="contato-titulo" className="h2 mt-5" parts={['Venha nos ', { em: 'visitar' }, '.']} />
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="card flex flex-col gap-8 p-8 sm:p-10 lg:col-span-5">
            <div className="flex gap-4">
              <Pin size={26} className="mt-1 shrink-0 text-gold-deep" />
              <div>
                <h3 className="text-xl">Endereço</h3>
                <address className="mt-2 not-italic leading-relaxed text-ink-muted">
                  {e.rua} · {e.bairro}
                  <br />
                  {e.cidade} - {e.uf} · CEP {e.cep}
                </address>
                <a
                  href={CONFIG.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-[48px] items-center gap-2 font-semibold text-ink underline decoration-gold decoration-1 underline-offset-[6px] hover:text-gold-deep"
                >
                  Como chegar <ArrowUpRight size={18} />
                  <span className="sr-only">(abre o Google Maps em nova aba)</span>
                </a>
              </div>
            </div>
            {horas.length > 0 && (
              <div className="flex gap-4">
                <Clock size={26} className="mt-1 shrink-0 text-gold-deep" />
                <div className="w-full">
                  <h3 className="text-xl">Horários</h3>
                  <dl className="mt-3 divide-y divide-cream-line">
                    {horas.map((h) => (
                      <div key={h.dias} className="flex justify-between gap-4 py-2.5">
                        <dt className="text-ink-soft">{h.dias}</dt>
                        <dd className={h.texto === 'fechado' ? 'text-ink-muted' : 'font-semibold text-ink'}>
                          {h.texto === 'fechado' ? 'Fechado' : h.texto}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm italic text-ink-muted">{CONFIG.avisoFeriados}</p>
                </div>
              </div>
            )}
            <div className="mt-auto flex flex-col gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary whitespace-nowrap">
                <WhatsApp size={20} /> WhatsApp {CONFIG.whatsappExibicao}
              </a>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost whitespace-nowrap">
                <Instagram size={20} /> {CONFIG.instagramHandle}
              </a>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <LazyMap query={q} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
