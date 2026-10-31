/*
  Solicitação de agendamento pelo WhatsApp.
  Sem backend, sem armazenamento: o formulário só monta a mensagem e abre o
  WhatsApp da unidade escolhida. Nada é enviado a servidor algum.
*/
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import {
  NOME_DIA,
  blocosDoDia,
  dataDeIso,
  formatarDataBR,
  horarioDoDia,
  isoLocal,
  proximosDiasAbertos,
} from "../../lib/horarios";
import { cn } from "../../lib/cn";
import { IconeCheck, IconeWhatsApp } from "../ui/Icones";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

type Erros = Partial<Record<"unidade" | "nome" | "atendimento" | "data", string>>;

const PRIMEIRA = "Primeira avaliação";
const NAO_SEI = "Ainda não sei, quero conversar";

const campoBase =
  "mt-2 block min-h-12 w-full rounded-2xl border bg-ice px-4 py-3 text-base text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft/80 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-400/25 disabled:cursor-not-allowed disabled:opacity-60";

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
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.95rem] font-semibold text-navy-900">
        {rotulo}
        {opcional && <span className="text-xs font-normal text-ink-soft">opcional</span>}
      </label>
      {children}
      {ajuda && !erro && (
        <div id={`${id}-ajuda`} className="mt-2 text-xs text-ink-soft">
          {ajuda}
        </div>
      )}
      {erro && (
        <p id={`${id}-erro`} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-erro">
          <span aria-hidden="true" className="inline-block size-1.5 rotate-45 bg-erro" />
          {erro}
        </p>
      )}
    </div>
  );
}

