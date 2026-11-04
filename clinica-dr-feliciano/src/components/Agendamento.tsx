import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { CONFIG, atendimentosVisiveis, waLink } from "../config";
import { Icone, Revelar, TituloSecao } from "./ui";

/* ---------------------------------------------------------- utilidades */
const minutos = (h: string) => {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
};
const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dataDeIso = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const brDeIso = (iso: string) => iso.split("-").reverse().join("/");

const horarioDoDia = (iso: string) => CONFIG.horarios.find((h) => h.dias.includes(dataDeIso(iso).getDay() as never));

/** Blocos de 1h entre abertura e fechamento, sem o almoço (se houver) e,
 *  no dia de hoje, sem os horários que já passaram. */
export function horariosDoDia(iso: string, agora = new Date()): string[] {
  const h = horarioDoDia(iso);
  if (!h) return [];
  const passo = CONFIG.agendamento.duracaoBlocoMin;
  const fim = minutos(h.fecha);
  const lista: string[] = [];
  for (let t = minutos(h.abre); t + passo <= fim; t += passo) {
    if (h.almoco && t < minutos(h.almoco.fim) && t + passo > minutos(h.almoco.inicio)) continue;
    if (iso === isoLocal(agora) && t <= agora.getHours() * 60 + agora.getMinutes()) continue;
    lista.push(hhmm(t));
  }
  return lista;
}

const OPCOES_EXTRAS = ["Primeira avaliação", "Ainda não sei, quero conversar"];
const LIMITE_OBS = 300;

type Erros = Partial<Record<"nome" | "atendimento" | "data" | "horario", string>>;

/* ------------------------------------------------------------- campos */
function Campo({
  id,
  rotulo,
  opcional,
  erro,
  ajuda,
  children,
}: {
  id: string;
  rotulo: string;
  opcional?: boolean;
  erro?: string;
  ajuda?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[0.95rem] font-medium text-petroleo-900">
        {rotulo}
        {opcional && <span className="text-[0.8rem] font-normal text-tinta-suave">opcional</span>}
      </label>
      {children}
      {ajuda && !erro && <div id={`${id}-ajuda`} className="mt-2 text-[0.85rem] text-tinta-suave">{ajuda}</div>}
      <p id={`${id}-erro`} className="mt-2 flex items-start gap-1.5 text-[0.88rem] font-medium text-erro empty:hidden" aria-live="polite">
        {erro}
      </p>
    </div>
  );
}

const estiloCampo = (erro?: string) =>
  `block min-h-12 w-full rounded-xl border bg-papel px-4 text-[1rem] text-tinta outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-tinta-suave/80 focus:border-petroleo-900 focus:shadow-[0_0_0_3px_rgba(201,138,59,0.35)] ${
    erro ? "border-erro" : "border-petroleo-900/20 hover:border-petroleo-900/40"
  }`;

