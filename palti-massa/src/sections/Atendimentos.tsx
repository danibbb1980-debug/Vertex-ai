import { useRef, type PointerEvent, type ReactNode } from "react";
import { CONFIG, waLink } from "../config";
import { IconBalanceArc, IconCheck, IconConversation, IconStrengthArc, IconWhatsApp } from "../components/Icons";
import { Reveal, SectionTitle } from "../components/Reveal";

/** Cartão com luz que segue o ponteiro (adaptado do "Spotlight Card" do 21st.dev): só transform/opacity. */
function SpotCard({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  const glow = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !card.current || !glow.current) return;
    const r = card.current.getBoundingClientRect();
    glow.current.style.transform = `translate3d(${e.clientX - r.left - 200}px, ${e.clientY - r.top - 200}px, 0)`;
  };
  return (
    <div
      ref={card}
      onPointerMove={move}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 sm:p-8 ${
        dark ? "on-dark border-petroleo-700 bg-petroleo-900 text-white shadow-alta" : "border-linha/80 bg-white shadow-suave hover:border-agua-400/70 hover:shadow-alta"
      } ${className}`}
    >
      <div
        ref={glow}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 size-[400px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          dark ? "bg-[radial-gradient(closest-side,rgb(137_190_180/0.22),transparent)]" : "bg-[radial-gradient(closest-side,rgb(137_190_180/0.28),transparent)]"
        }`}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}

const ICONES: Record<string, typeof IconBalanceArc> = { emagrecimento: IconBalanceArc, hipertrofia: IconStrengthArc };

export function Atendimentos() {
  const lista = CONFIG.atendimentos;
  const pc = CONFIG.primeiraConsulta;
  return (
    <section id="atendimentos" aria-labelledby="titulo-atendimentos" className="relative bg-nevoa/70 py-20 sm:py-28">
      <span data-arc="2" data-arc-x="left" className="absolute top-14 block h-px w-px" />
      <div className="container-site relative z-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            id="titulo-atendimentos"
            rotulo="Atendimentos"
            titulo="Dois objetivos, um mesmo cuidado."
            enfase="cuidado"
            intro={<p>Informações gerais para você conhecer cada atendimento. A indicação de qualquer conduta depende de avaliação médica individual.</p>}
          />
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((a, i) => {
            const Icon = ICONES[a.id] ?? IconConversation;
            return (
              <Reveal as="li" key={a.id} delay={i * 0.08}>
                <SpotCard>
                  <Icon width={56} height={56} className="text-agua-600" />
                  <h3 className="mt-5 text-[2rem] font-semibold">{a.titulo}</h3>
                  <p className="font-display text-lg font-medium text-agua-700">{a.subtitulo}</p>
                  <p className="mt-3 text-cinza">{a.resumo}</p>
                  <dl className="mt-6 space-y-4 border-t border-linha pt-5 text-[0.98rem]">
                    <div>
                      <dt className="rotulo !text-[0.74rem]">O que é avaliado</dt>
                      <dd className="mt-1 text-grafite">{a.avaliado}</dd>
                    </div>
                    <div>
                      <dt className="rotulo !text-[0.74rem]">Como é o acompanhamento</dt>
                      <dd className="mt-1 text-grafite">{a.acompanhamento}</dd>
                    </div>
                  </dl>
                  <p className="mt-5 text-sm italic text-cinza">A indicação depende de avaliação médica individual.</p>
                  <div className="mt-auto pt-6">
                    <a
                      href={waLink(CONFIG.mensagens.porAtendimento(a.nomeMensagem))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secundario w-full"
                      aria-label={`Pedir informações sobre ${a.titulo} pelo WhatsApp (abre em nova aba)`}
                    >
                      <IconWhatsApp width={19} height={19} className="text-agua-700" /> Pedir informações
                    </a>
                  </div>
                </SpotCard>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={lista.length * 0.08} className="md:col-span-2 lg:col-span-1">
            <SpotCard dark>
              <IconConversation width={56} height={56} className="text-agua-300" />
              <h3 className="mt-5 text-[2rem] font-semibold text-white">{pc.titulo}</h3>
              <p className="font-display text-lg font-medium text-agua-300">O que esperar</p>
              <p className="mt-3 text-white/80">{pc.texto}</p>
              <ul className="mt-6 space-y-3 border-t border-white/15 pt-5">
                {pc.itens.map((t) => (
                  <li key={t} className="flex gap-3">
                    <IconCheck width={20} height={20} className="mt-0.5 shrink-0 text-agua-300" />
                    <span className="text-white/90">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <a
                  href={waLink(CONFIG.mensagens.porAtendimento(pc.nomeMensagem))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primario w-full"
                  aria-label="Pedir informações sobre a primeira consulta pelo WhatsApp (abre em nova aba)"
                >
                  <IconWhatsApp width={19} height={19} /> Pedir informações
                </a>
              </div>
            </SpotCard>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
