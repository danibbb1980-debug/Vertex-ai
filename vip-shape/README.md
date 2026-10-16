# VIP Shape Academia — site oficial

Landing page da VIP Shape Academia (Poços de Caldas – MG), focada em gerar
contatos pelo WhatsApp. App Next.js independente dentro do repositório da
Vertex: tem o próprio `package.json` e build.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react.
Sem framer-motion: todas as animações são CSS e respeitam `prefers-reduced-motion`.

## Rodando

```bash
cd vip-shape
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint (eslint-config-next)
npm run typecheck  # tsc --noEmit
npm run build && npm start
```

TypeScript fica em 6.0 neste app (e não no 7.0 do site da Vertex) porque o
`typescript-eslint` ainda não suporta o TS 7 — com ele o lint não roda.

### Deploy na Vercel

Importe o repositório e defina **Root Directory = `vip-shape`**. Ao conectar o
domínio oficial, configure `NEXT_PUBLIC_SITE_URL` (ver `.env.example`): só então
a tag canonical é emitida, e Open Graph/sitemap/JSON-LD passam a usar o domínio.

## Onde mudar cada coisa

| O quê | Onde |
|---|---|
| Endereço, telefone, links, nota do Google, horários, aulas, mensagens de WhatsApp, fotos | `lib/site-data.ts` (fonte única) |
| Perguntas do FAQ | `lib/faq.ts` |
| Dados estruturados (ExerciseGym) | `lib/structured-data.ts` |
| Cores e tipografia | `app/globals.css` (`@theme`) e `app/layout.tsx` |
| Logotipo | `components/ui/Logo.tsx` |

```
app/            layout (metadata, fontes), page, globals.css, OG image, icon, robots, sitemap, 404
components/
  layout/       Header (menu mobile), Footer
  sections/     Hero, IdentityStrip, Differentials, Structure, Classes, Reviews,
                Partnerships, FinalCta, Location, Faq
  ui/           Button, SectionHeading, Photo, Reveal, Logo, BrandIcons,
                FloatingWhatsApp, InterestForm, OpenStatus, ClientEnhancements
lib/            site-data, faq, structured-data
public/images/  fotos reais da unidade
```

## Decisões sobre conteúdo

- **Nada inventado.** Sem preços, planos, promoções ou serviços não confirmados.
  Perguntas sobre valores e matrícula levam ao WhatsApp.
- **Avaliações.** Nota 5,0 e 70 avaliações aparecem sempre com a observação de
  que foram informadas pela academia (outubro de 2026). Os comentários de Felipe
  Amaro, Henrique Silva e Paloma Albino são **resumos de temas**, sem aspas e sem
  frases atribuídas. Para usar citações, copie o texto original do Google.
  Sem fotos de avaliadores.
- **Sem `aggregateRating` no JSON-LD**: a nota é autodeclarada, e marcar estrelas
  próprias viola as diretrizes do Google. Também não há coordenadas, e-mail ou CNPJ.
- **Convênios** aparecem como texto (Wellhub, TotalPass a partir do TP1+), sem
  logotipos oficiais, sempre com o aviso para confirmar a elegibilidade.
- **Formulário de interesse** não envia dados para lugar nenhum: valida, monta a
  mensagem e abre o WhatsApp — e diz isso ao visitante.
- **Status "Aberto agora"** é calculado no navegador, no fuso America/Sao_Paulo,
  a partir dos horários oficiais.

## Fotos e logotipo — pendências

- As fotos em `public/images/` são **reais da unidade**, tiradas das imagens e do
  vídeo enviados (os frames foram recortados para remover a marca d'água). A
  resolução é baixa (≈ 400–500 px de largura), então ficam suaves em telas
  retina. **Substitua pelos originais em alta resolução** mantendo o nome do
  arquivo, ou ajuste `width`/`height` em `photos` (`lib/site-data.ts`).
- Não há fotos das aulas coletivas: os cards de Hit Dance, Dança e Jump usam
  composição tipográfica, para não exibir fotos de outro lugar como se fossem da
  academia.
- O logotipo do header é um **redesenho em SVG** do arquivo enviado
  (`public/brand/logo-original.jpg`, 150 × 150 px). Troque em
  `components/ui/Logo.tsx` quando houver o vetor oficial.

## Limitações conhecidas

- O mapa usa o endpoint público de incorporação do Google Maps (sem chave de
  API), buscando pelo endereço. Se for bloqueado, o bloco mostra o endereço e
  o botão "Como chegar" abre o link oficial do Maps.
- Confirme no celular que `https://wa.me/5535991583270` abre a conta certa — o
  WhatsApp responde igual para qualquer número bem formado.
