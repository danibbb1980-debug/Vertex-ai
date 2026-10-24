import { useRef } from "react";
import { waLink } from "../config";
import { IconArrow, IconWhatsApp } from "../components/Icons";
import { HeroScene } from "../components/HeroScene";
import { Vertice } from "../components/Vertice";
import { useHeroGL } from "../components/useHeroGL";
import { GLBoundary } from "../lib/webgl";
import { HeroVideo } from "../components/HeroVideo";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const gl = useHeroGL(ref);

  return (
    <section ref={ref} id="topo" aria-labelledby="hero-title" className={`relative isolate overflow-hidden${gl.ready ? " hero-gl" : ""}`}>
      {/* Fundo em WebGL (V de vidro e telas). Carregado só em aparelhos capazes. */}
      {gl.video && !gl.Comp && (
        <div className="hero-backdrop" aria-hidden="true">
          <HeroVideo mode={gl.video} onReady={() => gl.setReady(true)} />
          <div className="hero-veil" />
        </div>
      )}
      {gl.Comp && (
        <div className="hero-backdrop" aria-hidden="true">
          <GLBoundary key={gl.lite ? "lite" : "full"} onError={gl.fail}>
            <gl.Comp
              active={gl.visible}
              lite={gl.lite}
              still={gl.still}
              onReady={() => gl.setReady(true)}
              onFail={gl.fail}
            />
          </GLBoundary>
          <div className="hero-veil" />
        </div>
      )}
      {/* Diagnóstico do 3D, só com ?debug3d na URL */}
      {gl.debug && (
        <p className="fixed bottom-3 left-3 z-[70] max-w-[min(92vw,40rem)] rounded border border-gold/40 bg-ink-0/95 px-3 py-2 font-mono text-[11px] leading-snug text-champ">
          {gl.debug}
        </p>
      )}
      <div className="container-v grid grid-cols-1 items-center gap-12 pt-28 pb-14 sm:pt-32 lg:min-h-[min(100svh,960px)] lg:grid-cols-12 lg:gap-6 lg:pt-28 lg:pb-16">
        <div className="lg:col-span-6">
          <p className="fade-up flex items-center gap-3 eyebrow">
            <Vertice className="h-[11px] w-auto text-gold" />
            Estúdio de sites em Poços de Caldas
          </p>
          <h1
            id="hero-title"
            className="fade-up mt-7 text-[clamp(3.1rem,11vw,6.4rem)] leading-[0.96] tracking-[-0.018em] text-pearl"
            style={{ ["--d" as string]: "80ms" }}
          >
            Seu site pronto <span className="serif-accent">antes</span> de você decidir.
          </h1>
          <p
            className="fade-up mt-8 max-w-[31rem] text-[1.1rem] leading-relaxed text-mist sm:text-[1.15rem]"
            style={{ ["--d" as string]: "200ms" }}
          >
            Criamos o rascunho do site da sua empresa, sem custo e sem compromisso. Você vê, pede ajustes e só então decide.
          </p>

          <div className="fade-up mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4" style={{ ["--d" as string]: "320ms" }}>
            <a href={waLink()} target="_blank" rel="noopener" className="btn btn-gold">
              <IconWhatsApp />
              Quero ver o meu rascunho
            </a>
            <a href="#como-funciona" className="btn btn-ghost">
              Como funciona
              <IconArrow className="arr size-4 rotate-90" />
            </a>
          </div>

          <ul className="fade-up mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-pearl/10 pt-5 meta" style={{ ["--d" as string]: "420ms" }}>
            <li>Rascunho sem custo</li>
            <li>Sem taxa de criação</li>
            <li>Sem fidelidade</li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[36rem] sm:max-w-[42rem] lg:col-span-6 lg:max-w-none">
          <HeroScene glReady={gl.ready} lite={gl.video ? false : gl.lite} />
        </div>
      </div>
    </section>
  );
}
