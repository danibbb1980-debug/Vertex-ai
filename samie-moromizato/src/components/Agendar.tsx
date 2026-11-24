import { useId, useMemo, useState, type FormEvent } from "react";
import { atendimentosAtivos, waHref } from "../config";
import { diaSemanaISO, fmtDataBR, hojeISO, horarioDoDia, slotsDoDia } from "../lib/horarios";
import { SecNum, Title } from "./ui";

type Erros = Partial<Record<"nome" | "data" | "hora", string>>;

const OPC_CONVERSAR = "Quero conversar antes";
const OPC_NAO_SEI = "Ainda não sei, quero conversar";

export function montarMensagem(d: {
  nome: string;
  atendimento: string;
  data: string;
  hora: string;
  obs: string;
}) {
  return [
    "Olá! Vim pelo site da Samie e gostaria de solicitar um agendamento.",
    `Nome: ${d.nome.trim()}`,
    `Atendimento: ${d.atendimento || "a definir"}`,
    `Data preferida: ${d.data ? fmtDataBR(d.data) : "a combinar"}`,
    `Horário preferido: ${d.hora || "a combinar"}`,
    `Observações: ${d.obs.trim() || "-"}`,
  ].join("\n");
}

export function Agendar({ n }: { n: string }) {
  const uid = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState(OPC_CONVERSAR);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [url, setUrl] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const min = useMemo(() => hojeISO(), []);
  const ds = data ? diaSemanaISO(data) : null;
  const slots = ds === null ? [] : slotsDoDia(ds);
  const diaFechado = ds !== null && slots.length === 0;

  const opcoes = [OPC_CONVERSAR, ...atendimentosAtivos().map((a) => a.nome), OPC_NAO_SEI];

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Escreva seu nome para a Samie saber com quem fala.";
    if (data) {
      if (data < min) e.data = "Escolha uma data a partir de hoje.";
      else if (diaFechado) e.data = "Dia sem atendimento, escolha outra data.";
      else if (!hora) e.hora = "Escolha um horário para esse dia.";
    }
    return e;
  }

  function onData(v: string) {
    setData(v);
    setHora("");
    if (v && slotsDoDia(diaSemanaISO(v)).length === 0) {
      setErros((x) => ({ ...x, data: "Dia sem atendimento, escolha outra data." }));
    } else {
      setErros((x) => ({ ...x, data: undefined, hora: undefined }));
    }
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.values(e).some(Boolean)) {
      const first = e.nome ? "nome" : e.data ? "data" : "hora";
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setEnviando(true);
    const at = atendimento === OPC_CONVERSAR || atendimento === OPC_NAO_SEI ? "" : atendimento;
    const link = waHref(montarMensagem({ nome, atendimento: at, data, hora, obs }));
    setUrl(link);
    // sem a flag "noopener" para saber se o navegador bloqueou; o opener é removido logo em seguida
    const w = window.open(link, "_blank");
    if (w) w.opener = null;
    setBloqueado(!w);
    setEnviando(false);
  }

  const err = (k: keyof Erros) =>
    erros[k] ? (
      <p className="field__err" id={`${uid}-${k}-err`}>
        {erros[k]}
      </p>
    ) : null;

  const fechamento = (d: number) => horarioDoDia(d)?.fecha ?? "";

  return (
    <section className="book" id="agendar" aria-labelledby="t-book">
      <div className="wrap book__grid">
        <div className="book__intro">
          <SecNum n={n}>Praticidade</SecNum>
          <Title id="t-book" lines={["Escolha seu horário", <>em poucos <em>cliques</em>.</>]} />
          <p className="book__lead">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo
            WhatsApp, e a Samie confirma a disponibilidade.
          </p>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate aria-describedby={`${uid}-priv`}>
          <div className="form__ticks" aria-hidden="true">
            <span>08</span>
            <span>12</span>
            <span>16</span>
            <span>19</span>
          </div>

          <div className="field">
            <label htmlFor={`${uid}-nome`}>Nome completo</label>
            <input
              id={`${uid}-nome`}
              name="nome"
              autoComplete="name"
              placeholder="Como devemos te chamar?"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
              }}
              aria-invalid={!!erros.nome}
              aria-describedby={erros.nome ? `${uid}-nome-err` : undefined}
              required
            />
            {err("nome")}
          </div>

          <div className="field">
            <label htmlFor={`${uid}-at`}>Atendimento desejado</label>
            <select id={`${uid}-at`} value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
              {opcoes.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor={`${uid}-data`}>Data preferida</label>
              <input
                id={`${uid}-data`}
                type="date"
                min={min}
                value={data}
                onChange={(e) => onData(e.target.value)}
                aria-invalid={!!erros.data}
                aria-describedby={`${uid}-data-hint${erros.data ? ` ${uid}-data-err` : ""}`}
              />
              <p className="field__hint" id={`${uid}-data-hint`}>
                Domingo fechado.
              </p>
              {err("data")}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-hora`}>Horário preferido</label>
              <select
                id={`${uid}-hora`}
                value={hora}
                onChange={(e) => {
                  setHora(e.target.value);
                  setErros((x) => ({ ...x, hora: undefined }));
                }}
                disabled={!data || diaFechado}
                aria-invalid={!!erros.hora}
                aria-describedby={erros.hora ? `${uid}-hora-err` : `${uid}-hora-hint`}
              >
                <option value="">Escolha um horário</option>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {!erros.hora && (
                <p className="field__hint" id={`${uid}-hora-hint`}>
                  {ds !== null && !diaFechado
                    ? `Último início às ${slots.at(-1)}; fechamos às ${fechamento(ds)}.`
                    : "Escolha a data primeiro."}
                </p>
              )}
              {err("hora")}
            </div>
          </div>

          <div className="field">
            <label htmlFor={`${uid}-obs`}>
              Observações <span className="field__opt">(opcional)</span>
            </label>
            <textarea
              id={`${uid}-obs`}
              rows={3}
              maxLength={300}
              placeholder="Se quiser, conte o que você procura."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              aria-describedby={`${uid}-obs-hint`}
            />
            <p className="field__hint" id={`${uid}-obs-hint`}>
              Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.{" "}
              <span className="tnum">{obs.length}/300</span>
            </p>
          </div>

          <div aria-live="polite" className="form__status">
            {Object.values(erros).some(Boolean) && (
              <p className="field__err">Revise os campos marcados.</p>
            )}
            {url && (
              <div className="form__ok">
                <p>
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A Samie
                  confirma a disponibilidade.
                </p>
                <p className="small">
                  {bloqueado ? "O navegador não abriu a conversa? " : "Se a conversa não abriu, "}
                  <a className="link" href={url} target="_blank" rel="noopener noreferrer">
                    Abrir WhatsApp
                  </a>
                </p>
              </div>
            )}
          </div>

          <button className="btn btn--solid btn--block" type="submit" disabled={enviando}>
            <span className="btn__mark" aria-hidden="true">⁄</span>
            {enviando ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}
          </button>
          <p className="form__priv small" id={`${uid}-priv`}>
            Ao enviar, você abre uma conversa no WhatsApp com a Samie. Este site não guarda os dados
            digitados. <a className="link" href="/privacidade.html">Privacidade</a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Agendar;

