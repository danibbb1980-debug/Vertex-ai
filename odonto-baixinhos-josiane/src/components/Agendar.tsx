import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CONFIG, linkWhatsApp, modoAtual, profissionaisAtivas, type Profissional } from "../config";
import { dataBR, diaAberto, horariosDisponiveis, isoLocal, lerData } from "../lib/horarios";
import { IconeCheck, IconeWhatsApp } from "./Icones";
import { enfase } from "./Texto";

const PRIMEIRA = "Primeira avaliação";
const NAO_SEI = "Ainda não sei, quero conversar";

type Erros = Partial<Record<"pro" | "nome" | "atendimento" | "data" | "hora", string>>;

function opcoesAtendimento(pro: Profissional | null): string[] {
  const confirmados = pro ? pro.atendimentos.filter((a) => a.confirmado).map((a) => a.titulo) : [];
  return [...confirmados, PRIMEIRA, NAO_SEI];
}

export function montarMensagem(d: { nome: string; atendimento: string; data: string; hora: string; obs: string }) {
  const data = lerData(d.data);
  return [
    "Olá! Vim pelo site e gostaria de solicitar um agendamento.",
    `Nome: ${d.nome.trim()}`,
    `Atendimento: ${d.atendimento || "a definir"}`,
    `Data preferida: ${data ? dataBR(data) : "a combinar"}`,
    `Horário preferido: ${d.hora || "a combinar"}`,
    `Observações: ${d.obs.trim() || "-"}`,
  ].join("\n");
}

const campo =
  "mt-2 block w-full min-h-12 rounded-xl border border-tinta/20 bg-white/70 px-4 py-3 text-[1rem] text-tinta placeholder:text-tinta-2/70 transition-colors focus:border-tinta focus:outline-3 focus:outline-offset-2 focus:outline-ceu-ink aria-[invalid=true]:border-rosa-ink aria-[invalid=true]:bg-rosa/30 disabled:cursor-not-allowed disabled:opacity-60";
const rotulo = "block text-[0.95rem] font-bold";

