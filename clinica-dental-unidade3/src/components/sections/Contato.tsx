import { useState } from "react";
import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { resumoHorarios } from "../../lib/horarios";
import { Botao } from "../ui/Botao";
import { IconeInstagram, IconeMapa, IconePino, IconeRelogio, IconeWhatsApp } from "../ui/Icones";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

/** Mapa só carrega quando a pessoa pede: sem cookies do Google no carregamento da página. */
function Mapa({ consulta, rotulo }: { consulta: string; rotulo: string }) {
  const [carregar, setCarregar] = useState(false);
  if (carregar) {
    return (
      <iframe
        title={`Mapa: ${rotulo}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    );
  }
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-navy-900">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none">
        <g stroke="var(--color-teal-400)" strokeOpacity=".22" strokeWidth="1">
          <path d="M-20 80 C 80 60, 140 120, 240 100 S 380 60, 430 90" />
          <path d="M-20 190 C 70 170, 160 230, 250 200 S 360 160, 430 200" />
          <path d="M120 -10 C 110 80, 160 160, 140 320" />
          <path d="M290 -10 C 300 90, 250 180, 280 320" />
          <path d="M-10 250 L 410 130" strokeDasharray="3 6" />
        </g>
        <circle cx="200" cy="150" r="60" stroke="var(--color-gold-400)" strokeOpacity=".35" />
        <circle cx="200" cy="150" r="100" stroke="var(--color-gold-400)" strokeOpacity=".15" />
      </svg>
      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-gold-400 text-navy-900 shadow-[0_0_0_10px_rgb(201_169_110/0.18)]">
          <IconePino tamanho={26} />
        </span>
        <p className="mt-5 max-w-xs font-serif text-lg text-white">{rotulo}</p>
        <button
          type="button"
          onClick={() => setCarregar(true)}
          className="mt-5 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:border-gold-300 hover:text-gold-300"
        >
          <IconeMapa tamanho={18} /> Mostrar mapa interativo
        </button>
        <p className="mt-3 text-xs text-white/60">O mapa é carregado do Google ao clicar.</p>
      </div>
    </div>
  );
}

export function Contato() {
  const { unidade } = useUnidade();
  const horarios = resumoHorarios(unidade.horarios);

  return (
    <section id="contato" aria-labelledby="titulo-contato" className="relative py-24 sm:py-32">
      <div className="container-site">
        <Revelar>
          <TituloSecao id="titulo-contato" rotulo="Localização e contato" titulo="Venha nos *visitar*." />
        </Revelar>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-line bg-white lg:grid-cols-[1fr_1.1fr]">
          <Revelar className="p-6 sm:p-12">
            <div className="space-y-9">
              <div className="flex gap-4">
                <IconePino tamanho={22} className="mt-1 shrink-0 text-teal-700" />
                <div>
                  <h3 className="rotulo text-[0.7rem] text-gold-700">Endereço</h3>
                  <p className="mt-2 text-lg text-navy-900">{unidade.endereco.linha}</p>
                  <p className="text-ink-soft">CEP {unidade.endereco.cep}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <IconeRelogio tamanho={22} className="mt-1 shrink-0 text-teal-700" />
                <div className="flex-1">
                  <h3 className="rotulo text-[0.7rem] text-gold-700">Horários</h3>
                  <dl className="mt-3 divide-y divide-line">
                    {horarios.map((h) => (
                      <div key={h.rotulo} className="flex justify-between gap-4 py-2.5">
                        <dt className="text-ink">{h.rotulo}</dt>
                        <dd className={h.fechado ? "text-ink-soft" : "font-semibold text-navy-900"}>{h.texto}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm text-ink-soft">{unidade.avisoHorarios}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Botao href={linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral)} externo icone={<IconeWhatsApp tamanho={18} />}>
                  {unidade.telefoneExibicao}
                </Botao>
                <Botao href={unidade.maps.link} externo variante="contorno" icone={<IconeMapa tamanho={18} />}>
                  Como chegar
                </Botao>
                <Botao href={unidade.instagram.url} externo variante="contorno" icone={<IconeInstagram tamanho={18} />}>
                  {unidade.instagram.usuario}
                </Botao>
              </div>
            </div>
          </Revelar>
          <div className="min-h-[360px] lg:min-h-full">
            <Mapa consulta={unidade.maps.consulta} rotulo={unidade.endereco.linha} />
          </div>
        </div>
      </div>
    </section>
  );
}
