# Afeto Espaço Terapêutico — site (rascunho)

Página única do Afeto Espaço Terapêutico (Poços de Caldas - MG), focada em pedidos de agendamento pelo WhatsApp.
Vite + React + TypeScript + Tailwind CSS 4. Estático, sem backend, sem cookies, sem analytics.

```bash
cd afeto
npm install
npm run dev       # desenvolvimento
npm run build     # verifica tipos, gera dist/ e pré-renderiza o HTML
npm run preview   # serve o dist/ em http://localhost:4173
```

## Onde mudar cada coisa

Todos os dados ficam em **`src/config.ts`**. Regra geral: campo vazio (`''`) ou lista vazia (`[]`) faz o bloco sumir, e o
layout se reorganiza. Não escreva textos provisórios como "em breve" ou "a confirmar".

| O quê | Campo em `CONFIG` |
|---|---|
| Faixa de rascunho + `noindex` nas metas | `rascunho` (true/false) |
| URL pública (canonical, og:url, og:image) | `siteUrl` |
| WhatsApp, Instagram, Maps, endereço | `whatsapp`, `instagram`, `maps`, `endereco` |
| Telefone fixo (vazio = sem botão "Ligar") | `telefone` |
| Horários e pausa de almoço | `horarios` (`intervalo` opcional) — o formulário usa isso para datas e horários |
| Áreas de atendimento | `especialidades` (nome + descrição educativa) |
| Fotos do espaço | `fotos` |
| Equipe | `mostrarEquipe` + `equipe` |
| Ligar/desligar seções inteiras | `secoes` |
| Mensagens do WhatsApp | `mensagens` |
| Etapas de "Como funciona" | `comoFunciona` |

As perguntas frequentes ficam em `src/lib/dados.ts` (`duvidas()`), montadas a partir do config.

### Adicionar ou remover áreas

Edite a lista `especialidades`. A faixa de áreas, o mosaico de atendimentos, o título ("Oito áreas..."), o FAQ, o
JSON-LD e o select do formulário se ajustam sozinhos.

### Equipe (desligada por padrão)

Pelas regras de publicidade dos conselhos profissionais, cada pessoa exibida precisa de **nome completo**, **número de
registro no conselho** (CRP, CREFITO, CRFa, CRN, CRESS etc.) e **autorização por escrito**. Para ligar:

1. Preencha `equipe` com `{ nome, profissao, registro, autorizado: true, foto?, texto? }`.
2. Mude `mostrarEquipe` para `true`.

O site só mostra quem tem `autorizado: true` e registro preenchido. Pedagogia e Musicoterapia não têm conselho de classe:
para elas, o registro pode ficar vazio (lista em `profissoesSemConselho`). Com equipe ligada, o formulário ganha o campo
opcional "Profissional".

### Fotos

Coloque as imagens em `public/fotos/` (WebP, até ~1600 px de largura) e adicione em `fotos` com `alt`, `legenda`,
`largura` e `altura`. As fotos originais e os recortes usados estão em `referencias/`.

### Publicar de verdade (sair do rascunho)

1. `rascunho: false` em `src/config.ts`.
2. Remova o `X-Robots-Tag` de `vercel.json`, `public/vercel.json` e `public/_headers`, troque `public/robots.txt` por
   `Allow: /` e tire o `noindex` de `public/privacidade.html` e `public/404.html`.
3. Atualize `siteUrl` com o domínio definitivo.

## O que falta para a versão definitiva

- Confirmar horários (inclusive pausa de almoço, se houver) e se há atendimento a crianças (a pergunta do FAQ foi omitida).
- Registro no conselho e autorização de cada profissional que for aparecer.
- Fotos em resolução maior: as atuais vieram de capturas de tela do Google Maps (cerca de 740 px de largura).
- Logo em arquivo vetorial original. O site usa uma vetorização feita a partir do PNG de 1440 px (`src/brand/logo-paths.ts`).
- Convênios, acessibilidade e estacionamento, se quiserem divulgar.

## Deploy

Vercel, projeto `afeto-espaco-terapeutico-rascunho`, **Root Directory = `afeto`** (o `vercel.json` já define build e saída).
Para outro host, use o conteúdo de `dist/` (inclui `_headers` para Netlify/Cloudflare Pages).

## Decisões técnicas

- **Fontes:** Bellefair (títulos; serifa fina e alta, como o "AFETO" do logo) + Hanken Grotesk (texto; grotesca sóbria,
  parente do "ESPAÇO TERAPÊUTICO"). Auto-hospedadas via `@fontsource`.
- **Mosaico:** o logo foi vetorizado por cor; cada peça (sálvia, âmbar, terracota) é um caminho SVG. No topo, as peças
  se encaixam conforme a rolagem. Com "reduzir movimento" o mosaico aparece montado.
- **Sem biblioteca de animação:** os efeitos usam um hook próprio (`src/lib/rolagem.ts`) que só roda com o elemento na tela
  e mexe apenas em `transform`.
- **HTML pré-renderizado** (`scripts/prerender.mjs`): o conteúdo aparece antes do JavaScript; o CSS vai embutido.
- **Mapa:** carrega só quando a pessoa clica, para não enviar cookies do Google antes disso.
