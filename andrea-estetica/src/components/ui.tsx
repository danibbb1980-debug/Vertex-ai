import { useEffect, useRef, useState, type ReactNode } from "react";
import { CONFIG, waLink } from "../config";

/** Observa a entrada na viewport uma única vez. */
export function useNaTela<T extends Element>(margem = "0px 0px -20% 0px") {
  const ref = useRef<T | null>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setVisto(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { rootMargin: margem },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margem]);
  return [ref, visto] as const;
}

/** Quadro do logo: imagem intacta, cantos retos e filete de 1 px. */
export function Marca({ tamanho = "header", escuro = false }: { tamanho?: "header" | "rodape"; escuro?: boolean }) {
  const px = tamanho === "header" ? 48 : 112;
  const src = tamanho === "header" ? CONFIG.logo.header : CONFIG.logo.rodape;
  return (
    <span className="flex items-center gap-3.5">
      {src && (
        <span
          className={`block shrink-0 border p-[3px] ${escuro ? "border-linho/50" : "border-grafite/40"}`}
          style={{ width: px + 8, height: px + 8 }}
        >
          <img src={src} alt={CONFIG.logo.alt} width={px} height={px} className="block size-full" decoding="async" />
        </span>
      )}
      <span className="flex flex-col leading-none">
        <span className={`titulo ${tamanho === "header" ? "text-[1.7rem]" : "text-[2.4rem]"}`}>{CONFIG.nome}</span>
        <span className={`rotulo mt-1.5 !text-[0.62rem] ${escuro ? "text-nevoa" : "text-cinza"}`}>{CONFIG.descritor}</span>
      </span>
    </span>
  );
}

/** Numeração das seções em formato de hora; acende ao entrar na tela. */
export function Hora({ hora, escuro = false }: { hora: string; escuro?: boolean }) {
  const [ref, visto] = useNaTela<HTMLSpanElement>();
  return (
    <span ref={ref} className="relative inline-flex items-baseline gap-2" aria-hidden="true">
      <span
        className={`titulo text-[2.1rem] tab transition-colors duration-[1200ms] ${
          visto ? (escuro ? "text-ocre-claro" : "text-ocre-escuro") : escuro ? "text-nevoa" : "text-cinza"
        }`}
      >
        {hora}
      </span>
      <span className={`text-xs tab ${escuro ? "text-nevoa" : "text-cinza"}`}>h</span>
    </span>
  );
}

/** Divisor em arco fino que se desenha da esquerda para a direita (só transform). */
export function Arco({ escuro = false, className = "" }: { escuro?: boolean; className?: string }) {
  const [ref, visto] = useNaTela<HTMLDivElement>("0px 0px -10% 0px");
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="block h-10 w-full sm:h-14">
        <path
          d="M0 59 Q600 -40 1200 59"
          fill="none"
          stroke={escuro ? "var(--color-nevoa)" : "var(--color-grafite)"}
          strokeOpacity={escuro ? 0.6 : 0.45}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        className={`absolute inset-0 origin-right transition-transform duration-[1800ms] ease-[var(--ease-lento)] ${
          escuro ? "bg-ardosia" : "bg-linho"
        }`}
        style={{ transform: visto ? "scaleX(0)" : "scaleX(1)" }}
      />
    </div>
  );
}

export function IconeWhats({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20z" strokeLinejoin="round" />
      <path d="M9.2 9.2c.2 2.4 2.9 5.2 5.6 5.6l1-1.2-1.9-1-.8.7c-.9-.4-1.9-1.4-2.3-2.3l.7-.8-1-1.9-1.3.9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BotaoWhats({
  texto,
  mensagem,
  variante = "btn-cheio",
  className = "",
  rotuloAria,
}: {
  texto: ReactNode;
  mensagem?: string;
  variante?: string;
  className?: string;
  rotuloAria?: string;
}) {
  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;
  return (
    <a
      href={waLink(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${variante} ${className}`}
      aria-label={rotuloAria}
    >
      <IconeWhats />
      {texto}
    </a>
  );
}

export function Externo({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
