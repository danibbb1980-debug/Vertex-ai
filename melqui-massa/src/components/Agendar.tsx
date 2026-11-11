import { useId, useMemo, useRef, useState } from "react";
import { CONFIG } from "../config";
import { blocosDoDia, ehFeriado, formatDataBR, hojeISO, horarioDoDia, parseISODate } from "../lib";
import { Conversa } from "./Icons";
import { Enfase, Rotulo, WRAP } from "./ui";

type Erros = Partial<Record<"nome" | "atendimento" | "data", string>>;

export function Agendar() {
  const uid = useId().replace(/:/g, "");
  const f = (n: string) => `${uid}-${n}`;

  const opcoesAtendimento = useMemo(
    () => [
      ...CONFIG.atendimentos.filter((a) => a.rotuloFormulario).map((a) => a.rotuloFormulario),
      ...CONFIG.agendamento.opcoesExtras,
    ],
    [],
  );

  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"form" | "enviando" | "ok" | "bloqueado">("form");
  const [url, setUrl] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);
  const atendRef = useRef<HTMLSelectElement>(null);

  const dataObj = data ? parseISODate(data) : null;
  const diaAberto = dataObj ? !!horarioDoDia(dataObj.getDay()) : false;
  const blocos = dataObj && diaAberto ? blocosDoDia(dataObj.getDay()) : [];
  const feriado = dataObj && diaAberto ? ehFeriado(dataObj) : false;
  const max = CONFIG.agendamento.maxObservacoes;

  function validarData(v: string): string | undefined {
    if (!v) return undefined;
    const d = parseISODate(v);
    if (!d) return "Informe uma data válida.";
    if (v < hojeISO()) return "Escolha uma data a partir de hoje.";
    if (!horarioDoDia(d.getDay())) return "Dia sem atendimento, escolha outra data.";
    return undefined;
  }

  function onData(v: string) {
    setData(v);
    setHora("");
    setErros((e) => ({ ...e, data: validarData(v) }));
  }

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome completo.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha o atendimento desejado.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    return e;
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) {
      if (e.nome) nomeRef.current?.focus();
      else if (e.atendimento) atendRef.current?.focus();
      else if (e.data) dataRef.current?.focus();
      return;
    }
    setEstado("enviando");
    const linhas = [
      `Olá, ${CONFIG.nomeCurto}! Vim pelo site e gostaria de solicitar um agendamento.`,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Modalidade: ${modalidade ? modalidade.charAt(0).toLowerCase() + modalidade.slice(1) : "a combinar"}`,
      `Data preferida: ${data ? formatDataBR(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ];
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(linhas.join("\n"))}`;
    setUrl(link);
    // abre em nova aba sem dar acesso a esta página (equivalente a noopener)
    const w = window.open("", "_blank");
    if (w) {
      w.opener = null;
      w.location.href = link;
      setEstado("ok");
    } else {
      setEstado("bloqueado");
    }
    window.setTimeout(() => statusRef.current?.focus(), 50);
  }

  function novo() {
    setEstado("form");
    setUrl("");
    window.setTimeout(() => nomeRef.current?.focus(), 50);
  }

  const err = (k: keyof Erros) =>
    erros[k] ? (
      <p id={f(`${k}-erro`)} className="mt-2 flex items-start gap-2 font-display text-[0.95rem] text-alert">
        <span aria-hidden="true" className="mt-[0.45em] block h-[6px] w-[6px] shrink-0 rotate-45 bg-alert" />
        {erros[k]}
      </p>
    ) : null;

  const labelCls = "block font-display text-[1rem] font-medium text-ink";
  const opcional = <span className="font-normal text-stone"> (opcional)</span>;

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="py-24 md:py-32">
      <div className={WRAP}>
        <Rotulo>Solicitar agendamento</Rotulo>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="label text-stone">Praticidade</p>
            <h2
              id="agendar-titulo"
              className="mt-4 !font-serif text-[clamp(2.4rem,5.2vw,4rem)] !font-normal leading-[1.02] !tracking-[-0.02em]"
            >
              <Enfase text="Peça seu horário em poucos *cliques*." className="italic text-emerald" />
            </h2>
            <p className="mt-6 max-w-[28rem] text-graphite">
              Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a
              equipe confirma a disponibilidade.
            </p>
            <p className="mt-4 max-w-[28rem] text-graphite">
              Os horários escolhidos aqui são preferências. A consulta só fica marcada depois da confirmação da clínica.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="chamfer ol p-6 [--chamfer:22px] sm:p-8 md:p-10">
              <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
                {(estado === "ok" || estado === "bloqueado") && (
                  <div>
                    {estado === "ok" ? (
                      <>
                        <p className="label text-emerald-deep">Solicitação pronta</p>
                        <p className="mt-4 text-[1.35rem] leading-snug text-ink">
                          Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a
                          disponibilidade.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="label text-emerald-deep">Falta um passo</p>
                        <p className="mt-4 text-[1.35rem] leading-snug text-ink">
                          O navegador não abriu a nova aba. Toque no botão abaixo para abrir o WhatsApp com a sua
                          solicitação.
                        </p>
                      </>
                    )}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary chamfer">
                        <Conversa /> Abrir WhatsApp
                      </a>
                      <button type="button" onClick={novo} className="btn btn-ghost ol chamfer">
                        Editar a solicitação
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {(estado === "form" || estado === "enviando") && (
                <form noValidate onSubmit={enviar} aria-describedby={f("privacidade")} className="space-y-7">
                  <p className="text-[0.95rem] text-stone">
                    Só o nome é obrigatório. O restante ajuda a equipe a encontrar um horário.
                  </p>

                  <div>
                    <label htmlFor={f("nome")} className={labelCls}>
                      Nome completo
                    </label>
                    <input
                      ref={nomeRef}
                      id={f("nome")}
                      name="nome"
                      type="text"
                      autoComplete="name"
                      required
                      aria-required="true"
                      placeholder="Como devemos te chamar?"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                      }}
                      onBlur={() =>
                        nome && setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? "Informe seu nome completo." : undefined }))
                      }
                      aria-invalid={!!erros.nome}
                      aria-describedby={erros.nome ? f("nome-erro") : undefined}
                      className="field mt-2"
                    />
                    {err("nome")}
                  </div>

                  <div className="grid gap-7 md:grid-cols-2 md:gap-5">
                    <div>
                      <label htmlFor={f("atendimento")} className={labelCls}>
                        Atendimento desejado{!CONFIG.agendamento.exigirAtendimento && opcional}
                      </label>
                      <select
                        ref={atendRef}
                        id={f("atendimento")}
                        name="atendimento"
                        value={atendimento}
                        onChange={(e) => {
                          setAtendimento(e.target.value);
                          setErros((x) => ({ ...x, atendimento: undefined }));
                        }}
                        aria-invalid={!!erros.atendimento}
                        aria-describedby={erros.atendimento ? f("atendimento-erro") : undefined}
                        className="field mt-2"
                      >
                        <option value="">Escolha o atendimento</option>
                        {opcoesAtendimento.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      {err("atendimento")}
                    </div>

                    <div>
                      <label htmlFor={f("modalidade")} className={labelCls}>
                        Modalidade{opcional}
                      </label>
                      <select
                        id={f("modalidade")}
                        name="modalidade"
                        value={modalidade}
                        onChange={(e) => setModalidade(e.target.value)}
                        className="field mt-2"
                      >
                        <option value="">Escolha a modalidade</option>
                        {CONFIG.agendamento.modalidades.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-7 md:grid-cols-2 md:gap-5">
                    <div>
                      <label htmlFor={f("data")} className={labelCls}>
                        Data preferida{opcional}
                      </label>
                      <input
                        ref={dataRef}
                        id={f("data")}
                        name="data"
                        type="date"
                        min={hojeISO()}
                        value={data}
                        onChange={(e) => onData(e.target.value)}
                        aria-invalid={!!erros.data}
                        aria-describedby={[f("data-dica"), erros.data ? f("data-erro") : ""].filter(Boolean).join(" ")}
                        className="field mt-2"
                      />
                      <p id={f("data-dica")} className="mt-2 text-[0.9rem] leading-snug text-stone">
                        Atendimento de segunda a sexta.
                        {feriado && <> {CONFIG.avisoHorarios}</>}
                      </p>
                      {err("data")}
                    </div>

                    <div>
                      <label htmlFor={f("hora")} className={labelCls}>
                        Horário preferido{opcional}
                      </label>
                      <select
                        id={f("hora")}
                        name="hora"
                        value={hora}
                        disabled={!blocos.length}
                        onChange={(e) => setHora(e.target.value)}
                        aria-describedby={f("hora-dica")}
                        className="field mt-2"
                      >
                        <option value="">Escolha um horário</option>
                        {blocos.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <p id={f("hora-dica")} className="mt-2 text-[0.9rem] leading-snug text-stone">
                        {blocos.length ? "Horários de início, sujeitos à confirmação." : "Escolha uma data para ver os horários."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={f("obs")} className={labelCls}>
                      Observações{opcional}
                    </label>
                    <textarea
                      id={f("obs")}
                      name="observacoes"
                      maxLength={max}
                      rows={3}
                      placeholder="Se quiser, conte o que você precisa."
                      value={obs}
                      onChange={(e) => setObs(e.target.value.slice(0, max))}
                      aria-describedby={`${f("obs-aviso")} ${f("obs-cont")}`}
                      className="field mt-2"
                    />
                    <div className="mt-2 flex items-start justify-between gap-4 text-[0.9rem] leading-snug text-stone">
                      <p id={f("obs-aviso")}>
                        Não é preciso contar o motivo da consulta aqui. Conversamos com calma pelo WhatsApp.
                      </p>
                      <p id={f("obs-cont")} className="shrink-0 font-display [font-variant-numeric:tabular-nums]">
                        <span aria-hidden="true">
                          {obs.length}/{max}
                        </span>
                        <span className="sr-only">
                          {obs.length} de {max} caracteres
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-rule pt-7">
                    <button
                      type="submit"
                      disabled={estado === "enviando"}
                      aria-busy={estado === "enviando"}
                      className="btn btn-primary chamfer w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                    >
                      <Conversa />
                      {estado === "enviando" ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}
                    </button>
                    <span data-fio="h" aria-hidden="true" className="relative -top-[1.85rem] -left-px hidden h-px w-px lg:block" />
                    <p id={f("privacidade")} className="mt-1 text-[0.92rem] leading-snug text-stone">
                      Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados
                      digitados.{" "}
                      <a href="/privacidade.html" className="link">
                        Saiba como funciona a privacidade
                      </a>
                      .
                    </p>
                  </div>
                </form>
              )}
            </div>
            <p className="mt-5 font-display text-[0.92rem] text-stone">
              Em situação de crise ou risco de vida, ligue{" "}
              <a className="link" href="tel:188">
                188 (CVV)
              </a>{" "}
              ou{" "}
              <a className="link" href="tel:192">
                192 (SAMU)
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
