import { useRef, type ReactNode, type PointerEvent } from "react";
import { WhatsApp, Instagram } from "./Icones";
import { CONFIG, linkWhatsApp } from "../config";

type Variante = "primario" | "secundario" | "claro" | "contorno-claro";

const estilos: Record<Variante, string> = {
  primario:
    "bg-menta-escuro text-white shadow-[0_10px_30px_-12px_rgba(36,87,74,0.55)] hover:bg-menta-profundo",
  secundario: "bg-transparent text-cacau ring-1 ring-inset ring-cacau/25 hover:bg-white/70 hover:ring-cacau/40",
  claro: "bg-creme text-cacau hover:bg-white",
  "contorno-claro": "bg-transparent text-creme ring-1 ring-inset ring-creme/40 hover:bg-creme/10 hover:ring-creme/70",
};

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  externo?: boolean;
  className?: string;
  icone?: ReactNode;
  /** Efeito magnético sutil (inspirado no Magnetic Button do 21st.dev). Só com mouse e sem movimento reduzido. */
  magnetico?: boolean;
  ariaLabel?: string;
};

export function Botao({ href, children, variante = "primario", externo, className = "", icone, magnetico, ariaLabel }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const interno = useRef<HTMLSpanElement>(null);

  const mover = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!magnetico || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (interno.current) interno.current.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
  };
  const sair = () => {
    if (ref.current) ref.current.style.transform = "";
    if (interno.current) interno.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={mover}
      onPointerLeave={sair}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.98rem] font-bold tracking-[0.005em] transition-[background-color,box-shadow,transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${estilos[variante]} ${className}`}
    >
      <span ref={interno} className="inline-flex items-center gap-2.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
        {icone}
        {children}
      </span>
    </a>
  );
}

export function BotaoWhatsApp({
  mensagem = CONFIG.mensagens.geral,
  children = "Agendar avaliação",
  variante = "primario",
  className,
  magnetico,
}: {
  mensagem?: string;
  children?: ReactNode;
  variante?: Variante;
  className?: string;
  magnetico?: boolean;
}) {
  return (
    <Botao
      href={linkWhatsApp(mensagem)}
      externo
      variante={variante}
      className={className}
      magnetico={magnetico}
      icone={<WhatsApp tamanho={19} />}
    >
      {children}
    </Botao>
  );
}

export function BotaoInstagram({ variante = "secundario", children = "Ver no Instagram", className }: { variante?: Variante; children?: ReactNode; className?: string }) {
  return (
    <Botao href={CONFIG.instagram.url} externo variante={variante} className={className} icone={<Instagram tamanho={19} />}>
      {children}
    </Botao>
  );
}

/** Placeholder visível para dados a confirmar. CONFIRMAR COM A CLÍNICA. */
export function AConfirmar({ children }: { children: ReactNode }) {
  return <span className="placeholder-confirmar">{children}</span>;
}

/** Destaca [A CONFIRMAR] dentro de um texto de CONFIG. */
export function ComPlaceholder({ texto }: { texto: string }) {
  const partes = texto.split(/(\[[^\]]+\])/g);
  return (
    <>
      {partes.map((p, i) => (p.startsWith("[") ? <AConfirmar key={i}>{p}</AConfirmar> : p))}
    </>
  );
}
