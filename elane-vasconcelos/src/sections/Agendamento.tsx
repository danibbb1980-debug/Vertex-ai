import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG } from "../config";
import { IconeWhatsApp } from "../components/Icones";
import { Revelar } from "../components/Revelar";
import { blocosDoDia, diaAberto, diaDaSemana, hojeISO, isoParaBR } from "../lib/horarios";

const FURO = "Furo de orelha infantil";
const LIMITE_OBS = 300;

type Erros = Partial<Record<"nome" | "atendimento" | "data", string>>;

const campo =
  "block w-full min-h-12 rounded-2xl border bg-marfim px-4 py-3 text-[1rem] text-cacau placeholder:text-texto/70 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mauve";
const borda = (erro?: string) => (erro ? "border-erro" : "border-cacau/20 hover:border-mauve/50");

export function Agendamento() {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [idade, setIdade] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"editando" | "abrindo" | "enviado">("editando");
  const [bloqueado, setBloqueado] = useState(false);
  const [url, setUrl] = useState("");
  const refs = { nome: useRef<HTMLInputElement>(null), atendimento: useRef<HTMLSelectElement>(null), data: useRef<HTMLInputElement>(null) };
  const confirmacao = useRef<HTMLDivElement>(null);

  const opcoes = useMemo(() => [...CONFIG.atendimentos.map((a) => a.nome), ...CONFIG.agendamento.opcoesExtras], []);
  const ehFuro = atendimento === FURO;
  const blocos = data && !erroData(data) ? blocosDoDia(diaDaSemana(data)) : [];

  if (!CONFIG.secoes.agendamento || !CONFIG.whatsapp) return null;

  function erroData(v: string): string | undefined {
    if (!v) return undefined;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Informe uma data válida.";
    if (v < hojeISO()) return "Escolha uma data a partir de hoje.";
    if (!diaAberto(diaDaSemana(v))) return "Dia sem atendimento, escolha outra data";
    return undefined;
  }

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = ehFuro ? "Informe o nome do responsável." : "Informe seu nome.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha um atendimento.";
    const d = erroData(data);
    if (d) e.data = d;
    return e;
  }

  function montarMensagem() {
    const linhas = [
      CONFIG.mensagens.formulario,
      `${ehFuro ? "Nome do responsável" : "Nome"}: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      ...(ehFuro && idade.trim() ? [`Idade aproximada da criança: ${idade.trim()}`] : []),
      `Data preferida: ${data ? isoParaBR(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ];
    return linhas.join("\n");
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (["nome", "atendimento", "data"] as const).find((k) => e[k]);
    if (primeiro) { refs[primeiro].current?.focus(); return; }
    setEstado("abrindo");
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(montarMensagem())}`;
    setUrl(link);
    const janela = window.open(link, "_blank");
    if (janela) janela.opener = null;
    setBloqueado(!janela);
    setEstado("enviado");
    requestAnimationFrame(() => confirmacao.current?.focus());
  }

  const descr = (n: string, ...extra: (string | false | undefined)[]) =>
    [erros[n as keyof Erros] && id(`${n}-erro`), ...extra].filter(Boolean).join(" ") || undefined;

  const Erro = ({ n }: { n: keyof Erros }) =>
    erros[n] ? (
      <p id={id(`${n}-erro`)} className="mt-2 flex items-center gap-1.5 text-sm text-erro">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.8v3.6M8 10.9v.1" strokeLinecap="round" /></svg>
        {erros[n]}
      </p>
    ) : null;

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-blush-2/60 py-24 sm:py-32">
      <div className="container-site relative z-[1] grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Revelar className="lg:pt-6">
          <p className="rotulo flex items-center gap-3 text-ouro-tinta">
            <span aria-hidden="true" data-fio="ponto" className="inline-block h-2.5 w-2.5 rounded-full border border-ouro bg-marfim" />
            Praticidade
          </p>
          <h2 id="titulo-agendar" className="mt-4 text-[2.4rem] sm:text-5xl lg:text-[3.5rem]">
            Peça seu horário em poucos <em className="enfase">cliques.</em>
          </h2>
          <p className="mt-6 max-w-md text-texto">
            Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade.
          </p>
          <p className="mt-4 max-w-md text-[0.95rem] text-texto">
            Os horários indicados são preferências, sujeitas à confirmação da clínica.
          </p>
        </Revelar>

        <Revelar atraso={0.1}>
          <div className="rounded-[2rem] border border-ouro/30 bg-marfim p-6 shadow-[0_30px_60px_-40px_rgba(46,33,36,0.45)] sm:p-10">
            {estado === "enviado" ? (
              <div ref={confirmacao} tabIndex={-1} role="status" className="text-center focus:outline-none">
                <svg aria-hidden="true" viewBox="0 0 64 64" className="mx-auto h-16 w-16" fill="none">
                  <circle cx="32" cy="32" r="28" stroke="#B8956A" strokeWidth="1.1" />
                  <path d="M22 33l7 7 14-15" stroke="#7A3E48" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-5 font-serif text-3xl text-mauve">Pronto!</p>
                <p className="mx-auto mt-3 max-w-sm text-texto">
                  Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={bloqueado
                    ? "mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-mauve px-6 font-medium text-marfim"
                    : "mt-6 inline-flex min-h-12 items-center gap-2 text-[0.95rem] text-mauve underline underline-offset-4"}
                >
                  <IconeWhatsApp className="h-5 w-5" />
                  {bloqueado ? "Abrir WhatsApp" : "O WhatsApp não abriu? Abrir WhatsApp"}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                <div>
                  <button type="button" onClick={() => setEstado("editando")} className="mt-4 inline-flex min-h-12 items-center text-[0.95rem] text-texto underline underline-offset-4">
                    Voltar ao formulário
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} aria-describedby={id("aviso")}>
                <div aria-live="polite" className="sr-only">
                  {Object.values(erros).filter(Boolean).length > 0 ? "Há campos para corrigir no formulário." : ""}
                </div>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor={id("atendimento")} className="mb-2 block font-medium text-cacau">
                      Atendimento desejado {!CONFIG.agendamento.exigirAtendimento && <span className="font-normal text-texto">(opcional)</span>}
                    </label>
                    <select
                      ref={refs.atendimento}
                      id={id("atendimento")}
                      value={atendimento}
                      onChange={(e) => setAtendimento(e.target.value)}
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={descr("atendimento")}
                      className={`${campo} ${borda(erros.atendimento)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%237A3E48' stroke-width='1.4'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <Erro n="atendimento" />
                  </div>

                  <div>
                    <label htmlFor={id("nome")} className="mb-2 block font-medium text-cacau">
                      {ehFuro ? "Nome do responsável" : "Nome completo"} <span aria-hidden="true" className="text-mauve">*</span>
                      <span className="sr-only"> (obrigatório)</span>
                    </label>
                    <input
                      ref={refs.nome}
                      id={id("nome")}
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      required
                      placeholder="Como devemos te chamar?"
                      value={nome}
                      onChange={(e) => { setNome(e.target.value); if (erros.nome) setErros({ ...erros, nome: undefined }); }}
                      aria-invalid={!!erros.nome}
                      aria-describedby={descr("nome")}
                      className={`${campo} ${borda(erros.nome)}`}
                    />
                    <Erro n="nome" />
                  </div>

                  {ehFuro && (
                    <div>
                      <label htmlFor={id("idade")} className="mb-2 block font-medium text-cacau">
                        Idade aproximada da criança <span className="font-normal text-texto">(opcional)</span>
                      </label>
                      <input
                        id={id("idade")}
                        type="text"
                        maxLength={30}
                        placeholder="Ex.: 6 meses, 3 anos"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                        aria-describedby={id("idade-ajuda")}
                        className={`${campo} ${borda()}`}
                      />
                      <p id={id("idade-ajuda")} className="mt-2 text-sm text-texto">Não é preciso informar o nome da criança.</p>
                    </div>
                  )}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor={id("data")} className="mb-2 block font-medium text-cacau">
                        Data preferida <span className="font-normal text-texto">(opcional)</span>
                      </label>
                      <input
                        ref={refs.data}
                        id={id("data")}
                        type="date"
                        min={hojeISO()}
                        value={data}
                        onChange={(e) => {
                          const v = e.target.value;
                          setData(v);
                          setHora("");
                          setErros({ ...erros, data: erroData(v) });
                        }}
                        aria-invalid={!!erros.data}
                        aria-describedby={descr("data", id("data-ajuda"))}
                        className={`${campo} ${borda(erros.data)}`}
                      />
                      <p id={id("data-ajuda")} className="mt-2 text-sm text-texto">Segunda a sábado. Domingo sem atendimento.</p>
                      <Erro n="data" />
                    </div>
                    <div>
                      <label htmlFor={id("hora")} className="mb-2 block font-medium text-cacau">
                        Horário preferido <span className="font-normal text-texto">(opcional)</span>
                      </label>
                      <select
                        id={id("hora")}
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        disabled={blocos.length === 0}
                        aria-describedby={id("hora-ajuda")}
                        className={`${campo} ${borda()} appearance-none disabled:cursor-not-allowed disabled:bg-marfim-2 disabled:text-texto bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%237A3E48' stroke-width='1.4'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
                      >
                        <option value="">Escolha um horário</option>
                        {blocos.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <p id={id("hora-ajuda")} className="mt-2 text-sm text-texto">
                        {blocos.length ? "Pausa de almoço das 12h às 14h." : "Escolha a data para ver os horários."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={id("obs")} className="mb-2 block font-medium text-cacau">
                      Observações <span className="font-normal text-texto">(opcional)</span>
                    </label>
                    <textarea
                      id={id("obs")}
                      rows={3}
                      maxLength={LIMITE_OBS}
                      placeholder="Se quiser, conte o que você precisa."
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      aria-describedby={`${id("obs-ajuda")} ${id("obs-cont")}`}
                      className={`${campo} ${borda()} resize-y`}
                    />
                    <div className="mt-2 flex justify-between gap-4 text-sm text-texto">
                      <p id={id("obs-ajuda")}>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
                      <p id={id("obs-cont")} className="shrink-0 tabular-nums" aria-live="off">{obs.length}/{LIMITE_OBS}</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={estado === "abrindo"}
                    className="group relative inline-flex min-h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-mauve px-6 font-medium text-marfim transition-colors hover:bg-mauve-2 disabled:opacity-70"
                  >
                    <IconeWhatsApp className="h-5 w-5" />
                    {estado === "abrindo" ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 bottom-2.5 h-px origin-left scale-x-0 bg-ouro-claro transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  </button>
                  <p id={id("aviso")} className="text-center text-sm text-texto">
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                    <a href="/privacidade.html" className="text-mauve underline underline-offset-4">Privacidade</a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </Revelar>
      </div>
    </section>
  );
}
