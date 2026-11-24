import { useEffect, useRef, useState } from "react";
import { escala } from "../tempo";

/**
 * Trilho do dia (desktop largo): uma régua vertical de 08 a 21 presa à lateral.
 * A marca em ocre desce conforme a página "anoitece". Só transform.
 */
export default function Trilho() {
  const { ini, fim } = escala();
  const marca = useRef<HTMLDivElement>(null);
  const [hora, setHora] = useState(ini);

  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (marca.current) marca.current.style.transform = `translateY(${p * 100}%)`;
      setHora(Math.round((ini + p * (fim - ini)) * 4) / 4);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [ini, fim]);

  const hh = Math.floor(hora);
  const mm = Math.round((hora - hh) * 60);
  const total = fim - ini;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-16 left-3 top-[136px] z-20 hidden w-11 min-[1340px]:block">
      {/* régua: difference faz o traço aparecer claro no escuro e escuro no claro */}
      <div className="absolute inset-y-0 left-2 w-3 mix-blend-difference">
        <div className="absolute inset-y-0 left-0 w-px bg-[#d9d3c8]" />
        {Array.from({ length: total * 4 + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 h-px bg-[#d9d3c8]"
            style={{ top: `${(i / (total * 4)) * 100}%`, width: i % 4 === 0 ? 12 : 5, opacity: i % 4 === 0 ? 1 : 0.55 }}
          />
        ))}
      </div>
      <div ref={marca} className="absolute inset-x-0 top-0 h-full will-change-transform">
        <div className="absolute -top-[3px] left-[5px] flex items-center gap-1.5">
          <span className="block size-[7px] rounded-full bg-ocre" />
          <span className="tab bg-[#1b2e39] px-1 py-px text-[10px] font-medium text-[#e2ac6c]">
            {String(hh).padStart(2, "0")}
            {mm ? `:${String(mm).padStart(2, "0")}` : "h"}
          </span>
        </div>
      </div>
    </div>
  );
}
