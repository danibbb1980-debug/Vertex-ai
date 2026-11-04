import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { LOGO } from "../brand/logo-paths";
import type { Atendimento } from "../config";

/* ------------------------------------------------------------------ Logo */
export function Logo({ tom = "claro", className = "" }: { tom?: "claro" | "escuro"; className?: string }) {
  const c =
    tom === "claro"
      ? { texto: "#0F3A40", apoio: "#4E6B66", arco: "#C98A3B" }
      : { texto: "#F4EEE4", apoio: "#B9C8C0", arco: "#E0A458" };
  return (
    <svg
      viewBox={`0 0 ${LOGO.largura} ${LOGO.altura}`}
      className={className}
      role="img"
      aria-label="Clínica Dr. Feliciano, Odontologia"
    >
      <g transform="translate(0 1)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={LOGO.anel} stroke={c.arco} strokeWidth="2.6" />
        <path d={LOGO.f} stroke={c.texto} strokeWidth="3.2" />
      </g>
      <path d={LOGO.nome} fill={c.texto} />
      <path d={LOGO.descritor} fill={c.apoio} />
    </svg>
  );
}

/* ---------------------------------------------------------------- Ícones */
const DENTE =
  "M9 6c2.5-1.6 4.6-1.2 7 0 2.4-1.2 4.5-1.6 7 0 2.6 1.7 2.8 5.3 1.8 8.6-.8 2.6-1.4 4.8-1.8 8.2-.3 2.6-1 4.2-2.3 4.2-1.6 0-1.9-2.4-2.3-5-.3-2-.9-3.5-2.4-3.5s-2.1 1.5-2.4 3.5c-.4 2.6-.7 5-2.3 5-1.3 0-2-1.6-2.3-4.2-.4-3.4-1-5.6-1.8-8.2C6.2 11.3 6.4 7.7 9 6z";

const ICONES: Record<string, ReactNode> = {
  canal: (
    <>
      <path d={DENTE} />
      <path d="M13.6 11v7.5M18.4 11v7.5" className="text-mel" stroke="currentColor" />
    </>
  ),
  ortodontia: (
    <>
      <path d="M4.5 25C7 15.5 11 10.5 16 10.5S25 15.5 27.5 25" />
      <path d="M6.2 19.6h3.2v3.2H6.2zM11 13.4h3.2v3.2H11zM17.8 13.4H21v3.2h-3.2zM22.6 19.6h3.2v3.2h-3.2z" className="text-mel" stroke="currentColor" />
    </>
  ),
  extracao: (
    <>
      <g transform="translate(3 6) scale(.82)">
        <path d={DENTE} />
      </g>
      <path d="M16 1.8v5M13.6 4.2 16 1.8l2.4 2.4" className="text-mel" stroke="currentColor" />
    </>
  ),
  clareamento: (
    <>
      <g transform="translate(0 3) scale(.9)">
        <path d={DENTE} />
      </g>
      <path d="M25.5 3.5 24 5.8M29 8.2l-2.4.8M21.2 2v2.4" className="text-mel" stroke="currentColor" />
    </>
  ),
  implante: (
    <>
      <path d="M9.6 6.4c2.1-1.4 4.2-1 6.4-.2 2.2-.8 4.3-1.2 6.4.2 1.7 1.2 1.7 3.8 1 6H8.6c-.7-2.2-.7-4.8 1-6z" />
      <path d="M12.5 15.5h7l-1.1 12.5h-4.8z" className="text-mel" stroke="currentColor" />
      <path d="M12.7 19h6.6M13 22.4h6M13.3 25.6h5.4" />
    </>
  ),
  cirurgia: (
    <>
      <path d="M4 28l10.2-10.2" />
      <path d="M14.2 17.8c3-5.2 7.2-9.4 13.3-11.6-2.2 6.1-6.4 10.3-11.6 13.3z" className="text-mel" stroke="currentColor" />
    </>
  ),
  protese: (
    <>
      <path d="M4.5 12.5c0-2 1.4-3 3.4-3s3.4 1 3.4 3v6.5c0 1.6-1 2.5-3.4 2.5s-3.4-.9-3.4-2.5zM12.6 12.5c0-2 1.4-3 3.4-3s3.4 1 3.4 3v6.5c0 1.6-1 2.5-3.4 2.5s-3.4-.9-3.4-2.5zM20.7 12.5c0-2 1.4-3 3.4-3s3.4 1 3.4 3v6.5c0 1.6-1 2.5-3.4 2.5s-3.4-.9-3.4-2.5z" />
      <path d="M4 25.5h24" className="text-mel" stroke="currentColor" />
    </>
  ),
  toxina: (
    <>
      <path d="M16 3.5c4.2 5.6 6.6 9.3 6.6 13.2a6.6 6.6 0 0 1-13.2 0c0-3.9 2.4-7.6 6.6-13.2z" />
      <path d="M12.8 17.4a3.3 3.3 0 0 0 3.2 3.2" className="text-mel" stroke="currentColor" />
    </>
  ),
};

