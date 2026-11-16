// Fotos AUTORIZADAS: qualquer imagem colocada em ./referencias/fotos/ entra aqui
// automaticamente no build e é exibida em recorte sóbrio na seção da profissional.
// (Use CONFIG.profissionais[].foto para escolher uma foto específica.)
const glob = import.meta.glob('/referencias/fotos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const FOTOS: string[] = Object.keys(glob)
  .sort()
  .map((k) => glob[k])
