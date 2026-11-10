import { m as motion } from "motion/react";
import { CONFIG, crmTexto, waLink } from "../config";
import { IconArrow, IconWhatsApp } from "../components/Icons";
import { LogoSymbol } from "../components/Logo";
import { VerticalCutReveal } from "../components/VerticalCutReveal";

function ArcsBackdrop() {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 800" className="pointer-events-none absolute -right-[22rem] -top-40 h-[52rem] w-[52rem] opacity-60 sm:-right-64 lg:-right-40">
      <defs>
        <linearGradient id="hb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#578C9C" stopOpacity=".22" />
          <stop offset="1" stopColor="#89BEB4" stopOpacity=".05" />
        </linearGradient>
      </defs>
      <circle cx="400" cy="400" r="380" fill="none" stroke="url(#hb)" strokeWidth="1" />
      <circle cx="400" cy="400" r="300" fill="none" stroke="url(#hb)" strokeWidth="1" />
      <path d="M40 520 C 220 330, 520 360, 760 250" fill="none" stroke="url(#hb)" strokeWidth="1.2" />
    </svg>
  );
}

export function Hero() {
  const agendarHref = CONFIG.secoes.agendar ? "#agendar" : waLink();
  const externo = !CONFIG.secoes.agendar;
  const fade = (d: number) =>
    ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as const } });

  return (
    <section id="inicio" aria-labelledby="titulo-hero" className={`relative overflow-hidden ${CONFIG.rascunho ? "pt-[6.75rem]" : "pt-[4.75rem]"}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_10%,#dcebea_0%,transparent_70%),radial-gradient(50%_50%_at_0%_100%,#e7efef_0%,transparent_70%)]" />
      <ArcsBackdrop />
      <div className="container-site relative z-10 grid items-center gap-12 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pb-24">
        <div className="min-w-0">
          <motion.p className="rotulo" {...fade(0)}>
            Médico · {CONFIG.cidade} - {CONFIG.uf}
          </motion.p>
          <h1 id="titulo-hero" className="mt-5 text-[2.6rem] font-semibold leading-[1] min-[400px]:text-[2.9rem] sm:text-[4.25rem] lg:text-[4.9rem]">
            <VerticalCutReveal text="Seu corpo, com acompanhamento médico." enfase="médico" />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cinza sm:text-xl">
            Avaliação individual, plano explicado com clareza e acompanhamento, com hora marcada. Atendimento voltado a emagrecimento e hipertrofia.
          </p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" {...fade(0.6)}>
            <a href={agendarHref} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn btn-primario">
              {externo && <IconWhatsApp width={20} height={20} />}
              Agendar minha consulta
            </a>
            {CONFIG.atendimentos.length > 0 && (
              <a href="#atendimentos" className="btn btn-secundario group">
                Conhecer os atendimentos
                <IconArrow width={18} height={18} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </motion.div>
          <motion.div className="mt-9 inline-flex items-center gap-3 rounded-full border border-linha bg-white/80 py-2 pl-2 pr-5 shadow-suave backdrop-blur-sm" {...fade(0.75)}>
            <LogoSymbol className="size-9" />
            <p className="text-[0.95rem] leading-tight">
              <span className="font-semibold text-petroleo-900">{CONFIG.nome}</span>
              <span className="text-cinza"> · {crmTexto()}</span>
              {CONFIG.mostrarCrmSP && CONFIG.crmSP && <span className="text-cinza"> · CRM-SP {CONFIG.crmSP}</span>}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[26rem] lg:max-w-none"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const ring = (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -inset-[6%] h-[112%] w-[112%] overflow-visible">
      <defs>
        <linearGradient id="hr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#578C9C" />
          <stop offset="1" stopColor="#89BEB4" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 50 2 A 48 48 0 1 1 8 73"
        fill="none"
        stroke="url(#hr)"
        strokeWidth="0.45"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );

  if (!CONFIG.foto) {
    return (
      <div className="relative aspect-square w-full">
        {ring}
        <div className="absolute inset-[10%] flex items-center justify-center rounded-full bg-white shadow-alta">
          <LogoSymbol className="w-[62%]" title="Símbolo do Dr. Palti Massa" />
        </div>
        <span data-arc="0" data-arc-x="self" className="absolute bottom-[14%] left-[4%] size-px" />
      </div>
    );
  }

  const f = CONFIG.foto;
  return (
    <div className="relative aspect-square w-full">
      {ring}
      <div className="absolute inset-0 overflow-hidden rounded-full bg-nevoa shadow-alta">
        <img
          src={f.src}
          srcSet={f.srcSmall ? `${f.srcSmall} 480w, ${f.src} ${f.width}w` : undefined}
          sizes="(min-width: 1024px) 34rem, 90vw"
          width={f.width}
          height={f.height}
          alt={f.alt}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full scale-[1.06] object-cover object-[50%_30%]"
        />
        <div aria-hidden="true" className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
      </div>
      <span data-arc="0" data-arc-x="self" className="absolute bottom-[11%] right-[-3%] size-px" />
    </div>
  );
}
