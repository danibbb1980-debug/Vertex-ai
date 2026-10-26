import { useEffect, useState } from "react";
import { CONFIG, croTexto, whatsappLink } from "../config";
import { Button } from "./Button";
import { Logo } from "./Header";
import { IconArrowUpRight, IconClock, IconInstagram, IconPin, IconWhatsapp } from "./Icons";

const { manha, tarde } = CONFIG.horarios.semana;

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${dark ? "text-rose" : "text-rose-ink"}`}>
      <span aria-hidden className={`h-px w-8 ${dark ? "bg-rose/60" : "bg-rose-ink/50"}`} />
      {children}
    </p>
  );
}

/* ---------------- Tratamentos ---------------- */
const tratamentos = [
  { nome: "Lentes em resina e porcelana", linha: "Ajustam forma, cor e proporção dos dentes." },
  { nome: "Clareamento dental", linha: "Dentes mais claros, com acompanhamento profissional." },
  // CONFIRMAR COM A DOUTORA: credenciamento Invisalign antes de citar a marca.
  { nome: "Alinhadores transparentes", linha: "Ortodontia discreta, com placas removíveis." },
];

export function Tratamentos() {
  return (
    <section aria-labelledby="tratamentos-titulo" className="bg-porcelana-2/60 py-14 sm:py-20 lg:py-20">
      <div className="container-site">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Tratamentos</Eyebrow>
            <h2 id="tratamentos-titulo" className="mt-4 text-[2.1rem] text-tinta sm:text-5xl">
              Cada sorriso pede um <em className="text-rose-ink">caminho</em>.
            </h2>
          </div>
        </div>

        {/* Um único efeito de rolagem na página: os cartões surgem em sequência. */}
        <ul className="reveal-group mt-8 grid gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {tratamentos.map((t, i) => (
            <li key={t.nome} className="reveal-item" style={{ transitionDelay: `${i * 0.08}s` }}>
              <a
                href={whatsappLink(`Olá, Dra. Ana! Vi seu site e gostaria de conversar sobre ${t.nome.toLowerCase()}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="card-trat group relative flex h-full items-center gap-4 overflow-hidden rounded-[1.25rem] border border-tinta/10 bg-[#fffdf9] p-5 transition-[border-color,box-shadow] duration-500 hover:border-tinta/25 hover:shadow-[0_24px_50px_-36px_rgba(27,37,54,0.5)] sm:p-6 lg:flex-col lg:items-start lg:gap-0 lg:p-8"
              >
                <span aria-hidden className="card-filete absolute inset-x-0 top-0 h-px origin-left bg-rose-ink" />
                <span aria-hidden className="hidden font-display text-sm italic text-rose-ink lg:block">0{i + 1}</span>
                <span className="min-w-0 flex-1 lg:mt-10">
                  <span className="serif-display block text-[1.4rem] leading-tight text-tinta sm:text-2xl lg:text-[1.8rem]">{t.nome}</span>
                  <span className="mt-1.5 block text-[0.92rem] leading-snug text-grafite lg:mt-3">{t.linha}</span>
                </span>
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tinta/15 text-tinta transition-colors duration-300 group-hover:border-tinta group-hover:bg-tinta group-hover:text-porcelana lg:mt-8"
                >
                  <IconArrowUpRight width={17} height={17} />
                </span>
                <span className="sr-only">: conversar pelo WhatsApp</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.85rem] italic text-grafite">A indicação depende de avaliação individual.</p>
      </div>
    </section>
  );
}

