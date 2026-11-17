import { useEffect, useRef, useState } from "react";

export type Capitulo = { id: string; num: string; rotulo: string };

/**
 * A régua: escala graduada fixa (lateral no desktop, barra sob o header no celular).
 * Um marcador desliza com a rolagem e o rótulo mostra o capítulo atual.
 */
export default function Regua({ capitulos }: { capitulos: Capitulo[] }) {
  const [atual, setAtual] = useState<Capitulo | null>(null);
  const [escuro, setEscuro] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const atualiza = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      raiz.current?.style.setProperty("--p", p.toFixed(4));
      // tom: a seção sob o meio da régua
      const y = innerHeight / 2;
      const el = document.elementsFromPoint(innerWidth / 2, y).find((n) => (n as HTMLElement).dataset?.tom);
      setEscuro((el as HTMLElement | undefined)?.dataset.tom === "escuro");
      // capítulo: o último cujo topo passou de 40% da tela
      let c: Capitulo | null = null;
      for (const cap of capitulos) {
        const s = document.getElementById(cap.id);
        if (s && s.getBoundingClientRect().top < innerHeight * 0.4) c = cap;
      }
      setAtual(c);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(atualiza); };
    atualiza();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [capitulos]);

  const idx = atual ? capitulos.indexOf(atual) : -1;
  const ticks = 60;
  const cor = escuro ? "#f4f0e6" : "#16211b";
  const latao = escuro ? "#b39553" : "#8a7034";

  return (
    <div ref={raiz} aria-hidden="true" style={{ ["--p" as string]: 0 }}>
      {/* desktop: régua vertical na margem esquerda */}
      <div className="fixed left-0 top-0 bottom-0 z-30 hidden w-14 lg:block transition-colors duration-500" style={{ color: cor }}>
        <div className="absolute left-0 top-24 bottom-10 w-full">
          {Array.from({ length: ticks + 1 }).map((_, i) => {
            const grande = i % 10 === 0;
            const meio = i % 5 === 0;
            return (
              <span
                key={i}
                className="tick-hero absolute left-0 h-px"
                style={{
                  top: `${(i / ticks) * 100}%`,
                  width: grande ? 22 : meio ? 14 : 8,
                  background: "currentColor",
                  opacity: 0.28,
                  animationDelay: `${300 + i * 18}ms`,
                }}
              />
            );
          })}
          {/* ticks já percorridos, em tom pleno */}
          <span className="absolute inset-0" style={{ clipPath: "inset(0 0 calc((1 - var(--p)) * 100%) 0)" }}>
            {Array.from({ length: ticks + 1 }).map((_, i) => (
              <span key={i} className="absolute left-0 h-px bg-current" style={{ top: `${(i / ticks) * 100}%`, width: i % 10 === 0 ? 22 : i % 5 === 0 ? 14 : 8 }} />
            ))}
          </span>
          {/* trilha percorrida */}
          <span
            className="absolute left-0 top-0 w-px origin-top"
            style={{ height: "100%", background: latao, transform: "scaleY(var(--p))" }}
          />
          {/* marcador */}
          <span
            className="absolute left-0 flex items-center"
            style={{ top: 0, transform: "translateY(calc(var(--p) * (100vh - 8.5rem)))", willChange: "transform" }}
          >
            <span className="block h-[2px] w-9" style={{ background: latao }} />
            <span className={`absolute left-7 ${idx >= capitulos.length - 3 ? "bottom-2" : "top-2"} whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.16em]`} style={{ color: escuro ? "#e6dcc4" : "#75602c", writingMode: "vertical-rl" }}>
              {atual ? `${atual.num} ${atual.rotulo}` : ""}
            </span>
          </span>
        </div>
        {/* números dos capítulos ao pé */}
        <ol className="absolute bottom-3 left-2 flex flex-col gap-0.5 font-mono text-[0.55rem]">
          {capitulos.map((c, i) => (
            <li key={c.id} style={{ opacity: i <= idx ? 1 : 0.35, color: i === idx ? latao : undefined }}>{c.num}</li>
          ))}
        </ol>
      </div>

      {/* celular: barra fina horizontal sob o header */}
      <div className="fixed inset-x-0 top-[5.35rem] z-30 lg:hidden">
        <div className="relative h-2 bg-papel/90 backdrop-blur-sm" style={{ color: "#16211b" }}>
          {Array.from({ length: 41 }).map((_, i) => (
            <span key={i} className="absolute bottom-0 w-px bg-current" style={{ left: `${(i / 40) * 100}%`, height: i % 10 === 0 ? 8 : i % 5 === 0 ? 5 : 3, opacity: 0.3 }} />
          ))}
          <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left" style={{ background: "#8a7034", transform: "scaleX(var(--p))" }} />
        </div>
        {atual && (
          <span className="absolute right-3 top-2.5 bg-papel/95 px-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-latao-tinta">
            {atual.num} {atual.rotulo}
          </span>
        )}
      </div>
    </div>
  );
}
