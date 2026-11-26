import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONFIG, servicosAtivos } from "./config";
import { Lines, SecLabel, diaDaSemana, hojeNoFuso, horariosDoDia } from "./lib";

const NAO_SEI = "Ainda não sei, quero conversar";
const MAX_OBS = 300;

type Erros = Partial<Record<"nome" | "veiculo" | "data" | "horario", string>>;

function dataBR(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function montarMensagem(f: {
  nome: string;
  servico: string;
  veiculo: string;
  data: string;
  horario: string;
  obs: string;
}) {
  return [
    "Olá! Vim pelo site da Araujo Estética Automotiva e gostaria de pedir um horário.",
    `Nome: ${f.nome.trim()}`,
    `Serviço: ${f.servico && f.servico !== NAO_SEI ? f.servico : "a definir"}`,
    `Veículo: ${f.veiculo.trim()}`,
    `Data preferida: ${f.data ? dataBR(f.data) : "a combinar"}`,
    `Horário preferido: ${f.horario || "a combinar"}`,
    `Observações: ${f.obs.trim() || "-"}`,
  ].join("\n");
}

export function Agendar({ n }: { n: string }) {
  const [nome, setNome] = useState("");
  const [servico, setServico] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [min, setMin] = useState<string | undefined>(undefined);
  const [estado, setEstado] = useState<"idle" | "abrindo" | "ok">("idle");
  const [url, setUrl] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMin(hojeNoFuso().iso), []);

  const dia = data ? diaDaSemana(data) : null;
  const slots = dia === null ? [] : horariosDoDia(dia);

  function validarData(v: string): string | undefined {
    if (!v) return undefined;
    const hoje = hojeNoFuso().iso;
    if (v < hoje) return "Escolha uma data a partir de hoje.";
    if (horariosDoDia(diaDaSemana(v)).length === 0) return "Dia sem atendimento, escolha outra data.";
    return undefined;
  }

  function onData(v: string) {
    setData(v);
    setHorario("");
    setErros((e) => ({ ...e, data: validarData(v), horario: undefined }));
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Escreva o seu nome.";
    if (veiculo.trim().length < 2) e.veiculo = "Informe o veículo, por exemplo: Onix 2020.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horario && !slots.includes(horario)) e.horario = "Escolha um horário da lista.";
    setErros(e);
    const first = (Object.keys(e) as (keyof Erros)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setEstado("abrindo");
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
      montarMensagem({ nome, servico, veiculo, data, horario, obs }),
    )}`;
    setUrl(link);
    // abre sem a flag para detectar bloqueio de pop-up; o opener é cortado logo em seguida (equivale a noopener)
    const w = window.open(link, "_blank");
    if (w) w.opener = null;
    setBloqueado(!w);
    setEstado("ok");
    requestAnimationFrame(() => doneRef.current?.focus());
  }

  if (!CONFIG.secoes.agendar || !CONFIG.usarWhatsapp) return null;

  const err = (k: keyof Erros) =>
    erros[k] ? (
      <p className="err" id={`err-${k}`}>
        {erros[k]}
      </p>
    ) : null;
  const aria = (k: keyof Erros, hint?: string) => ({
    "aria-invalid": erros[k] ? (true as const) : undefined,
    "aria-describedby": [erros[k] ? `err-${k}` : "", hint ?? ""].filter(Boolean).join(" ") || undefined,
  });

  return (
    <section className="section bg-graphite" id="agendar" aria-labelledby="t-agendar">
      <div className="wrap grid">
        <div className="book-intro" data-reveal>
          <SecLabel n={n}>Praticidade</SecLabel>
          <h2 className="h2" id="t-agendar">
            <Lines lines={["Peça seu horário", <>em poucos <span className="thin">cliques.</span></>]} />
          </h2>
          <p className="lead" style={{ marginTop: "var(--s-3)" }}>
            Escolha o serviço, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a
            confirmação da disponibilidade é feita por lá.
          </p>
        </div>
        <div className="book-card">
          <form className="card" ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-legal">
            <div aria-live="polite">
              {estado === "ok" && (
                <div className="done" ref={doneRef} tabIndex={-1}>
                  <p>
                    <strong>Pronto!</strong> Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A
                    confirmação da disponibilidade é feita pelo WhatsApp.
                  </p>
                  <p>
                    {bloqueado ? "O navegador bloqueou a nova aba. " : "Se a conversa não abriu, "}
                    <a className="link" href={url} target="_blank" rel="noopener noreferrer">
                      <span>Abrir WhatsApp</span>
                    </a>
                  </p>
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-nome">Nome completo</label>
              <input
                id="f-nome"
                name="nome"
                type="text"
                autoComplete="name"
                placeholder="Como devemos te chamar?"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                {...aria("nome")}
              />
              {err("nome")}
            </div>

            <div className="field">
              <label htmlFor="f-servico">Serviço desejado</label>
              <select id="f-servico" name="servico" value={servico} onChange={(e) => setServico(e.target.value)}>
                <option value="">Escolha um serviço</option>
                {servicosAtivos.map((s) => (
                  <option key={s.id} value={s.nome}>
                    {s.nome}
                  </option>
                ))}
                <option value={NAO_SEI}>{NAO_SEI}</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-veiculo">Veículo</label>
              <input
                id="f-veiculo"
                name="veiculo"
                type="text"
                placeholder="Marca, modelo e ano, por exemplo: Onix 2020"
                value={veiculo}
                maxLength={80}
                onChange={(e) => setVeiculo(e.target.value)}
                required
                {...aria("veiculo")}
              />
              {err("veiculo")}
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="f-data">
                  Data preferida <span className="opt">(opcional)</span>
                </label>
                <input
                  id="f-data"
                  name="data"
                  type="date"
                  min={min}
                  value={data}
                  onChange={(e) => onData(e.target.value)}
                  {...aria("data", "hint-data")}
                />
                <p className="hint" id="hint-data">
                  Domingo sem atendimento.
                </p>
                {err("data")}
              </div>
              <div className="field">
                <label htmlFor="f-horario">
                  Horário preferido <span className="opt">(opcional)</span>
                </label>
                <select
                  id="f-horario"
                  name="horario"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  disabled={!data || !!erros.data}
                  {...aria("horario", "hint-horario")}
                >
                  <option value="">Escolha um horário</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <p className="hint" id="hint-horario">
                  {data ? "Preferência, sujeita à confirmação." : "Escolha a data primeiro."}
                </p>
                {err("horario")}
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-obs">
                Observações <span className="opt">(opcional)</span>
              </label>
              <textarea
                id="f-obs"
                name="obs"
                placeholder="Se quiser, conte o que o seu veículo precisa."
                maxLength={MAX_OBS}
                value={obs}
                onChange={(e) => setObs(e.target.value.slice(0, MAX_OBS))}
                aria-describedby="count-obs"
              />
              <span className="count" id="count-obs" aria-live="off">
                {obs.length}/{MAX_OBS}
              </span>
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: "100%" }} aria-disabled={estado === "abrindo"}>
              {estado === "abrindo" ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}
            </button>
            <p className="legal" id="form-legal">
              Ao enviar, você abre uma conversa no WhatsApp com a Araujo Estética Automotiva. Este site não guarda
              os dados digitados.{" "}
              <a href="/privacidade.html">Como tratamos a privacidade</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

