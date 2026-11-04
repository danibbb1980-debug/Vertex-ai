# Site-modelo para advocacia · Lumivo Web

Vitrine da Lumivo Web para advogados: o site fictício **Lavra & Cruz Advocacia**.
Vite + React + TypeScript + Tailwind + Motion + Lenis. Estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve o dist/
```

## Onde editar

Quase tudo fica em **`src/config.ts`**:

| O que | Campo |
| --- | --- |
| Nome, endereço, telefone, e-mail, OAB, horários | `escritorio` |
| WhatsApp do escritório (só dígitos, com 55) | `escritorio.whatsapp` |
| Título e descrição para o Google | `seo` |
| Frase do topo e subtítulo | `hero` (use `*palavra*` para o itálico) |
| Frase do manifesto | `manifesto` |
| Áreas de atuação | `areas` (título, palavra em itálico, descrição, orientações e mensagem do WhatsApp) |
| Etapas do atendimento | `etapas` |
| Sobre, princípios, formação | `sobre`, `escritorio.responsaveis`, `escritorio.formacao` |
| Artigos e dúvidas | `artigos`, `faq` |
| URL final (canonical, og:url, JSON-LD) | `siteUrl` |

### Trocar o tema
`tema: "papel-e-tinta"` (padrão, acento bordô seco), `"verde-profundo"` (verde-musgo) ou `"grafite-e-cobre"` (cobre).
As cores ficam em `src/styles.css`, só como variáveis. No modo modelo, a faixa do topo tem um seletor e também funciona `?tema=verde-profundo` na URL.

### Adicionar a foto
Coloque a imagem em `public/` (ex.: `public/retrato.webp`, proporção 3:4, cerca de 900×1200) e defina `foto: "/retrato.webp"`. A moldura com o monograma é substituída pela foto.

### Usar como site de um cliente real
1. `modelo: false`: remove a faixa de aviso, o botão "Quero um site assim" e faz todos os botões abrirem o WhatsApp do escritório, com a mensagem de cada área.
2. Troque todos os dados de `escritorio`, `seo`, `siteUrl` e os textos.
3. Revise os textos com o advogado pelo Provimento 205/2021 da OAB: sem promessa de resultado, sem preço, sem "especialista" sem título, sem depoimentos.
4. **Para aparecer no Google**, remova o bloqueio que existe no modelo, nos três lugares:
   - `index.html` e `public/privacidade.html` / `public/404.html`: metas `robots` e `googlebot`
   - `public/robots.txt`: troque `Disallow: /` por `Allow: /`
   - `public/_headers` e `vercel.json`: apague o `X-Robots-Tag`
5. Ajuste `public/privacidade.html` com os dados reais.

## Publicar
- **Vercel:** `vercel deploy --prod` dentro desta pasta (o `vercel.json` já define build e cabeçalhos).
- **Netlify Drop:** gere o build e arraste o zip do `dist/` (o `_headers` já vai junto).
