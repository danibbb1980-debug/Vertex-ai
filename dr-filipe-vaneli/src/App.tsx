import { useEffect, useState, type ReactNode } from "react";
import { CONFIG, MSG_GERAL, enderecoLinha, msgAtendimento, waUrl } from "./config";
import Logo, { Monograma } from "./components/Logo";
import Regua, { type Capitulo } from "./components/Regua";
import Casos from "./components/Casos";
import Agendar from "./components/Agendar";

const S = CONFIG.secoes;
const temCasos = S.casos && CONFIG.casos.length > 0;
const medico = CONFIG.profissionais[0];

const CAPITULOS: Capitulo[] = (
  [
    S.avaliacao && { id: "avaliacao", rotulo: "Avaliação" },
    S.atendimento && CONFIG.atendimentos.length > 0 && { id: "atendimento", rotulo: "Atendimento" },
    temCasos && { id: "antes-e-depois", rotulo: "Antes e depois" },
    S.medico && { id: "medico", rotulo: "O médico" },
    S.comoFunciona && { id: "como-funciona", rotulo: "Como funciona" },
    S.duvidas && { id: "duvidas", rotulo: "Dúvidas" },
    S.local && { id: "contato", rotulo: "Contato" },
  ].filter(Boolean) as { id: string; rotulo: string }[]
).map((c, i) => ({ ...c, num: String(i + 1).padStart(2, "0") }));
const num = (id: string) => CAPITULOS.find((c) => c.id === id)?.num ?? "";

function BotaoWhats({ msg = MSG_GERAL, children = "Agendar avaliação", variante = "cheio", className = "" }: { msg?: string; children?: ReactNode; variante?: "cheio" | "linha"; className?: string }) {
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <a href={waUrl(msg)} target="_blank" rel="noopener noreferrer" className={`btn btn-${variante} ${className}`}>
      <span className="tick" aria-hidden="true" />
      {children}
    </a>
  );
}

function BotaoInsta({ className = "" }: { className?: string }) {
  if (!CONFIG.instagram) return null;
  return (
    <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className={`btn btn-linha ${className}`}>
      Ver no Instagram
    </a>
  );
}

