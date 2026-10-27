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

- Um valor `PENDENTE` aparece no site como **[A CONFIRMAR]**. Troque pelo texto real.
- Procure por `CONFIRMAR COM A CLÍNICA` no código para ver cada ponto pendente.
- Os textos das seções ficam em `src/sections/`.

## Ligar e desligar seções

Em `CONFIG.secoes`, mude para `false` o que não quiser mostrar (marquee, primeiros cuidados,
equipe, estrutura, FAQ etc.). Para uma versão curta, deixe só `quandoProcurar`, `atendimentos`,
`contato` e `ctaFinal`.

## Fotos e logo

- **Fotos:** coloque os arquivos em `public/fotos/` (WebP, até ~1600 px de largura) e preencha
  `CONFIG.fotos.hero` (ex.: `'/fotos/fachada.webp'`) e `CONFIG.fotos.galeria`.
  Sem fotos, o site mostra blocos reservados "(substituir)". Nada de fotos de pacientes, bocas,
  procedimentos ou antes e depois.
- **Logo:** `public/logo.webp` e os ícones (`favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`)
  vieram do JPG de 150 px recebido. Um PNG ou SVG em alta resolução melhoraria a nitidez.
  O verde da marca (`#00A346`) foi amostrado desse arquivo.

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

## O que a clínica precisa confirmar

- [ ] Nome oficial da clínica e do responsável
- [ ] Endereço e cidade (hoje vem da ficha do Google); depois disso dá para ligar `CONFIG.mostrarMapa`
- [ ] Horário de cada dia da semana (só a terça-feira foi vista como 24 horas) e feriados
- [ ] Responsável técnico e CRO (obrigatório no rodapé da versão final)
- [ ] Equipe: nome, "Cirurgião(ã)-dentista" e CRO de cada profissional
- [ ] Lista de atendimentos (emergência, pediátrico, estético, sedação) e o texto da sedação
- [ ] Convênios e formas de pagamento
- [ ] Estacionamento e acessibilidade
- [ ] Fotos reais da clínica (fachada, recepção, consultório) e logo em alta resolução
- [ ] Texto de "Primeiros cuidados" e do aviso de casos graves (revisar com o responsável técnico)
- [ ] Texto institucional da seção "A clínica"
- [ ] Responsável pelo tratamento de dados (página de privacidade)
- [ ] Se pode mostrar a nota do Google (`CONFIG.mostrarNotaGoogle`); nunca exibir texto de avaliações
