# Site Dra. Ana Villela | Estética Dental (rascunho)

Site estático em Vite + React + TypeScript + Tailwind, com HTML pré-renderizado no build. Contato só por WhatsApp. Sem analytics, cookies ou formulários.

## Comandos

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com pré-renderização)
```

Para publicar no Netlify Drop: `cd dist && zip -r ../site-dra-ana-villela.zip . -x "*.DS_Store"` e arraste o zip.

## Como editar

- **Todos os dados** (nome, CRO, endereço, horários, WhatsApp, Instagram, Maps, URL do site) ficam em `src/config.ts`.
- **CRO**: preencha `cro` (ex.: `"CRO-MG 00000"`). Ele aparece no hero, em "Sobre" e no rodapé.
- **Especialidade**: preencha `especialidade` só se estiver registrada no CRO.
- **URL definitiva**: troque `siteUrl` (usada em canonical, og:url, og:image e JSON-LD).
- **Fotos**: substitua os arquivos em `public/fotos/` mantendo os nomes (ou ajuste `fotos` no config). Use WebP. A imagem de compartilhamento é `public/og-image.jpg` (1200x630).
- **Logo**: hoje é uma assinatura tipográfica (`Logo` em `src/components/Header.tsx`). Troque pelo logo oficial quando houver.
- **Textos**: tratamentos, etapas, galeria do consultório e compromissos ficam em `src/components/Sections.tsx`; dúvidas em `src/components/Contato.tsx`.

## Desligar o modo rascunho (quando aprovado)

1. Em `src/config.ts`, `rascunho: false` (remove a faixa e troca as metas para `index, follow`).
2. Em `public/_headers`, apague o bloco `/*` com `X-Robots-Tag: noindex, nofollow`.
3. Em `public/robots.txt`, troque `Disallow: /` por `Allow: /` e adicione o sitemap se houver.
4. Em `public/privacidade.html` e `public/404.html`, remova a faixa e as metas `noindex`.

## Pendências para confirmar com a doutora

- [ ] **Número do CRO** (obrigatório) e responsável técnico.
- [ ] Profissão exibida ("cirurgiã-dentista") e eventual especialidade registrada.
- [ ] Endereço (R. Rio Grande do Sul, 1402 - Centro) e horários (seg a sex 08h30–11h30 e 13h00–19h00), vindos da ficha do Google.
- [ ] Lista de serviços e textos educativos de cada tratamento.
- [ ] Alinhadores: se é prestadora credenciada Invisalign e se pode citar a marca (hoje: "alinhadores transparentes").
- [ ] Vínculo com a clínica parceira (não citada no site sem autorização).
- [ ] Autorização de uso das fotos (vieram da ficha do Google) e fotos em maior resolução. Nas fotos da fachada e da entrada a marca da clínica foi removida; na sala, os quadros de sorriso e a imagem do monitor foram cobertos. Com fotos originais autorizadas, basta substituir os arquivos em `public/fotos/`.
- [ ] Logo oficial.
- [ ] Avaliações do Google: seção omitida até haver autorização para exibir avaliações reais.
- [ ] Compromissos de atendimento (Naturalidade, Planejamento individual, Clareza, Acompanhamento).
- [ ] Domínio definitivo.
