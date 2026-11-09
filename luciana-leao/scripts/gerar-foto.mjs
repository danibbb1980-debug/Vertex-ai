// Gera as versões web (AVIF e WebP, 3 larguras) da foto sem fundo da Dra. Luciana.
// Fonte: referencias/fotos/dra-luciana-sem-fundo.png (recortada do post do Instagram,
// ampliada 2x com redução de ruído e nitidez, fundo removido com rembg/BiRefNet).
import sharp from 'sharp'
import { resolve } from 'node:path'

const raiz = resolve(import.meta.dirname, '..')
const fonte = resolve(raiz, 'referencias/fotos/dra-luciana-sem-fundo.png')
for (const w of [480, 720, 1000]) {
  const base = sharp(fonte).resize({ width: w })
  await base.clone().avif({ quality: 62, effort: 6 }).toFile(resolve(raiz, `public/fotos/dra-luciana-${w}.avif`))
  await base.clone().webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(resolve(raiz, `public/fotos/dra-luciana-${w}.webp`))
}
console.log('fotos geradas')
