import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG, areasAtivas, profissionaisVisiveis } from "../config";
import { Revela } from "../components/Revela";
import { IconeTelefone, IconeWhatsapp } from "../components/Icones";
import { blocosDoDia, diaAberto } from "../lib/horarios";
import { crmTexto, telHref, temWhatsapp, waHref } from "../lib/contato";

const NAO_SEI = "Ainda não sei, quero conversar";

type Campos = { nome: string; atendimento: string; profissional: string; data: string; horario: string; obs: string };
type Erros = Partial<Record<keyof Campos, string>>;
type Status = "editando" | "enviando" | "enviado" | "bloqueado";

const hojeISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const diaDaSemana = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).getDay();
};
const dataBR = (iso: string) => iso.split("-").reverse().join("/");
const nomeProf = (p: (typeof profissionaisVisiveis)[number]) => `${p.tratamento} ${p.nome} · ${crmTexto(p.crm, p.crmUf)}`;

/** Blocos possíveis para a data escolhida (hoje: só os que ainda não passaram). */
function blocosPara(data: string): string[] {
  if (!data) {
    const primeiroAberto = [1, 2, 3, 4, 5, 6, 0].find(diaAberto);
    return primeiroAberto === undefined ? [] : blocosDoDia(primeiroAberto);
  }
  const blocos = blocosDoDia(diaDaSemana(data));
  if (data !== hojeISO()) return blocos;
  const agora = new Date();
  const min = agora.getHours() * 60 + agora.getMinutes();
  return blocos.filter((b) => {
    const [h, m] = b.split(":").map(Number);
    return h * 60 + m > min;
  });
}

export function montarMensagem(c: Campos) {
  return [
    CONFIG.mensagens.formularioAbertura,
    `Nome: ${c.nome.trim()}`,
    `Atendimento: ${c.atendimento || "a definir"}`,
    `Profissional: ${c.profissional || "sem preferência"}`,
    `Data preferida: ${c.data ? dataBR(c.data) : "a combinar"}`,
    `Horário preferido: ${c.horario || "a combinar"}`,
    `Observações: ${c.obs.trim() || "-"}`,
  ].join("\n");
}

function Rotulo({ htmlFor, children, opcional }: { htmlFor: string; children: string; opcional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-3 text-[0.95rem] font-semibold">
      {children}
      {opcional ? <span className="text-[0.8rem] font-normal text-cinza-texto">opcional</span> : null}
    </label>
  );
}

