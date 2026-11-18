import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CONFIG, type Horario } from "../config";

const LIMITE_OBS = 300;
const OPCAO_NAO_SEI = "Ainda não sei, quero conversar";

const paraMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const paraHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** blocos de 1 hora: começa na abertura, termina antes do fechamento, pula pausas */
export function blocosDoDia(h: Horario) {
  const out: string[] = [];
  for (let t = paraMin(h.abre); t + 60 <= paraMin(h.fecha); t += 60) {
    const fim = t + 60;
    const colide = (h.pausas ?? []).some((p) => t < paraMin(p.fim) && fim > paraMin(p.inicio));
    if (!colide) out.push(paraHora(t));
  }
  return out;
}

const hojeISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const diaDaSemana = (iso: string) => new Date(iso + "T12:00:00").getDay();
const dataBR = (iso: string) => iso.split("-").reverse().join("/");

type Erros = Partial<Record<"nome" | "data" | "hora", string>>;

export function Agendar() {
  const temHorarios = CONFIG.horarios.length > 0;
  const opcoes = useMemo(
    () => ["Primeira avaliação", ...CONFIG.atendimentos.map((a) => a.nome), ...(CONFIG.mostrarAtendimentosDiretorio ? CONFIG.atendimentosDiretorio.map((a) => a.nome) : []), OPCAO_NAO_SEI],
    []
  );

  const [nome, setNome] = useState("");
  const [atendimento, setAtendimento] = useState(opcoes[0]);
  const [preferencia, setPreferencia] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<{ url: string; bloqueado: boolean } | null>(null);
  const [aviso, setAviso] = useState("");

  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const refNome = useRef<HTMLInputElement>(null);
  const refData = useRef<HTMLInputElement>(null);
  const refHora = useRef<HTMLSelectElement>(null);
  const refSucesso = useRef<HTMLDivElement>(null);

  const horarioDoDia = data ? CONFIG.horarios.find((h) => h.dia === diaDaSemana(data)) : undefined;
  const blocos = horarioDoDia ? blocosDoDia(horarioDoDia) : [];

  const validarData = (v: string): string | undefined => {
    if (!temHorarios) return undefined;
    if (!v) return "Escolha uma data.";
    if (v < hojeISO()) return "Escolha uma data a partir de hoje.";
    if (!CONFIG.horarios.some((h) => h.dia === diaDaSemana(v))) return "Dia sem atendimento, escolha outra data";
    return undefined;
  };

  const montarMensagem = () => {
    const pref = temHorarios
      ? `${dataBR(data)} às ${hora}`
      : preferencia.trim() || "a combinar";
    return [
      "Olá! Vim pelo site do BIOS Instituto de Odontologia e Estética e gostaria de solicitar um agendamento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento === OPCAO_NAO_SEI ? "a definir" : atendimento}`,
      `Preferência de dia e horário: ${pref}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome.";
    if (temHorarios) {
      const ed = validarData(data);
      if (ed) e.data = ed;
      else if (!hora) e.hora = "Escolha um horário.";
    }
    setErros(e);
    if (Object.keys(e).length) {
      setAviso(`Revise ${Object.keys(e).length === 1 ? "o campo indicado" : "os campos indicados"}.`);
      (e.nome ? refNome : e.data ? refData : refHora).current?.focus();
      return;
    }
    setAviso("");
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(montarMensagem())}`;
    // abre em nova aba sem dar acesso a esta página (equivalente a noopener)
    const janela = window.open("", "_blank");
    let bloqueado = !janela;
    if (janela) {
      try {
        janela.opener = null;
        janela.location.href = url;
      } catch {
        bloqueado = true;
      }
    }
    setEnviado({ url, bloqueado });
    requestAnimationFrame(() => refSucesso.current?.focus());
  };

  const erroProps = (campo: keyof Erros) =>
    erros[campo]
      ? { "aria-invalid": true as const, "aria-describedby": `${id}-${campo}-erro` }
      : { "aria-invalid": false as const };

  const Rotulo = ({ htmlFor, children, opcional }: { htmlFor: string; children: string; opcional?: boolean }) => (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-4 text-[0.9375rem] font-semibold">
      <span>{children}</span>
      {opcional && <span className="text-[0.8125rem] font-normal text-cinza">opcional</span>}
    </label>
  );
  const Erro = ({ campo }: { campo: keyof Erros }) =>
    erros[campo] ? (
      <p id={`${id}-${campo}-erro`} className="mb-0 mt-2 text-[0.875rem] font-semibold text-[#9b2c1f]">
        {erros[campo]}
      </p>
    ) : null;

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-pedra-2 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="rotulo m-0 text-bronze-texto">Praticidade</p>
          <h2 id="titulo-agendar" className="t-h2 mb-0 mt-5">
            Peça sua avaliação em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-[40ch] text-cinza">
            Escolha o atendimento e conte sua preferência de dia e horário. Sua solicitação chega pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-t-0 border-pedra-3 bg-pedra">
            <div aria-hidden="true" className="h-px bg-bronze" />
            {enviado ? (
              <div ref={refSucesso} tabIndex={-1} className="p-6 outline-none sm:p-10" role="status">
                <p className="m-0 font-display text-[2rem] leading-tight tracking-[-0.02em]">Pronto!</p>
                <p className="mb-0 mt-4 max-w-[46ch]">
                  {enviado.bloqueado
                    ? "O navegador impediu a abertura de uma nova aba. Use o botão abaixo para abrir o WhatsApp com a sua solicitação."
                    : "Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A clínica confirma a disponibilidade."}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={enviado.url} target="_blank" rel="noopener noreferrer" className="botao botao-cheio">
                    Abrir WhatsApp
                  </a>
                  <button type="button" className="botao botao-linha cursor-pointer" onClick={() => setEnviado(null)}>
                    Editar solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={enviar} className="grid gap-6 p-5 sm:p-10" aria-describedby={`${id}-nota`}>
                <p aria-live="polite" className="sr-only">
                  {aviso}
                </p>

                <div>
                  <Rotulo htmlFor={`${id}-nome`}>Nome completo</Rotulo>
                  <input
                    ref={refNome}
                    id={`${id}-nome`}
                    name="nome"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Como devemos te chamar?"
                    className="campo"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                    }}
                    {...erroProps("nome")}
                  />
                  <Erro campo="nome" />
                </div>

                <div>
                  <Rotulo htmlFor={`${id}-atendimento`}>Atendimento desejado</Rotulo>
                  <select
                    id={`${id}-atendimento`}
                    name="atendimento"
                    className="campo"
                    value={atendimento}
                    onChange={(e) => setAtendimento(e.target.value)}
                  >
                    {opcoes.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {temHorarios ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Rotulo htmlFor={`${id}-data`}>Dia de preferência</Rotulo>
                      <input
                        ref={refData}
                        id={`${id}-data`}
                        name="data"
                        type="date"
                        min={hojeISO()}
                        className="campo"
                        value={data}
                        onChange={(e) => {
                          setData(e.target.value);
                          setHora("");
                          setErros((x) => ({ ...x, data: validarData(e.target.value), hora: undefined }));
                        }}
                        {...erroProps("data")}
                      />
                      <Erro campo="data" />
                    </div>
                    <div>
                      <Rotulo htmlFor={`${id}-hora`}>Horário de preferência</Rotulo>
                      <select
                        ref={refHora}
                        id={`${id}-hora`}
                        name="hora"
                        className="campo"
                        value={hora}
                        disabled={!blocos.length}
                        onChange={(e) => {
                          setHora(e.target.value);
                          if (erros.hora) setErros((x) => ({ ...x, hora: undefined }));
                        }}
                        {...erroProps("hora")}
                      >
                        <option value="">Escolha um horário</option>
                        {blocos.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <Erro campo="hora" />
                    </div>
                    <p className="m-0 text-[0.8125rem] text-cinza sm:col-span-2">
                      Dia e horário são preferências. A clínica confirma a disponibilidade.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Rotulo htmlFor={`${id}-pref`} opcional>
                      Melhor dia e horário
                    </Rotulo>
                    <input
                      id={`${id}-pref`}
                      name="preferencia"
                      type="text"
                      maxLength={80}
                      placeholder="Ex.: terça à tarde"
                      className="campo"
                      value={preferencia}
                      onChange={(e) => setPreferencia(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Rotulo htmlFor={`${id}-obs`} opcional>
                    Observações
                  </Rotulo>
                  <textarea
                    id={`${id}-obs`}
                    name="observacoes"
                    rows={3}
                    maxLength={LIMITE_OBS}
                    placeholder="Se quiser, conte o que você procura."
                    className="campo min-h-28 resize-y"
                    aria-describedby={`${id}-obs-ajuda`}
                    value={obs}
                    onChange={(e) => setObs(e.target.value.slice(0, LIMITE_OBS))}
                  />
                  <p id={`${id}-obs-ajuda`} className="mb-0 mt-2 flex justify-between gap-4 text-[0.8125rem] text-cinza">
                    <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                    <span className="num shrink-0" aria-hidden="true">
                      {obs.length}/{LIMITE_OBS}
                    </span>
                  </p>
                </div>

                <div className="pt-2">
                  <button type="submit" className="botao botao-cheio w-full cursor-pointer whitespace-normal py-3 text-center">
                    Enviar solicitação pelo WhatsApp
                  </button>
                  <p id={`${id}-nota`} className="mb-0 mt-4 text-[0.8125rem] leading-relaxed text-cinza">
                    Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{" "}
                    <a href="/privacidade.html" className="link text-grafite">
                      Privacidade
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
