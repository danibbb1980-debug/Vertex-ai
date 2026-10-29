import { CONFIG } from '../config'

/** Logo original da clínica, exibido sem alterações. */
export function Logo({ tamanho = 64, className = '', prioridade = false }: { tamanho?: number; className?: string; prioridade?: boolean }) {
  return (
    <img
      src={CONFIG.logo.src}
      alt={CONFIG.logo.alt}
      width={CONFIG.logo.largura}
      height={CONFIG.logo.altura}
      decoding="async"
      fetchPriority={prioridade ? 'high' : 'auto'}
      loading={prioridade ? 'eager' : 'lazy'}
      className={`rounded-2xl ${className}`}
      style={{ width: tamanho, height: tamanho }}
    />
  )
}
