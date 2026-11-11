import { useEffect, useRef, useState } from "react";

/**
 * A forma que respira: o único movimento contínuo do site.
 * Expande e contrai em 6 s (só transform/opacity), pausa fora da tela
 * e fica parada com prefers-reduced-motion (ver index.css).
 */
export function Respira({
  className = "",
  tom = "claro",
  aneis = true,
}: {
  className?: string;
  tom?: "claro" | "escuro";
  aneis?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setPausado(!e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const escuro = tom === "escuro";
  return (
    <div ref={ref} data-pausado={pausado} aria-hidden="true" className={`relative aspect-square ${className}`}>
      {aneis && (
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" fill="none">
          {[198, 168, 138].map((r, i) => (
            <circle
              key={r}
              cx="200"
              cy="200"
              r={r}
              stroke={escuro ? "rgba(157,192,227,.28)" : "#cddbeb"}
              strokeWidth="1"
              strokeDasharray={i === 0 ? "2 6" : undefined}
            />
          ))}
        </svg>
      )}
      <div
        className="respira-halo absolute inset-[12%] rounded-full"
        style={{ background: escuro ? "rgba(157,192,227,.12)" : "#e6eef8" }}
      />
      <div
        className="respira absolute inset-[22%] rounded-full"
        style={{
          background: escuro
            ? "#1f5fa8"
            : "#1f5fa8",
        }}
      />
    </div>
  );
}

/** Versão mínima, ao lado do botão de agendar. */
export function RespiraPonto({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative inline-block h-3 w-3 ${className}`}>
      <span className="respira-halo absolute inset-[-6px] rounded-full bg-tint" />
      <span className="respira absolute inset-0 rounded-full bg-brand" />
    </span>
  );
}
