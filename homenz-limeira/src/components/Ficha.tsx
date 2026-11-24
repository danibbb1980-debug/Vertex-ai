import { useEffect, useRef, useState } from 'react'
import { atendimentosAtivos } from '../config'
import { useSelecao } from '../estado'
import { mensagemFicha, waLink } from '../lib'
import { Traco } from './Marca'

export function Ficha({ id, compacta = false }: { id: string; compacta?: boolean }) {
  const { sel, alternar, tocou } = useSelecao()
  const itens = atendimentosAtivos()
  const msg = mensagemFicha(sel)
  const [pulso, setPulso] = useState(false)
  const primeira = useRef(true)

  useEffect(() => {
    if (tocou && primeira.current && sel.size > 0) {
      primeira.current = false
      setPulso(true)
      const t = setTimeout(() => setPulso(false), 700)
      return () => clearTimeout(t)
    }
  }, [tocou, sel])

  if (!itens.length) return null

  return (
    <form
      className={`ficha${compacta ? ' ficha-compacta' : ''}`}
      aria-labelledby={`${id}-titulo`}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="ficha-topo">
        <p className="ficha-titulo" id={`${id}-titulo`}>
          Ficha de avaliação
        </p>
        <p className="ficha-instrucao">Marque o que lhe interessa</p>
      </div>
      <fieldset className="ficha-linhas">
        <legend className="sr-only">Áreas de interesse para a avaliação</legend>
        {itens.map((a, i) => {
          const marcado = sel.has(a.area)
          return (
            <label
              key={a.id}
              className={`ficha-linha${marcado ? ' marcada' : ''}`}
              style={{ ['--i' as string]: i }}
              htmlFor={`${id}-${a.area}`}
            >
              <input
                id={`${id}-${a.area}`}
                type="checkbox"
                className="ficha-input"
                checked={marcado}
                onChange={(e) => alternar(a.area, e.target.checked)}
              />
              <span className="caixa" aria-hidden="true">
                <Traco />
              </span>
              <span className="ficha-nome">
                <span className="ficha-area">{a.rotulo}</span>
                {!compacta && a.nome !== a.rotulo && <span className="ficha-sub">{a.nome}</span>}
              </span>
              <span className="ficha-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </label>
          )
        })}
      </fieldset>
      <div className="ficha-rodape">
        <p className="ficha-msg" aria-live="polite">
          <span className="ficha-msg-rotulo">Sua mensagem</span>
          <span className="ficha-msg-texto">“{msg}”</span>
        </p>
        <a
          className={`botao botao-cheio ficha-botao${pulso ? ' pulso' : ''}`}
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Agendar avaliação
          <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
        </a>
      </div>
    </form>
  )
}
