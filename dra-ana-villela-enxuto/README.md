# Site Dra. Ana Villela | Versão enxuta (rascunho)

Segunda versão, curta e direcionada, do site da Dra. Ana Villela. A versão longa continua em `../dra-ana-villela/`.
Objetivo único: em 5 segundos a pessoa entende quem é a doutora e toca em "Agendar avaliação" (WhatsApp).

## Estrutura

1. Header mínimo: assinatura + botão "Agendar avaliação" (leva ao agendamento).
2. Hero em azul-noite (a cor do blazer e do jaleco da doutora): foto em arco com um feixe de luz champanhe que percorre a moldura uma vez, título revelado palavra a palavra, botão para o agendamento e atalho direto para o WhatsApp. Nome e CRO na legenda da foto.
3. Tratamentos: lista editorial. "Agendar" em cada linha leva ao agendamento já com o tratamento escolhido.
4. Sobre: foto e duas frases, com CRO e especialidade a confirmar.
5. Agendamento pelo WhatsApp (`src/components/Agendamento.tsx`): a pessoa escolhe tratamento, um dos próximos 5 dias úteis e o período (manhã ou tarde, nos horários da ficha), vê a mensagem montada em forma de conversa e toca em "Enviar pelo WhatsApp". O site não guarda nem envia nada: a mensagem só sai quando a pessoa envia no próprio WhatsApp, e o horário é confirmado na conversa. Endereço, horários com almoço, "Como chegar" e Instagram ficam ao lado.

Referências do 21st.dev: "Vertical Cut Reveal" (título), "Border Beam Panel" (feixe na moldura) e "Time Slot Picker" (faixa de dias e períodos como grupos de rádio). Todas reescritas em CSS e React, sem bibliotecas extras.

## Movimento

Tudo fica em `src/motion.ts` (um único laço de animação) e no fim de `src/index.css`:

- Abertura com a assinatura desenhada e uma cortina que sobe (só na primeira visita da sessão).
- Título do hero palavra a palavra, foto que "assenta" e feixe de luz na moldura em arco.
- Rolagem suave (Lenis) com mouse e trackpad; no celular fica a rolagem nativa.
- Parallax nas fotos, títulos revelados linha a linha, foto do "Sobre" revelada como cortina.
- Faixa de palavras (Naturalidade, Proporção, Harmonia...) que acelera com a rolagem.
- Tratamentos: a linha se enche de azul-noite e uma etiqueta "Agendar" segue o cursor.
- Agendamento: marcador que desliza até a opção escolhida e "digitando..." antes da mensagem nova.
- Botões magnéticos, brilho no botão principal, linha de progresso de leitura no header e assinatura grande no rodapé.
- Com "reduzir movimento" ativado no sistema, a abertura, a rolagem suave, o parallax e a faixa são desligados.

## Medições (build atual)

| Largura | Telas de rolagem | Limite |
|---|---|---|
| 375 x 812 | 3,9 | 4 |
| 375 x 667 | 4,8 | — |
| 768 x 1024 | 3,2 | — |
| 1280 x 820 | 2,99 | 3 |

- Botão "Agendar minha avaliação" na primeira tela em 375 x 667 e 375 x 812.
- Palavras visíveis: ~215, das quais ~40 são as opções do agendamento e a prévia da mensagem e 10 são a faixa de palavras.
- Lighthouse (celular), com todas as animações: desempenho 98 a 99, acessibilidade 100, boas práticas 100.

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
