// Gera o HTML estático final: injeta o <head> (SEO) e o HTML da página renderizada.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const { render, head } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)
const file = resolve(root, 'dist/index.html')
let html = readFileSync(file, 'utf8').replace('<!--head-->', head()).replace('<!--app-->', render())
// CSS inline (≈10 KB gzip): remove a requisição que bloqueia a renderização
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = readFileSync(resolve(root, 'dist' + href), 'utf8')
  return `<style>${css}</style>`
})
if (html.includes('localhost')) throw new Error('HTML final contém "localhost"')
writeFileSync(file, html)
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender ok:', (html.length / 1024).toFixed(1), 'KB')
