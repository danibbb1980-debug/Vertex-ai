import { CONFIG } from "../config";

type Props = { tom: "ouro" | "grafite"; className?: string; titulo?: boolean };

/**
 * Logotipo recriado em SVG a partir da referência (serifa fina em caixa-alta, tracking largo,
 * descritor em sans fina espaçada). Se CONFIG.logo tiver o arquivo original, ele é usado.
 */
export function Logo({ tom, className = "" }: Props) {
  const original = tom === "ouro" ? CONFIG.logo.escuro : CONFIG.logo.claro;
  const rotulo = `${CONFIG.nome}, ${CONFIG.descritor}`;
  if (original) return <img src={original} alt={rotulo} className={className} />;
  const cor = tom === "ouro" ? "#B19C71" : "#2A241F";
  return (
    <svg viewBox="0 0 320 62" className={className} role="img" aria-label={rotulo}>
      <text
        x="160"
        y="36"
        textAnchor="middle"
        fill={cor}
        textLength="312"
        lengthAdjust="spacing"
        style={{
          fontFamily: '"Newsreader", Georgia, serif',
          fontSize: "38px",
          fontWeight: 250,
        }}
      >
        {CONFIG.nome.toUpperCase()}
      </text>
      <text
        x="160"
        y="58"
        textAnchor="middle"
        fill={cor}
        textLength="306"
        lengthAdjust="spacing"
        style={{ fontFamily: '"Hanken Grotesk", system-ui, sans-serif', fontSize: "11.5px", fontWeight: 400 }}
      >
        {CONFIG.descritor.toUpperCase()}
      </text>
    </svg>
  );
}
