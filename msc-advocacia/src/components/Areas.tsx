import { useRef, useState } from "react";
import { AREAS, waLink } from "../config";
import { IconPlus, Reveal, Rich, SectionLabel, useFinePointer } from "./ui";

/**
 * Lista tipográfica de áreas. Inspirada no "Editorial service list" e no
 * "Proximity Accordion" do 21st.dev, reescrita para o projeto:
 * - desktop: ao passar o mouse, a linha ativa abre e as outras esmaecem;
 * - celular e teclado: acordeão (botão com aria-expanded).
 */
export function Areas() {
  const [open, setOpen] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const fine = useFinePointer();
  const timer = useRef<number | undefined>(undefined);

  const hoverTo = (i: number) => {
    if (!fine) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(i), 90);
  };

  return (
    <section id="areas" data-tone="light" tabIndex={-1} aria-labelledby="areas-titulo" className="py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <SectionLabel n="01">Áreas de atuação</SectionLabel>
            <h2 id="areas-titulo" className="h2 mt-8">
              <Rich text="Direito previdenciário, do pedido ao *acompanhamento*." />
            </h2>
          </Reveal>
          <Reveal className="self-end md:col-span-4 md:col-start-9" delay={0.1}>
            <p className="lead">
              Atuação nas esferas administrativa, junto ao INSS, e judicial. Escolha um tema para entender do que se trata e como podemos orientar.
            </p>
          </Reveal>
        </div>

        <ul
          className="mt-16 border-b border-[var(--line)] md:mt-24"
          onPointerEnter={() => fine && setHovering(true)}
          onPointerLeave={() => {
            if (!fine) return;
            window.clearTimeout(timer.current);
            setHovering(false);
            setOpen(null);
          }}
        >
          {AREAS.map((a, i) => {
            const isOpen = open === i;
            const dim = hovering && open !== null && !isOpen;
            return (
              <li
                key={a.id}
                className="border-t border-[var(--line)] transition-opacity duration-500"
                style={{ opacity: dim ? 0.38 : 1 }}
                onPointerEnter={() => hoverTo(i)}
              >
                <h3>
                  <button
                    type="button"
                    id={`area-btn-${a.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`area-${a.id}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-6 text-left md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,17rem)_3rem] md:gap-x-6 md:py-8"
                  >
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h3 text-[clamp(1.45rem,0.95rem+2.2vw,3rem)] transition-transform duration-700 ease-[var(--ease-expo)] md:group-hover:translate-x-2">
                      {a.titulo}
                    </span>
                    <span className="muted hidden text-[0.9375rem] md:block">{a.resumo}</span>
                    <span
                      className={`grid h-10 w-10 place-items-center self-center justify-self-end rounded-full border border-[var(--line-strong)] transition-transform duration-500 ${
                        isOpen ? "rotate-45 bg-[var(--fg)] text-[var(--bg)]" : ""
                      }`}
                      aria-hidden
                    >
                      <IconPlus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`area-${a.id}`}
                  role="region"
                  aria-labelledby={`area-btn-${a.id}`}
                  className="acc"
                  data-open={isOpen}
                  inert={!isOpen}
                >
                  <div>
                    <div className="grid gap-8 pb-10 md:grid-cols-[4rem_1fr_1fr_3rem] md:gap-x-6 md:pb-14">
                      <div className="hidden md:block" />
                      <div>
                        <p className="eyebrow">Do que se trata</p>
                        <p className="mt-3 max-w-[46ch] text-pretty">{a.trata}</p>
                        {a.tags && (
                          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Modalidades">
                            {a.tags.map((t) => (
                              <li key={t} className="rounded-full border border-[var(--line-strong)] px-3 py-1 text-[0.8125rem]">
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div>
                        <p className="eyebrow">Como podemos orientar</p>
                        <p className="mt-3 max-w-[46ch] text-pretty">{a.orienta}</p>
                        <a
                          href={waLink(a.mensagem)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-block py-3 font-medium text-[var(--accent)]"
                        >
                          <span className="link link-static">Conversar sobre {a.titulo.toLowerCase()} pelo WhatsApp</span>
                          <span aria-hidden> →</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
