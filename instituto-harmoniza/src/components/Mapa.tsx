import { useState } from "react";
import { CONFIG } from "../config";

/** Desenho de mapa abstrato (fundo enquanto o mapa real não é carregado). */
export function MapaReservado() {
  return (
    <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="600" height="480" fill="#ece3d5" />
      <g fill="none" stroke="#7a5a2a" strokeOpacity="0.18" strokeWidth="1">
        <path d="M-20 120 C 120 100, 220 160, 360 130 S 560 90, 640 110" />
        <path d="M-20 300 C 140 280, 260 340, 400 300 S 560 260, 640 290" />
        <path d="M150 -20 C 170 120, 130 260, 170 500" />
        <path d="M420 -20 C 400 140, 450 300, 420 500" />
        <path d="M-20 210 L 640 230" strokeOpacity="0.1" />
        <path d="M280 -20 L 300 500" strokeOpacity="0.1" />
      </g>
      <circle cx="300" cy="225" r="42" fill="#b08a4a" fillOpacity="0.12" />
      <circle cx="300" cy="225" r="7" fill="#1d1915" />
    </svg>
  );
}

/**
 * Mapa do Google carregado só quando o visitante pede: nada do Google (nem
 * cookies) é carregado antes do clique, e a página continua leve.
 */
export function MapaInterativo() {
  const [ativo, setAtivo] = useState(false);
  return (
    <div className="relative h-[340px] overflow-hidden rounded-[28px] border border-linha bg-areia md:h-[400px]">
      {ativo ? (
        <iframe
          title={`Mapa: localização do ${CONFIG.nome}, ${CONFIG.endereco.valor}`}
          src={CONFIG.mapaEmbedUrl}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          <MapaReservado />
          <div className="relative flex h-full flex-col items-center justify-center gap-3 p-7 text-center" style={{ ["--halo" as string]: "#ece3d5" }}>
            <p className="font-display text-[1.5rem] leading-tight">
              {CONFIG.enderecoPartes.rua} · {CONFIG.enderecoPartes.bairro}
            </p>
            <button
              type="button"
              onClick={() => setAtivo(true)}
              className="mt-2 inline-flex min-h-12 items-center rounded-full border border-tinta/25 bg-marfim px-6 text-[0.92rem] font-medium transition-colors hover:border-tinta/60"
            >
              Ver mapa interativo
            </button>
            <p className="max-w-[40ch] text-[0.8rem] text-cinza">O mapa é carregado do Google Maps só depois do clique.</p>
          </div>
        </>
      )}
    </div>
  );
}
