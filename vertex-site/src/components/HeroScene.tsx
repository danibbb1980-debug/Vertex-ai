import { useEffect, useRef } from "react";

/*
 * Composição do hero: um navegador em perspectiva mostrando o rascunho de um
 * site, com camadas em profundidades diferentes (versão no celular, cartão de
 * tipografia e paleta, aviso de rascunho pronto).
 *
 * Feito em CSS 3D: o texto da interface fica nítido, não há download extra e o
 * custo por quadro é só a mudança de transform. Tudo é decorativo (aria-hidden);
 * o conteúdo comercial do hero continua em HTML ao lado.
 *
 * Movimento: entrada em CSS, flutuação lenta em CSS, inclinação pelo cursor
 * (só desktop com mouse, só dentro do hero, no máximo ~5°) e uma leve
 * inclinação extra ao rolar. Com prefers-reduced-motion nada disso roda.
 */

const MAX_TILT = 5; // graus

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
      // Interpolação suave, sem saltos
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
      // Normaliza pela área da composição, limitado a [-1, 1]
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

    // Pausa a flutuação e o loop quando o hero sai da tela
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
    <div ref={stageRef} className="hs-stage" aria-hidden="true">
      <div className="hs-glow" />
      <div className="hs-floor" />
      <div className="hs-enter">
        <div ref={rigRef} className="hs-rig" style={{ ["--max" as string]: `${MAX_TILT}deg` }}>
          <div className="hs-float">
            {/* Plano 0: navegador com o rascunho */}
            <div className="hs-layer hs-browser" style={{ ["--z" as string]: "0px", ["--d" as string]: "0.15s", ["--p" as string]: "0" }}>
              <Browser />
            </div>

            {/* Plano frontal: versão no celular */}
            <div className="hs-layer hs-phone" style={{ ["--z" as string]: "16cqw", ["--d" as string]: "0.55s", ["--p" as string]: "1" }}>
              <Phone />
            </div>

            {/* Plano frontal: decisões de design (tipografia e paleta) */}
            <div className="hs-layer hs-spec" style={{ ["--z" as string]: "23cqw", ["--d" as string]: "0.75s", ["--p" as string]: "1.4" }}>
              <Spec />
            </div>

            {/* Plano frontal: aviso de rascunho pronto */}
            <div className="hs-layer hs-toast" style={{ ["--z" as string]: "29cqw", ["--d" as string]: "0.95s", ["--p" as string]: "1.7" }}>
              <span className="hs-toast-dot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <span>
                <b>Rascunho pronto</b>
                <i>Aguardando sua revisão</i>
              </span>
            </div>

            {/* Marca técnica discreta num plano de fundo */}
            <span className="hs-layer hs-mark hs-mark-a" style={{ ["--z" as string]: "-11cqw", ["--d" as string]: "1.1s", ["--p" as string]: "0.6" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Browser() {
  return (
    <div className="hs-win">
      <div className="hs-chrome">
        <span className="hs-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="hs-url">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          suaempresa.com.br
        </span>
        <span className="hs-draft">Rascunho</span>
      </div>

      <div className="hs-site">
        <div className="hs-nav">
          <span className="hs-brand">
            <em>Sua</em> Empresa
          </span>
          <span className="hs-links">
            <span>Sobre</span>
            <span>Serviços</span>
            <span>Contato</span>
          </span>
          <span className="hs-navbtn">WhatsApp</span>
        </div>

        <div className="hs-hero">
          <div className="hs-copy">
            <span className="hs-eyebrow">Poços de Caldas · MG</span>
            <span className="hs-h">
              Seu negócio, do jeito que ele <em>merece</em> ser visto.
              {/* Moldura de seleção, como numa ferramenta de design */}
              <span className="hs-select">
                <i />
                <i />
                <i />
                <i />
                <b>H1 · Instrument Serif</b>
              </span>
            </span>
            <span className="hs-p">Atendimento próximo, informações claras e contato direto pelo WhatsApp.</span>
            <span className="hs-ctas">
              <span className="hs-btn">Agendar pelo WhatsApp</span>
              <span className="hs-btn2">Ver serviços</span>
            </span>
          </div>
          <div className="hs-photo">
            <span className="hs-sun" />
            <span className="hs-window" />
            <span className="hs-plant" />
          </div>
        </div>

        <div className="hs-cards">
          {[
            ["Atendimento", "Seg a sáb"],
            ["Serviços", "Tudo explicado"],
            ["Localização", "Como chegar"],
          ].map(([t, d], i) => (
            <span key={t} className="hs-card">
              <span className={`hs-ico hs-ico-${i}`} />
              <b>{t}</b>
              <i>{d}</i>
            </span>
          ))}
        </div>
      </div>
      <span className="hs-sheen" />
    </div>
  );
}

function Phone() {
  return (
    <div className="hs-ph">
      <span className="hs-notch" />
      <div className="hs-ph-site">
        <span className="hs-ph-nav">
          <span className="hs-brand">
            <em>Sua</em> Empresa
          </span>
          <span className="hs-burger" />
        </span>
        <span className="hs-ph-photo">
          <span className="hs-sun" />
          <span className="hs-window" />
        </span>
        <span className="hs-ph-h">
          Seu negócio, do jeito que ele <em>merece</em>.
        </span>
        <span className="hs-ph-line" />
        <span className="hs-ph-line short" />
        <span className="hs-ph-btn">WhatsApp</span>
      </div>
      <span className="hs-sheen" />
    </div>
  );
}

function Spec() {
  return (
    <div className="hs-spec-card">
      <span className="hs-spec-label">Tipografia</span>
      <span className="hs-spec-type">
        <span className="hs-aa">Aa</span>
        <span className="hs-fonts">
          <b>Instrument Serif</b>
          <i>Outfit</i>
        </span>
      </span>
      <span className="hs-rule" />
      <span className="hs-spec-label">Paleta</span>
      <span className="hs-swatches">
        <i style={{ background: "#f4efe6" }} />
        <i style={{ background: "#2f4a43" }} />
        <i style={{ background: "#c8a77c" }} />
        <i style={{ background: "#1c1f22" }} />
      </span>
    </div>
  );
}
