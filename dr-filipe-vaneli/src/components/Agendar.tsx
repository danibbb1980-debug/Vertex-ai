import { useId, useMemo, useState, type FormEvent } from "react";
import { CONFIG } from "../config";

const hoje = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const diaDaSemana = (iso: string) => new Date(`${iso}T12:00:00`).getDay();
const horarioDoDia = (iso: string) => CONFIG.horarios.find((h) => h.dia === diaDaSemana(iso));
const fmtData = (iso: string) => iso.split("-").reverse().join("/");

type Erros = Partial<Record<"nome" | "data" | "hora", string>>;

export default function Agendar() {
  const uid = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [urlEnviada, setUrlEnviada] = useState("");

  const opcoesAtendimento = useMemo(() => {
    const nomes = ["Avaliação facial", ...CONFIG.atendimentos.map((a) => a.nome)];
    return [...new Set(nomes), "Ainda não sei, quero conversar"];
  }, []);

  const horas = useMemo(() => {
    if (!data) return [] as string[];
    const h = horarioDoDia(data);
    if (!h || h.abre === null || h.fecha === null) return [];
    const out: string[] = [];
    for (let x = h.abre; x < h.fecha; x++) out.push(`${String(x).padStart(2, "0")}:00`);
    return out;
  }, [data]);

  const validaData = (v: string) => {
    if (!v) return "";
    if (v < hoje()) return "Escolha uma data a partir de hoje.";
    const h = horarioDoDia(v);
    if (!h || h.abre === null) return "Dia sem atendimento, escolha outra data.";
    return "";
  };

  const onData = (v: string) => {
    setData(v);
    setHora("");
    setErros((e) => ({ ...e, data: validaData(v) || undefined }));
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome completo.";
    const ed = validaData(data);
    if (ed) e.data = ed;
    if (data && !ed && hora && !horas.includes(hora)) e.hora = "Escolha um horário da lista.";
    setErros(e);
    if (Object.keys(e).length) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const msg = [
      `Olá! Vim pelo site do ${CONFIG.nome} e gostaria de solicitar um agendamento.`,
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Data preferida: ${data ? fmtData(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setUrlEnviada(url);
  };

  const rotulo = "ficha-rotulo block";
  const erro = (k: keyof Erros) =>
    erros[k] ? (
      <p id={`${uid}-${k}-erro`} className="mt-1.5 text-sm text-[#9b2c1f]">
        {erros[k]}
      </p>
    ) : null;

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="ficha-rotulo">Praticidade</p>
        <h2 className="display mt-4 text-[2.6rem] sm:text-6xl">
          Peça sua avaliação em poucos <em>cliques</em>.
        </h2>
        <p className="mt-6 max-w-md text-pedra">
          Escolha o atendimento e o dia e horário que preferir. Sua solicitação chega pelo WhatsApp, e a equipe confirma a disponibilidade.
        </p>
      </div>

      <div className="lg:col-span-7">
        <div className="relative border border-floresta/15 bg-papel p-6 sm:p-10">
          <span className="absolute left-0 top-0 h-px w-24 bg-latao" aria-hidden="true" />
          <span className="absolute left-0 top-0 h-10 w-px bg-latao" aria-hidden="true" />

          {urlEnviada ? (
            <div role="status" aria-live="polite">
              <p className="display text-3xl">Pronto.</p>
              <p className="mt-4 max-w-md">
                Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
              </p>
              <p className="mt-4 text-sm text-pedra">
                O WhatsApp não abriu?{" "}
                <a href={urlEnviada} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                  Abrir WhatsApp
                </a>
              </p>
              <button type="button" onClick={() => setUrlEnviada("")} className="btn btn-linha mt-8">
                Fazer outra solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate className="grid gap-7 sm:grid-cols-2">
              <div aria-live="polite" className="sr-only">
                {Object.values(erros).filter(Boolean).join(" ")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-nome`} className={rotulo}>Nome completo</label>
                <input
                  id={`${uid}-nome`}
                  className="campo"
                  autoComplete="name"
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={!!erros.nome}
                  aria-describedby={erros.nome ? `${uid}-nome-erro` : undefined}
                  required
                />
                {erro("nome")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-atendimento`} className={rotulo}>Atendimento desejado</label>
                <select id={`${uid}-atendimento`} className="campo" value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
                  <option value="">Escolha um atendimento</option>
                  {opcoesAtendimento.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${uid}-data`} className={rotulo}>Data preferida</label>
                <input
                  id={`${uid}-data`}
                  type="date"
                  className="campo"
                  min={hoje()}
                  value={data}
                  onChange={(e) => onData(e.target.value)}
                  aria-invalid={!!erros.data}
                  aria-describedby={`${uid}-data-ajuda${erros.data ? ` ${uid}-data-erro` : ""}`}
                />
                <p id={`${uid}-data-ajuda`} className="mt-1.5 text-xs text-pedra">Domingo sem atendimento.</p>
                {erro("data")}
              </div>
              <div>
                <label htmlFor={`${uid}-hora`} className={rotulo}>Horário preferido</label>
                <select
                  id={`${uid}-hora`}
                  className="campo"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  disabled={!horas.length}
                  aria-invalid={!!erros.hora}
                  aria-describedby={erros.hora ? `${uid}-hora-erro` : undefined}
                >
                  <option value="">{horas.length ? "Escolha um horário" : "Escolha a data primeiro"}</option>
                  {horas.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                {erro("hora")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-obs`} className={rotulo}>
                  Observações <span className="normal-case tracking-normal text-pedra">(opcional)</span>
                </label>
                <textarea
                  id={`${uid}-obs`}
                  className="campo"
                  maxLength={300}
                  placeholder="Se quiser, conte o que você procura."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-describedby={`${uid}-obs-ajuda`}
                />
                <p id={`${uid}-obs-ajuda`} className="mt-1.5 flex justify-between gap-4 text-xs text-pedra">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="num shrink-0">{obs.length}/300</span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-cheio w-full sm:w-auto">
                  <span className="tick" /> Enviar solicitação pelo WhatsApp
                </button>
                <p className="mt-4 text-xs text-pedra">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                  <a href="/privacidade.html" className="underline underline-offset-2">Privacidade</a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
