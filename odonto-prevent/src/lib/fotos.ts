/**
 * Fotos colocadas em ./referencias/fotos/ entram automaticamente no site.
 * Pasta vazia ou inexistente = a seção de fotos não aparece.
 */
const arquivos = import.meta.glob('/referencias/fotos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const FOTOS = Object.entries(arquivos)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([caminho, url]) => {
    const nome = caminho.split('/').pop()!.replace(/\.[a-z]+$/i, '')
    return { url, alt: `${nome.replace(/[-_]+/g, ' ')} - Odonto Prevent, Pouso Alegre` }
  })
