import { useEffect, useRef } from "react";
import { CONFIG, waLink, temWhatsapp } from "../config";
import { CropMarks, LinkButton, Picture, RegMark, WaButton } from "./Marks";

/**
 * Momento de assinatura, "o registro": o título tem uma segunda camada em contorno vermelho,
 * deslocada na diagonal. Conforme a rolagem avança pelo hero, o deslocamento vai a zero,
 * a camada vermelha some e as marcas de registro piscam uma única vez.
 * Só transform e opacity; o cálculo roda em rAF e para quando o hero sai da tela.
 */
function useRegistro(heroRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduz.matches) {
      hero.classList.add("em-registro");
      return;
    }
    let raf = 0;
    let visivel = true;
    let registrado = false;
    const atualizar = () => {
      raf = 0;
      const inicio = window.innerWidth < 720 ? 8 : 14;
      const curso = Math.max(hero.offsetHeight * 0.45, 240);
      const p = Math.min(Math.max(window.scrollY / curso, 0), 1);
      hero.style.setProperty("--reg", `${(inicio * (1 - p)).toFixed(2)}px`);
      hero.style.setProperty("--reg-op", `${(0.9 * (1 - p)).toFixed(3)}`);
      if (p >= 1 && !registrado) {
        registrado = true;
        hero.classList.add("em-registro");
      }
    };
    const pedir = () => {
      if (visivel && !raf) raf = requestAnimationFrame(atualizar);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) pedir();
    });
    io.observe(hero);
    atualizar();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [heroRef]);
}

const Titulo = () => (
  <>
    Cada sorriso pede um <em>planejamento</em> próprio.
  </>
);

/** Faixa de serviço: as três respostas que quem chega ao site procura primeiro. */
function Faixa() {
  const dias = CONFIG.horarios.filter((h) => "abre" in h);
  const h0 = dias[0] && "abre" in dias[0] ? dias[0] : null;
  const hora = (s: string) => s.replace(":00", "h").replace(/^0/, "");
  const e = CONFIG.endereco;
  const itens = [
    h0 && { rot: "Atendimento", val: `Segunda a sexta, ${hora(h0.abre)} às ${hora(h0.fecha)}`, href: "#local" },
    { rot: "Endereço", val: `${e.rua}, ${e.numero}, ${e.bairro}`, href: "#local" },
    temWhatsapp() && { rot: "Agendamento", val: `WhatsApp ${CONFIG.whatsappExibicao}`, href: waLink(), externo: true },
  ].filter(Boolean) as { rot: string; val: string; href: string; externo?: boolean }[];
  return (
    <div className="wrap">
      <ul className="faixa">
        {itens.map((i) => (
          <li key={i.rot}>
            <a href={i.href} {...(i.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <span className="faixa-rot">{i.rot}</span>
              <span className="faixa-val">{i.val}</span>
              {i.externo && <span className="sr-only"> (abre o WhatsApp em nova aba)</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useRegistro(ref);
  const foto = CONFIG.fotos.profissional[0];
  const atendimentos = CONFIG.atendimentos.map((a) => a.nome.toLowerCase());
  const listaAt =
    atendimentos.length > 1 ? `${atendimentos.slice(0, -1).join(", ")} e ${atendimentos.at(-1)}` : atendimentos[0] ?? "";

  return (
    <section ref={ref} className={`hero ${foto ? "hero-com-foto" : ""}`} id="topo" aria-labelledby="hero-titulo">
      <RegMark className="hero-reg hero-reg-tl" />
      <RegMark className="hero-reg hero-reg-tr" />
      <RegMark className="hero-reg hero-reg-bl" />
      <RegMark className="hero-reg hero-reg-br" />
      <div className="wrap hero-grid">
        <div className="hero-texto">
          <p className="eyebrow">
            <span>{CONFIG.nome.toUpperCase()}</span> · <span>{CONFIG.profissao.toUpperCase()}</span> · <span>{CONFIG.cro}</span> ·{" "}
            <span>
              {CONFIG.cidade.toUpperCase()}/{CONFIG.uf}
            </span>
          </p>
          <h1 className="hero-titulo" id="hero-titulo">
            <span className="camada camada-grafite">
              <Titulo />
            </span>
            <span className="camada camada-vermelha" aria-hidden="true">
              <Titulo />
            </span>
          </h1>
          {listaAt && (
            <p className="hero-sub">
              {listaAt.charAt(0).toUpperCase() + listaAt.slice(1)}, com avaliação individual e horário marcado, na {CONFIG.endereco.bairro}, em{" "}
              {CONFIG.cidade}.
            </p>
          )}
          <div className="acoes">
            <WaButton />
            <LinkButton href={CONFIG.secoes.consultorio && CONFIG.fotos.consultorio.length ? "#consultorio" : "#local"}>
              Conhecer o consultório
            </LinkButton>
          </div>
        </div>
        {foto && (
          <figure className="hero-foto">
            <CropMarks />
            <Picture foto={foto} sizes="(min-width: 960px) 36vw, 92vw" eager />
            <figcaption className="hero-legenda">
              {CONFIG.nome} · {CONFIG.cro}
            </figcaption>
          </figure>
        )}
      </div>
      <Faixa />
    </section>
  );
}
