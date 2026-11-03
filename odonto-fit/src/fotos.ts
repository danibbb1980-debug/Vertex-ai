/** Fotos colocadas em ./referencias/fotos/ aparecem sozinhas na galeria (ordem alfabética). */
const arquivos = import.meta.glob('/referencias/fotos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const FOTOS = Object.keys(arquivos)
  .sort()
  .map((caminho) => ({
    src: arquivos[caminho],
    alt: `Ambiente da clínica Odonto Fit, ${caminho.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')}`,
  }))
