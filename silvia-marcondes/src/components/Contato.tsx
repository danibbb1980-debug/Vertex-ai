import { useState } from "react";
import { CONFIG } from "../config";
import { curto } from "../lib/horarios";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { Botao } from "./Botao";
import { IconeAcessivel, IconeInstagram, IconeMapa, IconeRelogio, IconeWhatsapp } from "./Icones";
import { Monograma } from "./Logo";
import { Cabecalho } from "./Revelar";
import { ComEnfase } from "./TextReveal";

export function Contato() {
  const [mapa, setMapa] = useState(false);
  const e = CONFIG.endereco;
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.maps.embedQuery)}&output=embed`;

  return (
    <section id="contato" aria-labelledby="titulo-contato" className="relative bg-nevoa/60 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <Cabecalho id="titulo-contato" rotulo="Localização e contato" titulo={<ComEnfase text="Venha nos *visitar*." />} />
          <address className="mt-8 not-italic">
            <p className="flex gap-3 text-lg text-grafite">
              <IconeMapa className="mt-1 size-5 shrink-0 text-salvia-texto" />
              <span>
                {e.rua}, {e.bairro}
                <br />
                {e.cidade} - {e.uf}, CEP {e.cep}
              </span>
            </p>
            {e.referencia ? <p className="ml-8 mt-2 text-tinta-suave">{e.referencia}</p> : null}
          </address>

          <div className="mt-8 flex gap-3">
            <IconeRelogio className="mt-1 size-5 shrink-0 text-salvia-texto" />
            <div>
              <ul className="space-y-1 text-grafite">
                {CONFIG.horarios.map((h) => (
                  <li key={h.rotulo} className="flex flex-wrap gap-x-2">
                    <span className="min-w-[9.5rem] text-tinta-suave">{h.rotulo}</span>
                    <span className="font-semibold">{curto(h.abre)} às {curto(h.fecha)}</span>
                  </li>
                ))}
              </ul>
              {CONFIG.avisoHorarios ? <p className="mt-2 text-sm text-tinta-suave">{CONFIG.avisoHorarios}</p> : null}
            </div>
          </div>

          {CONFIG.acessibilidade ? (
            <p className="mt-6 flex gap-3 text-grafite">
              <IconeAcessivel className="mt-0.5 size-5 shrink-0 text-salvia-texto" />
              {CONFIG.acessibilidade}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {CONFIG.maps.link ? (
              <Botao href={CONFIG.maps.link} externo icone={<IconeMapa />} variante="secundario">
                Como chegar
              </Botao>
            ) : null}
            {temWhatsapp ? (
              <Botao href={linkWhatsapp()} externo icone={<IconeWhatsapp />}>
                WhatsApp {CONFIG.whatsappExibicao}
              </Botao>
            ) : null}
            {CONFIG.instagram.url ? (
              <Botao href={CONFIG.instagram.url} externo icone={<IconeInstagram />} variante="secundario">
                {CONFIG.instagram.usuario}
              </Botao>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-[22rem] overflow-hidden rounded-xl3 border border-linha bg-porcelana shadow-cartao lg:min-h-full">
          {mapa ? (
            <iframe
              title={`Mapa: ${CONFIG.marca.nomeCompleto}, ${e.rua}, ${e.cidade}`}
              src={embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="luz absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
              <Monograma className="size-20 text-ameixa/70" strokeWidth={1.6} />
              <p className="max-w-xs font-serif text-2xl text-grafite">
                {e.bairro}, {e.cidade}
              </p>
              <button
                type="button"
                onClick={() => setMapa(true)}
                className="btn-brilho inline-flex min-h-12 items-center gap-2 rounded-full bg-ameixa px-6 font-semibold text-porcelana"
              >
                <IconeMapa /> Mostrar mapa
              </button>
              <p className="max-w-xs text-sm text-tinta-suave">O mapa é carregado do Google Maps somente quando você pedir.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
