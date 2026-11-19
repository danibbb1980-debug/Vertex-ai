import { useEffect, useRef } from "react";

/**
 * O prumo: fio dourado preso no topo da página, com um peso na ponta.
 * Ao carregar, oscila como um pêndulo amortecido e assenta na vertical.
 * Ao rolar, o fio se estende pela página (variável CSS --len).
 * Anima apenas transform e a altura do fio; sem filtros.
 */
export function Prumo() {
  const camada = useRef<HTMLDivElement>(null);
  const pendulo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = camada.current;
    const pend = pendulo.current;
    if (!el || !pend) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const PIVO = 0; // o fio nasce no topo da camada (que começa logo abaixo do cabeçalho)
    let L0 = 0;
    let maximo = 0;

    const medir = () => {
      const hero = document.getElementById("inicio");
      const alturaHero = hero ? hero.offsetHeight : window.innerHeight;
      L0 = Math.max(220, Math.min(alturaHero * 0.72, window.innerHeight * 0.66));
      maximo = Math.max(L0, el.offsetHeight - PIVO - 24);
      atualizar();
    };

    const atualizar = () => {
      let len: number;
      if (reduzido) len = maximo;
      else {
        const rolavel = document.documentElement.scrollHeight - window.innerHeight;
        const p = rolavel > 0 ? Math.min(1, Math.max(0, window.scrollY / rolavel)) : 0;
        len = L0 + (maximo - L0) * p;
      }
      el.style.setProperty("--len", `${len.toFixed(1)}px`);
    };

    let pendente = false;
    const aoRolar = () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(() => {
        pendente = false;
        atualizar();
      });
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", medir);

    // oscilação inicial
    let raf = 0;
    if (!reduzido) {
      const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter")) || 20;
      const conteudo = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--conteudo")) || 44;
      // folga lateral: o peso nunca cruza o texto nem sai da tela
      const folga = Math.min(gutter - 6, conteudo - gutter - 10);
      const amp = Math.min(7, (Math.atan(folga / L0) * 180) / Math.PI);
      const periodo = 1.15; // s
      const tau = 0.62; // amortecimento: ~2,5 s até assentar
      const duracao = 2.6;
      let inicio = 0;
      const passo = (t: number) => {
        if (!inicio) inicio = t;
        const s = (t - inicio) / 1000;
        if (s >= duracao) {
          pend.style.transform = "rotate(0deg)";
          return;
        }
        const ang = amp * Math.exp(-s / tau) * Math.cos((2 * Math.PI * s) / periodo);
        pend.style.transform = `rotate(${ang.toFixed(3)}deg)`;
        raf = requestAnimationFrame(passo);
      };
      const atraso = window.setTimeout(() => (raf = requestAnimationFrame(passo)), 250);
      pend.style.transform = `rotate(${amp}deg)`;
      return () => {
        window.clearTimeout(atraso);
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("scroll", aoRolar);
        window.removeEventListener("resize", medir);
      };
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", medir);
    };
  }, []);

  return (
    <div
      ref={camada}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-20 w-0"
      style={{ left: "var(--gutter)", ["--len" as string]: "60vh" }}
    >
      {/* gancho */}
      <span className="absolute -left-[7px] top-0 block h-px w-[15px] bg-ouro" />
      <div ref={pendulo} className="absolute left-0 top-0 origin-top will-change-transform">
        <span className="absolute -left-px top-0 block w-[2px] bg-ouro" style={{ height: "var(--len)" }} />
        <span
          className="absolute -left-[8px] block"
          style={{ top: "var(--len)" }}
        >
          {/* peso: pequena gota em forma de prumo */}
          <svg width="18" height="28" viewBox="0 0 13 20" className="block">
            <path d="M6.5 0 L6.5 3 M2 3 H11 L6.5 19 Z" fill="#B39257" stroke="#B39257" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/** Marcador de seção pendurado no fio: tick + numeral romano. Ativa ao entrar na viewport. */
export function MarcaSecao({ numeral, escuro = false }: { numeral: string; escuro?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.ativo = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.ativo = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="marca-secao group absolute left-0 top-0 h-0 w-full" data-ativo="false">
      <span
        className="absolute top-0 block h-px w-[17px] origin-left scale-x-0 bg-ouro transition-transform duration-700 ease-out group-data-[ativo=true]:scale-x-100"
        style={{ left: "calc(var(--gutter) - 8px)" }}
      />
      <span
        className={`romano absolute -top-[11px] hidden opacity-0 transition-opacity delay-200 duration-700 group-data-[ativo=true]:opacity-100 md:block ${
          escuro ? "text-ouro-claro" : "text-ouro-texto"
        }`}
        style={{ left: "calc(var(--gutter) + 18px)" }}
      >
        {numeral}
      </span>
    </div>
  );
}
