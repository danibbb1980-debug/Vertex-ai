# Site Dra. Ana Villela | Versão enxuta (rascunho)

Segunda versão, curta e direcionada, do site da Dra. Ana Villela. A versão longa continua em `../dra-ana-villela/`.
Objetivo único: em 5 segundos a pessoa entende quem é a doutora e toca em "Agendar avaliação" (WhatsApp).

## Estrutura (5 blocos)

1. Header mínimo (assinatura + botão "Agendar avaliação").
2. Hero com foto, título, uma frase, botão e CRO.
3. Tratamentos: 3 cartões compactos, cada um abre o WhatsApp com mensagem do tratamento.
4. Sobre: foto e duas frases, com CRO e especialidade a confirmar.
5. Contato: endereço, horários com almoço, WhatsApp, Como chegar e Instagram. Rodapé de uma linha.

## Medições (build atual)

| Largura | Telas de rolagem | Limite |
|---|---|---|
| 375 x 812 | 3,7 | 4 |
| 768 x 1024 | 2,6 | — |
| 1280 x 820 | 2,8 | 3 |

- Palavras visíveis (header + conteúdo, sem rodapé): ~145 (limite ~170).
- Botão "Agendar minha avaliação" na primeira tela em 375 x 667 e 375 x 812.
- Efeitos: um de entrada (título palavra a palavra, adaptado do "Vertical Cut Reveal" do 21st.dev, em CSS) e um de rolagem (cartões de tratamento).

## Comandos

```bash
npm install
npm run dev
npm run build   # gera dist/ com HTML pré-renderizado
```

Deploy: projeto Vercel `dra-ana-villela-enxuto`, ligado a este repositório com Root Directory `dra-ana-villela-enxuto` (o `vercel.json` define build, pasta `dist` e os cabeçalhos de noindex e cache). Também há `netlify.toml` e o zip do `dist/` para o Netlify, se preferir.

## Como editar

Mesmo esquema da versão longa: dados em `src/config.ts`, fotos em `public/fotos/`, textos em `src/components/Hero.tsx` e `src/components/Blocos.tsx`.
Para desligar o rascunho, siga o README da versão longa (`rascunho: false`, `_headers`, `robots.txt`, privacidade e 404).

## Pendências com a doutora

As mesmas da versão longa: CRO e responsável técnico, especialidade, endereço e horários, serviços, citação da marca Invisalign, vínculo com a clínica parceira, autorização das fotos (a foto com luvas está sem edição, com o quadro de sorriso e a marca da clínica ao fundo), logo e domínio definitivo.
