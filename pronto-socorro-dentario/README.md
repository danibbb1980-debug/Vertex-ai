# Pronto Socorro Dentário | Alfenas (rascunho)

Site de página única da clínica. Vite + React + TypeScript + Tailwind, estático, sem backend,
sem formulário, sem cookies e sem analytics. O contato é só por WhatsApp e telefone.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (HTML pré-renderizado, CSS embutido)
npm run preview  # serve o dist/ em http://localhost:4173
```

## Editar os dados

Tudo fica em **`src/config.ts`**: nome, endereço, WhatsApp, telefone, Instagram, horário,
equipe, estrutura, mensagens do WhatsApp e os atendimentos.

- Os dados vieram da ficha do Google (incluindo a aba "Sobre"), das fotos da ficha e do Instagram.
- O que a clínica não divulgou fica de fora do site (sem marcador de pendência). Em `CONFIG.estrutura`,
  um item vazio (`''`) não aparece; preencha para ele surgir (ex.: `convenios`).
- Os textos das seções ficam em `src/sections/`.

## Ligar e desligar seções

Em `CONFIG.secoes`, mude para `false` o que não quiser mostrar (marquee, primeiros cuidados,
equipe, estrutura, FAQ etc.). Para uma versão curta, deixe só `quandoProcurar`, `atendimentos`,
`contato` e `ctaFinal`.

## Fotos e logo

- **Fotos** em `public/fotos/` (WebP, com versão menor `-480`/`-640` para celular) e configuradas em
  `CONFIG.fotos` e `CONFIG.equipe`:
  - `dr-antonio.webp`: hero (responsável técnico) e `dr-antonio-rosto.webp` no cartão da equipe;
  - `recepcao.webp`: seção "A clínica";
  - `fachada.webp`: seção "Como chegar" e base do `og.jpg` (imagem de compartilhamento).
  Os originais recortados ficam em `referencias/fotos/`. Elas vieram de capturas de tela, então
  fotos originais em alta resolução deixariam o site mais nítido. Nunca use fotos de pacientes.
- **Logo:** `public/logo.webp` e os ícones vieram do JPG de 150 px recebido. Um PNG ou SVG em alta
  resolução melhoraria a nitidez. O verde da marca (`#00A346`) foi amostrado desse arquivo.

## Desligar o modo rascunho (versão final)

Faça as quatro coisas juntas:

1. `src/config.ts`: `rascunho: false` (remove a faixa e troca a meta robots para `index, follow`).
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers`: apague a linha `X-Robots-Tag: noindex, nofollow`.
4. `vercel.json`: apague o cabeçalho `X-Robots-Tag`.

Confira também `CONFIG.siteUrl` (canonical e og:url) com o domínio final.

## Deploy

- **Vercel:** `vercel deploy --prod --yes` na pasta deste projeto (o `vercel.json` já configura o build).
- **Netlify Drop:** arraste o zip do `dist/` (`cd dist && zip -r ../site-pronto-socorro-dentario.zip . -x "*.DS_Store"`).

## Pontos para revisar com a clínica (fora do site)

- Nome: o Google e o Instagram usam "Pronto Socorro Dentário"; a placa da fachada diz "Referência Saúde Odonto".
- Horário 24 horas: a ficha mostrou 24 horas; o site pede para confirmar pelo WhatsApp.
- "Planos de pagamento" da ficha não foi publicado (o CFO não permite anunciar parcelamento).
- Textos de "Primeiros cuidados" e do aviso de casos graves: vale o responsável técnico revisar.
- Nota do Google: só ligar `CONFIG.mostrarNotaGoogle` com autorização; nunca exibir texto de avaliações.
