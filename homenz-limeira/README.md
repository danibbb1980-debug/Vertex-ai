# Homenz Limeira, rascunho do site

Página única estática (Vite + React com Preact/compat + TypeScript + Tailwind), pré-renderizada no build: o conteúdo existe no HTML mesmo sem JavaScript. Sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (HTML pré-renderizado + CSS inline)
npm run preview  # serve o dist/
```

## Editar o conteúdo: `src/config.ts`

Tudo o que aparece no site vem daí. Campo vazio = o bloco não aparece.

- **Seções**: `secoes.atendimentos`, `clinica`, `comoFunciona`, `duvidas`, `contato`, `agendar`, `ctaFinal` (`true`/`false`).
- **Atendimentos**: cada item tem `ativo` e `area` (`cabelo`, `rosto`, `corpo`, `depilacao`). Com `ativo: false` a linha some da ficha do hero, do índice, do formulário, das dúvidas, do JSON-LD, e a mensagem do WhatsApp se ajusta. Para incluir um novo, copie um item e ajuste `nome`, `rotulo`, `naFrase` e `descricao`.
- **Horários**: `horarios` (0 = domingo … 6 = sábado). O formulário gera os horários de 1 em 1 hora até 1 hora antes de fechar e bloqueia os dias sem atendimento.
- **Abertura**: `intro` (padrão `false`; não implementada como efeito, reservada).
- **Rascunho**: `rascunho: false` tira a faixa. Para publicar de verdade, remova também o `noindex`: metas `robots`/`googlebot` em `index.html`, `public/robots.txt` (`Disallow: /` → `Allow: /`), `public/_headers` e o cabeçalho `X-Robots-Tag` em `vercel.json`. Atualize `siteUrl` para o domínio final.
- **WhatsApp**: `whatsapp: "5519990188717"`. **Teste o link** `https://wa.me/5519990188717` num celular antes de publicar.

## Fotos e logo

- **Fotos do espaço**: `CONFIG.fotos` (galeria em anel 3D) e `CONFIG.fotoFachada` (ao lado do mapa). Os arquivos ficam em `public/fotos/` em três tamanhos (`-360`, `-640`, `-1100.webp`). Lista vazia ou `secoes.espaco: false` = a galeria some.
- **Antes e depois**: `CONFIG.antesDepois`. Para tirar do ar, use `secoes.antesDepois: false`. As fotos foram recortadas dos posts do Instagram, sem o nome da profissional e sem os textos dos posts. **Antes de publicar, confirme com a clínica e com a profissional responsável se a divulgação de antes e depois é permitida pelo conselho dela** (biomedicina, medicina etc.) e se cada cliente autorizou o uso no site, não só no Instagram.
- **Logo**: refeito em vetor (`public/logo.svg`, caminhos em `src/logoPaths.ts`), traçado a partir do original e nas cores da marca (anel branco, Z turquesa). Os PNGs de ícone (`logo-88`, `logo-192`, `icon-512`, `apple-touch-icon`, `favicon-32`) foram gerados a partir dele. Se a clínica enviar o arquivo oficial, substitua os caminhos.
- `referencias/instagram/` guarda as capturas originais enviadas.

## Animações 3D

Tudo em CSS 3D (sem biblioteca pesada): o logo como peça sólida girando (seção A clínica), a ficha do hero que entra girando e acompanha o mouse, o anel de fotos que gira com a rolagem e com os botões, os títulos que viram por linha, os números da linha do tempo e os cartões de antes e depois. Com “reduzir movimento” ligado no aparelho, tudo fica parado no estado final.

## O que falta para publicar de forma definitiva

1. **Profissional responsável pelos cuidados capilares e o registro dele**: muda as regras de publicidade dos cuidados capilares. Preencher `responsavel` só depois de confirmar.
2. **Marca Homenz**: confirmar com a cliente se a marca exige identidade visual ou site padronizados entre unidades.
3. **Atendimentos anunciáveis**: quais podem aparecer e com que descrição.
4. **Logo oficial** em vetor, se existir (o atual foi redesenhado a partir da foto de perfil).
5. **Autorização de uso das fotos** no site, principalmente as de antes e depois.
6. **Testar o link wa.me** e desligar o rascunho/noindex.
