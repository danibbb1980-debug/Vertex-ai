import { AnimatePresence, m } from "motion/react";
import { useId, useRef, useState, type FormEvent } from "react";
import { AREAS, CONFIG, MSG, enderecoCurto, waLink } from "../config";
import { DrawX, Relief } from "./Ornaments";
import { MaskedLines } from "./TextReveal";
import { Btn, EXPO_OUT, IconClock, IconInsta, IconMail, IconPin, IconWhats, Reveal, Rich, SectionLabel, useReducedMotion } from "./ui";

const PERIODOS = ["Manhã (09h às 12h)", "Tarde (13h às 18h)", "A combinar"];
const ASSUNTOS = [...AREAS.map((a) => a.titulo), "Ainda não sei, quero conversar"];
const MAX = 300;

/** Monta a mensagem do WhatsApp. Campos vazios não entram. */
export function montarMensagem(d: { nome: string; assunto: string; periodo: string; mensagem: string }) {
  const linhas = ["Olá! Vim pelo site e gostaria de falar sobre um atendimento.", `Nome: ${d.nome.trim()}`];
  if (d.assunto) linhas.push(`Assunto: ${d.assunto}`);
  if (d.periodo) linhas.push(`Melhor período: ${d.periodo}`);
  if (d.mensagem.trim()) linhas.push(`Mensagem: ${d.mensagem.trim()}`);
  return linhas.join("\n");
}

