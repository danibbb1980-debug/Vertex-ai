import { CONFIG } from './config'

/**
 * Lê automaticamente as imagens de ./referencias/fotos/.
 * Para adicionar uma foto: coloque o arquivo na pasta e (opcional) alt e legenda em CONFIG.fotos.
 */
const arquivos = import.meta.glob('../referencias/fotos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export type Foto = { src: string; alt: string; legenda: string; nome: string }

export const FOTOS: Foto[] = CONFIG.mostrarFotos
  ? Object.entries(arquivos)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([caminho, src]) => {
        const nome = caminho.split('/').pop()!.replace(/\.[^.]+$/, '')
        const info = CONFIG.fotos[nome]
        return { src, nome, alt: info?.alt ?? `Ambiente da ${CONFIG.nome}.`, legenda: info?.legenda ?? '' }
      })
  : []
