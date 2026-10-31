import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CONFIG, rotuloAndar, waLink, whatsappDoAndar, type Categoria } from "../config";
import { AreaIcon, WhatsIcon } from "./Icons";
import { Reveal } from "./Reveal";

type Filtro = "todas" | Categoria;

export function Areas() {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const reduce = useReducedMotion();
  const cats = CONFIG.categorias.filter((c) => CONFIG.areas.some((a) => a.categorias.includes(c.id)));
  const lista = useMemo(() => (filtro === "todas" ? CONFIG.areas : CONFIG.areas.filter((a) => a.categorias.includes(filtro))), [filtro]);
  const nomeCat = (id: Categoria) => CONFIG.categorias.find((c) => c.id === id)?.nome ?? "";

  if (CONFIG.areas.length === 0) return null;

  return (
    <section id="areas" aria-labelledby="areas-titulo" className="relative bg-white py-20 sm:py-28">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Áreas de atendimento</p>
          <h2 id="areas-titulo" className="h2 mt-4">
            Encontre a <em className="enfase">área</em> certa.
          </h2>
          <p className="lead mt-5">Filtre por tipo de cuidado e fale com a recepção para agendar. A indicação de cada atendimento depende de avaliação individual.</p>
        </Reveal>

        <div role="group" aria-label="Filtrar áreas por categoria" className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {[{ id: "todas" as Filtro, nome: "Todas" }, ...cats].map((c) => {
            const ativo = filtro === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltro(c.id)}
                className={`min-h-[48px] shrink-0 rounded-xl border px-4 font-display text-[0.92rem] font-semibold transition-colors ${
                  ativo ? "border-night bg-night text-white" : "border-night/12 bg-ice text-graphite hover:border-brand-ink hover:text-brand-ink"
                }`}
              >
                {c.nome}
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {lista.length} {lista.length === 1 ? "área exibida" : "áreas exibidas"}
        </p>

        <motion.ul layout={!reduce} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {lista.map((a) => {
              const andar = rotuloAndar(a.andar);
              return (
                <motion.li
                  key={a.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="group card relative flex flex-col overflow-hidden p-6 transition-shadow duration-300 hover:shadow-lift"
                >
                  <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-[1.4rem] bg-brand-soft transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2" aria-hidden />
                  <span className="pointer-events-none absolute right-[4.6rem] top-4 h-3 w-3 rounded-[4px] bg-brand/40 transition-transform duration-500 group-hover:translate-x-3" aria-hidden />
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-night text-white">
                    <AreaIcon name={a.icone} />
                  </span>
                  <p className="relative mt-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-brand-ink">
                    {a.categorias.map(nomeCat).join(" · ")}
                    {andar ? ` · ${andar}` : ""}
                  </p>
                  <h3 className="relative mt-1.5 font-display text-xl font-semibold leading-snug text-night">{a.nome}</h3>
                  <p className="relative mt-2 flex-1 leading-relaxed text-graphite-soft">{a.descricao}</p>
                  <p className="relative mt-4 text-[0.82rem] text-graphite-soft">A indicação depende de avaliação individual.</p>
                  <a
                    href={waLink(CONFIG.mensagens.area(a.nome), whatsappDoAndar(a.andar))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mt-5 inline-flex min-h-[48px] items-center gap-2 self-start rounded-xl font-display text-[0.94rem] font-semibold text-brand-ink underline-offset-4 hover:underline"
                    aria-label={`Falar no WhatsApp sobre ${a.nome}`}
                  >
                    <WhatsIcon width={18} height={18} /> Falar no WhatsApp
                  </a>
                </motion.li>
              );
            })}
            {(
              <motion.li
                key="ajuda"
                layout={!reduce}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`on-dark relative flex flex-col justify-between overflow-hidden rounded-mod bg-night p-6 text-white ${lista.length % 2 === 0 ? "sm:col-span-2" : ""} ${["lg:col-span-3", "lg:col-span-2", "lg:col-span-1"][lista.length % 3]}`}
              >
                <div className="grid-mod-dark pointer-events-none absolute inset-0" aria-hidden />
                <div className="relative">
                  <p className="eyebrow">Ainda em dúvida?</p>
                  <h3 className="mt-2 font-display text-xl font-semibold leading-snug">Não sabe qual área procurar?</h3>
                  <p className="mt-2 leading-relaxed text-[#C7D6E6]">Conte para a recepção o que você procura e ela orienta sobre o atendimento e o andar.</p>
                </div>
                <a href={waLink(CONFIG.mensagens.geral)} target="_blank" rel="noopener noreferrer" className="btn-light relative mt-6 self-start">
                  <WhatsIcon /> Falar com a recepção
                </a>
              </motion.li>
            )}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
