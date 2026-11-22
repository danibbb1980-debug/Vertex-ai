import { useId, useMemo, useRef, useState } from "react";
import { CONFIG, atendimentosAtivos, linkWhatsapp } from "../config";
import { Afinacao } from "./Afinacao";

const A_DEFINIR = "Ainda não sei, quero conversar";
const LIMITE_OBS = 300;

const paraMin = (h: string) => {
  const [a, b] = h.split(":").map(Number);
  return a * 60 + b;
};
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function hojeISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

type Erros = Partial<Record<"nome" | "data" | "hora", string>>;

export function Agendar({ n }: { n: number }) {
  const id = useId();
  const atendimentos = atendimentosAtivos();
  const comHorarios = CONFIG.horarios.length > 0;

  const [nome, setNome] = useState("");
  const [atend, setAtend] = useState("");
  const [preferencia, setPreferencia] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [obs, setObs] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<null | { url: string; bloqueado: boolean }>(null);
  const nomeRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);
  const horaRef = useRef<HTMLSelectElement>(null);

  const diaSemana = data ? new Date(`${data}T12:00:00`).getDay() : -1;
  const horarioDoDia = comHorarios ? CONFIG.horarios.find((h) => h.dia === diaSemana) : undefined;
  const diaFechado = Boolean(data) && comHorarios && !horarioDoDia;

  const blocos = useMemo(() => {
    if (!horarioDoDia) return [];
    const out: string[] = [];
    const ini = paraMin(horarioDoDia.abre);
    const fim = paraMin(horarioDoDia.fecha);
    for (let m = ini; m + 60 <= fim; m += 60) {
      const p = horarioDoDia.pausa;
      if (p && m < paraMin(p.fim) && m + 60 > paraMin(p.inicio)) continue;
      out.push(hhmm(m));
    }
    return out;
  }, [horarioDoDia]);

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = "Informe seu nome para o Harmonize saber como te chamar.";
    if (comHorarios && data) {
      if (data < hojeISO()) e.data = "Escolha uma data a partir de hoje.";
      else if (diaFechado) e.data = "Dia sem atendimento, escolha outra data.";
      else if (!hora) e.hora = "Escolha um horário de preferência.";
    }
    return e;
  }

  function montarMensagem() {
    let pref = "a combinar";
    if (comHorarios && data && hora) {
      const [a, m, d] = data.split("-");
      pref = `${d}/${m}/${a} às ${hora}`;
    } else if (!comHorarios && preferencia.trim()) {
      pref = preferencia.trim();
    }
    return [
      "Olá! Vim pelo site do Harmonize Corpo e Mente e gostaria de solicitar um atendimento.",
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atend && atend !== A_DEFINIR ? atend : "a definir"}`,
      `Preferência de dia e horário: ${pref}`,
      `Observações: ${obs.trim() || "-"}`,
    ].join("\n");
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (e.nome) return nomeRef.current?.focus();
    if (e.data) return dataRef.current?.focus();
    if (e.hora) return horaRef.current?.focus();
    const url = linkWhatsapp(montarMensagem());
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null; // equivalente a noopener, mas permite detectar bloqueio de pop-up
    setEnviado({ url, bloqueado: !janela });
  }

  if (!CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;

  const descr = (k: keyof Erros) => (erros[k] ? `${id}-${k}-erro` : undefined);

  return (
    <section id="agendar" aria-labelledby="titulo-agendar" className="bg-areia-2 py-20 sm:py-28 lg:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="rotulo flex items-baseline gap-3 text-apoio">
            <span className="acende visto num" aria-hidden="true">
              {String(n).padStart(2, "0")}
            </span>
            <span>Praticidade</span>
          </p>
          <h2 id="titulo-agendar" className="mt-6 text-[clamp(2.4rem,4.6vw,4rem)]">
            Peça seu atendimento em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-md text-apoio">
            Escolha o atendimento e conte sua preferência de dia e horário. Sua solicitação chega pelo WhatsApp e o
            Harmonize confirma a disponibilidade. O horário só vale depois dessa confirmação.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-tinta/20 bg-areia">
            <Afinacao modo="estatico" amplitude={0} altura="8px" />
            <div className="p-6 sm:p-10">
              {enviado ? (
                <div role="status" aria-live="polite">
                  {enviado.bloqueado ? (
                    <>
                      <p className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] leading-tight tracking-[-0.015em]">
                        Sua mensagem está pronta.
                      </p>
                      <p className="mt-4 max-w-md text-apoio">
                        O navegador impediu a abertura automática. Toque abaixo para abrir o WhatsApp e enviar a mensagem.
                      </p>
                      <a className="btn btn-tinta mt-6" href={enviado.url} target="_blank" rel="noopener noreferrer">
                        Abrir WhatsApp
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] leading-tight tracking-[-0.015em]">
                        Pronto! Abrimos o WhatsApp com sua solicitação.
                      </p>
                      <p className="mt-4 max-w-md text-apoio">
                        É só enviar a mensagem. O Harmonize confirma a disponibilidade.
                      </p>
                      <p className="mt-6 text-[0.95rem]">
                        O WhatsApp não abriu?{" "}
                        <a className="link font-semibold" href={enviado.url} target="_blank" rel="noopener noreferrer">
                          Abrir WhatsApp
                        </a>
                      </p>
                    </>
                  )}
                  <button type="button" className="btn btn-linha mt-8" onClick={() => setEnviado(null)}>
                    Fazer outra solicitação
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={enviar} aria-describedby={`${id}-priv`}>
                  <div aria-live="polite" className="sr-only">
                    {Object.values(erros).filter(Boolean).join(" ")}
                  </div>
                  <div className="grid gap-8">
                    <div>
                      <label htmlFor={`${id}-nome`} className="rotulo text-apoio">
                        Nome completo
                      </label>
                      <input
                        ref={nomeRef}
                        id={`${id}-nome`}
                        name="nome"
                        type="text"
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-invalid={Boolean(erros.nome)}
                        aria-describedby={descr("nome")}
                        className="campo"
                        placeholder="Como devemos te chamar?"
                        value={nome}
                        maxLength={80}
                        onChange={(e) => setNome(e.target.value)}
                      />
                      {erros.nome && (
                        <p id={`${id}-nome-erro`} className="mt-2 text-[0.92rem] text-terracota-esc">
                          {erros.nome}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor={`${id}-atend`} className="rotulo text-apoio">
                        Atendimento desejado
                      </label>
                      <select
                        id={`${id}-atend`}
                        name="atendimento"
                        className="campo"
                        value={atend}
                        onChange={(e) => setAtend(e.target.value)}
                      >
                        <option value="">Selecione</option>
                        {atendimentos.map((a) => (
                          <option key={a.id} value={a.nome}>
                            {a.nome}
                          </option>
                        ))}
                        <option value={A_DEFINIR}>{A_DEFINIR}</option>
                      </select>
                    </div>

                    {comHorarios ? (
                      <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                          <label htmlFor={`${id}-data`} className="rotulo text-apoio">
                            Dia de preferência (opcional)
                          </label>
                          <input
                            ref={dataRef}
                            id={`${id}-data`}
                            type="date"
                            min={hojeISO()}
                            className="campo"
                            value={data}
                            aria-invalid={Boolean(erros.data) || diaFechado}
                            aria-describedby={erros.data || diaFechado ? `${id}-data-erro` : undefined}
                            onChange={(e) => {
                              setData(e.target.value);
                              setHora("");
                            }}
                          />
                          {(erros.data || diaFechado) && (
                            <p id={`${id}-data-erro`} className="mt-2 text-[0.92rem] text-terracota-esc">
                              {erros.data ?? "Dia sem atendimento, escolha outra data."}
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor={`${id}-hora`} className="rotulo text-apoio">
                            Horário de preferência
                          </label>
                          <select
                            ref={horaRef}
                            id={`${id}-hora`}
                            className="campo"
                            value={hora}
                            disabled={!data || diaFechado}
                            aria-invalid={Boolean(erros.hora)}
                            aria-describedby={descr("hora")}
                            onChange={(e) => setHora(e.target.value)}
                          >
                            <option value="">{data ? "Selecione" : "Escolha o dia antes"}</option>
                            {blocos.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                          {erros.hora && (
                            <p id={`${id}-hora-erro`} className="mt-2 text-[0.92rem] text-terracota-esc">
                              {erros.hora}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor={`${id}-pref`} className="rotulo text-apoio">
                          Melhor dia e horário (opcional)
                        </label>
                        <input
                          id={`${id}-pref`}
                          name="preferencia"
                          type="text"
                          className="campo"
                          placeholder="Ex.: terça à tarde"
                          maxLength={80}
                          value={preferencia}
                          onChange={(e) => setPreferencia(e.target.value)}
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor={`${id}-obs`} className="rotulo text-apoio">
                        Observações (opcional)
                      </label>
                      <textarea
                        id={`${id}-obs`}
                        name="observacoes"
                        rows={3}
                        maxLength={LIMITE_OBS}
                        className="campo resize-y"
                        placeholder="Se quiser, conte o que você procura."
                        aria-describedby={`${id}-obs-aviso`}
                        value={obs}
                        onChange={(e) => setObs(e.target.value)}
                      />
                      <div id={`${id}-obs-aviso`} className="mt-2 flex justify-between gap-4 text-[0.85rem] text-apoio">
                        <span>
                          Não é preciso informar dados de saúde nem enviar documentos aqui. Conversamos com calma pelo
                          WhatsApp.
                        </span>
                        <span className="num shrink-0" aria-label={`${obs.length} de ${LIMITE_OBS} caracteres`}>
                          {obs.length}/{LIMITE_OBS}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-tinta mt-10 w-full sm:w-auto">
                    Enviar solicitação pelo WhatsApp
                  </button>
                  <p id={`${id}-priv`} className="mt-5 max-w-lg text-[0.85rem] leading-relaxed text-apoio">
                    Ao enviar, você abre uma conversa no WhatsApp com o Harmonize. Este site não guarda os dados
                    digitados.{" "}
                    <a className="link" href="/privacidade.html">
                      Saiba como tratamos a privacidade
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
