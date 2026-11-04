import { useId, useRef, useState } from "react";
import { m, useScroll, useSpring, useTransform } from "motion/react";
import { CONFIG, LIMITE_MENSAGEM } from "../config";
import { waEscritorio, waPreAtendimento } from "../lib/whatsapp";
import { italico } from "../lib/text";
import { useReducedMotion } from "../lib/useClient";
import { Portrait } from "./hero";
import { Monogram } from "./chrome";
import { Arrow, ChatIcon, MagneticLink, Rise, SectionHead, TextReveal } from "./ui";

const wrap = "mx-auto max-w-[1440px] px-5 md:px-10";

/* ---------------- 03 Sobre ---------------- */

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const e = CONFIG.escritorio;

  return (
    <section ref={ref} id="sobre" aria-labelledby="sobre-titulo" className={`${wrap} py-24 md:py-40`}>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <Portrait
            parallax={y}
            caption={CONFIG.modelo ? "Com foto: troque em config.ts" : e.nome}
            className="max-w-[26rem] lg:sticky lg:top-32"
          />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <SectionHead num="03" label="Sobre o escritório" id="sobre-titulo">
            {italico(CONFIG.sobre.titulo.join(" "))}
          </SectionHead>
          <div className="mt-10 space-y-5 text-[1.1rem] leading-[1.65] text-ink-soft">
            {CONFIG.sobre.paragrafos.map((p) => (
              <Rise as="p" key={p.slice(0, 20)}>
                {p}
              </Rise>
            ))}
          </div>

          <dl className="mt-14 grid gap-px border-y border-rule sm:grid-cols-3">
            {CONFIG.sobre.principios.map((p, i) => (
              <Rise key={p.termo} delay={i * 0.08} className="py-6 sm:pr-6">
                <dt className="font-display text-[2rem] italic">{p.termo}</dt>
                <dd className="mt-2 text-[0.98rem] text-ink-soft">{p.texto}</dd>
              </Rise>
            ))}
          </dl>

          <div className="mt-14">
            <h3 className="label text-ink-soft">Formação e inscrição</h3>
            <ul className="mt-5 divide-y divide-rule border-y border-rule">
              {e.responsaveis.map((r) => (
                <li key={r.nome} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                  <span className="serif text-[1.2rem]">{r.nome}</span>
                  <span className="label text-ink-soft">{r.inscricao}</span>
                </li>
              ))}
              {e.formacao.map((f) => (
                <li key={f} className="py-4 text-[1rem] text-ink-soft">
                  {f}
                </li>
              ))}
            </ul>
            {CONFIG.modelo && (
              <p className="mt-4 text-[0.875rem] text-ink-soft">Dados ilustrativos, substituídos pelos do escritório real.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 04 Conteúdo útil ---------------- */

export function Articles() {
  return (
    <section aria-labelledby="conteudo-titulo" className="bg-paper-2">
      <div className={`${wrap} py-24 md:py-36`}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead num="04" label="Conteúdo útil" className="lg:col-span-8" id="conteudo-titulo">
            Para ler com <em>calma</em>.
          </SectionHead>
          <p className="text-[1.05rem] text-ink-soft lg:col-span-4">
            Textos curtos e informativos sobre o que costuma gerar dúvida. Sem juridiquês.
          </p>
        </div>
        <ul className="mt-16 grid gap-px bg-rule md:grid-cols-3">
          {CONFIG.artigos.map((a, i) => (
            <Rise as="li" key={a.titulo} delay={i * 0.08} className="bg-paper-2">
              <article className="group flex h-full flex-col py-8 md:px-8 md:first:pl-0">
                <p className="label flex justify-between text-ink-soft">
                  <span>{a.categoria}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </p>
                <h3 className="font-display mt-10 text-[clamp(1.8rem,2.6vw,2.4rem)] !leading-[1.05]">{a.titulo}</h3>
                <p className="mt-5 flex-1 text-[1rem] text-ink-soft">{a.resumo}</p>
                <p className="label mt-8 flex items-center gap-3 text-ink-soft">
                  Leitura de {a.leitura}
                  <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
                </p>
              </article>
            </Rise>
          ))}
        </ul>
        {CONFIG.modelo && (
          <p className="mt-8 text-[0.875rem] text-ink-soft">Exemplo de como o site pode ter um blog com artigos do escritório.</p>
        )}
      </div>
    </section>
  );
}

/* ---------------- 05 Dúvidas ---------------- */

export function FAQ() {
  const [aberta, setAberta] = useState<number | null>(0);
  const base = useId();
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className={`${wrap} py-24 md:py-40`}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <SectionHead num="05" label="Dúvidas frequentes" id="duvidas-titulo">
              Perguntas que <em>sempre</em> chegam.
            </SectionHead>
          </div>
        </div>
        <ul className="border-t border-rule lg:col-span-7">
          {CONFIG.faq.map((f, i) => {
            const on = aberta === i;
            const id = `${base}-${i}`;
            return (
              <li key={f.pergunta} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={`${id}-b`}
                    aria-expanded={on}
                    aria-controls={`${id}-p`}
                    onClick={() => setAberta(on ? null : i)}
                    className="group flex min-h-12 w-full items-baseline gap-5 py-6 text-left"
                  >
                    <span className="label w-7 shrink-0 text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                    <span className="serif flex-1 text-[clamp(1.25rem,2.1vw,1.6rem)] leading-[1.25]">{f.pergunta}</span>
                    <span aria-hidden="true" className="relative size-4 shrink-0 self-center">
                      <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
                      <span
                        className="absolute top-1/2 left-0 h-px w-4 bg-current transition-transform duration-500"
                        style={{ transform: on ? "rotate(0deg)" : "rotate(90deg)" }}
                      />
                    </span>
                  </button>
                </h3>
                <div className="acc" data-open={on} id={`${id}-p`} role="region" aria-labelledby={`${id}-b`}>
                  <div>
                    <p className="max-w-2xl pb-8 pl-12 text-[1.05rem] text-ink-soft" inert={!on}>
                      {f.resposta}
                    </p>
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

/* ---------------- 06 Contato + pré-atendimento ---------------- */

function PreAtendimento() {
  const id = useId();
  const [nome, setNome] = useState("");
  const [area, setArea] = useState("");
  const [horario, setHorario] = useState("");
  const [msg, setMsg] = useState("");
  const [erros, setErros] = useState<{ nome?: string; area?: string }>({});
  const [enviado, setEnviado] = useState(false);
  const nomeRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLSelectElement>(null);

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: typeof erros = {};
    if (nome.trim().length < 2) e.nome = "Informe como podemos chamar você.";
    if (!area) e.area = "Escolha uma área de interesse.";
    setErros(e);
    if (e.nome) return nomeRef.current?.focus();
    if (e.area) return areaRef.current?.focus();

    const texto = [
      `Olá! Meu nome é ${nome.trim()}.`,
      `Área de interesse: ${area}.`,
      horario && `Melhor horário para contato: ${horario}.`,
      msg.trim() && `Mensagem: ${msg.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waPreAtendimento(texto), "_blank", "noopener,noreferrer");
    setEnviado(true);
  };

  const campo =
    "mt-2 block w-full min-h-12 rounded-none border-0 border-b border-[var(--ink-soft)] bg-transparent px-0 py-3 text-[1.05rem] text-ink placeholder:text-ink-soft/80 focus:border-ink focus:outline-none focus-visible:outline-none focus:shadow-[0_1px_0_0_var(--ink)]";

  return (
    <form onSubmit={enviar} noValidate aria-labelledby={`${id}-t`} className="border border-rule bg-paper p-6 md:p-10">
      <h3 id={`${id}-t`} className="font-display text-[2rem]">
        Pré-atendimento <em>por WhatsApp</em>
      </h3>
      <p className="mt-3 text-[0.98rem] text-ink-soft">
        Preencha, e a mensagem abre pronta no WhatsApp. Este site não envia nem guarda nada.
      </p>

      <div className="mt-8 grid gap-7">
        <div>
          <label htmlFor={`${id}-n`} className="label text-ink-soft">
            Nome
          </label>
          <input
            ref={nomeRef}
            id={`${id}-n`}
            name="nome"
            autoComplete="given-name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            aria-invalid={!!erros.nome}
            aria-describedby={erros.nome ? `${id}-ne` : undefined}
            className={campo}
          />
          {erros.nome && (
            <p id={`${id}-ne`} className="mt-2 text-[0.9rem] text-accent">
              {erros.nome}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${id}-a`} className="label text-ink-soft">
            Área de interesse
          </label>
          <select
            ref={areaRef}
            id={`${id}-a`}
            name="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-invalid={!!erros.area}
            aria-describedby={erros.area ? `${id}-ae` : undefined}
            className={`${campo} appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' fill='none' stroke='%23888' stroke-width='1.3'/></svg>")] bg-[right_0.25rem_center] bg-no-repeat pr-8`}
          >
            <option value="">Selecione</option>
            {CONFIG.areas.map((a) => (
              <option key={a.id}>{a.titulo}</option>
            ))}
            <option>Outro assunto</option>
          </select>
          {erros.area && (
            <p id={`${id}-ae`} className="mt-2 text-[0.9rem] text-accent">
              {erros.area}
            </p>
          )}
        </div>

        <fieldset>
          <legend className="label text-ink-soft">Melhor horário</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Manhã", "Tarde", "Fim do dia"].map((h) => (
              <label
                key={h}
                className={`inline-flex min-h-12 cursor-pointer items-center rounded-full border px-5 text-[0.95rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                  horario === h ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name="horario"
                  value={h}
                  checked={horario === h}
                  onChange={() => setHorario(h)}
                  className="sr-only"
                />
                {h}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor={`${id}-m`} className="label text-ink-soft">
              Mensagem curta <span className="normal-case tracking-normal">(opcional)</span>
            </label>
            <span className="label text-ink-soft" aria-live="polite">
              {msg.length}/{LIMITE_MENSAGEM}
            </span>
          </div>
          <textarea
            id={`${id}-m`}
            name="mensagem"
            rows={3}
            maxLength={LIMITE_MENSAGEM}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            aria-describedby={`${id}-aviso`}
            placeholder="Em poucas palavras, sobre o que você quer conversar"
            className={`${campo} resize-none`}
          />
        </div>

        <p id={`${id}-aviso`} className="flex gap-3 border-l-2 border-accent bg-paper-2 px-4 py-3 text-[0.95rem]">
          Não envie documentos nem dados sensíveis por aqui. Detalhes do caso só no atendimento.
        </p>

        <button type="submit" className="btn btn-solid w-full sm:w-auto sm:justify-self-start">
          <ChatIcon /> Abrir no WhatsApp
          <span className="sr-only"> (abre em nova aba)</span>
        </button>

        <p role="status" className="text-[0.95rem] text-ink-soft empty:hidden">
          {enviado &&
            "A mensagem foi montada e o WhatsApp abriu em outra aba. Se não abriu, verifique se o navegador bloqueou a janela."}
        </p>
        {CONFIG.modelo && (
          <p className="text-[0.85rem] text-ink-soft">
            No modelo, a mensagem é enviada para o WhatsApp da Lumivo Web, para você ver o fluxo funcionando.
          </p>
        )}
      </div>
    </form>
  );
}

export function Contact() {
  const e = CONFIG.escritorio;
  const linhas: [string, React.ReactNode][] = [
    ["Endereço", <>{e.endereco}<br />{e.cidade} · CEP {e.cep}</>],
    [
      "Horários",
      <>
        {e.horarios.map((h) => (
          <span key={h.dias} className="block">
            {h.dias}: {h.horas}
          </span>
        ))}
      </>,
    ],
    ["Telefone", CONFIG.modelo ? e.telefone : <a className="link-draw" href={`tel:+${e.whatsapp}`}>{e.telefone}</a>],
    ["E-mail", CONFIG.modelo ? e.email : <a className="link-draw" href={`mailto:${e.email}`}>{e.email}</a>],
    ["Inscrição", e.oab],
  ];
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="border-t border-rule">
      <div className={`${wrap} py-24 md:py-40`}>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHead num="06" label="Contato" id="contato-titulo">
              Fale com o <em>escritório</em>.
            </SectionHead>
            <dl className="mt-12 divide-y divide-rule border-y border-rule">
              {linhas.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 py-5">
                  <dt className="label pt-1 text-ink-soft">{k}</dt>
                  <dd className="text-[1.05rem]">{v}</dd>
                </div>
              ))}
            </dl>
            {CONFIG.modelo && <p className="mt-4 text-[0.875rem] text-ink-soft">Endereço, telefone e e-mail ilustrativos.</p>}
            <MagneticLink href={waEscritorio()} external icon="chat" className="mt-10 !min-h-16 w-full !text-[1.05rem] sm:w-auto">
              Falar pelo WhatsApp
            </MagneticLink>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Rise>
              <PreAtendimento />
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA final (tinta) ---------------- */

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.35"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const ring = useTransform(p, [0.9, 1], [0, 1]);

  return (
    <section aria-labelledby="cta-titulo" className="on-dark">
      <div className={`${wrap} pt-28 pb-24 text-center md:pt-44 md:pb-32`}>
        <p className="label text-[var(--on-dark-soft)]">O próximo passo</p>
        <TextReveal as="h2" className="font-display mx-auto mt-8 max-w-[14ch] text-[clamp(3.2rem,11vw,9.5rem)]" id="cta-titulo">
          Conversar é o <em>primeiro</em> passo.
        </TextReveal>
        <div ref={ref} className="mt-12 flex flex-col items-center">
          <svg aria-hidden="true" width="24" height="112" viewBox="0 0 24 112" fill="none" className="overflow-visible">
            <path d="M12 0V92" stroke="var(--on-dark-rule)" />
            <m.path d="M12 0V92" stroke="var(--accent-on-dark)" strokeWidth="1.25" style={{ pathLength: reduced ? 1 : p }} />
            <circle cx="12" cy="101" r="9" stroke="var(--on-dark-rule)" />
            <m.circle
              cx="12"
              cy="101"
              r="9"
              stroke="var(--accent-on-dark)"
              strokeWidth="1.25"
              style={{ opacity: reduced ? 1 : ring, scale: reduced ? 1 : ring }}
            />
            <m.circle cx="12" cy="101" r="2.5" fill="var(--accent-on-dark)" style={{ opacity: reduced ? 1 : ring }} />
          </svg>
          <MagneticLink href={waEscritorio()} external icon="chat" className="mt-8 !min-h-16 !px-8 !text-[1.05rem]">
            Falar pelo WhatsApp
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Rodapé ---------------- */

export function Footer() {
  const e = CONFIG.escritorio;
  return (
    <footer className="on-dark">
      <div className={`${wrap} border-t border-[var(--on-dark-rule)] pt-14 pb-28`}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="flex items-start gap-4 md:col-span-4">
            <Monogram />
            <div>
              <p className="serif text-[1.25rem]">{e.nome}</p>
              <p className="mt-1 text-[0.95rem] text-[var(--on-dark-soft)]">{e.oab}</p>
            </div>
          </div>
          <div className="text-[0.95rem] text-[var(--on-dark-soft)] md:col-span-4">
            <p>{e.endereco}</p>
            <p>{e.cidade}</p>
            <p className="mt-3">
              {e.telefone} · {e.email}
            </p>
          </div>
          <nav aria-label="Rodapé" className="md:col-span-4 md:text-right">
            <ul className="space-y-2 text-[0.95rem]">
              <li>
                <a className="link-draw inline-flex min-h-12 items-center md:min-h-0" href="/privacidade.html">
                  Política de privacidade
                </a>
              </li>
              <li>
                <a className="link-draw inline-flex min-h-12 items-center md:min-h-0" href="#inicio">
                  Voltar ao início
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="label mt-14 flex flex-col gap-3 border-t border-[var(--on-dark-rule)] pt-6 text-[0.68rem] text-[var(--on-dark-soft)] md:flex-row md:justify-between">
          <p>Conteúdo informativo, sem caráter de captação de clientela.</p>
          {CONFIG.modelo && <p>Modelo demonstrativo criado pela Lumivo Web</p>}
        </div>
      </div>
    </footer>
  );
}
