import { useId, useMemo, useState, type FormEvent } from "react";
import { CONFIG, linkWhatsapp, sede } from "../config";
import { Cabecalho, IconeWhatsapp } from "./ui";

/** Blocos de 1 hora que terminam até o fechamento, fora do almoço. */
export function horariosDoDia(dia: number): string[] {
  const h = sede().horarios?.find((x) => x.dia === dia);
  if (!h?.abre || !h.fecha) return [];
  const min = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const out: string[] = [];
  for (let m = min(h.abre); m + 60 <= min(h.fecha); m += 60) {
    if (h.almocoInicio && h.almocoFim && m + 60 > min(h.almocoInicio) && m < min(h.almocoFim)) continue;
    out.push(fmt(m));
  }
  return out;
}

const hojeISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const diaDaSemana = (iso: string) => new Date(`${iso}T12:00:00`).getDay();
const br = (iso: string) => iso.split("-").reverse().join("/");

type Erros = Partial<Record<"nome" | "atendimento" | "data" | "hora", string>>;

export function Agendar({ n }: { n: string }) {
  const id = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [advogado, setAdvogado] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");

  const opcoes = [...CONFIG.atendimentos, "Primeiro atendimento", "Ainda não sei, quero conversar"];
  const dataFechada = data !== "" && horariosDoDia(diaDaSemana(data)).length === 0;
  const horas = useMemo(() => (data && !dataFechada ? horariosDoDia(diaDaSemana(data)) : []), [data, dataFechada]);

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha o atendimento desejado.";
    if (data) {
      if (data < hojeISO()) e.data = "Escolha uma data a partir de hoje.";
      else if (dataFechada) e.data = "Dia sem atendimento, escolha outra data";
    }
    if (hora && !horas.includes(hora)) e.hora = "Escolha um horário disponível para o dia.";
    return e;
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) {
      setAviso(`Revise ${Object.keys(e).length === 1 ? "o campo indicado" : "os campos indicados"}.`);
      const primeiro = Object.keys(e)[0];
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    const msg = [
      "Olá! Vim pelo site do escritório Botelho & Neves e gostaria de solicitar um atendimento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Advogado: ${advogado || "sem preferência"}`,
      `Data preferida: ${data ? br(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const url = linkWhatsapp(msg);
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(url);
    setAviso("Pronto! Abrimos o WhatsApp com sua solicitação.");
  }

  const campo = "mt-2 block w-full min-h-12 border border-tinta/40 bg-osso px-4 py-3 text-[1rem] text-tinta outline-none focus:border-tinta focus-visible:outline-2 focus-visible:outline-verde aria-[invalid=true]:border-erro";
  const rotuloCls = "text-[0.95rem] font-medium";
  const erro = (k: keyof Erros) =>
    erros[k] ? (
      <p id={`${id}-${k}-erro`} className="mt-2 text-sm text-erro">
        {erros[k]}
      </p>
    ) : null;
  const desc = (k: keyof Erros, extra?: string) => [erros[k] ? `${id}-${k}-erro` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="bg-osso-2 py-24 lg:py-36">
      <div className="mx-auto grid max-w-[84rem] gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:px-12">
        <div>
          <Cabecalho numero={n} rotulo="Praticidade" id="t-agendar">
            Peça seu horário em poucos <span className="enfase">cliques</span>.
          </Cabecalho>
          <p className="mt-8 max-w-[30rem] text-pedra">
            Escolha a área e o dia e horário de sua preferência. Sua solicitação chega ao escritório pelo WhatsApp, e a
            equipe confirma a disponibilidade. Dia e horário são preferências, sujeitas à confirmação do escritório.
          </p>
        </div>

        <form noValidate onSubmit={enviar} className="border-t border-tinta bg-osso p-6 sm:p-10" aria-describedby={`${id}-priv`}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-nome`} className={rotuloCls}>
                Nome completo <span className="text-pedra">(obrigatório)</span>
              </label>
              <input
                id={`${id}-nome`}
                className={campo}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
                placeholder="Como devemos te chamar?"
                aria-invalid={!!erros.nome}
                aria-describedby={desc("nome")}
                required
              />
              {erro("nome")}
            </div>

            <div>
              <label htmlFor={`${id}-atendimento`} className={rotuloCls}>
                Atendimento desejado
                {!CONFIG.agendamento.exigirAtendimento && <span className="text-pedra"> (opcional)</span>}
              </label>
              <select
                id={`${id}-atendimento`}
                className={campo}
                value={atendimento}
                onChange={(e) => setAtendimento(e.target.value)}
                aria-invalid={!!erros.atendimento}
                aria-describedby={desc("atendimento")}
              >
                <option value="">Escolha um atendimento</option>
                {opcoes.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              {erro("atendimento")}
            </div>

            <div>
              <label htmlFor={`${id}-advogado`} className={rotuloCls}>
                Advogado <span className="text-pedra">(opcional)</span>
              </label>
              <select id={`${id}-advogado`} className={campo} value={advogado} onChange={(e) => setAdvogado(e.target.value)}>
                <option value="">Sem preferência</option>
                {CONFIG.socios.map((s) => (
                  <option key={s.nome}>{s.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${id}-data`} className={rotuloCls}>
                Data preferida <span className="text-pedra">(opcional)</span>
              </label>
              <input
                id={`${id}-data`}
                type="date"
                className={campo}
                min={hojeISO()}
                value={data}
                onChange={(e) => {
                  const v = e.target.value;
                  setData(v);
                  setHora("");
                  const fechada = v !== "" && horariosDoDia(diaDaSemana(v)).length === 0;
                  setErros((x) => ({ ...x, data: fechada ? "Dia sem atendimento, escolha outra data" : undefined }));
                }}
                aria-invalid={!!erros.data}
                aria-describedby={desc("data", `${id}-data-ajuda`)}
              />
              <p id={`${id}-data-ajuda`} className="mt-2 text-sm text-pedra">
                Atendimento de segunda a sexta.
              </p>
              {erro("data")}
            </div>

            <div>
              <label htmlFor={`${id}-hora`} className={rotuloCls}>
                Horário preferido <span className="text-pedra">(opcional)</span>
              </label>
              <select
                id={`${id}-hora`}
                className={campo}
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                disabled={!horas.length}
                aria-invalid={!!erros.hora}
                aria-describedby={desc("hora", `${id}-hora-ajuda`)}
              >
                <option value="">Escolha um horário</option>
                {horas.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
              <p id={`${id}-hora-ajuda`} className="mt-2 text-sm text-pedra">
                {horas.length ? "Horário sujeito à confirmação." : "Escolha antes uma data."}
              </p>
              {erro("hora")}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${id}-obs`} className={rotuloCls}>
                Observações <span className="text-pedra">(opcional)</span>
              </label>
              <textarea
                id={`${id}-obs`}
                className={`${campo} min-h-28 resize-y`}
                maxLength={300}
                rows={3}
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Se quiser, conte o que você precisa."
                aria-describedby={`${id}-obs-ajuda`}
              />
              <p id={`${id}-obs-ajuda`} className="mt-2 flex justify-between gap-4 text-sm text-pedra">
                <span>
                  Não é preciso detalhar o caso aqui, nem enviar documentos ou dados sigilosos. Conversamos com calma pelo
                  WhatsApp.
                </span>
                <span className="num shrink-0">{obs.length}/300</span>
              </p>
            </div>
          </div>

          <button type="submit" className="btn btn-cheio mt-8 w-full sm:w-auto">
            <IconeWhatsapp />
            Enviar solicitação pelo WhatsApp
          </button>

          <p id={`${id}-priv`} className="mt-5 text-sm text-pedra">
            Ao enviar, você abre uma conversa no WhatsApp com o escritório. Este site não guarda os dados digitados.{" "}
            <a className="link text-tinta" href="/privacidade.html">
              Privacidade
            </a>
          </p>

          <div aria-live="polite" role="status" className="mt-6">
            {aviso && !enviado && <p className="text-sm text-erro">{aviso}</p>}
            {enviado && (
              <div className="border-l-[3px] border-verde bg-osso-2 p-5">
                <p className="font-medium">
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a
                  disponibilidade.
                </p>
                <p className="mt-2 text-sm text-pedra">
                  Se o WhatsApp não abriu,{" "}
                  <a className="link text-tinta" href={enviado} target="_blank" rel="noopener noreferrer">
                    Abrir WhatsApp
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
