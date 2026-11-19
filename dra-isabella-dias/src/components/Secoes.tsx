import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { CONFIG, atendimentosAtivos, enderecoLinha, hFmt, modoWhatsapp, telHref } from "../config";
import { BotaoAgendar, BotaoInstagram, BotaoLigar, Indice, Mascara, Painel } from "./comum";
import { Leque } from "./Leque";

/* ---------------- Header ---------------- */
export function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
  const links = [
    CONFIG.secoes.atendimentos && atendimentosAtivos().length > 0 && { href: "#atendimentos", t: "Atendimentos" },
    CONFIG.secoes.profissional && { href: "#profissional", t: "A profissional" },
    CONFIG.secoes.casos && CONFIG.casos.length > 0 && { href: "#casos", t: "Casos" },
    CONFIG.secoes.comoFunciona && { href: "#como-funciona", t: "Como funciona" },
    CONFIG.secoes.duvidas && { href: "#duvidas", t: "Dúvidas" },
    CONFIG.secoes.local && { href: "#contato", t: "Contato" },
  ].filter(Boolean) as { href: string; t: string }[];

  useEffect(() => {
    const f = () => setSolido(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header className={"header" + (solido || aberto ? " solido" : "")}>
      <div className="wrap">
        <a className="marca" href="#inicio" aria-label="Dra. Isabella Dias, cirurgiã-dentista. Ir para o início">
          <Mascara src={CONFIG.logo.simbolo} className="simbolo" />
          <Mascara src={CONFIG.logo.nome} className="nome" />
        </a>
        <nav className="nav" aria-label="Seções">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.t}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <BotaoAgendar pequeno className="header-cta" />
          <button
            type="button"
            className="menu-btn"
            aria-expanded={aberto}
            aria-controls="menu-movel"
            onClick={() => setAberto((v) => !v)}
          >
            <span className="linhas" aria-hidden="true" />
            Menu
          </button>
        </div>
      </div>
      {aberto && (
        <div id="menu-movel" className="menu-movel">
          <nav aria-label="Seções">
            <ul>
              {links.map((l, i) => (
                <li key={l.href}>
                  <a className="item" href={l.href} onClick={() => setAberto(false)}>
                    {l.t}
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ marginTop: 28, display: "grid", gap: 10 }}>
            <BotaoAgendar />
            {modoWhatsapp() && <BotaoLigar />}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
export function Hero() {
  const e = CONFIG.endereco;
  return (
    <section className="hero" id="inicio" aria-labelledby="titulo-hero">
      <div className="wrap hero-grid">
        <div>
          <p className="rotulo eyebrow">
            {[CONFIG.nome, CONFIG.profissao, CONFIG.cro, `${e.cidade}/${e.uf}`].map((t, i) => (
              <Fragment key={t}>
                {i > 0 && " · "}
                <span>{t}</span>
              </Fragment>
            ))}
          </p>
          <h1 id="titulo-hero" className="display h1">
            Cuidado com calma, a cada <em>etapa</em>.
          </h1>
          <p className="sub">
            Clínica geral e implantes dentários em Serra Negra, com avaliação individual e horário marcado, na Av. Santos
            Pinto.
          </p>
          <div className="acoes">
            <BotaoAgendar />
            {CONFIG.secoes.local && (
              <a className="btn btn-linha" href="#contato">
                Conhecer o consultório
              </a>
            )}
          </div>
          <p className="tel-texto">
            Telefone{" "}
            <a href={telHref} className="num">
              {CONFIG.telefoneExibicao}
            </a>
            , de segunda a sexta.
          </p>
        </div>
        <Leque />
      </div>
    </section>
  );
}

/* ---------------- Atendimentos ---------------- */
export function Atendimentos() {
  const lista = atendimentosAtivos();
  const [aberto, setAberto] = useState<string | null>(lista[0]?.id ?? null);
  if (!CONFIG.secoes.atendimentos || lista.length === 0) return null;
  return (
    <section className="secao secao-escura sobre-escuro" id="atendimentos" aria-labelledby="titulo-atend">
      <div className="wrap atend-grid">
        <div className="atend-lateral">
          <Indice codigo="A1" rotulo="Atendimentos" />
          <h2 id="titulo-atend" className="display h2">
            O que é atendido no <em>consultório</em>.
          </h2>
          <p>
            Cada indicação começa por uma avaliação individual. Abra um item para ler como ele funciona e agende pelo
            telefone.
          </p>
        </div>
        <ol className="atend-lista">
          {lista.map((a) => {
            const isOpen = aberto === a.id;
            return (
              <li key={a.id} className="atend-item">
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    id={`btn-${a.id}`}
                    className="atend-btn"
                    aria-expanded={isOpen}
                    aria-controls={`painel-${a.id}`}
                    onClick={() => setAberto(isOpen ? null : a.id)}
                  >
                    <span className="cod num" aria-hidden="true">
                      {a.codigo}
                    </span>
                    <span className="nome">{a.nome}</span>
                    <span className="sinal" aria-hidden="true" />
                  </button>
                </h3>
                <Painel aberto={isOpen} id={`painel-${a.id}`} labelledBy={`btn-${a.id}`} className="atend-painel">
                  <div className="atend-painel-inner">
                    <p>{a.descricao}</p>
                    <p className="nota">A indicação depende de avaliação individual por profissional habilitado.</p>
                    <BotaoAgendar variante="btn-claro" pequeno atendimento={a.nome} />
                  </div>
                </Painel>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- A profissional ---------------- */
export function Profissional() {
  if (!CONFIG.secoes.profissional) return null;
  const { retrato, consultorio } = CONFIG.fotos;
  const campos: [string, string, boolean?][] = [
    ["Profissão", CONFIG.profissao],
    ["Registro", CONFIG.cro, true],
    ...(CONFIG.especialidade ? ([["Especialidade", `${CONFIG.especialidade}${CONFIG.rqe ? ` · RQE ${CONFIG.rqe}` : ""}`]] as [string, string][]) : []),
    ["Atuação", CONFIG.formacao[0]],
    ["Formação", CONFIG.formacao[1]],
    ...(CONFIG.anosAtuacao ? ([["Tempo", `${CONFIG.anosAtuacao} anos de atuação`, true]] as [string, string, boolean][]) : []),
    ["Endereço", `${CONFIG.endereco.cidade}, ${CONFIG.endereco.uf}`],
  ];
  const escala = ["#FFFDFB", "#F8E6E9", "#F4D9E2", "#E8BACB", "#B8336A"];
  return (
    <section className="secao" id="profissional" aria-labelledby="titulo-prof">
      <div className="wrap prof-grid">
        {retrato && (
          <div className="prof-foto">
            <div className="moldura-lamina">
              <img src={retrato.src} srcSet={`${retrato.src.replace(".webp", "-560.webp")} 560w, ${retrato.src} 900w`} sizes="(min-width: 960px) 520px, 92vw" alt={retrato.alt} width={retrato.largura} height={retrato.altura} loading="lazy" decoding="async" />
            </div>
            <div className="prof-escala" aria-hidden="true">
              {escala.map((c, i) => (
                <i key={c} style={{ background: c, height: 36 + i * 9 }} />
              ))}
            </div>
            {consultorio && (
              <div className="prof-segunda">
                <img src={consultorio.src.replace(".webp", "-320.webp")} srcSet={`${consultorio.src.replace(".webp", "-320.webp")} 320w, ${consultorio.src.replace(".webp", "-560.webp")} 560w`} sizes="(min-width: 960px) 210px, 40vw" alt={consultorio.alt} width={consultorio.largura} height={consultorio.altura} loading="lazy" decoding="async" />
              </div>
            )}
          </div>
        )}
        <div style={retrato ? { marginTop: 24 } : undefined}>
          <Indice codigo="A2" rotulo="A profissional" />
          <h2 id="titulo-prof" className="display prof-nome">
            Isabella <span className="linha2"><em>Dias</em></span>
          </h2>
          <dl className="campos">
            {campos.map(([k, v, grande]) => (
              <div className="campo" key={k}>
                <dt>{k}</dt>
                <dd className={grande ? "grande num" : undefined}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Casos ---------------- */
export function Casos() {
  const trilho = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ ini: true, fim: false });
  const casos = CONFIG.casos;
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const f = () => setPos({ ini: el.scrollLeft < 8, fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    f();
    el.addEventListener("scroll", f, { passive: true });
    return () => el.removeEventListener("scroll", f);
  }, []);
  if (!CONFIG.secoes.casos || casos.length === 0) return null;
  const mover = (dir: number) => {
    const el = trilho.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(".caso");
    const passo = item ? item.offsetWidth + 20 : el.clientWidth * 0.8;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * passo, behavior: reduzir ? "auto" : "smooth" });
  };
  return (
    <section className="secao secao-tinta" id="casos" aria-labelledby="titulo-casos">
      <div className="wrap">
        <div className="casos-cab">
          <div>
            <Indice codigo="A3" rotulo="Registros clínicos" />
            <h2 id="titulo-casos" className="display h2">
              Casos do <em>consultório</em>.
            </h2>
          </div>
          <div>
            <p className="texto-apoio" style={{ margin: 0 }}>
              Atendimentos feitos pela Dra. Isabella Dias, já publicados no perfil profissional. Cada situação teve
              indicação própria, definida em avaliação individual.
            </p>
            <div className="casos-nav">
              <button type="button" onClick={() => mover(-1)} disabled={pos.ini} aria-label="Caso anterior">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button type="button" onClick={() => mover(1)} disabled={pos.fim} aria-label="Próximo caso">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="casos-trilho" ref={trilho} tabIndex={0} role="region" aria-label="Registros clínicos, role para o lado para ver mais">
          {casos.map((c, i) => (
            <figure className="caso" key={c.antes.src}>
              <div className="caso-img">
                <span className="tag">Antes</span>
                <img src={c.antes.src} alt={c.antes.alt} width={c.antes.largura} height={c.antes.altura} loading="lazy" decoding="async" />
              </div>
              <div className="caso-img depois">
                <span className="tag">Depois</span>
                <img src={c.depois.src} alt={c.depois.alt} width={c.depois.largura} height={c.depois.altura} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span>Registro clínico</span>
                <b className="num">
                  {String(i + 1).padStart(2, "0")} de {String(casos.length).padStart(2, "0")}
                </b>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="casos-nota">
          Imagens em caráter informativo. Elas não substituem a consulta: a indicação de cada procedimento depende de
          avaliação individual por profissional habilitado.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Como funciona ---------------- */
const ETAPAS = [
  ["Contato e agendamento", "Você liga, escolhe um horário dentro da agenda e já pode tirar as primeiras dúvidas."],
  ["Avaliação individual", "Conversa sobre o que motivou a visita, histórico de saúde e exame clínico. Se for preciso, exames complementares são pedidos."],
  ["Planejamento explicado", "A Dra. Isabella apresenta o que observou, as opções possíveis e cada etapa, antes de começar qualquer procedimento."],
  ["Acompanhamento", "Retornos combinados com você para acompanhar o tratamento e orientar os cuidados em casa."],
];

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const escala = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [ativas, setAtivas] = useState(reduzir ? ETAPAS.length : 0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduzir) return;
    setAtivas(Math.min(ETAPAS.length, Math.floor(v * (ETAPAS.length - 1) + 1.02)));
  });
  if (!CONFIG.secoes.comoFunciona) return null;
  return (
    <section className="secao" id="como-funciona" aria-labelledby="titulo-etapas">
      <div className="wrap etapas-grid">
        <div>
          <Indice codigo="B1" rotulo="Como funciona" />
          <h2 id="titulo-etapas" className="display h2">
            Do primeiro contato ao <em>acompanhamento</em>.
          </h2>
          <p className="texto-apoio" style={{ marginTop: 24 }}>
            Quatro etapas, sempre na mesma ordem. Nada começa sem que você saiba o que será feito.
          </p>
        </div>
        <ol className="linha-tempo" ref={ref}>
          <span className="linha-trilho" aria-hidden="true">
            <motion.span className="linha-progresso" style={{ scaleY: reduzir ? 1 : escala }} />
          </span>
          {ETAPAS.map(([t, d], i) => (
            <li key={t} className={"etapa" + (i < ativas ? " ativa" : "")}>
              <span className="etapa-num num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="display h3">{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Dúvidas ---------------- */
function horarioTexto() {
  const seg = CONFIG.horarios.find((d) => d.diaSemana === 1);
  const sex = CONFIG.horarios.find((d) => d.diaSemana === 5);
  if (!seg || !sex) return "";
  const t = (d: typeof seg) => d.turnos.map(([a, b]) => `${hFmt(a)} às ${hFmt(b)}`).join(" e ");
  return `De segunda a quinta, ${t(seg)}. Às sextas, ${t(sex)}. ${CONFIG.avisoHorarios}`;
}

export function Duvidas() {
  const [aberta, setAberta] = useState<number | null>(0);
  if (!CONFIG.secoes.duvidas) return null;
  const nomes = atendimentosAtivos().map((a) => a.nome.toLowerCase());
  const listaAtend = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}` : nomes[0];
  const wa = modoWhatsapp();
  const itens: [string, string][] = [
    [
      "Como agendar uma consulta?",
      wa
        ? `Pelo WhatsApp, no botão de agendamento, ou pelo telefone ${CONFIG.telefoneExibicao}, nos horários de atendimento. O consultório confirma a disponibilidade.`
        : `Pelo telefone ${CONFIG.telefoneExibicao}, nos horários de atendimento. Na ligação você combina o melhor dia e horário.`,
    ],
    [
      "Como é a primeira avaliação?",
      "Começa por uma conversa sobre o que motivou a visita e sobre o seu histórico de saúde, seguida do exame clínico. Se for necessário, exames complementares são pedidos. Ao final, a Dra. Isabella explica o que observou e quais são as opções.",
    ],
    [
      "O que levar na primeira consulta?",
      "Um documento com foto, exames odontológicos anteriores, se você tiver, e a lista dos medicamentos que usa.",
    ],
    [
      "Quais atendimentos são oferecidos?",
      `${listaAtend.charAt(0).toUpperCase() + listaAtend.slice(1)}. A indicação de cada procedimento depende de avaliação individual.`,
    ],
    [
      "Tenho receio de ir ao dentista. Posso conversar antes?",
      "Sim. Você pode ligar e tirar suas dúvidas antes de marcar. Na consulta, a Dra. Isabella explica cada etapa antes de começar, e você pode perguntar o que quiser a qualquer momento.",
    ],
    [
      "Implante dentário serve para todas as pessoas?",
      "Não necessariamente. A indicação depende da saúde da boca, do histórico de cada pessoa e dos exames. Só a avaliação individual responde a essa pergunta.",
    ],
    ["Quais são os horários de atendimento?", horarioTexto()],
    ["Atende aos sábados e domingos?", "Não. O consultório atende de segunda a sexta-feira."],
    ["Onde fica o consultório?", `${enderecoLinha}.`],
  ];
  return (
    <section className="secao secao-tinta" id="duvidas" aria-labelledby="titulo-duvidas">
      <div className="wrap duvidas-grid">
        <div>
          <Indice codigo="B2" rotulo="Dúvidas frequentes" />
          <h2 id="titulo-duvidas" className="display h2">
            Antes de <em>marcar</em>.
          </h2>
        </div>
        <div className="faq">
          {itens.map(([q, r], i) => {
            const isOpen = aberta === i;
            return (
              <div className="faq-item" key={q}>
                <h3 className="faq-q">
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    className="faq-btn"
                    aria-expanded={isOpen}
                    aria-controls={`faq-painel-${i}`}
                    onClick={() => setAberta(isOpen ? null : i)}
                  >
                    {q}
                    <span className="sinal" aria-hidden="true" />
                  </button>
                </h3>
                <Painel aberto={isOpen} id={`faq-painel-${i}`} labelledBy={`faq-btn-${i}`} className="faq-painel">
                  <p>{r}</p>
                </Painel>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Local e contato ---------------- */
export function Local() {
  const mapaRef = useRef<HTMLDivElement>(null);
  const [carregar, setCarregar] = useState(false);
  useEffect(() => {
    const el = mapaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setCarregar(true), io.disconnect()), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const [hoje, setHoje] = useState(-1);
  useEffect(() => setHoje(new Date().getDay()), []);
  if (!CONFIG.secoes.local) return null;
  const e = CONFIG.endereco;
  return (
    <section className="secao" id="contato" aria-labelledby="titulo-local">
      <div className="wrap local-grid">
        <div>
          <Indice codigo="C1" rotulo="Localização e contato" />
          <h2 id="titulo-local" className="display h2">
            Venha nos <em>visitar</em>.
          </h2>
          <address className="endereco">
            {e.logradouro}, {e.complemento}
            <br />
            {e.cidade} - {e.uf}, <span className="num">{e.cep}</span>
          </address>
          <table className="horarios num">
            <caption>Horários de atendimento</caption>
            <tbody>
              {CONFIG.horarios.map((d) => (
                <tr key={d.dia} className={d.diaSemana === hoje ? "hoje" : undefined}>
                  <th scope="row">
                    {d.dia}
                    {d.diaSemana === hoje && <span className="sr-only"> (hoje)</span>}
                  </th>
                  <td className={d.turnos.length ? undefined : "fechado"}>
                    {d.turnos.length
                      ? d.turnos.map(([a, b], i) => (
                          <span key={a} className="turno">
                            {i > 0 && <span className="sr-only"> e </span>}
                            {hFmt(a)} às {hFmt(b)}
                          </span>
                        ))
                      : "Fechado"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="aviso">{CONFIG.avisoHorarios}</p>
          <div className="local-acoes">
            {modoWhatsapp() && <BotaoAgendar />}
            <BotaoLigar variante={modoWhatsapp() ? "btn-linha" : ""} />
            <a className="btn btn-linha" href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer">
              Como chegar<span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
            <BotaoInstagram />
          </div>
        </div>
        <div className="mapa" ref={mapaRef}>
          <div className="mapa-fundo" aria-hidden="true">
            <span className="rotulo">{e.cidade}/{e.uf}</span>
            <span className="mapa-end">{e.logradouro}</span>
          </div>
          {carregar && (
            <iframe
              title={`Mapa: ${enderecoLinha}`}
              src={CONFIG.mapaEmbed}
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
export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null;
  return (
    <section className="secao secao-escura sobre-escuro cta" aria-labelledby="titulo-cta">
      <div className="wrap cta-grid">
        <div>
          <h2 id="titulo-cta" className="display h2">
            A primeira conversa é o primeiro <em>passo</em>.
          </h2>
          <p>
            {CONFIG.nome}, {CONFIG.profissao.toLowerCase()}, {CONFIG.cro}. {CONFIG.endereco.logradouro},{" "}
            {CONFIG.endereco.cidade}.
          </p>
          <div className="acoes">
            <BotaoAgendar variante="btn-claro" />
            <BotaoInstagram variante="btn-linha-claro" />
          </div>
        </div>
        <Leque escolhidaCor="#FFFFFF" escolhidaTexto="#8F1F50" />
      </div>
    </section>
  );
}

/* ---------------- Rodapé ---------------- */
export function Rodape() {
  const e = CONFIG.endereco;
  return (
    <footer className="rodape">
      <div className="wrap">
        <div className="rodape-topo">
          <div>
            <Mascara src={CONFIG.logo.completo} className="logo-completo" label="Logotipo Dra. Isabella Dias, cirurgiã-dentista" />
            <p className="rodape-id">
              {CONFIG.nome} · {CONFIG.profissao} · {CONFIG.cro} · {e.cidade}/{e.uf}
            </p>
            {CONFIG.responsavelTecnico && <p>{CONFIG.responsavelTecnico}</p>}
          </div>
          <div className="rodape-cols">
            <div>
              <h2>Endereço</h2>
              <p>
                {e.logradouro}, {e.complemento}
                <br />
                {e.cidade} - {e.uf}, {e.cep}
              </p>
              <a href={CONFIG.rotaUrl} target="_blank" rel="noopener noreferrer">
                Como chegar<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
            <div>
              <h2>Contato</h2>
              <a href={telHref} className="num">
                {CONFIG.telefoneExibicao}
              </a>
              <br />
              {CONFIG.instagram && (
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram<span className="sr-only"> (abre em nova aba)</span>
                </a>
              )}
            </div>
            <div>
              <h2>Horários</h2>
              <p>
                Seg. a qui.: 9h às 12h e 14h às 18h30
                <br />
                Sex.: 9h às 12h e 14h às 17h30
                <br />
                Sáb. e dom.: fechado
              </p>
            </div>
          </div>
        </div>
        <div className="rodape-legal">
          <p>
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação
            individual por profissional habilitado.
          </p>
          <p>
            <a href="/privacidade.html">Privacidade</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Contato fixo ---------------- */
export function ContatoFixo() {
  const [oculto, setOculto] = useState(true);
  useEffect(() => {
    const f = () => setOculto(window.scrollY < window.innerHeight * 0.7);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <div className={"flutuante" + (oculto ? " oculto" : "")} {...(oculto ? { inert: "", "aria-hidden": true } : {})}>
        <BotaoAgendar pequeno />
      </div>
      <div className="barra-movel">
        {modoWhatsapp() ? (
          <>
            <BotaoAgendar rotulo="WhatsApp" />
            <a className="btn btn-linha" href={telHref}>
              Ligar
            </a>
          </>
        ) : (
          <BotaoAgendar rotulo={`Ligar ${CONFIG.telefoneExibicao}`} />
        )}
      </div>
    </>
  );
}
