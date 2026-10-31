import { useId, useMemo, useState, type FormEvent } from "react";
import { CONFIG, waLink, whatsappDoAndar, type Andar } from "../config";
import { CheckIcon, WhatsIcon } from "./Icons";
import { Reveal } from "./Reveal";

const NAO_SEI = "Ainda não sei, quero conversar";
const pad = (n: number) => String(n).padStart(2, "0");
const toMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const hoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const parseData = (v: string) => {
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Blocos de 1h dentro do expediente, sem almoço e sem o horário de fechamento. */
export function horariosDoDia(dataISO: string) {
  const dias = CONFIG.horarios;
  let faixa = null as (typeof dias)[number];
  if (dataISO) {
    faixa = dias[parseData(dataISO).getDay()] ?? null;
    if (!faixa) return [];
  } else {
    faixa = Object.values(dias).find(Boolean) ?? null;
    if (!faixa) return [];
  }
  const ini = toMin(faixa.abre);
  const fim = toMin(faixa.fecha);
  const almoco = faixa.almoco ? [toMin(faixa.almoco[0]), toMin(faixa.almoco[1])] : null;
  const agora = new Date();
  const ehHoje = dataISO === hoje();
  const out: string[] = [];
  for (let t = Math.ceil(ini / 60) * 60; t + 60 <= fim; t += 60) {
    if (almoco && t < almoco[1] && t + 60 > almoco[0]) continue;
    if (ehHoje && t <= agora.getHours() * 60 + agora.getMinutes()) continue;
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return out;
}

function numeroParaAtendimento(at: string) {
  if (!at || at === NAO_SEI) return CONFIG.whatsappPrincipal;
  const alvo = at.toLowerCase();
  const areas = CONFIG.areas.filter((a) => a.nome.toLowerCase() === alvo || a.nome.toLowerCase().startsWith(alvo));
  const andares = new Set(areas.map((a) => a.andar).filter(Boolean) as Andar[]);
  return areas.length > 0 && andares.size === 1 && areas.every((a) => a.andar) ? whatsappDoAndar([...andares][0]) : CONFIG.whatsappPrincipal;
}

type Erros = Partial<Record<"nome" | "atendimento" | "data", string>>;

export function Agendar() {
  const uid = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<{ url: string; bloqueado: boolean } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const horas = useMemo(() => horariosDoDia(data), [data]);
  const opcoes = [...CONFIG.atendimentos, NAO_SEI];
  const limite = CONFIG.agendamento.limiteObservacoes;

  function validarData(v: string): string | undefined {
    if (!v) return undefined;
    if (v < hoje()) return "Escolha uma data a partir de hoje.";
    if (!CONFIG.horarios[parseData(v).getDay()]) return "Dia sem atendimento, escolha outra data.";
    if (horariosDoDia(v).length === 0) return "Não há mais horários hoje, escolha outra data.";
    return undefined;
  }

  function onData(v: string) {
    setData(v);
    setHora("");
    setErros((e) => ({ ...e, data: validarData(v) }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const novo: Erros = {};
    if (nome.trim().length < 2) novo.nome = "Informe seu nome.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) novo.atendimento = "Escolha a área de atendimento.";
    const ed = validarData(data);
    if (ed) novo.data = ed;
    setErros(novo);
    const primeiro = (["atendimento", "nome", "data"] as const).find((k) => novo[k]);
    if (primeiro) {
      document.getElementById(`${uid}-${primeiro}`)?.focus();
      return;
    }
    setEnviando(true);
    const dataBR = data ? data.split("-").reverse().join("/") : "a combinar";
    const msg = [
      "Olá! Vim pelo site e gostaria de solicitar um agendamento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Data preferida: ${dataBR}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const url = waLink(msg, numeroParaAtendimento(atendimento));
    const w = window.open(url, "_blank");
    if (w) w.opener = null;
    setEnviado({ url, bloqueado: !w });
    setEnviando(false);
  }

  const err = (k: keyof Erros) =>
    erros[k] ? (
      <p id={`${uid}-${k}-erro`} className="mt-1.5 text-sm font-medium text-red-700">
        {erros[k]}
      </p>
    ) : null;
  const label = "mb-1.5 block font-display text-[0.92rem] font-semibold text-night";

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="relative overflow-hidden bg-mist/60 py-20 sm:py-28">
      <div className="grid-mod pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent)]" aria-hidden />
      <div className="wrap relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="lg:pt-6">
          <p className="eyebrow">Praticidade</p>
          <h2 id="agendar-titulo" className="h2 mt-4">
            Peça seu horário em poucos <em className="enfase">cliques</em>.
          </h2>
          <p className="lead mt-5">
            Escolha o atendimento e o dia e horário de sua preferência. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade.
          </p>
          <ul className="mt-8 grid gap-3 text-graphite-soft">
            {[
              "Atendimento de segunda a sexta, das 07h00 às 19h30.",
              "Dia e horário escolhidos são preferências; a recepção confirma.",
              "O horário de cada profissional pode variar.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white text-brand-ink shadow-soft">
                  <CheckIcon width={14} height={14} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card p-5 sm:p-8">
            {enviado ? (
              <div role="status" aria-live="polite" className="py-6 text-center sm:py-10">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
                  <CheckIcon width={26} height={26} />
                </span>
                <p className="mx-auto mt-5 max-w-sm font-display text-xl font-semibold text-night">
                  {enviado.bloqueado ? "Sua mensagem está pronta." : "Pronto! Abrimos o WhatsApp com sua solicitação."}
                </p>
                <p className="mx-auto mt-2 max-w-sm text-graphite-soft">
                  {enviado.bloqueado
                    ? "O navegador bloqueou a nova aba. Toque no botão abaixo para abrir o WhatsApp."
                    : "É só enviar a mensagem. A equipe confirma a disponibilidade."}
                </p>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <a href={enviado.url} target="_blank" rel="noopener noreferrer" className={enviado.bloqueado ? "btn-primary" : "btn-ghost"}>
                    <WhatsIcon /> Abrir WhatsApp
                  </a>
                  <button type="button" onClick={() => setEnviado(null)} className="min-h-[48px] px-3 font-medium text-brand-ink underline-offset-4 hover:underline">
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={submit} aria-describedby={`${uid}-ajuda`} className="grid gap-5">
                <div>
                  <label htmlFor={`${uid}-atendimento`} className={label}>
                    Área de atendimento{CONFIG.agendamento.exigirAtendimento ? "" : " (opcional)"}
                  </label>
                  <select
                    id={`${uid}-atendimento`}
                    className="field appearance-none bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-10"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230F5F93' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                    value={atendimento}
                    onChange={(e) => setAtendimento(e.target.value)}
                    aria-invalid={!!erros.atendimento}
                    aria-describedby={erros.atendimento ? `${uid}-atendimento-erro` : undefined}
                  >
                    <option value="">Escolha a área</option>
                    {opcoes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {err("atendimento")}
                </div>

                <div>
                  <label htmlFor={`${uid}-nome`} className={label}>
                    Nome completo
                  </label>
                  <input
                    id={`${uid}-nome`}
                    className="field"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    aria-invalid={!!erros.nome}
                    aria-describedby={erros.nome ? `${uid}-nome-erro` : undefined}
                  />
                  {err("nome")}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-data`} className={label}>
                      Data preferida (opcional)
                    </label>
                    <input
                      id={`${uid}-data`}
                      className="field"
                      type="date"
                      min={hoje()}
                      value={data}
                      onChange={(e) => onData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={`${uid}-data-dica${erros.data ? ` ${uid}-data-erro` : ""}`}
                    />
                    <p id={`${uid}-data-dica`} className="mt-1.5 text-[0.82rem] text-graphite-soft">
                      Segunda a sexta.
                    </p>
                    {err("data")}
                  </div>
                  <div>
                    <label htmlFor={`${uid}-hora`} className={label}>
                      Horário preferido (opcional)
                    </label>
                    <select
                      id={`${uid}-hora`}
                      className="field appearance-none bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-10"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230F5F93' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      disabled={!!erros.data}
                    >
                      <option value="">Escolha um horário</option>
                      {horas.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={`${uid}-obs`} className={label}>
                    Observações (opcional)
                  </label>
                  <textarea
                    id={`${uid}-obs`}
                    className="field min-h-[110px] resize-y"
                    maxLength={limite}
                    rows={3}
                    placeholder="Se quiser, conte o que você precisa."
                    value={obs}
                    onChange={(e) => setObs(e.target.value.slice(0, limite))}
                    aria-describedby={`${uid}-obs-aviso`}
                  />
                  <p id={`${uid}-obs-aviso`} className="mt-1.5 flex justify-between gap-4 text-[0.82rem] text-graphite-soft">
                    <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                    <span aria-hidden className="shrink-0 tabular-nums">
                      {obs.length}/{limite}
                    </span>
                  </p>
                </div>

                <div className="sr-only" aria-live="assertive">
                  {Object.values(erros).filter(Boolean).join(" ")}
                </div>

                <button type="submit" className="btn-primary w-full" disabled={enviando} aria-busy={enviando}>
                  <WhatsIcon /> {enviando ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}
                </button>
                <p id={`${uid}-ajuda`} className="text-center text-[0.84rem] leading-relaxed text-graphite-soft">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                  <a href="/privacidade.html" className="font-medium text-brand-ink underline underline-offset-2">
                    Privacidade
                  </a>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
