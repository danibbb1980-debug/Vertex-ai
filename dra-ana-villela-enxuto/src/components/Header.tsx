import { CONFIG, whatsappLink } from "../config";
import { IconWhatsapp } from "./Icons";

export function DraftBanner() {
  if (!CONFIG.rascunho) return null;
  return (
    <div
      role="note"
      className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-tinta px-3 text-center text-[0.63rem] tracking-[0.02em] text-porcelana/85 sm:text-[0.72rem] sm:tracking-[0.04em]"
    >
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-display text-[1.4rem] italic tracking-[-0.01em] ${light ? "text-porcelana" : "text-tinta"}`}>
        {CONFIG.nomeCurto}
      </span>
      <span className={`eyebrow mt-1.5 !text-[0.58rem] !tracking-[0.32em] ${light ? "text-porcelana/70" : "text-grafite"}`}>
        {CONFIG.descritor}
      </span>
    </span>
  );
}

/** Header mínimo: assinatura + um botão. Sem menu. */
export function Header() {
  return (
    <header
      className={`fixed inset-x-0 ${CONFIG.rascunho ? "top-8" : "top-0"} z-50 bg-porcelana/90 shadow-[0_1px_0_rgba(27,37,54,0.07)] backdrop-blur-md`}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <a href="#inicio">
          <Logo />
          <span className="sr-only">, voltar ao início</span>
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tinta px-4 text-[0.85rem] font-medium text-porcelana transition-colors hover:bg-tinta-2 sm:px-5"
        >
          <IconWhatsapp width={17} height={17} />
          Agendar avaliação
        </a>
      </div>
    </header>
  );
}
