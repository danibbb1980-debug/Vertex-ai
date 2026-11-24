// Gera favicons, apple-touch-icon, ícones do manifest e a imagem de compartilhamento
// a partir dos SVGs em public/marca/. Uso: node scripts/gerar-marca.cjs
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const pub = path.join(__dirname, '..', 'public')
const svg = (n) => fs.readFileSync(path.join(pub, 'marca', n), 'utf8')
const ROSA = '#b5616a' // cor de fundo do logo original
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage()
  const quadrado = async (tam, arquivo, pequeno) => {
    await p.setViewportSize({ width: tam, height: tam })
    const m = svg(pequeno ? 'monograma-pequeno.svg' : 'monograma.svg')
    await p.setContent(`<body style="margin:0;width:${tam}px;height:${tam}px;background:${ROSA};color:#f7f2f1;display:grid;place-items:center">
      <div style="width:${pequeno ? 84 : 68}%;transform:translate(1%,2%)">${m}</div></body>`)
    await p.screenshot({ path: path.join(pub, arquivo) })
  }
  await quadrado(32, 'favicon-32.png', true)
  await quadrado(48, 'favicon-48.png', true)
  await quadrado(180, 'apple-touch-icon.png', false)
  await quadrado(192, 'icon-192.png', false)
  await quadrado(512, 'icon-512.png', false)
  // Open Graph 1200x630
  await p.setViewportSize({ width: 1200, height: 630 })
  await p.setContent(`<body style="margin:0;width:1200px;height:630px;background:${ROSA};color:#f7f2f1;display:grid;place-items:center">
    <div style="width:440px">${svg('logo-completo.svg')}</div></body>`)
  await p.screenshot({ path: path.join(pub, 'marca', 'og-face-doctor-limeira.png') })
  await b.close()
})()
