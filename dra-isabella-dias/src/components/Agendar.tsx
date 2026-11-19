import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG, atendimentosAtivos, modoWhatsapp, waHref } from "../config";
import { Indice } from "./comum";

const minutos = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Blocos de 1 hora que terminam até o fechamento de cada turno. */
export function horariosDoDia(diaSemana: number): string[] {
  const d = CONFIG.horarios.find((h) => h.diaSemana === diaSemana);
  if (!d) return [];
  const out: string[] = [];
  for (const [ini, fim] of d.turnos) {
    for (let m = minutos(ini); m + 60 <= minutos(fim); m += 60) out.push(fmt(m));
  }
  return out;
}

const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const diaDaData = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
};
const dataBR = (iso: string) => iso.split("-").reverse().join("/");

export function montarMensagem(v: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  return [
    "Olá! Vim pelo site da Dra. Isabella Dias e gostaria de solicitar um agendamento.",
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${v.atendimento || "a definir"}`,
    `Data preferida: ${v.data ? dataBR(v.data) : "a combinar"}`,
    `Horário preferido: ${v.horario || "a combinar"}`,
    `Observações: ${v.obs.trim() || "-"}`,
  ].join("\n");
}

export function Agendar() {
  const uid = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<{ nome?: string; data?: string }>({});
  const [enviado, setEnviado] = useState<{ url: string; bloqueado: boolean } | null>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);

  const dataInvalida = (iso: string) => {
    if (!iso) return "";
    if (iso < hojeISO()) return "Escolha uma data a partir de hoje.";
    const dia = diaDaData(iso);
    if (horariosDoDia(dia).length === 0) return "Dia sem atendimento, escolha outra data.";
    return "";
  };

  const opcoesHorario = useMemo(() => {
    if (data && !dataInvalida(data)) return horariosDoDia(diaDaData(data));
    return horariosDoDia(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!CONFIG.secoes.agendar || !modoWhatsapp()) return null;

  const opcoesAtend = ["Avaliação", ...atendimentosAtivos().map((a) => a.nome), "Ainda não sei, quero conversar"];

  const onData = (v: string) => {
    setData(v);
    const e = dataInvalida(v);
    setErros((x) => ({ ...x, data: e || undefined }));
    if (!e && horario && !horariosDoDia(diaDaData(v)).includes(horario)) setHorario("");
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const novos: typeof erros = {};
    if (nome.trim().length < 2) novos.nome = "Informe seu nome.";
    const ed = dataInvalida(data);
    if (ed) novos.data = ed;
    setErros(novos);
    if (novos.nome) return nomeRef.current?.focus();
    if (novos.data) return dataRef.current?.focus();
    const url = waHref(montarMensagem({ nome, atendimento, data, horario, obs }));
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null; // equivalente a noopener, sem perder a detecção de bloqueio
    setEnviado({ url, bloqueado: !janela });
  };

  const id = (s: string) => `${uid}-${s}`;

  return (
    <section className="secao secao-tinta" id="agendar" aria-labelledby="titulo-agendar">
      <div className="wrap agendar-grid">
        <div>
          <Indice codigo="C2" rotulo="Praticidade" />
          <h2 id="titulo-agendar" className="display h2">
            Peça sua avaliação em poucos <em>cliques</em>.
          </h2>
          <p className="texto-apoio" style={{ marginTop: 24 }}>
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e o
            consultório confirma a disponibilidade.
          </p>
        </div>
        <div className="form-cartao">
          <div aria-live="polite">
            {enviado && (
              <div className="form-ok">
                <p>
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. O consultório confirma a
                  disponibilidade.
                </p>
                <p style={{ marginTop: 8 }}>
                  {enviado.bloqueado ? "Se a conversa não abriu, use o link: " : "Não abriu? "}
                  <a href={enviado.url} target="_blank" rel="noopener noreferrer" className="link-sub">
                    Abrir WhatsApp
                  </a>
                </p>
              </div>
            )}
          </div>
          <form noValidate onSubmit={enviar}>
            <div className="campo-form">
              <label htmlFor={id("nome")}>Nome completo</label>
              <input
                ref={nomeRef}
                id={id("nome")}
                name="nome"
                autoComplete="name"
                placeholder="Como devemos te chamar?"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (erros.nome && e.target.value.trim().length >= 2) setErros((x) => ({ ...x, nome: undefined }));
                }}
                required
                aria-required="true"
                aria-invalid={!!erros.nome}
                aria-describedby={erros.nome ? id("nome-erro") : undefined}
              />
              {erros.nome && (
                <p className="erro" id={id("nome-erro")} role="alert">
                  {erros.nome}
                </p>
              )}
            </div>
            <div className="campo-form">
              <label htmlFor={id("atend")}>
                Atendimento desejado <span className="opc">(opcional)</span>
              </label>
              <select id={id("atend")} value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
                <option value="">Escolha uma opção</option>
                {opcoesAtend.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo-form">
              <label htmlFor={id("data")}>
                Data preferida <span className="opc">(opcional)</span>
              </label>
              <input
                ref={dataRef}
                id={id("data")}
                type="date"
                min={hojeISO()}
                value={data}
                onChange={(e) => onData(e.target.value)}
                aria-invalid={!!erros.data}
                aria-describedby={erros.data ? id("data-erro") : id("data-ajuda")}
              />
              {erros.data ? (
                <p className="erro" id={id("data-erro")} role="alert">
                  {erros.data}
                </p>
              ) : (
                <p className="ajuda" id={id("data-ajuda")}>
                  Atendimento de segunda a sexta-feira.
                </p>
              )}
            </div>
            <div className="campo-form">
              <label htmlFor={id("hora")}>
                Horário preferido <span className="opc">(opcional)</span>
              </label>
              <select id={id("hora")} value={horario} onChange={(e) => setHorario(e.target.value)}>
                <option value="">Escolha um horário</option>
                {opcoesHorario.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo-form">
              <label htmlFor={id("obs")}>
                Observações <span className="opc">(opcional)</span>
              </label>
              <textarea
                id={id("obs")}
                maxLength={300}
                placeholder="Se quiser, conte o que você procura."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                aria-describedby={id("obs-ajuda")}
              />
              <p className="ajuda" id={id("obs-ajuda")}>
                Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp. ({obs.length}/300)
              </p>
            </div>
            <button type="submit" className="btn" style={{ width: "100%" }}>
              Enviar solicitação pelo WhatsApp
            </button>
            <p className="form-legal">
              Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
              <a href="/privacidade.html">Privacidade</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