export function Agendamento() {
  const { unidade: unidadeAtual, unidades, setUnidadeId } = useUnidade();
  const uid = useId();
  const ids = {
    unidade: `${uid}-unidade`,
    nome: `${uid}-nome`,
    atendimento: `${uid}-atendimento`,
    data: `${uid}-data`,
    hora: `${uid}-hora`,
    obs: `${uid}-obs`,
  };
  const varias = unidades.length > 1;
  const limite = CONFIG.agendamento.limiteObservacoes;

  const [unidadeId, setUnidadeLocal] = useState(varias ? "" : unidadeAtual.id);
  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [status, setStatus] = useState<"editando" | "abrindo" | "pronto">("editando");
  const [bloqueado, setBloqueado] = useState(false);
  const [urlEnviada, setUrlEnviada] = useState("");
  const [aviso, setAviso] = useState("");
  const form = useRef<HTMLFormElement>(null);
  // Partes que dependem da data de hoje só aparecem no navegador (o HTML é gerado no build).
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const unidade = unidades.find((u) => u.id === unidadeId) ?? (varias ? null : unidadeAtual);
  const horarios = unidade?.horarios ?? [];
  const hoje = new Date();
  const hojeIso = isoLocal(hoje);

  const opcoesAtendimento = [...CONFIG.atendimentos.map((a) => a.nome), PRIMEIRA, NAO_SEI];

  const erroData = (iso: string): string | undefined => {
    if (!iso) return undefined;
    if (iso < hojeIso) return "Escolha uma data a partir de hoje.";
    const d = dataDeIso(iso);
    if (!horarioDoDia(horarios, d.getDay())) return "Dia sem atendimento, escolha outra data";
    if (iso === hojeIso && !blocosDoDia(horarios, d.getDay(), hoje.getHours() * 60 + hoje.getMinutes()).length)
      return "Não há mais horários hoje, escolha outra data";
    return undefined;
  };

  const blocos = useMemo(() => {
    if (!data || erroData(data)) return [];
    const d = dataDeIso(data);
    return blocosDoDia(horarios, d.getDay(), data === hojeIso ? hoje.getHours() * 60 + hoje.getMinutes() : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, horarios, hojeIso]);

  const atalhos = useMemo(() => (montado ? proximosDiasAbertos(horarios, 3) : []), [horarios, montado]);

  const diasFechados = [1, 2, 3, 4, 5, 6, 0].filter((d) => unidade && !horarioDoDia(horarios, d));

  const escolherData = (iso: string) => {
    setData(iso);
    setHora("");
    setErros((e) => ({ ...e, data: erroData(iso) }));
  };

  const validar = (): Erros => {
    const e: Erros = {};
    if (varias && !unidade) e.unidade = "Escolha a unidade.";
    if (nome.trim().length < 2) e.nome = "Informe seu nome para a clínica saber com quem vai conversar.";
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = "Escolha o atendimento desejado.";
    const ed = erroData(data);
    if (ed) e.data = ed;
    return e;
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const chaves = Object.keys(e) as (keyof Erros)[];
    if (chaves.length || !unidade) {
      setAviso(
        chaves.length === 1 ? "Há 1 campo para revisar." : `Há ${chaves.length} campos para revisar.`,
      );
      const primeiro = chaves[0];
      if (primeiro) document.getElementById(ids[primeiro])?.focus();
      return;
    }
    setAviso("");

    const mensagem = [
      "Olá! Vim pelo site e gostaria de solicitar um agendamento.",
      ...(varias ? [`Unidade: ${unidade.nome}`] : []),
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || "a definir"}`,
      `Data preferida: ${data ? formatarDataBR(data) : "a combinar"}`,
      `Horário preferido: ${hora || "a combinar"}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
    const url = linkWhatsApp(unidade.whatsapp, mensagem);

    // Abre na mesma interação do clique (evita bloqueio) e corta o vínculo com esta aba (noopener).
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null;
    setBloqueado(!janela);
    setUrlEnviada(url);
    setStatus("abrindo");
    window.setTimeout(() => setStatus("pronto"), 600);
  };

  const recomecar = () => {
    setNome("");
    setAtendimento("");
    setData("");
    setHora("");
    setObs("");
    setErros({});
    setStatus("editando");
    setUrlEnviada("");
    setBloqueado(false);
    window.setTimeout(() => document.getElementById(ids.nome)?.focus(), 50);
  };

  const describedBy = (id: string, temAjuda = false) =>
    [erros[id as keyof Erros] ? `${(ids as Record<string, string>)[id]}-erro` : "", temAjuda ? `${(ids as Record<string, string>)[id]}-ajuda` : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="relative bg-sand-200 py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Revelar className="lg:sticky lg:top-40 lg:self-start">
          <TituloSecao
            id="titulo-agendar"
            rotulo="Praticidade"
            titulo="Peça seu horário em poucos *cliques*."
            texto="Escolha o atendimento e o melhor dia e horário para você. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade."
          />
          <ul className="mt-8 space-y-3 text-ink-soft">
            {[
              "Os horários escolhidos são preferências, sujeitas à confirmação da clínica.",
              "Não pedimos telefone, e-mail nem dados de saúde.",
              "Este site não guarda o que você digita.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <IconeCheck tamanho={20} className="mt-0.5 shrink-0 text-teal-700" />
                {t}
              </li>
            ))}
          </ul>
        </Revelar>

        <Revelar atraso={0.1}>
          <div className="relative rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-50px_rgb(2_24_38/0.55)] sm:p-10">
            <div className="filete absolute inset-x-10 top-0" aria-hidden="true" />

            {unidade?.prontoSocorro && status === "editando" && (
              <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-navy-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
                <a
                  href={linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ice px-5 font-semibold text-navy-900"
                >
                  <IconeWhatsApp tamanho={18} className="text-teal-600" /> Falar agora
                </a>
              </div>
            )}

            {status !== "editando" ? (
              <div role="status" aria-live="polite" className="py-6 text-center">
                {status === "abrindo" ? (
                  <div className="flex flex-col items-center gap-4 py-10">
                    <span className="size-10 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" aria-hidden="true" />
                    <p className="text-ink-soft">Abrindo o WhatsApp…</p>
                  </div>
                ) : (
                  <>
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-teal-600 text-white">
                      <IconeCheck tamanho={30} />
                    </span>
                    <h3 className="mt-6 text-3xl text-navy-900">Pronto!</h3>
                    <p className="mx-auto mt-3 max-w-md text-ink-soft">
                      Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.
                    </p>
                    <a
                      href={urlEnviada}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold",
                        bloqueado ? "bg-teal-600 text-white" : "border border-line text-teal-700 hover:border-teal-600",
                      )}
                    >
                      <IconeWhatsApp tamanho={18} />
                      {bloqueado ? "Abrir WhatsApp" : "O WhatsApp não abriu? Abrir WhatsApp"}
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    <div>
                      <button type="button" onClick={recomecar} className="mt-4 min-h-12 cursor-pointer text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-navy-900">
                        Fazer outra solicitação
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <form ref={form} noValidate onSubmit={enviar} className="space-y-6" aria-describedby={`${uid}-privacidade`}>
                <p className="sr-only" role="status" aria-live="assertive">
                  {aviso}
                </p>

                {varias && (
                  <Campo id={ids.unidade} rotulo="Unidade" erro={erros.unidade}>
                    <select
                      id={ids.unidade}
                      value={unidadeId}
                      required
                      aria-invalid={!!erros.unidade}
                      aria-describedby={describedBy("unidade")}
                      onChange={(e) => {
                        setUnidadeLocal(e.target.value);
                        setUnidadeId(e.target.value);
                        setData("");
                        setHora("");
                        setErros((x) => ({ ...x, unidade: undefined, data: undefined }));
                      }}
                      className={cn(campoBase, erros.unidade ? "border-erro" : "border-line", "cursor-pointer")}
                    >
                      <option value="">Escolha a unidade</option>
                      {unidades.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nome}
                        </option>
                      ))}
                    </select>
                  </Campo>
                )}

                <Campo id={ids.nome} rotulo="Nome completo" erro={erros.nome}>
                  <input
                    id={ids.nome}
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    value={nome}
                    placeholder="Como devemos te chamar?"
                    aria-invalid={!!erros.nome}
                    aria-describedby={describedBy("nome")}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                    }}
                    className={cn(campoBase, erros.nome ? "border-erro" : "border-line")}
                  />
                </Campo>

                <Campo
                  id={ids.atendimento}
                  rotulo="Atendimento desejado"
                  opcional={!CONFIG.agendamento.exigirAtendimento}
                  erro={erros.atendimento}
                >
                  <select
                    id={ids.atendimento}
                    value={atendimento}
                    aria-invalid={!!erros.atendimento}
                    aria-describedby={describedBy("atendimento")}
                    onChange={(e) => {
                      setAtendimento(e.target.value);
                      setErros((x) => ({ ...x, atendimento: undefined }));
                    }}
                    className={cn(campoBase, erros.atendimento ? "border-erro" : "border-line", "cursor-pointer")}
                  >
                    <option value="">Escolha um atendimento</option>
                    {opcoesAtendimento.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Campo>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Campo
                    id={ids.data}
                    rotulo="Data preferida"
                    opcional
                    erro={erros.data}
                    ajuda={
                      unidade && diasFechados.length > 0
                        ? `Sem atendimento: ${diasFechados.map((d) => NOME_DIA[d as 0].toLowerCase()).join(" e ")}.`
                        : undefined
                    }
                  >
                    <input
                      id={ids.data}
                      type="date"
                      min={montado ? hojeIso : undefined}
                      value={data}
                      disabled={!unidade}
                      aria-invalid={!!erros.data}
                      aria-describedby={describedBy("data", !!unidade && diasFechados.length > 0)}
                      onChange={(e) => escolherData(e.target.value)}
                      className={cn(campoBase, erros.data ? "border-erro" : "border-line", "cursor-pointer")}
                    />
                  </Campo>

                  <Campo id={ids.hora} rotulo="Horário preferido" opcional>
                    <select
                      id={ids.hora}
                      value={hora}
                      disabled={!blocos.length}
                      onChange={(e) => setHora(e.target.value)}
                      className={cn(campoBase, "cursor-pointer border-line")}
                    >
                      <option value="">Escolha um horário</option>
                      {blocos.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </Campo>
                </div>

                {unidade && atalhos.length > 0 && (
                  <fieldset>
                    <legend className="text-xs font-medium text-ink-soft">Próximos dias com atendimento</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {atalhos.map((iso) => {
                        const d = dataDeIso(iso);
                        const ativo = data === iso;
                        return (
                          <button
                            key={iso}
                            type="button"
                            aria-pressed={ativo}
                            onClick={() => escolherData(iso)}
                            className={cn(
                              "min-h-12 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
                              ativo ? "border-teal-600 bg-teal-600 text-white" : "border-line text-ink hover:border-teal-600",
                            )}
                          >
                            {iso === hojeIso ? "Hoje" : NOME_DIA[d.getDay() as 0].slice(0, 3)}, {formatarDataBR(iso).slice(0, 5)}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <Campo
                  id={ids.obs}
                  rotulo="Observações"
                  opcional
                  ajuda={
                    <div className="flex justify-between gap-4">
                      <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                      <span className="shrink-0 tabular-nums" aria-hidden="true">
                        {obs.length}/{limite}
                      </span>
                    </div>
                  }
                >
                  <textarea
                    id={ids.obs}
                    rows={3}
                    maxLength={limite}
                    value={obs}
                    placeholder="Se quiser, conte o que você precisa."
                    aria-describedby={`${ids.obs}-ajuda`}
                    onChange={(e) => setObs(e.target.value.slice(0, limite))}
                    className={cn(campoBase, "resize-none border-line")}
                  />
                </Campo>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-brilho inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-teal-600 px-7 font-semibold text-white shadow-[0_14px_34px_-14px_rgb(31_95_99/0.8)] transition-colors hover:bg-teal-700 active:scale-[0.99]"
                  >
                    <IconeWhatsApp tamanho={20} />
                    Enviar solicitação pelo WhatsApp
                  </button>
                  <p id={`${uid}-privacidade`} className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                    <a href="/privacidade.html" className="font-semibold text-teal-700 underline underline-offset-2">
                      Saiba mais sobre privacidade
                    </a>
                    .
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
