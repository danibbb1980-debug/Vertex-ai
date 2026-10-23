# Natalino Polato · Advogado Criminalista (rascunho)

Site institucional e informativo. Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem analytics, sem formulário (contato só por WhatsApp).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Editar dados

Tudo fica em **`src/config.ts`**: nome, OAB, WhatsApp, telefone, endereço, horários, áreas, chaves de exibição. As metas, o JSON-LD, `privacidade.html` e `404.html` são gerados a partir dele no build.

- **Desligar o rascunho:** `rascunho: false`. Remove a faixa do topo e troca as metas para `index, follow`. Depois, apague `public/robots.txt` e `public/_headers` e remova o cabeçalho `X-Robots-Tag` do `vercel.json`.
- **Domínio próprio:** troque `siteUrl` (usado em canonical, og:url e og:image).
- **Áreas:** só aparecem as com `confirmado: true`.
- **Foto:** substitua `public/img/natalino-polato-150.webp` e `-300.webp` (quadradas). A atual veio de um arquivo de 150×150 px; peça uma versão em alta (mín. 600×600). Com `foto.src: ''` aparece o bloco "Foto do advogado (substituir)".
- **Logo:** `public/img/logo-natalino-polato.webp` (completa) e `logo-monograma.webp` (cabeçalho), extraídas da arte enviada (`referencias/logo-mockup.jpg`) com fundo transparente. Também geram o favicon e a imagem de compartilhamento `og-natalino-polato.jpg`. Quando houver o arquivo vetorial original (SVG/PDF), substitua mantendo os mesmos nomes.

## Confirmar com o advogado

- [ ] Nome completo como consta na OAB
- [ ] Titulação "especialista em Direito Penal e Processo Penal" (`mostrarEspecialista`)
- [ ] Citar o cargo na OAB Mogi Guaçu (`mostrarCargoOAB`, hoje desligado)
- [ ] Citar "professor universitário" (`mostrarProfessor`, hoje desligado)
- [ ] Endereço e horários (vieram da ficha do Google)
- [ ] WhatsApp (19) 99247-7474 e telefone fixo (19) 3818-3551
- [ ] Divulgar o Instagram (`mostrarInstagram`, hoje desligado)
- [ ] Outras áreas de atuação (inquérito, ação penal, Júri, recursos), hoje ocultas
- [ ] Os 4 princípios de atuação
- [ ] Foto em alta resolução e logo em vetor (a atual foi extraída do mockup)

## Publicação

- **Vercel:** projeto com *Root Directory* `natalino-polato` (o `vercel.json` já define build e cabeçalhos).
- **Netlify Drop:** `cd dist && zip -r ../site-natalino-polato.zip . -x "*.DS_Store"` e arraste o zip.
