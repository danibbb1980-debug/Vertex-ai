// Gera og.png (1200x630) e apple-touch-icon.png (180x180) a partir do logo em SVG.
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pub = resolve(import.meta.dirname, '../public')
const logo = readFileSync(resolve(pub, 'marca/logo-vinho.svg'), 'utf8')
const interno = logo.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '')

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="g" cx="0.85" cy="0.1" r="0.9"><stop offset="0" stop-color="#E8D5D3"/><stop offset="1" stop-color="#F5F0EA"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="28" y="28" width="1144" height="574" rx="28" fill="none" stroke="#B79BC2" stroke-width="1.5"/>
  <svg x="270" y="92" width="660" height="319" viewBox="0 0 600 290">${interno}</svg>
  <text x="600" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#5A1E33" letter-spacing="1">Dermatologista em Poços de Caldas - MG</text>
  <text x="600" y="548" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#6B4A78" letter-spacing="4">CRM 90524 | RQE 32476</text>
</svg>`
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(resolve(pub, 'og.png'))

const fav = readFileSync(resolve(pub, 'favicon.svg'), 'utf8')
await sharp(Buffer.from(fav), { density: 300 }).resize(180, 180, { fit: 'contain', background: '#F5F0EA' }).flatten({ background: '#F5F0EA' }).png().toFile(resolve(pub, 'apple-touch-icon.png'))
console.log('imagens geradas')
