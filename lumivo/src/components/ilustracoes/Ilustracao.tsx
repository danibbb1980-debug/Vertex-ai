import { useRef } from 'react'
import type { Ilustracao as Tipo } from '../../config'
import { useEmTela } from '../../motion/useEmTela'

/** Micro-ilustrações em CSS puro. Só animam quando visíveis (classe "ativa"). */
export function Ilustracao({ tipo }: { tipo: Tipo }) {
  const ref = useRef<HTMLDivElement>(null)
  const ativa = useEmTela(ref)
  return (
    <div ref={ref} className={`ilu ilu--${tipo} ${ativa ? 'ilu--ativa' : ''}`} aria-hidden="true">
      {tipo === 'toggle' && (
        <span className="ilu-toggle"><span /></span>
      )}
      {tipo === 'switch' && (
        <span className="ilu-slider"><span className="ilu-slider__fill" /><span className="ilu-slider__knob" /></span>
      )}
      {tipo === 'caixas' && (
        <span className="ilu-caixas"><i /><i /><i /></span>
      )}
      {tipo === 'tipografia' && (
        <span className="ilu-tipo">
          <span className="ilu-tipo__pontos"><i /><i /><i /></span>
          <span className="ilu-tipo__aa">Aa</span>
        </span>
      )}
    </div>
  )
}
