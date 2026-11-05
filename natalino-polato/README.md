# Natalino Polato · Advogado Criminalista (rascunho)

Site institucional e informativo. Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem analytics, sem formulário (contato só por WhatsApp). Fontes servidas pelo próprio site (@fontsource), sem Google Fonts.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## O que mudou nesta versão

- **Foto nova** em `public/img/natalino-polato-{480,800,1200}.{avif,webp}` (recorte 4:5, fundo removido, tom ajustado à paleta, broche da OAB retirado por retoque). Original em `referencias/fotos/natalino-nova.jpg`; versão tratada em `referencias/fotos/natalino-nova-tratada.png`. Retrato antigo removido.
- **Imagem de compartilhamento** `public/img/og-natalino-polato.jpg` (1200×630) com logo e foto nova.
- **Sobre** reescrito com o currículo enviado: mais de 20 anos de atuação, formação (linha do tempo) e fechamento institucional.
- **Atuação**: 9 áreas em lista numerada. No computador, a linha ativa mostra a descrição num painel ao lado; no celular, acordeão. Cada área tem "Conversar sobre este tema", que abre o WhatsApp com mensagem do tema.
- **"Especialista" removido** de todo o site, SEO e JSON-LD (`mostrarEspecialista: false`): a pós-graduação informada é em Direito Processual Civil.
- **Dúvidas**: novas perguntas gerais sobre Tribunal do Júri, habeas corpus e execução penal.
- **SEO**: nova meta description; JSON-LD com inscrição na OAB e `knowsAbout` com as áreas.
- **Docência** (`mostrarProfessor: true`): frase na seção Sobre e último item da linha do tempo ("Formação e docência"): professor de Processo Penal e Prática Penal na Faculdade Unimogi. Só na seção Sobre; fora do topo, do CTA e do título.

## Editar dados

Tudo fica em **`src/config.ts`**: nome, OAB, currículo, formação, áreas, WhatsApp, telefone, endereço, horários e chaves de exibição. As metas, o JSON-LD, `privacidade.html` e `404.html` são gerados a partir dele no build.

- **Desligar o rascunho:** `rascunho: false`. Remove a faixa do topo e troca as metas para `index, follow`. Depois, apague `public/robots.txt` e `public/_headers` e remova o cabeçalho `X-Robots-Tag` do `vercel.json`.
- **Domínio próprio:** troque `siteUrl` (canonical, og:url e og:image).
- **Áreas:** edite `areas`; só aparecem as com `confirmado: true`. `tema` é o texto usado na mensagem do WhatsApp.
- **Foto:** gere os 6 arquivos `natalino-polato-{480,800,1200}.{avif,webp}` em proporção 4:5. Com `foto.base: ''` o retrato simplesmente não aparece.
- **Logo:** `public/img/logo-natalino-polato.webp` e `logo-monograma.webp`, extraídas da arte enviada. Quando houver o vetor original (SVG/PDF), substitua mantendo os nomes.

## Falta confirmar com o advogado (antes da publicação definitiva)

- [ ] Nome completo como consta na OAB
- [ ] Endereço, horários e telefone fixo do escritório (vieram da ficha do Google)
- [ ] Qual domínio usar (hoje: natalino-polato-rascunho.vercel.app)
- [ ] Se aprova o retoque que retirou o broche da OAB da foto
- [ ] Os 4 princípios de atuação
- [ ] Divulgar ou não o Instagram (`mostrarInstagram`, hoje desligado)
- [ ] Logo em arquivo vetorial

## Publicação

- **Vercel:** projeto `natalino-polato-rascunho`, *Root Directory* `natalino-polato` (o `vercel.json` define build e cabeçalhos).
- **Netlify Drop:** `cd dist && zip -r ../site-natalino-polato.zip . -x "*.DS_Store"` e arraste o zip.
