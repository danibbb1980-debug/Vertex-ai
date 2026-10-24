import { useEffect, useRef } from "react";

/*
 * Composição do hero: dois navegadores em perspectiva, em planos diferentes,
 * com capturas reais de sites da Vertex (Star Sorrindo à frente, Natalino
 * Polato ao fundo). As capturas entram inteiras, na proporção original.
 *
 * CSS 3D: imagem nítida, nada de WebGL e custo por quadro mínimo.
 * Movimento: entrada suave, flutuação lenta, inclinação pelo cursor limitada
 * (só desktop com mouse, só dentro do hero) e leve inclinação ao rolar.
 * Com prefers-reduced-motion a composição fica parada.
 */

const MAX_TILT = 4; // graus

export function HeroScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    const hero = document.getElementById("topo");
    if (!stage || !rig || !hero) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canTilt = matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    const s = { tx: 0, ty: 0, x: 0, y: 0, sp: 0, visible: true };
    let raf = 0;

    const frame = () => {
      raf = 0;
      if (!s.visible) return;
      const r = hero.getBoundingClientRect();
      const sp = Math.min(1, Math.max(0, -r.top / (r.height * 0.9)));
      s.x += (s.tx - s.x) * 0.075;
      s.y += (s.ty - s.y) * 0.075;
      s.sp += (sp - s.sp) * 0.2;
      rig.style.setProperty("--tx", s.x.toFixed(4));
      rig.style.setProperty("--ty", s.y.toFixed(4));
      rig.style.setProperty("--sp", s.sp.toFixed(4));
      const settling = Math.abs(s.tx - s.x) > 0.001 || Math.abs(s.ty - s.y) > 0.001 || Math.abs(sp - s.sp) > 0.001;
      if (settling) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      s.tx = Math.max(-1, Math.min(1, ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 0.9));
      s.ty = Math.max(-1, Math.min(1, ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 0.9));
      kick();
    };
    const onLeave = () => {
      s.tx = 0;
      s.ty = 0;
      kick();
    };

    if (canTilt) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
    }
    addEventListener("scroll", kick, { passive: true });

    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      stage.classList.toggle("hs-paused", !e.isIntersecting);
      if (e.isIntersecting) kick();
    });
    io.observe(hero);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      removeEventListener("scroll", kick);
    };
  }, []);

  return (
    <figure className="hs-figure">
      <div ref={stageRef} className="hs-stage">
        <div className="hs-light" aria-hidden="true" />
        <div className="hs-floor" aria-hidden="true" />
        <div className="hs-enter">
          <div ref={rigRef} className="hs-rig" style={{ ["--max" as string]: `${MAX_TILT}deg` }}>
            <div className="hs-float">
              <div className="hs-layer hs-back" style={{ ["--z" as string]: "-16cqw", ["--d" as string]: "0.45s", ["--p" as string]: "-0.8" }}>
                <div className="hs-win">
                  <div className="hs-chrome" aria-hidden="true">
                    <span className="hs-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="hs-url">Natalino Polato · Mogi Guaçu</span>
                  </div>
                  <img
                    src="/exemplos/advocacia-640.webp"
                    srcSet="/exemplos/advocacia-640.webp 640w, /exemplos/advocacia-960.webp 960w"
                    sizes="(min-width: 1024px) 420px, 60vw"
                    width={1200}
                    height={750}
                    alt="Site do advogado Natalino Polato, de Mogi Guaçu, aberto no navegador"
                    decoding="async"
                    fetchPriority="low"
                    className="hs-shot"
                  />
                </div>
              </div>

              <div className="hs-layer hs-browser" style={{ ["--z" as string]: "0cqw", ["--d" as string]: "0.15s", ["--p" as string]: "0" }}>
                <div className="hs-win">
                  <div className="hs-chrome" aria-hidden="true">
                    <span className="hs-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="hs-url">Star Sorrindo · Poços de Caldas</span>
                  </div>
                  <img
                    src="/exemplos/clinica-1200.webp"
                    srcSet="/exemplos/clinica-640.webp 640w, /exemplos/clinica-960.webp 960w, /exemplos/clinica-1200.webp 1200w"
                    sizes="(min-width: 1024px) 640px, 90vw"
                    width={1200}
                    height={750}
                    alt="Site da Star Sorrindo, clínica de implantes em Poços de Caldas, aberto no navegador"
                    decoding="async"
                    fetchPriority="low"
                    className="hs-shot"
                  />
                  <span className="hs-sheen" aria-hidden="true" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <figcaption className="hs-caption">
        <span className="num">Na tela</span>
        <span>
          Star Sorrindo, clínica em Poços de Caldas <span aria-hidden="true">·</span> ao fundo, Natalino Polato, advocacia
          em Mogi Guaçu
        </span>
      </figcaption>
    </figure>
  );
}
