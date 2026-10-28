import { useEffect, useRef, useState } from "react";
import { carregarEfeitos } from "../lib/movimento";
import { CONFIG } from "../config";
import { Blob, Moon, Sparkle } from "../components/Decor";
import { IconArrowDown } from "../components/Icons";
import { BotaoWhatsApp, Confirmar, Foto } from "../components/ui";

const TITULO = ["Cuidado", "que", "acompanha", "o", "*crescimento*", "do", "seu", "filho."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(true);

  // parallax leve (carregado depois, só sem "reduzir movimento")
  useEffect(() => {
    let cancelar: (() => void) | undefined;
    let ativo = true;
    carregarEfeitos().then((e) => {
      if (e && ativo && ref.current) cancelar = e.parallaxHero(ref.current);
    });
    return () => {
      ativo = false;
      cancelar?.();
    };
  }, []);

  // pausa as animações contínuas quando o hero sai da tela
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
      aria-labelledby="titulo-hero"
      className={`relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28 ${visivel ? "" : "pausado"}`}
    >
      {/* fundo orgânico */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div data-parallax="70" className="absolute -top-40 -right-40 w-[34rem] md:w-[46rem]">
          <Blob variant="a" className="flutuar-lento w-full text-sage-50" />
        </div>
        <div data-parallax="-60" className="absolute top-[58%] -left-48 w-[26rem]">
          <Blob variant="c" className="flutuar-lento w-full text-peach-50" style={{ animationDelay: "-5s" }} />
        </div>
        <div data-parallax="-130" className="absolute top-[18%] left-[46%] hidden md:block">
          <Sparkle filled className="cintilar h-5 w-5 text-butter" />
        </div>
        <div data-parallax="-60" className="absolute top-[12%] left-[8%]">
          <Sparkle className="cintilar h-4 w-4 text-coral" style={{ animationDelay: "-2s" }} />
        </div>
        <div data-parallax="-130" className="absolute bottom-[14%] left-[40%] hidden lg:block">
          <Moon className="flutuar h-7 w-7 text-sage-500" />
        </div>
      </div>

      <div className="container-site relative grid items-center gap-14 md:grid-cols-12 md:gap-8 lg:gap-10">
        <div className="md:col-span-7">
          <p className="eyebrow">Odontologia infantil em Alfenas - MG</p>
          <h1
            id="titulo-hero"
            className="mt-5 text-[2.7rem] leading-[1.03] font-normal sm:text-6xl md:text-[3.3rem] lg:text-[4.6rem]"
          >
            {TITULO.map((p, i) => (
              <span key={i}>
                <span className="palavra" style={{ ["--i" as string]: i }}>
                  {p.startsWith("*") ? <em className="enfase">{p.slice(1, -1)}</em> : p}
                </span>
                {i < TITULO.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className="reveal mt-7 max-w-xl text-lg text-body md:text-xl" style={{ ["--d" as string]: "350ms" }}>
            Atendimento odontológico para bebês, crianças e adolescentes, com acolhimento e explicações claras para a
            família.
          </p>
          <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ["--d" as string]: "450ms" }}>
            <BotaoWhatsApp fase="geral" largo />
            <a href="#atendimento" className="btn btn-ghost">
              Conhecer o atendimento
              <IconArrowDown size={18} />
            </a>
          </div>
          <p className="reveal mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] text-muted" style={{ ["--d" as string]: "550ms" }}>
            <span className="font-bold text-ink">{CONFIG.nome}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-sage-500" />
            <span>{CONFIG.profissao}</span>
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[24rem] sm:max-w-[26rem] md:col-span-5 md:max-w-none">
          <div aria-hidden className="absolute -inset-6 -z-0">
            <Blob variant="b" className="h-full w-full text-sage-100" />
          </div>
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-[#dcd9d8] shadow-[0_30px_60px_-35px_rgba(29,42,71,0.55)]">
            <Foto
              {...CONFIG.fotos.hero}
              sizes="(min-width: 768px) 36vw, (min-width: 640px) 26rem, 90vw"
              prioridade
              className="aspect-[933/1166] h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -right-3 -bottom-5 rounded-2xl border border-line bg-paper px-4 py-3 shadow-[0_18px_40px_-24px_rgba(29,42,71,0.5)] sm:-right-8">
            <p className="text-[0.7rem] font-extrabold tracking-[0.16em] text-sage-deep uppercase">Registro</p>
            <p className="font-display text-lg text-ink">
              {CONFIG.cro}
              <Confirmar />
            </p>
          </div>
          <Sparkle filled className="cintilar absolute -top-2 right-6 h-7 w-7 text-coral" style={{ animationDelay: "-1s" }} />
          <Sparkle className="cintilar absolute top-[30%] -right-3 h-5 w-5 text-sage-deep" style={{ animationDelay: "-3s" }} />
        </div>
      </div>
    </section>
  );
}
