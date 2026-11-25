# Refúgio Vita Spa · site (rascunho)

Página única, estática (Vite + React/TypeScript, empacotada com Preact), com HTML pré-renderizado: o conteúdo aparece mesmo sem JavaScript.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (HTML pré-renderizado, CSS embutido)
npm run preview   # serve o dist/
```

## Editar o conteúdo: `src/config.ts`

Tudo está lá. **Campo vazio (`''`) ou lista vazia = o bloco não aparece** e o layout se reorganiza.

- **Seções**: `secoes` (true/false para cada uma).
- **Atendimentos**: lista `atendimentos`; cada um tem `ativo`. Hoje estão ligados *Limpeza de pele*, *Drenagem linfática* e *Massagem relaxante*. *Pós-operatório e pós-parto* e *Ventosaterapia* estão **desligados** (`ativo: false`) até a confirmação da habilitação e de como podem ser anunciados. Ao ligar, escreva uma descrição geral, sem promessa de resultado. O índice, o formulário, as dúvidas e o JSON-LD crescem sozinhos.
- **Horários**: `horarios`, um **array de faixas por dia** (0 = domingo … 6 = sábado), ex.: `5: [{ inicio: '08:00', fim: '12:00' }, { inicio: '16:00', fim: '19:00' }]`. O status "Aberto agora", a linha do tempo da semana, as opções do formulário (blocos de 1 h que cabem antes do fechamento), as dúvidas e o JSON-LD usam esses dados. Teste: `npx tsx scripts/testar-horarios.ts`.
- **Responsável**: `responsavel` (só o nome) e `responsavelFoto`.
- **Contato**: `whatsapp`, `usarWhatsapp`, `telefoneFixo`, `email`, `instagram`. **Teste o link** `https://wa.me/5519992167352` num celular antes de publicar.
- **Abertura animada**: `intro` (padrão `false`).

## Fotos

As fotos enviadas pelo cliente estão em `referencias/fotos/` (recortadas das capturas de tela, sem a interface do Instagram). Para trocar ou acrescentar:

1. Coloque o arquivo (PNG/JPG) em `referencias/fotos/`.
2. Rode `npm run fotos` (gera WebP 480 e 960 px em `public/fotos/` e imprime as dimensões).
3. Acrescente um item em `fotos` no config (arquivo, largura, altura, alt, legenda) ou use em `atendimentos[].foto` / `responsavelFoto`.

As fotos vieram de capturas de tela: a resolução é limitada (~1.100 px). Os arquivos originais da câmera deixam o site mais nítido.

## Logo

O logo foi **vetorizado a partir do original** (`referencias/logo-refugio-vita-spa.jpg`), sem redesenhar: o dourado foi traçado e virou SVG sem fundo, com um contorno extra que deixa o traço mais encorpado.

- `public/logo-horizontal-escuro.svg`: header (árvore ao lado do nome), dourado escuro sobre o branco.
- `public/logo-vertical-escuro.svg`: hero (embutido no HTML, aparece junto com o texto).
- `public/logo-vertical-ouro.svg`: rodapé, dourado do logo sobre o verde.
- `public/logo-simbolo-ouro.svg`: só a árvore.

Para regerar (por exemplo, com um arquivo do logo em resolução maior):

```bash
pip install potracer pillow numpy
python3 scripts/vetorizar-logo.py   # cores e espessura do contorno no topo do script
npx svgo -p 1 public/logo-*.svg     # reduz o tamanho dos arquivos
```

## Cores

As do logo, sobre base branca: verde-garrafa `#162D27` (amostrado do logo) em textos e blocos, dourado `#B08A3E` nos detalhes gráficos, dourado escuro `#856526` para texto sobre o branco e dourado claro `#D4B66F` (o do logo) sobre o verde. Todas com contraste AA conferido; os tokens ficam em `src/tokens.css`.

## Fontes

Newsreader (títulos) e Hanken Grotesk (texto), auto-hospedadas e reduzidas por `python3 scripts/subset-fontes.py` (requer `pip install fonttools brotli`).

## Rascunho → publicação definitiva

O rascunho tem `noindex` em quatro lugares. Para publicar de verdade:

1. `CONFIG.rascunho = false` (tira a faixa) e build com `RASCUNHO=false npm run build` (tira as metas `robots`).
2. Remova o `X-Robots-Tag` de `public/_headers` e de `vercel.json`, e troque `public/robots.txt` por `Allow: /` com o endereço do sitemap.
3. Ajuste `CONFIG.siteUrl` e `SITE_URL=https://dominio npm run build` (canonical, og:url, JSON-LD).

## Pendências antes de publicar

- **Confirmar a formação da Viviane Martins e a habilitação para cada atendimento** (e quais podem ser anunciados). Pós-operatório/pós-parto e Ventosaterapia seguem desligados.
- **Autorização de imagem** de todas as pessoas que aparecem nas fotos, em especial a **cliente na foto da limpeza de pele** (rosto visível). Essa foto também mostra uma **marca na faixa de cabelo**: troque por outra se possível.
- Logo em alta resolução e fotos originais.
- Testar o link wa.me.
