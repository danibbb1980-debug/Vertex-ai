import { useState } from "react";
import { CONFIG, enderecoCompleto } from "../config";
import { SectionHead } from "../components/SectionHead";
import { Reveal } from "../components/Reveal";
import { MagneticLink, Arrow } from "../components/Magnetic";
import { Emblem } from "../components/Emblem";
import { waLink } from "../lib/whatsapp";

const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(enderecoCompleto)}&output=embed`;

export function Contact({ num }: { num: string }) {
  const [map, setMap] = useState(false);
  const e = CONFIG.endereco;
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-paper-2 py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="Contato" />
        <Reveal>
          <h2 id="contato-titulo" className="text-[clamp(2.6rem,6vw,5rem)]">
            Fale com o <em>escritório</em>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-ink-soft">WhatsApp</p>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex items-baseline gap-3 whitespace-nowrap font-serif text-[clamp(2.1rem,4.6vw,3.9rem)] leading-none tracking-[-0.02em] text-wine"
              >
                <span className="ulink">{CONFIG.whatsappExibicao}</span>
                <span className="text-[0.6em]"><Arrow /></span>
              </a>
              <p className="mt-4 text-ink-soft">Mande uma mensagem contando, em poucas palavras, do que precisa.</p>
            </Reveal>

            <dl className="mt-14 grid gap-10 sm:grid-cols-2">
              <Reveal>
                <dt className="eyebrow text-ink-soft">Endereço</dt>
                <dd className="mt-3 text-[1.05rem] leading-relaxed">
                  <address className="not-italic">
                    {e.rua}
                    <br />
                    {e.bairro}
                    <br />
                    {e.cidade} - {e.uf}
                    <br />
                    CEP {e.cep}
                  </address>
                </dd>
              </Reveal>
              <Reveal delay={0.06}>
                <dt className="eyebrow text-ink-soft">Horário de atendimento</dt>
                <dd className="mt-3 text-[1.05rem] leading-relaxed">
                  <ul>
                    {CONFIG.horarios.map((h) => (
                      <li key={h.dias} className="flex justify-between gap-4 border-b border-ink/10 py-1.5">
                        <span>{h.dias}</span>
                        <span className="text-ink-soft">{h.horas}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-ink-soft">{CONFIG.avisoHorario}</p>
                </dd>
              </Reveal>
              <Reveal delay={0.1}>
                <dt className="eyebrow text-ink-soft">Instagram</dt>
                <dd className="mt-3 text-[1.05rem]">
                  <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="ulink ulink-static">
                    {CONFIG.instagram.usuario}
                  </a>
                </dd>
              </Reveal>
            </dl>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <MagneticLink href={waLink()} external>
                Falar pelo WhatsApp
              </MagneticLink>
              <MagneticLink href={CONFIG.mapsUrl} external variant="outline" ariaLabel="Como chegar (abre o Google Maps em nova aba)">
                Como chegar
              </MagneticLink>
              <a
                href={CONFIG.maps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver no Google Maps: ${enderecoCompleto} (abre em nova aba)`}
                className="group inline-flex min-h-12 items-center justify-center gap-2 px-2 font-medium text-wine sm:justify-start"
              >
                <span className="ulink ulink-static">Ver no Google Maps</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 bg-paper md:aspect-[16/9] lg:aspect-[4/5]">
                {map ? (
                  <iframe
                    title={`Mapa: ${enderecoCompleto}`}
                    src={MAP_SRC}
                    className="absolute inset-0 h-full w-full grayscale-[0.4]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-9">
                    <Emblem variant="linha" className="pointer-events-none absolute -bottom-10 -right-16 h-[85%] w-auto text-gold/35" />
                    <div className="relative">
                      <p className="eyebrow text-ink-soft">Onde estamos</p>
                      <p className="mt-4 font-serif text-[1.9rem] leading-[1.1]">
                        {e.bairro},
                        <br />
                        <em className="text-wine">{e.cidade}</em>
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMap(true)}
                        className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-ink/25 bg-paper px-5 font-medium transition-colors hover:border-ink"
                      >
                        Carregar mapa
                        <Arrow />
                      </button>
                      <p className="mt-3 max-w-xs text-sm text-ink-soft">
                        O mapa é do Google e só carrega se você pedir, pois pode usar cookies.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
