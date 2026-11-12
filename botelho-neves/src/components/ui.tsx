import type { ReactNode } from "react";
import { CONFIG, linkWhatsapp, temWhatsapp } from "../config";

/** Ícone de telefone, traço fino. */
export function IconeTelefone({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 3.5h3.2l1.6 4.3-2 1.3a11 11 0 0 0 7.1 7.1l1.3-2 4.3 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  );
}

export function IconeWhatsapp({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 20l1.2-3.9A8 8 0 1 1 8 18.9L4 20Z" />
      <path d="M9 8.5c0 3.2 2.3 6 5.5 6.5l1-1.3-1.8-1-1 .8a4.4 4.4 0 0 1-2.2-2.2l.8-1-1-1.8L9 8.5Z" />
    </svg>
  );
}

export function IconeSeta({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type BotaoContatoProps = {
  variante?: "cheio" | "linha";
  rotuloTelefone?: string;
  mensagem?: string;
  className?: string;
  /** Com WhatsApp ligado, mostra também o botão "Ligar" ao lado. */
  comLigar?: boolean;
};

/**
 * Botão principal de contato. Hoje: "Ligar" (tel:).
 * Com CONFIG.usarWhatsapp = true: WhatsApp com mensagem pronta e "Ligar" ao lado.
 */
export function BotaoContato({
  variante = "cheio",
  rotuloTelefone = "Ligar para agendar",
  mensagem = CONFIG.mensagens.geral,
  className = "",
  comLigar = true,
}: BotaoContatoProps) {
  if (temWhatsapp()) {
    return (
      <>
        <a className={`btn btn-${variante} ${className}`} href={linkWhatsapp(mensagem)} target="_blank" rel="noopener noreferrer">
          <IconeWhatsapp />
          Agendar pelo WhatsApp
        </a>
        {comLigar && (
          <a className={`btn btn-linha ${className}`} href={CONFIG.telefoneHref}>
            <IconeTelefone />
            Ligar
          </a>
        )}
      </>
    );
  }
  return (
    <a className={`btn btn-${variante} ${className}`} href={CONFIG.telefoneHref}>
      <IconeTelefone />
      {rotuloTelefone}
    </a>
  );
}

/** Cabeçalho de seção: numeral romano no fio da margem, rótulo e título. */
export function Cabecalho({
  numero,
  rotulo,
  children,
  id,
  className = "",
}: {
  numero: string;
  rotulo: string;
  children: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <p className="rotulo flex items-center gap-4 text-pedra">
        <span className="num font-display text-[1.05rem] tracking-normal normal-case text-verde">{numero}</span>
        <span aria-hidden="true" className="h-px w-10 bg-fio" />
        <span>{rotulo}</span>
      </p>
      <h2 id={id} className="titulo mt-6 text-[2.5rem] leading-[1.02] sm:text-[3.25rem] lg:text-[4rem]">
        {children}
      </h2>
    </header>
  );
}
