import { useRef, type ReactNode } from "react";
import { CONFIG, whatsappLink, type Fase } from "../config";
import { Onda } from "../components/Decor";
import { IconWhatsApp } from "../components/Icons";
import { CabecalhoSecao, Confirmar } from "../components/ui";

/* Ilustrações originais de traço simples, uma por fase. */
const traco = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const IlustraBebe = () => (
  <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden focusable={false}>
    <circle cx="40" cy="40" r="36" fill="var(--color-butter-50)" />
    <path {...traco} d="M50 22a17 17 0 1 0 9 26 14 14 0 0 1-9-26Z" className="text-ink" />
    <path d="M23 24c.3 2 1.3 3 4.2 4.2-2.9 1.2-3.9 2.2-4.2 4.2-.3-2-1.3-3-4.2-4.2 2.9-1.2 3.9-2.2 4.2-4.2Z" fill="var(--color-coral)" />
    <path {...traco} d="M18 56c3-3 7-3 10 0s7 3 10 0" className="text-sage-500" />
  </svg>
);
const IlustraCrianca = () => (
  <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden focusable={false}>
    <circle cx="40" cy="40" r="36" fill="var(--color-sage-50)" />
    <path {...traco} d="m24 58 26-26" className="text-ink" />
    <rect x="45" y="18" width="16" height="9" rx="3" transform="rotate(45 53 22.5)" {...traco} className="text-ink" />
    <path {...traco} d="M50 25v-3M54 29h3M52.5 27l2-2" className="text-sage-deep" />
    <path d="M24 22c.3 2.2 1.4 3.3 4.6 4.6-3.2 1.3-4.3 2.4-4.6 4.6-.3-2.2-1.4-3.3-4.6-4.6 3.2-1.3 4.3-2.4 4.6-4.6Z" fill="var(--color-butter)" />
  </svg>
);
const IlustraAdolescente = () => (
  <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden focusable={false}>
    <circle cx="40" cy="40" r="36" fill="var(--color-peach-50)" />
    <path {...traco} d="M17 40 62 22l-9 38-11-12-25-8Z" className="text-ink" />
    <path {...traco} d="m42 48 20-26" className="text-ink" />
    <path {...traco} strokeDasharray="1 5" d="M14 52c6 6 13 8 22 6" className="text-coral" />
  </svg>
);
const IlustraMaxilares = () => (
  <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden focusable={false}>
    <circle cx="40" cy="40" r="36" fill="var(--color-sage-50)" />
    <path {...traco} d="M20 34c4 16 36 16 40 0" className="text-ink" />
    <path {...traco} d="M26 30c3 10 25 10 28 0" className="text-sage-500" />
    <path {...traco} d="M40 58V48" className="text-coral" />
    <path {...traco} d="m36 52 4-4 4 4" className="text-coral" />
  </svg>
);

type Cartao = { fase: Fase; titulo: string; idade: string; texto: string; Ilustra: () => ReactNode; nota?: boolean };

const CARTOES: Cartao[] = [
  {
    fase: "bebe",
    titulo: "Bebês",
    idade: "Primeiros cuidados",
    texto:
      "A boca do bebê, a chegada dos primeiros dentes e os hábitos do dia a dia. Um bom momento para os pais tirarem dúvidas desde cedo.",
    Ilustra: IlustraBebe,
  },
  {
    fase: "crianca",
    titulo: "Crianças",
    idade: "Infância",
    texto:
      "Acompanhamento da saúde bucal na infância, com orientações sobre higiene, alimentação e rotina, em uma linguagem que a criança entende.",
    Ilustra: IlustraCrianca,
  },
  {
    fase: "adolescente",
    titulo: "Adolescentes",
    idade: "Mais autonomia",
    texto:
      "Uma fase de mais independência. A conversa acontece direto com o adolescente, sem deixar os pais de fora das orientações.",
    Ilustra: IlustraAdolescente,
  },
  {
    fase: "maxilares",
    titulo: "Desenvolvimento dos maxilares",
    idade: "Informação educativa",
    texto:
      "A ortopedia funcional dos maxilares é uma área da odontologia que observa o crescimento dos ossos da face e a relação entre as arcadas. Se esse acompanhamento é indicado, e de que forma, é algo que só a avaliação define.",
    Ilustra: IlustraMaxilares,
    nota: true,
  },
];

function CartaoFase({ c, i }: { c: Cartao; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // brilho suave que segue o cursor (adaptado do padrão "spotlight card")
  function mover(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
  return (
    <li className="reveal flex min-w-0" style={{ ["--d" as string]: `${(i % 2) * 120}ms` }}>
    <div
      ref={ref}
      onPointerMove={mover}
      className="group card relative flex w-full min-w-0 flex-col overflow-hidden p-7 transition-[translate,box-shadow,border-color] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-sage hover:shadow-[0_26px_50px_-34px_rgba(29,42,71,0.55)] md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--color-sage-100) 70%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[0.74rem] font-extrabold tracking-[0.16em] text-sage-deep uppercase">{c.idade}</p>
          <h3 className="mt-2 text-[1.6rem] leading-[1.1] font-normal hyphens-auto md:text-[2rem]">
            {c.titulo}
            {c.nota ? <Confirmar texto="confirmar se é oferecido" /> : null}
          </h3>
        </div>
        <div className="h-14 w-14 shrink-0 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:rotate-[-6deg] md:h-20 md:w-20">
          <c.Ilustra />
        </div>
      </div>
      <p className="relative mt-4 text-body">{c.texto}</p>
      <p className="relative mt-4 text-[0.92rem] font-semibold text-muted italic">Depende de avaliação individual.</p>
      <div className="relative mt-auto pt-6">
        <a
          href={whatsappLink(c.fase)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full font-extrabold text-ink"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage-deep text-white transition-transform duration-300 group-hover:scale-105">
            <IconWhatsApp size={18} />
          </span>
          <span className="link-underline">Conversar sobre esta fase</span>
          <span className="sr-only"> ({c.titulo}, abre o WhatsApp em nova aba)</span>
        </a>
      </div>
    </div>
    </li>
  );
}

export function Atendimento() {
  const cartoes = CARTOES.filter((c) => c.fase !== "maxilares" || CONFIG.mostrarCartaoMaxilares);
  return (
    <section id="atendimento" aria-labelledby="titulo-atendimento" className="relative">
      <Onda cor="var(--color-cream-2)" />
      <div className="bg-cream-2 pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="container-site">
          <CabecalhoSecao
            id="titulo-atendimento"
            eyebrow="Atendimento"
            titulo="Um cuidado para cada *fase*."
            texto={<p>Cada idade traz dúvidas diferentes. A avaliação individual define as orientações para o seu filho.</p>}
          />
          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {cartoes.map((c, i) => (
              <CartaoFase key={c.fase} c={c} i={i} />
            ))}
          </ul>
        </div>
      </div>
      <Onda cor="var(--color-cream-2)" flip />
    </section>
  );
}
