import { useId, useMemo, useState } from "react";
import { CONFIG, blocosDoDia } from "../config";

const LIMITE = 300;

function hojeISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
const diaDaSemana = (iso: string) => new Date(`${iso}T12:00:00`).getDay();
const fmtData = (iso: string) => iso.split("-").reverse().join("/");

type Erros = Partial<Record<"nome" | "data" | "hora", string>>;

export default function Agendar() {
  const id = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);

  const fechados = CONFIG.horarios.filter((h) => !h.abre).map((h) => h.dia as number);
  const horas = useMemo(() => (data ? blocosDoDia(diaDaSemana(data)) : []), [data]);

  if (!CONFIG.usarWhatsapp || !CONFIG.secoes.agendar) return null;

  const opcoes = ["Avaliação inicial", ...CONFIG.atendimentos.map((a) => a.nome), "Ainda não sei, quero conversar"];

  function validarData(v: string): string | undefined {
    if (!v) return;
    if (v < hojeISO()) return "Escolha uma data a partir de hoje.";
    if (fechados.includes(diaDaSemana(v))) return "Dia sem atendimento, escolha outra data.";
  }

  function onData(v: string) {
    setData(v);
    setHora("");
    setErros((e) => ({ ...e, data: validarData(v), hora: undefined }));
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (hora && !horas.includes(hora)) e.hora = "Escolha um horário disponível para o dia.";
    setErros(e);
    if (Object.keys(e).length) {
      const primeiro = e.nome ? "nome" : e.data ? "data" : "hora";
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    const msg = [
      "Olá! Vim pelo site da PelloFinn e gostaria de solicitar um agendamento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Data preferida: ${data ? fmtData(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    const w = window.open(url, "_blank", "noopener,noreferrer");
    // Com "noopener" alguns navegadores retornam null mesmo abrindo; o link manual fica sempre visível.
    setBloqueado(!w);
    setEnviado(url);
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `${id}-${campo}-erro` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="border-t border-grafite/15">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-32 grid lg:grid-cols-12 gap-x-8 gap-y-12">
        <div className="lg:col-span-5">
          <p className="rotulo text-grafite-2 mb-5">Praticidade</p>
          <h2 id="t-agendar" className="display text-[clamp(2.2rem,4.8vw,3.8rem)] max-w-[13ch]">
            Peça sua avaliação em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 text-grafite-2 max-w-[38ch]">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a equipe confirma a disponibilidade.
          </p>
        </div>

        <div className="lg:col-span-7 border border-vermelho/60 bg-marfim p-5 sm:p-8 md:p-10 relative">
          <span className="absolute left-0 top-0 h-px w-24 bg-vermelho" aria-hidden="true" />
          {enviado ? (
            <div role="status" aria-live="polite">
              <p className="display text-[1.9rem]">Pronto!</p>
              <p className="mt-4 max-w-[46ch]">
                Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
              </p>
              <p className="mt-6 text-[0.95rem] text-grafite-2">
                {bloqueado ? "Se o WhatsApp não abriu, use o link: " : "Não abriu? "}
                <a href={enviado} target="_blank" rel="noopener noreferrer" className="link-sub text-vermelho-texto font-semibold">Abrir WhatsApp</a>
              </p>
              <button type="button" className="btn btn-secundario mt-8" onClick={() => setEnviado(null)}>Fazer outra solicitação</button>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} className="grid gap-6">
              <div aria-live="polite" className="sr-only">
                {Object.values(erros).filter(Boolean).join(" ")}
              </div>

              <div>
                <label htmlFor={`${id}-nome`} className="block font-semibold mb-2">Nome completo <span className="text-vermelho-texto" aria-hidden="true">*</span><span className="sr-only">(obrigatório)</span></label>
                <input
                  id={`${id}-nome`} className="campo" type="text" autoComplete="name" required
                  placeholder="Como devemos te chamar?" value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  aria-invalid={!!erros.nome} aria-describedby={desc("nome")}
                />
                {erros.nome && <p id={`${id}-nome-erro`} className="mt-2 text-[0.92rem] text-vermelho-texto">{erros.nome}</p>}
              </div>

              <div>
                <label htmlFor={`${id}-atend`} className="block font-semibold mb-2">Atendimento desejado</label>
                <select id={`${id}-atend`} className="campo" value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
                  <option value="">Escolha um atendimento</option>
                  {opcoes.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={`${id}-data`} className="block font-semibold mb-2">Data preferida</label>
                  <input
                    id={`${id}-data`} className="campo tabular" type="date" min={hojeISO()} value={data}
                    onChange={(e) => onData(e.target.value)}
                    aria-invalid={!!erros.data} aria-describedby={desc("data", `${id}-data-dica`)}
                  />
                  <p id={`${id}-data-dica`} className="mt-2 text-[0.85rem] text-grafite-2">De segunda a sábado.</p>
                  {erros.data && <p id={`${id}-data-erro`} className="mt-1 text-[0.92rem] text-vermelho-texto">{erros.data}</p>}
                </div>
                <div>
                  <label htmlFor={`${id}-hora`} className="block font-semibold mb-2">Horário preferido</label>
                  <select
                    id={`${id}-hora`} className="campo tabular" value={hora} onChange={(e) => setHora(e.target.value)}
                    disabled={!data || !!erros.data || horas.length === 0}
                    aria-invalid={!!erros.hora} aria-describedby={desc("hora", `${id}-hora-dica`)}
                  >
                    <option value="">Escolha um horário</option>
                    {horas.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <p id={`${id}-hora-dica`} className="mt-2 text-[0.85rem] text-grafite-2">{data ? "Preferência, sujeita à disponibilidade." : "Escolha a data primeiro."}</p>
                  {erros.hora && <p id={`${id}-hora-erro`} className="mt-1 text-[0.92rem] text-vermelho-texto">{erros.hora}</p>}
                </div>
              </div>

              <div>
                <label htmlFor={`${id}-obs`} className="block font-semibold mb-2">Observações <span className="font-normal text-grafite-2">(opcional)</span></label>
                <textarea
                  id={`${id}-obs`} className="campo min-h-[110px] resize-y" maxLength={LIMITE} rows={3}
                  placeholder="Se quiser, conte o que você procura." value={obs}
                  onChange={(e) => setObs(e.target.value.slice(0, LIMITE))}
                  aria-describedby={`${id}-obs-dica`}
                />
                <p id={`${id}-obs-dica`} className="mt-2 text-[0.85rem] text-grafite-2 flex justify-between gap-4">
                  <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                  <span className="tabular shrink-0" aria-hidden="true">{obs.length}/{LIMITE}</span>
                </p>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn btn-primario w-full sm:w-auto">
                  Enviar solicitação pelo WhatsApp<span className="seta" aria-hidden="true" />
                </button>
                <p className="mt-4 text-[0.85rem] text-grafite-2 max-w-[52ch]">
                  Ao enviar, você abre uma conversa no WhatsApp. Este site não guarda os dados digitados.{" "}
                  <a href="/privacidade.html" className="link-sub">Privacidade</a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