function Cabeca({ id, titulo, escuro }: { id: string; titulo: ReactNode; escuro?: boolean }) {
  return (
    <div className="flex items-baseline gap-5">
      <span className={`num text-sm ${escuro ? "text-latao" : "text-latao-tinta"}`}>{num(id)}</span>
      <span className={`h-px flex-1 max-w-24 self-center ${escuro ? "bg-latao/60" : "bg-latao"}`} aria-hidden="true" />
      <h2 className="sr-only">{titulo}</h2>
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    const f = () => setSolido(scrollY > 24);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, []);
  const links = CAPITULOS;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solido || aberto ? "bg-papel/95 backdrop-blur border-b border-floresta/10" : "bg-transparent"}`}>
      {CONFIG.rascunho && (
        <p className="bg-floresta px-2 py-1 text-center text-[0.68rem] text-papel/85 sm:font-mono sm:text-[0.62rem] sm:tracking-[0.08em]">
          Rascunho para avaliação. Informações sujeitas a confirmação.
        </p>
      )}
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-4 sm:px-6 lg:pl-20">
        <a href="#topo" className="shrink-0" aria-label={`${CONFIG.nome}, início`}>
          <Logo className="scale-[0.85] origin-left sm:scale-100" />
        </a>
        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex gap-6 text-sm">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="py-2 text-floresta/75 hover:text-floresta">{l.rotulo}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <BotaoWhats className="hidden sm:inline-flex !min-h-11 !py-2 text-sm" />
          <button
            className="flex h-12 w-12 items-center justify-center xl:hidden"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span className={`absolute left-0 h-px w-6 bg-floresta transition-transform ${aberto ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px bg-floresta transition-all ${aberto ? "top-1.5 w-6 -rotate-45" : "top-3 w-4"}`} />
            </span>
          </button>
        </div>
      </div>
      {aberto && (
        <nav id="menu-movel" aria-label="Menu" className="border-t border-floresta/10 bg-papel px-4 pb-6 xl:hidden">
          <ul>
            {links.map((l) => (
              <li key={l.id} className="border-b border-floresta/10">
                <a href={`#${l.id}`} onClick={() => setAberto(false)} className="flex min-h-12 items-baseline gap-4 py-3">
                  <span className="num text-xs text-latao-tinta">{l.num}</span>
                  <span className="display text-2xl">{l.rotulo}</span>
                </a>
              </li>
            ))}
          </ul>
          <BotaoWhats className="mt-5 w-full" />
        </nav>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const e = CONFIG.endereco;
  return (
    <section id="topo" data-tom="claro" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pb-24">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:pl-20">
        <div className="lg:col-span-8">
          <p className="mono text-latao-tinta">
            {CONFIG.nome} · {CONFIG.profissao} · {CONFIG.registro}
          </p>
          <h1 className="display mt-6 text-[3rem] leading-[0.98] sm:text-7xl lg:text-[6.4rem]">
            Antes de qualquer procedimento, uma <em>avaliação</em>.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-pedra">
            Atendimento médico em estética facial, com avaliação individual e horário marcado, em {e.cidade} - {e.uf}.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <BotaoWhats />
            {S.local && (
              <a href="#consultorio" className="btn btn-linha">Ver o consultório</a>
            )}
          </div>
        </div>

        {/* ficha */}
        <aside className="lg:col-span-4 lg:self-end" aria-label="Ficha do médico">
          <dl className="border-t border-floresta">
            {[
              ["Nome", CONFIG.nome],
              ["Profissão", CONFIG.profissao],
              ["Registro", CONFIG.registro],
              ["Consultório", `${e.cidade} - ${e.uf}`],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] items-baseline border-b border-floresta/20 py-3.5">
                <dt className="ficha-rotulo">{k}</dt>
                <dd className={k === "Registro" ? "num text-[0.95rem]" : "display text-xl"}>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {/* escala horizontal grande */}
      <div className="mx-auto mt-16 max-w-[1240px] px-4 sm:px-6 lg:pl-20" aria-hidden="true">
        <div className="relative h-10 text-floresta">
          {Array.from({ length: 101 }).map((_, i) => (
            <span
              key={i}
              className="tick-up absolute bottom-0 w-px bg-current"
              style={{
                left: `${i}%`,
                height: i % 10 === 0 ? 40 : i % 5 === 0 ? 22 : 10,
                opacity: i % 10 === 0 ? 0.9 : 0.35,
                animationDelay: `${200 + i * 12}ms`,
              }}
            />
          ))}
          <span className="absolute bottom-0 left-0 h-px w-full bg-floresta/40" />
          <span className="absolute -bottom-1 h-12 w-[2px] bg-latao" style={{ left: "38%" }} />
        </div>
        <div className="mt-2 hidden justify-between sm:flex">
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i} className="num text-[0.65rem] text-pedra">{i * 10}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 01 A avaliação ---------------- */
function Avaliacao() {
  const linhas = [
    ["O que você procura", "A consulta começa ouvindo você: o que incomoda, o que espera e o que não quer."],
    ["Avaliação médica individual", "Exame do rosto, histórico de saúde e conversa sobre o que é indicado no seu caso."],
    ["Plano explicado com clareza", "O que pode ser feito, o que não é indicado, cuidados e próximos passos, antes de qualquer decisão."],
  ];
  return (
    <section id="avaliacao" data-tom="escuro" className="tom-escuro bg-floresta py-24 text-papel sm:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:pl-20">
        <Cabeca id="avaliacao" titulo="A avaliação" escuro />
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <p className="display text-4xl sm:text-5xl lg:col-span-5">
            A primeira consulta é uma <em>conversa</em> e um exame.
          </p>
          <ol className="lg:col-span-7 lg:pt-2">
            {linhas.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-papel/15 py-7 last:border-b sm:grid-cols-[4rem_1fr]">
                <span className="num pt-2 text-sm text-latao">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display text-3xl sm:text-[2.6rem]">{t}</h3>
                  <p className="mt-3 max-w-lg text-papel/70">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 02 Atendimento ---------------- */
function Atendimento() {
  const [aberto, setAberto] = useState<string | null>(CONFIG.atendimentos[0]?.id ?? null);
  return (
    <section id="atendimento" data-tom="claro" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:pl-20">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Cabeca id="atendimento" titulo="Atendimento" />
            <p className="display mt-8 text-5xl sm:text-6xl">
              O que é <em>atendido</em> no consultório.
            </p>
            <p className="mt-6 max-w-sm text-pedra">
              A indicação de cada atendimento depende de avaliação médica individual.
            </p>
          </div>
        </div>
        <ul className="border-t border-floresta lg:col-span-8">
          {CONFIG.atendimentos.map((a, i) => {
            const on = aberto === a.id;
            return (
              <li key={a.id} className="border-b border-floresta/20">
                <h3>
                  <button
                    className="group flex w-full items-baseline gap-5 py-6 text-left sm:gap-8"
                    aria-expanded={on}
                    aria-controls={`at-${a.id}`}
                    onClick={() => setAberto(on ? null : a.id)}
                  >
                    <span className="num w-8 shrink-0 text-sm text-latao-tinta">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`display flex-1 text-[2rem] sm:text-5xl transition-[font-style] ${on ? "italic" : ""}`}>{a.nome}</span>
                    <span className="relative h-4 w-4 shrink-0 self-center" aria-hidden="true">
                      <span className="absolute top-1/2 left-0 h-px w-4 bg-floresta" />
                      <span className={`absolute left-1/2 top-0 h-4 w-px bg-floresta transition-transform ${on ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div id={`at-${a.id}`} hidden={!on} className="pb-8 pl-[3.25rem] sm:pl-16">
                  <p className="max-w-xl text-lg">{a.descricao}</p>
                  <p className="mt-3 text-sm text-pedra">A indicação depende de avaliação médica individual.</p>
                  <BotaoWhats msg={msgAtendimento(a.nome)} variante="linha" className="mt-6">
                    Agendar avaliação
                  </BotaoWhats>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- 03 Antes e depois ---------------- */
function AntesDepois() {
  return (
    <section id="antes-e-depois" data-tom="escuro" className="tom-escuro bg-floresta py-24 text-papel sm:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:pl-20">
        <Cabeca id="antes-e-depois" titulo="Antes e depois" escuro />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <p className="display max-w-2xl text-4xl sm:text-6xl">
            Antes e depois, lado a <em>lado</em>.
          </p>
          <p className="max-w-xs text-sm text-papel/70">Arraste a régua dourada, toque na imagem ou use as setas do teclado.</p>
        </div>
        <div className="mt-14">
          <Casos />
        </div>
      </div>
    </section>
  );
}

/* ---------------- 04 O médico ---------------- */
function Medico() {
  const extra = [medico.especialidade && ["Especialidade", medico.especialidade], medico.rqe && ["RQE", medico.rqe]].filter(Boolean) as string[][];
  return (
    <section id="medico" data-tom="claro" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:pl-20">
        <Cabeca id="medico" titulo="O médico" />
        <div className="mt-10 grid items-end gap-12 lg:grid-cols-12">
          {medico.foto?.src && (
            <figure className="relative lg:col-span-6">
              <img src={medico.foto.src} alt={medico.foto.alt} width={1170} height={874} loading="lazy" className="w-full object-cover" />
              <Monograma tinta="#f4f0e6" latao="#b39553" className="absolute bottom-4 right-4 h-12 w-12 bg-floresta p-1.5" />
              <span className="absolute -left-3 top-0 h-full w-px bg-latao" aria-hidden="true" />
            </figure>
          )}
          <div className={medico.foto?.src ? "lg:col-span-6" : "lg:col-span-12"}>
            <p className="display text-6xl sm:text-8xl">
              Filipe <em>Vaneli</em>
            </p>
            <dl className="mt-10 border-t border-floresta">
              {[["Profissão", medico.profissao], ["Registro", medico.registro], ...extra, ["Atua com", "Estética facial"]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] items-baseline border-b border-floresta/20 py-3.5">
                  <dt className="ficha-rotulo">{k}</dt>
                  <dd className="display text-xl">{v}</dd>
                </div>
              ))}
            </dl>
            <BotaoWhats className="mt-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 05 Como funciona ---------------- */
function ComoFunciona() {
  const etapas = [
    ["Contato e agendamento", "Você chama no WhatsApp ou envia a solicitação pelo site. A equipe confirma dia e horário."],
    ["Avaliação médica individual", "Consulta com o médico: conversa, histórico e exame do rosto."],
    ["Plano explicado com clareza", "O que é indicado, o que não é, cuidados e próximos passos. A decisão é sua."],
    ["Acompanhamento", "Retornos combinados na avaliação, conforme o que foi feito."],
  ];
  const [prog, setProg] = useState(0);
  const [lista, setLista] = useState<HTMLOListElement | null>(null);
  useEffect(() => {
    if (!lista) return;
    let raf = 0;
    const f = () => {
      raf = 0;
      const r = lista.getBoundingClientRect();
      setProg(Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(f); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) addEventListener("scroll", on, { passive: true });
      else removeEventListener("scroll", on);
    });
    io.observe(lista);
    f();
    return () => { io.disconnect(); removeEventListener("scroll", on); };
  }, [lista]);
  return (
    <section id="como-funciona" data-tom="claro" className="border-t border-floresta/10 bg-papel-2 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:pl-20">
        <div className="lg:col-span-5">
          <Cabeca id="como-funciona" titulo="Como funciona" />
          <p className="display mt-8 text-5xl sm:text-6xl">
            Do primeiro contato ao <em>retorno</em>.
          </p>
        </div>
        <ol ref={setLista} className="relative lg:col-span-7">
          <span className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-floresta/20" aria-hidden="true" />
          <span className="absolute left-[1.15rem] top-2 w-px origin-top bg-latao" style={{ height: "calc(100% - 1rem)", transform: `scaleY(${prog})` }} aria-hidden="true" />
          {etapas.map(([t, d], i) => {
            const aceso = prog >= i / etapas.length;
            return (
              <li key={t} className="relative grid grid-cols-[2.5rem_1fr] gap-x-6 pb-14 last:pb-0">
                <span className={`num relative z-10 flex h-10 w-10 items-center justify-center border text-sm transition-colors duration-500 ${aceso ? "border-latao-tinta bg-floresta text-papel" : "border-floresta/25 bg-papel-2 text-pedra"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1">
                  <h3 className="display text-3xl">{t}</h3>
                  <p className="mt-2 max-w-md text-pedra">{d}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- 06 Dúvidas ---------------- */
function Duvidas() {
  const faq: [string, string][] = [
    ["Como agendar?", `Pelo WhatsApp ${CONFIG.whatsappVisivel} ou pelo formulário deste site, que monta a mensagem e abre o WhatsApp. A equipe confirma a disponibilidade.`],
    ["Como é a primeira avaliação?", "Uma consulta com o médico: conversa sobre o que você procura, histórico de saúde e exame do rosto. Ao final, você recebe a explicação do que é indicado, ou não, para o seu caso."],
    ["O que levar?", "Documento com foto. Se usa medicamentos ou tem exames recentes, leve a lista ou os resultados."],
    ["Quais atendimentos o consultório oferece?", `${CONFIG.atendimentos.map((a) => a.nome).join(", ")}. A indicação de cada um é definida na avaliação.`],
    ["Todo procedimento serve para todas as pessoas?", "Não. A indicação depende de avaliação médica individual, que considera saúde, histórico e o que você procura."],
    ["Quais são os horários?", "Segunda a sexta, das 09h às 18h. Sábado, das 09h às 12h. Os horários podem variar em feriados."],
    ["Atende aos sábados?", "Sim, das 09h às 12h."],
    ["E aos domingos?", "Não há atendimento aos domingos."],
    ["Onde fica?", `${enderecoLinha()}.`],
    ["Posso agendar pelo site?", "Pelo site você envia uma solicitação, que abre no WhatsApp. O agendamento vale depois da confirmação da equipe."],
  ];
  return (
    <section id="duvidas" data-tom="claro" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:pl-20">
        <div className="lg:col-span-4">
          <Cabeca id="duvidas" titulo="Dúvidas frequentes" />
          <p className="display mt-8 text-5xl sm:text-6xl">
            Dúvidas <em>frequentes</em>.
          </p>
        </div>
        <div className="border-t border-floresta lg:col-span-8">
          {faq.map(([q, r]) => (
            <details key={q} className="group border-b border-floresta/20">
              <summary className="flex min-h-12 cursor-pointer items-baseline justify-between gap-6 py-5">
                <span className="display text-2xl sm:text-[1.7rem]">{q}</span>
                <span className="num shrink-0 text-latao-tinta transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-2xl pb-6 text-pedra">{r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 07 Contato ---------------- */
function Local() {
  const e = CONFIG.endereco;
  const [mapa, setMapa] = useState<HTMLDivElement | null>(null);
  const [verMapa, setVerMapa] = useState(false);
  useEffect(() => {
    if (!mapa) return;
    const io = new IntersectionObserver(([x]) => x.isIntersecting && setVerMapa(true), { rootMargin: "300px" });
    io.observe(mapa);
    return () => io.disconnect();
  }, [mapa]);
  const fotos = CONFIG.consultorio;
  return (
    <section id="contato" data-tom="claro" className="border-t border-floresta/10 py-24 sm:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:pl-20">
        <Cabeca id="contato" titulo="Localização e contato" />
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="display text-5xl sm:text-6xl">
              Venha nos <em>visitar</em>.
            </p>
            <address className="mt-8 not-italic">
              <p className="text-lg">
                {e.rua}, {e.bairro}
                <br />
                {e.cidade} - {e.uf}, CEP {e.cep}
              </p>
              {CONFIG.regiao && <p className="mt-3 text-pedra">Atende pacientes de {e.cidade}, {CONFIG.regiao}.</p>}
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <BotaoWhats>Agendar pelo WhatsApp</BotaoWhats>
              <a href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-linha">Como chegar</a>
              <BotaoInsta />
            </div>
          </div>
          <div className="lg:col-span-6">
            <p className="ficha-rotulo">Horários</p>
            <dl className="mt-3 border-t border-floresta">
              {CONFIG.horarios.map((h) => (
                <div key={h.dia} className="flex justify-between border-b border-floresta/20 py-3">
                  <dt>{h.rotulo}</dt>
                  <dd className={`num text-sm ${h.abre === null ? "text-pedra" : ""}`}>
                    {h.abre === null ? "Fechado" : `${String(h.abre).padStart(2, "0")}h00 às ${String(h.fecha).padStart(2, "0")}h00`}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-pedra">Horários podem variar em feriados.</p>
          </div>
        </div>

        {fotos.length > 0 && (
          <div id="consultorio" className="mt-20 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
            {fotos.map((f, i) => (
              <figure key={f.src} className={i === 0 ? "col-span-2 lg:col-span-6 lg:row-span-2" : "lg:col-span-3"}>
                <img src={f.src} alt={f.alt} loading="lazy" className={`w-full object-cover ${i === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-[3/5]"}`} />
                <figcaption className="mt-2 flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-pedra">
                  <span className="h-px w-5 bg-latao" aria-hidden="true" />
                  {f.legenda}
                </figcaption>
              </figure>
            ))}
            <div className="col-span-2 flex flex-col justify-end border-t border-floresta pt-4 lg:col-span-6">
              <p className="display text-3xl">O consultório, em {e.cidade}.</p>
            </div>
          </div>
        )}

        <div ref={setMapa} className="mt-16 aspect-[4/3] w-full bg-papel-2 sm:aspect-[21/9]">
          {verMapa && (
            <iframe
              title={`Mapa: ${enderecoLinha()}`}
              src={CONFIG.mapaEmbed}
              className="h-full w-full grayscale-[0.6]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA final ---------------- */
function CtaFinal() {
  return (
    <section data-tom="escuro" className="tom-escuro bg-floresta py-24 text-papel sm:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:pl-20">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <h2 className="display text-5xl sm:text-7xl lg:col-span-8">
            A avaliação é o primeiro <em>passo</em>.
          </h2>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <BotaoWhats />
            <BotaoInsta />
          </div>
        </div>
      </div>
    </section>
  );
}

function Rodape() {
  const rt = CONFIG.responsavelTecnico;
  return (
    <footer data-tom="escuro" className="tom-escuro border-t border-papel/10 bg-floresta pb-28 pt-14 text-papel/80 sm:pb-14">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:pl-20">
        <div className="lg:col-span-5">
          <Logo tom="escuro" />
          <p className="mt-6 text-sm">
            {CONFIG.nome} · {CONFIG.profissao} · {CONFIG.registro}
          </p>
          {rt.nome && rt.registro && <p className="mt-1 text-sm">Responsável técnico: {rt.nome} · {rt.registro}</p>}
        </div>
        <div className="text-sm lg:col-span-4">
          <p>{enderecoLinha()}</p>
          {CONFIG.usarWhatsapp && (
            <p className="mt-2">
              WhatsApp:{" "}
              <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {CONFIG.whatsappVisivel}
              </a>
            </p>
          )}
          <p className="mt-2">
            <a href="/privacidade.html" className="underline underline-offset-4">Privacidade</a>
          </p>
        </div>
        <p className="text-xs text-papel/60 lg:col-span-3">
          Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação médica individual.
        </p>
      </div>
    </footer>
  );
}

function BarraMovel() {
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-floresta/15 bg-papel/95 p-3 backdrop-blur sm:hidden">
        <BotaoWhats className="w-full" />
      </div>
      <a
        href={waUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 hidden h-12 items-center gap-3 border border-latao bg-floresta px-4 text-sm font-semibold text-papel sm:flex"
      >
        <span className="h-4 w-px bg-latao" aria-hidden="true" />
        WhatsApp
      </a>
    </>
  );
}

export default function App() {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-papel focus:p-3">
        Pular para o conteúdo
      </a>
      <Header />
      <Regua capitulos={CAPITULOS} />
      <main id="conteudo">
        <Hero />
        {S.avaliacao && <Avaliacao />}
        {S.atendimento && CONFIG.atendimentos.length > 0 && <Atendimento />}
        {temCasos && <AntesDepois />}
        {S.medico && <Medico />}
        {S.comoFunciona && <ComoFunciona />}
        {S.duvidas && <Duvidas />}
        {S.local && <Local />}
        {S.agendar && CONFIG.usarWhatsapp && (
          <section id="agendar" data-tom="claro" className="border-t border-floresta/10 bg-papel-2 py-24 sm:py-32">
            <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:pl-20">
              <Agendar />
            </div>
          </section>
        )}
        {S.ctaFinal && <CtaFinal />}
      </main>
      <Rodape />
      <BarraMovel />
    </>
  );
}
