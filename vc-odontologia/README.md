# V&C Odontologia (Vilhena Carvalho) · site rascunho

Site de página única da V&C Odontologia, em Alfenas - MG. Vite + React + TypeScript +
Tailwind + motion, estático, sem backend. Contato só por WhatsApp.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (HTML pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Editar conteúdo

Todos os dados ficam em **`src/config.ts`**: nome, WhatsApp, Instagram, Maps,
endereço, horários, profissionais (CRO, áreas), atendimentos e mensagens do WhatsApp.
Os textos das seções ficam em `src/sections/`.

Texto entre colchetes, como `[formas de pagamento a confirmar]`, aparece no site
como placeholder tracejado. Basta trocar pelo dado confirmado.

## Ligar e desligar seções

Em `src/config.ts`, `CONFIG.secoes`. Para uma versão curta, deixe só `atendimentos`,
`profissionais`, `localizacao` e `ctaFinal` como `true`.

- Nota do Google: `mostrarNotaGoogle: true` e preencha `notaGoogle` (só com avaliações reais).
- Anos de experiência: `mostrarAnosDeExperiencia` fica `false` até a clínica comprovar.

## Trocar fotos e logo

1. Coloque os originais em `referencias/` (veja os nomes usados em `scripts/preparar-imagens.py`).
2. Rode `python3 -I scripts/preparar-imagens.py .` para gerar AVIF/WebP em `public/fotos/`.
3. Logo: `public/marca/logo-vc-96.webp` (monograma enviado pela clínica, usado como está).
   O arquivo tem só 96 px: **peça o logo em SVG ou PNG grande com fundo transparente**,
   inclusive uma versão escura para fundo claro.

## Desligar o rascunho (publicação final)

Só depois de a clínica aprovar e confirmar os dados:

1. `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio final.
2. `public/robots.txt`: troque por `User-agent: *` + `Allow: /`.
3. `public/_headers` e `vercel.json`: remova a linha `X-Robots-Tag: noindex, nofollow`.
4. `public/privacidade.html` e `public/404.html`: remova a faixa e o `noindex`.
5. `npm run build` e publique de novo.

## Deploy

- Vercel: `vercel deploy --prod --yes` nesta pasta (projeto `vc-odontologia-rascunho`).
  O `vercel.json` já define build, saída `dist` e cabeçalhos. Depois, atualize
  `CONFIG.siteUrl` com a URL final e publique de novo (canonical e og:url).
- Netlify Drop: arraste o zip do `dist/` (o `_headers` vai junto).
  `cd dist && zip -r ../site-vc-odontologia.zip . -x "*.DS_Store"`

## O que a clínica precisa confirmar

- [ ] **CRO do Dr. Otávio: 71566 ou 91566** (a arte e a bio dizem 71566; o texto de agendamento diz 91566)
- [ ] Nome completo do Dr. Otávio (Otávio de Carvalho Pereira?) e CRO do Dr. Tales (81321)
- [ ] Atendimentos oferecidos (hoje: implantes, prótese protocolo, reabilitação oral, diagnóstico e planejamento) e áreas de atuação de cada um
- [ ] História da clínica (texto da seção "Um novo capítulo") e compromissos de atendimento
- [ ] Autorização de uso de imagem dos dois doutores
- [ ] Fotos do espaço interno em alta resolução (recepção, consultório)
- [ ] Logo em alta qualidade (SVG ou PNG transparente, versões clara e escura)
- [ ] Formas de pagamento e convênios
- [ ] Estacionamento
- [ ] Acessibilidade
- [ ] Endereço e horários, inclusive o horário de segunda-feira (a ficha do Google mostrou feriado)
- [ ] Se querem usar a assinatura "Sorrisos transformam o jeito de ver o mundo" (`mostrarAssinatura`)
- [ ] Texto da página de privacidade

## Decisões de conformidade (CFO)

Sem promessa de resultado, superlativos, antes e depois, fotos de pacientes,
depoimentos, preços ou anos de experiência. Fora do site por decisão: "referência em
implantes", "+10 anos", "transformar vidas", "novos sorrisos", "tecnologia" e
"segurança" como diferencial. Nenhum profissional é chamado de especialista.

## Notas técnicas

- O HTML é pré-renderizado no build (`scripts/prerender.mjs`) e o CSS vai embutido.
- A lib `motion` só é carregada depois da página pronta, e nunca com movimento
  reduzido (`src/lib/movimento.ts`). Sem ela, tudo aparece na composição final.
- O mapa do Google só carrega quando a pessoa clica em "Mostrar o mapa aqui" (sem cookies antes disso).
