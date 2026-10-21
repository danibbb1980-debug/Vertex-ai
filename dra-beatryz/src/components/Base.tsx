import type { ReactNode } from "react";
import { cn, externo, linkWhatsapp } from "../lib/utils";
import { Conversa } from "./icons";
import { MaskedTextReveal } from "./ui/MaskedTextReveal";

export function Assinatura({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={cn("font-serif text-[1.3rem] tracking-[-0.01em]", claro ? "text-marfim" : "text-tinta")}>
        Dra. Beatryz <span className="italic">Furlaneto</span>
      </span>
      <span className={cn("mt-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em]", claro ? "text-rosa-100" : "text-rosa-escuro")}>
        Odontopediatria
      </span>
    </span>
  );
}

type BotaoProps = {
  children: ReactNode;
  href: string;
  variante?: "primario" | "secundario" | "claro" | "contorno-claro";
  externoLink?: boolean;
  icone?: boolean;
  className?: string;
};

export function Botao({ children, href, variante = "primario", externoLink, icone, className }: BotaoProps) {
  const estilos = {
    primario:
      "bg-rosa-escuro text-white shadow-[0_14px_30px_-14px_rgba(142,53,87,0.7)] hover:bg-rosa-profundo hover:-translate-y-0.5",
    secundario: "border border-tinta/15 bg-white/60 text-tinta hover:border-rosa-escuro/40 hover:bg-white",
    claro: "bg-marfim text-lilas-profundo hover:bg-white hover:-translate-y-0.5",
    "contorno-claro": "border border-marfim/40 text-marfim hover:bg-marfim/10",
  }[variante];
  return (
    <a
      href={href}
      {...(externoLink ? externo : {})}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.97rem] font-semibold transition-all duration-300 ease-[var(--ease-suave)]",
        estilos,
        className,
      )}
    >
      {icone && <Conversa className="h-[1.15rem] w-[1.15rem]" />}
      {children}
    </a>
  );
}

export function BotaoWhatsapp({
  children = "Agendar avaliação",
  cidade,
  variante,
  className,
}: {
  children?: ReactNode;
  cidade?: string;
  variante?: BotaoProps["variante"];
  className?: string;
}) {
  return (
    <Botao href={linkWhatsapp(cidade)} externoLink icone variante={variante} className={className}>
      {children}
    </Botao>
  );
}

export function Eyebrow({ children, claro }: { children: ReactNode; claro?: boolean }) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em]",
        claro ? "text-rosa-100" : "text-rosa-escuro",
      )}
    >
      <span aria-hidden className={cn("h-px w-8", claro ? "bg-rosa-100/60" : "bg-rosa-escuro/40")} />
      {children}
    </p>
  );
}

/** Título de seção com revelação por linha ao rolar. Use <em> para a palavra manuscrita. */
export function TituloSecao({
  eyebrow,
  children,
  className,
  centro,
}: {
  eyebrow: string;
  children: ReactNode;
  className?: string;
  centro?: boolean;
}) {
  return (
    <div className={cn(centro && "text-center [&_p]:justify-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <MaskedTextReveal
        as="h2"
        className={cn("text-[2.1rem] leading-[1.08] text-tinta md:text-5xl", centro && "mx-auto")}
      >
        {children}
      </MaskedTextReveal>
    </div>
  );
}
