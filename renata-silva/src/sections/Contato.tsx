import { useState } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { CONFIG } from "../config";
import { FadeIn, RevealTitle } from "../components/Reveal";
import { InstagramIcon, WhatsAppIcon } from "../components/icons";
import { Picture } from "../components/Picture";
import { faixa } from "../lib/horarios";
import { waLink } from "../lib/whatsapp";
import { useClient } from "../lib/motion";

function Mapa() {
  const [ativo, setAtivo] = useState(false);
  const endereco = `${CONFIG.endereco.rua}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`;
  if (ativo) {
    return (
      <iframe
        title={`Mapa: ${endereco}`}
        src={CONFIG.mapsEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-full min-h-[22rem] w-full rounded-3xl border-0 grayscale-[35%]"
      />
    );
  }
  return (
    <div className="relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-rose-300/15 bg-navy-850 p-7">
      {/* Ilustração original de traço: ruas e o glifo como marcador */}
      <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="#EFB1B6" strokeOpacity="0.14" strokeWidth="1">
          <path d="M-10 70 C80 60 160 95 250 80 S380 50 420 60" />
          <path d="M-10 190 C60 175 140 205 230 185 S360 160 420 175" />
          <path d="M90 -10 C100 80 80 170 110 310" />
          <path d="M300 -10 C285 90 320 180 290 310" />
          <path d="M-10 250 L420 230" />
          <path d="M180 -10 C190 60 210 120 200 310" strokeOpacity="0.28" strokeWidth="1.5" />
        </g>
        <g transform="translate(186 98)">
          <circle cx="14" cy="34" r="30" fill="#E48D9D" fillOpacity="0.08" />
          <path d="M14 0C22 14 34 24 14 52 -6 24 6 14 14 0Z" fill="#E48D9D" />
          <circle cx="14" cy="24" r="5" fill="#1E272E" />
        </g>
      </svg>
      <div className="relative">
        <p className="eyebrow text-rose-300">Mapa</p>
        <p className="mt-2 text-pearl">{endereco}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => setAtivo(true)} className="btn btn-ghost !min-h-12 !px-5">
            Mostrar mapa aqui
          </button>
          <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-12 !px-5">
            <Navigation size={15} aria-hidden="true" />
            Como chegar
          </a>
        </div>
        <p className="mt-4 text-xs text-mist">O mapa interativo é do Google e só carrega se você tocar em “Mostrar mapa aqui”.</p>
      </div>
    </div>
  );
}

export function Contato() {
  if (!CONFIG.secoes.contato) return null;
  const hoje = useClient(() => new Date().getDay(), -1);
  const linhas = [
    ...CONFIG.horarios.map((h) => ({ rotulo: h.rotulo, valor: faixa(h), dias: h.dias as number[] })),
    ...CONFIG.fechado.map((f) => ({ rotulo: f.rotulo, valor: "Fechado", dias: f.dias as number[] })),
  ];
  const foto = CONFIG.fotoContato;

  return (
    <section id="contato" data-line="right" aria-labelledby="contato-titulo" className="on-dark relative bg-navy-900 py-24 text-pearl md:py-36">
      <div aria-hidden="true" className="grid-fine absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_20%_30%,#000,transparent_65%)]" />
      <div className="container-site relative z-[2]">
        <p className="eyebrow mb-6 text-rose-300">Localização e contato</p>
        <RevealTitle id="contato-titulo" text="Venha nos *visitar*." className="text-[2.8rem] md:text-[4rem]" />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <FadeIn className="grid gap-10 sm:grid-cols-[1fr_auto]">
            <div className="space-y-9">
              <div className="flex gap-4">
                <MapPin size={20} strokeWidth={1.4} className="mt-1 shrink-0 text-rose-300" aria-hidden="true" />
                <address className="not-italic">
                  <h3 className="eyebrow text-mist">Endereço</h3>
                  <p className="mt-2 text-[1.1rem]">{CONFIG.endereco.rua}</p>
                  <p className="text-mist">
                    {CONFIG.endereco.cidade} - {CONFIG.endereco.uf} · CEP {CONFIG.endereco.cep}
                  </p>
                </address>
              </div>

              {linhas.length > 0 && (
                <div className="flex gap-4">
                  <Clock size={20} strokeWidth={1.4} className="mt-1 shrink-0 text-rose-300" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="eyebrow text-mist">Horários</h3>
                    <dl className="mt-2 max-w-sm divide-y divide-rose-300/10">
                      {linhas.map((l) => {
                        const ehHoje = l.dias.includes(hoje);
                        return (
                          <div key={l.rotulo} className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className={`whitespace-nowrap ${ehHoje ? "text-pearl" : "text-mist"}`}>
                              {l.rotulo}
                              {ehHoje && <span className="ml-2 font-label text-[0.68rem] uppercase tracking-[0.18em] text-rose-300">Hoje</span>}
                            </dt>
                            <dd className={`whitespace-nowrap tabular-nums ${ehHoje ? "text-pearl" : "text-mist"}`}>{l.valor}</dd>
                          </div>
                        );
                      })}
                    </dl>
                    {CONFIG.avisoHorarios && <p className="mt-3 text-sm text-mist">{CONFIG.avisoHorarios}</p>}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsAppIcon />
                  {CONFIG.telefoneExibicao}
                </a>
                {CONFIG.instagram.url && (
                  <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <InstagramIcon />
                    Instagram
                  </a>
                )}
              </div>
            </div>

            {foto && (
              <figure className="w-36 self-start sm:w-40">
                <div className="overflow-hidden rounded-t-[999px] rounded-b-2xl ring-1 ring-rose-300/20">
                  <Picture foto={foto} sizes="176px" className="block aspect-[3/5] w-full object-cover" />
                </div>
                <figcaption className="eyebrow mt-3 text-mist">{foto.legenda}</figcaption>
              </figure>
            )}
          </FadeIn>

          <FadeIn delay={0.1}>
            <Mapa />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
