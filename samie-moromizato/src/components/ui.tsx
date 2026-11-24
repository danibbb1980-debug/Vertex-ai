import type { ReactNode } from "react";
import { CONFIG, msgGeral, telHref, usaWhats, waHref, type Foto } from "../config";

/** Rótulo de seção: número + marca de revisão que se desenha ao entrar na tela. */
export function SecNum({ n, children, onInk }: { n: string; children: ReactNode; onInk?: boolean }) {
  return (
    <p className={`sec-num${onInk ? " on-ink" : ""}`} data-reveal>
      <span className="sec-num__n">{n}</span>
      <span className="rev-mark" aria-hidden="true" />
      <span className="sec-num__t">{children}</span>
    </p>
  );
}

/** Título revelado por linha, com máscara. Cada item do array é uma linha. */
export function Title({
  lines,
  as: Tag = "h2",
  className = "",
  id,
}: {
  lines: ReactNode[];
  as?: "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <Tag className={`title ${className}`} id={id} data-reveal>
      {lines.map((l, i) => (
        <span className="mask-line" key={i}>
          <span className="mask-line__in" style={{ ["--i" as string]: i }}>
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}

type BtnProps = {
  variant?: "solid" | "line" | "ghost";
  onInk?: boolean;
  mensagem?: string;
  className?: string;
  /** força o modo telefone (usado como secundário quando há WhatsApp) */
  forcarTelefone?: boolean;
  labelTelefone?: string;
};

/** Botão de agendamento: telefone por padrão; WhatsApp quando usarWhatsapp = true. */
export function AgendarBtn({
  variant = "solid",
  onInk,
  mensagem = msgGeral,
  className = "",
  forcarTelefone,
  labelTelefone = "Ligar para agendar",
}: BtnProps) {
  const cls = `btn btn--${variant}${onInk ? " btn--on-ink" : ""} ${className}`;
  if (usaWhats() && !forcarTelefone) {
    return (
      <a className={cls} href={waHref(mensagem)} target="_blank" rel="noopener noreferrer">
        <span className="btn__mark" aria-hidden="true">⁄</span>
        Agendar horário<span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <a className={cls} href={telHref()}>
      <span className="btn__mark" aria-hidden="true">⁄</span>
      {labelTelefone}
      <span className="sr-only">: {CONFIG.telefoneExibicao}</span>
    </a>
  );
}

/** Par de botões: principal + (se WhatsApp ligado) "Ligar" como secundário. */
export function AgendarPar({ onInk, mensagem }: { onInk?: boolean; mensagem?: string }) {
  return (
    <>
      <AgendarBtn onInk={onInk} mensagem={mensagem} />
      {usaWhats() && (
        <AgendarBtn variant="line" onInk={onInk} forcarTelefone labelTelefone="Ligar" />
      )}
    </>
  );
}

export function ExtLink({
  href,
  children,
  variant = "line",
  onInk,
}: {
  href: string;
  children: ReactNode;
  variant?: "line" | "ghost";
  onInk?: boolean;
}) {
  return (
    <a
      className={`btn btn--${variant}${onInk ? " btn--on-ink" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/** Foto com espaço reservado (aspect-ratio), lazy e com srcset. */
export function Photo({
  foto,
  sizes = "(min-width: 64rem) 40vw, 100vw",
  eager,
  className = "",
  legenda,
}: {
  foto: Foto;
  sizes?: string;
  eager?: boolean;
  className?: string;
  legenda?: ReactNode;
}) {
  const base = `/fotos/${foto.arquivo}`;
  return (
    <figure className={`photo ${className}`}>
      <div className="photo__frame" style={{ aspectRatio: String(foto.proporcao) }}>
        <img
          src={`${base}-1100.webp`}
          srcSet={`${base}-640.webp 640w, ${base}-1100.webp 1100w`}
          sizes={sizes}
          alt={foto.alt}
          width={1100}
          height={Math.round(1100 / foto.proporcao)}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
      {legenda && <figcaption className="photo__cap">{legenda}</figcaption>}
    </figure>
  );
}
