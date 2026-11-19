import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CONFIG, modoWhatsapp, telHref, waHref } from "../config";

export function IconeTelefone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.9 6.9l1.3-2 4 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4Z" strokeLinejoin="round" />
    </svg>
  );
}
export function IconeConversa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 18.5V6.8A1.8 1.8 0 0 1 5.8 5h12.4A1.8 1.8 0 0 1 20 6.8v8.4a1.8 1.8 0 0 1-1.8 1.8H8.2L4 20.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function Mascara({ src, className, label }: { src: string; className: string; label?: string }) {
  return (
    <span
      className={"mascara " + className}
      style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

type Variante = "" | "btn-linha" | "btn-claro" | "btn-linha-claro";

/** Botão principal de agendamento: liga ou abre o WhatsApp, conforme o config. */
export function BotaoAgendar({
  variante = "",
  pequeno = false,
  atendimento,
  rotulo,
  className = "",
}: {
  variante?: Variante;
  pequeno?: boolean;
  atendimento?: string;
  rotulo?: string;
  className?: string;
}) {
  const cls = `btn ${variante} ${pequeno ? "btn-sm" : ""} ${className}`;
  if (modoWhatsapp()) {
    const msg = atendimento
      ? `Olá! Vi o site da Dra. Isabella Dias e gostaria de agendar uma avaliação sobre ${atendimento.toLowerCase()}.`
      : CONFIG.mensagemWhatsapp;
    return (
      <a className={cls} href={waHref(msg)} target="_blank" rel="noopener noreferrer">
        <IconeConversa />
        {rotulo ?? "Agendar avaliação"}
        <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
      </a>
    );
  }
  return (
    <a className={cls} href={telHref}>
      <IconeTelefone />
      {rotulo ?? "Ligar para agendar"}
    </a>
  );
}

export function BotaoLigar({ variante = "btn-linha", pequeno = false }: { variante?: Variante; pequeno?: boolean }) {
  return (
    <a className={`btn ${variante} ${pequeno ? "btn-sm" : ""}`} href={telHref}>
      <IconeTelefone />
      Ligar {CONFIG.telefoneExibicao}
    </a>
  );
}

export function BotaoInstagram({ variante = "btn-linha" }: { variante?: Variante }) {
  if (!CONFIG.instagram) return null;
  return (
    <a className={`btn ${variante}`} href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
      Ver no Instagram
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/** Lâmina-índice da seção: sobe 6px e acende ao entrar na viewport. */
export function Indice({ codigo, rotulo }: { codigo: string; rotulo: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [aceso, setAceso] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAceso(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={"indice" + (aceso ? " aceso" : "")}>
      <span className="indice-lamina" aria-hidden="true" />
      <span className="indice-txt">
        <span className="cod" aria-hidden="true">
          {codigo}
        </span>
        <span className="rotulo">{rotulo}</span>
      </span>
    </div>
  );
}

/** Painel de acordeão com altura animada (respeita movimento reduzido). */
export function Painel({ aberto, id, labelledBy, className, children }: { aberto: boolean; id: string; labelledBy: string; className: string; children: ReactNode }) {
  const reduzir = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {aberto && (
        <motion.div
          id={id}
          role="region"
          aria-labelledby={labelledBy}
          className={className}
          initial={reduzir ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={reduzir ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
