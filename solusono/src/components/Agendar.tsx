import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG, diaAberto, horariosDoDia, horariosResumo, linkWhatsapp, type Dia } from "../config";
import { IconeWhatsapp } from "./Icones";

const NAO_SEI = "Ainda não sei, quero conversar";
const MSG_DIA_FECHADO = "Dia sem atendimento, escolha outra data";

type Erros = Partial<Record<"nome" | "atendimento" | "data" | "horario", string>>;

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function diaDaSemana(iso: string): Dia {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).getDay() as Dia;
}
function br(iso: string) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
/** Primeiro dia aberto da semana, para sugerir horários antes de escolher a data. */
function diaPadrao(): Dia | null {
  for (const d of [1, 2, 3, 4, 5, 6, 0] as Dia[]) if (diaAberto(d)) return d;
  return null;
}

export function Agendar() {
  const opcoes = [...CONFIG.atendimentos, NAO_SEI];
  const limite = CONFIG.agendamento.limiteObservacoes;
  // "hoje" só no navegador: o HTML pré-renderizado não pode congelar a data do build.
  const [hoje, setHoje] = useState("");
  useEffect(() => setHoje(hojeISO()), []);

  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"livre" | "enviando" | "pronto" | "bloqueado">("livre");
  const [urlFinal, setUrlFinal] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const horarios = useMemo(() => {
    const dia = data ? diaDaSemana(data) : diaPadrao();
    if (dia === null) return [];
    let lista = horariosDoDia(dia);
    if (data === hoje) {
      const agora = new Date();
      const minutos = agora.getHours() * 60 + agora.getMinutes();
      lista = lista.filter((h) => {
        const [a, b] = h.split(":").map(Number);
        return a * 60 + b > minutos;
      });
    }
    return lista;
  }, [data, hoje]);

  function validarData(v: string): string | undefined {
    if (!v) return undefined;
    if (hoje && v < hoje) return "Escolha uma data a partir de hoje.";
    if (!diaAberto(diaDaSemana(v))) return MSG_DIA_FECHADO;
    return undefined;
  }

  function aoMudarData(v: string) {
    setData(v);
    const erro = validarData(v);
    setErros((e) => ({ ...e, data: erro }));
    setHorario("");
  }

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome para a clínica saber com quem está falando.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha um atendimento.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horario && !horarios.includes(horario)) e.horario = "Esse horário não está disponível para a data escolhida.";
    return e;
  }

  function montarMensagem() {
    return [
      CONFIG.mensagens.agendamento,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Modalidade: ${modalidade || "a definir"}`,
      `Data preferida: ${data ? br(data) : "a combinar"}`,
      `Horário preferido: ${horario || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (["nome", "atendimento", "data", "horario"] as const).find((k) => e[k]);
    if (primeiro) {
      formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
      setEstado("livre");
      return;
    }
    const url = linkWhatsapp(montarMensagem());
    setUrlFinal(url);
    // Abre na hora do clique (evita bloqueio) e corta o vínculo com esta página (noopener).
    const janela = window.open("", "_blank");
    if (janela) {
      janela.opener = null;
      janela.location.href = url;
      setEstado("enviando");
      window.setTimeout(() => setEstado("pronto"), 500);
    } else {
      setEstado("bloqueado");
    }
  }

  const resumo = horariosResumo();
  const campo =
    "mt-2 block min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-[1rem] text-ink placeholder:text-muted/80 transition-colors focus:border-brand focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  const borda = (k: keyof Erros) => (erros[k] ? "border-erro" : "border-line hover:border-sky");
  const rotulo = "block text-[0.95rem] font-semibold text-ink";

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="bg-mist py-24 md:py-36">
      <div className="container-site grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <p className="rotulo">Praticidade</p>
            <h2 id="agendar-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,4rem)]">
              Peça seu horário em poucos <em>cliques</em>.
            </h2>
            <p className="mt-6 max-w-[40ch] text-muted">
              Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a
              equipe confirma a disponibilidade.
            </p>
            <p className="mt-4 max-w-[40ch] text-muted">
              Data e horário são preferências: o agendamento só vale depois da confirmação da clínica.
            </p>
            {resumo.length > 0 && (
              <dl className="mt-8 max-w-sm border-t border-line text-[0.95rem]">
                {resumo.map((l) => (
                  <div key={l.dias} className="flex justify-between gap-4 border-b border-line py-3">
                    <dt className="text-muted">{l.dias}</dt>
                    <dd className="font-semibold text-ink">{l.horas}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div className="md:col-span-7">
          <form
            ref={formRef}
            noValidate
            onSubmit={enviar}
            aria-labelledby="agendar-titulo"
            className="rounded-[2rem] border border-line bg-white p-6 sm:p-8 md:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="ag-nome" className={rotulo}>
                  Nome completo <span className="font-normal text-muted">(obrigatório)</span>
                </label>
                <input
                  id="ag-nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={!!erros.nome}
                  aria-describedby={erros.nome ? "ag-nome-erro" : undefined}
                  className={`${campo} ${borda("nome")}`}
                />
                {erros.nome && (
                  <p id="ag-nome-erro" className="mt-2 text-sm text-erro">
                    {erros.nome}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ag-atendimento" className={rotulo}>
                  Atendimento desejado{" "}
                  {!CONFIG.agendamento.exigirAtendimento && <span className="font-normal text-muted">(opcional)</span>}
                </label>
                <select
                  id="ag-atendimento"
                  name="atendimento"
                  value={atendimento}
                  onChange={(e) => setAtendimento(e.target.value)}
                  aria-invalid={!!erros.atendimento}
                  aria-describedby={erros.atendimento ? "ag-atendimento-erro" : undefined}
                  className={`${campo} ${borda("atendimento")} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%231f5fa8'%20stroke-width='1.5'%3E%3Cpath%20d='M6%209l6%206%206-6'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12`}
                >
                  <option value="">Escolha um atendimento</option>
                  {opcoes.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {erros.atendimento && (
                  <p id="ag-atendimento-erro" className="mt-2 text-sm text-erro">
                    {erros.atendimento}
                  </p>
                )}
              </div>

              {CONFIG.modalidades.length > 0 && (
                <fieldset className="sm:col-span-2">
                  <legend className={rotulo}>
                    Modalidade <span className="font-normal text-muted">(opcional)</span>
                  </legend>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {CONFIG.modalidades.map((m) => (
                      <label
                        key={m}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                          modalidade === m ? "border-brand bg-tint text-ink" : "border-line hover:border-sky"
                        }`}
                      >
                        <input
                          type="radio"
                          name="modalidade"
                          value={m}
                          checked={modalidade === m}
                          onChange={() => setModalidade(m)}
                          className="h-4 w-4 accent-[var(--color-brand)]"
                        />
                        <span className="font-semibold">{m}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <div>
                <label htmlFor="ag-data" className={rotulo}>
                  Data preferida <span className="font-normal text-muted">(opcional)</span>
                </label>
                <input
                  id="ag-data"
                  name="data"
                  type="date"
                  min={hoje || undefined}
                  value={data}
                  onChange={(e) => aoMudarData(e.target.value)}
                  aria-invalid={!!erros.data}
                  aria-describedby={`ag-data-ajuda${erros.data ? " ag-data-erro" : ""}`}
                  className={`${campo} ${borda("data")}`}
                />
                <p id="ag-data-ajuda" className="mt-2 text-sm text-muted">
                  Atendimento de segunda a sexta.
                </p>
                {erros.data && (
                  <p id="ag-data-erro" className="mt-1 text-sm text-erro">
                    {erros.data}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ag-horario" className={rotulo}>
                  Horário preferido <span className="font-normal text-muted">(opcional)</span>
                </label>
                <select
                  id="ag-horario"
                  name="horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  disabled={!!erros.data && erros.data === MSG_DIA_FECHADO}
                  aria-invalid={!!erros.horario}
                  aria-describedby={erros.horario ? "ag-horario-erro" : undefined}
                  className={`${campo} ${borda("horario")} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%231f5fa8'%20stroke-width='1.5'%3E%3Cpath%20d='M6%209l6%206%206-6'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12 disabled:cursor-not-allowed disabled:bg-mist`}
                >
                  <option value="">Escolha um horário</option>
                  {horarios.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                {erros.horario && (
                  <p id="ag-horario-erro" className="mt-2 text-sm text-erro">
                    {erros.horario}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ag-obs" className={rotulo}>
                  Observações <span className="font-normal text-muted">(opcional)</span>
                </label>
                <textarea
                  id="ag-obs"
                  name="observacoes"
                  rows={3}
                  maxLength={limite}
                  placeholder="Se quiser, conte o que você precisa."
                  value={obs}
                  onChange={(e) => setObs(e.target.value.slice(0, limite))}
                  aria-describedby="ag-obs-ajuda ag-obs-contador"
                  className={`${campo} border-line hover:border-sky resize-y`}
                />
                <div className="mt-2 flex justify-between gap-4 text-sm text-muted">
                  <p id="ag-obs-ajuda">Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                  <p id="ag-obs-contador" className="shrink-0 tabular-nums" aria-live="off">
                    {obs.length}/{limite}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-8">
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="group relative isolate inline-flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-brand px-6 text-[1rem] font-semibold text-white transition-colors disabled:cursor-progress disabled:opacity-80 sm:w-auto"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-calma)] group-hover:scale-x-100"
                />
                <IconeWhatsapp />
                {estado === "enviando" ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}
              </button>

              <div aria-live="polite" role="status" className="empty:hidden">
                {estado === "pronto" && (
                  <p className="aparece mt-6 rounded-2xl bg-tint px-5 py-4 text-ink">
                    Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a
                    disponibilidade.
                  </p>
                )}
                {estado === "bloqueado" && (
                  <p className="aparece mt-6 rounded-2xl bg-tint px-5 py-4 text-ink">
                    O navegador não deixou abrir uma nova aba.{" "}
                    <a href={urlFinal} target="_blank" rel="noopener noreferrer" className="link-sublinhado font-semibold text-brand">
                      Abrir WhatsApp
                    </a>{" "}
                    com a sua solicitação já escrita.
                  </p>
                )}
                {Object.values(erros).some(Boolean) && estado === "livre" && (
                  <p className="mt-6 text-sm text-erro">Confira o que está destacado acima.</p>
                )}
              </div>

              <p className="mt-6 text-sm text-muted">
                Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                <a href="/privacidade.html" className="link-sublinhado text-ink">
                  Privacidade
                </a>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
