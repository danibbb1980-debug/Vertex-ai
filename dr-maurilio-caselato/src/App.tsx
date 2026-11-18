import { useEffect, useState } from "react";
import { CONFIG, enderecoLinha, temWhatsapp, waLink } from "./config";
import { Acordeao } from "./components/Acordeao";
import { Agendar } from "./components/Agendar";
import { Hero } from "./components/Hero";
import { Linha } from "./components/Linha";
import { CropMarks, LinkButton, Logo, Picture, RegMark, WaButton } from "./components/Marks";

const S = CONFIG.secoes;
const temAtendimentos = S.atendimentos && CONFIG.atendimentos.length > 0;
const temFotosConsultorio = S.consultorio && CONFIG.fotos.consultorio.length > 0;
const temAgendar = S.agendar && temWhatsapp();

function Rascunho() {
  if (!CONFIG.rascunho) return null;
  return (
    <aside className="rascunho" aria-label="Aviso de rascunho">
      <RegMark size={12} />
      <p>Rascunho para avaliação. Informações sujeitas a confirmação.</p>
    </aside>
  );
}

function Header() {
  const [solido, setSolido] = useState(false);
  const [aberto, setAberto] = useState(false);
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
    return () => document.removeEventListener("keydown", esc);
  }, [aberto]);

  const links = [
    temAtendimentos && { href: "#atendimentos", t: "Atendimentos" },
    S.profissional && { href: "#profissional", t: "O profissional" },
    S.comoFunciona && { href: "#como-funciona", t: "Como funciona" },
    S.duvidas && { href: "#duvidas", t: "Dúvidas" },
    S.local && { href: "#local", t: "Contato" },
  ].filter(Boolean) as { href: string; t: string }[];

  return (
    <header className={`header ${solido || aberto ? "is-solido" : ""}`}>
      <div className="wrap header-in">
        <a href="#topo" className="header-logo" aria-label={`${CONFIG.nome}, início`}>
          <Logo />
        </a>
        <nav aria-label="Principal" className="nav-desktop">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.t}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-cta">{temWhatsapp() && <WaButton />}</div>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          onClick={() => setAberto((a) => !a)}
        >
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          <span className="menu-icone" aria-hidden="true" />
        </button>
      </div>
      <nav id="menu-movel" aria-label="Menu" className={`menu-movel ${aberto ? "is-aberto" : ""}`} hidden={!aberto}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setAberto(false)}>
                {l.t}
              </a>
            </li>
          ))}
        </ul>
        {temWhatsapp() && <WaButton className="btn-largo" />}
      </nav>
    </header>
  );
}

function Atendimentos() {
  if (!temAtendimentos) return null;
  return (
    <section className="secao escuro atendimentos" id="atendimentos" aria-labelledby="at-titulo">
      <CropMarks />
      <div className="wrap atendimentos-grid">
        <div className="lateral-fixa">
          <p className="rotulo">Atendimentos</p>
          <h2 id="at-titulo" className="titulo-secao">
            Uma <em>avaliação</em> antes de cada indicação.
          </h2>
          <p className="texto-apoio">A indicação depende de avaliação individual por profissional habilitado.</p>
        </div>
        <Acordeao
          className="indice"
          itens={CONFIG.atendimentos.map((a, i) => ({
            prefixo: String(i + 1).padStart(2, "0"),
            titulo: a.nome,
            conteudo: (
              <>
                <p>{a.descricao}</p>
                <p className="nota">A indicação depende de avaliação individual por profissional habilitado.</p>
                {temWhatsapp() && (
                  <WaButton variante="claro" mensagem={CONFIG.mensagens.porAtendimento(a.nome)}>
                    Agendar avaliação
                  </WaButton>
                )}
              </>
            ),
          }))}
        />
      </div>
    </section>
  );
}

