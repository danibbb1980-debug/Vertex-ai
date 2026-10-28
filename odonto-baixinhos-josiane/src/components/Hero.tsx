import { useEffect, useRef } from "react";
import { CONFIG, linkWhatsApp, modoAtual, profissionaisAtivas, type Profissional } from "../config";
import { IconeSeta, IconeWhatsApp } from "./Icones";
import { Porta } from "./Porta";
import { TituloRevelado } from "./Texto";

/**
 * Abre as portas conforme a página desce (celular e desktop): de entreabertas (16°)
 * a abertas (66°) nos primeiros ~280px de rolagem. Só escreve uma variável CSS por quadro.
 */
function usePortasNaRolagem() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / 280));
      el.style.setProperty("--abre-rolagem", `${(16 + p * 50).toFixed(1)}deg`);
    };
    const onScroll = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(quadro);
    };
  }, []);
  return ref;
}

const ancora = (p: Profissional) => (p.id === "aline" ? "#odonto-baixinhos" : "#dra-josiane");

function Legenda({ pro }: { pro: Profissional }) {
  const baixinhos = pro.id === "aline";
  return (
    <div className={`text-center ${baixinhos ? "tema-baixinhos" : "tema-josiane"}`}>
      <p
        className={`font-display text-[1.2rem] leading-tight sm:text-2xl md:text-[1.7rem] ${
          baixinhos ? "[font-variation-settings:'SOFT'_100]" : "[font-variation-settings:'SOFT'_0]"
        }`}
      >
        {baixinhos ? "Odonto Baixinhos" : "Dra. Josiane Silva"}
      </p>
      <p className="mt-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ouro-texto sm:text-xs">
        {baixinhos ? "Bebês e crianças" : "Adultos"}
      </p>
      <p className="mt-1 hidden text-sm text-tinta-2 sm:block">
        {pro.nome} · {pro.titulo}
      </p>
      <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
        <a href={ancora(pro)} className="btn btn-contorno !px-4 text-[0.88rem]">
          Conhecer
        </a>
        <a
          href={linkWhatsApp(pro.whatsapp, pro.mensagemWhatsApp)}
          target="_blank"
          rel="noopener"
          className={`btn !px-4 text-[0.88rem] ${baixinhos ? "btn-ceu" : "btn-ouro"}`}
          aria-label={`Agendar com a ${pro.nome} pelo WhatsApp (abre em nova aba)`}
        >
          <IconeWhatsApp tamanho={17} />
          Agendar
        </a>
      </div>
    </div>
  );
}

function FundoSplit() {
  // metade pastel (castelo) à esquerda, metade creme (madeira) à direita; gradientes, sem filtro
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(40rem 32rem at 0% 30%, color-mix(in srgb, var(--color-ceu) 85%, transparent), transparent 70%)," +
          "radial-gradient(22rem 18rem at 22% 85%, color-mix(in srgb, var(--color-rosa) 75%, transparent), transparent 70%)," +
          "radial-gradient(40rem 32rem at 100% 30%, var(--color-creme), transparent 70%)," +
          "radial-gradient(22rem 18rem at 80% 90%, color-mix(in srgb, var(--color-pessego) 60%, transparent), transparent 70%)",
      }}
    />
  );
}