function Erro({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-[0.9rem] font-medium text-[#9a3326]">
      <span aria-hidden="true" className="mt-[0.45rem] h-[5px] w-3 shrink-0 border-y border-current" />
      {msg}
    </p>
  );
}

function Formulario() {
  const vazio: Campos = { nome: "", atendimento: "", profissional: "", data: "", horario: "", obs: "" };
  const [c, setC] = useState<Campos>(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [status, setStatus] = useState<Status>("editando");
  const [aviso, setAviso] = useState("");
  const [url, setUrl] = useState("");
  const form = useRef<HTMLFormElement>(null);
  // data mínima calculada no navegador (o HTML é gerado no build)
  const [minData, setMinData] = useState<string | undefined>(undefined);
  useEffect(() => setMinData(hojeISO()), []);
  const limite = CONFIG.agendamento.limiteObservacoes;
  const exigirAtendimento = CONFIG.agendamento.exigirAtendimento;

  const opcoesAtendimento = [...areasAtivas.map((a) => a.nome), NAO_SEI];
  const profissionais = useMemo(() => {
    const daArea = profissionaisVisiveis.filter((p) => p.area === c.atendimento);
    return daArea.length ? daArea : profissionaisVisiveis;
  }, [c.atendimento]);
  const blocos = useMemo(() => (c.data && !diaAberto(diaDaSemana(c.data)) ? [] : blocosPara(c.data)), [c.data]);

  const muda = <K extends keyof Campos>(k: K, v: Campos[K]) => {
    setC((ant) => {
      const novo = { ...ant, [k]: v };
      if (k === "atendimento") {
        const ok = profissionaisVisiveis.some((p) => nomeProf(p) === novo.profissional && (p.area === v || !areasAtivas.some((a) => a.nome === v)));
        if (!ok) novo.profissional = "";
      }
      if (k === "data") {
        const validos = v && !diaAberto(diaDaSemana(v as string)) ? [] : blocosPara(v as string);
        if (!validos.includes(novo.horario)) novo.horario = "";
      }
      return novo;
    });
    if (k === "data") {
      const iso = v as string;
      setErros((e) => ({ ...e, data: iso && iso >= hojeISO() && !diaAberto(diaDaSemana(iso)) ? "Dia sem atendimento, escolha outra data." : undefined, horario: undefined }));
    } else if (erros[k]) {
      setErros((e) => ({ ...e, [k]: undefined }));
    }
  };

  const validar = (): Erros => {
    const e: Erros = {};
    if (c.nome.trim().length < 2) e.nome = "Informe seu nome para a equipe saber com quem vai falar.";
    if (exigirAtendimento && !c.atendimento) e.atendimento = "Escolha o atendimento desejado.";
    if (c.data) {
      if (c.data < hojeISO()) e.data = "Escolha uma data a partir de hoje.";
      else if (!diaAberto(diaDaSemana(c.data))) e.data = "Dia sem atendimento, escolha outra data.";
      else if (!blocosPara(c.data).length) e.data = "Não há mais horários neste dia. Escolha outra data.";
    }
    if (c.horario && !blocos.includes(c.horario)) e.horario = "Escolha um horário da lista.";
    if (c.obs.length > limite) e.obs = `Use no máximo ${limite} caracteres.`;
    return e;
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const chaves = Object.keys(e) as (keyof Campos)[];
    if (chaves.length) {
      setAviso(`Revise ${chaves.length === 1 ? "1 campo" : `${chaves.length} campos`} antes de enviar.`);
      form.current?.querySelector<HTMLElement>(`[name="${chaves[0]}"]`)?.focus();
      return;
    }
    setStatus("enviando");
    setAviso("Abrindo o WhatsApp…");
    const link = waHref(montarMensagem(c));
    setUrl(link);
    const janela = window.open(link, "_blank");
    if (janela) {
      janela.opener = null;
      setStatus("enviado");
      setAviso("Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.");
    } else {
      setStatus("bloqueado");
      setAviso("O navegador bloqueou a nova aba. Use o botão Abrir WhatsApp.");
    }
  };

  const desc = (k: keyof Campos, extra?: string) => [erros[k] ? `erro-${k}` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  if (status === "enviado" || status === "bloqueado") {
    return (
      <div className="flex min-h-[28rem] flex-col justify-center" role="status" aria-live="polite">
        <span aria-hidden="true" className="flex h-[5.5rem] w-24 items-center justify-center rounded-[2px_999px_999px_2px] border-[1.5px] border-bronze-escuro">
          <span className="flex h-[4.25rem] w-[4.6rem] items-center justify-center rounded-[2px_999px_999px_2px] border-[1.5px] border-bronze-escuro">
            <IconeWhatsapp className="size-6 text-grafite" />
          </span>
        </span>
        {status === "enviado" ? (
          <>
            <h3 className="mt-8 text-[2rem]">
              <em>Pronto!</em>
            </h3>
            <p className="mt-3 text-lg">Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A equipe confirma a disponibilidade.</p>
            <p className="mt-6 text-[0.95rem] text-cinza-texto">
              O WhatsApp não abriu?{" "}
              <a href={url} target="_blank" rel="noopener noreferrer" className="link-sublinhado font-semibold text-grafite">
                Abrir WhatsApp
              </a>
            </p>
          </>
        ) : (
          <>
            <h3 className="mt-8 text-[2rem]">
              Falta <em>um toque</em>
            </h3>
            <p className="mt-3 text-lg">O navegador bloqueou a nova aba. Toque no botão abaixo para abrir o WhatsApp com a sua solicitação.</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="botao botao-primario mt-6 self-start">
              <IconeWhatsapp /> Abrir WhatsApp
            </a>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setC(vazio);
            setStatus("editando");
            setAviso("");
          }}
          className="mt-8 inline-flex min-h-12 items-center self-start font-semibold text-grafite link-sublinhado"
        >
          Fazer outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form ref={form} noValidate onSubmit={enviar} aria-describedby="form-nota" className="grid gap-6">
      <div>
        <Rotulo htmlFor="f-nome">Nome completo</Rotulo>
        <input
          id="f-nome"
          name="nome"
          className="campo"
          autoComplete="name"
          placeholder="Como devemos te chamar?"
          required
          aria-required="true"
          maxLength={120}
          value={c.nome}
          onChange={(e) => muda("nome", e.target.value)}
          aria-invalid={!!erros.nome}
          aria-describedby={desc("nome")}
        />
        <Erro id="erro-nome" msg={erros.nome} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Rotulo htmlFor="f-atendimento" opcional={!exigirAtendimento}>
            Atendimento desejado
          </Rotulo>
          <select
            id="f-atendimento"
            name="atendimento"
            className="campo"
            value={c.atendimento}
            onChange={(e) => muda("atendimento", e.target.value)}
            aria-invalid={!!erros.atendimento}
            aria-describedby={desc("atendimento")}
            {...(exigirAtendimento ? { required: true, "aria-required": true } : {})}
          >
            <option value="">Escolha o atendimento</option>
            {opcoesAtendimento.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <Erro id="erro-atendimento" msg={erros.atendimento} />
        </div>
        {profissionaisVisiveis.length ? (
          <div>
            <Rotulo htmlFor="f-profissional" opcional>
              Profissional
            </Rotulo>
            <select id="f-profissional" name="profissional" className="campo" value={c.profissional} onChange={(e) => muda("profissional", e.target.value)}>
              <option value="">Sem preferência</option>
              {profissionais.map((p) => (
                <option key={p.crm} value={nomeProf(p)}>
                  {nomeProf(p)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Rotulo htmlFor="f-data" opcional>
            Data preferida
          </Rotulo>
          <input
            id="f-data"
            name="data"
            type="date"
            className="campo"
            min={minData}
            value={c.data}
            onChange={(e) => muda("data", e.target.value)}
            aria-invalid={!!erros.data}
            aria-describedby={desc("data", "dica-data")}
          />
          <p id="dica-data" className="mt-2 text-[0.85rem] text-cinza-texto">
            Atendimento de segunda a sexta.
          </p>
          <Erro id="erro-data" msg={erros.data} />
        </div>
        <div>
          <Rotulo htmlFor="f-horario" opcional>
            Horário preferido
          </Rotulo>
          <select
            id="f-horario"
            name="horario"
            className="campo"
            value={c.horario}
            disabled={!blocos.length}
            onChange={(e) => muda("horario", e.target.value)}
            aria-invalid={!!erros.horario}
            aria-describedby={desc("horario")}
          >
            <option value="">Escolha um horário</option>
            {blocos.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <Erro id="erro-horario" msg={erros.horario} />
        </div>
      </div>

      <div>
        <Rotulo htmlFor="f-obs" opcional>
          Observações
        </Rotulo>
        <textarea
          id="f-obs"
          name="obs"
          rows={3}
          className="campo resize-y"
          placeholder="Se quiser, conte o que você precisa."
          maxLength={limite}
          value={c.obs}
          onChange={(e) => muda("obs", e.target.value)}
          aria-invalid={!!erros.obs}
          aria-describedby={desc("obs", "dica-obs contador-obs")}
        />
        <div className="mt-2 flex items-start justify-between gap-4 text-[0.85rem] text-cinza-texto">
          <p id="dica-obs">Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</p>
          <p id="contador-obs" className="shrink-0 tabular-nums" aria-live="off">
            {c.obs.length}/{limite}
          </p>
        </div>
        <Erro id="erro-obs" msg={erros.obs} />
      </div>

      <p className="border-l-[1.5px] border-bronze-escuro bg-areia/50 px-4 py-3 text-[0.92rem]">
        Não envie fotos, exames nem informações de saúde por aqui. Isso é tratado na consulta.
      </p>

      <div>
        <button type="submit" className="botao botao-primario w-full sm:w-auto" disabled={status === "enviando"} aria-busy={status === "enviando"}>
          {status === "enviando" ? (
            <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-creme/40 border-t-creme" />
          ) : (
            <IconeWhatsapp />
          )}
          <span>{status === "enviando" ? "Abrindo o WhatsApp…" : "Enviar solicitação pelo WhatsApp"}</span>
        </button>
        <p id="form-nota" className="mt-4 text-[0.88rem] text-cinza-texto">
          Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados. Data e horário são
          preferências e dependem da confirmação da clínica.{" "}
          <a href="/privacidade.html" className="link-sublinhado text-grafite">
            Privacidade
          </a>
        </p>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {aviso}
      </p>
    </form>
  );
}

export function Agendar() {
  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-areia/55 py-24 lg:py-32">
      <div className="container-phd grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Revela className="lg:col-span-5">
          <p className="rotulo">Praticidade</p>
          <h2 id="titulo-agendar" className="mt-5 text-[2.15rem] sm:text-[2.6rem] lg:text-[3.1rem]">
            Peça seu horário em poucos <em>cliques</em>.
          </h2>
          <p className="mt-5 max-w-md text-lg text-cinza-texto">
            {temWhatsapp
              ? "Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega à clínica pelo WhatsApp, e a equipe confirma a disponibilidade."
              : "Para pedir um horário, ligue para a clínica. A equipe verifica a agenda e confirma a disponibilidade."}
          </p>
          {temWhatsapp ? (
            <ol className="mt-10 space-y-4">
              {["Preencha o que souber", "Envie a mensagem no WhatsApp", "A equipe confirma dia e horário"].map((t, i) => (
                <li key={t} className="flex items-center gap-4">
                  <span aria-hidden="true" className="flex h-9 w-10 items-center justify-center rounded-[2px_99px_99px_2px] border-[1.5px] border-bronze-escuro font-serif text-grafite">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          ) : null}
        </Revela>
        <Revela className="lg:col-span-7" atraso={120}>
          <div className="canto-d bg-creme p-6 shadow-[0_30px_60px_-40px_rgb(42_41_38/0.45)] sm:p-10">
            {temWhatsapp ? (
              <Formulario />
            ) : (
              <div className="flex flex-col items-start gap-5">
                <p className="text-lg">Ligue para {CONFIG.telefoneExibicao} e combine o dia e o horário com a equipe.</p>
                <a href={telHref} className="botao botao-primario">
                  <IconeTelefone /> Ligar
                </a>
              </div>
            )}
          </div>
        </Revela>
      </div>
    </section>
  );
}
