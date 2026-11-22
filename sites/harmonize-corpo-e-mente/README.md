# Harmonize Corpo e Mente (rascunho)

Site de página única para o Harmonize Corpo e Mente, em Varginha - MG. Vite + React + TypeScript + Tailwind, estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Antes de publicar de forma definitiva (falta confirmar)

- **Nome completo, título e registro profissional da responsável.** Sem isso, nenhum nome aparece no site.
- **Quais atendimentos podem ser anunciados** (estética, psicanálise, perícias; "Emagrecimento saudável" está desligado).
- **Logo oficial em alta resolução** (vetor ou PNG grande). O atual foi extraído de um print e serve bem só em tamanho pequeno.
- **Autorização das fotos** do espaço e do retrato (vieram de prints do perfil comercial).
- **Horários por dia**, se houver.
- **Testar o link wa.me**: abra `https://wa.me/5535988045410` no celular e confira se cai na conversa certa.

## Como editar

Tudo fica em `src/config.ts`. Campo vazio (`""` ou `[]`) faz o bloco sumir do site.

- **Responsável**: preencha `responsavel.nome`, `responsavel.titulo` e `responsavel.registro` (os três). O nome passa a aparecer em "O espaço" e no rodapé.
- **Atendimentos**: em `atendimentos`, use `ativo: true/false`. Cada item ativo gera a linha do índice, o botão de WhatsApp próprio e a opção do formulário. Novos itens precisam de `descricao` para aparecer.
- **Seções**: `secoes.<nome> = false` desliga a seção, o link do menu e renumera as demais.
- **Horários**: com `horarios` vazio, o formulário pede "Melhor dia e horário (opcional)". Preenchido (ex.: `{ dia: 1, abre: "08:00", fecha: "18:00", pausa: { inicio: "12:00", fim: "13:00" } }`), o formulário passa a ter data e blocos de 1 hora, bloqueando datas passadas e dias fechados.
- **Fotos**: coloque o original em `referencias/fotos/`, gere `public/img/<nome>-<largura>.webp` (420, 640 e 1170 px) e adicione o item em `fotos`. Lista vazia = seção só tipográfica. `retrato: null` remove o retrato.
- **Logo**: troque `public/img/logo-tinta*.webp` e `logo-areia*.webp` pela versão em alta resolução (tinta #1F2638 e areia #EEE8DE, fundo transparente).
- **Rascunho**: ao publicar de vez, mude `rascunho` para `false` e remova o noindex em `index.html` (metas robots/googlebot), `public/robots.txt`, `public/_headers` e `vercel.json`. Atualize `siteUrl`, canonical e og:url com o domínio final.

## Publicação

- Vercel: projeto `harmonize-corpo-e-mente-rascunho`, raiz `sites/harmonize-corpo-e-mente`, framework Vite, saída `dist`.
- Hospedagem estática qualquer: envie o conteúdo de `dist/` (inclui `_headers` para Netlify/Cloudflare Pages).
