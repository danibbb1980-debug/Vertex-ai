import { CONFIG } from "../config";
import { linkWhatsApp } from "../lib/whatsapp";
import { numeroDaSecao } from "../lib/secoes";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Confirmar } from "../components/Confirmar";
import { Revelar } from "../components/Revelar";
import { Botao } from "../components/Botao";
import { IconeInstagram, IconeMapa, IconeWhatsApp } from "../components/Icones";
import { Foto } from "../components/Foto";

function MapaReservado() {
  return (
    <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="600" height="480" fill="#ece3d5" />
      <g fill="none" stroke="#7a5a2a" strokeOpacity="0.18" strokeWidth="1">
        <path d="M-20 120 C 120 100, 220 160, 360 130 S 560 90, 640 110" />
        <path d="M-20 300 C 140 280, 260 340, 400 300 S 560 260, 640 290" />
        <path d="M150 -20 C 170 120, 130 260, 170 500" />
        <path d="M420 -20 C 400 140, 450 300, 420 500" />
        <path d="M-20 210 L 640 230" strokeOpacity="0.1" />
        <path d="M280 -20 L 300 500" strokeOpacity="0.1" />
      </g>
      <circle cx="300" cy="225" r="42" fill="#b08a4a" fillOpacity="0.12" />
      <circle cx="300" cy="225" r="7" fill="#1d1915" />
    </svg>
  );
}

export function Contato() {
  const mostrarMapa = Boolean(CONFIG.mapaEmbedUrl && CONFIG.endereco.confirmado);
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
                {CONFIG.endereco.valor}
                <Confirmar mostrar={!CONFIG.endereco.confirmado} valor={CONFIG.endereco.valor} />
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
            {mostrarMapa ? (
              <iframe
                title={`Mapa: localização do ${CONFIG.nome}`}
                src={CONFIG.mapaEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
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
                    Abre a localização no Google Maps. O mapa interativo entra aqui quando o endereço for confirmado.
                  </p>
                </div>
              </>
            )}
          </Revelar>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Botao href={linkWhatsApp()} externo icone="whatsapp">
            Agendar pelo WhatsApp
          </Botao>
          {mostrarMapa && (
            <Botao href={CONFIG.googleMaps} externo variante="secundario" icone={<IconeMapa tamanho={17} />}>
              Como chegar
            </Botao>
          )}
        </div>
      </div>

      {/* ponto de chegada da curva: aqui ela termina em equilíbrio */}
      <div className="relative h-36 md:h-48" aria-hidden="true">
        <span data-curva-fim className="absolute top-1/2 left-1/2 h-px w-px" />
      </div>
    </section>
  );
}
