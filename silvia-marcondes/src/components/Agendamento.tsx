// Solicitação de agendamento: monta a mensagem e abre o WhatsApp. Não envia nada a servidor
// nenhum e não guarda o que foi digitado (nem localStorage, nem cookies).
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG } from "../config";
import { blocosDoDia, dataBR, diaDaData, hojeEmSP, horarioDoDia, minutos } from "../lib/horarios";
import { linkWhatsapp, temWhatsapp } from "../lib/whatsapp";
import { IconeCheck, IconeWhatsapp } from "./Icones";
import { ComEnfase } from "./TextReveal";

type Campos = { nome: string; atendimento: string; data: string; hora: string; obs: string };
type Erros = Partial<Record<keyof Campos, string>>;
const LIMITE_OBS = 300;
const TODOS_OS_DIAS = ([0, 1, 2, 3, 4, 5, 6] as const).every((d) => horarioDoDia(d));

function agoraSP() {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  return minutos(p);
}

export function Agendamento() {
  const id = useId();
  const [c, setC] = useState<Campos>({ nome: "", atendimento: "", data: "", hora: "", obs: "" });
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"livre" | "abrindo" | "pronto">("livre");
  const [bloqueado, setBloqueado] = useState(false);
  const [url, setUrl] = useState("");
  const [hoje, setHoje] = useState("");
  const refs = useRef<Partial<Record<keyof Campos, HTMLElement | null>>>({});
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHoje(hojeEmSP().iso), []);

  const opcoes = useMemo(
    () => [...CONFIG.atendimentos.map((a) => a.nome), ...CONFIG.agendamento.opcoesExtras],
    [],
  );

  const blocos = useMemo(() => {
    if (!c.data || !/^\d{4}-\d{2}-\d{2}$/.test(c.data)) return [];
    const todos = blocosDoDia(diaDaData(c.data));
    if (c.data === hoje) {
      const agora = agoraSP();
      return todos.filter((h) => minutos(h) > agora);
    }
    return todos;
  }, [c.data, hoje]);

  if (!temWhatsapp || !CONFIG.secoes.agendar) return null;

  function validarData(v: string): string | undefined {
    if (!v) return undefined;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Informe uma data válida.";
    if (hoje && v < hoje) return "Escolha uma data a partir de hoje.";
    if (!horarioDoDia(diaDaData(v))) return "Dia sem atendimento, escolha outra data";
    return undefined;
  }

  function validar(campos: Campos): Erros {
    const e: Erros = {};
    if (campos.nome.trim().length < 2) e.nome = "Informe seu nome para a Silvia saber com quem está falando.";
    if (CONFIG.agendamento.exigirAtendimento && !campos.atendimento) e.atendimento = "Escolha um atendimento.";
    const ed = validarData(campos.data);
    if (ed) e.data = ed;
    if (campos.obs.length > LIMITE_OBS) e.obs = `Use no máximo ${LIMITE_OBS} caracteres.`;
    return e;
  }

  function mudar<K extends keyof Campos>(k: K, v: Campos[K]) {
    setC((prev) => {
      const novo = { ...prev, [k]: v };
      if (k === "data") {
        const d = String(v);
        const lista = d && !validarData(d) ? blocosDoDia(diaDaData(d)) : [];
        if (!lista.includes(novo.hora)) novo.hora = "";
      }
      return novo;
    });
    if (k === "data") setErros((e) => ({ ...e, data: validarData(String(v)) }));
    else if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
    if (estado === "pronto") setEstado("livre");
  }

  function montarMensagem(campos: Campos) {
    return [
      CONFIG.agendamento.mensagemInicial,
      `Nome: ${campos.nome.trim()}`,
      `Atendimento: ${campos.atendimento || "a definir"}`,
      `Data preferida: ${campos.data ? dataBR(campos.data) : "a combinar"}`,
      `Horário preferido: ${campos.hora || "a combinar"}`,
      `Observações: ${campos.obs.trim() || "-"}`,
    ].join("\n");
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validar(c);
    setErros(e);
    const primeiro = (Object.keys(e) as (keyof Campos)[]).find((k) => e[k]);
    if (primeiro) {
      refs.current[primeiro]?.focus();
      return;
    }
    setEstado("abrindo");
    const link = linkWhatsapp(montarMensagem(c));
    setUrl(link);
    const janela = window.open(link, "_blank", "noopener,noreferrer");
    // Com "noopener" alguns navegadores devolvem null mesmo abrindo; por isso o link manual fica sempre visível.
    setBloqueado(janela === null);
    window.setTimeout(() => {
      setEstado("pronto");
      statusRef.current?.focus();
    }, 350);
  }

  const campo =
    "block w-full min-h-13 rounded-2xl bg-porcelana px-4 text-[1rem] text-grafite ring-1 ring-inset ring-ameixa/18 transition-shadow placeholder:text-tinta-suave/80 hover:ring-ameixa/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-ameixa disabled:cursor-not-allowed disabled:bg-nevoa-2 disabled:text-tinta-suave";
  const comErro = "ring-2 ring-[#9b2c3f] hover:ring-[#9b2c3f]";
  const rotulo = "mb-2 block text-[0.95rem] font-semibold text-grafite";
  const ajuda = "mt-2 text-sm text-tinta-suave";
  const erro = "mt-2 text-sm font-medium text-[#9b2c3f]";
  const dataInvalida = Boolean(erros.data);

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="luz pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-10">
        <div className="lg:pt-6">
          <p className="rotulo">Praticidade</p>
          <h2 id="titulo-agendar" className="mt-4 font-serif text-[2.1rem] leading-[1.08] tracking-[-0.015em] sm:text-5xl">
            <ComEnfase text="Peça seu horário em poucos *cliques*." />
          </h2>
          <p className="mt-5 text-lg text-tinta-suave">
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega pelo WhatsApp, e a Silvia
            confirma a disponibilidade.
          </p>
          <p className="mt-4 text-tinta-suave">
            O dia e o horário escolhidos são preferências, sujeitos à confirmação.
          </p>
        </div>

        <div className="relative rounded-xl3 border border-linha bg-porcelana/95 p-5 shadow-cartao sm:p-9">
          <form noValidate onSubmit={enviar} aria-describedby={`${id}-nota`}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${id}-nome`} className={rotulo}>
                  Nome completo <span className="font-normal text-tinta-suave">(obrigatório)</span>
                </label>
                <input
                  ref={(el) => {
                    refs.current.nome = el;
                  }}
                  id={`${id}-nome`}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  placeholder="Como devemos te chamar?"
                  value={c.nome}
                  onChange={(e) => mudar("nome", e.target.value)}
                  onBlur={() => c.nome && c.nome.trim().length < 2 && setErros((e) => ({ ...e, nome: validar(c).nome }))}
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={erros.nome ? `${id}-nome-erro` : undefined}
                  className={`${campo} ${erros.nome ? comErro : ""}`}
                />
                {erros.nome ? (
                  <p id={`${id}-nome-erro`} className={erro}>
                    {erros.nome}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${id}-at`} className={rotulo}>
                  Atendimento desejado{" "}
                  {!CONFIG.agendamento.exigirAtendimento ? <span className="font-normal text-tinta-suave">(opcional)</span> : null}
                </label>
                <select
                  ref={(el) => {
                    refs.current.atendimento = el;
                  }}
                  id={`${id}-at`}
                  name="atendimento"
                  value={c.atendimento}
                  onChange={(e) => mudar("atendimento", e.target.value)}
                  aria-invalid={Boolean(erros.atendimento)}
                  aria-describedby={erros.atendimento ? `${id}-at-erro` : undefined}
                  className={`${campo} ${erros.atendimento ? comErro : ""}`}
                >
                  <option value="">Escolha um atendimento</option>
                  {opcoes.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {erros.atendimento ? (
                  <p id={`${id}-at-erro`} className={erro}>
                    {erros.atendimento}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor={`${id}-data`} className={rotulo}>
                  Data preferida <span className="font-normal text-tinta-suave">(opcional)</span>
                </label>
                <input
                  ref={(el) => {
                    refs.current.data = el;
                  }}
                  id={`${id}-data`}
                  name="data"
                  type="date"
                  min={hoje || undefined}
                  value={c.data}
                  onChange={(e) => mudar("data", e.target.value)}
                  aria-invalid={dataInvalida}
                  aria-describedby={dataInvalida ? `${id}-data-erro` : `${id}-data-ajuda`}
                  className={`${campo} ${dataInvalida ? comErro : ""}`}
                />
                {dataInvalida ? (
                  <p id={`${id}-data-erro`} className={erro}>
                    {erros.data}
                  </p>
                ) : (
                  <p id={`${id}-data-ajuda`} className={ajuda}>
                    {TODOS_OS_DIAS ? "Atendimento todos os dias da semana." : "Escolha um dia com atendimento."}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`${id}-hora`} className={rotulo}>
                  Horário preferido <span className="font-normal text-tinta-suave">(opcional)</span>
                </label>
                <select
                  id={`${id}-hora`}
                  name="hora"
                  value={c.hora}
                  disabled={!c.data || dataInvalida || blocos.length === 0}
                  onChange={(e) => mudar("hora", e.target.value)}
                  aria-describedby={`${id}-hora-ajuda`}
                  className={campo}
                >
                  <option value="">Escolha um horário</option>
                  {blocos.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <p id={`${id}-hora-ajuda`} className={ajuda}>
                  {!c.data || dataInvalida
                    ? "Escolha a data para ver os horários."
                    : blocos.length === 0
                      ? "Não há mais horários hoje. Escolha outra data."
                      : "Horários de início, sujeitos à confirmação."}
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${id}-obs`} className={rotulo}>
                  Observações <span className="font-normal text-tinta-suave">(opcional)</span>
                </label>
                <textarea
                  ref={(el) => {
                    refs.current.obs = el;
                  }}
                  id={`${id}-obs`}
                  name="obs"
                  rows={3}
                  maxLength={LIMITE_OBS}
                  placeholder="Se quiser, conte o que você precisa."
                  value={c.obs}
                  onChange={(e) => mudar("obs", e.target.value.slice(0, LIMITE_OBS))}
                  aria-invalid={Boolean(erros.obs)}
                  aria-describedby={`${id}-obs-ajuda`}
                  className={`${campo} resize-none py-3 ${erros.obs ? comErro : ""}`}
                />
                <div id={`${id}-obs-ajuda`} className="mt-2 flex justify-between gap-4 text-[0.82rem] text-tinta-suave">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="shrink-0 tabular-nums" aria-label={`${c.obs.length} de ${LIMITE_OBS} caracteres`}>
                    {c.obs.length}/{LIMITE_OBS}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={estado === "abrindo"}
              className="btn-brilho mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ameixa px-4 text-[0.95rem] sm:gap-2.5 sm:px-6 sm:text-[1.02rem] font-semibold text-porcelana shadow-suave transition-colors hover:bg-[#3e2b4b] disabled:opacity-80"
            >
              {estado === "abrindo" ? (
                <>
                  <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-porcelana/40 border-t-porcelana" />
                  Abrindo o WhatsApp…
                </>
              ) : (
                <>
                  <IconeWhatsapp /> Enviar solicitação pelo WhatsApp
                </>
              )}
            </button>
            <span data-trace="fim" className="absolute bottom-24 right-8 size-px" />

            <p id={`${id}-nota`} className="mt-4 text-center text-[0.85rem] text-tinta-suave">
              Ao enviar, você abre uma conversa no WhatsApp com a Silvia Marcondes Estética. Este site não guarda os
              dados digitados.{" "}
              <a href="/privacidade.html" className="inline-flex min-h-12 items-center font-medium text-ameixa underline underline-offset-4">
                Privacidade
              </a>
            </p>
          </form>

          <div aria-live="polite" role="status">
            {estado === "pronto" ? (
              <div
                ref={statusRef}
                tabIndex={-1}
                className="mt-6 rounded-2xl bg-[#eef1ec] p-5 text-grafite focus:outline-none focus-visible:ring-2 focus-visible:ring-ameixa"
              >
                <p className="flex gap-3 font-semibold">
                  <IconeCheck className="mt-0.5 size-5 shrink-0 text-salvia-texto" />
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A Silvia confirma a
                  disponibilidade.
                </p>
                <p className="mt-3 pl-8 text-[0.92rem] text-tinta-suave">
                  {bloqueado ? "O WhatsApp não abriu? " : "Não apareceu? "}
                  <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center font-semibold text-ameixa underline underline-offset-4">
                    Abrir WhatsApp
                  </a>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
