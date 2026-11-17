import { useEffect, useId, useMemo, useState } from "react";
import { CONFIG } from "../config";

/**
 * Solicitação de agendamento: monta a mensagem e abre o WhatsApp.
 * Nada é enviado a servidor nem guardado no navegador.
 */

const OPC_INICIAL = "Avaliação inicial";
const OPC_INDEFINIDO = "Ainda não sei, quero conversar";
const LIMITE_OBS = 300;

const pad = (n: number) => String(n).padStart(2, "0");
const isoLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const brData = (s: string) => {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

/** Blocos de 1 hora, do horário de abertura até 1 hora antes do fechamento. */
export function horariosDoDia(diaSemana: number): string[] {
  const h = CONFIG.horarios.find((x) => x.diaSemana === diaSemana);
  if (!h || !h.abre || !h.fecha) return [];
  const ini = Number(h.abre.slice(0, 2));
  const fim = Number(h.fecha.slice(0, 2));
  const out: string[] = [];
  for (let x = ini; x < fim; x++) out.push(`${pad(x)}:00`);
  return out;
}

export function montarMensagem(d: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  return [
    "Olá! Vim pelo site da Clinic Sculpt e gostaria de solicitar um agendamento.",
    `Nome: ${d.nome.trim()}`,
    `Atendimento: ${d.atendimento || "a definir"}`,
    `Data preferida: ${d.data ? brData(d.data) : "a combinar"}`,
    `Horário preferido: ${d.horario || "a combinar"}`,
    `Observações: ${d.obs.trim() || "-"}`,
  ].join("\n");
}

type Erros = Partial<Record<"nome" | "data" | "horario" | "obs", string>>;

export default function Agendar() {
  const id = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [hojeIso, setHojeIso] = useState<string | undefined>(undefined);
  const [estado, setEstado] = useState<"editando" | "enviado" | "bloqueado">("editando");
  const [url, setUrl] = useState("");

  useEffect(() => setHojeIso(isoLocal(new Date())), []);

  const opcoes = [OPC_INICIAL, ...CONFIG.tratamentos.map((t) => t.nome), OPC_INDEFINIDO];
  const horarios = useMemo(() => (data ? horariosDoDia(parseIso(data).getDay()) : []), [data]);

  const validarData = (v: string): string | undefined => {
    if (!v) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Informe uma data válida.";
    const hoje = isoLocal(new Date());
    if (v < hoje) return "Escolha uma data a partir de hoje.";
    if (horariosDoDia(parseIso(v).getDay()).length === 0) return "Dia sem atendimento, escolha outra data.";
  };
  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horario && !horarios.includes(horario)) e.horario = "Escolha um horário disponível para o dia.";
    if (obs.length > LIMITE_OBS) e.obs = `Use no máximo ${LIMITE_OBS} caracteres.`;
    return e;
  };

  const onData = (v: string) => {
    setData(v);
    setErros((x) => ({ ...x, data: validarData(v) }));
    const hs = v ? horariosDoDia(parseIso(v).getDay()) : [];
    if (!hs.includes(horario)) setHorario("");
  };

  const enviar = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (["nome", "data", "horario", "obs"] as const).find((k) => e[k]);
    if (primeiro) {
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    const msg = montarMensagem({ nome, atendimento, data, horario, obs });
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    setUrl(link);
    // abre uma aba vazia, corta o vínculo com esta página (noopener) e só então navega
    const w = window.open("", "_blank");
    if (w) {
      w.opener = null;
      w.location.href = link;
      setEstado("enviado");
    } else {
      setEstado("bloqueado");
    }
  };

  const campo =
    "mt-2 block min-h-[52px] w-full rounded-none border border-tinta/25 bg-gesso px-4 text-[16px] text-texto transition-colors placeholder:text-ardosia/80 hover:border-tinta/50 focus:border-tinta focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champanhe-escuro aria-[invalid=true]:border-[#9b2c2c]";
  const rotulo = "text-[14px] tracking-[0.02em] text-tinta";
  const erro = (k: keyof Erros) =>
    erros[k] ? (
      <p id={`${id}-${k}-erro`} className="mt-2 text-[14px] text-[#9b2c2c]">
        {erros[k]}
      </p>
    ) : null;
  const desc = (k: keyof Erros, extra?: string) => [erros[k] ? `${id}-${k}-erro` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="border-t border-tinta/10 bg-gesso-2">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-5">
          <p className="rotulo flex items-center gap-4 text-champanhe-escuro">
            <span aria-hidden="true" className="h-px w-10 bg-current" />
            Praticidade
          </p>
          <h2 id="titulo-agendar" className="display mt-6 text-[clamp(2.3rem,4.6vw,3.8rem)] text-tinta">
            Peça sua avaliação em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-[26rem] text-[17px] leading-relaxed text-ardosia">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a equipe confirma a disponibilidade.
          </p>
        </div>

        <div className="relative border border-champanhe-escuro/40 bg-gesso p-5 sm:p-10 lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute -top-px left-8 h-px w-24 bg-champanhe-escuro" />
          {estado === "editando" ? (
            <form noValidate onSubmit={enviar} className="grid gap-6">
              <div>
                <label htmlFor={`${id}-nome`} className={rotulo}>
                  Nome completo <span aria-hidden="true">*</span>
                  <span className="sr-only">(obrigatório)</span>
                </label>
                <input
                  id={`${id}-nome`}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? "Informe seu nome." : undefined }))}
                  aria-invalid={!!erros.nome}
                  aria-describedby={desc("nome")}
                  className={campo}
                />
                {erro("nome")}
              </div>

              <div>
                <label htmlFor={`${id}-atendimento`} className={rotulo}>
                  Atendimento desejado
                </label>
                <select id={`${id}-atendimento`} name="atendimento" value={atendimento} onChange={(e) => setAtendimento(e.target.value)} className={campo}>
                  <option value="">Escolha uma opção</option>
                  {opcoes.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-data`} className={rotulo}>
                    Data preferida
                  </label>
                  <input
                    id={`${id}-data`}
                    name="data"
                    type="date"
                    min={hojeIso}
                    value={data}
                    onChange={(e) => onData(e.target.value)}
                    aria-invalid={!!erros.data}
                    aria-describedby={desc("data", `${id}-data-dica`)}
                    className={campo}
                  />
                  <p id={`${id}-data-dica`} className="mt-2 text-[13px] text-ardosia">
                    Sem atendimento aos domingos.
                  </p>
                  {erro("data")}
                </div>
                <div>
                  <label htmlFor={`${id}-horario`} className={rotulo}>
                    Horário preferido
                  </label>
                  <select
                    id={`${id}-horario`}
                    name="horario"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    disabled={horarios.length === 0}
                    aria-invalid={!!erros.horario}
                    aria-describedby={desc("horario", `${id}-horario-dica`)}
                    className={`${campo} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="">Escolha um horário</option>
                    {horarios.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <p id={`${id}-horario-dica`} className="mt-2 text-[13px] text-ardosia">
                    {data ? "A equipe confirma a disponibilidade." : "Escolha uma data para ver os horários."}
                  </p>
                  {erro("horario")}
                </div>
              </div>

              <div>
                <label htmlFor={`${id}-obs`} className={rotulo}>
                  Observações <span className="text-ardosia">(opcional)</span>
                </label>
                <textarea
                  id={`${id}-obs`}
                  name="observacoes"
                  rows={3}
                  maxLength={LIMITE_OBS}
                  placeholder="Se quiser, conte o que você procura."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-invalid={!!erros.obs}
                  aria-describedby={desc("obs", `${id}-obs-dica`)}
                  className={`${campo} min-h-[110px] py-3`}
                />
                <p id={`${id}-obs-dica`} className="mt-2 flex justify-between gap-4 text-[13px] text-ardosia">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="num shrink-0" aria-hidden="true">
                    {obs.length}/{LIMITE_OBS}
                  </span>
                </p>
                {erro("obs")}
              </div>

              <div role="alert" aria-live="assertive" className="sr-only">
                {Object.values(erros).filter(Boolean).length > 0 ? "Revise os campos destacados." : ""}
              </div>

              <div>
                <button type="submit" className="btn btn-primario w-full">
                  Enviar solicitação pelo WhatsApp <span className="seta" aria-hidden="true" />
                </button>
                <p className="mt-4 text-[13px] leading-relaxed text-ardosia">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                  <a href="/privacidade.html" className="link-sub text-tinta underline decoration-tinta/30 underline-offset-4">
                    Privacidade
                  </a>
                </p>
              </div>
            </form>
          ) : (
            <div role="status" aria-live="polite" className="py-4">
              <p className="display text-[clamp(1.9rem,3vw,2.5rem)] text-tinta">
                {estado === "enviado" ? (
                  <>
                    <em>Pronto!</em>
                  </>
                ) : (
                  "Falta um passo."
                )}
              </p>
              <p className="mt-4 max-w-[30rem] text-[17px] leading-relaxed text-texto">
                {estado === "enviado"
                  ? "Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade."
                  : "O navegador não abriu a nova aba. Use o botão abaixo para abrir o WhatsApp com sua solicitação. A equipe confirma a disponibilidade."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
                  Abrir WhatsApp <span className="seta" aria-hidden="true" />
                </a>
                <button type="button" className="btn btn-secundario" onClick={() => setEstado("editando")}>
                  Editar solicitação
                </button>
              </div>
              {estado === "enviado" && <p className="mt-4 text-[13px] text-ardosia">Se o WhatsApp não abriu, use o botão "Abrir WhatsApp".</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
