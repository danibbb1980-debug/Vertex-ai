import { useRef, type ReactNode } from "react";
import { prefereMenosMovimento } from "../lib/movimento";
import { CONFIG, whatsappLink, type Fase } from "../config";
import { IconWhatsApp } from "./Icons";

/** Marcador "a confirmar", visível só no modo rascunho. */
export function Confirmar({ texto = "a confirmar" }: { texto?: string }) {
  if (!CONFIG.rascunho) return null;
  return <span className="confirmar">{texto}</span>;
}

/** Texto ainda não informado pela clínica. */
export function Pendente({ children = "[A CONFIRMAR]" }: { children?: ReactNode }) {
  return <span className="placeholder-text">{children}</span>;
}

/** Título de seção com uma palavra em ênfase: use *palavra* no texto. */
export function Titulo({
  texto,
  as: Tag = "h2",
  className = "",
  id,
}: {
  texto: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  const partes = texto.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <Tag id={id} className={className}>
      {partes.map((p, i) =>
        p.startsWith("*") ? (
          <em key={i} className="enfase">
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </Tag>
  );
}

export function CabecalhoSecao({
  eyebrow,
  titulo,
  texto,
  id,
  centro = false,
  className = "",
}: {
  eyebrow: string;
  titulo: string;
  texto?: ReactNode;
  id: string;
  centro?: boolean;
  className?: string;
}) {
  return (
    <div className={`reveal max-w-2xl ${centro ? "mx-auto text-center" : ""} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <Titulo
        id={id}
        texto={titulo}
        className="mt-4 text-[2.15rem] leading-[1.08] font-normal sm:text-5xl md:text-[3.4rem]"
      />
      {texto ? <div className="mt-5 text-lg text-body">{texto}</div> : null}
    </div>
  );
}

/**
 * Botão com leve atração ao cursor (adaptado do padrão "magnetic button").
 * Só age com mouse e sem preferência por menos movimento. Anima só transform.
 */
export function Magnetico({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  function mover(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || prefereMenosMovimento()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.28;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }
  function soltar() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <span
      ref={ref}
      className={`inline-flex transition-transform duration-300 ease-[var(--ease-soft)] ${className}`}
      onPointerMove={mover}
      onPointerLeave={soltar}
    >
      {children}
    </span>
  );
}

export function BotaoWhatsApp({
  fase = "geral",
  children = "Agendar avaliação",
  variante = "primary",
  className = "",
  magnetico = true,
  largo = false,
}: {
  fase?: Fase;
  children?: ReactNode;
  variante?: "primary" | "sage" | "light" | "ghost";
  className?: string;
  magnetico?: boolean;
  /** ocupa a largura toda no celular */
  largo?: boolean;
}) {
  const a = (
    <a
      href={whatsappLink(fase)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variante} ${largo ? "w-full sm:w-auto" : ""} ${className}`}
    >
      <IconWhatsApp size={20} />
      <span>{children}</span>
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
  return magnetico ? <Magnetico className={largo ? "w-full sm:w-auto" : ""}>{a}</Magnetico> : a;
}

/** Imagem responsiva AVIF + WebP. */
export function Foto({
  base,
  larguras,
  largura,
  altura,
  alt,
  sizes,
  className = "",
  prioridade = false,
}: {
  base: string;
  larguras: readonly number[];
  largura: number;
  altura: number;
  alt: string;
  sizes: string;
  className?: string;
  prioridade?: boolean;
}) {
  const set = (ext: string) => larguras.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}-${larguras[larguras.length - 1]}.webp`}
        width={largura}
        height={altura}
        alt={alt}
        className={className}
        loading={prioridade ? "eager" : "lazy"}
        decoding={prioridade ? "sync" : "async"}
        fetchPriority={prioridade ? "high" : "auto"}
      />
    </picture>
  );
}
