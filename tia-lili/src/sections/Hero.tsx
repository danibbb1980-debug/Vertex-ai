import { useCallback, useEffect, useRef, useState } from "react";
import { useMovimentoReduzido, useRolagem } from "../components/rolagem";
import { CONFIG } from "../config";
import { TextReveal } from "../components/TextReveal";
import { Foto } from "../components/Foto";
import { BotaoWhatsApp, Botao, ComPlaceholder } from "../components/Botoes";
import { Blob, Brilho, Estrela, Lua } from "../components/Icones";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduzido = useMovimentoReduzido();
  const [visivel, setVisivel] = useState(true);

  // Parallax leve: cada camada [data-paralaxe] desloca N px ao longo da altura do hero
  const paralaxe = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / r.height));
    el.querySelectorAll<HTMLElement>("[data-paralaxe]").forEach((c) => {
      c.style.transform = `translate3d(0, ${(p * Number(c.dataset.paralaxe)).toFixed(1)}px, 0)`;
    });
  }, []);
  useRolagem(paralaxe, visivel && !reduzido);

  // Pausa as animações contínuas quando o hero sai da tela
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="inicio"
      ref={ref}
      data-linha
      aria-labelledby="titulo-principal"
      className={`relative z-[1] overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28 ${visivel ? "" : "pausado"}`}
    >
      {/* Formas de fundo */}
      <div data-paralaxe="-60" className="pointer-events-none absolute -right-40 -top-24 w-[34rem] text-menta-claro md:-right-24 md:w-[46rem]" aria-hidden>
        <Blob variante={1} className="h-auto w-full" />
      </div>
      <div data-paralaxe="-100" className="pointer-events-none absolute -left-28 top-[62%] w-64 text-rosa-claro md:top-[58%] md:w-80" aria-hidden>
        <Blob variante={2} className="h-auto w-full" />
      </div>

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow revelar visivel">Odontopediatria em Poços de Caldas - MG</p>
          <TextReveal
            as="h1"
            id="titulo-principal"
            texto="Cuidado com *carinho* para cada fase do seu filho."
            className="mt-5 text-[clamp(2.6rem,1.6rem+4.6vw,5rem)] font-[480] leading-[1.02]"
            atraso={0.1}
          />
          <p className="entrar mt-7 max-w-xl text-lg text-taupe-texto md:text-xl" style={{ ["--atraso" as string]: ".55s" }}>
            Atendimento odontológico para bebês, crianças e adolescentes, com acolhimento e explicações claras para a família.
          </p>
          <div className="entrar mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ["--atraso" as string]: ".7s" }}>
            <BotaoWhatsApp magnetico>Agendar avaliação</BotaoWhatsApp>
            <Botao href="#atendimento" variante="secundario">
              Conhecer o atendimento
            </Botao>
          </div>
          <ul className="entrar mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-semibold text-cacau-2" style={{ ["--atraso" as string]: ".85s" }}>
            <li className="flex items-center gap-2">
              <Estrela tamanho={16} className="text-malva" /> Atendimento com agendamento
            </li>
            <li className="flex items-center gap-2">
              <Estrela tamanho={16} className="text-menta-escuro" /> Bebês, crianças e adolescentes
            </li>
          </ul>
        </div>

        <div className="relative mx-auto mt-4 w-full max-w-[26rem] lg:col-span-5 lg:mt-0 lg:max-w-none">
          {/* Estrelas e lua flutuando */}
          <div data-paralaxe="-150" className="pointer-events-none absolute -left-6 top-6 z-10 text-manteiga md:-left-10" aria-hidden>
            <Brilho tamanho={34} className="flutuar" style={{ ["--dur" as string]: "7s" }} />
          </div>
          <div data-paralaxe="-100" className="pointer-events-none absolute -right-3 top-[38%] z-10 text-ceu md:-right-8" aria-hidden>
            <Estrela tamanho={30} strokeWidth={1.8} className="flutuar" style={{ ["--dur" as string]: "9s", ["--atraso" as string]: "-3s" }} />
          </div>
          <div data-paralaxe="-60" className="pointer-events-none absolute right-10 top-2 z-10 text-taupe lg:-top-8" aria-hidden>
            <Lua tamanho={38} strokeWidth={1.4} className="flutuar" style={{ ["--dur" as string]: "11s", ["--atraso" as string]: "-5s" }} />
          </div>
          <div data-paralaxe="-150" className="pointer-events-none absolute -bottom-4 right-[18%] z-10 text-rosa" aria-hidden>
            <Brilho tamanho={20} className="flutuar" style={{ ["--dur" as string]: "8s", ["--atraso" as string]: "-2s" }} />
          </div>

          <div data-paralaxe="40" className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-5 rounded-[58%_42%_52%_48%/48%_56%_44%_52%] bg-menta/55" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[58%_42%_52%_48%/48%_56%_44%_52%] bg-creme-2">
              <Foto
                nome={CONFIG.fotos.doutora.arquivo}
                alt={CONFIG.fotos.doutora.alt}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 26rem, 90vw"
                prioridade
                className="h-full w-full object-cover object-[50%_18%]"
              />
            </div>
          </div>

          <div className="relative z-20 -mt-10 ml-auto mr-2 w-fit rounded-2xl bg-white/95 px-5 py-3.5 shadow-[0_18px_40px_-22px_rgba(58,46,40,0.45)] ring-1 ring-cacau/5 sm:-mt-14 sm:mr-0">
            <p className="font-display text-lg font-medium leading-tight">{CONFIG.nome}</p>
            <p className="mt-1 text-sm font-semibold text-taupe-texto">
              {CONFIG.profissao} · <ComPlaceholder texto={CONFIG.cro} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
