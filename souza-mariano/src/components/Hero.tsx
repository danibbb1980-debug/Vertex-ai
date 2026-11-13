import { motion, useReducedMotion } from "motion/react";
import { CONFIG } from "../config";
import { Monograma } from "./Monograma";
import { Botao, Container, Rotulo, Seta, contatoPrincipal } from "./ui";

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Revelação de texto por linha com corte vertical (adaptado do "Vertical Cut Reveal" do 21st.dev).
 * Feita em CSS para rodar já no HTML pré-renderizado, antes do JavaScript.
 */
function Linha({ children, atraso }: { children: React.ReactNode; atraso: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="revela block" style={{ animationDelay: `${atraso}s` }}>
        {children}
      </span>
    </span>
  );
}

/** Momento de assinatura: dois fios (um por advogada) se desenham, se cruzam no encontro do S com o M e seguem separados. */
function Entrelacado() {
  const reduz = useReducedMotion();
  const fio = (atraso: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: reduz ? { duration: 0 } : { duration: 2.6, delay: atraso, ease: EASE },
  });
  return (
    <div className="relative mx-auto aspect-[360/520] w-full max-w-[22rem] lg:max-w-none">
      <svg viewBox="0 0 360 520" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" fill="none">
        {/* fio vinho */}
        <motion.path
          d="M18 0 C 30 120, 120 150, 150 238 C 176 316, 214 380, 262 430 C 290 460, 300 490, 300 520"
          stroke="#5B1E34"
          strokeWidth="1.2"
          {...fio(0.1)}
        />
        {/* fio bronze */}
        <motion.path
          d="M352 40 C 320 150, 190 170, 150 238 C 118 296, 214 400, 300 436 C 330 452, 332 490, 332 520"
          stroke="#A9855A"
          strokeWidth="1.2"
          {...fio(0.35)}
        />
      </svg>
      <div className="absolute left-1/2 top-[44%] w-[62%] -translate-x-1/2 -translate-y-1/2">
        <Monograma cor="#5B1E34" fundo="#F5F0E7" animado className="h-auto w-full" />
      </div>
      {/* pontos de saída dos fios, lidos pelo componente Fios */}
      <span data-fio-inicio="a" className="absolute bottom-0" style={{ left: `${(300 / 360) * 100}%` }} />
      <span data-fio-inicio="b" className="absolute bottom-0" style={{ left: `${(332 / 360) * 100}%` }} />
    </div>
  );
}

export function Hero() {
  const c = contatoPrincipal();
  return (
    <section id="inicio" className="relative pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40" aria-labelledby="titulo-hero">
      <Container className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pb-10">
          <Rotulo>Advocacia · {CONFIG.cidade} - {CONFIG.uf}</Rotulo>
          <h1
            id="titulo-hero"
            className="mt-6 font-serif text-[2.6rem] font-normal leading-[1.02] tracking-[-0.02em] text-grafite [font-variation-settings:'opsz'_72] sm:text-6xl lg:text-[4.6rem]"
          >
            <Linha atraso={0.1}>Atuação consultiva</Linha>
            <Linha atraso={0.22}>e contenciosa,</Linha>
            <Linha atraso={0.34}>
              com <em className="font-serif italic text-vinho">clareza</em>.
            </Linha>
          </h1>
          <p className="mt-7 max-w-[32rem] text-[1.075rem] leading-relaxed text-grafite-suave">
            Atendimento direto pelas advogadas, com análise técnica e comunicação clara em cada demanda.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Botao href={c.href} externo={c.externo}>
              <c.Icone />
              {c.rotulo}
            </Botao>
            <Botao href="#areas" variante="secundario">
              Conhecer as áreas de atuação
              <Seta />
            </Botao>
          </div>
          <div className="mt-12 flex items-center gap-4 border-t border-grafite/15 pt-5">
            <Monograma cor="#7A5A30" className="h-9 w-auto" />
            <p className="font-serif text-[0.95rem] leading-snug text-grafite-suave">
              {CONFIG.nomeCurto}
              <br />
              <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em]">Advogados Associados</span>
            </p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <Entrelacado />
        </div>
      </Container>
    </section>
  );
}
