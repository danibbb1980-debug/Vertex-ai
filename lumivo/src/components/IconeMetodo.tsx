import type { IconeMetodo as Tipo } from '../config'

/** Ícones desenhados à mão; a animação toca uma vez quando o passo recebe a classe "ativo". */
export function IconeMetodo({ tipo }: { tipo: Tipo }) {
  return (
    <svg className={`icone icone--${tipo}`} viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false">
      {tipo === 'conversa' && (
        <>
          <rect className="ic-balao1" x="6" y="10" width="34" height="18" rx="9" />
          <rect className="ic-balao2" x="22" y="34" width="36" height="18" rx="9" />
          <circle className="ic-ponto" cx="32" cy="43" r="2.2" />
          <circle className="ic-ponto" cx="40" cy="43" r="2.2" />
          <circle className="ic-ponto" cx="48" cy="43" r="2.2" />
        </>
      )}
      {tipo === 'rascunho' && (
        <>
          <rect className="ic-quadro" x="8" y="8" width="48" height="48" rx="6" />
          <rect className="ic-caixa ic-caixa1" x="14" y="14" width="36" height="10" rx="2" />
          <rect className="ic-caixa ic-caixa2" x="14" y="28" width="16" height="22" rx="2" />
          <rect className="ic-caixa ic-caixa3" x="34" y="28" width="16" height="22" rx="2" />
        </>
      )}
      {tipo === 'ajustes' && (
        <>
          <line className="ic-trilho" x1="10" y1="22" x2="54" y2="22" />
          <line className="ic-trilho" x1="10" y1="42" x2="54" y2="42" />
          <circle className="ic-knob ic-knob1" cx="20" cy="22" r="6" />
          <circle className="ic-knob ic-knob2" cx="44" cy="42" r="6" />
        </>
      )}
      {tipo === 'publicacao' && (
        <>
          <circle className="ic-circulo" cx="32" cy="32" r="22" pathLength="1" />
          <path className="ic-check" d="M22 32.5 29 39.5 43 25" pathLength="1" />
        </>
      )}
    </svg>
  )
}
