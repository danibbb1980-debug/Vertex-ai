import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CONFIG, enderecoCompleto, fmtHora, msgAtendimento, waLink } from "../config";
import Logo from "./Logo";
import HairField from "./HairField";
import { FioDetalhe, HairRow } from "./hair";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function BotaoAgendar({ msg, children = "Agendar avaliação", variante = "primario", className = "" }: { msg?: string; children?: React.ReactNode; variante?: "primario" | "secundario"; className?: string }) {
  return (
    <a href={waLink(msg)} {...ext} className={`btn btn-${variante} ${className}`}>
      {children}
      <span className="seta" aria-hidden="true" />
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}

export function BotaoInstagram({ className = "" }: { className?: string }) {
  if (!CONFIG.instagram) return null;
  return (
    <a href={CONFIG.instagram} {...ext} className={`btn btn-secundario ${className}`}>
      Ver no Instagram<span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/* ---------- Faixa de rascunho ---------- */
export function FaixaRascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-7 bg-bordo text-marfim/85 text-[0.64rem] sm:text-[0.7rem] tracking-[0.02em] sm:tracking-[0.08em] whitespace-nowrap overflow-hidden flex items-center justify-center px-4 text-center" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

/* ---------- Header ---------- */
const LINKS = [
  ["Atendimentos", "#atendimentos", "atendimentos"],
  ["Equipe", "#equipe", "equipe"],
  ["Como funciona", "#como-funciona", "comoFunciona"],
  ["Dúvidas", "#duvidas", "duvidas"],
  ["Contato", "#contato", "contato"],
] as const;

export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const top = CONFIG.rascunho ? "top-7" : "top-0";
  useEffect(() => {
    const on = () => setSolido(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);
  const links = LINKS.filter(([, , k]) => CONFIG.secoes[k as keyof typeof CONFIG.secoes]);
  return (
    <header className={`fixed inset-x-0 ${top} z-40 transition-colors duration-300 ${solido || aberto ? "bg-marfim/95 backdrop-blur-sm border-b border-grafite/10" : "bg-transparent border-b border-transparent"}`}>
      <a href="#conteudo" className="sr-only-focusable absolute left-4 top-2 bg-bordo text-marfim px-3 py-2 z-50">Pular para o conteúdo</a>
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 h-[68px] flex items-center justify-between gap-6">
        <a href="#topo" className="text-[1.75rem] md:text-[2rem]" aria-label={`${CONFIG.nome}, voltar ao início`}>
          <Logo descritor={false} />
        </a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex gap-7 text-[0.92rem]">
            {links.map(([t, h]) => (
              <li key={h}><a href={h} className="py-3 hover:text-vermelho-texto transition-colors">{t}</a></li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <BotaoAgendar className="hidden sm:inline-flex !min-h-[44px] text-[0.88rem]" />
          <button
            type="button"
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-[6px]"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
            <span className={`block h-px w-6 bg-grafite transition-transform ${aberto ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-grafite transition-transform ${aberto ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      <nav id="menu-movel" aria-label="Menu" hidden={!aberto} className="lg:hidden border-t border-grafite/10 bg-marfim">
        <ul className="px-4 py-2">
          {links.map(([t, h], i) => (
            <li key={h} className="border-b border-grafite/10 last:border-0">
              <a href={h} onClick={() => setAberto(false)} className="flex items-baseline gap-4 py-4 display text-2xl">
                <span className="rotulo text-vermelho-texto tabular">{String(i + 1).padStart(2, "0")}</span>{t}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/* ---------- Hero ---------- */
export function Hero() {
  return (
    <section id="topo" className={`relative ${CONFIG.rascunho ? "pt-[calc(68px+1.75rem)]" : "pt-[68px]"} overflow-hidden`}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 grid lg:grid-cols-12 gap-x-8 min-h-[min(92svh,900px)] items-center">
        <div className="relative z-10 lg:col-span-7 pt-8 md:pt-20 pb-2 lg:pb-20">
          <p className="rotulo text-grafite-2 mb-6 md:mb-8 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-vermelho" aria-hidden="true" />
            Depilação a laser e estética · Varginha - MG
          </p>
          <h1 className="display text-[clamp(2.6rem,6.2vw,4.9rem)] max-w-[15ch]">
            Cada atendimento começa em uma avaliação <em>individual</em>.
          </h1>
          <p className="mt-8 max-w-[34ch] text-[1.1rem] md:text-[1.2rem] text-grafite-2">
            Depilação a laser, micropigmentação e remoção de tatuagem, de segunda a sábado, no Centro de Varginha.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <BotaoAgendar />
            {CONFIG.secoes.atendimentos && (
              <a href="#atendimentos" className="btn btn-secundario">Conhecer os atendimentos</a>
            )}
          </div>
        </div>
        <div className="relative lg:col-span-5 -mr-4 md:-mr-8 lg:-mr-24 -mt-10 lg:mt-0 h-[360px] sm:h-[460px] lg:h-[min(82svh,780px)] lg:self-end">
          <HairField className="absolute bottom-0 left-[-6%] lg:left-0 h-full w-auto max-w-none" />
        </div>
      </div>
    </section>
  );
}

/* ---------- O atendimento (bordô) ---------- */
const PRINCIPIOS = [
  ["Avaliação individual", "Antes de qualquer procedimento, uma conversa e uma avaliação de cada caso."],
  ["Plano explicado com clareza", "O que é indicado, como funciona e o que esperar, dito antes de começar."],
  ["Acompanhamento", "Os retornos são combinados e conversados com você."],
] as const;

export function OAtendimento() {
  if (!CONFIG.secoes.atendimento) return null;
  return (
    <section aria-labelledby="t-atendimento" className="on-dark grao bg-bordo text-marfim">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20">
          <h2 id="t-atendimento" className="display text-[clamp(2rem,4.6vw,3.6rem)] max-w-[16ch]">
            Como a PelloFinn <em>atende</em>.
          </h2>
          <HairRow n={16} altura={110} largura={420} seed={11} destaque={[5]} className="w-[260px] md:w-[380px] text-marfim" />
        </div>
        <ol>
          {PRINCIPIOS.map(([t, d], i) => (
            <li key={t} className={`grid md:grid-cols-12 gap-x-8 gap-y-3 py-8 md:py-10 border-t border-marfim/20 ${i === 2 ? "border-b" : ""}`}>
              <span className="md:col-span-1 rotulo text-vermelho-claro tabular pt-3">{String(i + 1).padStart(2, "0")}</span>
              <p className={`display text-[clamp(1.7rem,3.6vw,2.9rem)] md:col-span-6 ${i === 1 ? "md:col-start-3" : i === 2 ? "md:col-start-4" : ""}`}>{t}</p>
              <p className={`text-marfim/75 max-w-[36ch] md:col-span-4 md:pt-3 ${i === 0 ? "md:col-start-9" : i === 1 ? "md:col-start-9" : "md:col-start-10 md:col-span-3"}`}>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Atendimentos: índice editorial ---------- */
export function Atendimentos() {
  const [aberto, setAberto] = useState<number | null>(0);
  const base = useId();
  if (!CONFIG.secoes.atendimentos || CONFIG.atendimentos.length === 0) return null;
  return (
    <section id="atendimentos" aria-labelledby="t-atendimentos" className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-32 grid lg:grid-cols-12 gap-x-8">
      <div className="lg:col-span-4 mb-12 lg:mb-0">
        <div className="lg:sticky lg:top-32">
          <p className="rotulo text-grafite-2 mb-5">Índice · {String(CONFIG.atendimentos.length).padStart(2, "0")} atendimentos</p>
          <h2 id="t-atendimentos" className="display text-[clamp(2.2rem,3.9vw,3.3rem)]">
            Atendimentos em um só <em>endereço</em>.
          </h2>
          <p className="mt-6 text-grafite-2 max-w-[30ch]">A indicação de cada atendimento depende de avaliação individual.</p>
        </div>
      </div>
      <ol className="lg:col-span-8 border-t border-grafite/20">
        {CONFIG.atendimentos.map((a, i) => {
          const open = aberto === i;
          const idP = `${base}-p-${i}`;
          const idB = `${base}-b-${i}`;
          return (
            <li key={a.id} className="border-b border-grafite/20">
              <h3>
                <button
                  id={idB}
                  type="button"
                  aria-expanded={open}
                  aria-controls={idP}
                  onClick={() => setAberto(open ? null : i)}
                  className="group w-full text-left grid grid-cols-[3.2rem_1fr_auto] md:grid-cols-[5.5rem_1fr_auto] items-baseline gap-x-3 py-7 md:py-9"
                >
                  <motion.span
                    className="display tabular text-[clamp(1.4rem,3vw,2.2rem)]"
                    initial={{ color: "#a99c9e" }}
                    whileInView={{ color: "#a4212c" }}
                    viewport={{ once: true, margin: "-35% 0px" }}
                    transition={{ duration: 0.6 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                  <span className="display text-[clamp(1.9rem,5.2vw,4rem)] transition-transform duration-300 group-hover:translate-x-2">{a.nome}</span>
                  <span className="relative w-5 h-5 self-center" aria-hidden="true">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-grafite" />
                    <span className={`absolute inset-y-0 left-1/2 w-px bg-grafite transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
                  </span>
                </button>
              </h3>
              <div id={idP} role="region" aria-labelledby={idB} hidden={!open}>
                <div className="grid md:grid-cols-[5.5rem_1fr] gap-x-3 pb-10">
                  <div className="md:col-start-2 max-w-[52ch]">
                    {a.areas && (
                      <p className="rotulo text-grafite-2 mb-4">Áreas informadas: {a.areas}</p>
                    )}
                    <p className="text-[1.08rem]">{a.descricao}</p>
                    <p className="mt-3 text-grafite-2">A indicação depende de avaliação individual.</p>
                    <BotaoAgendar msg={msgAtendimento(a.nome)} className="mt-7">
                      Agendar avaliação<span className="sr-only"> sobre {a.nome.toLowerCase()}</span>
                    </BotaoAgendar>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- Equipe ---------- */
export function Equipe() {
  const lista = CONFIG.profissionais.filter((p) => p.nome);
  if (!CONFIG.secoes.equipe || lista.length === 0) return null;
  return (
    <section id="equipe" aria-labelledby="t-equipe" className="bg-marfim-2/70 border-y border-grafite/10">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-32">
        <div className="flex items-baseline justify-between gap-6 mb-14 md:mb-20 border-b border-grafite/20 pb-6">
          <h2 id="t-equipe" className="display text-[clamp(2.2rem,4.8vw,3.8rem)]">Quem <em>atende</em>.</h2>
          <p className="rotulo text-grafite-2 tabular">{String(lista.length).padStart(2, "0")} profissionais</p>
        </div>
        <ul className="grid md:grid-cols-12 gap-y-20 gap-x-8">
          {lista.map((p, i) => {
            const par = i % 2 === 1;
            return (
              <li key={p.nome} className={`md:col-span-6 ${par ? "md:col-start-7 md:mt-40" : ""}`}>
                <figure className={`grid grid-cols-12 gap-x-4 items-end`}>
                  {p.foto && (
                    <div className={`col-span-9 sm:col-span-8 ${par ? "col-start-4 sm:col-start-5" : ""} relative`}>
                      <picture>
                        <source type="image/webp" srcSet={`${p.foto}-400.webp 400w, ${p.foto}-640.webp 640w`} sizes="(min-width: 768px) 30vw, 70vw" />
                        <img
                          src={`${p.foto}-640.webp`}
                          alt={p.fotoAlt}
                          width={640}
                          height={800}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-auto aspect-[4/5] object-cover"
                        />
                      </picture>
                      <span className={`absolute top-0 ${par ? "-left-3" : "-right-3"} w-px h-1/2 bg-vermelho`} aria-hidden="true" />
                    </div>
                  )}
                  <figcaption className={`col-span-12 mt-6 flex gap-4 items-end ${par ? "justify-end text-right" : ""}`}>
                    {!par && <FioDetalhe className="w-6 h-16 shrink-0" cor={i === 0 ? "var(--color-vermelho)" : "var(--color-fio)"} />}
                    <div>
                      <p className="rotulo text-vermelho-texto mb-3">{p.cargo}</p>
                      <p className="display text-[clamp(2rem,4.4vw,3.4rem)]">{p.nome}</p>
                      {p.formacao && <p className="mt-3 text-grafite-2">{p.formacao}</p>}
                      {p.registro && <p className="mt-1 text-grafite-2 tabular">{p.registro}</p>}
                    </div>
                    {par && <FioDetalhe className="w-6 h-16 shrink-0" />}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Como funciona: linha do tempo ---------- */
const ETAPAS = [
  ["Contato e agendamento", "Você fala com a equipe pelo WhatsApp e combina o dia e o horário da avaliação."],
  ["Avaliação individual", "Uma conversa sobre o que você procura e uma avaliação do seu caso, sem compromisso de iniciar."],
  ["Plano explicado com clareza", "Se houver indicação, o plano é apresentado e explicado antes de começar."],
  ["Acompanhamento", "Os retornos são conversados e ajustados a cada etapa."],
] as const;

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduz = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const sy = useTransform(scrollYProgress, [0, 1], [0, 1]);
  if (!CONFIG.secoes.comoFunciona) return null;
  return (
    <section id="como-funciona" aria-labelledby="t-como" className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-32 grid lg:grid-cols-12 gap-x-8">
      <div className="lg:col-span-5 mb-14">
        <p className="rotulo text-grafite-2 mb-5">Passo a passo</p>
        <h2 id="t-como" className="display text-[clamp(2.2rem,4.8vw,3.8rem)] max-w-[12ch]">Como <em>funciona</em>.</h2>
      </div>
      <ol ref={ref} className="lg:col-span-7 relative pl-14 md:pl-24">
        <span className="absolute left-[1.15rem] md:left-[2.1rem] top-2 bottom-2 w-px bg-grafite/15" aria-hidden="true" />
        <motion.span
          className="absolute left-[1.15rem] md:left-[2.1rem] top-2 bottom-2 w-px bg-vermelho origin-top"
          style={{ scaleY: reduz ? 1 : sy }}
          aria-hidden="true"
        />
        {ETAPAS.map(([t, d], i) => (
          <li key={t} className="relative pb-14 last:pb-0">
            <span className="absolute -left-14 md:-left-24 top-0 w-10 md:w-[4.25rem] bg-marfim display tabular text-[2.2rem] md:text-[3.6rem] leading-none text-center text-grafite/80">
              {i + 1}
            </span>
            <h3 className="display text-[clamp(1.5rem,3vw,2.2rem)] pt-1">{t}</h3>
            <p className="mt-3 text-grafite-2 max-w-[44ch]">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- Dúvidas ---------- */
const sabado = CONFIG.horarios.find((h) => h.dia === 6);
const FAQ: [string, string][] = [
  ["Como agendar?", `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões deste site ou pelo formulário de solicitação. A equipe responde e combina o dia e o horário com você.`],
  ["Posso agendar pelo site?", "Pelo site você envia uma solicitação: o formulário monta uma mensagem e abre o WhatsApp. O agendamento é combinado na conversa com a equipe."],
  ["Como é a primeira avaliação?", "É uma conversa sobre o que você procura, com uma avaliação do seu caso. A partir dela, a equipe explica o que é indicado e como funciona."],
  ["O que levar?", "Se você tiver informações sobre procedimentos anteriores na mesma área, leve-as para a avaliação. Outras orientações, quando houver, são passadas no agendamento."],
  ["Quais atendimentos são oferecidos?", `${CONFIG.atendimentos.map((a) => a.nome + (a.areas ? ` (${a.areas.toLowerCase()})` : "")).join("; ")}.`],
  ["Todo atendimento serve para todas as pessoas?", "Não necessariamente. A indicação de cada atendimento depende de avaliação individual."],
  ["A remoção de tatuagem é possível em qualquer caso?", "Cada tatuagem é diferente. O que é possível em cada caso é conversado na avaliação individual."],
  ["Quais são os horários?", CONFIG.horarios.filter((h) => h.abre).map((h) => `${h.nome}: ${fmtHora(h.abre)} às ${fmtHora(h.fecha)}`).join("; ") + `. ${CONFIG.avisoHorarios}`],
  ["Atendem aos sábados?", sabado?.abre ? `Sim, das ${fmtHora(sabado.abre)} às ${fmtHora(sabado.fecha)}.` : "Não."],
  ["E aos domingos?", "Não. Aos domingos a PelloFinn não abre."],
  ["Onde fica?", `${enderecoCompleto()}.`],
];

export function Duvidas() {
  const [aberto, setAberto] = useState<number | null>(null);
  const base = useId();
  if (!CONFIG.secoes.duvidas) return null;
  return (
    <section id="duvidas" aria-labelledby="t-duvidas" className="border-t border-grafite/15">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-32 grid lg:grid-cols-12 gap-x-8">
        <div className="lg:col-span-4 mb-10">
          <div className="lg:sticky lg:top-32">
            <p className="rotulo text-grafite-2 mb-5">Dúvidas frequentes</p>
            <h2 id="t-duvidas" className="display text-[clamp(2.2rem,4.8vw,3.8rem)]">Antes de <em>agendar</em>.</h2>
          </div>
        </div>
        <ul className="lg:col-span-8 border-t border-grafite/20">
          {FAQ.map(([q, r], i) => {
            const open = aberto === i;
            return (
              <li key={q} className="border-b border-grafite/20">
                <h3>
                  <button
                    id={`${base}-q${i}`}
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${base}-r${i}`}
                    onClick={() => setAberto(open ? null : i)}
                    className="w-full min-h-[64px] py-5 flex items-baseline gap-5 text-left"
                  >
                    <span className="rotulo tabular text-vermelho-texto w-7 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[1.15rem] md:text-[1.3rem] font-semibold">{q}</span>
                    <span className="relative w-4 h-4 shrink-0 self-center" aria-hidden="true">
                      <span className="absolute inset-x-0 top-1/2 h-px bg-grafite" />
                      <span className={`absolute inset-y-0 left-1/2 w-px bg-grafite transition-transform ${open ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div id={`${base}-r${i}`} role="region" aria-labelledby={`${base}-q${i}`} hidden={!open}>
                  <p className="pl-12 pb-6 pr-8 text-grafite-2 max-w-[60ch]">{r}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Localização e contato ---------- */
export function Contato() {
  const hoje = new Date().getDay();
  const mapaRef = useRef<HTMLDivElement>(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  useEffect(() => {
    const el = mapaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setMostrarMapa(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!CONFIG.secoes.contato) return null;
  const e = CONFIG.endereco;
  return (
    <section id="contato" aria-labelledby="t-contato" className="border-t border-grafite/15">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-32 grid lg:grid-cols-12 gap-x-8 gap-y-14">
        <div className="lg:col-span-5">
          <p className="rotulo text-grafite-2 mb-5">Localização e contato</p>
          <h2 id="t-contato" className="display text-[clamp(2.2rem,4.8vw,3.8rem)]">Venha nos <em>visitar</em>.</h2>
          <address className="not-italic mt-10 text-[1.15rem] leading-relaxed">
            {e.rua}<br />{e.bairro}, {e.cidade} - {e.uf}<br /><span className="tabular">CEP {e.cep}</span>
          </address>
          {CONFIG.usarWhatsapp && (
            <p className="mt-6"><span className="rotulo text-grafite-2 block mb-1">WhatsApp</span><span className="tabular text-[1.15rem]">{CONFIG.whatsappExibicao}</span></p>
          )}
          {CONFIG.email && (
            <p className="mt-4"><span className="rotulo text-grafite-2 block mb-1">E-mail</span><a className="link-sub" href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></p>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <BotaoAgendar>Agendar pelo WhatsApp</BotaoAgendar>
            <a href={CONFIG.rotaUrl} {...ext} className="btn btn-secundario">Como chegar<span className="sr-only"> (abre o Google Maps)</span></a>
            <BotaoInstagram />
          </div>
        </div>
        <div className="lg:col-span-7 grid gap-10">
          <div>
            <h3 className="rotulo text-grafite-2 mb-4">Horários</h3>
            <table className="w-full tabular">
              <caption className="sr-only">Horários de atendimento</caption>
              <tbody>
                {CONFIG.horarios.map((h) => (
                  <tr key={h.dia} className={`border-t border-grafite/15 ${h.dia === hoje ? "text-vermelho-texto" : ""}`}>
                    <th scope="row" className="text-left font-normal py-3">
                      {h.nome}{h.dia === hoje && <span className="rotulo ml-3">hoje</span>}
                    </th>
                    <td className="text-right py-3">{h.abre ? `${fmtHora(h.abre)} às ${fmtHora(h.fecha)}` : "Fechado"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[0.9rem] text-grafite-2 border-t border-grafite/15 pt-3">{CONFIG.avisoHorarios}</p>
          </div>
          <div ref={mapaRef} className="relative aspect-[4/3] md:aspect-[16/10] bg-marfim-2 border border-grafite/15">
            {mostrarMapa && (
              <iframe
                title={`Mapa: ${enderecoCompleto()}`}
                src={CONFIG.mapaEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[0.6] contrast-[0.95]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA final ---------- */
export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null;
  return (
    <section aria-labelledby="t-cta" className="on-dark grao bg-bordo text-marfim overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-20 md:pt-32 grid md:grid-cols-12 gap-x-8 items-end">
        <div className="md:col-span-7 pb-16 md:pb-28">
          <h2 id="t-cta" className="display text-[clamp(2.4rem,6vw,4.8rem)] max-w-[13ch]">
            Sua avaliação é o primeiro <em>passo</em>.
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <BotaoAgendar />
            <BotaoInstagram />
          </div>
        </div>
        <HairRow n={22} altura={260} largura={560} seed={41} destaque={[4, 15]} className="md:col-span-5 w-full text-marfim -mb-px" />
      </div>
    </section>
  );
}

/* ---------- Rodapé ---------- */
export function Rodape() {
  return (
    <footer className="on-dark bg-[#1d0a0f] text-marfim/80 pb-24 md:pb-10">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-14 grid md:grid-cols-12 gap-10 border-t border-marfim/10">
        <div className="md:col-span-4 text-[2.4rem]"><Logo escuro /></div>
        <div className="md:col-span-4 text-[0.95rem] leading-relaxed">
          <p className="rotulo text-marfim/55 mb-3">Endereço</p>
          <address className="not-italic">{enderecoCompleto()}</address>
          {CONFIG.usarWhatsapp && <p className="mt-4">WhatsApp <span className="tabular">{CONFIG.whatsappExibicao}</span></p>}
          {CONFIG.instagram && <p className="mt-1"><a className="link-sub" href={CONFIG.instagram} {...ext}>Instagram {CONFIG.instagramUsuario}</a></p>}
        </div>
        <div className="md:col-span-4 text-[0.88rem] leading-relaxed">
          <p>Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada atendimento depende de avaliação individual.</p>
          {CONFIG.responsavelTecnico && <p className="mt-3">Responsável técnico: {CONFIG.responsavelTecnico}</p>}
          <p className="mt-4"><a href="/privacidade.html" className="link-sub">Privacidade</a></p>
          <p className="mt-4 text-marfim/55">© {new Date().getFullYear()} {CONFIG.nome} | {CONFIG.descritor}</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Barra fixa no celular / botão flutuante ---------- */
export function AgendarFixo() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const on = () => setVisivel(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <div className={`md:hidden fixed inset-x-0 bottom-0 z-30 bg-marfim/95 backdrop-blur-sm border-t border-grafite/15 px-4 py-3 transition-transform duration-300 ${visivel ? "translate-y-0" : "translate-y-full"}`} aria-hidden={!visivel}>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" tabIndex={visivel ? 0 : -1} className="btn btn-primario w-full">
          Agendar avaliação pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`hidden md:inline-flex fixed right-6 bottom-6 z-30 btn btn-primario transition-opacity duration-300 ${visivel ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        Agendar <span className="seta" aria-hidden="true" /><span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
      </a>
    </>
  );
}