function HeroDuplo() {
  const [a, j] = profissionaisAtivas();
  const ref = usePortasNaRolagem();
  return (
    <section ref={ref} id="inicio" className="relative isolate overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40 lg:pt-36">
      <FundoSplit />
      <div className="container-site grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <p className="eyebrow justify-center lg:justify-start">Centro de Alfenas · MG</p>
          <TituloRevelado
            texto="Duas portas,|um *endereço*|de cuidado."
            className="mt-5 text-[clamp(2.2rem,11vw,2.6rem)] leading-[1.02] sm:text-6xl lg:text-[4.4rem] xl:text-[4.9rem]"
          />
          <p
            className="revela mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-tinta-2 md:text-lg lg:mx-0 lg:max-w-md"
            style={{ "--atraso": "500ms" } as React.CSSProperties}
          >
            Odontologia para crianças e para adultos, lado a lado, no centro de Alfenas.
          </p>
          <p className="revela mt-8 hidden text-sm text-tinta-2 lg:block" style={{ "--atraso": "650ms" } as React.CSSProperties}>
            Passe o mouse ou role a página para abrir as portas, ou{" "}
            <a href="#agendar" className="font-bold text-tinta underline decoration-ouro underline-offset-4">
              solicite um horário
            </a>
            .
          </p>
        </div>

        <div className="mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div className="relative grid grid-cols-2 gap-x-3 sm:gap-x-10 lg:gap-x-12">
            <Porta pro={a} href={ancora(a)} rotulo="Odonto Baixinhos, Dra. Aline Maciel: conhecer o atendimento de bebês e crianças" prioridade sizes="(min-width: 1024px) 260px, 45vw" />
            <Porta pro={j} href={ancora(j)} rotulo="Dra. Josiane Silva: conhecer o atendimento de adultos" prioridade sizes="(min-width: 1024px) 260px, 45vw" />
            {/* soleira dourada: uma linha liga as duas portas, ligando as duas portas */}
            <div className="pointer-events-none absolute -inset-x-2 top-full sm:-inset-x-5" aria-hidden="true">
              <svg className="block h-3 w-full overflow-visible" viewBox="0 0 100 4" preserveAspectRatio="none">
                <path d="M0 1 H100" fill="none" stroke="var(--color-ouro)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" pathLength={1} className="linha-desenha" />
              </svg>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-3 sm:gap-x-10 lg:gap-x-12">
            <Legenda pro={a} />
            <Legenda pro={j} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSolo({ pro }: { pro: Profissional }) {
  const baixinhos = pro.id === "aline";
  const t = baixinhos
    ? {
        eyebrow: "Odonto Baixinhos · Alfenas - MG",
        titulo: "Odontologia para|bebês e crianças,|no *tempo* de|cada uma.",
        texto:
          "A Dra. Aline Maciel atende bebês, crianças, pessoas com deficiência e gestantes no Odonto Baixinhos, no centro de Alfenas.",
      }
    : {
        eyebrow: "Cirurgiã-Dentista · Alfenas - MG",
        titulo: "Cuidado|odontológico|que começa|pela *escuta*.",
        texto:
          "A Dra. Josiane Silva atende adultos com atenção individual às necessidades, aos medos e às expectativas de cada paciente, no centro de Alfenas.",
      };
  const ref = usePortasNaRolagem();
  return (
    <section ref={ref} id="inicio" className={`relative isolate overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44 ${baixinhos ? "tema-baixinhos" : "tema-josiane"}`}>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: baixinhos
            ? "radial-gradient(40rem 34rem at 95% 25%, var(--color-ceu), transparent 70%), radial-gradient(24rem 20rem at 0% 100%, var(--color-rosa), transparent 70%)"
            : "radial-gradient(40rem 34rem at 95% 25%, var(--color-creme), transparent 70%), radial-gradient(24rem 20rem at 0% 100%, color-mix(in srgb, var(--color-pessego) 60%, transparent), transparent 70%)",
        }}
      />
      <div className="container-site grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <TituloRevelado texto={t.titulo} className="mt-5 text-[clamp(2.2rem,11vw,2.6rem)] leading-[1.03] sm:text-6xl md:text-[4rem] lg:text-[4.4rem]" />
          <p className="revela mt-6 max-w-xl text-[1.05rem] leading-relaxed text-tinta-2 md:text-lg" style={{ "--atraso": "450ms" } as React.CSSProperties}>
            {t.texto}
          </p>
          <div className="revela mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--atraso": "600ms" } as React.CSSProperties}>
            <a
              href={linkWhatsApp(pro.whatsapp, pro.mensagemWhatsApp)}
              target="_blank"
              rel="noopener"
              className="btn btn-tinta"
              aria-label={`Agendar avaliação com a ${pro.nome} pelo WhatsApp (abre em nova aba)`}
            >
              <IconeWhatsApp tamanho={18} />
              Agendar avaliação
            </a>
            <a href={ancora(pro)} className="btn btn-contorno">
              Conhecer o atendimento
              <IconeSeta />
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[22rem]">
          <Porta pro={pro} href={ancora(pro)} rotulo={`Conhecer o atendimento da ${pro.nome}`} prioridade sizes="(min-width: 768px) 360px, 80vw" />
          <p className="mt-5 text-center text-sm text-tinta-2">
            {pro.nome} · {pro.titulo}
            {pro.cro ? (
              <>
                <br />
                <span className="text-xs">{pro.cro}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  const modo = modoAtual();
  if (modo === "ambas") return <HeroDuplo />;
  return <HeroSolo pro={modo === "aline" ? CONFIG.profissionais.aline : CONFIG.profissionais.josiane} />;
}
