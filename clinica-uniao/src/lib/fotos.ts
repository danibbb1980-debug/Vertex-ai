import { CONFIG, type Foto } from '../config'

/**
 * Fotos colocadas em ./referencias/fotos/ entram aqui automaticamente no build.
 * O nome do arquivo vira o texto alternativo (ex.: "recepcao-da-clinica.jpg" -> "Recepção da clínica"
 * sem acentos; para um alt melhor, cadastre a foto em CONFIG.fotos).
 */
const arquivos = import.meta.glob('/referencias/fotos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const daPasta: Foto[] = Object.entries(arquivos)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([caminho, src]) => {
    const base = caminho.split('/').pop()!.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
    return { src, alt: base.charAt(0).toUpperCase() + base.slice(1) }
  })

export const FOTOS: Foto[] = [...CONFIG.fotos, ...daPasta]