function Profissional() {
  if (!S.profissional) return null;
  const foto = CONFIG.fotos.profissional[1] ?? null;
  const [nome1, ...resto] = CONFIG.nomeCurto.split(" ");
  const ficha = [
    ["Profissão", CONFIG.profissao],
    ["Registro", CONFIG.cro],
    CONFIG.especialidade ? ["Especialidade", `${CONFIG.especialidade}${CONFIG.rqe ? `, RQE ${CONFIG.rqe}` : ""}`] : null,
    ["Atendimento", `${CONFIG.endereco.bairro}, ${CONFIG.cidade}/${CONFIG.uf}`],
  ].filter(Boolean) as [string, string][];
  return (
    <section className="secao profissional com-foto" id="profissional" aria-labelledby="prof-titulo">
      <div className="wrap profissional-grid">
        <div className="profissional-texto">
          <p className="rotulo">O profissional</p>
          <h2 id="prof-titulo" className="nome-grande">
            <span className="nome-dr">Dr.</span>
            <span>{nome1}</span>
            <span>{resto.join(" ")}</span>
          </h2>
          <dl className="ficha">
            {ficha.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        {!foto && (
          <div className="profissional-marca" aria-hidden="true">
            <RegMark size={320} />
            <span className="profissional-marca-cro">{CONFIG.cro}</span>
          </div>
        )}
        {foto && (
          <figure className="profissional-foto">
            <RegMark className="moldura-reg moldura-reg-a" size={28} />
            <RegMark className="moldura-reg moldura-reg-b" size={28} />
            <Picture foto={foto} sizes="(min-width: 960px) 30vw, 80vw" />
          </figure>
        )}
      </div>
    </section>
  );
}

function Consultorio() {
  if (!temFotosConsultorio) return null;
  const fotos = CONFIG.fotos.consultorio;
  return (
    <section className="secao consultorio" id="consultorio" aria-labelledby="cons-titulo">
      <div className="wrap">
        <div className="consultorio-cab">
          <p className="rotulo">O consultório</p>
          <h2 id="cons-titulo" className="titulo-secao">
            Onde a consulta <em>acontece</em>.
          </h2>
        </div>
        <div className={`galeria galeria-${Math.min(fotos.length, 4)}`}>
          {fotos.map((f, i) => (
            <figure key={f.src} className={`galeria-item g${i + 1}`}>
              <Picture foto={f} sizes={i === 0 ? "(min-width: 960px) 60vw, 100vw" : "(min-width: 960px) 30vw, 50vw"} />
              {f.legenda && (
                <figcaption>
                  <span className="fig-num">Fig. {String(i + 1).padStart(2, "0")}</span> {f.legenda}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  if (!S.comoFunciona) return null;
  return (
    <section className="secao como" id="como-funciona" aria-labelledby="como-titulo">
      <div className="wrap como-grid">
        <div>
          <p className="rotulo">Como funciona</p>
          <h2 id="como-titulo" className="titulo-secao">
            Quatro etapas, cada uma <em>explicada</em>.
          </h2>
        </div>
        <Linha
          etapas={[
            {
              titulo: "Contato e agendamento",
              texto: "Você chama pelo WhatsApp ou envia a solicitação pelo formulário deste site. A equipe responde com os horários disponíveis.",
            },
            {
              titulo: "Avaliação individual",
              texto: "Na consulta, o Dr. Maurilio examina dentes, gengiva e mordida e ouve o que você procura.",
            },
            {
              titulo: "Planejamento explicado",
              texto: "Você recebe a proposta etapa por etapa, com o que será feito em cada uma, e decide com calma.",
            },
            {
              titulo: "Acompanhamento",
              texto: "As consultas de retorno seguem o planejamento combinado, e cada ajuste é explicado antes de ser feito.",
            },
          ]}
        />
      </div>
    </section>
  );
}

function Duvidas() {
  if (!S.duvidas) return null;
  const nomes = CONFIG.atendimentos.map((a) => a.nome.toLowerCase());
  const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(", ")} e ${nomes.at(-1)}` : nomes[0] ?? "";
  const dias = CONFIG.horarios.filter((h) => "abre" in h);
  const h0 = dias[0] && "abre" in dias[0] ? dias[0] : null;
  const fechados = CONFIG.horarios.filter((h) => "fechado" in h).map((h) => h.dia.toLowerCase());
  const hora = (s: string) => s.replace(":00", "h").replace(/^0/, "");
  const itens = [
    {
      t: "Como agendar uma avaliação?",
      c: temWhatsapp()
        ? `Pelo WhatsApp ${CONFIG.whatsappExibicao} ou pelo formulário “Solicitar agendamento”, aqui no site. A equipe confirma a disponibilidade pela conversa.`
        : "Pelos canais de contato indicados nesta página.",
    },
    temAgendar && {
      t: "Posso agendar pelo site?",
      c: "Você pode enviar a solicitação pelo formulário. Ele monta a mensagem e abre o WhatsApp do consultório; o site não guarda os dados digitados. O horário só fica marcado depois da confirmação da equipe.",
    },
    {
      t: "Como é a primeira avaliação?",
      c: "Uma conversa sobre o que você procura e um exame clínico de dentes, gengiva e mordida. Quando necessário, podem ser solicitados exames complementares. Ao final, o dentista explica o que observou e quais são os próximos passos.",
    },
    {
      t: "O que levar na consulta?",
      c: "Documento com foto e, se tiver, exames e radiografias recentes e a lista dos medicamentos que você usa.",
    },
    lista && {
      t: "Quais atendimentos o consultório oferece?",
      c: `${lista.charAt(0).toUpperCase() + lista.slice(1)}, sempre depois de uma avaliação individual.`,
    },
    lista && {
      t: `${lista.charAt(0).toUpperCase() + lista.slice(1)} servem para todas as pessoas?`,
      c: "Não necessariamente. A indicação depende de avaliação individual por profissional habilitado, que considera a saúde dos dentes, da gengiva e da mordida de cada pessoa.",
    },
    h0 && {
      t: "Quais são os horários de atendimento?",
      c: `De segunda a sexta, das ${hora(h0.abre)} às ${hora(h0.fecha)}. ${CONFIG.avisoHorarios}`,
    },
    fechados.length > 0 && {
      t: "O consultório atende aos sábados e domingos?",
      c: "Não. Aos sábados e domingos o consultório fica fechado.",
    },
    {
      t: "Onde fica o consultório?",
      c: `${enderecoLinha()}.`,
    },
  ].filter(Boolean) as { t: string; c: string }[];

  return (
    <section className="secao duvidas" id="duvidas" aria-labelledby="duv-titulo">
      <div className="wrap duvidas-grid">
        <div>
          <p className="rotulo">Dúvidas frequentes</p>
          <h2 id="duv-titulo" className="titulo-secao">
            Antes de <em>marcar</em>.
          </h2>
        </div>
        <Acordeao className="faq" itens={itens.map((i) => ({ titulo: i.t, conteudo: <p>{i.c}</p> }))} />
      </div>
    </section>
  );
}

function Mapa() {
  const [carregado, setCarregado] = useState(false);
  if (!CONFIG.mapaEmbed) return null;
  return (
    <div className="mapa">
      {carregado ? (
        <iframe
          title={`Mapa: ${enderecoLinha()}`}
          src={CONFIG.mapaEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="mapa-capa">
          <RegMark size={56} className="mapa-reg" />
          <p>O mapa é carregado do Google Maps somente se você pedir.</p>
          <button type="button" className="btn btn-secundario" onClick={() => setCarregado(true)}>
            <span className="btn-label">Carregar mapa</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Local() {
  if (!S.local) return null;
  const e = CONFIG.endereco;
  return (
    <section className="secao local" id="local" aria-labelledby="local-titulo">
      <div className="wrap local-grid">
        <div className="local-info">
          <p className="rotulo">Localização e contato</p>
          <h2 id="local-titulo" className="titulo-secao">
            Venha nos <em>visitar</em>.
          </h2>
          <address className="endereco">
            {e.rua}, {e.numero}
            <br />
            {e.bairro}, {e.cidade} - {e.uf}
            <br />
            CEP {e.cep}
          </address>
          <table className="horarios">
            <caption className="rotulo">Horários</caption>
            <tbody>
              {CONFIG.horarios.map((h) => (
                <tr key={h.dia}>
                  <th scope="row">{h.dia}</th>
                  <td>{"abre" in h ? `${h.abre.replace(":", "h")} às ${h.fecha.replace(":", "h")}` : "Fechado"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="texto-pequeno">{CONFIG.avisoHorarios}</p>
          <div className="acoes">
            {CONFIG.rotaUrl && (
              <LinkButton href={CONFIG.rotaUrl} externo>
                Como chegar
              </LinkButton>
            )}
            {CONFIG.mapsUrl && (
              <LinkButton href={CONFIG.mapsUrl} externo>
                Ver no Google Maps
              </LinkButton>
            )}
          </div>
          <div className="acoes">
            {temWhatsapp() && <WaButton>Agendar pelo WhatsApp</WaButton>}
            {CONFIG.instagram && (
              <LinkButton href={CONFIG.instagram} externo>
                Ver no Instagram
              </LinkButton>
            )}
          </div>
        </div>
        <Mapa />
      </div>
    </section>
  );
}

function CtaFinal() {
  if (!S.ctaFinal) return null;
  return (
    <section className="secao escuro cta-final" aria-labelledby="cta-titulo">
      <CropMarks />
      <RegMark className="cta-reg cta-reg-a" size={28} />
      <RegMark className="cta-reg cta-reg-b" size={28} />
      <div className="wrap cta-in">
        <h2 id="cta-titulo" className="cta-titulo">
          A avaliação é o primeiro <em>passo</em>.
        </h2>
        <div className="acoes">
          {temWhatsapp() && <WaButton variante="claro" />}
          {CONFIG.instagram && (
            <a className="btn btn-contorno-claro" href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
              <span className="btn-label">Ver no Instagram</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap rodape-grid">
        <div>
          <Logo tom="escuro" />
          <p className="rodape-id">
            {CONFIG.nome} · {CONFIG.profissao} · {CONFIG.cro} · {CONFIG.cidade}/{CONFIG.uf}
          </p>
          {CONFIG.responsavelTecnico && <p>Responsável técnico: {CONFIG.responsavelTecnico}</p>}
        </div>
        <div>
          <p className="rodape-rot">Endereço</p>
          <p>{enderecoLinha()}</p>
        </div>
        <div>
          <p className="rodape-rot">Contato</p>
          <ul>
            {temWhatsapp() && (
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {CONFIG.whatsappExibicao}
                </a>
              </li>
            )}
            {CONFIG.instagram && (
              <li>
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            )}
            <li>
              <a href="/privacidade.html">Privacidade</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap rodape-legal">
        <p>
          Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação individual por
          profissional habilitado.
        </p>
      </div>
    </footer>
  );
}

function AgendarFixo() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const f = () => setVisivel(window.scrollY > window.innerHeight * 0.6);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  if (!temWhatsapp()) return null;
  return (
    <aside aria-label="Agendamento rápido">
      <div className="barra-movel">
        <WaButton className="btn-largo" />
      </div>
      <a
        className={`flutuante ${visivel ? "is-visivel" : ""}`}
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
      >
        <RegMark size={16} />
        <span>Agendar pelo WhatsApp</span>
        <span className="sr-only"> (nova aba)</span>
      </a>
    </aside>
  );
}

export default function App() {
  return (
    <>
      <a href="#conteudo" className="pular">
        Pular para o conteúdo
      </a>
      <Rascunho />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Atendimentos />
        <Profissional />
        <Consultorio />
        <ComoFunciona />
        <Duvidas />
        <Local />
        {temAgendar && <Agendar />}
        <CtaFinal />
      </main>
      <Rodape />
      <AgendarFixo />
    </>
  );
}
