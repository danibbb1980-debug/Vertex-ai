import { useState } from "react";
import { CONFIG, enderecoLinha, waLink } from "../config";
import { IconClock, IconExternal, IconInstagram, IconMapPin, IconWhatsApp } from "../components/Icons";
import { LogoSymbol } from "../components/Logo";
import { Reveal, SectionTitle } from "../components/Reveal";
import { resumoHorarios } from "../lib/horarios";

function Mapa() {
  const [ativo, setAtivo] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsEmbedQuery)}&output=embed&hl=pt-BR`;
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border border-linha bg-nevoa shadow-suave lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      {ativo ? (
        <iframe title={`Mapa: ${enderecoLinha()}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <g fill="none" stroke="#c9dad9" strokeWidth="1">
              <path d="M-10 210 C 90 170, 160 230, 260 180 S 380 120, 420 140" strokeWidth="10" stroke="#ffffff" />
              <path d="M120 -10 C 140 80, 110 160, 150 320" strokeWidth="7" stroke="#ffffff" />
              <path d="M-10 90 L 420 60" strokeWidth="5" stroke="#ffffff" />
              <path d="M300 -10 L 260 320" strokeWidth="5" stroke="#ffffff" />
              <circle cx="200" cy="150" r="80" />
              <circle cx="200" cy="150" r="130" opacity=".6" />
            </g>
          </svg>
          <div className="relative flex flex-col items-center gap-3">
            <span className="relative flex size-16 items-center justify-center rounded-full bg-white shadow-alta">
              <span aria-hidden="true" className="absolute inset-0 rounded-full border border-agua-400 motion-safe:animate-[pulso_2.6s_ease-in-out_infinite]" />
              <LogoSymbol className="size-10" />
            </span>
            <p className="font-display text-xl font-semibold text-petroleo-900">{CONFIG.endereco.rua}, {CONFIG.endereco.complemento}</p>
            <button type="button" onClick={() => setAtivo(true)} className="btn btn-secundario !min-h-12 bg-white">
              <IconMapPin width={18} height={18} /> Mostrar mapa interativo
            </button>
            <p className="max-w-xs text-xs text-cinza">O mapa é carregado do Google somente quando você toca no botão.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Contato() {
  const horarios = resumoHorarios();
  const e = CONFIG.endereco;
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="relative py-20 sm:py-28">
      <span data-arc="3" data-arc-x="left" className="absolute top-24 block h-px w-px" />
      <div className="container-site relative z-10">
        <SectionTitle id="titulo-contato" rotulo="Localização e contato" titulo="Venha nos visitar." enfase="visitar" intro={<p>Consultório no Centro de {CONFIG.cidade}, com atendimento em hora marcada.</p>} />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="card flex flex-col p-7 sm:p-9">
            <div className="flex gap-4">
              <IconMapPin width={26} height={26} className="mt-1 shrink-0 text-agua-600" />
              <div>
                <h3 className="text-2xl font-semibold">Endereço</h3>
                <address className="mt-1.5 not-italic text-grafite">
                  {e.rua}, {e.complemento}
                  <br />
                  {e.bairro}, {e.cidade} - {e.uf}
                  <br />
                  CEP {e.cep}
                </address>
                <a href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-sub mt-3 inline-flex min-h-12 items-center gap-1.5 font-semibold text-petroleo-800">
                  Ver no Google Maps <IconExternal width={16} height={16} />
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </div>
            </div>
            <div className="mt-6 flex gap-4 border-t border-linha pt-6">
              <IconClock width={26} height={26} className="mt-1 shrink-0 text-agua-600" />
              <div className="w-full">
                <h3 className="text-2xl font-semibold">Horários</h3>
                <dl className="mt-2 space-y-1.5">
                  {horarios.map((h) => (
                    <div key={h.dias} className="flex flex-wrap justify-between gap-x-4 border-b border-dashed border-linha pb-1.5 last:border-0">
                      <dt className="text-grafite">{h.dias}</dt>
                      <dd className={h.horas === "Fechado" ? "text-cinza" : "font-semibold text-petroleo-900"}>{h.horas}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-sm text-cinza">{CONFIG.avisoHorarios}</p>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primario flex-1">
                <IconWhatsApp width={20} height={20} /> {CONFIG.whatsappExibicao}
                <span className="sr-only"> no WhatsApp (abre em nova aba)</span>
              </a>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-secundario flex-1">
                <IconInstagram width={20} height={20} /> {CONFIG.instagram.usuario}
                <span className="sr-only"> no Instagram (abre em nova aba)</span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Mapa />
          </Reveal>
        </div>

        {CONFIG.mostrarOutrasUnidades && CONFIG.outrasUnidades.length > 0 && (
          <Reveal className="mt-10">
            <h3 className="text-2xl font-semibold">Outros locais de atendimento</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {CONFIG.outrasUnidades.map((u) => (
                <li key={u.nome} className="card flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-display text-xl font-semibold text-petroleo-900">{u.nome}</p>
                    <p className="text-cinza">{u.cidade}</p>
                  </div>
                  <a href={waLink(CONFIG.mensagens.geral, u.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-secundario !px-4" aria-label={`WhatsApp da ${u.nome} (abre em nova aba)`}>
                    <IconWhatsApp width={20} height={20} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
