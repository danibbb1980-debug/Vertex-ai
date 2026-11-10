import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG, waLink } from "../config";
import { IconCalendar, IconCheck, IconWhatsApp } from "../components/Icons";
import { Reveal } from "../components/Reveal";
import { horarioDoDia, resumoHorarios, slotsDoDia } from "../lib/horarios";

const pad = (n: number) => String(n).padStart(2, "0");
const isoLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmtBr = (s: string) => s.split("-").reverse().join("/");

type Erros = Partial<Record<"nome" | "atendimento" | "data", string>>;

export function Agendar() {
  const opcoes = useMemo(
    () => [...CONFIG.atendimentos.map((a) => (a.id === "hipertrofia" ? `${a.titulo} (ganho de massa muscular)` : a.titulo)), "Primeira consulta", "Ainda não sei, quero conversar"],
    [],
  );
  // data de hoje só no navegador (o HTML é pré-renderizado no build)
  const [hoje, setHoje] = useState("");
  useEffect(() => setHoje(isoLocal(new Date())), []);
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"form" | "abrindo" | "ok">("form");
  const [bloqueado, setBloqueado] = useState(false);
  const [url, setUrl] = useState("");
  const [aviso, setAviso] = useState("");
  const okRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const limite = CONFIG.agendamento.limiteObservacoes;

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Data inválida. Use o formato dd/mm/aaaa.";
    if (hoje && v < hoje) return "Escolha uma data a partir de hoje.";
    if (!horarioDoDia(parseIso(v).getDay())) return "Dia sem atendimento, escolha outra data";
    return undefined;
  };

  const slots = useMemo(() => {
    const now = new Date();
    if (data && !validarData(data)) {
      const d = parseIso(data);
      return slotsDoDia(d.getDay(), data === hoje ? now.getHours() * 60 + now.getMinutes() : undefined);
    }
    const primeiro = CONFIG.horarios[0];
    return primeiro ? slotsDoDia(primeiro.dia) : [];
  }, [data, hoje]);

  const dataInvalida = !!(data && validarData(data));

  const onData = (v: string) => {
    setData(v);
    const e = validarData(v);
    setErros((p) => ({ ...p, data: e }));
    if (hora && !e) {
      const d = parseIso(v);
      if (!slotsDoDia(d.getDay()).includes(hora)) setHora("");
    }
    if (e) setHora("");
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome completo.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha o atendimento desejado.";
    const de = validarData(data);
    if (de) e.data = de;
    setErros(e);
    const campos = Object.keys(e) as (keyof Erros)[];
    if (campos.length) {
      setAviso(`Revise ${campos.length === 1 ? "1 campo" : `${campos.length} campos`} destacado${campos.length === 1 ? "" : "s"}.`);
      const first = formRef.current?.querySelector<HTMLElement>(`[name="${campos[0]}"]`);
      first?.focus();
      return;
    }
    setAviso("");
    const msg = [
      CONFIG.agendamento.mensagemInicial,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Data preferida: ${data ? fmtBr(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const link = waLink(msg);
    setUrl(link);
    setEstado("abrindo");
    const w = window.open(link, "_blank");
    if (w) {
      try { w.opener = null; } catch { /* ignore */ }
    }
    setBloqueado(!w);
    window.setTimeout(() => {
      setEstado("ok");
      requestAnimationFrame(() => okRef.current?.focus());
    }, 450);
  };

  const novo = () => {
    setEstado("form");
    setNome(""); setAtendimento(""); setData(""); setHora(""); setObs(""); setErros({}); setUrl("");
  };

  const horarios = resumoHorarios();
  const diasAtende = horarios.filter((h) => h.horas !== "Fechado").map((h) => `${h.dias.toLowerCase()}, das ${h.horas}`).join("; ");

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative bg-nevoa/70 py-20 sm:py-28">
      <span data-arc="4" data-arc-x="left" className="absolute top-16 block h-px w-px" />
      <div className="container-site relative z-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="lg:pt-6">
          <p className="rotulo">Praticidade</p>
          <h2 id="titulo-agendar" className="mt-3 text-[2.4rem] font-semibold sm:text-5xl">
            Peça seu horário em poucos <span className="enfase">cliques</span>.
          </h2>
          <p className="mt-4 text-lg text-cinza">
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade.
          </p>
          <ul className="mt-8 space-y-4 text-[1rem]">
            <li className="flex gap-3">
              <IconCalendar width={22} height={22} className="mt-0.5 shrink-0 text-agua-600" />
              <span>Atendimento de {diasAtende}.</span>
            </li>
            <li className="flex gap-3">
              <IconCheck width={22} height={22} className="mt-0.5 shrink-0 text-agua-600" />
              <span>Data e horário são preferências: a clínica confirma a disponibilidade pelo WhatsApp.</span>
            </li>
            <li className="flex gap-3">
              <IconCheck width={22} height={22} className="mt-0.5 shrink-0 text-agua-600" />
              <span>Nada fica guardado neste site.</span>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card relative p-6 sm:p-9">
            {estado === "ok" ? (
              <div className="py-4 text-center sm:py-8">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-agua-300/40 text-agua-700">
                  <IconCheck width={30} height={30} />
                </span>
                <h3 ref={okRef} tabIndex={-1} className="mt-5 text-[2rem] font-semibold outline-none">
                  {bloqueado ? "Quase lá!" : "Pronto!"}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-cinza" role="status">
                  {bloqueado
                    ? "O navegador bloqueou a nova aba. Toque no botão abaixo para abrir o WhatsApp com a sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade."
                    : "Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade."}
                </p>
                <div className="mt-7 flex flex-col items-center gap-3">
                  <a href={url} target="_blank" rel="noopener noreferrer" className={`btn ${bloqueado ? "btn-primario" : "btn-secundario"}`}>
                    <IconWhatsApp width={20} height={20} /> Abrir WhatsApp
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                  <button type="button" onClick={novo} className="link-sub min-h-12 text-[0.95rem] text-petroleo-800">
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submit} noValidate aria-describedby="form-nota">
                <div aria-live="assertive" className="sr-only">{aviso}</div>
                <div className="space-y-5">
                  <Field id="f-nome" label="Nome completo" obrigatorio erro={erros.nome}>
                    <input
                      id="f-nome" name="nome" type="text" autoComplete="name" className="campo"
                      placeholder="Como devemos te chamar?" value={nome} required maxLength={80}
                      aria-invalid={!!erros.nome} aria-describedby={erros.nome ? "f-nome-erro" : undefined}
                      onChange={(e) => { setNome(e.target.value); if (erros.nome && e.target.value.trim().length >= 2) setErros((p) => ({ ...p, nome: undefined })); }}
                      onBlur={() => nome && nome.trim().length < 2 && setErros((p) => ({ ...p, nome: "Informe seu nome completo." }))}
                    />
                  </Field>

                  <Field id="f-atendimento" label="Atendimento desejado" obrigatorio={CONFIG.agendamento.exigirAtendimento} erro={erros.atendimento}>
                    <select
                      id="f-atendimento" name="atendimento" className="campo appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23255e6c%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-11"
                      value={atendimento} onChange={(e) => { setAtendimento(e.target.value); setErros((p) => ({ ...p, atendimento: undefined })); }}
                      aria-invalid={!!erros.atendimento} aria-describedby={erros.atendimento ? "f-atendimento-erro" : undefined}
                      required={CONFIG.agendamento.exigirAtendimento}
                    >
                      <option value="">{CONFIG.agendamento.exigirAtendimento ? "Escolha o atendimento" : "Escolha (opcional)"}</option>
                      {opcoes.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="f-data" label="Data preferida" erro={erros.data} ajuda={!erros.data ? "Segunda a sexta. Opcional." : undefined}>
                      <input
                        id="f-data" name="data" type="date" className="campo" min={hoje || undefined} value={data}
                        onChange={(e) => onData(e.target.value)}
                        aria-invalid={!!erros.data}
                        aria-describedby={erros.data ? "f-data-erro" : "f-data-ajuda"}
                      />
                    </Field>
                    <Field id="f-hora" label="Horário preferido" ajuda={dataInvalida ? "Escolha primeiro um dia com atendimento." : slots.length === 0 ? "Sem horários para esta data. Escolha outro dia." : "Opcional."}>
                      <select
                        id="f-hora" name="hora" className="campo appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23255e6c%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-11 disabled:cursor-not-allowed disabled:bg-nevoa disabled:text-cinza"
                        value={hora} onChange={(e) => setHora(e.target.value)} disabled={dataInvalida || slots.length === 0}
                        aria-describedby="f-hora-ajuda"
                      >
                        <option value="">Escolha um horário</option>
                        {slots.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field id="f-obs" label="Observações" ajuda="Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.">
                    <textarea
                      id="f-obs" name="obs" rows={3} maxLength={limite} className="campo min-h-24 resize-y"
                      placeholder="Se quiser, conte o que você precisa." value={obs} onChange={(e) => setObs(e.target.value)}
                      aria-describedby="f-obs-ajuda f-obs-cont"
                    />
                    <p id="f-obs-cont" className="mt-1 text-right text-xs text-cinza" aria-live="polite">
                      {obs.length}/{limite}
                    </p>
                  </Field>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button type="submit" disabled={estado === "abrindo"} className="btn btn-primario w-full !px-4 text-[0.95rem] sm:flex-1 sm:text-[1rem] disabled:opacity-80">
                    {estado === "abrindo" ? (
                      <>
                        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Abrindo o WhatsApp…
                      </>
                    ) : (
                      <>
                        <IconWhatsApp width={20} height={20} /> Enviar solicitação pelo WhatsApp
                      </>
                    )}
                  </button>
                  {CONFIG.telefone && (
                    <a href={`tel:+${CONFIG.telefone}`} className="btn btn-secundario">Ligar</a>
                  )}
                </div>
                <p id="form-nota" className="mt-4 text-sm text-cinza">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados. Data e horário são preferências sujeitas à confirmação da clínica.{" "}
                  <a href="/privacidade.html" className="link-sub text-petroleo-800">Política de privacidade</a>.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ id, label, obrigatorio, erro, ajuda, children }: { id: string; label: string; obrigatorio?: boolean; erro?: string; ajuda?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-semibold text-petroleo-900">
        {label}
        {obrigatorio && <span className="text-erro" aria-hidden="true"> *</span>}
        {obrigatorio && <span className="sr-only"> (obrigatório)</span>}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-erro">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.01" /></svg>
          {erro}
        </p>
      ) : ajuda ? (
        <p id={`${id}-ajuda`} className="mt-1.5 text-sm text-cinza">{ajuda}</p>
      ) : null}
    </div>
  );
}
