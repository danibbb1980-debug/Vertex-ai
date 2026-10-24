import { useEffect, useRef } from "react";
import { GLBoundary } from "../lib/webgl";
import { useHeroGL } from "./useHeroGL";

/*
 * Composição do hero: dois navegadores em perspectiva, em planos diferentes,
 * com capturas reais de sites da Vertex (Star Sorrindo à frente, Natalino
 * Polato ao fundo). As capturas entram inteiras, na proporção original.
 *
 * Este mockup em CSS 3D vem pré-renderizado e é sempre o primeiro a aparecer.
 * Em aparelhos capazes, depois do load, entra por cima a cena WebGL (HeroGL),
 * com as cinco capturas em profundidade; o CSS 3D fica como fallback.
 * Movimento: entrada suave, flutuação lenta, inclinação pelo cursor limitada
 * (só desktop com mouse, só dentro do hero) e leve inclinação ao rolar.
 * Com prefers-reduced-motion a composição fica parada.
 */

const MAX_TILT = 4; // graus

export function HeroScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const gl = useHeroGL(stageRef);

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
      <div ref={stageRef} className={`hs-stage${gl.ready ? " hs-gl" : ""}`}>
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
        {gl.Comp && (
          <div className="hs-canvas" aria-hidden="true">
            <GLBoundary key={gl.lite ? "lite" : "full"} onError={gl.fail}>
              <gl.Comp active={gl.visible} lite={gl.lite} still={gl.still} onReady={() => gl.setReady(true)} onFail={gl.fail} />
            </GLBoundary>
          </div>
        )}
      </div>
      <figcaption className="hs-caption">
        <span className="num">Na tela</span>
        {gl.ready ? (
          <span>
            Star Sorrindo, clínica em Poços de Caldas, à frente <span aria-hidden="true">·</span> ao fundo,{" "}
            {gl.lite ? "VIP Shape Academia e Natalino Polato" : "VIP Shape Academia, Natalino Polato, Dra. Beatryz Furlaneto e Rocha"}
          </span>
        ) : (
          <span>
            Star Sorrindo, clínica em Poços de Caldas <span aria-hidden="true">·</span> ao fundo, Natalino Polato, advocacia
            em Mogi Guaçu
          </span>
        )}
      </figcaption>
      {/* Diagnóstico do 3D, só com ?debug3d na URL */}
      {gl.debug && (
        <p className="fixed bottom-3 left-3 z-[70] max-w-[min(92vw,40rem)] rounded border border-gold/40 bg-ink-0/95 px-3 py-2 font-mono text-[11px] leading-snug text-champ">
          {gl.debug}
        </p>
      )}
    </figure>
  );
}
