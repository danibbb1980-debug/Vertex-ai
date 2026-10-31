import { CONFIG, enderecoCompleto, waLink } from "../config";
import { Brand } from "./Brand";
import { InstaIcon, PhoneIcon, WhatsIcon } from "./Icons";
import { Reveal } from "./Reveal";

export function CtaFinal() {
  return (
    <section aria-labelledby="cta-titulo" className="on-dark relative overflow-hidden bg-night py-20 text-white sm:py-24">
      <div className="grid-mod-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 gap-2.5 md:grid md:grid-cols-3 lg:right-24" aria-hidden>
        {[0, 1, 0, 1, 1, 1, 0, 1, 0].map((on, i) => (
          <span key={i} className={`h-14 w-14 rounded-2xl lg:h-16 lg:w-16 ${on ? "bg-brand" : "bg-transparent"}`} />
        ))}
      </div>
      <Reveal className="wrap relative">
        <p className="eyebrow">{CONFIG.assinatura}</p>
        <h2 id="cta-titulo" className="h2 mt-4 max-w-2xl">
          Encontre a área certa e <em className="enfase">agende</em>.
        </h2>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={waLink(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="btn-light">
            <WhatsIcon /> Agendar pelo WhatsApp
          </a>
          {CONFIG.secoes.agendar && (
            <a href="#agendar" className="btn-ghost">
              Solicitar pelo formulário
            </a>
          )}
          <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <InstaIcon /> Ver no Instagram
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="on-dark border-t border-white/10 bg-[#081727] pb-28 pt-14 text-[#C7D6E6] lg:pb-14">
      <div className="wrap grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Brand dark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{enderecoCompleto()}</p>
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Contato</h2>
          <ul className="mt-4 grid gap-1 text-sm">
            <li>
              <a href={`tel:${CONFIG.telefone.tel}`} className="inline-flex min-h-[40px] items-center gap-2 hover:text-white">
                <PhoneIcon width={16} height={16} /> {CONFIG.telefone.exibir}
              </a>
            </li>
            {CONFIG.whatsappAndares.map((w) => (
              <li key={w.numero}>
                <a href={waLink(CONFIG.mensagens.geral, w.numero)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2 hover:text-white">
                  <WhatsIcon width={16} height={16} /> {w.rotulo}: {w.exibir}
                </a>
              </li>
            ))}
            <li>
              <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2 hover:text-white">
                <InstaIcon width={16} height={16} /> {CONFIG.instagram.usuario}
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm leading-relaxed">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Informações</h2>
          <p className="mt-4">Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.</p>
          <p className="mt-3">Registro profissional de cada profissional exibido em seu cartão.</p>
          <a href="/privacidade.html" className="mt-3 inline-flex min-h-[40px] items-center font-medium text-white underline underline-offset-4">
            Privacidade
          </a>
        </div>
      </div>
      <div className="wrap mt-10 border-t border-white/10 pt-6 text-xs text-[#9FB3C8]">
        © {new Date().getFullYear()} {CONFIG.nome} · Pouso Alegre - MG
      </div>
    </footer>
  );
}

/** Botão flutuante (desktop) e barra fixa (celular). */
export function WhatsFlutuante() {
  const href = waLink(CONFIG.mensagens.geral);
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 rounded-2xl bg-brand-ink pl-4 pr-5 font-display font-semibold text-white shadow-lift transition-transform hover:-translate-y-0.5 lg:inline-flex"
      >
        <WhatsIcon width={22} height={22} /> WhatsApp
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-night/10 bg-white/95 px-4 py-2.5 backdrop-blur-md lg:hidden" style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-md gap-2">
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 !min-h-[48px] !py-2">
            <WhatsIcon /> Agendar
          </a>
          <a href={`tel:${CONFIG.telefone.tel}`} className="btn-ghost !min-h-[48px] !px-4 !py-2" aria-label={`Ligar para ${CONFIG.telefone.exibir}`}>
            <PhoneIcon /> Ligar
          </a>
        </div>
      </div>
    </>
  );
}
