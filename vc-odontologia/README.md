# V&C Odontologia (Vilhena Carvalho) · site rascunho

Site de página única da V&C Odontologia, em Alfenas - MG. Vite + React + TypeScript +
Tailwind + motion, estático, sem backend. Todo contato acontece pelo WhatsApp
(inclusive o formulário de agendamento, que só monta a mensagem).

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

O site não mostra marcações "a confirmar": o que ainda não foi confirmado
(pagamento, convênios, estacionamento, acessibilidade) simplesmente não aparece.
A lista de pendências fica abaixo e nos comentários `CONFIRMAR COM A CLÍNICA` do código.

## Ligar e desligar seções

Em `src/config.ts`, `CONFIG.secoes`. Para uma versão curta, deixe só `atendimentos`,
`profissionais`, `localizacao` e `ctaFinal` como `true`.

- Nota do Google: `mostrarNotaGoogle: true` e preencha `notaGoogle` (só com avaliações reais).
- Anos de experiência: `mostrarAnosDeExperiencia` fica `false` até a clínica comprovar.

## Formulário "Solicitar agendamento" (#agendar)

Não guarda nem envia dados: monta a mensagem e abre `wa.me` em nova aba. Regras em
`src/lib/agenda.ts`; ajustes em `CONFIG.agendamento`:

- `exigirAtendimento`: torna o campo "Atendimento desejado" obrigatório.
- `intervaloAlmoco`: horários excluídos da lista (hoje `12:00–13:00`, **a confirmar**; `null` = sem intervalo).
- `atendeUrgencia`: mostra o aviso "Está com dor ou urgência?" (desligado: a clínica não é pronto-socorro).
- Data e horário são botões de toque (não o calendário nativo, que no iPhone deixava
  escolher datas passadas). O site mostra os próximos 12 dias de atendimento ("Ver mais
  datas" amplia até 36); dias fechados e datas passadas não aparecem.
- Os horários vêm de `CONFIG.horarios`, em blocos de 1 hora, sem o almoço e sem o
  horário de fechamento. Se a data for hoje, os horários que já passaram somem.

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

- [ ] **CRO do Dr. Otávio**: o site usa 71566 (arte e bio); o texto de agendamento diz 91566. Confirmar.
- [ ] Nome completo do Dr. Otávio (Otávio de Carvalho Pereira?) e CRO do Dr. Tales (81321)
- [ ] Atendimentos oferecidos (hoje: implantes, prótese protocolo, reabilitação oral, diagnóstico e planejamento) e áreas de atuação de cada um
- [ ] História da clínica (texto da seção "Um novo capítulo") e compromissos de atendimento
- [ ] Autorização de uso de imagem dos dois doutores
- [ ] Fotos do espaço interno em alta resolução: as atuais (recepção, sala de espera, consultório, sala de atendimento) vêm do Google Maps, com ~200 px, ampliadas. A TV do consultório foi desfocada (mostrava uma radiografia)
- [ ] Logo em alta qualidade (SVG ou PNG transparente, versões clara e escura)
- [ ] Formas de pagamento e convênios
- [ ] Estacionamento
- [ ] Acessibilidade
- [ ] Endereço e horários, inclusive o horário de segunda-feira (a ficha do Google mostrou feriado)
- [ ] Intervalo de almoço (o formulário exclui 12h–13h por padrão) e se o atendimento deve ser obrigatório no formulário
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
