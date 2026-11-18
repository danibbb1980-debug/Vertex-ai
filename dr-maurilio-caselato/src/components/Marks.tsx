import { useEffect, useRef, type ReactNode } from "react";
import { CONFIG, waLink, type Foto } from "../config";

/** Marca de registro de impressão: círculo fino atravessado por cruz fina. */
export function RegMark({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <svg className={`regmark ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 0v24M0 12h24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Marcas de corte nos quatro cantos; desenham-se uma vez ao entrar na viewport. */
export function CropMarks() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className="cropmarks" aria-hidden="true">
      <i className="cm cm-tl" />
      <i className="cm cm-tr" />
      <i className="cm cm-bl" />
      <i className="cm cm-br" />
    </span>
  );
}

/** Logotipo tipográfico provisório. Substituído por CONFIG.logo quando houver. */
export function Logo({ tom = "claro", compacto = false }: { tom?: "claro" | "escuro"; compacto?: boolean }) {
  const arquivo = tom === "escuro" ? CONFIG.logoEscuro || CONFIG.logo : CONFIG.logo;
  if (arquivo) return <img src={arquivo} alt={CONFIG.nome} className="logo-img" />;
  return (
    <span className={`logo logo-${tom} ${compacto ? "logo-compacto" : ""}`}>
      <svg className="logo-simbolo" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <circle cx="20" cy="20" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M20 2v36M2 20h36" stroke="var(--vermelho)" strokeWidth="1.25" />
      </svg>
      <span className="logo-texto">
        <span className="logo-nome">MAURILIO CASELATO</span>
        <span className="logo-sub">
          {CONFIG.profissao.toUpperCase()} · {CONFIG.cro}
        </span>
      </span>
    </span>
  );
}

export function Picture({ foto, sizes, className = "", eager = false }: { foto: Foto; sizes: string; className?: string; eager?: boolean }) {
  const srcset = (ext: string) => foto.larguras.map((w) => `${foto.src}-${w}.${ext} ${w}w`).join(", ");
  const maior = Math.max(...foto.larguras);
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`${foto.src}-${maior}.jpg`}
        srcSet={srcset("jpg")}
        sizes={sizes}
        width={foto.largura}
        height={foto.altura}
        alt={foto.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
      />
    </picture>
  );
}

export function WaButton({
  children = "Agendar avaliação",
  mensagem,
  variante = "primario",
  className = "",
}: {
  children?: ReactNode;
  mensagem?: string;
  variante?: "primario" | "secundario" | "claro";
  className?: string;
}) {
  return (
    <a className={`btn btn-${variante} ${className}`} href={waLink(mensagem)} target="_blank" rel="noopener noreferrer">
      <span className="btn-label">{children}</span>
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}

export function LinkButton({
  href,
  children,
  variante = "secundario",
  externo = false,
}: {
  href: string;
  children: ReactNode;
  variante?: "primario" | "secundario" | "claro";
  externo?: boolean;
}) {
  return (
    <a className={`btn btn-${variante}`} href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span className="btn-label">{children}</span>
      {externo && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