/* ============================================================ SEÇÃO */
export function Agendamento() {
  const base = useId();
  const ids = {
    nome: `${base}-nome`,
    atendimento: `${base}-atend`,
    data: `${base}-data`,
    horario: `${base}-hora`,
    obs: `${base}-obs`,
  };

  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [hoje, setHoje] = useState<string>("");
  const [estado, setEstado] = useState<"editando" | "enviando" | "enviado">("editando");
  const [urlEnviada, setUrlEnviada] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  // data mínima calculada no cliente (evita divergência com o HTML pré-renderizado)
  useEffect(() => setHoje(isoLocal(new Date())), []);

  const opcoes = [...atendimentosVisiveis().map((a) => (a.id === "proteses" ? "Próteses" : a.nome)), ...OPCOES_EXTRAS];
  const slots = data && !erros.data ? horariosDoDia(data) : [];

  const validarData = (iso: string): string | undefined => {
    if (!iso) return undefined;
    if (hoje && iso < hoje) return "Escolha uma data a partir de hoje.";
    if (!horarioDoDia(iso)) return "Dia sem atendimento, escolha outra data";
    if (horariosDoDia(iso).length === 0) return "Não há mais horários neste dia, escolha outra data";
    return undefined;
  };

  const aoMudarData = (iso: string) => {
    setData(iso);
    setHorario("");
    setErros((e) => ({ ...e, data: validarData(iso) }));
  };

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome para a clínica saber com quem vai falar.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha uma opção de atendimento.";
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (horario && data && !horariosDoDia(data).includes(horario)) e.horario = "Escolha um horário da lista.";
    return e;
  };

  const montarMensagem = () =>
    [
      "Olá! Vim pelo site e gostaria de solicitar um agendamento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Data preferida: ${data ? brDeIso(data) : "a combinar"}`,
      `Horário preferido: ${horario || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");

  const enviar = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (Object.keys(e) as (keyof Erros)[])[0];
    if (primeiro) {
      document.getElementById(ids[primeiro])?.focus();
      return;
    }
    const url = waLink(montarMensagem());
    setUrlEnviada(url);
    setEstado("enviando");
    // abre na mesma interação do clique (evita bloqueio de pop-up)
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null;
    setBloqueado(!janela);
    window.setTimeout(() => {
      setEstado("enviado");
      requestAnimationFrame(() => document.getElementById(`${base}-ok`)?.focus());
    }, 450);
  };

  const recomecar = () => {
    setEstado("editando");
    setUrlEnviada("");
    setBloqueado(false);
  };

  const descr = (id: string, erro?: string, ajuda?: boolean) =>
    [erro ? `${id}-erro` : "", ajuda && !erro ? `${id}-ajuda` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <section id="agendar" aria-labelledby="t-agendar" className="relative overflow-hidden bg-linho py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <TituloSecao
            id="t-agendar"
            rotulo="Praticidade"
            indice={7}
            apoio={
              <>
                <p>
                  Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a
                  equipe confirma a disponibilidade.
                </p>
                <p className="mt-4 text-[0.95rem]">
                  Os horários escolhidos aqui são preferências e dependem da confirmação da clínica.
                </p>
              </>
            }
          >
            Peça seu horário em poucos <em>cliques</em>.
          </TituloSecao>
        </div>

        <Revelar>
          <div className="rounded-[1.8rem] bg-papel p-6 shadow-[0_30px_60px_-40px_rgba(15,58,64,0.5)] ring-1 ring-petroleo-900/10 sm:p-10">
            {CONFIG.agendamento.urgencia && (
              <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-petroleo-900 p-5 text-linho sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-mel !min-h-12 shrink-0">
                  <Icone nome="whatsapp" className="size-5" /> Falar agora
                </a>
              </div>
            )}

            {estado === "enviado" ? (
              <div role="status" className="py-4 text-center sm:py-8">
                <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-salvia/25 text-salvia-escura">
                  <Icone nome="check" className="size-8" />
                </span>
                <h3 id={`${base}-ok`} tabIndex={-1} className="mt-6 text-3xl outline-none">
                  Pronto!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-lg text-tinta-suave">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                <div className={`mx-auto mt-7 max-w-md rounded-2xl p-4 text-[0.95rem] ${bloqueado ? "bg-mel/15 text-petroleo-900" : "text-tinta-suave"}`}>
                  <p>{bloqueado ? "Seu navegador bloqueou a nova aba. Use o botão abaixo:" : "Se o WhatsApp não abriu, use o botão abaixo:"}</p>
                  <a href={urlEnviada} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-3">
                    <Icone nome="whatsapp" className="size-5" />
                    Abrir WhatsApp
                  </a>
                </div>
                <button type="button" onClick={recomecar} className="mt-6 inline-flex min-h-12 items-center px-3 text-[0.95rem] text-petroleo-900 underline decoration-mel underline-offset-4">
                  Fazer outra solicitação
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} className="space-y-6" aria-describedby={`${base}-privacidade`}>
                <Campo id={ids.nome} rotulo="Nome completo" erro={erros.nome}>
                  <input
                    id={ids.nome}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                    }}
                    aria-invalid={!!erros.nome}
                    aria-describedby={descr(ids.nome, erros.nome)}
                    className={estiloCampo(erros.nome)}
                  />
                </Campo>

                <Campo id={ids.atendimento} rotulo="Atendimento desejado" opcional={!CONFIG.agendamento.exigirAtendimento} erro={erros.atendimento}>
                  <div className="relative">
                    <select
                      id={ids.atendimento}
                      name="atendimento"
                      value={atendimento}
                      required={CONFIG.agendamento.exigirAtendimento}
                      onChange={(e) => {
                        setAtendimento(e.target.value);
                        setErros((x) => ({ ...x, atendimento: undefined }));
                      }}
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={descr(ids.atendimento, erros.atendimento)}
                      className={`${estiloCampo(erros.atendimento)} cursor-pointer appearance-none pr-11`}
                    >
                      <option value="">Escolha uma opção</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Seta />
                  </div>
                </Campo>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Campo
                    id={ids.data}
                    rotulo="Data preferida"
                    opcional
                    erro={erros.data}
                    ajuda={<>Seg a sex e sábado pela manhã</>}
                  >
                    <input
                      id={ids.data}
                      name="data"
                      type="date"
                      min={hoje || undefined}
                      value={data}
                      onChange={(e) => aoMudarData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={descr(ids.data, erros.data, true)}
                      className={`${estiloCampo(erros.data)} cursor-pointer`}
                    />
                  </Campo>

                  <Campo id={ids.horario} rotulo="Horário preferido" opcional erro={erros.horario} ajuda={!data ? <>Escolha a data primeiro</> : undefined}>
                    <div className="relative">
                      <select
                        id={ids.horario}
                        name="horario"
                        value={horario}
                        disabled={!slots.length}
                        onChange={(e) => {
                          setHorario(e.target.value);
                          setErros((x) => ({ ...x, horario: undefined }));
                        }}
                        aria-invalid={!!erros.horario}
                        aria-describedby={descr(ids.horario, erros.horario, !data)}
                        className={`${estiloCampo(erros.horario)} cursor-pointer appearance-none pr-11 disabled:cursor-not-allowed disabled:bg-areia/50 disabled:text-tinta-suave`}
                      >
                        <option value="">Escolha um horário</option>
                        {slots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Seta />
                    </div>
                  </Campo>
                </div>

                <Campo
                  id={ids.obs}
                  rotulo="Observações"
                  opcional
                  ajuda={
                    <div className="flex justify-between gap-4">
                      <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                      <span className="shrink-0 tabular-nums" aria-hidden="true">
                        {obs.length}/{LIMITE_OBS}
                      </span>
                    </div>
                  }
                >
                  <textarea
                    id={ids.obs}
                    name="observacoes"
                    rows={3}
                    maxLength={LIMITE_OBS}
                    placeholder="Se quiser, conte o que você precisa."
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    aria-describedby={`${ids.obs}-ajuda`}
                    className={`${estiloCampo()} resize-y py-3 leading-relaxed`}
                  />
                </Campo>

                <div aria-live="polite" className="sr-only">
                  {Object.values(erros).filter(Boolean).length > 0 ? "Há campos para corrigir no formulário." : ""}
                </div>

                <button type="submit" disabled={estado === "enviando"} className="btn btn-primario w-full !min-h-14 text-[1.02rem] disabled:opacity-80">
                  {estado === "enviando" ? (
                    <>
                      <span className="size-5 animate-spin rounded-full border-2 border-linho/30 border-t-linho" aria-hidden="true" />
                      Abrindo o WhatsApp…
                    </>
                  ) : (
                    <>
                      <Icone nome="whatsapp" className="size-5" />
                      Enviar solicitação pelo WhatsApp
                    </>
                  )}
                </button>
                <p id={`${base}-privacidade`} className="text-center text-[0.85rem] text-tinta-suave">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                  <a href="/privacidade.html" className="font-medium text-petroleo-900 underline decoration-mel underline-offset-2">
                    Privacidade
                  </a>
                </p>
              </form>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  );
}

function Seta() {
  return (
    <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-petroleo-900" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
