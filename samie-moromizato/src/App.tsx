import { useEffect, useState } from "react";
import {
  CONFIG,
  atendimentosAtivos,
  enderecoLinha,
  msgAtendimento,
  telHref,
  usaWhats,
} from "./config";
import { AgendarBtn, AgendarPar, ExtLink, Photo, SecNum, Title } from "./components/ui";
import { Agendar } from "./components/Agendar";
import { faixa, horariosTexto } from "./lib/horarios";

const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
function DraftBar() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="draft" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}

const NAV = [
  { href: "#atendimentos", label: "Atendimentos", on: CONFIG.secoes.atendimentos && atendimentosAtivos().length > 0 },
  { href: "#profissional", label: "A profissional", on: CONFIG.secoes.profissional },
  { href: "#como-funciona", label: "Como funciona", on: CONFIG.secoes.comoFunciona },
  { href: "#duvidas", label: "Dúvidas", on: CONFIG.secoes.duvidas },
  { href: "#contato", label: "Contato", on: CONFIG.secoes.contato },
].filter((n) => n.on);

function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className={`site-header${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <DraftBar />
      <div className="site-header__bar wrap">
        <a className="brand" href="#inicio" aria-label={`${CONFIG.nome}, início`}>
          <img
            className="logo logo--paper"
            src={CONFIG.logo.src}
            width={CONFIG.logo.largura}
            height={CONFIG.logo.altura}
            alt=""
          />
          <span className="brand__name">{CONFIG.nome}</span>
        </a>
        <nav className="nav" aria-label="Principal">
          <ul id="menu" className="nav__list">
            {NAV.map((n) => (
              <li key={n.href}>
                <a className="nav__link" href={n.href} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
            <li className="nav__cta-m">
              <AgendarBtn />
            </li>
          </ul>
        </nav>
        <AgendarBtn className="header-cta" variant="solid" />
        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-btn__lines" aria-hidden="true" />
          <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          <span aria-hidden="true" className="menu-btn__t">{open ? "Fechar" : "Menu"}</span>
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
function Hero() {
  const fim = `${CONFIG.lema.palavraFinal.slice(4)}.`;
  return (
    <section className="hero wrap" id="inicio" aria-labelledby="lema">
      <p className="eyebrow hero__eyebrow">
        <span className="nw">{CONFIG.nome}</span> <span aria-hidden="true">·</span>{" "}
        <span className="nw">{CONFIG.descritor}</span> <span aria-hidden="true">·</span>{" "}
        <span className="nw">
          {CONFIG.cidade}/{CONFIG.uf}
        </span>
      </p>

      <h1 className="lema" id="lema">
        <span className="sr-only">
          {CONFIG.lema.linha1} {CONFIG.lema.palavraRiscada}. É {CONFIG.lema.palavraFinal}.
        </span>
        <span className="lema__grid" aria-hidden="true">
          <span className="lema__l1">{CONFIG.lema.linha1}</span>
          <span className="lema__w1">
            <em className="riscada">
              <span className="inte">{CONFIG.lema.palavraRiscada.slice(0, 4)}</span>
              {CONFIG.lema.palavraRiscada.slice(4)}
              <span className="strike" />
            </em>
            <em className="riscada-ponto">.</em>
          </span>
          <span className="lema__e">É</span>
          <span className="lema__w2">
            <span className="caret">‸</span>
            <span className="inte inte--2">{CONFIG.lema.palavraFinal.slice(0, 4)}</span>
            {fim.split("").map((c, i) => (
              <span className="ch" key={i}>
                <span className="ch__in" style={{ ["--i" as string]: i }}>
                  {c}
                </span>
              </span>
            ))}
          </span>
        </span>
      </h1>

      <div className="hero__foot">
        <p className="hero__lead">
          Estética e bem-estar com atendimento individual e horário marcado, de segunda a sábado,
          em {CONFIG.cidade}.
        </p>
        <div className="actions">
          <AgendarPar />
          {CONFIG.secoes.atendimentos && atendimentosAtivos().length > 0 && (
            <a className="btn btn--ghost" href="#atendimentos">
              Ver atendimentos
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Atendimentos({ n }: { n: string }) {
  const lista = atendimentosAtivos();
  if (!CONFIG.secoes.atendimentos || lista.length === 0) return null;
  return (
    <section className="block-ink svc-sec" id="atendimentos" aria-labelledby="t-atend">
      <div className="wrap svc-sec__grid">
        <div className="svc-sec__head">
          <SecNum n={n} onInk>
            Atendimentos
          </SecNum>
          <Title id="t-atend" lines={["Estética e", <>bem-estar, com <em>hora</em></>, "marcada."]} />
          <p className="muted-ink svc-sec__note">
            A indicação de cada atendimento depende de avaliação individual.
          </p>
        </div>
        <ol className="svc-list">
          {lista.map((a, i) => (
            <li key={a.id}>
              <details className="svc row-fill" id={a.id}>
                <summary className="svc__row">
                  <span className="svc__n" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <h3 className="svc__name">{a.nome}</h3>
                  <span className="svc__toggle" aria-hidden="true" />
                </summary>
                <div className="svc__body">
                  {a.foto && (
                    <Photo
                      foto={a.foto}
                      className="svc__photo"
                      sizes="(min-width: 64rem) 22vw, 60vw"
                    />
                  )}
                  <div className="svc__text">
                    <p className="svc__desc">{a.descricao}</p>
                    <p className="muted-ink small">
                      A indicação depende de avaliação individual.
                    </p>
                    <div className="actions">
                      <AgendarBtn onInk mensagem={msgAtendimento(a.nome)} />
                    </div>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Profissional({ n }: { n: string }) {
  if (!CONFIG.secoes.profissional) return null;
  const fatos = [
    CONFIG.metodo ? `Criadora do ${CONFIG.metodo}` : null,
    CONFIG.desde
      ? `Desde ${CONFIG.desde} à frente de um espaço de estética, cuidado e bem-estar em ${CONFIG.cidade}`
      : null,
    `${CONFIG.descritor} · ${CONFIG.cidade} - ${CONFIG.uf}`,
  ].filter(Boolean) as string[];
  const { retrato, mesa } = CONFIG.fotos;
  return (
    <section className="pro" id="profissional" aria-labelledby="t-pro">
      <div className="wrap">
        <SecNum n={n}>A profissional</SecNum>
      </div>
      <h2 className="pro__name" id="t-pro" data-reveal>
        <span className="mask-line">
          <span className="mask-line__in">Samie</span>
        </span>
        <span className="mask-line pro__name-2">
          <span className="mask-line__in" style={{ ["--i" as string]: 1 }}>
            Moro<span className="pro__cut">mizato</span>
          </span>
        </span>
      </h2>
      <div className={`wrap pro__grid${retrato ? "" : " pro__grid--solo"}`}>
        {retrato && (
          <Photo foto={retrato} className="pro__photo" sizes="(min-width: 64rem) 38vw, 90vw" />
        )}
        <div className="pro__side">
          <ul className="facts">
            {fatos.map((f) => (
              <li key={f} className="facts__item">
                {f}
              </li>
            ))}
          </ul>
          {mesa && (
            <Photo foto={mesa} className="pro__photo-2" sizes="(min-width: 64rem) 30vw, 90vw" />
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Espaco({ n }: { n: string }) {
  const fotos = CONFIG.fotos.espaco;
  if (!CONFIG.secoes.espaco || fotos.length === 0) return null;
  return (
    <section className="espaco" id="espaco" aria-labelledby="t-esp">
      <div className="wrap">
        <div className="espaco__head">
          <SecNum n={n}>O espaço</SecNum>
          <Title id="t-esp" lines={[<>Onde o atendimento <em>acontece</em>.</>]} />
        </div>
        <div className={`espaco__grid espaco__grid--${Math.min(fotos.length, 5)}`}>
          {fotos.map((f, i) => (
            <Photo
              key={f.arquivo}
              foto={f}
              className={`espaco__fig espaco__fig--${i + 1}`}
              sizes={i === 0 ? "(min-width: 64rem) 60vw, 100vw" : "(min-width: 64rem) 28vw, 50vw"}
              legenda={
                f.legenda && (
                  <>
                    <span className="fig-n">fig. {i + 1}</span> {f.legenda}
                  </>
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Horarios({ n }: { n: string }) {
  if (!CONFIG.secoes.horarios || CONFIG.horarios.length === 0) return null;
  return (
    <section className="hours" id="horarios" aria-labelledby="t-hor">
      <div className="wrap hours__grid">
        <div className="hours__head">
          <SecNum n={n}>Horários</SecNum>
          <Title id="t-hor" lines={[<>Horário de <em>atendimento</em></>]} className="title--s" />
        </div>
        <dl className="hours__list">
          {CONFIG.horarios.map((h) => (
            <div className={`hours__row row-fill${h.abre ? "" : " is-closed"}`} key={h.dia}>
              <dt>{h.dia}</dt>
              <dd>{faixa(h)}</dd>
            </div>
          ))}
        </dl>
        {CONFIG.avisoHorario && <p className="hours__note small">{CONFIG.avisoHorario}</p>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function ComoFunciona({ n }: { n: string }) {
  if (!CONFIG.secoes.comoFunciona) return null;
  const passos = [
    {
      t: "Contato e agendamento",
      d: usaWhats()
        ? "Você chama no WhatsApp ou liga e combina um dia e um horário disponíveis."
        : `Você liga para ${CONFIG.telefoneExibicao} e combina um dia e um horário disponíveis.`,
    },
    {
      t: "Conversa e análise da pele",
      d: "Antes de começar, uma conversa sobre o que você procura e a análise da pele.",
    },
    {
      t: "Atendimento",
      d: "O cuidado combinado, com atendimento individual e no horário marcado.",
    },
    {
      t: "Acompanhamento",
      d: "Depois, orientações para o dia a dia e, se fizer sentido, o próximo horário.",
    },
  ];
  return (
    <section className="steps" id="como-funciona" aria-labelledby="t-como">
      <div className="wrap steps__grid">
        <div className="steps__head">
          <SecNum n={n}>Como funciona</SecNum>
          <Title id="t-como" lines={["Do primeiro contato", <>ao <em>acompanhamento</em>.</>]} />
        </div>
        <ol className="steps__list">
          {passos.map((p, i) => (
            <li className="step" key={p.t} data-reveal>
              <span className="step__n" aria-hidden="true">
                {i + 1}
              </span>
              <div className="step__body">
                <h3 className="step__t">{p.t}</h3>
                <p className="step__d">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Duvidas({ n }: { n: string }) {
  if (!CONFIG.secoes.duvidas) return null;
  const nomes = atendimentosAtivos().map((a) => a.nome.toLowerCase());
  const listaAt =
    nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes.at(-1)}` : nomes[0] ?? "";
  const sab = CONFIG.horarios.find((h) => h.diasSemana.includes(6));
  const dom = CONFIG.horarios.find((h) => h.diasSemana.includes(0));
  const qa: { q: string; a: string }[] = [
    {
      q: "Como agendar?",
      a: usaWhats()
        ? `Pelo WhatsApp ou por telefone, no ${CONFIG.telefoneExibicao}, dentro do horário de atendimento.`
        : `Por telefone, no ${CONFIG.telefoneExibicao}, dentro do horário de atendimento.`,
    },
    {
      q: "Como é o primeiro atendimento?",
      a: "Começa com uma conversa: você conta o que procura e a pele é analisada antes de qualquer cuidado. O atendimento é definido a partir daí, com você.",
    },
    {
      q: "O que levar?",
      a: "Nada específico. Se você usa produtos na pele no dia a dia, vale comentar na conversa inicial.",
    },
    ...(listaAt
      ? [
          {
            q: "Quais atendimentos são oferecidos?",
            a: `Atualmente, ${listaAt}. Na conversa inicial, você tira dúvidas sobre cada um.`,
          },
        ]
      : []),
    {
      q: "Todo atendimento serve para todas as pessoas?",
      a: "Não necessariamente. A indicação de cada atendimento depende de avaliação individual.",
    },
    { q: "Quais são os horários?", a: `${horariosTexto()} ${CONFIG.avisoHorario}` },
    ...(sab
      ? [
          {
            q: "Atende aos sábados?",
            a: sab.abre ? `Sim, das ${faixa(sab)}.` : "Não. Aos sábados o espaço fica fechado.",
          },
        ]
      : []),
    ...(dom
      ? [
          {
            q: "E aos domingos?",
            a: dom.abre ? `Sim, das ${faixa(dom)}.` : "Não. Aos domingos o espaço fica fechado.",
          },
        ]
      : []),
    { q: "Onde fica?", a: `${enderecoLinha()}.` },
    {
      q: "Posso agendar pelo site?",
      a: usaWhats()
        ? "Pelo site você envia uma solicitação pelo WhatsApp, com o dia e o horário que prefere. A Samie confirma a disponibilidade."
        : `O horário é marcado por telefone, no ${CONFIG.telefoneExibicao}. Os botões “Ligar para agendar” do site já fazem a ligação pelo celular.`,
    },
  ];
  return (
    <section className="faq" id="duvidas" aria-labelledby="t-faq">
      <div className="wrap faq__grid">
        <div className="faq__head">
          <SecNum n={n}>Dúvidas</SecNum>
          <Title id="t-faq" lines={["Perguntas", <><em>frequentes</em></>]} />
        </div>
        <div className="faq__list">
          {qa.map((x) => (
            <details className="qa row-fill" key={x.q}>
              <summary className="qa__q">
                <h3>{x.q}</h3>
                <span className="qa__toggle" aria-hidden="true" />
              </summary>
              <p className="qa__a">{x.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function MapaLazy() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = document.getElementById("mapa");
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="map" id="mapa">
      {on ? (
        <iframe
          title={`Mapa: ${enderecoLinha()}`}
          src={CONFIG.endereco.embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <a className="map__ph" href={CONFIG.endereco.mapsUrl} target="_blank" rel="noopener noreferrer">
          <span>Abrir o mapa no Google Maps</span>
        </a>
      )}
    </div>
  );
}

function Contato({ n }: { n: string }) {
  if (!CONFIG.secoes.contato) return null;
  const e = CONFIG.endereco;
  return (
    <section className="contact" id="contato" aria-labelledby="t-cont">
      <div className="wrap contact__grid">
        <div className="contact__head">
          <SecNum n={n}>Localização e contato</SecNum>
          <Title id="t-cont" lines={[<>Venha nos <em>visitar</em>.</>]} />
        </div>
        {CONFIG.fotos.fachada && (
          <Photo
            foto={CONFIG.fotos.fachada}
            className="contact__photo"
            sizes="(min-width: 64rem) 34vw, 100vw"
            legenda={
              <>
                <span className="fig-n">fachada</span> {e.rua}
              </>
            }
          />
        )}
        <div className="contact__info">
          <address className="addr">
            <span className="addr__l1">{e.rua}</span>
            <span>{e.bairro}</span>
            <span>
              {e.cidade} - {e.uf}, CEP {e.cep}
            </span>
          </address>
          <ul className="links">
            <li>
              <a className="link" href={e.rotaUrl} target="_blank" rel="noopener noreferrer">
                <span className="link__m" aria-hidden="true">↗</span>Como chegar
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a className="link" href={e.mapsUrl} target="_blank" rel="noopener noreferrer">
                <span className="link__m" aria-hidden="true">↗</span>Ver no Google Maps
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a className="link" href={e.mapsUrl} target="_blank" rel="noopener noreferrer">
                <span className="link__m" aria-hidden="true">↗</span>Ver avaliações no Google
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a className="link" href={telHref()}>
                <span className="link__m" aria-hidden="true">T.</span>
                {CONFIG.telefoneExibicao}
              </a>
            </li>
          </ul>
          <div className="actions">
            <AgendarPar />
            <ExtLink href={CONFIG.instagram.url}>Ver no Instagram</ExtLink>
          </div>
        </div>
        <MapaLazy />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null;
  return (
    <section className="block-ink cta" aria-labelledby="t-cta">
      <div className="wrap">
        <h2 className="cta__lema" id="t-cta" data-reveal>
          <span className="mask-line">
            <span className="mask-line__in">
              {CONFIG.lema.linha1}{" "}
              <em className="riscada riscada--static">
                {CONFIG.lema.palavraRiscada}
                <span className="strike" />
              </em>
              .
            </span>
          </span>
          <span className="mask-line">
            <span className="mask-line__in" style={{ ["--i" as string]: 1 }}>
              É <span className="inte">{CONFIG.lema.palavraFinal.slice(0, 4)}</span>
              {CONFIG.lema.palavraFinal.slice(4)}.
            </span>
          </span>
        </h2>
        <div className="actions">
          <AgendarPar onInk />
          <ExtLink href={CONFIG.instagram.url} onInk>
            Ver no Instagram
          </ExtLink>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const e = CONFIG.endereco;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <img
            className="logo logo--paper footer__logo"
            src={CONFIG.logo.src}
            width={CONFIG.logo.largura}
            height={CONFIG.logo.altura}
            alt={CONFIG.logo.alt}
            loading="lazy"
            decoding="async"
          />
          <p className="footer__desc">
            {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}
          </p>
        </div>
        <div className="footer__cols">
          <address className="footer__addr">
            {e.rua}, {e.bairro}
            <br />
            {e.cidade} - {e.uf}, CEP {e.cep}
          </address>
          <ul className="footer__links">
            <li>
              <a className="link" href={telHref()}>
                {CONFIG.telefoneExibicao}
              </a>
            </li>
            <li>
              <a className="link" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram {CONFIG.instagram.usuario}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a className="link" href="/privacidade.html">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
        <p className="footer__legal small">
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação
          de cada atendimento depende de avaliação individual.
        </p>
      </div>
      <p className="footer__sig" aria-hidden="true">
        {CONFIG.nome}
      </p>
    </footer>
  );
}

function FloatCta() {
  return (
    <div className="float-cta" data-float>
      <AgendarBtn />
    </div>
  );
}

/* ------------------------------------------------------------------ */
export default function App() {
  // numeração das seções conforme as que estão ligadas
  const ordem: string[] = [];
  const num = (id: string) => {
    ordem.push(id);
    return pad(ordem.length);
  };
  const temAtend = CONFIG.secoes.atendimentos && atendimentosAtivos().length > 0;

  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {temAtend && <Atendimentos n={num("at")} />}
        {CONFIG.secoes.profissional && <Profissional n={num("pr")} />}
        {CONFIG.secoes.espaco && CONFIG.fotos.espaco.length > 0 && <Espaco n={num("es")} />}
        {CONFIG.secoes.horarios && <Horarios n={num("ho")} />}
        {CONFIG.secoes.comoFunciona && <ComoFunciona n={num("co")} />}
        {CONFIG.secoes.duvidas && <Duvidas n={num("du")} />}
        {CONFIG.secoes.contato && <Contato n={num("ct")} />}
        {CONFIG.secoes.agendar && usaWhats() && <Agendar n={num("ag")} />}
        <CtaFinal />
      </main>
      <Footer />
      <FloatCta />
    </>
  );
}
