import { LOGOTIPO_LINHA, LOGOTIPO_TEXTO, MONOGRAMA, PERFIL_RAMO, VB_COMPLETO, VB_LINHA, VB_MARCA } from '../brand/marca';

type Tom = 'ameixa' | 'ouro';
const cor = (t: Tom) => (t === 'ouro' ? 'var(--color-ouro)' : 'var(--color-ameixa)');

/** Logotipo horizontal: emblema + "DRA. ROBERTA MOTTA" em uma linha (cabeçalho). */
export function LogoHorizontal({ tom = 'ameixa', className = '' }: { tom?: Tom; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} style={{ color: cor(tom) }}>
      <svg viewBox={VB_MARCA} className="h-9 w-auto" aria-hidden="true" fill="currentColor">
        <path d={MONOGRAMA} />
        <path d={PERFIL_RAMO} />
      </svg>
      <svg viewBox={VB_LINHA} className="h-[13px] w-auto" aria-hidden="true" fill="currentColor">
        <path d={LOGOTIPO_LINHA} />
      </svg>
    </span>
  );
}

/** Logotipo completo (empilhado), fiel ao original. */
export function LogoCompleto({ tom = 'ouro', className = '' }: { tom?: Tom; className?: string }) {
  return (
    <svg viewBox={VB_COMPLETO} className={className} role="img" aria-label="Dra. Roberta Motta" fill={cor(tom)}>
      <path d={MONOGRAMA} />
      <path d={PERFIL_RAMO} />
      <path d={LOGOTIPO_TEXTO} />
    </svg>
  );
}

/** Monograma só em contorno dourado — usado nos blocos ameixa. */
export function MonogramaContorno({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="214 30 356 236" className={className} aria-hidden="true" fill="none">
      <path d={MONOGRAMA} stroke="var(--color-ouro)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Perfil com ramo em traço fino (moldura gráfica). */
export function PerfilRamo({ className = '', tom = 'ouro' }: { className?: string; tom?: Tom }) {
  return (
    <svg viewBox="134 -2 128 186" className={className} aria-hidden="true" fill={cor(tom)}>
      <path d={PERFIL_RAMO} />
    </svg>
  );
}
