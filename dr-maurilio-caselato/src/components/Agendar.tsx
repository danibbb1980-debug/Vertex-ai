import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG, waLink } from "../config";
import { CropMarks } from "./Marks";

const LIMITE_OBS = 300;
const A_DEFINIR = "Ainda não sei, quero conversar";

const pad = (n: number) => String(n).padStart(2, "0");
const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const diaDaSemana = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).getDay();
};
const formatarData = (iso: string) => {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};
const horarioDoDia = (dia: number) => CONFIG.horarios.find((h) => h.diaSemana === dia);

/** Blocos de 1 hora a partir da abertura, sem incluir o horário de fechamento. */
function horariosPara(iso: string): string[] {
  const dias = iso ? [diaDaSemana(iso)] : [1, 2, 3, 4, 5, 6, 0];
  const set = new Set<string>();
  for (const d of dias) {
    const h = horarioDoDia(d);
    if (!h || !("abre" in h)) continue;
    const ini = Number(h.abre.slice(0, 2));
    const fim = Number(h.fecha.slice(0, 2));
    for (let x = ini; x < fim; x++) set.add(`${pad(x)}:00`);
  }
  return [...set].sort();
}

type Erros = Partial<Record<"nome" | "data" | "horario" | "obs", string>>;

export function Agendar() {
  const id = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState<{ url: string; bloqueado: boolean } | null>(null);
  const [aviso, setAviso] = useState("");
  const refs = {
    nome: useRef<HTMLInputElement>(null),
    data: useRef<HTMLInputElement>(null),
    horario: useRef<HTMLSelectElement>(null),
    obs: useRef<HTMLTextAreaElement>(null),
  };

  const horarios = useMemo(() => horariosPara(data), [data]);
  const minimo = hojeISO();

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined;
    if (v < minimo) return "Escolha uma data a partir de hoje.";
    const h = horarioDoDia(diaDaSemana(v));
    if (!h || !("abre" in h)) return "Dia sem atendimento, escolha outra data.";
    return undefined;
  };

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome completo.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horario && !horarios.includes(horario)) e.horario = "Escolha um horário dentro do atendimento deste dia.";
    if (obs.length > LIMITE_OBS) e.obs = `Use no máximo ${LIMITE_OBS} caracteres.`;
    return e;
  };

  const aoMudarData = (v: string) => {
    setData(v);
    const e = validarData(v);
    setErros((s) => ({ ...s, data: e }));
    if (horario && !horariosPara(v).includes(horario)) setHorario("");
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (Object.keys(e) as (keyof Erros)[]).find((k) => e[k]);
    if (primeiro) {
      setAviso("Revise os campos destacados antes de enviar.");
      refs[primeiro].current?.focus();
      return;
    }
    setAviso("");
    setEnviando(true);
    const mensagem = [
      `Olá! Vim pelo site do ${CONFIG.nome} e gostaria de solicitar um agendamento.`,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento && atendimento !== A_DEFINIR ? atendimento : "a definir"}`,
      `Data preferida: ${data ? formatarData(data) : "a combinar"}`,
      `Horário preferido: ${horario || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const url = waLink(mensagem);
    // Abre sem a flag "noopener" para saber se o bloqueador impediu a aba, e corta o opener em seguida (mesmo efeito).
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null;
    setPronto({ url, bloqueado: janela === null });
    setEnviando(false);
  };

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `${id}-${campo}-erro` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <section className="secao agendar" id="agendar" aria-labelledby="agendar-titulo">
      <div className="wrap agendar-grid">
        <div className="agendar-intro">
          <p className="rotulo">Praticidade</p>
          <h2 id="agendar-titulo" className="titulo-secao">
            Peça sua avaliação em poucos <em>cliques</em>.
          </h2>
          <p className="texto-apoio">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a equipe confirma a
            disponibilidade.
          </p>
          <p className="texto-pequeno">Data e horário escolhidos dependem da confirmação da equipe.</p>
        </div>

        <div className="form-cartao">
          <CropMarks />
          {pronto ? (
            <div className="form-pronto" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
              <p className="form-pronto-titulo">
                Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A clínica confirma a disponibilidade.
              </p>
              <p>{pronto.bloqueado ? "O navegador bloqueou a nova aba. Use o link abaixo." : "Se a conversa não abriu, use o link abaixo."}</p>
              <a className="btn btn-primario" href={pronto.url} target="_blank" rel="noopener noreferrer">
                <span className="btn-label">Abrir WhatsApp</span>
                <span className="sr-only"> (nova aba)</span>
              </a>
              <button type="button" className="link-sutil" onClick={() => setPronto(null)}>
                Voltar ao formulário
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} aria-describedby={`${id}-privacidade`}>
              <div className={`campo ${erros.nome ? "tem-erro" : ""}`}>
                <label htmlFor={`${id}-nome`}>
                  Nome completo <span className="obrigatorio">(obrigatório)</span>
                </label>
                <input
                  ref={refs.nome}
                  id={`${id}-nome`}
                  name="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                  }}
                  aria-invalid={!!erros.nome}
                  aria-describedby={desc("nome")}
                  required
                  maxLength={120}
                />
                {erros.nome && (
                  <p className="erro" id={`${id}-nome-erro`}>
                    {erros.nome}
                  </p>
                )}
              </div>

              <div className="campo">
                <label htmlFor={`${id}-at`}>Atendimento desejado</label>
                <select id={`${id}-at`} name="atendimento" value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
                  <option value="">Avaliação</option>
                  {CONFIG.atendimentos.map((a) => (
                    <option key={a.nome} value={a.nome}>
                      {a.nome}
                    </option>
                  ))}
                  <option value={A_DEFINIR}>{A_DEFINIR}</option>
                </select>
              </div>

              <div className="campo-par">
                <div className={`campo ${erros.data ? "tem-erro" : ""}`}>
                  <label htmlFor={`${id}-data`}>Data preferida</label>
                  <input
                    ref={refs.data}
                    id={`${id}-data`}
                    name="data"
                    type="date"
                    min={minimo}
                    value={data}
                    onChange={(e) => aoMudarData(e.target.value)}
                    aria-invalid={!!erros.data}
                    aria-describedby={desc("data", `${id}-data-dica`)}
                  />
                  <p className="dica" id={`${id}-data-dica`}>
                    Segunda a sexta.
                  </p>
                  {erros.data && (
                    <p className="erro" id={`${id}-data-erro`}>
                      {erros.data}
                    </p>
                  )}
                </div>
                <div className={`campo ${erros.horario ? "tem-erro" : ""}`}>
                  <label htmlFor={`${id}-hora`}>Horário preferido</label>
                  <select
                    ref={refs.horario}
                    id={`${id}-hora`}
                    name="horario"
                    value={horario}
                    onChange={(e) => {
                      setHorario(e.target.value);
                      if (erros.horario) setErros((x) => ({ ...x, horario: undefined }));
                    }}
                    aria-invalid={!!erros.horario}
                    aria-describedby={desc("horario")}
                    disabled={!!data && !!validarData(data)}
                  >
                    <option value="">Escolha um horário</option>
                    {horarios.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  {erros.horario && (
                    <p className="erro" id={`${id}-horario-erro`}>
                      {erros.horario}
                    </p>
                  )}
                </div>
              </div>

              <div className={`campo ${erros.obs ? "tem-erro" : ""}`}>
                <label htmlFor={`${id}-obs`}>
                  Observações <span className="obrigatorio">(opcional)</span>
                </label>
                <textarea
                  ref={refs.obs}
                  id={`${id}-obs`}
                  name="observacoes"
                  rows={3}
                  maxLength={LIMITE_OBS}
                  placeholder="Se quiser, conte o que você procura."
                  value={obs}
                  onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                  aria-invalid={!!erros.obs}
                  aria-describedby={desc("obs", `${id}-obs-dica`)}
                />
                <p className="dica dica-linha" id={`${id}-obs-dica`}>
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="contador" aria-hidden="true">
                    {obs.length}/{LIMITE_OBS}
                  </span>
                </p>
                {erros.obs && (
                  <p className="erro" id={`${id}-obs-erro`}>
                    {erros.obs}
                  </p>
                )}
              </div>

              <p className="sr-only" aria-live="assertive">
                {aviso}
              </p>
              {aviso && (
                <p className="erro erro-geral" aria-hidden="true">
                  {aviso}
                </p>
              )}

              <button type="submit" className="btn btn-primario btn-largo" disabled={enviando} aria-busy={enviando}>
                <span className="btn-label">{enviando ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}</span>
              </button>
              <p className="texto-pequeno" id={`${id}-privacidade`}>
                Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                <a href="/privacidade.html">Política de privacidade</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
