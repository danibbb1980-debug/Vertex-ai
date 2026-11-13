import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { CONFIG, temWhatsapp } from "../config";
import { Monograma } from "./Monograma";
import { Botao, BotaoLigar, BotoesContato, Container, IconeTelefone, Rotulo, Seta, contatoPrincipal } from "./ui";

/** "inert" fora da tabulação quando fechado (React 18 não tipa o atributo). */
const inerte = (on: boolean) => (on ? ({ inert: "" } as Record<string, string>) : {});

const num = (i: number) => String(i + 1).padStart(2, "0");

/* ---------------------------------------------------------------- Faixa */
export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-bronze/40 bg-osso-2 px-4 py-1.5 text-center font-sans text-[0.75rem] leading-tight text-grafite">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

/* ---------------------------------------------------------------- Header */
const LINKS = [
  { href: "#escritorio", label: "O escritório", secao: "escritorio" },
  { href: "#areas", label: "Áreas de atuação", secao: "areas" },
  { href: "#como-funciona", label: "Como funciona", secao: "comoFunciona" },
  { href: "#duvidas", label: "Dúvidas", secao: "duvidas" },
  { href: "#contato", label: "Contato", secao: "contato" },
] as const;

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const menuId = useId();
  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  const links = LINKS.filter((l) => CONFIG.secoes[l.secao]);
  const agendarHref = temWhatsapp() && CONFIG.secoes.agendar ? "#agendar" : CONFIG.telefoneHref;
  const topo = CONFIG.rascunho ? "top-[29px]" : "top-0";

  return (
    <header
      className={`fixed inset-x-0 ${topo} z-40 transition-[background-color,border-color] duration-500 ${
        solido || aberto ? "border-b border-grafite/10 bg-osso/95 backdrop-blur-[2px]" : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-[4.25rem] items-center justify-between gap-6">
        <a href="#inicio" className="flex items-center gap-3">
          {CONFIG.logo ? (
            <img src={CONFIG.logo} alt="" className="h-10 w-auto" />
          ) : (
            <Monograma cor="#5B1E34" fundo="#F5F0E7" className="h-10 w-auto" />
          )}
          <span className="font-serif text-[1.15rem] leading-none tracking-[-0.01em] text-grafite">
            Souza <span className="italic text-vinho">&amp;</span> Mariano
            <span className="mt-1 block font-sans text-[0.6rem] uppercase tracking-[0.24em] text-grafite-suave">Advogados Associados</span>
          </span>
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-fio font-sans text-[0.9rem] text-grafite hover:text-vinho">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Botao href={agendarHref} className="hidden !min-h-11 !px-5 !py-2 sm:inline-flex">
            Agendar atendimento
          </Botao>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center text-grafite lg:hidden"
            aria-expanded={aberto}
            aria-controls={menuId}
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${aberto ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${aberto ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </Container>
      <nav id={menuId} aria-label="Menu" hidden={!aberto} className="border-t border-grafite/10 bg-osso lg:hidden">
        <Container className="py-4">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-grafite/10 last:border-0">
                <a href={l.href} onClick={() => setAberto(false)} className="flex min-h-12 items-baseline gap-4 py-3 font-serif text-xl text-grafite">
                  <span className="num font-sans text-xs text-bronze-texto">{num(i)}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Botao href={agendarHref} className="mt-4 w-full">
            Agendar atendimento
          </Botao>
        </Container>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------- O escritório */
export function Escritorio() {
  if (!CONFIG.secoes.escritorio) return null;
  return (
    <section id="escritorio" data-fio-cruza className="scroll-mt-28 border-t border-grafite/10 py-20 lg:py-32" aria-labelledby="t-escritorio">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Rotulo>01 · O escritório</Rotulo>
            <h2 id="t-escritorio" className="titulo-secao mt-5">
              Uma sociedade, <em>duas</em> advogadas.
            </h2>
          </div>
          <div className="lg:col-span-8 lg:pt-10">
            <p className="max-w-[40rem] font-serif text-[1.45rem] leading-[1.35] text-grafite [font-variation-settings:'opsz'_36] sm:text-[1.7rem]">
              O {CONFIG.nomeCurto} é um escritório de advocacia em {CONFIG.cidade}, com atuação consultiva e contenciosa. O atendimento é feito
              diretamente pelas advogadas, do primeiro contato ao acompanhamento.
            </p>
          </div>
        </div>

        {CONFIG.formaDeTrabalhar.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <Rotulo className="lg:ml-[33.4%]">Forma de trabalhar</Rotulo>
            <dl className="mt-6 grid border-t border-grafite/15 sm:grid-cols-2 lg:ml-[33.4%]">
              {CONFIG.formaDeTrabalhar.map((f, i) => (
                <div
                  key={f.titulo}
                  className={`border-b border-grafite/15 py-6 sm:py-8 ${i % 2 === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8"}`}
                >
                  <dt className="flex items-baseline gap-3 font-serif text-[1.3rem] text-grafite">
                    <span className="num font-sans text-xs text-bronze-texto">{num(i)}</span>
                    {f.titulo}
                  </dt>
                  <dd className="mt-2 pl-8 text-[0.98rem] leading-relaxed text-grafite-suave">{f.texto}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- As advogadas */
function Cruzamento() {
  return (
    <svg viewBox="0 0 24 200" className="absolute inset-0 h-full w-6" preserveAspectRatio="none" aria-hidden="true" fill="none">
      <path d="M4 0 C4 60 20 80 12 100 C4 120 20 140 20 200" stroke="#5B1E34" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M20 0 C20 60 4 80 12 100 C20 120 4 140 4 200" stroke="#A9855A" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Advogadas() {
  const lista = CONFIG.advogadas.filter((a) => a.nome && a.oab);
  if (!CONFIG.secoes.advogadas || lista.length === 0) return null;
  return (
    <section id="advogadas" data-fio-cruza className="scroll-mt-28 bg-osso-2 py-20 lg:py-28" aria-labelledby="t-advogadas">
      <Container>
        <Rotulo>02 · As advogadas</Rotulo>
        <h2 id="t-advogadas" className="sr-only">
          As advogadas
        </h2>
        <div className="mt-10 grid items-stretch gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-10">
          {lista.map((a, i) => (
            <div key={a.nome} className={`contents`}>
              {i === 1 && (
                <div className="relative hidden w-6 self-stretch md:block">
                  <Cruzamento />
                </div>
              )}
              <article className={`${i === 1 ? "border-t border-grafite/15 pt-10 md:border-0 md:pt-0" : ""}`}>
                {a.foto && <img src={a.foto} alt={a.nome} loading="lazy" className="mb-6 aspect-[4/5] w-full max-w-xs object-cover" />}
                <h3 className="font-serif text-[2rem] leading-[1.08] tracking-[-0.015em] text-grafite [font-variation-settings:'opsz'_60] sm:text-[2.6rem]">
                  {a.nome.replace(/^Dra\.\s*/, "")}
                </h3>
                <p className="mt-4 flex items-center gap-3 font-sans text-[0.95rem] text-grafite-suave">
                  <span className="h-px w-8 bg-bronze" aria-hidden="true" />
                  <span>Advogada</span>
                  <span aria-hidden="true">·</span>
                  <span className="num text-vinho">{a.oab.replace("OAB/MG", "OAB/MG nº")}</span>
                </p>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Áreas (índice editorial) */
export function Areas() {
  const familias = CONFIG.familias.filter((f) => f.areas.length > 0);
  const [aberta, setAberta] = useState(0);
  const id = useId();
  const reduz = useReducedMotion();
  if (!CONFIG.secoes.areas || familias.length === 0) return null;
  const total = familias.reduce((s, f) => s + f.areas.length, 0);
  const c = contatoPrincipal();

  return (
    <section id="areas" data-fio-cruza className="scroll-mt-28 py-20 lg:py-32" aria-labelledby="t-areas">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <Rotulo>03 · Áreas de atuação</Rotulo>
            <h2 id="t-areas" className="titulo-secao mt-5">
              {total} áreas, em <em>cinco</em> frentes.
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-grafite-suave">
              Atuação consultiva e contenciosa organizada por famílias. Cada caso depende de análise individual.
            </p>
            <div className="mt-8 hidden lg:block">
              <BotoesContato />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="border-t border-grafite/20">
            {familias.map((f, i) => {
              const open = aberta === i;
              return (
                <li key={f.id} className="border-b border-grafite/20">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-b-${i}`}
                      aria-expanded={open}
                      aria-controls={`${id}-p-${i}`}
                      onClick={() => setAberta(open ? -1 : i)}
                      className="group grid w-full grid-cols-[2.75rem_1fr_auto] items-baseline gap-x-3 py-6 text-left sm:grid-cols-[4.5rem_1fr_auto] sm:py-8"
                    >
                      <span className="num font-serif text-[1.6rem] leading-none text-bronze-texto [font-variation-settings:'opsz'_72] sm:text-[2.4rem]">
                        {num(i)}
                      </span>
                      <span>
                        <span
                          className={`block font-serif text-[1.45rem] leading-[1.15] tracking-[-0.01em] transition-[color,transform] duration-300 sm:text-[2rem] ${
                            open ? "translate-x-1 text-vinho" : "text-grafite group-hover:translate-x-1"
                          }`}
                        >
                          {f.nome}
                        </span>
                        <span className="mt-1.5 block font-sans text-[0.9rem] text-grafite-suave">{f.resumo}</span>
                      </span>
                      <span className="flex items-center gap-3 self-center">
                        <span className="num hidden font-sans text-xs uppercase tracking-[0.18em] text-grafite-suave sm:inline">
                          {f.areas.length} {f.areas.length === 1 ? "área" : "áreas"}
                        </span>
                        <span aria-hidden="true" className="relative block h-4 w-4">
                          <span className="absolute left-0 top-1/2 h-px w-4 bg-vinho" />
                          <span className={`absolute left-1/2 top-0 h-4 w-px bg-vinho transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
                        </span>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${id}-p-${i}`}
                    role="region"
                    aria-labelledby={`${id}-b-${i}`}
                    className={`grid ${reduz ? "" : "transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.65,0,.35,1)]"} ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden" {...inerte(!open)}>
                      <ul className="pb-8 pl-[3.5rem] sm:pl-[5.25rem]">
                        {f.areas.map((a) => (
                          <li key={a.nome} className="border-t border-dashed border-grafite/15 py-4 first:border-t-0 first:pt-0 sm:grid sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
                            <p className="font-serif text-[1.12rem] text-grafite">{a.nome}</p>
                            <p className="mt-1 text-[0.95rem] leading-relaxed text-grafite-suave sm:mt-0">{a.descricao}</p>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-8 pl-[3.5rem] sm:pl-[5.25rem]">
                        <a href={c.href} {...(c.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="link-fio inline-flex min-h-12 items-center gap-2 font-sans text-[0.95rem] font-medium text-vinho">
                          <c.Icone />
                          {temWhatsapp() ? "Agendar pelo WhatsApp" : `Ligar: ${CONFIG.telefone}`}
                        </a>
                        <span className="text-[0.85rem] text-grafite-suave">Cada caso depende de análise individual.</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 lg:hidden">
            <BotoesContato />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Valores */
export function Valores() {
  if (!CONFIG.secoes.valores || CONFIG.valores.length === 0) return null;
  return (
    <section id="valores" data-fio-cruza className="border-y border-grafite/10 bg-osso-2 py-16 lg:py-24" aria-labelledby="t-valores">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Rotulo>04 · Valores</Rotulo>
            <h2 id="t-valores" className="sr-only">
              Valores
            </h2>
          </div>
          <ul className="font-serif text-[1.65rem] leading-[1.35] tracking-[-0.01em] text-grafite [font-variation-settings:'opsz'_60] sm:text-[2.2rem] lg:col-span-9 lg:text-[2.55rem]">
            {CONFIG.valores.map((v, i) => (
              <li key={v} className="inline">
                <span className={i % 2 === 1 ? "italic text-vinho" : ""}>{v.split(" ").slice(0, -1).join(" ")} </span>
                <span className="whitespace-nowrap">
                <span className={i % 2 === 1 ? "italic text-vinho" : ""}>{v.split(" ").slice(-1)[0]}</span>
                {i < CONFIG.valores.length - 1 && (
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="mx-3 inline-block h-[0.42em] w-[0.42em] -translate-y-[0.12em] align-middle" fill="none">
                    <path d="M2 2 L18 18" stroke="#5B1E34" strokeWidth="1.4" />
                    <path d="M18 2 L2 18" stroke="#A9855A" strokeWidth="1.4" />
                  </svg>
                )}
                </span>{" "}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Como funciona */
export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduz = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const escala = useTransform(scrollYProgress, [0, 1], [0, 1]);
  if (!CONFIG.secoes.comoFunciona || CONFIG.etapas.length === 0) return null;
  return (
    <section id="como-funciona" data-fio-cruza className="scroll-mt-28 py-20 lg:py-32" aria-labelledby="t-como">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <Rotulo>05 · Como funciona</Rotulo>
            <h2 id="t-como" className="titulo-secao mt-5">
              Do primeiro contato ao <em>acompanhamento</em>.
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-grafite-suave">
              Quatro etapas, sempre com explicação clara do que está acontecendo. O tempo de cada uma varia conforme o caso.
            </p>
          </div>
        </div>
        <ol ref={ref} className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-grafite/15 sm:left-[1.9rem]" />
          <motion.span
            aria-hidden="true"
            style={reduz ? undefined : { scaleY: escala }}
            className="absolute bottom-0 left-[1.15rem] top-0 w-px origin-top bg-vinho sm:left-[1.9rem]"
          />
          {CONFIG.etapas.map((e, i) => (
            <li key={e.titulo} className="relative grid grid-cols-[2.3rem_1fr] gap-5 pb-14 last:pb-0 sm:grid-cols-[3.8rem_1fr] sm:gap-8">
              <span className="num relative z-10 bg-osso py-1 text-center font-serif text-[1.9rem] leading-none text-bronze-texto [font-variation-settings:'opsz'_72] sm:text-[3.4rem]">
                {num(i)}
              </span>
              <div className="pt-1 sm:pt-3">
                <h3 className="font-serif text-[1.45rem] leading-tight text-grafite sm:text-[1.75rem]">{e.titulo}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-grafite-suave">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Dúvidas */
export function Duvidas() {
  const [aberta, setAberta] = useState(-1);
  const id = useId();
  if (!CONFIG.secoes.duvidas || CONFIG.faq.length === 0) return null;
  return (
    <section id="duvidas" data-fio-cruza className="scroll-mt-28 border-t border-grafite/10 py-20 lg:py-32" aria-labelledby="t-duvidas">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Rotulo>06 · Dúvidas frequentes</Rotulo>
          <h2 id="t-duvidas" className="titulo-secao mt-5">
            Perguntas <em>comuns</em>.
          </h2>
          <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-grafite-suave">
            Respostas gerais e informativas. Cada situação é analisada individualmente no atendimento.
          </p>
        </div>
        <div className="lg:col-span-8">
          {CONFIG.faq.map((q, i) => {
            const open = aberta === i;
            return (
              <div key={q.p} className="border-b border-grafite/15 first:border-t">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q-${i}`}
                    aria-expanded={open}
                    aria-controls={`${id}-r-${i}`}
                    onClick={() => setAberta(open ? -1 : i)}
                    className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left font-serif text-[1.2rem] leading-snug text-grafite hover:text-vinho sm:text-[1.35rem]"
                  >
                    {q.p}
                    <span aria-hidden="true" className={`shrink-0 text-vinho transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
                      <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.2">
                        <path d="M8 1v14M1 8h14" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-r-${i}`}
                  role="region"
                  aria-labelledby={`${id}-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" {...inerte(!open)}>
                    <p className="max-w-2xl pb-6 leading-relaxed text-grafite-suave">{q.r}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Contato */
function Mapa() {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative aspect-[4/3] w-full bg-osso-3 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      {visivel && (
        <iframe
          title={`Mapa: ${CONFIG.endereco.rua}, ${CONFIG.endereco.cidade} - ${CONFIG.endereco.uf}`}
          src={CONFIG.mapaEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.6] sepia-[0.15]"
        />
      )}
    </div>
  );
}

export function Contato() {
  if (!CONFIG.secoes.contato) return null;
  const e = CONFIG.endereco;
  const hoje = new Date().getDay();
  return (
    <section id="contato" data-fio-cruza className="scroll-mt-28 bg-osso-2 py-20 lg:py-28" aria-labelledby="t-contato">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Rotulo>07 · Localização e contato</Rotulo>
          <h2 id="t-contato" className="titulo-secao mt-5">
            Venha nos <em>visitar</em>.
          </h2>
          <address className="mt-8 not-italic">
            <p className="font-serif text-[1.35rem] leading-snug text-grafite">
              {e.rua}, {e.complemento}
              <br />
              {e.bairro}, {e.cidade} - {e.uf}
            </p>
            <p className="num mt-1 text-grafite-suave">CEP {e.cep}</p>
            <p className="mt-5">
              <a href={CONFIG.telefoneHref} className="link-fio num inline-flex min-h-12 items-center gap-2 font-serif text-[1.35rem] text-vinho">
                <IconeTelefone className="h-5 w-5" />
                {CONFIG.telefone}
              </a>
            </p>
            {CONFIG.email && (
              <p>
                <a href={`mailto:${CONFIG.email}`} className="link-fio text-vinho">
                  {CONFIG.email}
                </a>
              </p>
            )}
            {CONFIG.instagram && (
              <p className="mt-2">
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="link-fio text-vinho">
                  Instagram
                </a>
              </p>
            )}
          </address>

          <div className="mt-10">
            <h3 className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.22em] text-bronze-texto">Horários</h3>
            <table className="mt-4 w-full max-w-md text-[0.98rem]">
              <caption className="sr-only">Horários de atendimento</caption>
              <tbody>
                {CONFIG.horarios.map((h) => (
                  <tr key={h.dia} className={`border-b border-grafite/10 ${h.dia === hoje ? "text-vinho" : "text-grafite"}`}>
                    <th scope="row" className="py-2.5 text-left font-normal">
                      {h.nome}
                      {h.dia === hoje && <span className="ml-2 text-xs uppercase tracking-[0.15em]">hoje</span>}
                    </th>
                    <td className="num py-2.5 text-right">{h.abre && h.fecha ? `${h.abre.replace(":", "h")} às ${h.fecha.replace(":", "h")}` : "Fechado"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[0.88rem] text-grafite-suave">{CONFIG.avisoHorarios}</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Botao href={CONFIG.rotaUrl} externo>
              Como chegar
              <Seta />
            </Botao>
            <BotaoLigar variante="secundario" rotulo="Ligar" />
            {temWhatsapp() && (
              <Botao href={contatoPrincipal().href} externo variante="secundario">
                WhatsApp
              </Botao>
            )}
          </div>
        </div>
        <div className="lg:col-span-6">
          <Mapa />
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- CTA final */
export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null;
  const c = contatoPrincipal();
  return (
    <section data-fio-escuro data-fio-cruza className="relative overflow-hidden bg-vinho-escuro py-20 text-osso lg:py-28" aria-labelledby="t-cta">
      <svg viewBox="0 0 600 400" className="pointer-events-none absolute -left-20 bottom-0 h-[120%] w-auto opacity-60 lg:hidden" aria-hidden="true" fill="none">
        <path d="M0 40 C 200 60, 260 360, 600 380" stroke="#D2B48A" strokeWidth="1" />
        <path d="M0 380 C 220 360, 300 60, 600 60" stroke="#A9855A" strokeWidth="1" />
      </svg>
      <Container className="relative grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Rotulo claro>{CONFIG.nome}</Rotulo>
          <h2 id="t-cta" className="mt-5 font-serif text-[2.4rem] leading-[1.04] tracking-[-0.02em] [font-variation-settings:'opsz'_72] sm:text-[3.4rem] lg:text-[4rem]">
            O primeiro passo é uma <em className="italic text-bronze-claro">conversa</em>.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-osso/80">
            {temWhatsapp() ? "Agende pelo WhatsApp ou ligue" : "Ligue para agendar"}: de segunda a quinta, das 09h00 às 18h00, e na sexta, até as 16h00.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <span className="relative inline-flex">
            <span data-fio-fim className="absolute left-1/2 top-0" />
            <Botao href={c.href} externo={c.externo} variante="claro">
              <c.Icone />
              {c.rotulo}
            </Botao>
          </span>
          {temWhatsapp() && <BotaoLigar variante="contorno-claro" rotulo="Ligar" />}
          {temWhatsapp() && CONFIG.secoes.agendar && (
            <Botao href="#agendar" variante="contorno-claro">
              Solicitar agendamento
            </Botao>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- Rodapé */
export function Rodape() {
  const e = CONFIG.endereco;
  return (
    <footer className="bg-grafite pb-28 pt-16 text-osso/80 lg:pb-12">
      <Container>
        <div className="grid gap-10 border-b border-osso/15 pb-10 md:grid-cols-12">
          <div className="flex items-start gap-4 md:col-span-5">
            <Monograma cor="#D2B48A" fundo="#24201E" className="h-16 w-auto shrink-0" />
            <div>
              <p className="font-serif text-xl text-osso">{CONFIG.nomeCurto}</p>
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.24em]">Advogados Associados</p>
              <ul className="mt-5 space-y-1 text-[0.92rem]">
                {CONFIG.advogadas.map((a) => (
                  <li key={a.nome}>
                    {a.nome} <span className="num text-bronze-claro">· {a.oab}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-[0.92rem] leading-relaxed md:col-span-4">
            <p>
              {e.rua}, {e.complemento}
              <br />
              {e.bairro}, {e.cidade} - {e.uf} · CEP {e.cep}
            </p>
            <p className="mt-3">
              <a href={CONFIG.telefoneHref} className="link-fio num inline-flex min-h-12 items-center text-osso">
                {CONFIG.telefone}
              </a>
            </p>
          </div>
          <nav aria-label="Rodapé" className="text-[0.92rem] md:col-span-3">
            <ul className="space-y-1">
              {LINKS.filter((l) => CONFIG.secoes[l.secao]).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-fio inline-flex min-h-10 items-center">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/privacidade.html" className="link-fio inline-flex min-h-10 items-center">
                  Privacidade
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 max-w-3xl text-[0.8rem] leading-relaxed text-osso/70">
          Conteúdo meramente informativo, sem finalidade de captação de clientela, em conformidade com o Provimento 205/2021 do Conselho Federal da
          OAB.
        </p>
      </Container>
    </footer>
  );
}

/* ---------------------------------------------------------------- Contato fixo */
export function ContatoFixo() {
  const c = contatoPrincipal();
  return (
    <>
      {/* barra no celular */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-grafite/15 bg-osso/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <div className="flex gap-2">
          <a
            href={c.href}
            {...(c.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-vinho font-sans text-[0.95rem] font-medium text-osso"
          >
            <c.Icone />
            {temWhatsapp() ? "WhatsApp" : `Ligar · ${CONFIG.telefone}`}
          </a>
          {temWhatsapp() && (
            <a href={CONFIG.telefoneHref} className="flex min-h-12 items-center justify-center gap-2 border border-grafite/30 px-5 font-sans text-[0.95rem] text-grafite">
              <IconeTelefone />
              Ligar
            </a>
          )}
        </div>
      </div>
      {/* botão flutuante discreto no desktop */}
      <a
        href={c.href}
        {...(c.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={temWhatsapp() ? "Agendar pelo WhatsApp" : `Ligar: ${CONFIG.telefone}`}
        className="fixed bottom-6 right-6 z-40 hidden h-12 items-center gap-2 border border-vinho/30 bg-osso px-4 font-sans text-[0.9rem] text-vinho shadow-[0_1px_0_rgba(36,32,30,.08)] transition-colors hover:bg-vinho hover:text-osso lg:inline-flex"
      >
        <c.Icone />
        {temWhatsapp() ? "WhatsApp" : "Ligar"}
      </a>
    </>
  );
}
