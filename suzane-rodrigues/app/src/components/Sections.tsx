import { useEffect, useId, useRef, useState } from "react";
import { CONFIG, atendimentosAtivos, enderecoLinha, hora, msgAtendimento } from "../config";
import ContourField from "./ContourField";
import { AgendarBtn, Btn, ContourDivider, IconInsta, IconWhats, Lockup, SectionMark } from "./ui";

/* ------------------------------------------------------------------ */
/* Atendimentos: índice editorial numerado, título lateral fixo          */
/* (adaptado do "Editorial service list" do 21st.dev)                   */
/* ------------------------------------------------------------------ */
export function Atendimentos() {
  const itens = atendimentosAtivos();
  const [aberto, setAberto] = useState<number>(0);
  const id = useId();
  if (!itens.length) return null;
  return (
    <section id="atendimentos" className="sec sec--musgo atend" aria-labelledby="atend-t">
      <div className="wrap atend__grid">
        <div className="atend__side">
          <div className="atend__sticky">
            <SectionMark n="01" tone="dark">
              Atendimentos
            </SectionMark>
            <h2 id="atend-t" className="h2">
              Estética facial e corporal, a partir de uma <em>avaliação</em>.
            </h2>
            <p className="lead lead--dark">
              Nenhum atendimento é indicado antes de uma conversa. Abra cada item para ler como ele começa.
            </p>
          </div>
        </div>

        <ol className="idx">
          {itens.map((a, i) => {
            const open = aberto === i;
            return (
              <li key={a.id} className={`idx__row ${open ? "is-open" : ""}`}>
                <h3 className="idx__h">
                  <button
                    type="button"
                    id={`${id}-b${i}`}
                    aria-expanded={open}
                    aria-controls={`${id}-p${i}`}
                    onClick={() => setAberto(open ? -1 : i)}
                    className="idx__btn"
                  >
                    <span className="idx__n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="idx__name">{a.nome}</span>
                    <span className="idx__plus" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} className="idx__panel" hidden={!open}>
                  <div className="idx__body">
                    {a.descricao && <p>{a.descricao}</p>}
                    <p className="idx__note">A indicação depende de avaliação individual.</p>
                    <AgendarBtn texto={msgAtendimento(a.nome)} variant="light">
                      Agendar avaliação de {a.nome.toLowerCase()}
                    </AgendarBtn>
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

/* ------------------------------------------------------------------ */
/* A profissional: composição tipográfica com curvas como moldura        */
/* ------------------------------------------------------------------ */
export function Profissional() {
  const [primeiro, ...resto] = CONFIG.nome.split(" ");
  const campos: { k: string; v: string }[] = [
    { k: "Atuação", v: CONFIG.descritor },
    { k: "Cidade", v: `${CONFIG.cidade} - ${CONFIG.uf}` },
    { k: "Atendimento", v: "Individual, com horário marcado" },
  ];
  if (CONFIG.mostrarFormacao && CONFIG.formacao.trim()) campos.splice(1, 0, { k: "Formação", v: CONFIG.formacao });
  return (
    <section id="profissional" className="sec prof" aria-labelledby="prof-t">
      <div className="prof__field">
        <ContourField width={700} height={700} cx={350} cy={350} r0={60} gap={34} count={9} accent={4} sx={1.18} sy={0.92} />
      </div>
      <div className="wrap prof__grid">
        <SectionMark n="02">A profissional</SectionMark>
        <h2 id="prof-t" className="prof__name">
          <span>{primeiro}</span>
          <span className="prof__name2">
            <em>{resto.join(" ")}</em>
          </span>
        </h2>
        <dl className="fields">
          {campos.map((c) => (
            <div key={c.k} className="fields__row">
              <dt>{c.k}</dt>
              <dd>{c.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Como funciona: linha do tempo vertical com progresso                  */
/* (adaptado do "Scroll animated timeline" do 21st.dev)                 */
/* ------------------------------------------------------------------ */
const ETAPAS = [
  {
    t: "Contato e agendamento",
    d: "Você chama pelo WhatsApp ou monta a solicitação no formulário desta página. A data e o horário são combinados na conversa.",
  },
  {
    t: "Avaliação individual",
    d: "No primeiro encontro, uma conversa sobre o que você procura e sobre a sua rotina de cuidados, seguida da avaliação.",
  },
  {
    t: "Plano explicado",
    d: "Se houver indicação, você ouve o que é sugerido, por que e como funciona cada etapa, antes de decidir qualquer coisa.",
  },
  {
    t: "Acompanhamento",
    d: "Os retornos são combinados com você, e cada encontro começa por ver como você está.",
  },
];

export function ComoFunciona() {
  const ref = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) calc();
    });
    io.observe(el);
    function calc() {
      raf = 0;
      const r = el!.getBoundingClientRect();
      const trigger = window.innerHeight * 0.6;
      setP(Math.max(0, Math.min(1, (trigger - r.top) / r.height)));
    }
    const on = () => {
      if (visible && !raf) raf = requestAnimationFrame(calc);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="como-funciona" className="sec steps" aria-labelledby="steps-t">
      <div className="wrap">
        <ContourDivider />
        <div className="steps__grid">
          <div>
            <SectionMark n="03">Como funciona</SectionMark>
            <h2 id="steps-t" className="h2">
              Quatro etapas, <em>sem pressa</em>.
            </h2>
          </div>
          <ol ref={ref} className="tl" style={{ ["--tl" as string]: p.toFixed(3) }}>
            <span className="tl__track" aria-hidden="true" />
            <span className="tl__fill" aria-hidden="true" />
            {ETAPAS.map((e, i) => {
              const active = p >= i / ETAPAS.length;
              return (
                <li key={e.t} className={`tl__item ${active ? "is-active" : ""}`}>
                  <span className="tl__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="tl__t">
                      <span className="sr-only">Etapa {i + 1}: </span>
                      {e.t}
                    </h3>
                    <p className="tl__d">{e.d}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Dúvidas frequentes                                                   */
/* ------------------------------------------------------------------ */
function faqs() {
  const ativos = atendimentosAtivos().map((a) => a.nome.toLowerCase());
  const lista = ativos.length > 1 ? `${ativos.slice(0, -1).join(", ")} e ${ativos.at(-1)}` : ativos[0] ?? "";
  const semana = CONFIG.horarios.find((h) => h.dia === 1);
  const sab = CONFIG.horarios.find((h) => h.dia === 6);
  const dom = CONFIG.horarios.find((h) => h.dia === 0);
  const out: { q: string; a: string }[] = [];
  if (CONFIG.usarWhatsapp)
    out.push({
      q: "Como agendar?",
      a: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões "Agendar avaliação" ou pelo formulário desta página. O dia e o horário que você escolhe são uma preferência: a Suzane verifica a disponibilidade e combina com você na conversa.`,
    });
  out.push(
    {
      q: "Como é a primeira avaliação?",
      a: "É um encontro individual, com horário reservado. Começa por uma conversa sobre o que você procura e sobre a sua rotina, e segue com a avaliação. Nada é feito sem que você entenda e concorde.",
    },
    {
      q: "O que levar?",
      a: "Se você usa algum medicamento, tem alergias ou passou por cuidados recentes com a pele, vale trazer essas informações anotadas. Elas são conversadas pessoalmente, na avaliação.",
    }
  );
  if (lista)
    out.push({
      q: "Quais atendimentos são oferecidos?",
      a: `${lista.charAt(0).toUpperCase() + lista.slice(1)}. A indicação de cada atendimento depende de avaliação individual.`,
    });
  out.push({
    q: "Todo atendimento serve para todas as pessoas?",
    a: "Não necessariamente. Cada pessoa tem uma pele, um histórico e uma rotina. Por isso a indicação só acontece depois da avaliação individual.",
  });
  if (semana?.abre && sab?.abre)
    out.push(
      {
        q: "Quais são os horários?",
        a: `De segunda a sexta, das ${hora(semana.abre)} às ${hora(semana.fecha)}. Aos sábados, das ${hora(sab.abre)} às ${hora(sab.fecha)}. ${CONFIG.avisoHorarios}`,
      },
      { q: "Atende aos sábados?", a: `Sim, das ${hora(sab.abre)} às ${hora(sab.fecha)}.` }
    );
  if (dom && !dom.abre) out.push({ q: "E aos domingos?", a: "Não. Aos domingos o espaço fica fechado." });
  out.push({ q: "Onde fica?", a: `${enderecoLinha()}.` });
  if (CONFIG.usarWhatsapp)
    out.push({
      q: "Posso agendar pelo site?",
      a: "Pelo formulário você monta a solicitação, que abre já escrita no WhatsApp para você enviar. O site não guarda os dados digitados, e o horário só fica reservado depois da resposta da Suzane.",
    });
  return out;
}

export function Duvidas() {
  const itens = faqs();
  const [aberto, setAberto] = useState<number>(0);
  const id = useId();
  return (
    <section id="duvidas" className="sec faq" aria-labelledby="faq-t">
      <div className="wrap faq__grid">
        <div className="faq__side">
          <SectionMark n="04">Dúvidas frequentes</SectionMark>
          <h2 id="faq-t" className="h2">
            Antes de <em>marcar</em>.
          </h2>
          <p className="lead">Respostas curtas sobre estética facial, estética corporal, horários e agendamento.</p>
        </div>
        <div className="acc">
          {itens.map((f, i) => {
            const open = aberto === i;
            return (
              <div key={f.q} className={`acc__row ${open ? "is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    className="acc__btn"
                    id={`${id}-q${i}`}
                    aria-expanded={open}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setAberto(open ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="acc__ic" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} className="acc__a" hidden={!open}>
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

/* ------------------------------------------------------------------ */
/* Localização e contato                                                */
/* ------------------------------------------------------------------ */
export function Local() {
  const e = CONFIG.endereco;
  const [hoje, setHoje] = useState<number>(-1);
  const [mapa, setMapa] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => setHoje(new Date().getDay()), []);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([x]) => {
        if (x.isIntersecting) {
          setMapa(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section id="contato" className="sec local" aria-labelledby="local-t">
      <div className="wrap local__grid">
        <div className="local__info">
          <SectionMark n="05">Localização e contato</SectionMark>
          <h2 id="local-t" className="h2">
            Venha nos <em>visitar</em>.
          </h2>
          <address className="local__addr">
            {e.rua}
            <br />
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            <span className="num">CEP {e.cep}</span>
          </address>

          <table className="hrs">
            <caption className="sr-only">Horários de atendimento</caption>
            <tbody>
              {CONFIG.horarios.map((h) => (
                <tr key={h.dia} className={h.dia === hoje ? "is-today" : ""}>
                  <th scope="row">
                    {h.rotulo}
                    {h.dia === hoje && <span className="hrs__today"> hoje</span>}
                  </th>
                  <td className="num">{h.abre ? `${h.abre} às ${h.fecha}` : "Fechado"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {CONFIG.avisoHorarios && <p className="small">{CONFIG.avisoHorarios}</p>}

          <div className="local__btns">
            <Btn href={e.rotaUrl} variant="line">
              Como chegar
            </Btn>
            <Btn href={e.mapsUrl} variant="line">
              Ver no Google Maps
            </Btn>
          </div>
          <div className="local__btns">
            <AgendarBtn>Agendar pelo WhatsApp</AgendarBtn>
            {CONFIG.instagram.url && (
              <Btn href={CONFIG.instagram.url} variant="line" icon={<IconInsta className="btn__icon" />}>
                Ver no Instagram
              </Btn>
            )}
          </div>
        </div>
        <div className="local__map" ref={mapRef}>
          {mapa ? (
            <iframe
              title={`Mapa: ${enderecoLinha()}`}
              src={e.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="local__mapph" aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA final                                                            */
/* ------------------------------------------------------------------ */
export function CtaFinal() {
  return (
    <section className="sec sec--musgo cta" aria-labelledby="cta-t">
      <div className="cta__field">
        <ContourField width={800} height={600} cx={620} cy={300} r0={36} gap={30} count={10} accent={5} tone="dark" sx={1.2} sy={0.95} />
      </div>
      <div className="wrap cta__in">
        <h2 id="cta-t" className="cta__t">
          A avaliação é o primeiro <em>passo</em>.
        </h2>
        <div className="hero__btns">
          <AgendarBtn variant="light" />
          {CONFIG.instagram.url && (
            <Btn href={CONFIG.instagram.url} variant="lineLight" icon={<IconInsta className="btn__icon" />}>
              Ver no Instagram
            </Btn>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rodapé                                                               */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr__grid">
        <div className="ftr__brand">
          <Lockup size={96} />
          <p className="small">
            {CONFIG.nome} · {CONFIG.descritor} · {CONFIG.cidade}/{CONFIG.uf}
          </p>
          {CONFIG.mostrarFormacao && CONFIG.formacao.trim() && <p className="small">{CONFIG.formacao}</p>}
        </div>
        <div className="ftr__col">
          <p className="ftr__k">Endereço</p>
          <p>
            {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
            <br />
            {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}, <span className="num">{CONFIG.endereco.cep}</span>
          </p>
        </div>
        <div className="ftr__col">
          <p className="ftr__k">Contato</p>
          <ul className="ftr__links">
            {CONFIG.usarWhatsapp && (
              <li>
                <a href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <IconWhats className="ftr__ic" /> <span className="num">{CONFIG.whatsappExibicao}</span>
                  <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
                </a>
              </li>
            )}
            {CONFIG.instagram.url && (
              <li>
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">
                  <IconInsta className="ftr__ic" /> {CONFIG.instagram.usuario}
                  <span className="sr-only"> (Instagram, abre em nova aba)</span>
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html">Privacidade</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap ftr__legal">
        <p>
          Conteúdo informativo, sem finalidade de diagnóstico ou promessa de resultado. A indicação de cada atendimento depende de avaliação
          individual.
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Botão flutuante (desktop) e barra fixa (celular)                     */
/* ------------------------------------------------------------------ */
export function FloatingCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!CONFIG.usarWhatsapp) return null;
  return (
    <div className={`float ${show ? "is-on" : ""}`}>
      <a href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Olá! Vi o site da Suzane Rodrigues e gostaria de agendar uma avaliação.")}`} target="_blank" rel="noopener noreferrer" className="float__btn" tabIndex={show ? 0 : -1} aria-hidden={!show}>
        <IconWhats className="btn__icon" />
        <span>Agendar avaliação</span>
        <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
      </a>
    </div>
  );
}

export function DraftBar() {
  if (!CONFIG.rascunho) return null;
  return (
    <div className="draft" role="note">
      Rascunho para avaliação. Informações sujeitas a confirmação.
    </div>
  );
}
