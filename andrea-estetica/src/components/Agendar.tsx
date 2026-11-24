import { useMemo, useState, type FormEvent } from "react";
import { atendimentosAtivos, CONFIG } from "../config";
import { agoraSP, dataBR, diaDaData, horariosDoDia } from "../tempo";
import { Hora, IconeWhats } from "./ui";

const CONVERSAR_ANTES = "Quero conversar antes";
const NAO_SEI = "Ainda não sei, quero conversar";
const LIMITE = 300;

type Erros = Partial<Record<"nome" | "data" | "horario", string>>;

export function montarMensagem(v: { nome: string; atendimento: string; data: string; horario: string; obs: string }) {
  const atend = !v.atendimento || v.atendimento === CONVERSAR_ANTES || v.atendimento === NAO_SEI ? "a definir" : v.atendimento;
  return [
    "Olá! Vim pelo site da Andrea e gostaria de solicitar um agendamento.",
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${atend}`,
    `Data preferida: ${v.data ? dataBR(v.data) : "a combinar"}`,
    `Horário preferido: ${v.horario || "a combinar"}`,
    `Observações: ${v.obs.trim() || "-"}`,
  ].join("\n");
}

export default function Agendar({ hora }: { hora: string }) {
  const hoje = useMemo(() => agoraSP().iso, []);
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState(CONVERSAR_ANTES);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [envio, setEnvio] = useState<{ url: string; bloqueado: boolean } | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;

  const diaSemana = data ? diaDaData(data) : -1;
  const opcoes = data && !erros.data ? horariosDoDia(diaSemana) : [];

  function validarData(v: string): string | undefined {
    if (!v) return;
    if (v < hoje) return "Escolha uma data a partir de hoje.";
    if (!CONFIG.horarios.dias[diaDaData(v)]) return "Dia sem atendimento, escolha outra data.";
  }

  function aoMudarData(v: string) {
    setData(v);
    const e = validarData(v);
    setErros((x) => ({ ...x, data: e }));
    // Se o horário escolhido não existe no novo dia, limpa.
    if (horario && (e || !horariosDoDia(diaDaData(v)).includes(horario))) setHorario("");
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Escreva seu nome para a Andrea saber com quem está falando.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horario && data && !horariosDoDia(diaDaData(data)).includes(horario)) e.horario = "Escolha um horário da lista.";
    setErros(e);
    if (Object.keys(e).length) {
      const primeiro = (["nome", "data", "horario"] as const).find((k) => e[k]);
      document.getElementById(`ag-${primeiro}`)?.focus();
      return;
    }
    setEnviando(true);
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
      montarMensagem({ nome, atendimento, data, horario, obs }),
    )}`;
    // Sem "noopener" nas features para conseguir detectar bloqueio; o opener é anulado em seguida.
    const w = window.open(url, "_blank");
    if (w) {
      try {
        w.opener = null;
      } catch {
        /* ignora */
      }
    }
    setEnvio({ url, bloqueado: !w });
    setEnviando(false);
  }

  const erroId = (k: keyof Erros) => (erros[k] ? `ag-${k}-erro` : undefined);

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="border-t border-grafite/20">
      <div className="mx-auto grid max-w-[1240px] gap-y-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <Hora hora={hora} />
          <p className="rotulo mt-6 text-cinza">Praticidade</p>
          <h2 id="t-agendar" className="titulo mt-4 text-[clamp(2.6rem,5.4vw,4.2rem)]">
            Escolha seu horário em poucos <span className="enfase">cliques</span>.
          </h2>
          <p className="mt-6 max-w-[26rem] text-grafite/85">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a Andrea
            responde com a disponibilidade.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="relative border border-grafite/35 bg-linho px-5 pb-8 pt-10 sm:px-10">
            {/* Marcas de hora no topo do cartão */}
            <div aria-hidden="true" className="absolute inset-x-5 top-0 flex justify-between sm:inset-x-10">
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} className={`w-px bg-grafite/40 ${i % 3 === 0 ? "h-3" : "h-1.5"}`} />
              ))}
            </div>

            {envio ? (
              <div role="status" className="py-6">
                <p className="titulo text-[2rem] leading-tight">
                  {envio.bloqueado ? "Falta um toque." : "Pronto!"}
                </p>
                <p className="mt-4 text-grafite/85">
                  {envio.bloqueado
                    ? "O navegador bloqueou a nova aba. Toque no botão abaixo para abrir o WhatsApp com sua solicitação."
                    : "Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A Andrea confirma a disponibilidade."}
                </p>
                <a href={envio.url} target="_blank" rel="noopener noreferrer" className="btn btn-cheio mt-7">
                  <IconeWhats />
                  Abrir WhatsApp
                </a>
                <button
                  type="button"
                  className="link mt-6 block min-h-12 text-sm"
                  onClick={() => setEnvio(null)}
                >
                  Voltar ao formulário
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby="ag-aviso" className="grid gap-7">
                <div>
                  <label htmlFor="ag-nome" className="text-sm font-medium">
                    Nome completo
                  </label>
                  <input
                    id="ag-nome"
                    className="campo"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    aria-invalid={!!erros.nome}
                    aria-describedby={erroId("nome")}
                  />
                  <Erro id="ag-nome-erro" msg={erros.nome} />
                </div>

                <div>
                  <label htmlFor="ag-atendimento" className="text-sm font-medium">
                    Atendimento desejado
                  </label>
                  <select
                    id="ag-atendimento"
                    className="campo"
                    value={atendimento}
                    onChange={(e) => setAtendimento(e.target.value)}
                  >
                    <option>{CONVERSAR_ANTES}</option>
                    {atendimentosAtivos().map((a) => (
                      <option key={a.id}>{a.nome}</option>
                    ))}
                    <option>{NAO_SEI}</option>
                  </select>
                </div>

                <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label htmlFor="ag-data" className="text-sm font-medium">
                      Data preferida
                    </label>
                    <input
                      id="ag-data"
                      className="campo tab"
                      type="date"
                      min={hoje}
                      value={data}
                      onChange={(e) => aoMudarData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={erroId("data") ?? "ag-data-dica"}
                    />
                    {erros.data ? (
                      <Erro id="ag-data-erro" msg={erros.data} />
                    ) : (
                      <p id="ag-data-dica" className="mt-2 text-xs text-cinza">
                        Segunda a sábado. Domingo é fechado.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="ag-horario" className="text-sm font-medium">
                      Horário preferido
                    </label>
                    <select
                      id="ag-horario"
                      className="campo tab"
                      value={horario}
                      disabled={!opcoes.length}
                      onChange={(e) => setHorario(e.target.value)}
                      aria-invalid={!!erros.horario}
                      aria-describedby={erroId("horario") ?? "ag-horario-dica"}
                    >
                      <option value="">Escolha um horário</option>
                      {opcoes.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    {erros.horario ? (
                      <Erro id="ag-horario-erro" msg={erros.horario} />
                    ) : (
                      <p id="ag-horario-dica" className="mt-2 text-xs text-cinza">
                        {opcoes.length ? "É uma preferência; a Andrea responde com a disponibilidade." : "Escolha a data primeiro."}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="ag-obs" className="text-sm font-medium">
                    Observações <span className="font-normal text-cinza">(opcional)</span>
                  </label>
                  <textarea
                    id="ag-obs"
                    className="campo min-h-[96px] resize-y"
                    maxLength={LIMITE}
                    rows={3}
                    placeholder="Se quiser, conte o que você procura."
                    value={obs}
                    onChange={(e) => setObs(e.target.value.slice(0, LIMITE))}
                    aria-describedby="ag-obs-dica ag-obs-conta"
                  />
                  <div className="mt-2 flex justify-between gap-4 text-xs text-cinza">
                    <p id="ag-obs-dica">
                      Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.
                    </p>
                    <p id="ag-obs-conta" className="tab shrink-0">
                      {obs.length}/{LIMITE}
                    </p>
                  </div>
                </div>

                <div>
                  <button type="submit" className="btn btn-cheio w-full" disabled={enviando} aria-busy={enviando}>
                    <IconeWhats />
                    {enviando ? "Abrindo o WhatsApp..." : "Enviar solicitação pelo WhatsApp"}
                  </button>
                  <p id="ag-aviso" className="mt-4 text-xs leading-relaxed text-cinza">
                    Ao enviar, você abre uma conversa no WhatsApp com a Andrea. Este site não guarda os dados
                    digitados.{" "}
                    <a href="/privacidade.html" className="link text-grafite">
                      Privacidade
                    </a>
                  </p>
                </div>
                <p className="sr-only" aria-live="assertive">
                  {Object.values(erros).filter(Boolean).join(" ")}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Erro({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-2 text-sm text-[#a3361f]">
      {msg}
    </p>
  );
}
