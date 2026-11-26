import { useEffect, useId, useRef, useState } from "react";
import { videos, fotos } from "virtual:media";
import { CONFIG, servicosAtivos, waLink, waServico, enderecoLinha } from "./config";
import { Ext, Lines, SecLabel, agruparHorarios, hojeNoFuso, hora } from "./lib";
import monoSm from "./assets/mono-96.webp";
import monoMd from "./assets/mono-160.webp";
import logoFull from "./assets/logo-320.webp";

export const temTrabalhos = videos.length > 0 || fotos.length > 0;

/* ---------------- faixa de rascunho ---------------- */
export function Draft() {
  if (!CONFIG.rascunho) return null;
  return (
    <p className="draft" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </p>
  );
}

/* ---------------- header ---------------- */
const NAV = [
  { href: "#servicos", label: "Serviços", on: CONFIG.secoes.servicos && servicosAtivos.length > 0 },
  { href: "#como-funciona", label: "Como funciona", on: CONFIG.secoes.comoFunciona },
  { href: "#duvidas", label: "Dúvidas", on: CONFIG.secoes.duvidas },
  { href: "#contato", label: "Contato", on: CONFIG.secoes.contato },
].filter((n) => n.on);

export function Header({ home = true }: { home?: boolean }) {
  const [solid, setSolid] = useState(!home);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!home) return;
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [open]);

  const base = home ? "" : "/";
  return (
    <header className={`header${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <div className="wrap header-in">
        <a className="brand" href={home ? "#topo" : "/"} aria-label={`${CONFIG.nome}, início`}>
          <img src={monoSm} alt="" width={44} height={32} decoding="async" />
          <span>{CONFIG.marca}</span>
        </a>
        <nav className="nav" aria-label="Principal">
          {NAV.map((n) => (
            <a key={n.href} className="link" href={base + n.href}>
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        {CONFIG.usarWhatsapp && (
          <Ext className="btn btn-primary header-cta" href={waLink()}>
            Pedir horário
          </Ext>
        )}
        <button
          ref={btnRef}
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="menu-movel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-lines" aria-hidden="true" />
          <span>{open ? "Fechar" : "Menu"}</span>
        </button>
      </div>
      <nav id="menu-movel" className="mobile-nav" aria-label="Menu" hidden={!open}>
        {NAV.map((n) => (
          <a key={n.href} className="m-link" href={base + n.href} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
        {CONFIG.usarWhatsapp && (
          <Ext className="btn btn-primary" href={waLink()}>
            Pedir horário pelo WhatsApp
          </Ext>
        )}
      </nav>
    </header>
  );
}

/* ---------------- hero: da fosca ao espelho ---------------- */
export function Hero() {
  const lista = servicosAtivos.map((s) => s.nome.toLowerCase());
  const servTxt =
    lista.length > 1 ? `${lista.slice(0, -1).join(", ")} e ${lista[lista.length - 1]}` : lista[0] ?? "";
  const frase = servTxt.charAt(0).toUpperCase() + servTxt.slice(1);
  return (
    <section className="hero" id="topo" aria-labelledby="h1">
      <span className="hero-diag" aria-hidden="true" />
      <div className="wrap">
        <p className="hero-eyebrow">
          Estética automotiva<span className="eb-dot"> · </span>
          <span className="eb-city">{CONFIG.cidade}/{CONFIG.uf}</span>
        </p>
        <h1 className="h1" id="h1">
          <span className="h1-name">
            <span className="name-layer name-matte">{CONFIG.marca}</span>
            <span className="sweep polish" aria-hidden="true">
              <span className="sweep-in">
                <span className="name-layer name-polished">{CONFIG.marca}</span>
              </span>
            </span>
            <span className="sweep glint" aria-hidden="true">
              <span className="sweep-in">
                <span className="name-layer name-glint">{CONFIG.marca}</span>
              </span>
            </span>
          </span>
          <span className="sr-only"> </span>
          <span className="h1-sub">{CONFIG.segmento}</span>
        </h1>
        <div className="grid hero-foot">
          {frase && (
            <p className="hero-text">
              {frase}, com atendimento personalizado, em {CONFIG.cidade}.
            </p>
          )}
          <div className="btns hero-btns">
            {CONFIG.usarWhatsapp && (
              <Ext className="btn btn-primary" href={waLink()}>
                Pedir horário
              </Ext>
            )}
            {servicosAtivos.length > 0 && (
              <a className="btn btn-ghost" href="#servicos">
                Ver serviços
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- serviços: índice editorial ---------------- */
export function Servicos({ n }: { n: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();
  if (!CONFIG.secoes.servicos || servicosAtivos.length === 0) return null;
  return (
    <section className="section bg-graphite" id="servicos" aria-labelledby="t-servicos">
      <div className="wrap grid">
        <div className="svc-aside" data-reveal>
          <SecLabel n={n}>Serviços</SecLabel>
          <h2 className="h2" id="t-servicos">
            <Lines lines={["Estética automotiva", <span className="thin">em três cuidados.</span>]} />
          </h2>
          <p className="muted" style={{ marginTop: "var(--s-3)", maxWidth: "26rem" }}>
            Abra cada serviço para ver do que se trata e pedir um horário pelo WhatsApp.
          </p>
        </div>
        <ol className="svc-list">
          {servicosAtivos.map((s, i) => {
            const isOpen = open === s.id;
            const pid = `${uid}-${s.id}`;
            return (
              <li key={s.id} className={`svc-item metal-row${isOpen ? " is-open" : ""}`}>
                <h3 style={{ font: "inherit" }}>
                  <button
                    type="button"
                    className="svc-btn"
                    aria-expanded={isOpen}
                    aria-controls={pid}
                    onClick={() => setOpen(isOpen ? null : s.id)}
                  >
                    <span className="svc-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="svc-name">{s.nome}</span>
                    <span className="toggle" aria-hidden="true" />
                  </button>
                </h3>
                <div className="panel" id={pid} hidden={!isOpen}>
                  <div className="svc-panel-in">
                    <p>{s.descricao}</p>
                    {CONFIG.usarWhatsapp && (
                      <Ext className="btn btn-primary" href={waServico(s.nome)}>
                        Pedir horário para {s.nome.toLowerCase()}
                      </Ext>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- o cuidado: seção ousada ---------------- */
export function Cuidado({ n }: { n: string }) {
  if (!CONFIG.secoes.cuidado) return null;
  const itens = [
    "Você conta como é o seu veículo e o que precisa.",
    "Combinamos o serviço e o horário pelo WhatsApp.",
    "Atendimento personalizado para o seu veículo.",
  ];
  return (
    <section className="section bg-black care" aria-labelledby="t-cuidado">
      <div className="wrap" data-reveal>
        <SecLabel n={n}>O cuidado</SecLabel>
        <div className="care-body">
          <h2 className="care-title" id="t-cuidado">
            <Lines lines={["Cada carro", "tem o seu", "jeito."]} />
          </h2>
          <ul className="care-list">
            {itens.map((t) => (
              <li key={t}>
                <span className="tick" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- silêncio ---------------- */
export function Silencio() {
  if (!CONFIG.secoes.silencio) return null;
  return (
    <section className="section bg-ice on-ice quiet" aria-labelledby="t-silencio">
      <div className="wrap grid" data-reveal>
        <img className="quiet-mono" src={monoMd} alt="" width={72} height={52} loading="lazy" decoding="async" />
        <h2 className="quiet-title" id="t-silencio">
          <Lines lines={["Estética automotiva", "em Poços de Caldas."]} />
        </h2>
        <p className="quiet-addr">{enderecoLinha()}</p>
      </div>
    </section>
  );
}

/* ---------------- como funciona: linha do tempo ---------------- */
const ETAPAS = [
  { t: "Você chama no WhatsApp", d: "Conte qual é o veículo e o que você precisa." },
  { t: "Combinamos o serviço e o horário", d: "A disponibilidade é confirmada na conversa." },
  { t: "Atendimento no endereço da Araujo", d: `${CONFIG.endereco.rua}, ${CONFIG.endereco.numero}, ${CONFIG.endereco.bairro}.` },
  { t: "Retirada do veículo", d: "Você retira o carro no mesmo endereço." },
];

export function ComoFunciona({ n }: { n: string }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("motion")) return;
    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  if (!CONFIG.secoes.comoFunciona) return null;
  return (
    <section className="section bg-black" id="como-funciona" aria-labelledby="t-como">
      <div className="wrap">
        <div className="steps-head" data-reveal>
          <SecLabel n={n}>Como funciona</SecLabel>
          <h2 className="h2" id="t-como">
            <Lines lines={["Do pedido", <span className="thin">à retirada.</span>]} />
          </h2>
        </div>
        <ol className="steps" ref={ref}>
          <span className="track" aria-hidden="true" />
          <span className="track-fill" aria-hidden="true" />
          {ETAPAS.map((e, i) => (
            <li key={e.t}>
              <span className="step-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="step-t">
                <span className="sr-only">Etapa {i + 1}: </span>
                {e.t}
              </h3>
              <p className="step-d">{e.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- trabalhos: vídeos e fotos autorizados ---------------- */
function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || save) {
      setStill(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload === "none") {
            v.preload = "auto";
            v.src = src;
          }
          v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  if (still && poster) {
    return <img src={poster} alt={label} width={360} height={640} loading="lazy" decoding="async" />;
  }
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster || undefined}
      aria-label={label}
      width={360}
      height={640}
      disablePictureInPicture
      tabIndex={-1}
    />
  );
}

export function Trabalhos({ n }: { n: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const itens = [
    ...videos.map((v) => ({ kind: "video" as const, ...v })),
    ...fotos.map((f) => ({ kind: "foto" as const, ...f, poster: "" })),
  ];
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const on = () => {
      const w = rail.firstElementChild?.getBoundingClientRect().width ?? 1;
      setIdx(Math.round(rail.scrollLeft / w));
    };
    rail.addEventListener("scroll", on, { passive: true });
    return () => rail.removeEventListener("scroll", on);
  }, []);
  if (!CONFIG.secoes.trabalhos || itens.length === 0) return null;
  const label = "Vídeo de um serviço da Araujo Estética Automotiva";
  return (
    <section className={`section bg-graphite works${itens.length === 1 ? " works-single" : ""}`} id="trabalhos" aria-labelledby="t-trab">
      <div className="wrap grid">
        <div className="works-title-row" data-reveal>
          <SecLabel n={n}>Registros</SecLabel>
          <h2 className="works-title" id="t-trab">
            <Lines lines={["Trabalhos"]} />
          </h2>
        </div>
        <div className="works-head">
          <p className="muted" style={{ maxWidth: "24rem" }}>
            Trechos de serviços feitos no espaço da Araujo, em {CONFIG.cidade}.
          </p>
        </div>
        <div className="works-rail">
          <div className="rail" ref={railRef}>
            {itens.slice(0, 3).map((it) => (
              <figure className="panel-v" key={it.id}>
                {it.kind === "video" ? (
                  <LoopVideo src={it.src} poster={it.poster} label={label} />
                ) : (
                  <img src={it.src} alt="Serviço feito pela Araujo Estética Automotiva" loading="lazy" decoding="async" />
                )}
                {CONFIG.legendasTrabalhos[it.id] && <figcaption>{CONFIG.legendasTrabalhos[it.id]}</figcaption>}
              </figure>
            ))}
          </div>
          {itens.length > 1 && (
            <div className="rail-dots" aria-hidden="true">
              {itens.slice(0, 3).map((it, i) => (
                <span key={it.id} className={i === idx ? "on" : ""} />
              ))}
            </div>
          )}
          {CONFIG.antesDepois.length > 0 && <Comparador {...CONFIG.antesDepois[0]} />}
        </div>
      </div>
    </section>
  );
}

function Comparador({ antes, depois, alt }: { antes: string; depois: string; alt: string }) {
  const [x, setX] = useState(50);
  return (
    <div className="compare" style={{ ["--x" as string]: `${x}%` }}>
      <img src={`/fotos/${antes}`} alt={`Antes: ${alt}`} loading="lazy" decoding="async" />
      <img className="after" src={`/fotos/${depois}`} alt={`Depois: ${alt}`} loading="lazy" decoding="async" />
      <span className="bar" aria-hidden="true" />
      <input
        type="range"
        min={0}
        max={100}
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
        aria-label="Comparar antes e depois"
      />
    </div>
  );
}

/* ---------------- horários ---------------- */
export function Horarios({ n }: { n: string }) {
  const [hoje, setHoje] = useState<number | null>(null);
  useEffect(() => setHoje(hojeNoFuso().dia), []);
  if (!CONFIG.secoes.horarios || CONFIG.horarios.length === 0) return null;
  const grupos = agruparHorarios();
  return (
    <section className="section bg-black" id="horarios" aria-labelledby="t-hor">
      <div className="wrap grid">
        <div className="hours-head" data-reveal>
          <SecLabel n={n}>Horários</SecLabel>
          <h2 className="h2" id="t-hor">
            <Lines lines={["Quando", <span className="thin">atendemos.</span>]} />
          </h2>
        </div>
        <div className="hours-list">
          <dl>
            {grupos.map((g) => (
              <div className="hours-row metal-row" key={g.rotulo}>
                <dt className="hours-day">
                  {g.rotulo}
                  {hoje !== null && g.dias.includes(hoje) && <span className="today">hoje</span>}
                </dt>
                <dd className={`hours-time${g.abre ? "" : " muted"}`}>
                  {g.abre && g.fecha ? (
                    <>
                      {hora(g.abre)} às {hora(g.fecha)}
                    </>
                  ) : (
                    "Fechado"
                  )}
                </dd>
              </div>
            ))}
          </dl>
          {CONFIG.avisoHorarios && <p className="hours-note muted">{CONFIG.avisoHorarios}</p>}
        </div>
      </div>
    </section>
  );
}

/* ---------------- dúvidas ---------------- */
function faq() {
  const nomes = servicosAtivos.map((s) => s.nome.toLowerCase());
  const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}` : nomes[0];
  const sab = CONFIG.horarios.find((h) => h.dia === 6);
  const dom = CONFIG.horarios.find((h) => h.dia === 0);
  const semana = CONFIG.horarios.find((h) => h.dia === 1);
  const e = CONFIG.endereco;
  return [
    {
      q: "Como pedir um horário?",
      a: "Chame a Araujo no WhatsApp, pelo botão “Pedir horário”, ou preencha o formulário desta página. A confirmação da disponibilidade é feita pelo WhatsApp.",
    },
    lista && {
      q: "Quais serviços de estética automotiva a Araujo oferece?",
      a: `${lista.charAt(0).toUpperCase() + lista.slice(1)}, com atendimento personalizado.`,
    },
    {
      q: "Preciso agendar?",
      a: "Você pode solicitar um horário pelo WhatsApp. A confirmação da disponibilidade é feita por lá.",
    },
    semana?.abre && {
      q: "Quais são os horários?",
      a: `De segunda a sexta, das ${hora(semana.abre!)} às ${hora(semana.fecha!)}${
        sab?.abre ? `; aos sábados, das ${hora(sab.abre)} às ${hora(sab.fecha!)}` : ""
      }. ${CONFIG.avisoHorarios}`,
    },
    sab && {
      q: "Atende aos sábados?",
      a: sab.abre ? `Sim, das ${hora(sab.abre)} às ${hora(sab.fecha!)}.` : "Não, aos sábados a Araujo não atende.",
    },
    dom && {
      q: "E aos domingos?",
      a: dom.abre ? `Sim, das ${hora(dom.abre)} às ${hora(dom.fecha!)}.` : "Não. Aos domingos a Araujo fica fechada.",
    },
    {
      q: "Onde fica a Araujo em Poços de Caldas?",
      a: `${e.rua}, ${e.numero}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.`,
    },
    {
      q: "Como falo sobre valores?",
      a: "Chame no WhatsApp para conversar sobre o seu veículo e o serviço.",
    },
    {
      q: "Posso pedir o horário pelo site?",
      a: "Sim. O formulário desta página monta a sua mensagem e abre o WhatsApp da Araujo. O site não guarda os dados digitados, e a confirmação é feita pelo WhatsApp.",
    },
  ].filter(Boolean) as { q: string; a: string }[];
}

export function Duvidas({ n }: { n: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  if (!CONFIG.secoes.duvidas) return null;
  return (
    <section className="section bg-graphite" id="duvidas" aria-labelledby="t-faq">
      <div className="wrap grid">
        <div className="faq-head" data-reveal>
          <SecLabel n={n}>Dúvidas</SecLabel>
          <h2 className="h2" id="t-faq">
            <Lines lines={["Perguntas antes", <span className="thin">de chamar.</span>]} />
          </h2>
        </div>
        <div className="faq-list">
          {faq().map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item metal-row${isOpen ? " is-open" : ""}`} key={f.q}>
                <h3>
                  <button
                    type="button"
                    className="faq-btn"
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-f${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="toggle" aria-hidden="true" />
                  </button>
                </h3>
                <div className="panel faq-panel" id={`${uid}-f${i}`} hidden={!isOpen}>
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- localização e contato ---------------- */
export function Contato({ n }: { n: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!CONFIG.secoes.contato) return null;
  const e = CONFIG.endereco;
  return (
    <section className="section bg-black" id="contato" aria-labelledby="t-contato">
      <div className="wrap grid">
        <div className="contact-info" data-reveal>
          <SecLabel n={n}>Localização e contato</SecLabel>
          <h2 className="h2" id="t-contato">
            <Lines lines={["Venha nos", <span className="thin">visitar.</span>]} />
          </h2>
          <address className="addr">
            {e.rua}, {e.numero}
            <small>
              {e.bairro}, {e.cidade} - {e.uf} · <span style={{ whiteSpace: "nowrap" }}>CEP {e.cep}</span>
            </small>
          </address>
          <div className="contact-links">
            <Ext className="link mark" href={CONFIG.rotaUrl}>
              <span>Como chegar</span>
            </Ext>
            <Ext className="link mark" href={CONFIG.mapsUrl}>
              <span>Ver no Google Maps</span>
            </Ext>
            {CONFIG.usarWhatsapp && (
              <Ext className="link mark" href={waLink()}>
                <span>WhatsApp {CONFIG.whatsappExibicao}</span>
              </Ext>
            )}
          </div>
          <div className="btns">
            {CONFIG.usarWhatsapp && (
              <Ext className="btn btn-primary" href={waLink()}>
                Pedir horário
              </Ext>
            )}
            {CONFIG.instagram.url && (
              <Ext className="btn btn-ghost" href={CONFIG.instagram.url}>
                Ver no Instagram
              </Ext>
            )}
          </div>
        </div>
        <div className="contact-map">
          <div className="map" ref={mapRef}>
            <div className="map-fallback">
              <Ext className="link mark" href={CONFIG.mapsUrl}>
                <span>Abrir o mapa no Google Maps</span>
              </Ext>
            </div>
            {showMap && (
              <iframe
                src={CONFIG.mapaEmbedUrl}
                title={`Mapa: ${enderecoLinha()}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- cta final ---------------- */
export function CtaFinal() {
  if (!CONFIG.secoes.ctaFinal) return null;
  return (
    <section className="section bg-black cta" aria-labelledby="t-cta">
      <div className="wrap">
        <p className="cta-name" aria-hidden="true">
          {CONFIG.marca}
        </p>
        <h2 className="cta-text" id="t-cta">
          Chame no WhatsApp e combine o seu horário.
        </h2>
        <div className="btns">
          {CONFIG.usarWhatsapp && (
            <Ext className="btn btn-primary" href={waLink()}>
              Pedir horário
            </Ext>
          )}
          {CONFIG.instagram.url && (
            <Ext className="btn btn-ghost" href={CONFIG.instagram.url}>
              Ver no Instagram
            </Ext>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- rodapé ---------------- */
export function Footer({ home = true }: { home?: boolean }) {
  const e = CONFIG.endereco;
  return (
    <footer className="footer bg-black">
      <div className="wrap grid foot-grid">
        <img className="foot-logo" src={logoFull} alt={CONFIG.nome} width={144} height={126} loading="lazy" decoding="async" />
        <div className="foot-col">
          <strong>
            {CONFIG.nome} · {CONFIG.cidade}/{CONFIG.uf}
          </strong>
          {e.rua}, {e.numero}, {e.bairro}
          <br />
          CEP {e.cep}
        </div>
        <div className="foot-col">
          <strong>Contato</strong>
          {CONFIG.usarWhatsapp && (
            <>
              <Ext className="link mark" href={waLink()}>
                <span>WhatsApp {CONFIG.whatsappExibicao}</span>
              </Ext>
              <br />
            </>
          )}
          {CONFIG.instagram.url && (
            <Ext className="link mark" href={CONFIG.instagram.url}>
              <span>Instagram {CONFIG.instagram.usuario}</span>
            </Ext>
          )}
        </div>
        <div className="foot-col">
          <strong>Site</strong>
          <a className="link mark" href={home ? "/privacidade.html" : "/privacidade.html"}>
            <span>Privacidade</span>
          </a>
          {CONFIG.rascunho && <p style={{ marginTop: "var(--s-1)" }}>Rascunho para avaliação.</p>}
        </div>
      </div>
      <p className="signature" aria-hidden="true">
        {CONFIG.marca}
      </p>
    </footer>
  );
}

/* ---------------- conversão fixa ---------------- */
export function FixedCta() {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const on = () => setHidden(window.scrollY < window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <>
      <Ext className={`btn btn-primary float-cta${hidden ? " is-hidden" : ""}`} href={waLink()}>
        Pedir horário
      </Ext>
      <div className="mobile-bar">
        <Ext className="btn btn-primary" href={waLink()}>
          Pedir horário pelo WhatsApp
        </Ext>
      </div>
    </>
  );
}
