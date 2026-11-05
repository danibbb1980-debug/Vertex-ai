import { CONFIG } from "../config";

/** Recortes do logo original (glifo + nome), sem redesenho. */
export function Logo({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const h = size === "lg" ? 56 : 42;
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img src="/img/logo-glifo.webp" alt="" width={(h * 140) / 200} height={h} className="shrink-0" style={{ height: h, width: "auto" }} />
      <img
        src="/img/logo-nome.webp"
        alt={CONFIG.nome}
        width={(h * 0.72 * 484) / 100}
        height={h * 0.72}
        style={{ height: h * 0.72, width: "auto" }}
      />
    </span>
  );
}
