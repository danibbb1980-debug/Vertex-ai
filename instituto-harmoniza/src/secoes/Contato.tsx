import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { numeroDaSecao } from "../lib/secoes";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Confirmar } from "../components/Confirmar";
import { Revelar } from "../components/Revelar";
import { Botao } from "../components/Botao";
import { IconeInstagram, IconeMapa, IconeWhatsApp } from "../components/Icones";
import { Foto } from "../components/Foto";
import { MapaInterativo, MapaReservado } from "../components/Mapa";

export function Contato() {
  const mostrarMapa = Boolean(CONFIG.mapaEmbedUrl && CONFIG.endereco.confirmado);
  const e = CONFIG.enderecoPartes;
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="relative z-10 pt-24 md:pt-36">
      <div className="contem">
        <CabecalhoSecao
          numero={numeroDaSecao("contato")}
          rotulo="Localização e contato"
          id="titulo-contato"
          titulo={
            <>
              Venha conhecer o <em>instituto</em>.
            </>
          }
        />

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-12">
          <Revelar className="flex flex-col gap-10 rounded-[28px] border border-linha bg-branco p-7 md:p-10 lg:col-span-5">
            <div>
              <h3 className="rotulo text-bronze">Endereço</h3>
              <address className="mt-3 font-display text-[1.7rem] leading-snug not-italic">
                {CONFIG.endereco.confirmado ? (
                  <>
                    {e.rua} · {e.bairro}
                    <br />
                    <span className="text-suave">
                      {e.cidade} - {e.uf} · {e.cep}
                    </span>
                  </>
                ) : (
                  <>
                    {CONFIG.endereco.valor}
                    <Confirmar valor={CONFIG.endereco.valor} />
                  </>
                )}
              </address>
            </div>

            <div>
              <h3 className="rotulo flex items-center text-bronze">
                Horários <Confirmar mostrar={!CONFIG.horarios.confirmado} />
              </h3>
              <dl className="mt-3 divide-y divide-linha">
                {CONFIG.horarios.linhas.map((h) => (
                  <div key={h.dias} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-suave">{h.dias}</dt>
                    <dd className="font-medium tabular-nums">{h.horas}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[0.86rem] text-cinza">{CONFIG.horarios.observacao}</p>
            </div>

            <div>
              <h3 className="rotulo text-bronze">Contato</h3>
              <ul className="mt-3 space-y-1">
                <li>
                  <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-bronze">
                    <IconeWhatsApp tamanho={18} className="text-bronze" />
                    WhatsApp e telefone {CONFIG.telefoneExibicao}
                  </a>
                </li>
                <li>
                  <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-bronze">
                    <IconeInstagram tamanho={18} className="text-bronze" />
                    {CONFIG.instagramUsuario}
                  </a>
                </li>
              </ul>
            </div>
          </Revelar>

          <Revelar atraso={120} className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-linha lg:col-span-7">
              <>
                {CONFIG.fotos.contato ? (
                  <>
                    <Foto
                      foto={CONFIG.fotos.contato}
                      sizes="(min-width: 1024px) 56vw, 92vw"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noite/85 via-noite/25 to-transparent" />
                  </>
                ) : (
                  <MapaReservado />
                )}
                <div
                  className={`relative flex h-full min-h-[420px] flex-col items-center justify-end gap-4 p-7 text-center ${
                    CONFIG.fotos.contato ? "sobre-escuro" : ""
                  }`}
                  style={CONFIG.fotos.contato ? { ["--halo" as string]: "transparent" } : undefined}
                >
                  <Botao
                    href={CONFIG.googleMaps}
                    externo
                    variante={CONFIG.fotos.contato ? "claro" : "primario"}
                    icone={<IconeMapa tamanho={17} />}
                    magnetico
                  >
                    Como chegar
                  </Botao>
                  <p className={`max-w-[36ch] text-[0.82rem] ${CONFIG.fotos.contato ? "text-marfim/90" : "text-suave"}`}>
                    Abre a rota até o instituto no Google Maps.
                  </p>
                </div>
              </>
          </Revelar>
        </div>

        {mostrarMapa && (
          <Revelar className="mt-6">
            <MapaInterativo />
          </Revelar>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Botao href={linkWhatsApp()} externo icone="whatsapp">
            Agendar pelo WhatsApp
          </Botao>
        </div>
      </div>

      {/* ponto de chegada da curva: aqui ela termina em equilíbrio */}
      <div className="relative h-36 md:h-48" aria-hidden="true">
        <span data-curva-fim className="absolute top-1/2 left-1/2 h-px w-px" />
      </div>
    </section>
  );
}
