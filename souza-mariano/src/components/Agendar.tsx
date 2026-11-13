import { useId, useMemo, useState, type FormEvent } from "react";
import { CONFIG, temWhatsapp } from "../config";
import { Container, IconeWhatsapp, Rotulo } from "./ui";

const MAX_OBS = 300;

const paraMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const paraHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const isoLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function horarioDoDia(iso: string) {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  const dia = new Date(y, m - 1, d).getDay();
  return CONFIG.horarios.find((h) => h.dia === dia);
}

/** Blocos de 1 hora que terminam até o fechamento, sem a pausa de almoço. */
export function blocosDoDia(iso: string, agora = new Date()): string[] {
  const h = horarioDoDia(iso);
  if (!h?.abre || !h.fecha) return [];
  const ini = paraMin(h.abre);
  const fim = paraMin(h.fecha);
  const pausa = h.pausa ? [paraMin(h.pausa[0]), paraMin(h.pausa[1])] : null;
  const ehHoje = iso === isoLocal(agora);
  const minAgora = agora.getHours() * 60 + agora.getMinutes();
  const out: string[] = [];
  for (let t = ini; t + 60 <= fim; t += 60) {
    if (pausa && t < pausa[1] && t + 60 > pausa[0]) continue;
    if (ehHoje && t <= minAgora) continue;
    out.push(paraHora(t));
  }
  return out;
}

const formatarData = (iso: string) => (iso ? iso.split("-").reverse().join("/") : "");

interface Erros {
  nome?: string;
  atendimento?: string;
  data?: string;
}