/* ---------------- Sobre ---------------- */
export function Sobre() {
  return (
    <section aria-labelledby="sobre-titulo" className="py-14 sm:py-20 lg:py-16">
      <div className="container-site grid items-center gap-8 sm:grid-cols-[0.8fr_1.2fr] sm:gap-10 lg:grid-cols-[17rem_1fr] lg:gap-20">
        <figure className="mx-auto w-full max-w-[24rem] lg:max-w-[17rem]">
          <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-porcelana-2 sm:aspect-[4/5]">
            <img
              src={CONFIG.fotos.consultorio}
              srcSet={CONFIG.fotos.consultorioSrcSet}
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 40vw, min(384px, calc(100vw - 40px))"
              alt={`${CONFIG.nome} no consultório, de jaleco azul-marinho, calçando luvas`}
              width={953}
              height={1716}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[50%_28%]"
            />
          </div>
        </figure>
        <div>
          <Eyebrow>Sobre</Eyebrow>
          <h2 id="sobre-titulo" className="mt-4 text-[2.1rem] text-tinta sm:text-5xl">
            Dra. Ana <em className="text-rose-ink">Villela</em>
          </h2>
          {/* Baseado só na bio do Instagram e na ficha do Google. CONFIRMAR COM A DOUTORA */}
          <p className="mt-5 max-w-lg text-[1.05rem] text-grafite">Cirurgiã-dentista em Poços de Caldas, dedicada à estética dental.</p>
          <p className="mt-2 max-w-lg text-[1.05rem] text-grafite">Tudo começa por uma avaliação personalizada do seu sorriso.</p>
          <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-tinta/10 pt-5 text-sm">
            <div>
              <dt className="eyebrow !text-[0.6rem] text-grafite">Registro</dt>
              <dd className="mt-1 text-tinta">{croTexto}</dd>
            </div>
            <div>
              <dt className="eyebrow !text-[0.6rem] text-grafite">Especialidade</dt>
              <dd className="mt-1 text-tinta">{CONFIG.especialidade ?? "A confirmar"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contato (fecha a página e é o CTA) ---------------- */
export function Contato() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="on-dark grao relative overflow-hidden bg-tinta py-14 text-porcelana sm:py-20 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border border-rose/15" />
      <div className="container-site relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
        <div>
          <Eyebrow dark>Contato</Eyebrow>
          <h2 id="contato-titulo" className="mt-4 text-[2.2rem] text-porcelana sm:text-5xl lg:text-6xl">
            Seu próximo passo é uma <em className="text-rose">avaliação</em>.
          </h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappLink()} external variant="light">
              <IconWhatsapp width={18} height={18} />
              Agendar pelo WhatsApp
            </Button>
            <Button href={CONFIG.maps} external variant="ghostLight">
              Como chegar
              <IconArrowUpRight width={17} height={17} />
            </Button>
          </div>
        </div>

        {/* Endereço e horários da ficha do Google. CONFIRMAR COM A DOUTORA */}
        <div className="grid gap-6 text-[0.95rem] text-porcelana/80">
          <div className="flex gap-3.5">
            <IconPin className="mt-0.5 shrink-0 text-rose" />
            <address className="not-italic">
              {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            </address>
          </div>
          <div className="flex gap-3.5">
            <IconClock className="mt-0.5 shrink-0 text-rose" />
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
              <dt>Seg a sex</dt>
              <dd className="text-porcelana">
                <span className="block sm:inline">{manha[0]} às {manha[1]}</span>
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline">{tarde[0]} às {tarde[1]}</span>
              </dd>
              <dt className="italic text-porcelana/65">Almoço</dt>
              <dd className="italic text-porcelana/65">
                {manha[1]} às {tarde[0]}
              </dd>
              <dt>Sáb e dom</dt>
              <dd>{CONFIG.horarios.fimDeSemana}</dd>
            </dl>
          </div>
          <a
            href={CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-3.5 text-porcelana hover:text-rose"
          >
            <IconInstagram className="shrink-0 text-rose" />
            <span className="link-sublinhado">{CONFIG.instagramUser}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Rodapé de uma linha ---------------- */
export function Rodape() {
  return (
    <footer className="on-dark border-t border-porcelana/10 bg-tinta pb-24 pt-6 text-[0.8rem] text-porcelana/60 lg:pb-6">
      <div className="container-site flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Logo light />
        {/* CONFIRMAR COM A DOUTORA: CRO e responsável técnico */}
        <p className="lg:pr-20">
          {CONFIG.profissao} · {croTexto} ·{" "}
          <a href="/privacidade.html" className="link-sublinhado hover:text-porcelana">
            Privacidade
          </a>
        </p>
      </div>
    </footer>
  );
}

/* ---------------- WhatsApp fixo: aparece só depois do hero ---------------- */
export function WhatsappFixo() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const alvo = document.getElementById("inicio");
    if (!alvo) return;
    const io = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting), { threshold: 0.15 });
    io.observe(alvo);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-[transform,opacity] duration-500 lg:inset-x-auto lg:bottom-6 lg:right-6 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0 lg:translate-y-4"
      }`}
    >
      <div className="border-t border-tinta/10 bg-porcelana/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visivel ? 0 : -1}
          aria-label="Agendar avaliação pelo WhatsApp"
          className="flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-tinta text-[0.95rem] font-medium text-porcelana shadow-[0_18px_40px_-18px_rgba(27,37,54,0.7)] ring-1 ring-porcelana/20 lg:h-14 lg:w-14 lg:min-h-0"
        >
          <IconWhatsapp width={20} height={20} />
          <span className="lg:sr-only">Agendar avaliação pelo WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

/** Liga o único efeito de rolagem (cartões). Sem JS, tudo fica visível. */
export function useRevealGroups() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = document.querySelectorAll(".reveal-group");
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
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
