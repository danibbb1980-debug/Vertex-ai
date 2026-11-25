# QA — site da Lumivo Web

Ambiente: build de produção (`npm run build`), servido localmente com gzip. Capturas com Playwright/Chromium. Lighthouse 12 em modo mobile padrão (4G simulado, CPU 4×). Data: 25/11/2026.

## Passada 1: visual
Capturas da página inteira, rolando, em **390×844, 360×640, 768×1024 e 1440×900**.
- [x] `scrollWidth` igual à largura da viewport nos 4 tamanhos (sem scroll horizontal).
- [x] Nenhum texto cortado ou sobreposto (exceto o "LUMIVO" gigante, cortado de propósito).
- [x] Grão aplicado; gradientes sem faixas visíveis.
- [x] Nenhum conteúdo inventado, nenhum "lorem", nenhum nome, logo ou texto da referência.
- [x] Console sem erros, sem warnings, sem 404 (os 4 tamanhos e o fluxo do quiz).

## Passada 2: movimento e interação
- [x] Hero: linhas sobem por máscara, cartão e botão em sequência, só depois das fontes.
- [x] "LUMIVO" sobe com parallax e o feixe de luz o atravessa ao rolar.
- [x] Conceito e Sobre acendem palavra a palavra.
- [x] Pilha: o cartão anterior encolhe e escurece (mobile); grade 2×2 com hover (desktop).
- [x] Seletor: morph em 0,7 s, legenda muda, troca automática até o primeiro toque.
- [x] Serviços: divisória desenha; micro-ilustrações só rodam visíveis (IntersectionObserver + aba ativa).
- [x] Método: linha preenche, passos acendem, o check final desenha (confirmado com espera de 2,5 s).
- [x] Quiz (script `scripts/qa-quiz.cjs`): menu abre e fecha com Esc, foco volta ao hambúrguer; nome vazio treme e mostra erro inline; WhatsApp "3599" é recusado; Voltar preserva a área escolhida; resumo correto; Enviar abre o WhatsApp; Esc fecha, foco volta a "Quero ver meu rascunho", rolagem destravada.
  Mensagem gerada: `Olá, sou Maria Souza, do Clínica Bella (Poços de Caldas). Área: Estética e beleza. Site atual: Não tenho. Meu Instagram: @clinicabella. Quero ver o rascunho do meu site.` → `https://wa.me/5535984487206?text=…`
- [x] Movimento reduzido (emulado): título sem transform, texto inteiro sem divisão por palavra, marquee vira lista sem animação, pilha e CTA sem sticky, quiz abre sem o flash e com foco no campo.
- [x] Teclado: ordem de Tab lógica (pular para o conteúdo → logo → CTA → menu → hero → chips → CTA → contatos), foco visível em todos.

## Passada 3: técnica

### Lighthouse mobile (3 execuções, servidor com gzip)
| Execução | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|
| 1 | 98 | 100 | 100 | 100 | 2,1 s | 0 | 70 ms | 1,7 s |
| 2 | 98 | 100 | 100 | 100 | 2,1 s | 0 | 70 ms | 1,7 s |
| 3 | 98 | 100 | 100 | 100 | 2,1 s | 0 | 40 ms | 1,7 s |

**LCP simulado está em 2,0 a 2,1 s, 0,1 s acima da meta de 2,0 s.** O elemento de LCP é o parágrafo do hero (não animado). O LCP já não depende do JS (CSS inline, entrada em CSS puro), e o que resta é a disputa de banda, no 4G simulado, entre o JS (117 KB gz) e as fontes. Na Cloudflare (brotli + CDN) deve ficar abaixo. **Medir de novo no domínio publicado.**

### Peso
```
dist/assets/index-*.js      358 KB │ gzip 116 KB   ← JS inicial (meta ≤ 150 KB: ok)
dist/assets/features-*.js    65 KB │ gzip  21 KB   ← recursos do motion, depois da 1ª pintura
dist/assets/lenis-*.js       19 KB │ gzip   5 KB   ← só desktop
dist/assets/Quiz-*.js         9 KB │ gzip   3 KB   ← só ao abrir o quiz
CSS: 9 KB gzip, inline no HTML. Fontes: 18 + 18 + 8 KB.
```

## Defeitos encontrados e corrigidos
1. **O feixe de luz sobre "LUMIVO" não aparecia.** O motion passava a opacidade ligada ao scroll para uma ScrollTimeline nativa, que ficava presa em 0,09. Correção: opacidade via variável CSS (`--b`). O mesmo defeito, mais sutil, afetava o escurecimento da pilha (`--s`) e o CTA (`--o`).
2. **Borda dura no fim do hero:** o feixe era cortado pela caixa da palavra e o gradiente do hero terminava seco. Correção: máscara de fade na base da palavra e degradê para o fundo no fim do hero.
3. **Campo do quiz remontava a cada erro** (`key={tremer}`): perdia foco e estado, e o script de QA quebrou com "element not attached". Correção: o tremor alterna entre duas variantes iguais, sem remontar.
4. **`aria-label` em `<p>`** (proibido pelo ARIA) no texto dividido por palavra. Correção: cópia do texto em `.sr-only` e spans visíveis com `aria-hidden`.
5. **Contraste:** palavras apagadas a 25% (2:1), número de passo inativo (3,8:1 a 12 px) e o **botão do CTA a 30% de opacidade** durante a animação (1,4:1). Correção: 40% mínimo nas palavras, `--texto-2` nos números, e só os parágrafos do CTA esmaecem (o botão fica sempre em 100%). Acessibilidade foi de 92 para 100.
6. **Cartão do CTA com um vão vazio no meio** no celular (título no topo, resto embaixo). Correção: conteúdo alinhado na base, com a luz ocupando o topo.
7. **Desktop sem a grade 2×2 do processo** (a pilha sticky esticava em 1280 px). Correção: grade com hover a partir de 1024 px.
8. **CSS bloqueando a renderização** e fontes completas. Correção: CSS inline no build e subconjunto português nas fontes (−4 KB cada).
9. **O build da Vertex na raiz** iria varrer `lumivo/` (tsconfig `**/*.tsx` e Tailwind). Correção: `lumivo` excluído no `tsconfig.json` e com `@source not` em `app/globals.css`.

## Não verificado aqui
- Teclado virtual real em iOS/Android (o código usa `100dvh`, `scrollIntoView({block:'center'})` no foco e rolagem interna). Testar num celular de verdade.
- Abertura real do WhatsApp: a rede do ambiente bloqueia wa.me. O link gerado foi conferido acima.
- Profile de 5 s de scroll no mobile emulado: não gravado. TBT de 40 a 70 ms no Lighthouse.
