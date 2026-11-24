import { useEffect, useState } from "react";
import { CONFIG, croTexto } from "../config";
import { EVENTO_TRATAMENTO } from "./Agendamento";
import { Logo } from "./Header";

/* ---------------- Tratamentos: lista editorial, não cartões ---------------- */
const tratamentos = [
  { id: "lentes", nome: "Lentes em resina e porcelana", linha: "Ajustam forma, cor e proporção dos dentes." },
  { id: "clareamento", nome: "Clareamento dental", linha: "Dentes mais claros, com acompanhamento profissional." },
  // CONFIRMAR COM A DOUTORA: credenciamento Invisalign antes de citar a marca.
  { id: "alinhadores", nome: "Alinhadores transparentes", linha: "Ortodontia discreta, com placas removíveis." },
];

export function Tratamentos() {
  return (
    <section aria-labelledby="tratamentos-titulo" className="py-14 sm:py-20 lg:py-20">
      <div className="container-site grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <h2 id="tratamentos-titulo" className="text-[2.2rem] text-tinta sm:text-5xl">
            Tratamentos
          </h2>
          <p className="mt-3 max-w-xs text-[0.92rem] text-grafite">A indicação de cada um depende de avaliação individual.</p>
        </div>

        {/* Único efeito de rolagem da página: as linhas surgem em sequência. */}
        <ul className="reveal-group border-t border-tinta/12">
          {tratamentos.map((t, i) => (
            <li key={t.id} className="reveal-item border-b border-tinta/12" style={{ transitionDelay: `${i * 0.08}s` }}>
              <a
                href="#agendar"
                onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_TRATAMENTO, { detail: t.id }))}
                className="trat-linha group flex items-center justify-between gap-5 py-5 sm:py-6"
              >
                <span className="min-w-0">
                  <span className="serif-display block text-[1.45rem] leading-tight text-tinta transition-colors duration-300 group-hover:text-rose-ink sm:text-[2rem]">
                    {t.nome}
                  </span>
                  <span className="mt-1 block text-[0.92rem] leading-snug text-grafite">{t.linha}</span>
                </span>
                <span className="shrink-0 text-[0.85rem] text-rose-ink">
                  <span className="link-sublinhado">Agendar</span>
                  <span className="sr-only"> avaliação para {t.nome.toLowerCase()}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Sobre ---------------- */
export function Sobre() {
  const foto = {
    src: CONFIG.fotos.consultorio,
    srcSet: CONFIG.fotos.consultorioSrcSet,
    alt: `${CONFIG.nome} no consultório, de jaleco azul-marinho, calçando luvas`,
    width: 953,
    height: 1716,
    loading: "lazy" as const,
    decoding: "async" as const,
    className: "h-full w-full object-cover object-[50%_26%]",
  };
  return (
    <section aria-labelledby="sobre-titulo" className="bg-porcelana-2/70 py-14 sm:py-20 lg:py-16">
      <div className="container-site grid items-center gap-10 sm:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[15rem_1fr] lg:gap-20">
        <figure className="hidden w-full sm:block">
          <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-porcelana-2">
            <img {...foto} sizes="(min-width: 1024px) 240px, 40vw" />
          </div>
        </figure>
        <div>
          <div className="flex items-center gap-5">
            <div className="h-[6.5rem] w-[5.2rem] shrink-0 overflow-hidden rounded-[1.1rem] bg-porcelana-2 sm:hidden">
              <img {...foto} alt="" sizes="84px" />
            </div>
            <h2 id="sobre-titulo" className="text-[2.2rem] text-tinta sm:text-5xl">
              Dra. Ana Villela
            </h2>
          </div>
          {/* Baseado só na bio do Instagram e na ficha do Google. CONFIRMAR COM A DOUTORA */}
          <p className="mt-5 max-w-lg text-[1.05rem] text-grafite">Cirurgiã-dentista em Poços de Caldas, dedicada à estética dental.</p>
          <p className="mt-2 max-w-lg text-[1.05rem] text-grafite">Tudo começa por uma avaliação personalizada do seu sorriso.</p>
          <dl className="mt-6 grid max-w-md grid-cols-2 gap-x-8 border-t border-tinta/12 pt-5 text-sm">
            <div>
              <dt className="text-grafite">Registro</dt>
              <dd className="mt-0.5 text-tinta">{croTexto}</dd>
            </div>
            <div>
              <dt className="text-grafite">Especialidade</dt>
              <dd className="mt-0.5 text-tinta">{CONFIG.especialidade ?? "A confirmar"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Rodapé de uma linha ---------------- */
export function Rodape() {
  return (
    <footer className="on-dark border-t border-perola-claro/10 bg-noite pb-24 pt-6 text-[0.8rem] text-perola-claro/55 lg:pb-6">
      <div className="container-site flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Logo light />
        {/* CONFIRMAR COM A DOUTORA: CRO e responsável técnico */}
        <p className="lg:pr-20">
          {CONFIG.profissao}. {croTexto}.{" "}
          <a href="/privacidade.html" className="link-sublinhado hover:text-perola-claro">
            Privacidade
          </a>
        </p>
      </div>
    </footer>
  );
}

/* ---------------- Barra fixa: aparece fora do hero e fora do agendamento ---------------- */
export function BarraAgendar() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const alvos = ["inicio", "agendar"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const emTela = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => emTela.set(e.target, e.isIntersecting));
        setVisivel(![...emTela.values()].some(Boolean));
      },
      { threshold: 0.12 },
    );
    alvos.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-[transform,opacity] duration-500 lg:inset-x-auto lg:bottom-6 lg:right-6 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0 lg:translate-y-4"
      }`}
    >
      <div className="border-t border-perola-claro/10 bg-noite/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <a
          href="#agendar"
          tabIndex={visivel ? 0 : -1}
          className="flex min-h-12 items-center justify-center rounded-full bg-champagne-claro px-7 text-[0.95rem] font-medium text-noite shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)]"
        >
          Agendar avaliação
        </a>
      </div>
    </div>
  );
}

/** Liga o único efeito de rolagem. Sem JS, tudo fica visível. */
export function useRevealGroups() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll(".reveal-group").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
