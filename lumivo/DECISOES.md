# Decisões — site da Lumivo Web

## Etapa 0: skills
- **Busca:** `npx skills find` para os 6 temas pedidos (design frontend, animação, performance, acessibilidade, SEO, QA com Playwright). Todas as buscas voltaram "No skills found": a rede deste ambiente não alcança o índice do ecossistema. Nada foi instalado por esse caminho.
- **Usado no lugar:** skills que já estavam disponíveis na sessão, gratuitas e sem pedir segredos:
  - `frontend-design`: plano de direção de arte e a revisão "isto parece genérico?" (etapas 1 a 5).
  - Lighthouse 12 (CLI oficial do Google) + Playwright já instalado: performance, a11y, SEO e QA visual (etapa 7).
- **Descartado:** instalar skills de terceiros sem poder ler a origem. Seria o oposto da regra "na dúvida, não instale".

## Stack
- **Vite 8 + React 19 + TypeScript + Tailwind 4**, com pré-render estático no build (`scripts/prerender.mjs`): o HTML sai com todo o conteúdo e o React hidrata. Next.js não se justifica numa página só.
- **motion** carregado com `LazyMotion`: o pacote de recursos (`domMax`, 21 KB gz) vem depois da primeira pintura.
- **Sem GSAP.** `useScroll`/`useTransform` resolveram revelação por palavra, pilha, parallax e o CTA sticky.
- **Lenis** só com ponteiro fino e sem movimento reduzido, via import dinâmico. No celular a rolagem é a nativa.
- **Sem Three.js.** Os mockups são CSS.
- **Entrada do hero em CSS puro** (keyframes liberadas pela classe `fonts-ok`, que um script inline põe após `document.fonts.ready`, com teto de 900 ms). Ela roda antes da hidratação, então o LCP não espera o JS. Sem JS, o texto aparece direto (os estados escondidos só valem com a classe `js`).
- **CSS inline no HTML** (9 KB gz), para eliminar o pedido que bloqueava a renderização.

## Tipografia
Testei Bricolage Grotesque, Instrument Sans, Onest e Geist no título real ("Veja seu site pronto antes de pagar.") em 390 px, numa captura comparativa com Playwright.
- **Escolhida: Bricolage Grotesque** (400 e 500). É a única com personalidade própria (o "a", o "g" e o "t" de grotesca editorial) e continua legível no corpo. Instrument e Geist ficaram neutras demais, e Onest ficou genérica.
- **Mono: Geist Mono 400**, só para rótulos e números.
- Três arquivos no total, em WOFF2, com subconjunto latino reduzido ao português (cerca de 18 KB cada), `font-display: swap` e preload dos dois pesos da Bricolage.

## Identidade
- **Logo oficial** (`referencias/logo-lumivo.png`, enviado pelo Pedro): o símbolo foi vetorizado com fidelidade a partir de medições do PNG (as duas peças do L com o corte diagonal, mais o ponto) em `src/components/Logo.tsx`. Ele gera o favicon (`public/favicon.svg`), os ícones PNG e a og:image (feita a partir do PNG original, sem redesenho).
- **Wordmark "LUMIVO"** no topo e no rodapé: texto em Bricolage com tracking aberto, próximo do logo. **Pendência:** se o Pedro tiver o arquivo vetorial do logo com a fonte original, trocar pelo SVG oficial.
- **Paleta:** a do anexo (preto-tinta + âmbar/champanhe), mais dois tons de ouro tirados do símbolo (`--ouro-a #EDCB7D`, `--ouro-b #B0842F`) para a marca e detalhes. Nenhum azul.
- **Conceito "luz":** cada gradiente é uma luz âmbar entrando por um canto. Nos quatro cartões de processo a luz anda de canto a canto (1 sup. esq. → 4 inf. dir.).

## [HIPÓTESE] resolvidas
| Hipótese | Decisão |
|---|---|
| Opção do quiz avança sozinha | Avança ao fim da animação de seleção (0,3 s, `onAnimationComplete`), sem `setTimeout` |
| Barra de progresso do quiz | Segmentada (5 perguntas + resumo), com o segmento atual em 35% |
| Cabeçalho ganha blur ao rolar | Sim, a partir de 24 px |
| Indicador à direita | Barra de progresso de leitura de 2 px, discreta |
| Cartões de processo: stagger ou pilha | Pilha sticky no mobile/tablet; **grade 2×2 com hover no desktop** (≥1024 px), como pede a seção 5 |
| Seletor de dispositivo troca sozinho | A cada 3 s enquanto visível, até o primeiro toque; desligado com movimento reduzido |
| Preview rolando dentro dos cards de projeto | Não se aplica: Projetos desligado (`secoes.projetos: false`) |

## Desvios conscientes do briefing
- **Vitrine sem projeto:** não há cases reais, então o notebook mostra um *esquema* de rascunho (barras, botão, ponto do WhatsApp), com a legenda "Esquema de um rascunho". As miniaturas em fileira foram removidas porque seriam projetos falsos.
- **Marquee com nomes, não logos:** são as tecnologias realmente usadas neste site. Evita desenhar marcas de terceiros.
- **Bloco "Experiências feitas para converter / 03 HOJE":** não incluído. Repetiria o CTA logo depois dele.
- **CTA "Vamos criar algo único?":** o texto é da referência e não pode ser copiado. Virou "Quer ver o seu site pronto?". Aparece uma vez como cartão sticky, e o mesmo botão está no hero, no topo (desktop) e no menu.
- **Serviços sem seta diagonal:** as linhas não levam a lugar nenhum, e uma seta prometeria um clique que não existe.
- **Revelação por palavra começa em 40%, não 25%:** com 25% o contraste caía para 2:1 (reprovado no axe). 40% dá cerca de 3:1 para texto grande e mantém o efeito.
- **Numeração das seções** em sequência (00 a 06), na ordem em que aparecem.
- **Tela de sucesso:** além do texto pedido, há uma linha avisando que, se o WhatsApp não abriu, basta tocar no botão. A mensagem só é enviada quando a pessoa toca em enviar no WhatsApp.
- **Mensagem do WhatsApp:** usa o modelo do anexo ao pé da letra ("do {negocio}"). Para nomes femininos fica "do Clínica Bella". Veja a pendência para o Pedro.

## Indexação
`config.site.rascunho = false`: é o site oficial em lumivoweb.com.br. Com `true`, o build aplica noindex em 3 camadas (meta robots, `robots.txt` Disallow, `X-Robots-Tag` em `_headers`) e mostra a faixa "Rascunho para avaliação".
