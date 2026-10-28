import { CONFIG } from '../config'

/** Logo oficial (recortado do JPG original, sem redesenho). */
export function Logo({ tone = 'dark', className = '', lazy = false }: { tone?: 'dark' | 'light'; className?: string; lazy?: boolean }) {
  return (
    <img
      src={tone === 'dark' ? '/marca/logo-escuro.webp' : '/marca/logo-claro.webp'}
      width={220}
      height={140}
      loading={lazy ? 'lazy' : undefined}
      alt={`${CONFIG.profissional.assinatura}, Odontologia`}
      className={`block h-auto ${className}`}
      decoding="async"
    />
  )
}
