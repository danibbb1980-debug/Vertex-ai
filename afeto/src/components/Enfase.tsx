/** Palavra em ênfase com o traço curvo inspirado no corte em folha do logo. */
export function Enfase({ children }: { children: string }) {
  return (
    <span className="enfase">
      {children}
      <svg className="enfase-traco" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 14 C 60 2, 140 2, 198 10 C 140 8, 70 10, 2 18 Z" fill="currentColor" opacity="0.55" />
      </svg>
    </span>
  )
}

/**
 * Título com uma palavra em ênfase: escreva a palavra entre asteriscos.
 * Ex.: "Cuidar do outro com *respeito*."
 */
export function TituloEnfase({ texto }: { texto: string }) {
  const partes = texto.split(/(\*[^*]+\*)/g).filter(Boolean)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith('*') ? <Enfase key={i}>{p.slice(1, -1)}</Enfase> : <span key={i}>{p}</span>,
      )}
    </>
  )
}
