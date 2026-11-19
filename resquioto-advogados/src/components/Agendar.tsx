import { useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG } from "../config";
import { cx, temHorarios } from "../lib/util";
import { MarcaSecao } from "./Prumo";

const NAO_SEI = "Ainda não sei, quero conversar";
const LIMITE_OBS = 300;

const pad = (n: number) => String(n).padStart(2, "0");
const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const diaDaSemana = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).getDay();
};

/** Blocos de 1 hora dentro do expediente, sem pausas e sem o horário de fechamento. */
function blocosDoDia(iso: string): string[] {
  if (!iso) return [];
  const h = CONFIG.horarios.find((x) => x.dia === diaDaSemana(iso));
  if (!h) return [];
  const out: string[] = [];
  const agora = new Date();
  const ehHoje = iso === hojeISO();
  for (let t = minutos(h.abre); t + 60 <= minutos(h.fecha); t += 60) {
    if (h.pausa && t + 60 > minutos(h.pausa[0]) && t < minutos(h.pausa[1])) continue;
    if (ehHoje && t <= agora.getHours() * 60 + agora.getMinutes()) continue;
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return out;
}

type Erros = Partial<Record<"nome" | "data" | "hora", string>>;

export function Agendar({ n }: { n: string }) {
  const comHorarios = temHorarios();
  const [nome, setNome] = useState("");
  const [area, setArea] = useState(CONFIG.areas.length ? "" : NAO_SEI);
  const [preferencia, setPreferencia] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [url, setUrl] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const refs = { nome: useRef<HTMLInputElement>(null), data: useRef<HTMLInputElement>(null), hora: useRef<HTMLSelectElement>(null) };

  const blocos = useMemo(() => blocosDoDia(data), [data]);
  const diaFechado = comHorarios && !!data && !CONFIG.horarios.some((x) => x.dia === diaDaSemana(data));

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome completo.";
    if (comHorarios) {
      if (!data) e.data = "Escolha uma data.";
      else if (data < hojeISO()) e.data = "Escolha uma data a partir de hoje.";
      else if (diaFechado) e.data = "Dia sem atendimento, escolha outra data.";
      else if (!blocos.length) e.data = "Não há horários disponíveis nesta data, escolha outra.";
      else if (!hora) e.hora = "Escolha um horário.";
    }
    return e;
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (["nome", "data", "hora"] as const).find((k) => e[k]);
    if (primeiro) {
      refs[primeiro].current?.focus();
      return;
    }
    setEnviando(true);
    const [a, m, d] = data.split("-");
    const pref = comHorarios ? `${d}/${m}/${a} às ${hora}` : preferencia.trim() || "a combinar";
    const msg = [
      "Olá! Vim pelo site do escritório Resquioto Advogados e gostaria de solicitar um atendimento.",
      `Nome: ${nome.trim()}`,
      `Área: ${!area || area === NAO_SEI ? "a definir" : area}`,
      `Preferência de dia e horário: ${pref}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    const janela = window.open(link, "_blank", "noopener,noreferrer");
    // com noopener, alguns navegadores retornam null mesmo abrindo; o link manual fica sempre disponível
    setBloqueado(!janela);
    setUrl(link);
    setEnviando(false);
  };

  const descr = (k: keyof Erros, extra?: string) => [erros[k] ? `erro-${k}` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="relative bg-nevoa-2/70 py-24 md:py-36">
      <MarcaSecao numeral={n} />
      <div className="trilho grid gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="rotulo mb-6 text-ouro-texto">Praticidade</p>
          <h2 id="t-agendar" className="display text-[clamp(40px,5vw,72px)]">
            Peça seu atendimento em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-[40ch] text-apoio">
            {comHorarios ? "Escolha a área, o dia e o horário de preferência." : "Escolha a área e conte sua preferência de dia e horário."}{" "}
            Sua solicitação chega pelo WhatsApp e o escritório confirma a disponibilidade. Dia e horário ficam sujeitos a essa
            confirmação.
          </p>
        </div>

        <div className="relative border-t-2 border-ouro bg-nevoa p-6 sm:p-10 md:col-span-6 md:col-start-7">
          <span aria-hidden="true" className="romano absolute right-6 top-5 text-ouro-texto sm:right-10 sm:top-7">
            {n}
          </span>
          {url ? (
            <div role="status" aria-live="polite" className="py-4">
              <p className="display text-[30px] leading-[1.2]">Pronto!</p>
              <p className="mt-4 max-w-[44ch] text-apoio">
                Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. O escritório confirma a disponibilidade.
              </p>
              <p className="mt-6 text-[15px] text-apoio">
                {bloqueado ? "Se o WhatsApp não abriu, use o link abaixo." : "O WhatsApp não abriu?"}
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-cheio">
                  Abrir WhatsApp<span className="sr-only"> (nova aba)</span>
                </a>
                <button type="button" className="btn btn-linha" onClick={() => setUrl(null)}>
                  Editar solicitação
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} aria-describedby="aviso-form">
              <div aria-live="polite" className="sr-only">
                {Object.values(erros).filter(Boolean).length
                  ? `Há ${Object.values(erros).filter(Boolean).length} campo(s) para corrigir.`
                  : ""}
              </div>

              <div className="mb-8">
                <label htmlFor="f-nome" className="block text-[15px] font-medium">
                  Nome completo <span className="text-apoio">(obrigatório)</span>
                </label>
                <input
                  ref={refs.nome}
                  id="f-nome"
                  name="nome"
                  autoComplete="name"
                  className="campo"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={!!erros.nome}
                  aria-describedby={descr("nome")}
                  required
                />
                {erros.nome && (
                  <p id="erro-nome" className="mt-2 text-[14px] text-[#9b2c1f]">
                    {erros.nome}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <label htmlFor="f-area" className="block text-[15px] font-medium">
                  Área desejada
                </label>
                <select id="f-area" name="area" className="campo" value={area} onChange={(e) => setArea(e.target.value)}>
                  {CONFIG.areas.length > 0 && <option value="">Selecione</option>}
                  {CONFIG.areas.map((a) => (
                    <option key={a.nome} value={a.nome}>
                      {a.nome}
                    </option>
                  ))}
                  <option value={NAO_SEI}>{NAO_SEI}</option>
                </select>
              </div>

              {comHorarios ? (
                <div className="mb-8 grid gap-8 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label htmlFor="f-data" className="block text-[15px] font-medium">
                      Dia de preferência
                    </label>
                    <input
                      ref={refs.data}
                      id="f-data"
                      type="date"
                      name="data"
                      className="campo"
                      min={hojeISO()}
                      value={data}
                      onChange={(e) => {
                        setData(e.target.value);
                        setHora("");
                      }}
                      aria-invalid={!!erros.data || diaFechado}
                      aria-describedby={descr("data", diaFechado && !erros.data ? "aviso-dia" : undefined)}
                    />
                    {diaFechado && !erros.data && (
                      <p id="aviso-dia" className="mt-2 text-[14px] text-[#9b2c1f]">
                        Dia sem atendimento, escolha outra data.
                      </p>
                    )}
                    {erros.data && (
                      <p id="erro-data" className="mt-2 text-[14px] text-[#9b2c1f]">
                        {erros.data}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="f-hora" className="block text-[15px] font-medium">
                      Horário de preferência
                    </label>
                    <select
                      ref={refs.hora}
                      id="f-hora"
                      name="hora"
                      className="campo"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      disabled={!blocos.length}
                      aria-invalid={!!erros.hora}
                      aria-describedby={descr("hora")}
                    >
                      <option value="">{data ? (blocos.length ? "Selecione" : "Sem horários") : "Escolha o dia antes"}</option>
                      {blocos.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {erros.hora && (
                      <p id="erro-hora" className="mt-2 text-[14px] text-[#9b2c1f]">
                        {erros.hora}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <label htmlFor="f-pref" className="block text-[15px] font-medium">
                    Melhor dia e horário <span className="text-apoio">(opcional)</span>
                  </label>
                  <input
                    id="f-pref"
                    name="preferencia"
                    className="campo"
                    placeholder="Ex.: terça à tarde"
                    maxLength={80}
                    value={preferencia}
                    onChange={(e) => setPreferencia(e.target.value)}
                  />
                </div>
              )}

              <div className="mb-8">
                <label htmlFor="f-obs" className="block text-[15px] font-medium">
                  Observações <span className="text-apoio">(opcional)</span>
                </label>
                <textarea
                  id="f-obs"
                  name="observacoes"
                  className="campo"
                  placeholder="Se quiser, conte o que você precisa."
                  maxLength={LIMITE_OBS}
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-describedby="aviso-obs contador-obs"
                />
                <div className="mt-2 flex justify-between gap-4 text-[13px] text-apoio">
                  <p id="aviso-obs" className="max-w-[40ch]">
                    Não é preciso detalhar o caso aqui, nem enviar documentos ou dados sigilosos. Conversamos com calma pelo
                    WhatsApp.
                  </p>
                  <span id="contador-obs" aria-live="off" className="shrink-0 tabular-nums">
                    {obs.length}/{LIMITE_OBS}
                  </span>
                </div>
              </div>

              <button type="submit" disabled={enviando} className={cx("btn btn-cheio w-full", enviando && "opacity-70")}>
                {enviando ? "Abrindo o WhatsApp..." : "Enviar solicitação pelo WhatsApp"}
              </button>
              <p id="aviso-form" className="mt-4 text-[13px] leading-[1.6] text-apoio">
                Ao enviar, você abre uma conversa no WhatsApp com o escritório. Este site não guarda os dados digitados.{" "}
                <a href="/privacidade.html" className="link-sub">
                  Saiba como tratamos a privacidade
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