function PreAtendimento() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState<string | null>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const okRef = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [minH, setMinH] = useState<number | undefined>(undefined);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro("Informe o seu nome para continuar.");
      nomeRef.current?.focus();
      return;
    }
    setErro("");
    const url = waLink(montarMensagem({ nome, assunto, periodo, mensagem }));
    window.open(url, "_blank", "noopener,noreferrer");
    // trava a altura do cartão para a página não "pular" ao trocar pelo aviso
    setMinH(card.current?.offsetHeight);
    setEnviado(url);
  };

  return (
    <div
      id="agendar"
      ref={card}
      tabIndex={-1}
      style={{ minHeight: enviado ? minH : undefined }}
      className="relative flex flex-col justify-center rounded-[24px] bg-[var(--bg-2)] p-6 sm:p-8 md:p-10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {enviado ? (
          <m.div
            key="ok"
            ref={okRef}
            tabIndex={-1}
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EXPO_OUT }}
            onAnimationStart={() => okRef.current?.focus({ preventScroll: true })}
            className="flex flex-col justify-center outline-none"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-[var(--accent)] text-[var(--accent)]" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <p className="h3 mt-8 text-[clamp(1.6rem,1.3rem+1vw,2.2rem)]">Pronto! Abrimos o WhatsApp com sua mensagem.</p>
            <p className="muted mt-4 max-w-[40ch]">É só enviar. O escritório retorna assim que possível.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={enviado} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <IconWhats className="h-5 w-5" />
                <span>Abrir WhatsApp</span>
              </a>
              <button type="button" className="link link-static min-h-12" onClick={() => {
                  setEnviado(null);
                  requestAnimationFrame(() => nomeRef.current?.focus({ preventScroll: true }));
                }}>
                Voltar ao formulário
              </button>
            </div>
            <p className="muted mt-6 text-[0.875rem]">Se a conversa não abriu sozinha, use o botão “Abrir WhatsApp”.</p>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={submit}
            aria-labelledby={`${uid}-t`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p id={`${uid}-t`} className="h3 text-[clamp(1.5rem,1.25rem+0.9vw,2rem)]">
              Pré-atendimento pelo WhatsApp
            </p>
            <p className="muted mt-3 text-[0.9375rem]">Preencha o básico e continue a conversa direto com o escritório.</p>

            <div className="mt-8 space-y-7">
              <div>
                <label htmlFor={`${uid}-nome`} className="eyebrow block !text-[var(--fg)]">
                  Nome <span className="text-[var(--accent)]">(obrigatório)</span>
                </label>
                <input
                  ref={nomeRef}
                  id={`${uid}-nome`}
                  name="nome"
                  className="field"
                  autoComplete="given-name"
                  required
                  maxLength={80}
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (erro && e.target.value.trim()) setErro("");
                  }}
                  aria-invalid={!!erro}
                  aria-describedby={erro ? `${uid}-erro` : undefined}
                />
                {erro && (
                  <p id={`${uid}-erro`} className="mt-2 text-[0.875rem] font-medium text-[var(--accent)]">
                    {erro}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`${uid}-assunto`} className="eyebrow block !text-[var(--fg)]">
                  Assunto
                </label>
                <select id={`${uid}-assunto`} name="assunto" className="field" value={assunto} onChange={(e) => setAssunto(e.target.value)}>
                  <option value="">Selecione, se quiser</option>
                  {ASSUNTOS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset>
                <legend className="eyebrow !text-[var(--fg)]">Melhor período</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PERIODOS.map((p) => (
                    <label
                      key={p}
                      className="relative inline-flex min-h-12 cursor-pointer items-center rounded-full border border-[var(--line-strong)] px-4 text-[0.9375rem] transition-colors has-[:checked]:border-[var(--fg)] has-[:checked]:bg-[var(--fg)] has-[:checked]:text-[var(--bg)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent)]"
                    >
                      <input
                        type="radio"
                        name="periodo"
                        value={p}
                        checked={periodo === p}
                        onChange={() => setPeriodo(p)}
                        className="sr-only"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={`${uid}-msg`} className="eyebrow block !text-[var(--fg)]">
                    Mensagem curta
                  </label>
                  <span className="muted text-[0.8125rem] tabular-nums" aria-live="polite">
                    {mensagem.length}/{MAX}
                  </span>
                </div>
                <textarea
                  id={`${uid}-msg`}
                  name="mensagem"
                  className="field"
                  rows={3}
                  maxLength={MAX}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  aria-describedby={`${uid}-aviso`}
                />
                <p id={`${uid}-aviso`} className="mt-3 flex gap-2 text-[0.875rem] font-medium">
                  <span aria-hidden className="text-[var(--accent)]">!</span>
                  Não envie documentos nem dados de saúde por aqui. Detalhes do caso só no atendimento.
                </p>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-9 w-full sm:w-auto">
              <IconWhats className="h-5 w-5" />
              <span>Continuar no WhatsApp</span>
              <span className="arrow" aria-hidden>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 10h13M11 4.5 16.5 10 11 15.5" />
                </svg>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 10h13M11 4.5 16.5 10 11 15.5" />
                </svg>
              </span>
            </button>
            <p className="muted mt-5 text-[0.8125rem] leading-relaxed">
              Ao enviar, você abre uma conversa no WhatsApp com o escritório. Este site não guarda os dados digitados.{" "}
              <a href="/privacidade.html" className="link link-static text-[var(--fg)]">
                Entenda como funciona
              </a>
              .
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contato() {
  const e = CONFIG.endereco;
  return (
    <section id="contato" data-tone="light" tabIndex={-1} aria-labelledby="contato-titulo" className="pb-24 md:pb-40">
      <div className="wrap">
        <hr className="rule mb-24 md:mb-36" />
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel n="07">Contato</SectionLabel>
              <h2 id="contato-titulo" className="h2 mt-8">
                <Rich text="Vamos *conversar*?" />
              </h2>
              <p className="lead mt-6 max-w-[36ch]">
                Atendimento presencial em {e.cidade}
                {CONFIG.atendeOnline ? " e consultoria jurídica à distância." : "."}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <a
                href={waLink(MSG.geral)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-12 block border-y border-[var(--line)] py-6"
              >
                <span className="eyebrow flex items-center gap-2">
                  <IconWhats className="h-4 w-4" /> WhatsApp
                </span>
                <span className="mt-2 block font-serif text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] leading-none font-light tracking-[-0.02em] transition-colors group-hover:text-[var(--accent)]">
                  {CONFIG.whatsappExibicao}
                </span>
              </a>

              <dl className="mt-8 grid gap-7 text-[0.98rem] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <dt className="eyebrow flex items-center gap-2">
                    <IconClock className="h-4 w-4" /> Horário
                  </dt>
                  <dd className="mt-2">
                    {CONFIG.horario.dias}
                    <span className="block">{CONFIG.horario.periodos.join(" e ")}</span>
                    <span className="muted block">{CONFIG.horario.fechado}</span>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow flex items-center gap-2">
                    <IconPin className="h-4 w-4" /> Endereço
                  </dt>
                  <dd className="mt-2">
                    {e.logradouro}
                    <span className="block">{enderecoCurto}</span>
                    <a
                      href={CONFIG.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-static mt-2 inline-flex min-h-11 items-center gap-1.5 font-medium text-[var(--accent)]"
                    >
                      Como chegar <span aria-hidden>↗</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow flex items-center gap-2">
                    <IconMail className="h-4 w-4" /> E-mail
                  </dt>
                  <dd className="mt-2 break-all">
                    <a href={`mailto:${CONFIG.email}`} className="link link-static">
                      {CONFIG.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow flex items-center gap-2">
                    <IconInsta className="h-4 w-4" /> Instagram
                  </dt>
                  <dd className="mt-2">
                    <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="link link-static">
                      {CONFIG.instagram.usuario}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.12}>
            <PreAtendimento />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function CtaFinal() {
  const reduce = useReducedMotion();
  return (
    <section data-tone="dark" aria-labelledby="cta-titulo" className="relative isolate overflow-hidden pt-28 pb-20 md:pt-44 md:pb-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 text-[var(--line)]" aria-hidden>
        <Relief className="mx-auto block h-[38vh] w-full max-w-[1400px]" parallax={false} delay={0} />
      </div>
      <div className="wrap">
        <p className="eyebrow">Fale com o escritório</p>
        <MaskedLines
          as="h2"
          inView
          delay={0}
          lines={["Conversar é o", "primeiro *passo*."]}
          className="display mt-8 text-[clamp(3rem,1rem+8vw,9rem)]"
        />
        <span id="cta-titulo" className="sr-only">
          Conversar é o primeiro passo.
        </span>

        {/* linha do processo, terminando em círculo no botão */}
        <div className="mt-14 flex flex-col gap-8 md:mt-20 md:flex-row md:items-center md:gap-0">
          <DrawX className="hidden h-6 flex-1 md:block">
            <svg className="h-full w-full" viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden focusable="false">
              <path
                d="M0 12 C 120 2, 240 22, 360 12 S 540 4, 600 12"
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </DrawX>
          <m.span
            aria-hidden
            className="mr-4 ml-0 hidden h-[22px] w-[22px] shrink-0 rounded-full border-[1.5px] border-[var(--accent)] md:block"
            initial={reduce ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.6, delay: 1.2, ease: EXPO_OUT }}
          />
          <Btn href={waLink(MSG.geral)} external icon={<IconWhats className="h-5 w-5" />} className="self-start md:self-auto">
            Falar pelo WhatsApp
          </Btn>
        </div>
        <div className="mt-8 flex flex-col gap-2 text-[0.9375rem] md:flex-row md:justify-end md:gap-6">
          <a href="#agendar" className="link link-static self-start">
            Prefere escrever antes? Use o pré-atendimento
          </a>
          <span className="muted">
            {CONFIG.horario.dias}, {CONFIG.horario.periodos.join(" e ")}
          </span>
        </div>
      </div>
    </section>
  );
}
