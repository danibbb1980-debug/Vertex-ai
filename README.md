# Vertex Web Studios

Landing page de conversão para uma agência digital que vende sites profissionais
por assinatura (R$197/mês) para negócios locais no Brasil.

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · pronto para Vercel.

---

## Rodando o projeto

```bash
npm install
cp .env.example .env.local   # configure o WhatsApp e a URL
npm run dev                  # http://localhost:3000
```

```bash
npm run build      # build de produção
npm run typecheck  # tsc --noEmit
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_WHATSAPP` | Número no formato internacional, só dígitos (ex: `5511987654321`). Alimenta todos os CTAs de WhatsApp. |
| `NEXT_PUBLIC_SITE_URL` | URL canônica. Usada em metadata, Open Graph, sitemap e robots. |

---

## Antes de publicar

1. **`NEXT_PUBLIC_WHATSAPP`** — sem isso, todos os botões de WhatsApp apontam para um número de exemplo.
2. **Conectar o formulário** — `components/ui/LeadForm.tsx` tem um `setTimeout` no lugar do envio real. Aponte para o seu CRM ou route handler. O fallback de WhatsApp continua funcionando de qualquer forma.
3. **Depoimentos** — os atuais são ilustrativos e estão rotulados como tal em `lib/content.ts`. Ao trocar por clientes reais, remova o aviso (`testimonials.disclaimer`).
4. **Portfólio** — os projetos são conceituais e estão identificados. Ao usar trabalhos reais, atualize `portfolio.disclaimer`.
5. **Analytics** — `lib/analytics.ts` envia eventos para `dataLayer`/`gtag`. Instale GTM ou GA4 para começar a medir.
6. **Redes sociais e e-mail** — atualize em `lib/site.ts`.

---

## Estrutura

```
app/
  layout.tsx           metadata, fontes, skip link
  page.tsx             composição das seções + JSON-LD
  globals.css          design tokens (@theme) e camada base
  icon.tsx             favicon gerado
  opengraph-image.tsx  imagem OG gerada no build
  sitemap.ts robots.ts
components/
  sections/            uma seção por arquivo
  ui/                  Button, LeadForm, Nav, StickyCta, Reveal, Mockups...
lib/
  site.ts              preço, prazo, WhatsApp, formatação BRL
  content.ts           todo o texto da página, em pt-BR
  analytics.ts         eventos de conversão
design-system/         saída da skill ui-ux-pro-max
```

Todo o texto vive em `lib/content.ts` e todos os números do negócio em
`lib/site.ts` — mudar o preço de R$197 para outro valor atualiza a página
inteira, incluindo FAQ, metadata e imagem de Open Graph.

---

## Decisões de CRO

O briefing original descrevia a estrutura da página. As mudanças abaixo foram
feitas para maximizar conversão de donos de negócio local — o público que
efetivamente decide aqui.

### 1. Reversão de risco acima da dobra
Três selos (**sem fidelidade · sem taxa de setup · no ar em 7 dias**) aparecem
*antes* do H1. As três objeções que matam uma oferta por assinatura no Brasil
são fidelidade, custo escondido e prazo indefinido. Respondê-las antes da
headline evita que a leitura comece com desconfiança.

### 2. Ancoragem de preço
R$197/mês sozinho comunica "site barato". Ao lado de **R$3.500 a R$8.000 à
vista**, comunica "mesmo padrão, sem o desembolso". É a mudança de maior impacto
na página. Reforçada por "menos de R$6,57 por dia".

### 3. FAQ — a maior lacuna do briefing
O briefing não tinha seção de objeções. Para assinatura vendida a PME, objeção
não respondida é o principal motivo de abandono. Foram adicionadas 9 perguntas
reais, incluindo as difíceis: *"se eu cancelar, perco o site?"*, *"por que
assinatura?"*, *"tem taxa escondida?"*, *"vocês garantem o primeiro lugar no
Google?"* (resposta: não, e desconfie de quem garante).

### 4. Transparência como conversor
Uma seção **"o que não está incluso"** dentro do card de preço. Custa algumas
conversões imediatas e evita churn e disputa depois — além de neutralizar o
"qual é a pegadinha?" que um preço baixo naturalmente provoca.

### 5. Prazo explícito em cada etapa
Cada passo do "como funciona" tem quando acontece (Dia 1 · Dias 2-5 · Dia 7 ·
Todo mês). "Quanto tempo demora?" é a pergunta mais frequente na pré-venda.

### 6. Terceira coluna na comparação
O briefing comparava só com agência tradicional. O concorrente real de um dono
de negócio local hoje é **fazer sozinho** em construtor ou IA. Deixar essa opção
sem resposta é deixar a alternativa mais forte de pé.

### 7. Formulário embutido no CTA final
Em vez de um botão que leva a outro lugar, o formulário está na própria seção.
Três campos apenas (nome, WhatsApp, segmento) — cada campo a mais reduz
conclusão. Com WhatsApp como caminho paralelo, que é onde lead de negócio local
brasileiro realmente converte.

### 8. Barra fixa no mobile
A maior parte do tráfego é mobile, e no mobile o CTA sai da tela e só volta no
rodapé. A barra mantém preço + ação a um toque. Aparece depois do hero e some
sobre o CTA final, para não competir com o formulário.

### 9. Rotulagem honesta de depoimentos e portfólio
Depoimentos e projetos estão marcados como ilustrativos/conceituais. Além da
exigência legal (CDC art. 37 e CONAR), um depoimento falso percebido custa mais
confiança do que ganha — e visitante desconfiado não preenche formulário.

### 10. Micro-copy em todo CTA
Cada botão principal diz o que acontece depois ("Resposta em até 2 horas úteis",
"Sem cartão de crédito"). Ambiguidade sobre o próximo passo é fonte silenciosa
de abandono.

### 11. Problema em cenários, não em estatísticas
A seção de problema descreve momentos concretos de perda em vez de estatísticas
inventadas. Nenhum número não verificável foi usado na página.

### 12. Rastreamento de conversão
Todo CTA reporta seção e rótulo via `trackCta`. Sem medição não há otimização.

---

## Acessibilidade e performance

- Contraste ≥ 4.5:1 em todo texto; foco visível preservado em todos os controles
- Alvos de toque ≥ 44px
- `prefers-reduced-motion` respeitado em toda animação
- Zoom não bloqueado (sem `maximum-scale`)
- Uma `<h1>`, hierarquia de headings sem saltos, `<nav>`/`<footer>`/`<section>` semânticos
- Sem overflow horizontal em 390px, 768px, 1024px e 1440px
- Skip link para o conteúdo principal
- Página 100% estática; mockups em CSS puro (sem requisição de imagem)
- JSON-LD: `ProfessionalService`, `Service` com preço, e `FAQPage`

---

## Design system

A paleta e a tipografia vieram da skill `ui-ux-pro-max`
(`design-system/vertex-web-studios/MASTER.md`), com uma alteração deliberada: a
skill sugeriu paleta clara com dourado para o padrão "Trust & Authority"; a
identidade da marca pede preto profundo com gradiente violeta/índigo. Foram
mantidos o padrão estrutural (*Pricing-Focused Landing*: CTA fixo, FAQ,
tratamento de objeções) e a tipografia **Space Grotesk / Inter**.
