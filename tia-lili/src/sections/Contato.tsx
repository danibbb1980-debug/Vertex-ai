import { useState } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { CONFIG, enderecoCompleto, linkWhatsApp } from "../config";
import { Secao, Cabecalho } from "../components/Secao";
import { Botao, BotaoWhatsApp, BotaoInstagram } from "../components/Botoes";
import { Estrela } from "../components/Icones";

/** Mapa do Google só carrega quando a pessoa pede (mais leve e sem cookies de terceiros antes do clique). */
function Mapa() {
  const [carregar, setCarregar] = useState(false);
  if (carregar) {
    return (
      <iframe
        title={`Mapa: ${enderecoCompleto}`}
        src={CONFIG.maps.embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[22rem] w-full border-0"
      />
    );
  }
  return (
    <div className="relative grid h-full min-h-[22rem] place-items-center overflow-hidden bg-creme-2 p-8 text-center">
      {/* Ilustração abstrata de ruas */}
      <svg className="absolute inset-0 h-full w-full text-areia" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M-20 70 C 80 60, 160 110, 420 80" strokeWidth="14" />
          <path d="M-20 210 C 120 230, 260 170, 420 200" strokeWidth="10" />
          <path d="M120 -20 C 110 90, 160 200, 140 320" strokeWidth="10" />
          <path d="M290 -20 C 300 100, 260 190, 300 320" strokeWidth="14" />
        </g>
        <circle cx="210" cy="140" r="70" fill="var(--color-menta-claro)" />
      </svg>
      <div className="relative">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-menta-escuro text-white shadow-lg">
          <MapPin size={26} aria-hidden />
        </span>
        <p className="mt-4 font-display text-xl font-medium">{CONFIG.endereco.rua}</p>
        <p className="text-taupe-texto">
          {CONFIG.endereco.bairro} · {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
        </p>
        <button
          type="button"
          onClick={() => setCarregar(true)}
          className="mt-5 inline-flex min-h-12 items-center rounded-full bg-white px-5 font-bold text-cacau ring-1 ring-inset ring-cacau/20 transition-colors hover:bg-creme"
        >
          Carregar mapa do Google
        </button>
        <p className="mt-2 text-xs text-taupe-texto">Ao carregar, o Google pode usar cookies.</p>
      </div>
    </div>
  );
}

export function Contato() {
  return (
    <Secao id="contato">
      <div className="container-site">
        <Cabecalho id="contato" eyebrow="Localização e contato" titulo="Venha conhecer o *consultório*." />
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <div className="revelar flex flex-col gap-5 rounded-xl3 bg-white/90 p-7 ring-1 ring-areia md:p-10 lg:col-span-5">
            <div className="flex gap-4">
              <MapPin size={24} className="mt-1 shrink-0 text-menta-escuro" aria-hidden />
              <div>
                <h3 className="text-xl font-medium">Endereço</h3>
                <address className="mt-1 not-italic leading-relaxed text-cacau-2">
                  {CONFIG.endereco.rua} - {CONFIG.endereco.bairro}
                  <br />
                  {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, {CONFIG.endereco.cep}
                </address>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock size={24} className="mt-1 shrink-0 text-menta-escuro" aria-hidden />
              <div className="w-full">
                <h3 className="text-xl font-medium">Horários</h3>
                <dl className="mt-2 divide-y divide-areia">
                  {CONFIG.horarios.map((h) => (
                    <div key={h.dias} className="flex flex-wrap justify-between gap-x-4 py-2">
                      <dt className="font-semibold">{h.dias}</dt>
                      <dd className="text-cacau-2">{h.periodos.join(" · ")}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-sm text-taupe-texto">
                  Intervalo de almoço das 12h às 14h. {CONFIG.observacaoHorarios} Atendimento somente com agendamento.
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BotaoWhatsApp>Agendar avaliação</BotaoWhatsApp>
              <Botao href={CONFIG.maps.link} externo variante="secundario" icone={<Navigation size={18} aria-hidden />}>
                Como chegar
              </Botao>
            </div>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.98rem]">
              <a className="font-bold text-menta-profundo underline decoration-menta underline-offset-4 hover:decoration-2" href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
              <a className="font-bold text-menta-profundo underline decoration-menta underline-offset-4 hover:decoration-2" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {CONFIG.instagram.usuario}
              </a>
            </p>
          </div>
          <div className="revelar overflow-hidden rounded-xl3 ring-1 ring-areia lg:col-span-7" style={{ ["--atraso" as string]: ".1s" }}>
            <Mapa />
          </div>
        </div>
      </div>
    </Secao>
  );
}

export function CtaFinal() {
  return (
    <section data-linha aria-labelledby="cta-titulo" className="relative z-[1] pb-20 pt-6 md:pb-28">
      <div className="container-site">
        <div className="tema-escuro revelar relative overflow-hidden rounded-xl3 bg-cacau px-7 py-16 text-center text-creme md:px-16 md:py-24">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden>
            <path d="M-20 330 C 180 250, 330 400, 520 300 S 760 230, 830 260" fill="none" stroke="var(--color-menta)" strokeOpacity=".35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <Estrela tamanho={26} className="absolute left-[12%] top-12 text-manteiga" />
          <Estrela tamanho={18} className="absolute bottom-14 right-[14%] text-rosa" />
          <p className="eyebrow !text-menta">Vamos conversar</p>
          <h2 id="cta-titulo" className="mx-auto mt-4 max-w-3xl text-[clamp(2.3rem,1.5rem+3.6vw,4.4rem)] font-[450]">
            O primeiro passo é uma <em className="enfase">conversa.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-creme/85">
            Mande uma mensagem, conte um pouco sobre seu filho e combine um horário para a avaliação.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <BotaoWhatsApp variante="claro" magnetico>
              Agendar pelo WhatsApp
            </BotaoWhatsApp>
            <BotaoInstagram variante="contorno-claro" />
          </div>
        </div>
      </div>
    </section>
  );
}
