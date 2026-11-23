import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { CONFIG, atendimentosAtivos } from "../config";
import { SectionMark } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");
const isoHoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Blocos de 1 hora a partir de CONFIG.horarios, sem o horário de fechamento. */
export function horariosDoDia(dia: number | null): string[] {
  const lista = dia === null ? CONFIG.horarios.filter((h) => h.abre) : CONFIG.horarios.filter((h) => h.dia === dia && h.abre);
  const set = new Set<string>();
  for (const h of lista) {
    const a = parseInt(h.abre!, 10);
    const f = parseInt(h.fecha!, 10);
    for (let x = a; x < f; x++) set.add(`${pad(x)}:00`);
  }
  return Array.from(set).sort();
}

const diaFechado = (dia: number) => !CONFIG.horarios.some((h) => h.dia === dia && h.abre);

type Erros = Partial<Record<"nome" | "data" | "hora", string>>;

export default function Agendar() {
  const uid = useId();
  const ativos = atendimentosAtivos();
  const [nome, setNome] = useState("");
  const [atend, setAtend] = useState("");
  const [data, setData] = useState("");
  const [horaSel, setHoraSel] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [url, setUrl] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [status, setStatus] = useState("");
  const [minData, setMinData] = useState<string | undefined>(undefined);
  useEffect(() => setMinData(isoHoje()), []);

  const dia = data ? parseIso(data).getDay() : null;
  const horas = useMemo(() => (dia !== null && diaFechado(dia) ? [] : horariosDoDia(dia)), [dia]);

  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;

  function validarData(v: string): string | undefined {
    if (!v) return undefined;
    if (v < isoHoje()) return "Escolha uma data a partir de hoje.";
    if (diaFechado(parseIso(v).getDay())) return "Dia sem atendimento, escolha outra data.";
    return undefined;
  }

  function onData(v: string) {
    setData(v);
    const err = validarData(v);
    setErros((e) => ({ ...e, data: err }));
    if (v && !err) {
      const ok = horariosDoDia(parseIso(v).getDay());
      if (horaSel && !ok.includes(horaSel)) setHoraSel("");
    }
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horaSel && !horas.includes(horaSel)) e.hora = "Escolha um horário disponível para esse dia.";
    setErros(e);
    if (Object.values(e).some(Boolean)) {
      setStatus("Revise os campos destacados.");
      const first = e.nome ? "nome" : e.data ? "data" : "hora";
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    const dataBr = data ? data.split("-").reverse().join("/") : "a combinar";
    const msg = [
      "Olá! Vim pelo site da Suzane Rodrigues e gostaria de solicitar um agendamento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atend || "a definir"}`,
      `Data preferida: ${dataBr}`,
      `Horário preferido: ${horaSel || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    setUrl(link);
    const w = window.open(link, "_blank", "noopener,noreferrer");
    // com "noopener" o retorno é sempre null; tratamos o link visível como garantia de acesso
    setBloqueado(w === null);
    setStatus("Pronto! Abrimos o WhatsApp com sua solicitação.");
  }

  const descr = (k: keyof Erros, extra?: string) => [erros[k] ? `${uid}-${k}-err` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <section id="agendar" className="sec ag" aria-labelledby="ag-t">
      <div className="wrap ag__grid">
        <div className="ag__side">
          <SectionMark n="06">Praticidade</SectionMark>
          <h2 id="ag-t" className="h2">
            Peça sua avaliação em poucos <em>cliques</em>.
          </h2>
          <p className="lead">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a Suzane confirma a disponibilidade.
          </p>
        </div>

        <div className="card">
          <svg className="card__lines" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
            <path d="M200 30 C150 34 120 60 118 100 C116 140 150 170 200 172" />
            <path d="M200 56 C166 60 146 78 145 102 C144 128 166 146 200 148" />
            <path d="M200 80 C180 84 172 92 172 104 C172 116 182 124 200 124" className="is-accent" />
          </svg>

          {url ? (
            <div className="done" role="status" aria-live="polite">
              <p className="done__t">Pronto! Abrimos o WhatsApp com sua solicitação.</p>
              <p>É só enviar a mensagem. A Suzane confirma a disponibilidade.</p>
              <p className="small">
                {bloqueado ? "Se o WhatsApp não abriu, use o link abaixo." : "Se a conversa não abriu, use o link abaixo."}
              </p>
              <div className="done__btns">
                <a className="btn btn--solid" href={url} target="_blank" rel="noopener noreferrer">
                  <span>Abrir WhatsApp</span>
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                <button type="button" className="btn btn--line" onClick={() => setUrl(null)}>
                  <span>Editar solicitação</span>
                </button>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={enviar} noValidate>
              <div className={`fld ${erros.nome ? "has-err" : ""}`}>
                <label htmlFor={`${uid}-nome`}>
                  Nome completo <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`${uid}-nome`}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                  }}
                  aria-invalid={!!erros.nome}
                  aria-describedby={descr("nome")}
                />
                {erros.nome && (
                  <p id={`${uid}-nome-err`} className="fld__err">
                    {erros.nome}
                  </p>
                )}
              </div>

              <div className="fld">
                <label htmlFor={`${uid}-atend`}>Atendimento desejado</label>
                <select id={`${uid}-atend`} name="atendimento" value={atend} onChange={(e) => setAtend(e.target.value)}>
                  <option value="">Avaliação</option>
                  {ativos.map((a) => (
                    <option key={a.id} value={a.nome}>
                      {a.nome}
                    </option>
                  ))}
                  <option value="Ainda não sei, quero conversar">Ainda não sei, quero conversar</option>
                </select>
              </div>

              <div className="form__row">
                <div className={`fld ${erros.data ? "has-err" : ""}`}>
                  <label htmlFor={`${uid}-data`}>Data preferida</label>
                  <input
                    id={`${uid}-data`}
                    name="data"
                    type="date"
                    min={minData}
                    value={data}
                    onChange={(e) => onData(e.target.value)}
                    aria-invalid={!!erros.data}
                    aria-describedby={descr("data", `${uid}-data-h`)}
                  />
                  <p id={`${uid}-data-h`} className="fld__hint">
                    Sem atendimento aos domingos.
                  </p>
                  {erros.data && (
                    <p id={`${uid}-data-err`} className="fld__err">
                      {erros.data}
                    </p>
                  )}
                </div>
                <div className={`fld ${erros.hora ? "has-err" : ""}`}>
                  <label htmlFor={`${uid}-hora`}>Horário preferido</label>
                  <select
                    id={`${uid}-hora`}
                    name="horario"
                    value={horaSel}
                    onChange={(e) => {
                      setHoraSel(e.target.value);
                      if (erros.hora) setErros((x) => ({ ...x, hora: undefined }));
                    }}
                    aria-invalid={!!erros.hora}
                    aria-describedby={descr("hora", `${uid}-hora-h`)}
                    disabled={!!data && horas.length === 0}
                  >
                    <option value="">Escolha um horário</option>
                    {horas.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <p id={`${uid}-hora-h`} className="fld__hint">
                    {dia === 6 ? "Sábado: das 08:00 às 12:00." : data ? "Segunda a sexta: das 08:00 às 17:00." : "As opções mudam conforme o dia."}
                  </p>
                  {erros.hora && (
                    <p id={`${uid}-hora-err`} className="fld__err">
                      {erros.hora}
                    </p>
                  )}
                </div>
              </div>

              <div className="fld">
                <label htmlFor={`${uid}-obs`}>
                  Observações <span className="fld__opt">(opcional)</span>
                </label>
                <textarea
                  id={`${uid}-obs`}
                  name="observacoes"
                  rows={3}
                  maxLength={300}
                  placeholder="Se quiser, conte o que você procura."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-describedby={`${uid}-obs-h`}
                />
                <p id={`${uid}-obs-h`} className="fld__hint fld__hint--split">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="num" aria-label={`${obs.length} de 300 caracteres`}>
                    {obs.length}/300
                  </span>
                </p>
              </div>

              <p className="sr-only" aria-live="assertive">
                {status}
              </p>

              <button type="submit" className="btn btn--solid btn--full">
                <span>Enviar solicitação pelo WhatsApp</span>
              </button>
              <p className="form__legal">
                Ao enviar, você abre uma conversa no WhatsApp com a Suzane. Este site não guarda os dados digitados.{" "}
                <a href="/privacidade.html">Como tratamos a privacidade</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
