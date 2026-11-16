// Pós-build: injeta o HTML pré-renderizado em dist/index.html e coloca o CSS inline (sem bloqueio de renderização).
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const ssrDir = resolve('dist-ssr')
const entrada = readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f))
const { render } = await import(pathToFileURL(resolve(ssrDir, entrada)).href)
let html = readFileSync('dist/index.html', 'utf8')
if (!html.includes('<!--APP-->')) throw new Error('marcador <!--APP--> não encontrado')
html = html.replace('<!--APP-->', render())
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync('dist' + href, 'utf8')
  return `<style>${css}</style>`
})
if (/localhost/.test(html)) throw new Error('"localhost" encontrado no HTML final')
writeFileSync('dist/index.html', html)
rmSync(ssrDir, { recursive: true, force: true })
console.log('pré-renderização ok:', Math.round(html.length / 1024), 'KB')