export function Agendar() {
  const ativas = profissionaisAtivas();
  const varias = ativas.length > 1;
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);

  const [proId, setProId] = useState<string>(varias ? "" : ativas[0].id);
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [resultado, setResultado] = useState<{ url: string; bloqueado: boolean } | null>(null);

  const pro = ativas.find((p) => p.id === proId) ?? null;
  // calculado no navegador (o HTML é pré-renderizado no build)
  const [hoje, setHoje] = useState("");
  useEffect(() => setHoje(isoLocal(new Date())), []);
  const dataObj = lerData(data);
  const dataFechada = !!dataObj && !diaAberto(dataObj);
  const slots = useMemo(() => (dataObj && !dataFechada ? horariosDisponiveis(dataObj) : []), [data]); // eslint-disable-line
  const opcoes = opcoesAtendimento(pro);

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined;
    const d = lerData(v);
    if (!d) return "Data inválida. Use o formato dia/mês/ano.";
    if (v < (hoje || isoLocal(new Date()))) return "Escolha uma data a partir de hoje.";
    if (!diaAberto(d)) return "Dia sem atendimento, escolha outra data.";
    if (horariosDisponiveis(d).length === 0) return "Não há mais horários neste dia, escolha outra data.";
    return undefined;
  };

  const validar = (): Erros => {
    const e: Erros = {};
    if (varias && !pro) e.pro = "Escolha com quem deseja agendar.";
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha o atendimento desejado.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (hora && data && !slots.includes(hora)) e.hora = "Escolha um horário da lista.";
    return e;
  };

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = Object.keys(e)[0];
    if (primeiro) {
      form.current?.querySelector<HTMLElement>(`[data-campo="${primeiro}"]`)?.focus();
      return;
    }
    const alvo = pro ?? ativas[0];
    const url = linkWhatsApp(alvo.whatsapp, montarMensagem({ nome, atendimento, data, hora, obs }));
    const janela = window.open(url, "_blank");
    if (janela) {
      try {
        janela.opener = null;
      } catch {
        /* ignore */
      }
    }
    setResultado({ url, bloqueado: !janela });
  };

  const reiniciar = () => {
    setResultado(null);
    setNome("");
    setAtendimento("");
    setData("");
    setHora("");
    setObs("");
    setErros({});
    if (varias) setProId("");
  };

  const erro = (k: keyof Erros) =>
    erros[k] ? (
      <p id={`${uid}-${k}-erro`} className="mt-2 text-sm font-semibold text-rosa-ink">
        {erros[k]}
      </p>
    ) : null;
  const aria = (k: keyof Erros, extra?: string) => ({
    "aria-invalid": erros[k] ? true : undefined,
    "aria-describedby": [erros[k] ? `${uid}-${k}-erro` : "", extra ?? ""].filter(Boolean).join(" ") || undefined,
    "data-campo": k,
  });
  const qtdErros = Object.keys(erros).length;
  const modo = modoAtual();

  return (
    <section id="agendar" className="relative isolate overflow-hidden bg-marfim-2/70 py-20 md:py-28" aria-labelledby="titulo-agendar">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{ background: "radial-gradient(34rem 28rem at 100% 0%, color-mix(in srgb, var(--color-ceu) 65%, transparent), transparent 70%)" }}
      />
      <div className="container-site grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div className="revela md:pt-6">
          <p className="eyebrow">Praticidade</p>
          <h2 id="titulo-agendar" className="mt-4 text-[2.15rem] leading-[1.06] sm:text-5xl md:text-[3.4rem]">
            {enfase("Peça seu horário em poucos *cliques*.")}
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-tinta-2 md:text-lg">
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe
            confirma a disponibilidade.
          </p>
          <ul className="mt-8 space-y-3 text-[0.97rem]">
            {[
              "Sem cadastro e sem senha",
              "Dia e horário são preferências, sujeitas à confirmação da clínica",
              "Este site não guarda nenhum dado digitado",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <IconeCheck className="mt-0.5 shrink-0 text-menta-ink" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="revela rounded-[2rem] border border-linha bg-marfim p-5 shadow-[0_40px_80px_-50px_rgba(27,36,64,.45)] sm:p-8 md:p-10">
          {CONFIG.agendamento.urgencia ? (
            <div className="mb-6 rounded-2xl bg-rosa/60 p-4">
              <p className="font-bold">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
            </div>
          ) : null}

          {resultado ? (
            <div role="status" aria-live="polite" className="py-4 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-menta text-menta-ink">
                <IconeCheck tamanho={26} />
              </span>
              <h3 className="mt-5 text-3xl">{resultado.bloqueado ? "Quase lá" : "Pronto!"}</h3>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-tinta-2">
                {resultado.bloqueado
                  ? "Seu navegador não abriu a nova aba. Toque em “Abrir WhatsApp” para continuar com a sua solicitação."
                  : "Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade."}
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={resultado.url} target="_blank" rel="noopener" className="btn btn-tinta">
                  <IconeWhatsApp tamanho={18} /> Abrir WhatsApp
                </a>
                <button type="button" onClick={reiniciar} className="btn btn-contorno">
                  Fazer nova solicitação
                </button>
              </div>
            </div>
          ) : (
            <form ref={form} noValidate onSubmit={enviar} aria-describedby={`${uid}-nota`}>
              <div aria-live="polite" className="sr-only">
                {qtdErros ? `${qtdErros === 1 ? "Há 1 campo" : `Há ${qtdErros} campos`} para corrigir.` : ""}
              </div>

              {varias ? (
                <fieldset className="mb-6">
                  <legend className={rotulo}>
                    Com quem deseja agendar? <span className="text-rosa-ink">*</span>
                  </legend>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {ativas.map((p, i) => (
                      <label
                        key={p.id}
                        className={`relative flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ceu-ink ${
                          proId === p.id
                            ? p.id === "aline"
                              ? "border-ceu-ink bg-ceu"
                              : "border-caramelo bg-creme"
                            : erros.pro
                              ? "border-rosa-ink bg-rosa/20"
                              : "border-tinta/20 bg-white/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pro"
                          value={p.id}
                          checked={proId === p.id}
                          onChange={() => {
                            setProId(p.id);
                            setAtendimento("");
                            setErros((e) => ({ ...e, pro: undefined }));
                          }}
                          className="peer sr-only"
                          {...(i === 0 ? aria("pro") : {})}
                        />
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            proId === p.id ? "border-tinta" : "border-tinta/40"
                          }`}
                          aria-hidden="true"
                        >
                          {proId === p.id ? <span className="h-2.5 w-2.5 rounded-full bg-tinta" /> : null}
                        </span>
                        <span className="leading-tight">
                          <span className="block font-bold">{p.id === "aline" ? "Dra. Aline" : p.nome}</span>
                          <span className="mt-0.5 block text-sm text-tinta-2">
                            {p.id === "aline" ? "Odonto Baixinhos · bebês e crianças" : "Cirurgiã-Dentista · adultos"}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {erro("pro")}
                </fieldset>
              ) : null}

              <div className="grid gap-5">
                <div>
                  <label htmlFor={`${uid}-nome`} className={rotulo}>
                    Nome completo <span className="text-rosa-ink">*</span>
                  </label>
                  <input
                    id={`${uid}-nome`}
                    type="text"
                    autoComplete="name"
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    maxLength={80}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (erros.nome && e.target.value.trim().length >= 2) setErros((er) => ({ ...er, nome: undefined }));
                    }}
                    onBlur={() => {
                      if (nome && nome.trim().length < 2) setErros((er) => ({ ...er, nome: "Informe seu nome." }));
                    }}
                    className={campo}
                    required
                    {...aria("nome")}
                  />
                  {erro("nome")}
                </div>

                <div>
                  <label htmlFor={`${uid}-at`} className={rotulo}>
                    Atendimento desejado{" "}
                    {CONFIG.agendamento.exigirAtendimento ? <span className="text-rosa-ink">*</span> : <span className="font-normal text-tinta-2">(opcional)</span>}
                  </label>
                  <select
                    id={`${uid}-at`}
                    value={atendimento}
                    onChange={(e) => {
                      setAtendimento(e.target.value);
                      setErros((er) => ({ ...er, atendimento: undefined }));
                    }}
                    className={`${campo} appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b2440' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                    {...aria("atendimento", varias && !pro ? `${uid}-at-dica` : undefined)}
                  >
                    <option value="">Escolha o atendimento</option>
                    {opcoes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {varias && !pro ? (
                    <p id={`${uid}-at-dica`} className="mt-2 text-sm text-tinta-2">
                      Escolha a profissional para ver os atendimentos de cada uma.
                    </p>
                  ) : null}
                  {erro("atendimento")}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-data`} className={rotulo}>
                      Data preferida <span className="font-normal text-tinta-2">(opcional)</span>
                    </label>
                    <input
                      id={`${uid}-data`}
                      type="date"
                      min={hoje || undefined}
                      value={data}
                      onChange={(e) => {
                        const v = e.target.value;
                        setData(v);
                        setHora("");
                        setErros((er) => ({ ...er, data: validarData(v), hora: undefined }));
                      }}
                      className={campo}
                      {...aria("data", `${uid}-data-dica`)}
                    />
                    <p id={`${uid}-data-dica`} className="mt-2 text-xs text-tinta-2">
                      Atendimento de segunda a sexta.
                    </p>
                    {erro("data")}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-hora`} className={rotulo}>
                      Horário preferido <span className="font-normal text-tinta-2">(opcional)</span>
                    </label>
                    <select
                      id={`${uid}-hora`}
                      value={hora}
                      disabled={!dataObj || dataFechada || !!erros.data || slots.length === 0}
                      onChange={(e) => setHora(e.target.value)}
                      className={`${campo} appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b2440' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                      {...aria("hora", `${uid}-hora-dica`)}
                    >
                      <option value="">Escolha um horário</option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p id={`${uid}-hora-dica`} className="mt-2 text-xs text-tinta-2">
                      {dataObj && !erros.data ? "Horários fora do intervalo de almoço." : "Escolha uma data para ver os horários."}
                    </p>
                    {erro("hora")}
                  </div>
                </div>

                <div>
                  <label htmlFor={`${uid}-obs`} className={rotulo}>
                    Observações <span className="font-normal text-tinta-2">(opcional)</span>
                  </label>
                  <textarea
                    id={`${uid}-obs`}
                    rows={3}
                    maxLength={CONFIG.agendamento.limiteObservacoes}
                    placeholder="Se quiser, conte o que você precisa."
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    className={`${campo} resize-y`}
                    aria-describedby={`${uid}-obs-dica`}
                  />
                  <p id={`${uid}-obs-dica`} className="mt-2 flex justify-between gap-4 text-xs text-tinta-2">
                    <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                    <span className="shrink-0 tabular-nums" aria-hidden="true">
                      {obs.length}/{CONFIG.agendamento.limiteObservacoes}
                    </span>
                  </p>
                </div>
              </div>

              <button type="submit" className="btn btn-tinta mt-8 w-full !min-h-14 text-base">
                <IconeWhatsApp tamanho={20} />
                Enviar solicitação pelo WhatsApp
              </button>
              <p id={`${uid}-nota`} className="mt-4 text-center text-xs leading-relaxed text-tinta-2">
                Ao enviar, você abre uma conversa no WhatsApp com {modo === "ambas" ? "a profissional escolhida" : "a clínica"}. Este site não
                guarda os dados digitados. Dia e horário são preferências, sujeitas à confirmação da clínica.{" "}
                <a href="/privacidade.html" className="font-semibold text-tinta underline underline-offset-2">
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
