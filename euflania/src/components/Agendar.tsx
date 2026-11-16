import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { CONFIG } from "../config";
import { horarioDoDia, slotsDoDia, temItens, waLink } from "../lib/util";

const LIMITE_OBS = 300;
const OP_CURSOS = "Informações sobre cursos";
const OP_CONVERSAR = "Ainda não sei, quero conversar";

type Erros = Partial<Record<"nome" | "data" | "horario", string>>;

/** "2026-11-20" -> Date local (sem fuso) */
const paraData = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const isoHoje = () => {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
};
const br = (iso: string) => iso.split("-").reverse().join("/");

export function montarMensagem(v: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  return [
    "Olá! Vim pelo site da Euflânia e gostaria de solicitar um agendamento.",
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${v.atendimento || "a definir"}`,
    `Data preferida: ${v.data ? br(v.data) : "a combinar"}`,
    `Horário preferido: ${v.horario || "a combinar"}`,
    `Observações: ${v.obs.trim() || "-"}`,
  ].join("\n");
}

export function Agendar() {
  const id = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [minimo, setMinimo] = useState<string | undefined>(undefined);

  useEffect(() => setMinimo(isoHoje()), []);

  const opcoes = useMemo(
    () => [
      "Avaliação inicial",
      ...CONFIG.atendimentos.map((a) => a.nome),
      ...(temItens(CONFIG.cursos) ? [OP_CURSOS] : []),
      OP_CONVERSAR,
    ],
    [],
  );

  const dia = data ? paraData(data).getDay() : null;
  const slots = dia === null ? [] : slotsDoDia(dia);

  function validarData(v: string): string | undefined {
    if (!v) return undefined;
    const d = paraData(v);
    if (Number.isNaN(d.getTime())) return "Data inválida. Use o formato dd/mm/aaaa.";
    if (v < isoHoje()) return "Escolha uma data a partir de hoje.";
    const h = horarioDoDia(d.getDay());
    if (!h || !h.abre) return "Dia sem atendimento, escolha outra data.";
    return undefined;
  }

  function aoMudarData(v: string) {
    setData(v);
    setUrl(null);
    const err = validarData(v);
    setErros((e) => ({ ...e, data: err }));
    // mantém o horário só se ainda existir no novo dia
    if (v && !err) {
      const novos = slotsDoDia(paraData(v).getDay());
      if (!novos.includes(horario)) setHorario("");
    } else setHorario("");
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    setErros(e);
    if (Object.values(e).some(Boolean)) {
      const primeiro = e.nome ? "nome" : "data";
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    setEnviando(true);
    const link = waLink(montarMensagem({ nome, atendimento, data, horario, obs }));
    const janela = window.open(link, "_blank");
    if (janela) {
      janela.opener = null;
      setBloqueado(false);
    } else setBloqueado(true);
    setUrl(link);
    setEnviando(false);
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `${id}-${campo}-erro` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-pedra-funda">
      <div className="container-site grid gap-12 py-20 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="rotulo flex items-center gap-3 text-ouro-texto">
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            Praticidade
          </p>
          <h2 id="titulo-agendar" className="mt-6 text-5xl text-tinta md:text-6xl">
            Peça sua avaliação em poucos <em className="text-ouro-texto">cliques</em>.
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg text-grafite-suave">
            Escolha o melhor dia e horário para você. Sua solicitação chega pelo WhatsApp, e a equipe confirma a
            disponibilidade.
          </p>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <div className="relative border border-ouro/70 bg-pedra-clara p-6 sm:p-10">
            <span aria-hidden="true" className="absolute -top-px left-6 h-px w-20 bg-ouro-texto sm:left-10" />
            <form noValidate onSubmit={enviar} aria-describedby={`${id}-priv`}>
              <div className="grid gap-8">
                <div>
                  <label htmlFor={`${id}-nome`} className="rotulo text-grafite">
                    Nome completo <span aria-hidden="true" className="text-ouro-texto">*</span>
                    <span className="sr-only"> (obrigatório)</span>
                  </label>
                  <input
                    id={`${id}-nome`}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    placeholder="Como devemos te chamar?"
                    className="campo mt-1 placeholder:text-grafite-suave/80"
                    value={nome}
                    aria-invalid={!!erros.nome}
                    aria-describedby={desc("nome")}
                    onChange={(e) => {
                      setNome(e.target.value);
                      setUrl(null);
                      if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                    }}
                    onBlur={() => nome && nome.trim().length < 2 && setErros((x) => ({ ...x, nome: "Informe seu nome." }))}
                  />
                  {erros.nome && (
                    <p id={`${id}-nome-erro`} className="mt-2 text-sm text-[#9a2a1c]">
                      {erros.nome}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${id}-atend`} className="rotulo text-grafite">
                    Atendimento desejado
                  </label>
                  <select
                    id={`${id}-atend`}
                    name="atendimento"
                    className="campo mt-1"
                    value={atendimento}
                    onChange={(e) => {
                      setAtendimento(e.target.value);
                      setUrl(null);
                    }}
                  >
                    <option value="">Escolha uma opção</option>
                    {opcoes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${id}-data`} className="rotulo text-grafite">
                      Data preferida
                    </label>
                    <input
                      id={`${id}-data`}
                      name="data"
                      type="date"
                      min={minimo}
                      className="campo mt-1"
                      value={data}
                      aria-invalid={!!erros.data}
                      aria-describedby={desc("data", `${id}-data-dica`)}
                      onChange={(e) => aoMudarData(e.target.value)}
                    />
                    <p id={`${id}-data-dica`} className="mt-2 text-xs text-grafite-suave">
                      Segunda a sábado. Domingo sem atendimento.
                    </p>
                    {erros.data && (
                      <p id={`${id}-data-erro`} className="mt-1 text-sm text-[#9a2a1c]">
                        {erros.data}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`${id}-hora`} className="rotulo text-grafite">
                      Horário preferido
                    </label>
                    <select
                      id={`${id}-hora`}
                      name="horario"
                      className="campo num mt-1"
                      value={horario}
                      disabled={!data || !!erros.data}
                      aria-describedby={`${id}-hora-dica`}
                      onChange={(e) => {
                        setHorario(e.target.value);
                        setUrl(null);
                      }}
                    >
                      <option value="">Escolha um horário</option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p id={`${id}-hora-dica`} className="mt-2 text-xs text-grafite-suave">
                      {data && !erros.data ? "Preferência, sujeita à confirmação." : "Escolha uma data para ver os horários."}
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor={`${id}-obs`} className="rotulo text-grafite">
                    Observações <span className="normal-case tracking-normal text-grafite-suave">(opcional)</span>
                  </label>
                  <textarea
                    id={`${id}-obs`}
                    name="observacoes"
                    maxLength={LIMITE_OBS}
                    rows={3}
                    placeholder="Se quiser, conte o que você procura."
                    className="campo mt-1 placeholder:text-grafite-suave/80"
                    value={obs}
                    aria-describedby={`${id}-obs-dica`}
                    onChange={(e) => {
                      setObs(e.target.value.slice(0, LIMITE_OBS));
                      setUrl(null);
                    }}
                  />
                  <div id={`${id}-obs-dica`} className="mt-2 flex justify-between gap-4 text-xs text-grafite-suave">
                    <p>Não é preciso informar dados de saúde nem medidas aqui. Conversamos com calma pelo WhatsApp.</p>
                    <p className="num shrink-0" aria-live="polite">
                      {obs.length}/{LIMITE_OBS}
                    </p>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-cheio mt-10 w-full" disabled={enviando} aria-busy={enviando}>
                {enviando ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}
              </button>

              <p id={`${id}-priv`} className="mt-4 text-xs leading-relaxed text-grafite-suave">
                Ao enviar, você abre uma conversa no WhatsApp. Este site não guarda os dados digitados.{" "}
                <a href="/privacidade.html" className="link-fio text-grafite">
                  Privacidade
                </a>
              </p>

              <div aria-live="polite" role="status">
                {url && (
                  <div className="mt-8 border-t border-ouro/70 pt-6">
                    <p className="font-serif text-xl leading-snug text-tinta">
                      {bloqueado
                        ? "O navegador bloqueou a nova aba. Use o link abaixo para abrir o WhatsApp com sua solicitação."
                        : "Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade."}
                    </p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="link-fio mt-4 inline-block py-2 text-tinta">
                      Abrir WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