export function IconeAtendimento({ tipo, className = "size-9" }: { tipo: Atendimento["icone"]; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONES[tipo]}
    </svg>
  );
}

type NomeIcone =
  | "whatsapp" | "instagram" | "pin" | "relogio" | "calendario" | "seta" | "check" | "cartao"
  | "acessivel" | "menu" | "fechar" | "mais" | "rota" | "conversa" | "lista" | "acompanha" | "externo" | "enviar";

const UI: Record<NomeIcone, ReactNode> = {
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.2-.2z"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r=".6" fill="currentColor" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendario: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  cartao: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 10h19M6 15h4" />
    </>
  ),
  acessivel: (
    <>
      <circle cx="11" cy="4.2" r="1.7" />
      <path d="M11 7.5v6h5.5l2.3 5" />
      <path d="M8 10.6a5.6 5.6 0 1 0 7.3 7.3" />
    </>
  ),
  menu: <path d="M4 8h16M4 16h16" />,
  fechar: <path d="M6 6l12 12M18 6 6 18" />,
  mais: <path d="M12 5v14M5 12h14" />,
  rota: (
    <>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
    </>
  ),
  conversa: <path d="M4.5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h10A2.5 2.5 0 0 1 19.5 7v7a2.5 2.5 0 0 1-2.5 2.5H8.5z" />,
  lista: <path d="M9 7h11M9 12h11M9 17h7M4.5 7h.01M4.5 12h.01M4.5 17h.01" />,
  acompanha: (
    <>
      <path d="M4 12a8 8 0 0 1 14.3-4.9M20 12a8 8 0 0 1-14.3 4.9" />
      <path d="M18.5 3.5v3.8h-3.8M5.5 20.5v-3.8h3.8" />
    </>
  ),
  externo: <path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />,
  enviar: <path d="M4 12 20 4l-4.5 16-3.5-6.5zM12 13.5 20 4" />,
};

export function Icone({ nome, className = "size-5" }: { nome: NomeIcone; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {UI[nome]}
    </svg>
  );
}

/* -------------------------------------------------------------- Revelar */
export function Revelar({
  children,
  atraso = 0,
  className = "",
  como = "div",
}: {
  children: ReactNode;
  atraso?: number;
  className?: string;
  como?: "div" | "li";
}) {
  const Comp = como === "li" ? m.li : m.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------- Título com arco de assinatura
   O arco do símbolo passa por baixo de cada título e se desenha ao entrar na
   tela. Cada seção abre um pouco mais o arco; no CTA final ele fecha o círculo. */
export function TituloSecao({
  rotulo,
  children,
  id,
  tom = "claro",
  indice = 0,
  centro = false,
  apoio,
}: {
  rotulo: string;
  children: ReactNode;
  id: string;
  tom?: "claro" | "escuro";
  indice?: number;
  centro?: boolean;
  apoio?: ReactNode;
}) {
  const reduzir = useReducedMotion();
  const fracao = Math.min(0.42 + indice * 0.07, 0.95);
  return (
    <header className={`relative mb-12 max-w-2xl md:mb-16 ${centro ? "mx-auto text-center" : ""}`}>
      <p className={`rotulo mb-5 ${tom === "claro" ? "text-mel-texto" : "text-mel-claro"}`}>{rotulo}</p>
      <h2
        id={id}
        className={`text-[2.15rem] leading-[1.06] sm:text-5xl lg:text-[3.4rem] [&_em]:text-mel-texto ${
          tom === "escuro" ? "!text-linho [&_em]:!text-mel-claro" : ""
        }`}
      >
        {children}
      </h2>
      <svg
        viewBox="0 0 240 24"
        className={`mt-5 h-5 w-48 overflow-visible sm:w-60 ${centro ? "mx-auto" : ""}`}
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 6Q120 34 236 6" stroke={tom === "claro" ? "#0F3A40" : "#F4EEE4"} strokeOpacity=".12" strokeWidth="1.5" strokeLinecap="round" />
        <m.path
          d="M4 6Q120 34 236 6"
          stroke={tom === "claro" ? "#C98A3B" : "#E0A458"}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reduzir ? fracao : 0 }}
          whileInView={{ pathLength: fracao }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </svg>
      {apoio && <div className={`mt-6 text-lg ${tom === "claro" ? "text-tinta-suave" : "text-petroleo-100"}`}>{apoio}</div>}
    </header>
  );
}
