import { useEffect, useRef } from "react";
import { CONFIG } from "../config";
import { useMedia, usePrefersReducedMotion } from "../lib/hooks";
import ContourField from "./ContourField";
import { AgendarBtn, Btn } from "./ui";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const desktop = useMedia("(min-width: 900px)");
  const reduced = usePrefersReducedMotion();
  const foto = CONFIG.fotoProfissional;

  // variável CSS ligada à rolagem: o campo sobe devagar e perde contraste
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const on = () => {
      if (!visible || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const p = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight || 1)));
        el.style.setProperty("--hp", p.toFixed(3));
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const local = `${CONFIG.cidade.toUpperCase()}/${CONFIG.uf}`;

  return (
    <section id="topo" ref={ref} className="hero" aria-labelledby="hero-t">
      <div className="hero__grid wrap">
        <div className="hero__text">
          <p className="eyebrow">
            {CONFIG.nome.toUpperCase()} <span aria-hidden="true">·</span> ESTÉTICA FACIAL E CORPORAL <span aria-hidden="true">·</span> {local}
          </p>
          <h1 id="hero-t" className="hero__t">
            <span className="sr-only">{CONFIG.nome}, estética facial e corporal em {CONFIG.cidade}. </span>
            Cuidado individual, com calma e <em>critério</em>.
          </h1>
          <p className="hero__sub">
            Estética facial e corporal com avaliação individual e horário marcado, no Centro de {CONFIG.cidade}.
          </p>
          <div className="hero__btns">
            <AgendarBtn />
            {CONFIG.secoes.local && (
              <Btn href="#contato" variant="line">
                Conhecer o espaço
              </Btn>
            )}
          </div>
        </div>

        <div className={`hero__art ${foto ? "has-photo" : ""}`}>
          <div className="hero__field">
            <ContourField
              key={desktop ? "d" : "m"}
              width={600}
              height={640}
              cx={300}
              cy={desktop ? 250 : 270}
              r0={desktop ? 46 : 64}
              gap={desktop ? 25 : 38}
              count={desktop ? 10 : 6}
              accent={desktop ? 6 : 3}
              sx={1.04}
              sy={1.1}
              settle
              duration={3200}
            />
          </div>
          {foto && (
            <figure className="hero__photo">
              <img
                src={foto.src}
                srcSet={foto.srcSet}
                sizes="(min-width: 900px) 440px, min(74vw, 330px)"
                alt={foto.alt}
                width={foto.largura}
                height={foto.altura}
                fetchPriority="high"
                decoding="async"
              />
              <figcaption>
                <span>{CONFIG.nome}</span>
                <span>{CONFIG.descritor}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
