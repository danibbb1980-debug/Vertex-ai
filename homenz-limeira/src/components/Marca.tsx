/** Traço de marcação: desenhado como um risco de caneta. */
export function Traco() {
  return (
    <svg className="traco" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 12.8 L9.6 17.6 L19.8 6.2" pathLength={1} />
    </svg>
  )
}

/** Número de seção com o quadradinho que se desenha ao entrar na tela. */
export function NumSecao({ n, rotulo, claro = false }: { n: string; rotulo: string; claro?: boolean }) {
  return (
    <p className={`num-secao${claro ? ' sobre-azul' : ''}`} data-io>
      <span className="num-caixa" aria-hidden="true">
        <Traco />
      </span>
      <span className="num-n">{n}</span>
      <span className="num-rotulo">{rotulo}</span>
    </p>
  )
}

export function Logo({ tamanho = 56, carregar = 'eager' }: { tamanho?: number; carregar?: 'eager' | 'lazy' }) {
  const src = tamanho > 56 ? '/logo-192.png' : '/logo-88.png'
  return (
    <span className="marca">
      <img
        className="marca-quadro"
        src={src}
        width={tamanho}
        height={tamanho}
        alt=""
        loading={carregar}
        decoding="async"
      />
      <span className="marca-nome">
        <span className="marca-homenz">Homenz</span>
        <span className="marca-cidade">Limeira</span>
      </span>
    </span>
  )
}
