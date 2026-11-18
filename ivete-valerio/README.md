# Ivete Valério Estética (rascunho)

Site de uma página da Ivete Valério Estética, Varginha - MG. Vite + React + TypeScript + Tailwind 4.
Estático, sem backend, sem cookies, sem analytics. O formulário só monta uma mensagem e abre o WhatsApp.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (HTML pré-renderizado, CSS embutido)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Editar o conteúdo: `src/config.ts`

Tudo o que aparece no site sai daqui. **Campo vazio = o bloco não aparece** (sem placeholders).

| O que | Onde |
|---|---|
| Ligar/desligar seções | `CONFIG.secoes` (`true`/`false`) |
| Desligar o rascunho (faixa + noindex) | `CONFIG.rascunho = false`; depois apague `public/robots.txt`, `public/_headers` e o bloco `headers` de `vercel.json` |
| URL pública (canonical, og:url, og:image) | `CONFIG.siteUrl` |
| Serviços | `CONFIG.servicos`: cada categoria tem `nome`, uma `frase` e a lista `itens`. Nova categoria = novo objeto; o acordeão, o formulário e os botões crescem sozinhos |
| Horário em horas | `CONFIG.horarios.dias[n].inicio` e `.fim` (ex.: `'09:00'`, `'18:00'`). Vazios = só os dias aparecem |
| Dias de atendimento | `aberto` em cada dia e `diasJs` (0 = domingo) para o calendário do formulário |
| Sobre | `CONFIG.sobre` (vazio = seção e link do menu somem) |
| WhatsApp, e-mail, Instagram | `CONFIG.whatsapp`, `CONFIG.email`, `CONFIG.instagram` |

## Fotos

A foto do hero (`public/img/ivete-*.webp|jpg`) é a que a cliente enviou, recortada e com a saturação levemente reduzida.
Para trocar: coloque a nova foto autorizada em `public/img/`, gere as versões de 480 e 800 px de largura (4:5) e
ajuste `CONFIG.fotos.retrato`. Para tirar a foto: `retrato: null` (o hero vira só tipografia; apague também os dois
`<link rel="preload" as="image">` de `index.html`). Também atualize `public/img/og.jpg` (1200×630).

## Logo

Criado do zero: não existe arquivo original. Arquivos: `public/brand/logo-cacau.svg` (fundo claro),
`public/brand/logo-cru.svg` (fundo escuro), `public/favicon.svg`. Gerados por `python3 scripts/gerar-logo.py`
(precisa de `pip install fonttools brotli`). Para usar um logo definitivo, troque os arquivos ou os caminhos em `CONFIG.logo`.

## A linha

`src/components/LinhaAssinatura.tsx`. Lê âncoras do DOM: `data-linha="sobrancelha"` (arco inicial),
`data-linha-borda` (seções onde cruza), `data-linha="laco"` (laço final) e `data-linha-escuro` (áreas onde fica clara).
Com `prefers-reduced-motion` ela aparece já desenhada.

## Publicar

`vercel deploy --prod --yes` dentro desta pasta (projeto `ivete-valerio-estetica-rascunho`). O `vercel.json` já define
build, saída e o cabeçalho `X-Robots-Tag: noindex, nofollow`. Para Netlify/Cloudflare Pages, o `dist/_headers` faz o mesmo.

## Falta confirmar antes da versão definitiva

- Se a **terça-feira** é mesmo dia fechado (aparecia cortada no print do Google).
- **Horários de início e fim** de cada dia.
- Grafia do nome e o título profissional ("Esteticista").
- A lista real de serviços (ventosa e Reiki ficaram de fora de propósito).
- Autorização formal de uso da foto e, se houver, outras fotos.
- Logo definitivo (o atual foi criado para o rascunho).
- URL definitiva em `CONFIG.siteUrl` (hoje aponta para `ivete-valerio-estetica-rascunho.vercel.app`).
