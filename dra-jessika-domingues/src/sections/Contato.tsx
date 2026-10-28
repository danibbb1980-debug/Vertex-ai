import { useState } from "react";
import { CONFIG, comoChegarLink, enderecoCompleto, mapaEmbed } from "../config";
import { Sparkle } from "../components/Decor";
import { IconArrow, IconClock, IconInstagram, IconPin, IconWhatsApp } from "../components/Icons";
import { BotaoWhatsApp, CabecalhoSecao, Confirmar } from "../components/ui";

/** O mapa do Google só carrega quando a pessoa pede (sem cookies de terceiros antes disso). */
function Mapa() {
  const [carregar, setCarregar] = useState(false);
  if (carregar) {
    return (
      <iframe
        title={`Mapa: ${enderecoCompleto}`}
        src={mapaEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[22rem] w-full border-0"
      />
    );
  }
  return (
    <div className="relative flex h-full min-h-[22rem] items-center justify-center overflow-hidden bg-sage-50">
      {/* mapa ilustrado e abstrato, só decorativo */}
      <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="var(--color-paper)" strokeLinecap="round">
          <path d="M-10 70c90 20 160-10 240 10s120 40 190 20" strokeWidth="14" />
          <path d="M-10 210c70-30 150-10 210-30s130-50 210-20" strokeWidth="10" />
          <path d="M120-10c-10 90 20 160 10 320" strokeWidth="12" />
          <path d="M290-10c20 80-10 170 15 320" strokeWidth="8" />
        </g>
        <g fill="var(--color-sage-100)">
          <rect x="150" y="105" width="90" height="55" rx="14" />
          <rect x="20" y="110" width="80" height="70" rx="16" />
          <rect x="315" y="120" width="70" height="60" rx="14" />
        </g>
      </svg>
      <div className="relative mx-5 flex flex-col items-center rounded-3xl bg-paper/90 px-6 py-7 text-center shadow-[0_20px_40px_-30px_rgba(29,42,71,0.5)] backdrop-blur-sm">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-coral text-ink shadow-[0_14px_30px_-14px_rgba(163,70,44,0.7)]">
          <IconPin size={26} />
        </span>
        <p className="mt-4 max-w-xs font-semibold text-ink">{enderecoCompleto}</p>
        <button type="button" onClick={() => setCarregar(true)} className="btn btn-light mt-5 !min-h-12 ring-1 ring-line">
          Carregar mapa do Google
        </button>
        <p className="mt-3 max-w-xs text-[0.82rem] text-muted">Ao carregar, o Google pode registrar dados de navegação.</p>
      </div>
    </div>
  );
}

export function Contato() {
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="relative py-20 md:py-28">
      <div className="container-site">
        <CabecalhoSecao
          id="titulo-contato"
          eyebrow="Localização e contato"
          titulo="Venha conhecer o *consultório*."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="reveal card flex flex-col gap-7 p-6 sm:p-7 md:p-9 lg:col-span-5">
            <div className="flex gap-4">
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-deep sm:inline-flex">
                <IconPin />
              </span>
              <div>
                <h3 className="font-sans text-[1.02rem] font-extrabold tracking-normal">Endereço</h3>
                <p className="mt-1">
                  {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
                  <Confirmar />
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-50 text-sage-deep sm:inline-flex">
                <IconClock />
              </span>
              <div className="w-full">
                <h3 className="font-sans text-[1.02rem] font-extrabold tracking-normal">
                  Horários
                  <Confirmar />
                </h3>
                <dl className="mt-2 divide-y divide-line">
                  {CONFIG.horarios.map((h) => (
                    <div key={h.dias} className="flex justify-between gap-4 py-2">
                      <dt>{h.dias}</dt>
                      <dd className="font-bold whitespace-nowrap text-ink">{h.horas}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-[0.92rem] text-muted italic">{CONFIG.observacaoHorarios}</p>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <BotaoWhatsApp fase="geral" magnetico={false} className="w-full">
                Agendar pelo WhatsApp
              </BotaoWhatsApp>
              <p className="-mt-1 text-center text-[0.92rem] text-muted">{CONFIG.whatsappExibicao}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={comoChegarLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4">
                  Como chegar
                  <IconArrow size={18} />
                  <span className="sr-only"> (Google Maps, abre em nova aba)</span>
                </a>
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4">
                  <IconInstagram size={19} />
                  Instagram
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </div>
              <a
                href={CONFIG.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline self-start text-[0.95rem] font-semibold text-ink-2"
              >
                Ver a ficha no Google Maps
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          </div>
          <div
            className="reveal relative overflow-hidden rounded-[2rem] border border-line lg:col-span-7"
            style={{ ["--d" as string]: "120ms" }}
          >
            <Mapa />
          </div>
        </div>
      </div>
      <Sparkle filled className="cintilar absolute top-24 right-[8%] hidden h-6 w-6 text-butter md:block" />
    </section>
  );
}

export function CtaFinal() {
  return (
    <section aria-labelledby="titulo-cta" className="on-dark relative overflow-hidden bg-ink py-24 text-cream md:py-32">
      <svg aria-hidden viewBox="0 0 800 400" className="absolute -right-40 -bottom-40 w-[46rem] text-ink-2">
        <path d="M640 80c90 70 120 190 60 270S490 460 380 430 140 330 120 230 190 30 320 10s230 0 320 70Z" fill="currentColor" />
      </svg>
      <Sparkle filled className="cintilar absolute top-16 left-[12%] h-6 w-6 text-butter" />
      <Sparkle className="cintilar absolute right-[18%] bottom-20 h-5 w-5 text-sage" style={{ animationDelay: "-2s" }} />
      <div className="container-site relative text-center">
        <h2 id="titulo-cta" className="reveal mx-auto max-w-3xl text-[2.6rem] leading-[1.05] font-normal !text-cream sm:text-6xl md:text-7xl">
          O primeiro passo é uma <em className="enfase">conversa</em>.
        </h2>
        <p className="reveal mx-auto mt-6 max-w-xl text-lg text-cream/85" style={{ ["--d" as string]: "100ms" }}>
          Conte um pouco sobre o seu filho e tire as suas dúvidas antes de marcar.
        </p>
        <div className="reveal mt-10 flex flex-col justify-center gap-3 sm:flex-row" style={{ ["--d" as string]: "180ms" }}>
          <BotaoWhatsApp fase="geral" variante="light" largo>
            Agendar pelo WhatsApp
          </BotaoWhatsApp>
          <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
            <IconInstagram size={20} />
            Ver no Instagram
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-cream/75">
          <IconWhatsApp size={16} />
          {CONFIG.whatsappExibicao}
        </p>
      </div>
    </section>
  );
}
