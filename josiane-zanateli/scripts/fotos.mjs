// Converte as fotos autorizadas de ./referencias/fotos em WebP/AVIF otimizados em ./public/fotos.
// Uso: npm run fotos
import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'node:fs'
import { join, parse } from 'node:path'

const origem = 'referencias/fotos'
const destino = 'public/fotos'
mkdirSync(destino, { recursive: true })

for (const arquivo of readdirSync(origem)) {
  if (!/\.(png|jpe?g|webp)$/i.test(arquivo)) continue
  const { name } = parse(arquivo)
  for (const largura of [480, 800, 1100]) {
    const base = sharp(join(origem, arquivo)).resize({ width: largura, withoutEnlargement: true })
    await base.clone().avif({ quality: 52 }).toFile(join(destino, `${name}-${largura}.avif`))
    await base.clone().webp({ quality: 78 }).toFile(join(destino, `${name}-${largura}.webp`))
  }
  console.log('ok', name)
}
