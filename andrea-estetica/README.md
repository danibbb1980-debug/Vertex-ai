# Andrea · Estética e bem-estar (rascunho)

Site de página única para Andrea, estética e bem-estar em Pirassununga - SP.
Vite + React + TypeScript + Tailwind 4. Estático, sem backend, sem analytics, sem cookies.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/
npm run preview   # serve o dist em http://localhost:4173
```

## Editar o conteúdo: `src/config.ts`

Todos os dados ficam lá. **Campo vazio = o bloco não aparece** (o layout se reorganiza).

| O que | Onde |
|---|---|
| Ligar/desligar seções inteiras | `CONFIG.secoes` |
| Ligar/desligar um atendimento | `ativo: true/false` em `CONFIG.atendimentos` (novos itens entram no índice, no formulário, nas dúvidas e no JSON-LD sozinhos) |
| Nome completo | `CONFIG.nomeCompleto` (vazio hoje; aparece no rodapé quando preenchido) |
| Horários | `CONFIG.horarios.dias` (0 = domingo; `null` = fechado). Relógio, régua, status, formulário e JSON-LD se ajustam |
| WhatsApp | `CONFIG.whatsapp` e `CONFIG.usarWhatsapp` |
| Desligar o rascunho | `CONFIG.rascunho = false` **e** remover `public/robots.txt` (Disallow), `public/_headers` e o bloco `headers` de `vercel.json` |
| URL pública | `CONFIG.siteUrl` (canonical, og:url e JSON-LD). Atualize após o deploy |

### Fotos autorizadas
Coloque os arquivos em `referencias/fotos/`, copie versões otimizadas (`.webp`, até ~1600 px) para `public/fotos/` e liste em `CONFIG.fotos`:
`{ src: "/fotos/espaco-1.webp", alt: "Descrição do que aparece" }`. Elas aparecem depois da seção de horários.
Só use fotos autorizadas pela cliente. Nada de rostos de clientes nem antes e depois.

### Logo em alta resolução
O logo atual tem 640 px. Coloque o arquivo novo (vetor ou PNG grande, de preferência com fundo transparente) em
`referencias/logo-andrea.jpg` (ou ajuste o caminho em `scripts/logo.mjs`) e rode `npm run logo`.
O logo é exibido sempre como um quadro pequeno (até 64 px no topo e 112 px no rodapé); não amplie.

## Antes de publicar de vez

- [ ] **Testar o link wa.me** (`https://wa.me/5519993274382`) num celular.
- [ ] **Confirmar o endereço** com a cliente: o Google Maps mostra Rua Benedito Galhardo, 1177, mas os folhetos trazem outro endereço (provavelmente antigo).
- [ ] **Confirmar o nome**: o site usa só "Andrea". O sobrenome do perfil e o nome usado nos folhetos não foram confirmados.
- [ ] **Confirmar quais atendimentos podem ser anunciados**. Microagulhamento e Peeling 4D estão desligados (`ativo: false`); se a cliente confirmar, ligue um por um e escreva uma descrição geral, sem promessa.
- [ ] Logo em alta resolução.
- [ ] Fotos autorizadas.
- [ ] Desligar o modo rascunho (ver tabela acima) e atualizar `CONFIG.siteUrl`.

## Deploy

Vercel: `vercel deploy --prod --yes` dentro desta pasta (projeto `andrea-estetica-rascunho`).
Outra hospedagem estática: envie o conteúdo de `dist/` (o `_headers` funciona em Netlify e Cloudflare Pages).
