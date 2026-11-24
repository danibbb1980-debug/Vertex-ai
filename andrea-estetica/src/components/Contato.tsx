import { CONFIG } from "../config";
import { horaFala } from "../tempo";
import { BotaoWhats, Externo, Hora } from "./ui";

export default function Contato({ hora }: { hora: string }) {
  const e = CONFIG.endereco;
  return (
    <section id="contato" aria-labelledby="t-contato" className="tema-entardecer border-t border-grafite/20">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <Hora hora={hora} />
          <h2 id="t-contato" className="titulo mt-6 text-[clamp(2.6rem,5.4vw,4.2rem)]">
            Venha nos <span className="enfase">visitar</span>
          </h2>
          <address className="mt-10 not-italic">
            <span className="titulo block text-[1.9rem] leading-tight">
              {e.rua}, {e.numero}
            </span>
            <span className="mt-2 block text-grafite/85">
              {e.bairro}
              <br />
              {e.cidade} - {e.uf}, CEP {e.cep}
            </span>
          </address>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            <Externo href={e.rotaUrl} className="link inline-flex min-h-12 items-center">
              Como chegar
            </Externo>
            <Externo href={e.mapsUrl} className="link inline-flex min-h-12 items-center">
              Ver no Google Maps
            </Externo>
          </div>

          <dl className="mt-10 border-t border-grafite/25">
            {CONFIG.usarWhatsapp && CONFIG.whatsapp && (
              <div className="flex items-baseline justify-between gap-4 border-b border-grafite/25 py-4">
                <dt className="text-sm text-cinza">WhatsApp</dt>
                <dd className="tab">{CONFIG.whatsappExibicao}</dd>
              </div>
            )}
            {CONFIG.horarios.dias[1] && (
              <div className="flex items-baseline justify-between gap-4 border-b border-grafite/25 py-4">
                <dt className="text-sm text-cinza">Horário</dt>
                <dd className="tab text-right">
                  Seg a sex até {horaFala(CONFIG.horarios.dias[1]!.fecha)}
                  {CONFIG.horarios.dias[6] && `, sáb até ${horaFala(CONFIG.horarios.dias[6]!.fecha)}`}
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats texto="Agendar pelo WhatsApp" />
            <Externo href={CONFIG.instagram.url} className="btn btn-linha">
              Ver no Instagram
            </Externo>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {e.embedUrl && (
            <div className="relative aspect-[4/5] w-full border border-grafite/30 bg-white/30 sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              {/* Fica por trás do mapa: aparece só se o Google Maps não carregar. */}
              <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 p-8" aria-hidden="true">
                <span className="titulo text-2xl">{e.bairro}</span>
                <span className="text-sm text-cinza">
                  {e.cidade} - {e.uf}
                </span>
              </div>
              <iframe
                title={`Mapa: ${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade}`}
                src={e.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full grayscale-[0.6] contrast-[0.95]"
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
