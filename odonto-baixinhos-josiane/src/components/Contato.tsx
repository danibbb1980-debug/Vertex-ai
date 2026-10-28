import { useState } from "react";
import { CONFIG, enderecoCompleto, linkWhatsApp, modoAtual, profissionaisAtivas } from "../config";
import { linhasDeHorario } from "../lib/horarios";
import { FotoFachada } from "./FotoFachada";
import { IconeInstagram, IconeMapa, IconeRelogio, IconeSeta, IconeWhatsApp } from "./Icones";
import { Cabecalho } from "./Texto";

function Mapa() {
  const [carregar, setCarregar] = useState(false);
  if (carregar)
    return (
      <iframe
        title={`Mapa: ${enderecoCompleto}`}
        src={CONFIG.endereco.mapsEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
        allowFullScreen
      />
    );
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#efe6d6]">
      {/* mapa ilustrado (não é o mapa real): ruas estilizadas, só decoração */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="#fbf6ee" strokeLinecap="round" fill="none">
          <path d="M-20 210 L 420 120" strokeWidth="18" />
          <path d="M120 -20 L 170 320" strokeWidth="10" />
          <path d="M290 -20 L 250 320" strokeWidth="10" />
          <path d="M-20 70 L 420 40" strokeWidth="7" />
          <path d="M-20 290 L 420 250" strokeWidth="7" />
          <path d="M40 -20 L 70 320" strokeWidth="5" />
          <path d="M360 -20 L 340 320" strokeWidth="5" />
        </g>
        <g fill="#e2d6c1">
          <rect x="185" y="60" width="50" height="50" rx="6" />
          <rect x="80" y="100" width="30" height="60" rx="6" />
          <rect x="300" y="160" width="40" height="40" rx="6" />
          <rect x="190" y="200" width="45" height="35" rx="6" />
        </g>
      </svg>
      <div className="relative flex flex-col items-center gap-3 p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tinta text-ouro-claro shadow-lg">
          <IconeMapa />
        </span>
        <button type="button" onClick={() => setCarregar(true)} className="btn btn-tinta">
          Carregar mapa do Google
        </button>
        <p className="max-w-[16rem] text-xs text-tinta-2">O mapa só carrega se você pedir, e vem do Google.</p>
      </div>
    </div>
  );
}

export function Contato() {
  const ambas = modoAtual() === "ambas";
  const e = CONFIG.endereco;
  return (
    <section id="contato" className="py-20 md:py-28" aria-labelledby="titulo-contato">
      <div className="container-site">
        <Cabecalho
          id="titulo-contato"
          eyebrow="Localização e contato"
          titulo="Venha nos *visitar*."
          texto={
            ambas
              ? "Procure as duas portas lado a lado: a fachada em preto, dourado e madeira, e o castelo colorido."
              : "No centro de Alfenas, com acessibilidade para cadeirantes."
          }
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-6">
            <div className="revela rounded-[var(--radius-cartao)] border border-linha bg-marfim-2/50 p-6 md:p-8">
              <div className="flex gap-4">
                <IconeMapa className="mt-1 shrink-0 text-ouro-texto" />
                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-ouro-texto [font-variation-settings:normal]">Endereço</h3>
                  {/* CONFIRMAR COM A CLÍNICA: endereço (ficha do Google) */}
                  <p className="mt-2 text-lg leading-snug">
                    {e.rua} · {e.bairro}
                    <br />
                    {e.cidade} - {e.uf} · {e.cep}
                  </p>
                </div>
              </div>
              <div className="mt-7 flex gap-4">
                <IconeRelogio className="mt-1 shrink-0 text-ouro-texto" />
                <div className="flex-1">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-ouro-texto [font-variation-settings:normal]">Horários</h3>
                  {/* CONFIRMAR POR PROFISSIONAL: a ficha do Google é única */}
                  <dl className="mt-2 divide-y divide-linha">
                    {linhasDeHorario().map((l) => (
                      <div key={l.dias} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2.5">
                        <dt className="font-semibold">{l.dias}</dt>
                        <dd className={l.fechado ? "text-tinta-2" : ""}>{l.texto}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm text-tinta-2">
                    Intervalo de almoço das 11h30 às 13h30. {CONFIG.observacaoHorarios}
                  </p>
                </div>
              </div>
              <a href={e.mapsUrl} target="_blank" rel="noopener" className="btn btn-tinta mt-8 w-full sm:w-auto">
                Como chegar
                <IconeSeta />
              </a>
            </div>

            <div className={`grid gap-4 ${ambas ? "sm:grid-cols-2" : ""}`}>
              {profissionaisAtivas().map((p) => {
                const baixinhos = p.id === "aline";
                return (
                  <div
                    key={p.id}
                    className={`revela rounded-[var(--radius-cartao)] p-6 ${baixinhos ? "tema-baixinhos bg-ceu" : "tema-josiane bg-creme"}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-tinta-2">{baixinhos ? "Odonto Baixinhos" : "Consultório"}</p>
                    <h3 className="mt-2 text-2xl">{p.nome}</h3>
                    <p className="mt-1 text-sm text-tinta-2">{p.publico}</p>
                    <div className="mt-5 grid gap-2">
                      <a
                        href={linkWhatsApp(p.whatsapp, p.mensagemWhatsApp)}
                        target="_blank"
                        rel="noopener"
                        className="btn btn-tinta justify-start !px-4"
                        aria-label={`WhatsApp da ${p.nome}: ${p.whatsappExibicao} (abre em nova aba)`}
                      >
                        <IconeWhatsApp tamanho={18} className="shrink-0" /> {p.whatsappExibicao}
                      </a>
                      <a
                        href={p.instagram}
                        target="_blank"
                        rel="noopener"
                        className="btn btn-contorno justify-start !px-4"
                        aria-label={`Instagram ${p.instagramUser} (abre em nova aba)`}
                      >
                        <IconeInstagram tamanho={18} className="shrink-0" /> <span className="min-w-0 truncate text-[0.85rem]">{p.instagramUser}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="revela relative min-h-[26rem] overflow-hidden rounded-[var(--radius-cartao)] border border-linha lg:min-h-0">
            <Mapa />
            <div className="pointer-events-none absolute left-4 top-4 w-24 overflow-hidden rounded-2xl border-4 border-marfim shadow-xl md:bottom-4 md:top-auto md:w-36">
              <FotoFachada compacta className="aspect-[4/5] w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
