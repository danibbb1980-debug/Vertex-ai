import { useState } from "react";
import { CONFIG } from "../config";
import { Botao } from "../components/Botao";
import { IconeAcessivel, IconeInstagram, IconePino, IconeRelogio, IconeWhatsApp } from "../components/Icones";
import { Revelar, TituloSecao } from "../components/Revelar";
import { pausaAlmoco, resumoSemanal } from "../lib/horarios";
import { waLink } from "../lib/whatsapp";

/** Mapa carregado só quando a pessoa pede (sem cookies de terceiros antes disso). */
function Mapa() {
  const [ativo, setAtivo] = useState(false);
  if (!CONFIG.mapsEmbed) return null;
  return (
    <div className="relative min-h-[22rem] overflow-hidden rounded-[1.6rem] border border-ouro/30 bg-blush-2 sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[28rem]">
      {ativo ? (
        <iframe
          title={`Mapa: ${CONFIG.endereco.rua}, ${CONFIG.endereco.cidade}`}
          src={CONFIG.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none">
            <path d="M-20 210 C 90 170, 150 240, 240 190 S 380 120, 430 150" stroke="#fbf6f1" strokeWidth="14" />
            <path d="M120 -20 C 140 80, 110 160, 170 320" stroke="#fbf6f1" strokeWidth="10" />
            <path d="M260 -20 L 300 320" stroke="#fbf6f1" strokeWidth="6" />
          </svg>
          <div className="relative rounded-[1.4rem] bg-marfim/85 px-8 py-7 backdrop-blur-[2px]">
            <IconePino className="mx-auto h-9 w-9 text-mauve" />
            <p className="mt-3 font-serif text-2xl text-cacau">{CONFIG.endereco.bairro}</p>
            <button
              type="button"
              onClick={() => setAtivo(true)}
              className="mt-5 inline-flex min-h-12 items-center rounded-full border border-mauve/40 bg-marfim px-6 text-[0.95rem] font-medium text-mauve transition-colors hover:border-mauve"
            >
              Mostrar mapa
            </button>
            <p className="mt-3 text-xs text-texto">O mapa é carregado do Google ao tocar no botão.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Contato() {
  if (!CONFIG.secoes.contato) return null;
  const e = CONFIG.endereco;
  const pausa = pausaAlmoco();
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="py-24 sm:py-32">
      <div className="container-site relative z-[1]">
        <TituloSecao id="titulo-contato" rotulo="Localização e contato" antes="Venha nos" enfase="visitar." />
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Revelar className="space-y-8">
            <div className="flex gap-4">
              <IconePino className="mt-1 h-6 w-6 shrink-0 text-mauve" />
              <address className="not-italic">
                <p className="font-serif text-2xl text-cacau">{e.rua}</p>
                <p className="text-texto">{e.bairro}, {e.cidade} - {e.uf}</p>
                <p className="text-texto">CEP {e.cep}</p>
              </address>
            </div>
            <div className="flex gap-4">
              <IconeRelogio className="mt-1 h-6 w-6 shrink-0 text-mauve" />
              <div>
                <dl className="space-y-1.5">
                  {resumoSemanal().map((g) => (
                    <div key={g.dias} className="flex flex-wrap gap-x-3">
                      <dt className="min-w-36 font-medium text-cacau">{g.dias}</dt>
                      <dd className="text-texto">{g.texto}</dd>
                    </div>
                  ))}
                </dl>
                {pausa && <p className="mt-2 text-[0.95rem] text-texto">Pausa para almoço das {pausa}.</p>}
                <p className="mt-1 text-[0.95rem] text-texto">{CONFIG.avisoHorarios}</p>
              </div>
            </div>
            {CONFIG.acessibilidade && (
              <div className="flex gap-4">
                <IconeAcessivel className="mt-1 h-6 w-6 shrink-0 text-mauve" />
                <p className="text-texto">{CONFIG.acessibilidade}.</p>
              </div>
            )}
            <div className="filete" />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {CONFIG.mapsUrl && <Botao href={CONFIG.mapsUrl} externo icone={<IconePino className="h-5 w-5" />}>Como chegar</Botao>}
              {CONFIG.whatsapp && (
                <Botao href={waLink()} externo variante="secundario" icone={<IconeWhatsApp className="h-5 w-5" />}>
                  {CONFIG.whatsappExibicao}
                </Botao>
              )}
              {CONFIG.instagram.url && (
                <Botao href={CONFIG.instagram.url} externo variante="secundario" icone={<IconeInstagram className="h-5 w-5" />}>
                  Instagram
                </Botao>
              )}
            </div>
          </Revelar>
          <Revelar atraso={0.1}><Mapa /></Revelar>
        </div>
      </div>
    </section>
  );
}
