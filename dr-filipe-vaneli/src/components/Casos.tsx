import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { CONFIG, msgAtendimento, waUrl } from "../config";

/** Antes e depois interativo: arraste a régua, use as setas ou toque. Na primeira vez, a régua percorre a imagem sozinha. */
export default function Casos() {
  const casos = CONFIG.casos;
  const [ativo, setAtivo] = useState(0);
  const [pos, setPos] = useState(50);
  const reduz = useReducedMotion();
  const caixa = useRef<HTMLDivElement>(null);
  const visto = useRef(false);
  const arrastando = useRef(false);
  const anim = useRef<ReturnType<typeof animate> | null>(null);

  const varre = () => {
    anim.current?.stop();
    if (reduz) { setPos(50); return; }
    // percorre: tudo "antes" -> quase tudo "depois" -> meio
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    anim.current = animate(0, 1, {
      duration: 2.6,
      ease: "linear",
      onUpdate: (t) => setPos(t < 0.55 ? 100 - 88 * ease(t / 0.55) : 12 + 38 * ease((t - 0.55) / 0.45)),
    });
  };

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visto.current) { visto.current = true; varre(); }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); anim.current?.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const troca = (i: number) => {
    setAtivo(i);
    if (visto.current) varre();
  };

  const moveTo = (clientX: number) => {
    const r = caixa.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  if (!casos.length) return null;
  const c = casos[ativo];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* índice dos casos */}
      <div className="lg:col-span-5 lg:pt-4">
        <p className="ficha-rotulo">Procedimento</p>
        <ul className="mt-4 border-t border-papel/15" role="tablist" aria-label="Escolha o procedimento">
          {casos.map((k, i) => (
            <li key={k.id} className="border-b border-papel/15">
              <button
                role="tab"
                aria-selected={i === ativo}
                aria-controls="painel-caso"
                id={`aba-${k.id}`}
                onClick={() => troca(i)}
                className="group flex w-full items-baseline gap-4 py-3.5 text-left min-h-12"
              >
                <span className={`num text-xs transition-colors ${i === ativo ? "text-latao" : "text-pedra-claro/60"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`display text-[1.65rem] sm:text-3xl transition-all ${i === ativo ? "text-papel italic" : "text-papel/55 group-hover:text-papel/85"}`}>
                  {k.nome}
                </span>
                <span className={`ml-auto h-px self-center bg-latao transition-all duration-500 ${i === ativo ? "w-10" : "w-0"}`} />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-sm text-sm text-pedra-claro">
          Registros publicados pelo {CONFIG.nome}. Cada indicação depende de avaliação médica individual e a resposta ao tratamento varia de pessoa para pessoa.
        </p>
        <a href={waUrl(msgAtendimento(c.nome))} target="_blank" rel="noopener noreferrer" className="btn btn-linha mt-6">
          <span className="tick" /> Agendar avaliação sobre {c.nome.toLowerCase()}
        </a>
      </div>

      {/* comparador */}
      <div className="lg:col-span-7" id="painel-caso" role="tabpanel" aria-labelledby={`aba-${c.id}`}>
        <figure className="mx-auto max-w-[30rem]">
          <div
            ref={caixa}
            className="compare relative aspect-[583/1126] w-full select-none overflow-hidden bg-floresta-2 touch-pan-y"
            onPointerDown={(e) => { anim.current?.stop(); arrastando.current = true; moveTo(e.clientX); (e.target as Element).setPointerCapture?.(e.pointerId); }}
            onPointerMove={(e) => { if (arrastando.current) moveTo(e.clientX); }}
            onPointerUp={() => (arrastando.current = false)}
            onPointerCancel={() => (arrastando.current = false)}
          >
            <img src={c.depois} alt={`Depois: ${c.nome}, ${c.alt}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} decoding="async" />
            <img
              src={c.antes}
              alt={`Antes: ${c.nome}, ${c.alt}`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              draggable={false}
              decoding="async"
            />
            {/* rótulos */}
            <span className="pointer-events-none absolute left-3 top-3 bg-floresta/85 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-papel" style={{ opacity: pos > 14 ? 1 : 0 }}>Antes</span>
            <span className="pointer-events-none absolute right-3 top-3 bg-papel/90 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-floresta" style={{ opacity: pos < 86 ? 1 : 0 }}>Depois</span>
            {/* a régua como divisor */}
            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
              <div className="absolute inset-y-0 -left-px w-[2px] bg-latao" />
              {Array.from({ length: 23 }).map((_, i) => (
                <span key={i} className="absolute left-0 h-px bg-latao" style={{ top: `${(i / 22) * 100}%`, width: i % 5 === 0 ? 12 : 6, opacity: 0.9 }} />
              ))}
              <div className="compare-alca absolute top-1/2 -left-6 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-floresta text-papel">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M9 6 L3 12 L9 18 M15 6 L21 12 L15 18" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(pos)}
              onChange={(e) => { anim.current?.stop(); setPos(Number(e.target.value)); }}
              className="compare-range"
              aria-label={`Comparar antes e depois: ${c.nome}. Use as setas para mover a divisória.`}
              aria-valuetext={`${Math.round(pos)}% antes`}
            />
          </div>
          <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-papel/80">
            <span className="display text-xl italic">{c.nome}</span>
            <span className="num text-xs text-pedra-claro">{String(ativo + 1).padStart(2, "0")} / {String(casos.length).padStart(2, "0")}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
