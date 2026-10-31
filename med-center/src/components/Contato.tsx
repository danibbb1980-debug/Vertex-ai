import { useEffect, useRef, useState } from "react";
import { CONFIG, waLink } from "../config";
import { ArrowIcon, ClockIcon, InstaIcon, PhoneIcon, PinIcon, WhatsIcon } from "./Icons";
import { Reveal } from "./Reveal";

function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setShow(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden rounded-mod bg-mist lg:aspect-auto lg:h-full lg:min-h-[420px]">
      <div className="grid-mod absolute inset-0" aria-hidden />
      {show && (
        <iframe
          title="Mapa: Med Center Vital Brazil em Pouso Alegre"
          src={CONFIG.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}

export function Contato() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="py-20 sm:py-28">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Localização e contato</p>
          <h2 id="contato-titulo" className="h2 mt-4">
            Venha nos <em className="enfase">visitar</em>.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4">
            <Reveal className="card p-6 sm:p-7">
              <div className="flex gap-4">
                <PinIcon className="mt-1 shrink-0 text-brand-ink" />
                <div>
                  <h3 className="font-display text-lg font-semibold text-night">Endereço</h3>
                  <p className="mt-1 leading-relaxed text-graphite-soft">
                    {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
                    <br />
                    {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
                  </p>
                  <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-[48px] items-center gap-2 font-display font-semibold text-brand-ink underline-offset-4 hover:underline">
                    Como chegar <ArrowIcon />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05} className="card p-6 sm:p-7">
              <div className="flex gap-4">
                <ClockIcon className="mt-1 shrink-0 text-brand-ink" />
                <div className="w-full">
                  <h3 className="font-display text-lg font-semibold text-night">Horários</h3>
                  <dl className="mt-2 grid gap-1">
                    {CONFIG.horariosTexto.map((h) => (
                      <div key={h.dias} className="flex justify-between gap-4 border-b border-night/5 py-1.5 last:border-0">
                        <dt className="text-graphite">{h.dias}</dt>
                        <dd className="whitespace-nowrap font-medium text-night">{h.horas}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-3 grid gap-1 text-sm text-graphite-soft">
                    {CONFIG.horariosAvisos.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="card p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold text-night">Fale com a recepção do andar</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {CONFIG.whatsappAndares.map((w) => (
                  <li key={w.numero}>
                    <a
                      href={waLink(CONFIG.mensagens.geral, w.numero)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[48px] flex-col justify-center rounded-xl border border-night/10 bg-ice px-4 py-3 transition-colors hover:border-brand-ink"
                    >
                      <span className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-brand-ink">
                        <WhatsIcon width={14} height={14} /> {w.rotulo}
                      </span>
                      <span className="mt-0.5 whitespace-nowrap font-display text-[0.95rem] font-semibold text-night">{w.exibir}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a href={`tel:${CONFIG.telefone.tel}`} className="btn-ghost flex-1">
                  <PhoneIcon /> {CONFIG.telefone.exibir}
                </a>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1">
                  <InstaIcon /> {CONFIG.instagram.usuario}
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="h-full">
            <LazyMap />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
