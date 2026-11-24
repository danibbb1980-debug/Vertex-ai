import { useEffect, useState } from "react";
import { CONFIG, croTexto } from "../config";
import { EVENTO_TRATAMENTO } from "./Agendamento";
import { Titulo } from "./Titulo";

/* ---------------- Faixa de palavras: a abordagem da doutora, em movimento ---------------- */
const ideias = ["Naturalidade", "Proporção", "Harmonia", "Planejamento", "Escuta"];

export function Faixa() {
  const linha = (oculta: boolean) => (
    <ul aria-hidden={oculta || undefined} className="flex shrink-0 items-center">
      {ideias.map((t, i) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className={`px-6 font-display text-[2.1rem] leading-none sm:px-10 sm:text-5xl ${i % 2 ? "italic font-[300] text-rose-ink" : "text-tinta"}`}>{t}</span>
          <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="shrink-0 text-champagne">
            <path d="M7 0 8.4 5.6 14 7 8.4 8.4 7 14 5.6 8.4 0 7 5.6 5.6Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-b border-tinta/10 py-4 sm:py-5">
      <p className="sr-only">Naturalidade, proporção, harmonia, planejamento e escuta.</p>
      <div aria-hidden data-marquee className="flex w-max">
        {linha(false)}
        {linha(true)}
      </div>
    </div>
  );
}

/* ---------------- Tratamentos: lista editorial ---------------- */
const tratamentos = [
  { id: "lentes", nome: "Lentes em resina e porcelana", linha: "Ajustam forma, cor e proporção dos dentes." },
  { id: "clareamento", nome: "Clareamento dental", linha: "Dentes mais claros, com acompanhamento profissional." },
  // CONFIRMAR COM A DOUTORA: credenciamento Invisalign antes de citar a marca.
  { id: "alinhadores", nome: "Alinhadores transparentes", linha: "Ortodontia discreta, com placas removíveis." },
];

export function Tratamentos() {
  return (
    <section aria-labelledby="tratamentos-titulo" className="py-12 sm:py-16 lg:py-14">
      <div className="container-site grid gap-7 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <Titulo id="tratamentos-titulo" partes={[{ t: "Tratamentos" }]} className="text-[2.2rem] text-tinta sm:text-5xl" />
          <p data-reveal="sobe" style={{ ["--i" as string]: 2 }} className="mt-3 max-w-xs text-[0.92rem] text-grafite">
            A indicação de cada um depende de avaliação individual.
          </p>
        </div>

        <ul data-cursor-area className="relative">
          <span aria-hidden data-reveal="linha" className="absolute inset-x-0 top-0 h-px bg-tinta/15" />
          {tratamentos.map((t, i) => (
            <li key={t.id} data-reveal="sobe" style={{ ["--i" as string]: i + 1 }} className="relative">
              <a
                href="#agendar"
                onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_TRATAMENTO, { detail: t.id }))}
                className="trat-linha flex items-center justify-between gap-5 py-5 sm:py-6 lg:py-5"
              >
                <span className="min-w-0">
                  <span className="trat-nome serif-display block text-[1.45rem] leading-tight text-tinta sm:text-[2.1rem]">{t.nome}</span>
                  <span className="trat-desc mt-1 block text-[0.92rem] leading-snug text-grafite">{t.linha}</span>
                </span>
                <span className="trat-acao shrink-0 text-[0.85rem] text-rose-ink">
                  <span className="link-sublinhado">Agendar</span>
                  <span className="sr-only"> avaliação para {t.nome.toLowerCase()}</span>
                </span>
              </a>
              <span aria-hidden data-reveal="linha" className="absolute inset-x-0 bottom-0 h-px bg-tinta/15" />
            </li>
          ))}
        </ul>
      </div>
      {/* Etiqueta que segue o cursor sobre a lista (só com mouse) */}
      <span
        aria-hidden
        data-cursor-label
        className="etiqueta-cursor flex h-20 w-20 items-center justify-center rounded-full bg-champagne-claro text-[0.8rem] font-medium text-noite shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]"
      >
        Agendar
      </span>
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
    <section aria-labelledby="sobre-titulo" className="bg-porcelana-2/70 py-12 sm:py-16 lg:py-14">
      <div className="container-site grid items-center gap-10 sm:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[15rem_1fr] lg:gap-20">
        <figure className="hidden w-full sm:block">
          <div data-reveal="cortina" className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-porcelana-2">
            <div data-parallax="0.06" className="h-[112%] w-full -translate-y-[6%]">
              <img {...foto} sizes="(min-width: 1024px) 240px, 40vw" />
            </div>
          </div>
        </figure>
        <div>
          <div className="flex items-center gap-5">
            <div data-reveal="cortina" className="h-[6.5rem] w-[5.2rem] shrink-0 overflow-hidden rounded-[1.1rem] bg-porcelana-2 sm:hidden">
              <img {...foto} alt="" sizes="84px" />
            </div>
            <Titulo id="sobre-titulo" partes={[{ t: "Dra. Ana Villela" }]} className="text-[2.2rem] text-tinta sm:text-5xl" />
          </div>
          {/* Baseado só na bio do Instagram e na ficha do Google. CONFIRMAR COM A DOUTORA */}
          <p data-reveal="sobe" style={{ ["--i" as string]: 1 }} className="mt-5 max-w-lg text-[1.05rem] text-grafite">
            Cirurgiã-dentista em Poços de Caldas, dedicada à estética dental.
          </p>
          <p data-reveal="sobe" style={{ ["--i" as string]: 2 }} className="mt-2 max-w-lg text-[1.05rem] text-grafite">
            Tudo começa por uma avaliação personalizada do seu sorriso.
          </p>
          <dl data-reveal="sobe" style={{ ["--i" as string]: 3 }} className="mt-6 grid max-w-md grid-cols-2 gap-x-8 border-t border-tinta/12 pt-5 text-sm">
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

/* ---------------- Rodapé: assinatura grande ---------------- */
export function Rodape() {
  return (
    <footer className="on-dark relative overflow-hidden border-t border-perola-claro/10 bg-noite pb-24 pt-8 text-[0.8rem] text-perola-claro/55 lg:pb-7 lg:pt-10">
      <div className="container-site lg:flex lg:items-end lg:justify-between lg:gap-12">
        <p
          aria-hidden
          data-reveal="palavras"
          className="font-display text-[3.4rem] italic font-[300] leading-[0.95] tracking-[-0.02em] text-perola-claro/90 sm:text-[6rem] lg:text-[7.5rem]"
        >
          <span className="rw inline-flex overflow-hidden pb-[0.1em]">
            <span>{CONFIG.nomeCurto}</span>
          </span>
        </p>
        <div className="mt-4 flex flex-col gap-2 border-t border-perola-claro/10 pt-5 sm:flex-row sm:items-center sm:justify-between lg:mb-5 lg:mt-0 lg:flex-col lg:items-end lg:border-0 lg:pt-0 lg:pr-20 lg:text-right">
          <p>{CONFIG.descritor} em Poços de Caldas</p>
          {/* CONFIRMAR COM A DOUTORA: CRO e responsável técnico */}
          <p>
            {CONFIG.profissao}. {croTexto}.{" "}
            <a href="/privacidade.html" className="link-sublinhado hover:text-perola-claro">
              Privacidade
            </a>
          </p>
        </div>
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

