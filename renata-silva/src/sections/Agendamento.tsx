import { useId, useMemo, useState, type FormEvent } from "react";
import { m } from "motion/react";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { CONFIG } from "../config";
import { RevealTitle } from "../components/Reveal";
import { WhatsAppIcon } from "../components/icons";
import { atendimentosVisiveis, FRENTES } from "./Atendimentos";
import { dataBR, horarioDoDia, horariosDisponiveis, hojeISO, parseISODate, resumoDias } from "../lib/horarios";
import { waLink } from "../lib/whatsapp";
import { EASE, useClient, useReduced } from "../lib/motion";

const PRIMEIRA = "Primeira avaliação";
const NAO_SEI = "Ainda não sei, quero conversar";

type Erros = Partial<Record<"nome" | "atendimento" | "data" | "horario" | "obs", string>>;

/** Monta a mensagem. Nada é guardado nem enviado a servidor: só abre o WhatsApp. */
export function montarMensagem(v: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  return [
    CONFIG.mensagens.agendamentoAbertura,
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${v.atendimento || "a definir"}`,
    `Data preferida: ${v.data ? dataBR(v.data) : "a combinar"}`,
    `Horário preferido: ${v.horario || "a combinar"}`,
    `Observações: ${v.obs.trim() || "-"}`,
  ].join("\n");
}

function validarData(iso: string): string | undefined {
  if (!iso) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "Informe uma data válida.";
  if (iso < hojeISO()) return "Escolha uma data a partir de hoje.";
  if (!horarioDoDia(parseISODate(iso).getDay())) return "Dia sem atendimento, escolha outra data";
  if (!horariosDisponiveis(iso).length) return "Não há mais horários neste dia, escolha outra data";
  return undefined;
}

export function Agendamento() {
  const uid = useId();
  const reduce = useReduced();
  const ag = CONFIG.agendamento;
  const lista = atendimentosVisiveis();

  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"idle" | "abrindo" | "pronto">("idle");
  const [bloqueado, setBloqueado] = useState(false);
  const [url, setUrl] = useState("");

  const horarios = useMemo(() => (data && !validarData(data) ? horariosDisponiveis(data) : []), [data]);
  const dias = resumoDias();
  const minData = useClient(hojeISO, "");

  if (!CONFIG.secoes.agendamento) return null;

  const ids = {
    nome: `${uid}-nome`,
    atendimento: `${uid}-atendimento`,
    data: `${uid}-data`,
    horario: `${uid}-horario`,
    obs: `${uid}-obs`,
  };
  const err = (k: keyof Erros) => (erros[k] ? `${ids[k]}-erro` : undefined);

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome para a clínica saber com quem está falando.";
    if (ag.exigirAtendimento && !atendimento) e.atendimento = "Escolha um atendimento ou uma das opções de conversa.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horario && !horarios.includes(horario)) e.horario = "Escolha um horário da lista.";
    if (obs.length > ag.limiteObservacoes) e.obs = `Use no máximo ${ag.limiteObservacoes} caracteres.`;
    return e;
  };

  const onData = (v: string) => {
    setData(v);
    setHorario("");
    setErros((x) => ({ ...x, data: validarData(v) }));
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (Object.keys(e) as (keyof Erros)[]).find((k) => e[k]);
    if (primeiro) {
      document.getElementById(ids[primeiro])?.focus();
      return;
    }
    const link = waLink(montarMensagem({ nome, atendimento, data, horario, obs }));
    setUrl(link);
    setEstado("abrindo");
    // Abre no mesmo gesto do clique (evita bloqueio) e corta o vínculo com esta página.
    const w = window.open("", "_blank");
    if (w) {
      w.opener = null;
      w.location.href = link;
      setBloqueado(false);
    } else {
      setBloqueado(true);
    }
    window.setTimeout(() => setEstado("pronto"), reduce ? 0 : 450);
  };

  const novo = () => {
    setEstado("idle");
    setBloqueado(false);
    setTimeout(() => document.getElementById(ids.nome)?.focus(), 0);
  };

  const label = "mb-2 block font-label text-[0.78rem] font-medium uppercase tracking-[0.16em] text-ink";
  const helper = "mt-2 text-[0.85rem] text-ink-soft";
  const erroCls = "mt-2 flex items-start gap-1.5 text-[0.88rem] text-[#b42318]";

  return (
    <section id="agendar" data-line="left" aria-labelledby="agendar-titulo" className="on-light relative bg-blush py-24 md:py-36">
      <div className="container-site relative z-[2] grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:pt-6">
          <p className="eyebrow mb-6 text-rose-700">Praticidade</p>
          <RevealTitle id="agendar-titulo" text="Peça seu horário em poucos *cliques*." className="text-[2.6rem] text-ink md:text-[3.6rem]" />
          <p className="mt-6 max-w-[28rem] text-[1.05rem] text-ink-soft">
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a
            disponibilidade.
          </p>
          <p className="mt-4 max-w-[28rem] text-ink-soft">
            O dia e o horário escolhidos são preferências.{dias ? ` Atendimento de ${dias}, com hora marcada.` : ""}
          </p>
        </div>

        <div className="rounded-[2rem] border border-blush-200 bg-ivory p-6 shadow-[0_30px_60px_-40px_rgba(30,39,46,0.35)] sm:p-10">
          {ag.urgencia && (
            <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-navy-900 p-5 text-pearl sm:flex-row sm:items-center sm:justify-between">
              <p>Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-12">
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          )}

          {estado === "pronto" ? (
            <m.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="py-6 text-center"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 size={44} strokeWidth={1.2} className="mx-auto text-rose-700" aria-hidden="true" />
              <h3 className="title mt-5 text-[2.2rem] text-ink">
                <em>Pronto!</em>
              </h3>
              <p className="mx-auto mt-4 max-w-sm text-ink-soft">
                Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
              </p>
              {bloqueado && (
                <p className="mx-auto mt-4 max-w-sm text-[0.92rem] text-ink">
                  Se o WhatsApp não abriu, o navegador pode ter bloqueado a nova aba. Use o botão abaixo.
                </p>
              )}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                  <ExternalLink size={16} aria-hidden="true" />
                  Abrir WhatsApp
                </a>
                <button type="button" onClick={novo} className="btn btn-outline-dark">
                  Fazer outra solicitação
                </button>
              </div>
            </m.div>
          ) : (
            <form noValidate onSubmit={enviar} aria-describedby={`${uid}-privacidade`}>
              <div className="grid gap-6">
                <div>
                  <label htmlFor={ids.nome} className={label}>
                    Nome completo <span className="text-rose-700">*</span>
                    <span className="sr-only"> (obrigatório)</span>
                  </label>
                  <input
                    id={ids.nome}
                    className="field"
                    type="text"
                    name="nome"
                    autoComplete="name"
                    placeholder="Como devemos te chamar?"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(erros.nome)}
                    aria-describedby={err("nome")}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={() => nome && setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? "Informe seu nome para a clínica saber com quem está falando." : undefined }))}
                  />
                  {erros.nome && (
                    <p id={`${ids.nome}-erro`} className={erroCls}>
                      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {erros.nome}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={ids.atendimento} className={label}>
                    Atendimento desejado{" "}
                    {ag.exigirAtendimento ? (
                      <>
                        <span className="text-rose-700">*</span>
                        <span className="sr-only"> (obrigatório)</span>
                      </>
                    ) : (
                      <span className="normal-case tracking-normal text-ink-soft">(opcional)</span>
                    )}
                  </label>
                  <select
                    id={ids.atendimento}
                    className="field"
                    name="atendimento"
                    aria-invalid={Boolean(erros.atendimento)}
                    aria-describedby={err("atendimento")}
                    value={atendimento}
                    onChange={(e) => {
                      setAtendimento(e.target.value);
                      setErros((x) => ({ ...x, atendimento: undefined }));
                    }}
                  >
                    <option value="">Escolha uma opção</option>
                    {FRENTES.map((f) => {
                      const itens = lista.filter((a) => a.frente === f.id);
                      return itens.length ? (
                        <optgroup key={f.id} label={f.titulo}>
                          {itens.map((a) => (
                            <option key={a.id} value={a.nome}>
                              {a.nome}
                            </option>
                          ))}
                        </optgroup>
                      ) : null;
                    })}
                    <optgroup label="Conversa">
                      <option value={PRIMEIRA}>{PRIMEIRA}</option>
                      <option value={NAO_SEI}>{NAO_SEI}</option>
                    </optgroup>
                  </select>
                  {erros.atendimento && (
                    <p id={`${ids.atendimento}-erro`} className={erroCls}>
                      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {erros.atendimento}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor={ids.data} className={label}>
                      Data preferida <span className="normal-case tracking-normal text-ink-soft">(opcional)</span>
                    </label>
                    <input
                      id={ids.data}
                      className="field"
                      type="date"
                      name="data"
                      min={minData || undefined}
                      aria-invalid={Boolean(erros.data)}
                      aria-describedby={`${ids.data}-ajuda${erros.data ? ` ${ids.data}-erro` : ""}`}
                      value={data}
                      onChange={(e) => onData(e.target.value)}
                    />
                    {erros.data ? (
                      <p id={`${ids.data}-erro`} className={erroCls} role="alert">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                        {erros.data}
                      </p>
                    ) : null}
                    <p id={`${ids.data}-ajuda`} className={helper}>
                      {dias ? `De ${dias}.` : ""} {CONFIG.fechado.map((f) => f.rotulo).join(", ")}
                      {CONFIG.fechado.length ? ": fechado." : ""}
                    </p>
                  </div>

                  <div>
                    <label htmlFor={ids.horario} className={label}>
                      Horário preferido <span className="normal-case tracking-normal text-ink-soft">(opcional)</span>
                    </label>
                    <select
                      id={ids.horario}
                      className="field"
                      name="horario"
                      disabled={!horarios.length}
                      aria-invalid={Boolean(erros.horario)}
                      aria-describedby={`${ids.horario}-ajuda${erros.horario ? ` ${ids.horario}-erro` : ""}`}
                      value={horario}
                      onChange={(e) => {
                        setHorario(e.target.value);
                        setErros((x) => ({ ...x, horario: undefined }));
                      }}
                    >
                      <option value="">Escolha um horário</option>
                      {horarios.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    {erros.horario && (
                      <p id={`${ids.horario}-erro`} className={erroCls}>
                        <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                        {erros.horario}
                      </p>
                    )}
                    <p id={`${ids.horario}-ajuda`} className={helper}>
                      {horarios.length ? "Horário de início, sujeito à disponibilidade." : "Escolha uma data para ver os horários."}
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor={ids.obs} className={label}>
                    Observações <span className="normal-case tracking-normal text-ink-soft">(opcional)</span>
                  </label>
                  <textarea
                    id={ids.obs}
                    className="field min-h-28 resize-y"
                    name="observacoes"
                    rows={3}
                    maxLength={ag.limiteObservacoes}
                    placeholder="Se quiser, conte o que você precisa."
                    aria-invalid={Boolean(erros.obs)}
                    aria-describedby={`${ids.obs}-ajuda${erros.obs ? ` ${ids.obs}-erro` : ""}`}
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                  />
                  {erros.obs && (
                    <p id={`${ids.obs}-erro`} className={erroCls}>
                      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {erros.obs}
                    </p>
                  )}
                  <div id={`${ids.obs}-ajuda`} className="mt-2 flex justify-between gap-4 text-[0.82rem] text-ink-soft">
                    <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                    <span className="shrink-0 tabular-nums" aria-hidden="true">
                      {obs.length}/{ag.limiteObservacoes}
                    </span>
                  </div>
                </div>
              </div>

              <p className="sr-only" aria-live="polite">
                {Object.values(erros).filter(Boolean).length ? "Há campos para corrigir no formulário." : ""}
                {estado === "abrindo" ? "Abrindo o WhatsApp." : ""}
              </p>

              <button type="submit" className="btn btn-dark mt-8 w-full" disabled={estado === "abrindo"} aria-busy={estado === "abrindo"}>
                {estado === "abrindo" ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <WhatsAppIcon />}
                {estado === "abrindo" ? "Abrindo o WhatsApp" : "Enviar solicitação pelo WhatsApp"}
              </button>
              <p id={`${uid}-privacidade`} className="mt-4 text-center text-[0.82rem] text-ink-soft">
                Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                <a href="/privacidade.html" className="text-rose-700 underline underline-offset-4">
                  Privacidade
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
