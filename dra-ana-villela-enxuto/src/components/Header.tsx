import { CONFIG } from "../config";

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center border-b border-perola-claro/10 bg-noite-2 px-3 text-center text-[0.63rem] tracking-[0.02em] text-perola-claro/75 sm:text-[0.72rem] sm:tracking-[0.04em]"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

/** Abertura: assinatura desenhada e cortina que sobe (CSS puro, só na primeira visita da sessão). */
export function Abertura() {
  return (
    <div aria-hidden className="abertura">
      <div className="text-center">
        <span className="abertura-assinatura block leading-none">{CONFIG.nomeCurto}</span>
        <span className="abertura-linha mx-auto w-40" />
      </div>
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-display text-[1.4rem] italic tracking-[-0.01em] ${light ? "text-perola-claro" : "text-tinta"}`}>
        {CONFIG.nomeCurto}
      </span>
      <span className={`mt-1.5 text-[0.66rem] tracking-[0.08em] ${light ? "text-perola-claro/60" : "text-grafite"}`}>
        {CONFIG.descritor}
      </span>
    </span>
  );
}

/** Header mínimo sobre o fundo noturno: assinatura + um botão para o agendamento. */
export function Header() {
  return (
    <header
      className={`fixed inset-x-0 ${CONFIG.rascunho ? "top-8" : "top-0"} z-50 border-b border-perola-claro/8 bg-noite/85 backdrop-blur-md`}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <a href="#inicio">
          <Logo light />
          <span className="sr-only">, voltar ao início</span>
        </a>
        <a
          href="#agendar"
          data-magnetic
          className="inline-flex min-h-11 items-center rounded-full border border-champagne-claro/40 px-5 text-[0.85rem] font-medium text-perola-claro transition-colors hover:border-champagne-claro hover:bg-champagne-claro hover:text-noite"
        >
          Agendar avaliação
        </a>
      </div>
      {/* Progresso de leitura */}
      <span aria-hidden className="progresso absolute inset-x-0 bottom-0 h-px bg-champagne-claro/70" />
    </header>
  );
}
