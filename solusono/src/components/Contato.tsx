import { useState } from "react";
import { CONFIG, horariosResumo, linkWhatsapp } from "../config";
import { Botao } from "./Botao";
import { IconeInstagram, IconeWhatsapp } from "./Icones";
import { Respira } from "./Respira";

export function Contato() {
  const e = CONFIG.endereco;
  const [mapa, setMapa] = useState(false);
  const horarios = horariosResumo();
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-white py-24 md:py-36">
      <div className="container-site">
        <p className="rotulo">Localização e contato</p>
        <h2 id="contato-titulo" className="titulo mt-5 text-[clamp(2.6rem,6vw,5rem)]">
          Venha nos <em>visitar</em>.
        </h2>

        <div className="mt-14 grid gap-y-12 md:mt-20 md:grid-cols-12 md:gap-x-8">
          <div className="space-y-10 md:col-span-5">
            <div>
              <h3 className="rotulo text-muted">Endereço</h3>
              <address className="mt-3 text-[1.35rem] not-italic leading-snug text-ink">
                {e.rua}
                <br />
                {e.bairro}
                <br />
                {e.cidade} - {e.uf}, CEP {e.cep}
              </address>
              {e.mapsUrl && (
                <a
                  href={e.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-sublinhado mt-4 inline-flex min-h-12 items-center font-semibold text-brand"
                >
                  Ver no Google Maps<span className="sr-only"> (abre em nova aba)</span>
                </a>
              )}
            </div>

            {horarios.length > 0 && (
              <div>
                <h3 className="rotulo text-muted">Horários</h3>
                <dl className="mt-3 border-t border-line">
                  {horarios.map((l) => (
                    <div key={l.dias} className="flex justify-between gap-4 border-b border-line py-3">
                      <dt>{l.dias}</dt>
                      <dd className="font-semibold text-ink">{l.horas}</dd>
                    </div>
                  ))}
                </dl>
                {CONFIG.avisoHorarios && <p className="mt-3 text-sm text-muted">{CONFIG.avisoHorarios}</p>}
              </div>
            )}

            <div>
              <h3 className="rotulo text-muted">Fale com a gente</h3>
              <ul className="mt-3 space-y-1 text-[1.05rem]">
                <li>
                  <a href={linkWhatsapp(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 text-ink hover:text-brand">
                    <IconeWhatsapp className="h-5 w-5 text-brand" />
                    <span>
                      WhatsApp <span className="font-semibold">{CONFIG.whatsappExibicao}</span>
                    </span>
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
                {CONFIG.email && (
                  <li>
                    <a href={`mailto:${CONFIG.email}`} className="inline-flex min-h-12 items-center gap-3 text-ink hover:text-brand">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
                        <path d="M4 7l8 6 8-6" strokeLinejoin="round" />
                      </svg>
                      <span className="break-all">{CONFIG.email}</span>
                    </a>
                  </li>
                )}
                {CONFIG.instagram.url && (
                  <li>
                    <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 text-ink hover:text-brand">
                      <IconeInstagram className="h-5 w-5 text-brand" />
                      <span>Instagram {CONFIG.instagram.usuario}</span>
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-mist sm:aspect-[4/3] md:h-full md:min-h-[32rem] md:aspect-auto">
              {mapa ? (
                <iframe
                  title={`Mapa: ${e.rua}, ${e.cidade}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(e.mapaBusca)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12">
                  {/* desenho do entorno, sem dados: só círculos concêntricos marcando o ponto */}
                  <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute right-[-10%] top-[-10%] h-[110%] w-auto" fill="none">
                    {[40, 90, 140, 190].map((r) => (
                      <circle key={r} cx="200" cy="200" r={r} stroke="#cddbeb" />
                    ))}
                    <circle cx="200" cy="200" r="10" fill="#1f5fa8" />
                  </svg>
                  <p className="relative max-w-[26ch] text-muted">
                    O mapa do Google só carrega se você pedir. Assim, nada é enviado ao Google sem a sua escolha.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMapa(true)}
                    className="relative mt-5 inline-flex min-h-12 items-center rounded-full border border-ink/25 bg-white px-6 font-semibold text-ink transition-colors hover:bg-tint"
                  >
                    Mostrar o mapa aqui
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-titulo" className="escuro relative overflow-hidden bg-ink-deep py-28 text-white md:py-40">
      <div className="container-site grid items-center gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-7">
          <h2 id="cta-titulo" className="titulo text-[clamp(2.8rem,7vw,6rem)]">
            O primeiro passo é uma <em>conversa</em>.
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg text-white/75">
            Conte o que está acontecendo com o seu sono. A equipe explica como funciona a avaliação.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Botao href={linkWhatsapp(CONFIG.mensagens.geral)} externo variante="claro" icone={<IconeWhatsapp />}>
              Agendar pelo WhatsApp
            </Botao>
            {CONFIG.secoes.agendar && (
              <Botao href="#agendar" variante="contorno-claro">
                Solicitar agendamento
              </Botao>
            )}
            {CONFIG.instagram.url && (
              <Botao href={CONFIG.instagram.url} externo variante="contorno-claro" icone={<IconeInstagram />}>
                Ver no Instagram
              </Botao>
            )}
          </div>
        </div>
        <div className="md:col-span-5">
          <RespiraCta />
        </div>
      </div>
    </section>
  );
}

function RespiraCta() {
  return <Respira tom="escuro" className="mx-auto w-[min(70vw,22rem)] md:w-full md:max-w-[26rem]" />;
}
