# OrtoFisio · site (rascunho)

Site de página única da OrtoFisio (Fisioterapia & Pilates, Poços de Caldas - MG).
Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Editar conteúdo: `src/config.ts`

Tudo o que aparece no site vem desse arquivo. **Campo vazio ou lista vazia = o bloco não aparece** (o layout se reorganiza sozinho).

- **Contato**: `whatsapp` (só números, com 55 + DDD), `telefone`, `email`, `instagram`, `endereco`.
- **Horários**: `horarios` (dias 0 = domingo … 6 = sábado). O formulário usa esses dados para bloquear dias fechados e gerar os horários. Se houver pausa de almoço, preencha `almoco: { inicio: '12:00', fim: '13:00' }`.
- **Atendimentos**: `atendimentos` (texto, observação e mensagem de WhatsApp de cada um).
- **Seções**: `secoes` liga/desliga cada seção inteira (`true`/`false`).
- **Dúvidas**: `faq`. **Etapas**: `etapas`.

### Equipe
1. Preencha `equipe` com `nome` completo, `profissao`, `registro` (ex.: `CREFITO-4 000000-F`) e, se houver, `foto`.
2. Troque `mostrarEquipe` para `true`.
Profissional sem número de registro **não aparece**, mesmo com a flag ligada. Publique só com autorização da pessoa.

### Fotos
Coloque os arquivos (de preferência `.webp`) em `public/fotos/` e liste em `fotos: [{ src: '/fotos/recepcao.webp', alt: 'Descrição útil' }]`. Sem fotos, a seção não existe.

### Desligar o modo rascunho
1. `rascunho: false` em `src/config.ts` (remove a faixa e as metas noindex).
2. Remova `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
3. Troque `public/robots.txt` por `User-agent: *` / `Allow: /`.
4. Remova as metas `robots`/`googlebot` de `public/privacidade.html` e `public/404.html` e a faixa de rascunho da página de privacidade.
5. Ajuste `siteUrl` para o domínio definitivo.

### Imagem do hero
A pessoa do hero é uma **imagem ilustrativa gerada por IA** para este rascunho (não é paciente nem profissional da clínica). Arquivos: `public/img/hero-pilates-640/1024/1536.webp`; original em `referencias/hero-gerada-figma.png`. Para usar uma foto real da OrtoFisio, substitua os três arquivos mantendo a proporção 3:2 com a pessoa à direita e ajuste os pontos das anotações (`notas`) em `src/components/HeroPainel.tsx`.

## O que falta antes da publicação definitiva
- **Confirmar o número de WhatsApp com a clínica.** Foi informado sem o dígito 9; o site usa `(35) 98835-3607` (`5535988353607`), conforme o WhatsApp da conversa.
- **Logo oficial em alta resolução.** O site usa um recorte do avatar do Instagram (500 × 500 px), com o fundo branco removido e sem outras alterações. Substitua `public/logo-ortofisio.webp`/`.png` pelo arquivo original (de preferência SVG).
- Nomes e registros (CREFITO) dos profissionais, com autorização.
- Fotos reais da clínica, incluindo a do hero (hoje é uma imagem ilustrativa).
- Serviços detalhados (especialidades, técnicas), se a clínica quiser divulgar.
- URL definitiva em `siteUrl` e uma imagem real de compartilhamento em `seo.ogImage`.

## Deploy
Vercel: `vercel deploy --prod --yes` dentro desta pasta (o `vercel.json` já define build, saída e cabeçalhos).
Qualquer hospedagem estática: envie o conteúdo de `dist/` (o `_headers` funciona na Netlify e na Cloudflare Pages).
