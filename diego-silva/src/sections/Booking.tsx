import { useId, useRef, useState, type FormEvent } from "react";
import { AREAS } from "../config";
import { SectionHead } from "../components/SectionHead";
import { Reveal } from "../components/Reveal";
import { Arrow } from "../components/Magnetic";
import { waLink } from "../lib/whatsapp";
import { getLenis } from "../lib/lenisStore";

const ASSUNTOS = [...AREAS.map((a) => a.titulo), "Ainda não sei, quero conversar"];
const PERIODOS = ["Manhã (09h às 12h)", "Tarde (12h às 18h)", "A combinar"];
const MAX = 300;

export function montarMensagem(d: { nome: string; assunto: string; periodo: string; mensagem: string }) {
  const linhas = [
    "Olá! Vim pelo site e gostaria de falar sobre um atendimento.",
    `Nome: ${d.nome.trim()}`,
    `Assunto: ${d.assunto}`,
    `Melhor período: ${d.periodo}`,
  ];
  if (d.mensagem.trim()) linhas.push(`Mensagem: ${d.mensagem.trim()}`);
  return linhas.join("\n");
}

type Erros = Partial<Record<"nome" | "assunto", string>>;

export function Booking({ num }: { num: string }) {
  const uid = useId();
  const [nome, setNome] = useState("");
  const [assunto, setAssunto] = useState("");
  const [periodo, setPeriodo] = useState(PERIODOS[2]);
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const assuntoRef = useRef<HTMLSelectElement>(null);
  const okRef = useRef<HTMLDivElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Erros = {};
    if (nome.trim().length < 2) er.nome = "Informe seu nome.";
    if (!assunto) er.assunto = "Escolha um assunto. Se não souber, selecione “Ainda não sei”.";
    setErros(er);
    if (er.nome) return nomeRef.current?.focus();
    if (er.assunto) return assuntoRef.current?.focus();
    const url = waLink(montarMensagem({ nome, assunto, periodo, mensagem }));
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(url);
    requestAnimationFrame(() => {
      const el = okRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset: -140 });
      else el.scrollIntoView({ block: "center" });
    });
  };

  const field =
    "mt-2 block w-full rounded-none border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-[1.0625rem] text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-wine focus-visible:outline-none aria-[invalid=true]:border-wine";
  const id = (s: string) => `${uid}-${s}`;

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="py-28 md:py-40">
      <div className="wrap">
        <SectionHead num={num} label="Pré-atendimento" />
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 id="agendar-titulo" className="text-[clamp(2.4rem,5.2vw,4.4rem)]">
                Adiante a conversa pelo <em>WhatsApp</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md text-ink-soft">
                Preencha os campos e o WhatsApp abre com a mensagem pronta. Você revisa, envia, e o escritório responde por lá.
              </p>
              <p className="mt-8 max-w-md border-l-2 border-wine pl-5 text-[0.98rem]">
                Não envie documentos nem dados sensíveis por aqui. Detalhes do caso só no atendimento.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <div className="border border-ink/15 bg-paper-2/60 p-6 sm:p-9 md:p-11">
                {enviado ? (
                  <div ref={okRef} tabIndex={-1} role="status" className="outline-none">
                    <p className="eyebrow text-wine">Mensagem pronta</p>
                    <p className="mt-4 font-serif text-[2rem] leading-[1.1]">Pronto! Abrimos o WhatsApp com sua mensagem.</p>
                    <p className="mt-4 text-ink-soft">É só enviar. O escritório retorna assim que possível.</p>
                    <p className="mt-6 text-sm text-ink-soft">Se o WhatsApp não abriu, use o botão abaixo.</p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={enviado}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-wine px-6 font-medium text-paper hover:bg-wine-deep"
                      >
                        Abrir WhatsApp <Arrow />
                      </a>
                      <button
                        type="button"
                        onClick={() => setEnviado(null)}
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/25 px-6 font-medium hover:border-ink"
                      >
                        Editar mensagem
                      </button>
                    </div>
                  </div>
                ) : (
                  <form noValidate onSubmit={submit} aria-describedby={id("aviso")}>
                    <div>
                      <label htmlFor={id("nome")} className="eyebrow text-ink-soft">
                        Nome <span aria-hidden className="text-wine">*</span>
                        <span className="sr-only">(obrigatório)</span>
                      </label>
                      <input
                        ref={nomeRef}
                        id={id("nome")}
                        name="nome"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={80}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        aria-invalid={!!erros.nome}
                        aria-describedby={erros.nome ? id("nome-erro") : undefined}
                        className={field}
                      />
                      {erros.nome ? (
                        <p id={id("nome-erro")} className="mt-2 text-sm text-wine">
                          {erros.nome}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-8">
                      <label htmlFor={id("assunto")} className="eyebrow text-ink-soft">
                        Assunto <span aria-hidden className="text-wine">*</span>
                        <span className="sr-only">(obrigatório)</span>
                      </label>
                      <select
                        ref={assuntoRef}
                        id={id("assunto")}
                        name="assunto"
                        required
                        value={assunto}
                        onChange={(e) => setAssunto(e.target.value)}
                        aria-invalid={!!erros.assunto}
                        aria-describedby={erros.assunto ? id("assunto-erro") : undefined}
                        className={`${field} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%236e1f24%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px_8px] bg-[right_4px_center] bg-no-repeat pr-8`}
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        {ASSUNTOS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      {erros.assunto ? (
                        <p id={id("assunto-erro")} className="mt-2 text-sm text-wine">
                          {erros.assunto}
                        </p>
                      ) : null}
                    </div>

                    <fieldset className="mt-8">
                      <legend className="eyebrow text-ink-soft">Melhor período</legend>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {PERIODOS.map((p) => (
                          <label
                            key={p}
                            className="relative inline-flex min-h-12 cursor-pointer items-center rounded-full border border-ink/25 px-4 text-[0.95rem] transition-colors has-[:checked]:border-wine has-[:checked]:bg-wine has-[:checked]:text-paper has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-wine"
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
                      <p className="mt-3 text-sm text-ink-soft">Atendimento de segunda a sexta.</p>
                    </fieldset>

                    <div className="mt-8">
                      <div className="flex items-baseline justify-between">
                        <label htmlFor={id("msg")} className="eyebrow text-ink-soft">
                          Mensagem curta <span className="normal-case tracking-normal">(opcional)</span>
                        </label>
                        <span id={id("msg-cont")} className="text-xs tabular-nums text-ink-soft" aria-live="polite">
                          {mensagem.length}/{MAX}
                        </span>
                      </div>
                      <textarea
                        id={id("msg")}
                        name="mensagem"
                        rows={3}
                        maxLength={MAX}
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        aria-describedby={id("msg-cont")}
                        placeholder="Em poucas palavras, sobre o que você quer conversar."
                        className={`${field} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="group mt-10 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-wine px-7 text-[1.0625rem] font-medium text-paper transition-colors hover:bg-wine-deep sm:w-auto"
                    >
                      Abrir conversa no WhatsApp <Arrow />
                    </button>

                    <p id={id("aviso")} className="mt-6 text-sm leading-relaxed text-ink-soft">
                      Ao enviar, você abre uma conversa no WhatsApp com o escritório. Este site não guarda os dados digitados.{" "}
                      <a href="/privacidade.html" className="ulink ulink-static text-ink">
                        Entenda a privacidade
                      </a>
                      .
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
