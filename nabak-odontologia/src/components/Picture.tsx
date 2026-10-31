import type { Foto } from '../config'

export const srcSetFoto = (foto: Foto) =>
  `${foto.base}-480.webp 480w, ${foto.base}-800.webp 800w, ${foto.base}-1100.webp 1100w`

export function Picture({
  foto,
  sizes,
  className,
  priority = false,
}: {
  foto: Foto
  sizes: string
  className?: string
  priority?: boolean
}) {
  const h = Math.round((foto.altura * 480) / foto.largura)
  return (
    <img
      src={`${foto.base}-1100.webp`}
      srcSet={srcSetFoto(foto)}
      sizes={sizes}
      alt={foto.alt}
      width={480}
      height={h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
    />
  )
}
