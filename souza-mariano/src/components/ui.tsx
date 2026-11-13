import type { ReactNode } from "react";
import { CONFIG, temWhatsapp, whatsappHref } from "../config";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-5 sm:px-8 lg:pl-12 lg:pr-28 ${className}`}>{children}</div>;
}

export function Rotulo({ children, className = "", claro = false }: { children: ReactNode; className?: string; claro?: boolean }) {
  return (
    <p className={`font-sans text-[0.72rem] font-medium uppercase tracking-[0.22em] ${claro ? "text-bronze-claro" : "text-bronze-texto"} ${className}`}>
      {children}
    </p>
  );
}

export function IconeTelefone({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  );
}

export function IconeWhatsapp({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z" />
      <path d="M9 8.6c0 3 2.4 5.9 5.6 6.4l1-1.3-1.8-.9-.8.8a4.6 4.6 0 0 1-2.4-2.4l.8-.8-.9-1.8L9 8.6Z" />
    </svg>
  );
}

export function Seta({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

type Variante = "primario" | "secundario" | "claro" | "contorno-claro";

const estilos: Record<Variante, string> = {
  primario: "bg-vinho text-osso hover:bg-vinho-escuro",
  secundario: "border border-grafite/30 text-grafite hover:border-vinho hover:text-vinho",
  claro: "bg-osso text-vinho-escuro hover:bg-osso-2",
  "contorno-claro": "border border-osso/40 text-osso hover:border-bronze-claro hover:text-bronze-claro",
};

interface BotaoProps {
  href: string;
  children: ReactNode;
  variante?: Variante;
  externo?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Botão-link com o "fio" que corre sob o texto no hover (efeito sutil). */
export function Botao({ href, children, variante = "primario", externo, className = "", ariaLabel }: BotaoProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`botao group relative inline-flex min-h-12 items-center justify-center gap-2.5 px-6 py-3 font-sans text-[0.95rem] font-medium tracking-[0.01em] transition-colors duration-300 ${estilos[variante]} ${className}`}
    >
      {children}
      <span aria-hidden="true" className="botao-fio" />
    </a>
  );
}

/** Contato principal: WhatsApp quando confirmado, senão telefone. */
export function contatoPrincipal() {
  if (temWhatsapp()) {
    return { href: whatsappHref(), externo: true, rotulo: "Agendar pelo WhatsApp", Icone: IconeWhatsapp };
  }
  return { href: CONFIG.telefoneHref, externo: false, rotulo: "Ligar para agendar", Icone: IconeTelefone };
}

export function BotaoLigar({ variante = "primario", className = "", rotulo = "Ligar para agendar" }: { variante?: Variante; className?: string; rotulo?: string }) {
  return (
    <Botao href={CONFIG.telefoneHref} variante={variante} className={className} ariaLabel={`${rotulo}: ${CONFIG.telefone}`}>
      <IconeTelefone />
      {rotulo}
    </Botao>
  );
}

/** Botão principal + "Ligar" ao lado quando o WhatsApp estiver ligado. */
export function BotoesContato({ variante = "primario", secundaria = "secundario" as Variante, className = "" }: { variante?: Variante; secundaria?: Variante; className?: string }) {
  const c = contatoPrincipal();
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Botao href={c.href} externo={c.externo} variante={variante}>
        <c.Icone />
        {c.rotulo}
      </Botao>
      {temWhatsapp() && <BotaoLigar variante={secundaria} rotulo="Ligar" />}
    </div>
  );
}

/** Imagem com WebP + JPG, dimensões reservadas (sem CLS) e carregamento preguiçoso. */
export function Imagem({ src, alt, largura, altura, className = "", eager = false }: { src: string; alt: string; largura: number; altura: number; className?: string; eager?: boolean }) {
  const webp = src.replace(/\.(jpe?g|png)$/i, ".webp");
  return (
    <picture>
      {webp !== src && <source srcSet={webp} type="image/webp" />}
      <img src={src} alt={alt} width={largura} height={altura} loading={eager ? "eager" : "lazy"} decoding="async" className={className} />
    </picture>
  );
}
