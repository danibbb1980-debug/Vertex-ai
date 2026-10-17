/**
 * Corte esquemático de um implante unitário entre dois dentes naturais:
 * coroa, pilar (conexão) e implante no osso. Ilustração didática, em traço
 * técnico — não representa um caso clínico nem um produto específico.
 */
export function ImplantIllustration({ className = "" }: { className?: string }) {
  const threads = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 480 560"
      className={className}
      role="img"
      aria-labelledby="implant-title implant-desc"
    >
      <title id="implant-title">Ilustração de um implante dentário</title>
      <desc id="implant-desc">
        Corte esquemático: a coroa fica acima da gengiva, o pilar faz a conexão e o implante fica no osso, entre dois dentes naturais.
      </desc>
      <defs>
        <pattern id="bone" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#d9cdb8" strokeWidth="1.2" />
        </pattern>
        <linearGradient id="titanium" x1="0" x2="1">
          <stop offset="0" stopColor="#8d97a6" />
          <stop offset="0.45" stopColor="#dfe3e9" />
          <stop offset="1" stopColor="#7d8796" />
        </linearGradient>
        <linearGradient id="enamel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f1ebdf" />
        </linearGradient>
      </defs>

      {/* Osso */}
      <path d="M0 300 C 80 284, 160 296, 240 290 S 400 284, 480 300 V 560 H 0 Z" fill="#efe7d9" />
      <path d="M0 300 C 80 284, 160 296, 240 290 S 400 284, 480 300 V 560 H 0 Z" fill="url(#bone)" />
      {/* Gengiva */}
      <path
        d="M0 250 C 50 238, 90 262, 130 244 C 170 228, 200 262, 240 256 C 280 262, 310 228, 350 244 C 390 262, 430 238, 480 250 V 306 C 400 290, 320 298, 240 296 S 80 290, 0 306 Z"
        fill="#ead4cb"
      />

      {/* Dente natural à esquerda (cortado na borda) */}
      <g stroke="#0e1d36" strokeOpacity="0.35" strokeWidth="1.5">
        <path d="M-20 120 C 10 100, 70 100, 92 124 C 104 160, 100 220, 96 252 L 86 420 C 82 450, 60 452, 56 420 L 40 300 L 20 430 C 14 456, -6 450, -8 420 Z" fill="url(#enamel)" />
        <path d="M500 120 C 470 100, 410 100, 388 124 C 376 160, 380 220, 384 252 L 394 420 C 398 450, 420 452, 424 420 L 440 300 L 460 430 C 466 456, 486 450, 488 420 Z" fill="url(#enamel)" />
      </g>

      {/* Implante */}
      <path d="M212 300 L 268 300 L 262 470 C 258 500, 222 500, 218 470 Z" fill="url(#titanium)" stroke="#5a6372" strokeWidth="1.2" />
      {threads.map((i) => {
        const y = 314 + i * 18;
        const inset = i * 0.7;
        return (
          <path
            key={i}
            d={`M ${207 + inset} ${y} L ${273 - inset} ${y + 8}`}
            stroke="#5a6372"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        );
      })}
      {/* Pilar */}
      <path d="M220 300 L 260 300 L 254 236 L 226 236 Z" fill="#c9ced6" stroke="#5a6372" strokeWidth="1.2" />
      {/* Coroa */}
      <path
        d="M168 132 C 186 112, 214 122, 240 116 C 266 122, 294 112, 312 132 C 324 170, 316 214, 300 244 C 280 258, 200 258, 180 244 C 164 214, 156 170, 168 132 Z"
        fill="url(#enamel)"
        stroke="#0e1d36"
        strokeWidth="1.6"
      />

      {/* Rótulos */}
      <g fontFamily="var(--font-manrope), sans-serif" fontSize="15" fontWeight="600" fill="#0e1d36">
        <line x1="312" y1="150" x2="404" y2="70" stroke="#7a5d2e" strokeWidth="1" />
        <circle cx="312" cy="150" r="3" fill="#7a5d2e" />
        <text x="410" y="66" textAnchor="end" dy="-6">Coroa</text>

        <line x1="256" y1="262" x2="420" y2="214" stroke="#7a5d2e" strokeWidth="1" />
        <circle cx="256" cy="262" r="3" fill="#7a5d2e" />
        <text x="470" y="210" textAnchor="end" dy="-6">Pilar</text>

        <line x1="230" y1="400" x2="90" y2="520" stroke="#7a5d2e" strokeWidth="1" />
        <circle cx="230" cy="400" r="3" fill="#7a5d2e" />
        <text x="10" y="540">Implante</text>

        <text x="330" y="284" textAnchor="middle" fontSize="12" fontWeight="500" fill="#5a6372">gengiva</text>
        <text x="330" y="500" textAnchor="middle" fontSize="12" fontWeight="500" fill="#5a6372">osso</text>
      </g>
    </svg>
  );
}
