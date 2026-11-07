# Site Juliana Borges (rascunho)

Site de uma página para Juliana Borges, massoterapeuta e depiladora em São João da Boa Vista - SP.
Vite + React + TypeScript + Tailwind. Estático: sem backend, sem banco de dados, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve o dist/
```

## Onde editar

Todos os dados ficam em **`src/config.ts`**. Regra geral: campo vazio (`''` ou `[]`) = o bloco some do site, e o layout se reorganiza.

- **Seções**: `CONFIG.secoes` liga e desliga cada seção (`true`/`false`). Uma seção ligada só aparece se tiver conteúdo.
- **Horários**: `CONFIG.horarios`. Hoje: segunda a sexta 11h–19h, sábado 8h–14h, domingo fechado (dados do Google). Para fechar um dia, deixe `abre` e `fecha` vazios. Se houver pausa de almoço, preencha `pausaInicio`/`pausaFim`: a tabela e o formulário se ajustam sozinhos. **Confirme os horários com a Juliana antes de publicar.**
- **Formação**: `CONFIG.formacao` (curso + instituição, sem anos). As formações citadas no Instagram sem curso/instituição (eletroterapias, tratamentos faciais, pós-operatório) estão em `CONFIG.formacaoPendente` e **não aparecem**. Quando forem confirmadas, com instituição, mova para `formacao`.
- **Textos de atendimentos, “Antes de agendar”, “Como funciona” e dúvidas**: `src/config.ts` e `src/content.ts`.
- **Mensagens de WhatsApp**: `CONFIG.mensagens`.

## Fotos

As fotos ficam em `public/img/` em WebP e AVIF, em três larguras. Os originais tratados estão em `referencias/fotos/`.

- Retrato do hero: `juliana-*` — recorte com fundo transparente feito a partir da arte “Quem é Juliana Borges?” do Instagram. A foto foi cortada acima da marca-d’água J|B que havia sobre os braços. Arquivo transparente em `referencias/fotos/juliana-recorte-transparente.png`.
- Espaço: `espaco-*` — recortes dos prints do WhatsApp (só a área da foto).

Para trocar ou adicionar fotos: coloque a imagem, gere as versões com `scripts/processar-fotos.py` (ou exporte manualmente `nome-400`, `nome-560`, `nome-739` em `.webp` e `.avif`) e ajuste `CONFIG.fotos`. Para remover o retrato, deixe `CONFIG.fotos.retrato = ''`: o hero passa a mostrar o logo.

Uma foto profissional dela, com fundo limpo e em boa resolução, melhoraria bastante o hero.

## Logo

**O logo do site é uma reprodução vetorial do logo existente da Juliana** (monograma J|B em serifa de alto contraste, linha vertical fina, “JULIANA BORGES” em caixa-alta espaçada e o descritor da placa). Foi recriado a partir da imagem de perfil do Instagram, porque não havia arquivo original. Os arquivos são gerados por `scripts/gerar-logo.py` (letras convertidas em contornos, sem depender de fonte instalada):

- `src/assets/brand/*.svg` — versões usadas no site (cor herdada do texto).
- `public/brand/*-dourado.svg` e `*-claro.svg` — para fundo claro e escuro.
- `public/favicon.svg`, `public/apple-touch-icon.png`, `public/og-image.jpg`.

**Assim que houver o arquivo original do logo (AI, PDF, SVG ou PNG em alta), substitua esses arquivos** mantendo os mesmos nomes.

## Rascunho e indexação

Hoje o site está em modo rascunho: faixa “Rascunho para avaliação…” e `noindex` em quatro lugares:

1. `CONFIG.rascunho = true` → metas `robots`/`googlebot` `noindex, nofollow` e a faixa.
2. `public/robots.txt` → `Disallow: /`.
3. `public/_headers` → `X-Robots-Tag: noindex, nofollow` (Netlify/Cloudflare).
4. `vercel.json` → `X-Robots-Tag: noindex, nofollow` (Vercel).

As páginas `public/privacidade.html` e `public/404.html` têm faixa e `noindex` próprios (HTML estático).

## Para publicar de forma definitiva

1. Confirmar com a Juliana: horários, textos, formação, fotos e o uso do retrato.
2. Trocar a reprodução do logo pelo arquivo original.
3. Definir o domínio e atualizar `CONFIG.siteUrl` (canonical, og:url e og:image usam essa URL).
4. Desligar o rascunho: `CONFIG.rascunho = false`; em `public/robots.txt` trocar por `Allow: /` e incluir o sitemap, se houver; remover o `X-Robots-Tag` de `public/_headers` e `vercel.json`; remover a faixa e o `noindex` de `privacidade.html` e `404.html`.
5. `npm run build` e publicar.

## Privacidade

O formulário “Solicitar agendamento” só monta uma mensagem e abre `wa.me` em nova aba. Nada é enviado a servidor nem salvo no navegador. O mapa do Google só carrega quando a pessoa toca em “Mostrar mapa”.
