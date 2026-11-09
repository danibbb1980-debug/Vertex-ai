/**
 * Reprodução em SVG do logo existente da Dra. Luciana Leão (orquídea, "Centro de Dermatologia",
 * nome em caligrafia e traço curvo), gerada por scripts/gerar-logo.py a partir da arte de
 * referência. Os arquivos ficam em public/marca/ e são carregados como imagem (cache do
 * navegador, sem pesar no JavaScript). Trocar pelos arquivos originais quando forem enviados.
 */
import { ORQUIDEA_D } from './orquideaMarca'

const ALT = 'Centro de Dermatologia Dra. Luciana Leão'

interface LogoProps {
  className?: string
  variante?: 'horizontal' | 'empilhado'
  tom?: 'vinho' | 'claro'
  carregamento?: 'eager' | 'lazy'
}

export function Logo({ className, variante = 'horizontal', tom = 'vinho', carregamento = 'lazy' }: LogoProps) {
  const arquivo = variante === 'horizontal' ? `/marca/logo-horizontal-${tom}.svg` : `/marca/logo-${tom}.svg`
  const [w, h] = variante === 'horizontal' ? [414, 72] : [600, 290]
  return <img src={arquivo} alt={ALT} width={w} height={h} className={className} loading={carregamento} decoding="async" />
}

/** Só a orquídea do logo (preenchida, cor via CSS). */
export function OrquideaMarca({ className }: { className?: string }) {
  return (
    <svg viewBox="16 8 168 120" className={className} aria-hidden="true" fill="currentColor">
      <path d={ORQUIDEA_D} />
    </svg>
  )
}
