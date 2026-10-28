import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { tamanho?: number };
const base = (tamanho = 20): SVGProps<SVGSVGElement> => ({
  width: tamanho,
  height: tamanho,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

export const IconeWhatsApp = ({ tamanho = 20, ...p }: P) => (
  <svg {...base(tamanho)} {...p} fill="currentColor" stroke="none">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
  </svg>
);
export const IconeInstagram = ({ tamanho = 20, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
export const IconeMapa = ({ tamanho = 20, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const IconeRelogio = ({ tamanho = 20, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IconeSeta = ({ tamanho = 18, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconeMais = ({ tamanho = 20, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconeFechar = ({ tamanho = 22, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconeMenu = ({ tamanho = 22, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const IconeCadeira = ({ tamanho = 22, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <circle cx="10" cy="4.5" r="1.6" />
    <path d="M10 7.5v6h5l2.5 5.5" />
    <path d="M10 10.5h4.5" />
    <path d="M7.6 11.2A5.5 5.5 0 1 0 15 18.3" />
  </svg>
);
export const IconeCalendario = ({ tamanho = 22, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const IconeCartao = ({ tamanho = 22, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M2.5 10h19M6.5 15h4" />
  </svg>
);
export const IconePorta = ({ tamanho = 22, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M5 21V8a7 7 0 0 1 14 0v13" />
    <path d="M3 21h18M14.5 13.5v1" />
  </svg>
);
export const IconeBebe = ({ tamanho = 26, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <circle cx="12" cy="12.5" r="7.5" />
    <path d="M12 5c-1.2 0-2 .8-2 1.7 0 .8.6 1.3 1.4 1.3" />
    <circle cx="9.3" cy="12" r="0.5" fill="currentColor" />
    <circle cx="14.7" cy="12" r="0.5" fill="currentColor" />
    <path d="M10 15.3c1.2.9 2.8.9 4 0" />
  </svg>
);
export const IconeCrianca = ({ tamanho = 26, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v6M8 21l4-6 4 6M7 12l5-1.5 5 1.5" />
  </svg>
);
export const IconeMaos = ({ tamanho = 26, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M12 20s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.7 12 20 12 20Z" />
    <path d="M9 12.5h6" />
  </svg>
);
export const IconeGestante = ({ tamanho = 26, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <circle cx="11" cy="4.5" r="2.2" />
    <path d="M10 8c-1.5 1.5-1.5 4 0 5.5M10 8c2.5.3 5.5 2.6 5.5 5.6 0 2-1.5 3.4-3.5 3.4H10v4M10 13.5V21" />
  </svg>
);
export const IconeEscuta = ({ tamanho = 24, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M5 18.5V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8v6.4a2.8 2.8 0 0 1-2.8 2.8H9l-4 2.5Z" />
    <path d="M9 9.5h6M9 12.5h3.5" />
  </svg>
);
export const IconeFolha = ({ tamanho = 24, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
    <path d="M5 19 13 11" />
  </svg>
);
export const IconeCoracao = ({ tamanho = 24, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
  </svg>
);
export const IconeEnviar = ({ tamanho = 20, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />
  </svg>
);
export const IconeCheck = ({ tamanho = 20, ...p }: P) => (
  <svg {...base(tamanho)} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
