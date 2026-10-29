// Gera o HTML da página no build (pré-render), para o conteúdo aparecer antes do JavaScript.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { render } = await import(pathToFileURL(resolve(raiz, '.ssr/entry-server.js')).href)
const arquivo = resolve(raiz, 'dist/index.html')
const html = readFileSync(arquivo, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('div#root não encontrada')

// sem JavaScript, elementos que entrariam com animação aparecem direto
const semJs = '<noscript><style>[data-anim]{opacity:1!important;transform:none!important}</style></noscript>'
// o HTML já vem pronto; o JS (hidratação) roda quando o navegador fica livre após o carregamento,
// para não competir com a primeira pintura no celular
const tag = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
if (!tag) throw new Error('script principal não encontrado')
const loader =
  `<script>(function(){var f=0;function go(){if(f)return;f=1;var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src='${tag[1]}';document.head.appendChild(s)}` +
  `function idle(){(window.requestIdleCallback||function(c){setTimeout(c,1)})(go,{timeout:800})}` +
  `['pointerdown','keydown','touchstart','scroll'].forEach(function(e){addEventListener(e,go,{once:true,passive:true})});` +
  `if(document.readyState==='complete')idle();else addEventListener('load',idle)})()</script>`

const final = html
  .replace(tag[0], loader)
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
  .replace('</head>', `${semJs}\n  </head>`)
writeFileSync(arquivo, final)
rmSync(resolve(raiz, '.ssr'), { recursive: true, force: true })
console.log('pré-render ok:', (final.length / 1024).toFixed(1), 'KB')
