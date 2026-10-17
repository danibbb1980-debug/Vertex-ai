"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site-data";

/**
 * Fachada do Google Maps: o iframe (pesado e com cookies de terceiros) só é
 * carregado quando o visitante pede. Mantém o carregamento rápido e evita
 * enviar dados ao Google sem uma ação do usuário.
 */
export function MapEmbed({ className = "" }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-sand ${className}`}>
      {loaded ? (
        <iframe
          src={site.links.mapEmbed}
          title={`Mapa: ${site.name}, ${site.address.street}, ${site.address.city}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
          {/* Mapa estilizado de fundo, puramente decorativo. */}
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 400">
            <rect width="600" height="400" fill="#f2ece2" />
            <g stroke="#e3dbcd" strokeWidth="14" fill="none" strokeLinecap="round">
              <path d="M-20 260 C 120 230, 260 300, 620 210" />
              <path d="M180 -20 C 220 120, 200 260, 260 420" />
              <path d="M420 -20 C 380 140, 460 260, 430 420" />
            </g>
            <g stroke="#e9e1d4" strokeWidth="6" fill="none">
              <path d="M-20 120 H 620" />
              <path d="M-20 340 C 200 320, 400 360, 620 330" />
              <path d="M90 -20 V 420" />
              <path d="M540 -20 V 420" />
            </g>
          </svg>
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold shadow-[0_12px_30px_-10px_rgb(14_29_54/0.6)]">
            <MapPin className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="relative max-w-xs text-sm text-mineral">
            {site.address.street} — {site.address.district}, {site.address.city}
          </p>
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="relative inline-flex min-h-11 items-center rounded-full border border-navy/25 bg-ivory px-5 text-sm font-semibold text-navy transition-colors hover:border-navy"
          >
            Carregar mapa interativo
          </button>
          <p className="relative text-xs text-mineral">O mapa é fornecido pelo Google.</p>
        </div>
      )}
    </div>
  );
}
