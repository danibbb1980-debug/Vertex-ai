# Silvia Marcondes Estética (rascunho)

Site de página única para Silvia Marcondes Estética, em São João da Boa Vista - SP.
Vite + React + TypeScript + Tailwind CSS 4 + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve dist/
```

## Onde editar

Todos os dados ficam em **`src/config.ts`**. Campo vazio (`""`), `null` ou lista vazia = o bloco não aparece
e o layout se reorganiza. Não existe placeholder no site.

| O que | Onde em `src/config.ts` |
| --- | --- |
| WhatsApp | `whatsapp` (só números, com 55 + DDD) e `whatsappExibicao` |
| Horários | `horarios` (os horários do formulário são gerados daqui, em blocos de 1 h) |
| Atendimentos | `atendimentos` (o campo `detalhes` está vazio e aparece quando for preenchido) |
| Seções | `secoes` (liga/desliga cada uma) |
| Rascunho | `rascunho: false` tira a faixa e o noindex das metas |
| URL do site | `siteUrl` (usada em canonical, og:url e og:image) |

### Pendências antes de publicar de forma definitiva

1. **Confirmar o WhatsApp** com a profissional. O número informado foi `019999037811`; o site usa `5519999037811`
   e exibe `(19) 99903-7811`.
2. **Formação, registro, tempo de atuação**: campos `profissional.titulo`, `.formacao`, `.registro`, `.tempoAtuacao`
   prontos e vazios. Preencher só com informação confirmada.
3. **Descrição de cada procedimento** (técnica, produtos, duração): campo `atendimentos[].detalhes`. Manter o tom
   sem promessa de resultado.
4. **Marca provisória**: o logo (monograma "SM" em linha contínua + "Silvia Marcondes / Estética") foi criado do zero.
   Para trocar pelo oficial, substitua `public/marca/*.svg` e `public/favicon.svg`, e o desenho do monograma em
   `src/lib/monograma.ts` (ou edite `src/components/Logo.tsx`). Para regerar os SVGs atuais: `node scripts/logo.mjs`.
5. **Foto**: a foto da profissional está em `referencias/fotos/`. As versões do site (`public/img/silvia-*.webp|avif`)
   saem de `node scripts/fotos.mjs`. Para trocar, coloque a nova foto lá, ajuste o recorte no script e rode de novo.
   Para tirar a foto, use `profissional.foto: null` (entra uma composição com o monograma).
6. **Desligar o rascunho**: `rascunho: false` em `src/config.ts`, e também remover o `Disallow: /` de
   `public/robots.txt`, o `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
7. Atualizar `siteUrl` para o domínio definitivo e refazer o deploy.

## O que o site não mostra (por falta de dados)

Formação e cursos, tempo de atuação, fotos do espaço, descrição técnica dos procedimentos, duração, preços,
convênios e avaliações de clientes.

## Formulário de agendamento

Não envia nada a servidor e não guarda dados: monta a mensagem e abre `wa.me` em nova aba.
A mensagem sempre diz que é uma **solicitação**. Explicação para o público em `public/privacidade.html`.

## Deploy

`vercel.json` já define build, saída (`dist`) e o cabeçalho `X-Robots-Tag: noindex, nofollow`.
`public/_headers` faz o mesmo em hosts como Netlify/Cloudflare Pages.