export function Agendar() {
  const id = useId();
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [advogada, setAdvogada] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);

  const hoje = useMemo(() => isoLocal(new Date()), []);
  const horarioSel = horarioDoDia(data);
  const diaFechado = !!data && !(horarioSel?.abre && horarioSel.fecha);
  const blocos = useMemo(() => (data && !diaFechado ? blocosDoDia(data) : []), [data, diaFechado]);

  if (!temWhatsapp() || !CONFIG.secoes.agendar) return null;

  const opcoesAtendimento = [...CONFIG.familias.map((f) => f.nome), "Primeiro atendimento", "Ainda não sei, quero conversar"];

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha o atendimento desejado.";
    if (data) {
      if (data < hoje) e.data = "Escolha uma data a partir de hoje.";
      else if (diaFechado) e.data = "Dia sem atendimento, escolha outra data";
      else if (blocos.length === 0) e.data = "Não há mais horários neste dia, escolha outra data";
    }
    return e;
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) {
      const primeiro = (Object.keys(e) as (keyof Erros)[])[0];
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }
    const msg = [
      "Olá! Vim pelo site do escritório Souza & Mariano e gostaria de solicitar um atendimento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Advogada: ${advogada || "sem preferência"}`,
      `Data preferida: ${data ? formatarData(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(url);
  };

  const campo =
    "mt-2 block min-h-12 w-full border border-grafite/30 bg-osso px-4 py-3 font-sans text-[1rem] text-grafite placeholder:text-grafite-suave/80 focus:border-vinho aria-[invalid=true]:border-[#9B1C1C]";
  const rotulo = "font-sans text-[0.9rem] font-medium text-grafite";
  const erro = "mt-2 text-[0.88rem] text-[#9B1C1C]";

  return (
    <section id="agendar" data-fio-cruza className="scroll-mt-28 py-20 lg:py-28" aria-labelledby="t-agendar">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Rotulo>Praticidade</Rotulo>
          <h2 id="t-agendar" className="titulo-secao mt-5">
            Peça seu horário em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-grafite-suave">
            Escolha a área e o dia e horário de sua preferência. Sua solicitação chega ao escritório pelo WhatsApp, e a equipe confirma a
            disponibilidade. Os horários escolhidos são preferências, sujeitas à confirmação do escritório.
          </p>
        </div>

        <div className="border border-grafite/15 bg-osso-2 p-6 sm:p-10 lg:col-span-7">
          {enviado ? (
            <div role="status" aria-live="polite">
              <p className="font-serif text-[1.6rem] leading-snug text-grafite">Pronto! Abrimos o WhatsApp com sua solicitação.</p>
              <p className="mt-3 leading-relaxed text-grafite-suave">É só enviar a mensagem. A equipe confirma a disponibilidade.</p>
              <p className="mt-6 text-[0.95rem] text-grafite-suave">
                Se o WhatsApp não abriu,{" "}
                <a href={enviado} target="_blank" rel="noopener noreferrer" className="link-fio font-medium text-vinho">
                  Abrir WhatsApp
                </a>
                .
              </p>
              <button type="button" onClick={() => setEnviado(null)} className="link-fio mt-6 min-h-12 font-sans text-[0.95rem] text-grafite">
                Fazer outra solicitação
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={enviar} className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${id}-nome`} className={rotulo}>
                  Nome completo <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`${id}-nome`}
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (erros.nome) setErros((er) => ({ ...er, nome: undefined }));
                  }}
                  aria-invalid={!!erros.nome}
                  aria-describedby={erros.nome ? `${id}-nome-erro` : undefined}
                  className={campo}
                />
                <p id={`${id}-nome-erro`} className={erro} aria-live="polite">
                  {erros.nome}
                </p>
              </div>

              <div>
                <label htmlFor={`${id}-atendimento`} className={rotulo}>
                  Atendimento desejado {!CONFIG.agendamento.exigirAtendimento && <span className="font-normal text-grafite-suave">(opcional)</span>}
                </label>
                <select
                  id={`${id}-atendimento`}
                  value={atendimento}
                  onChange={(e) => {
                    setAtendimento(e.target.value);
                    if (erros.atendimento) setErros((er) => ({ ...er, atendimento: undefined }));
                  }}
                  aria-invalid={!!erros.atendimento}
                  aria-describedby={erros.atendimento ? `${id}-atendimento-erro` : undefined}
                  className={campo}
                >
                  <option value="">Escolha uma opção</option>
                  {opcoesAtendimento.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <p id={`${id}-atendimento-erro`} className={erro} aria-live="polite">
                  {erros.atendimento}
                </p>
              </div>

              <div>
                <label htmlFor={`${id}-advogada`} className={rotulo}>
                  Advogada <span className="font-normal text-grafite-suave">(opcional)</span>
                </label>
                <select id={`${id}-advogada`} value={advogada} onChange={(e) => setAdvogada(e.target.value)} className={campo}>
                  <option value="">Sem preferência</option>
                  {CONFIG.advogadas.map((a) => (
                    <option key={a.nome}>{a.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${id}-data`} className={rotulo}>
                  Data preferida <span className="font-normal text-grafite-suave">(opcional)</span>
                </label>
                <input
                  id={`${id}-data`}
                  type="date"
                  min={hoje}
                  value={data}
                  onChange={(e) => {
                    const v = e.target.value;
                    setData(v);
                    setHora("");
                    const h = horarioDoDia(v);
                    setErros((er) => ({ ...er, data: v && !(h?.abre && h.fecha) ? "Dia sem atendimento, escolha outra data" : undefined }));
                  }}
                  aria-invalid={!!erros.data}
                  aria-describedby={`${id}-data-ajuda${erros.data ? ` ${id}-data-erro` : ""}`}
                  className={campo}
                />
                <p id={`${id}-data-ajuda`} className="mt-2 text-[0.82rem] text-grafite-suave">
                  Segunda a sexta. Sábado e domingo sem atendimento.
                </p>
                <p id={`${id}-data-erro`} className={erro} aria-live="polite">
                  {erros.data}
                </p>
              </div>

              <div>
                <label htmlFor={`${id}-hora`} className={rotulo}>
                  Horário preferido <span className="font-normal text-grafite-suave">(opcional)</span>
                </label>
                <select
                  id={`${id}-hora`}
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  disabled={!data || diaFechado || blocos.length === 0}
                  aria-describedby={`${id}-hora-ajuda`}
                  className={`${campo} disabled:opacity-60`}
                >
                  <option value="">Escolha um horário</option>
                  {blocos.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <p id={`${id}-hora-ajuda`} className="mt-2 text-[0.82rem] text-grafite-suave">
                  {data ? "Preferência sujeita à confirmação." : "Escolha a data primeiro."}
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${id}-obs`} className={rotulo}>
                  Observações <span className="font-normal text-grafite-suave">(opcional)</span>
                </label>
                <textarea
                  id={`${id}-obs`}
                  rows={3}
                  maxLength={MAX_OBS}
                  placeholder="Se quiser, conte o que você precisa."
                  value={obs}
                  onChange={(e) => setObs(e.target.value.slice(0, MAX_OBS))}
                  aria-describedby={`${id}-obs-ajuda`}
                  className={`${campo} resize-y`}
                />
                <p id={`${id}-obs-ajuda`} className="mt-2 flex justify-between gap-4 text-[0.82rem] text-grafite-suave">
                  <span>Não é preciso detalhar o caso aqui, nem enviar documentos ou dados sigilosos. Conversamos com calma pelo WhatsApp.</span>
                  <span className="num shrink-0">
                    {obs.length}/{MAX_OBS}
                  </span>
                </p>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="botao group relative inline-flex min-h-12 w-full items-center justify-center gap-2.5 bg-vinho px-6 py-3 font-sans text-[0.95rem] font-medium text-osso transition-colors hover:bg-vinho-escuro sm:w-auto"
                >
                  <IconeWhatsapp />
                  Enviar solicitação pelo WhatsApp
                  <span aria-hidden="true" className="botao-fio" />
                </button>
                <p className="mt-4 text-[0.85rem] leading-relaxed text-grafite-suave">
                  Ao enviar, você abre uma conversa no WhatsApp com o escritório. Este site não guarda os dados digitados.{" "}
                  <a href="/privacidade.html" className="link-fio text-vinho">
                    Privacidade
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
