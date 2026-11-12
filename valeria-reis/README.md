# Espaço Saúde e Mulher · Dra. Valéria Reis (rascunho)

Site de página única do consultório de ginecologia e obstetrícia em Poços de Caldas - MG.
Vite + React + TypeScript + Tailwind 4 + `motion`. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (com o HTML pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Onde editar

Todos os dados estão em **`src/config.ts`**. Regra: campo vazio = o elemento não aparece (nada de placeholder).

| O quê | Campo |
|---|---|
| Faixa "Rascunho" + noindex | `rascunho` (`true`/`false`) |
| URL pública (canonical, og:url, og:image) | `siteUrl` |
| CRM | `crm` e `crmUF`. Preenchido, aparece no hero, no bloco da médica, no rodapé (com "Responsável técnica") e no JSON-LD |
| Nome completo | `nomeCompleto` (vazio = usa "Dra. Valéria Reis") |
| Foto da médica | coloque o arquivo em `public/fotos/` e preencha `foto` (ex.: `/fotos/dra-valeria.jpg`) e `fotoAlt`. **Só com autorização** |
| Vínculo com a Santa Casa | `mostrarSantaCasa` (hoje `false`) e textos em `santaCasa` |
| Saúde íntima e estética ginecológica | `mostrarEsteticaIntima` (hoje `true`) |
| Telefone fixo / e-mail | `telefone`, `email` (vazios = sem botão "Ligar" e sem e-mail) |
| Horários | `horarios` (dias, abertura, fechamento, `almoco` opcional). O seletor de data e os horários do formulário saem daqui |
| Ligar/desligar seções | `secoes` |
| Textos de atendimentos, etapas, "para quem é" | `atendimentos`, `passos`, `paraQuem` |

**Logo:** o monograma VM foi redesenhado em SVG a partir de `referencias/logo-espaco-saude-e-mulher.jpg`
(`src/components/Monograma.tsx` e `public/favicon.svg`). Se chegar um PNG/SVG em alta resolução, substitua
`public/og-logo.jpg` (imagem de compartilhamento) e, se quiser, ajuste os traços do componente.

## Pontos sensíveis

- **Saúde íntima e estética ginecológica** é tema sensível em publicidade médica (CFM 2.336/2023). O texto é
  neutro e geral, sem técnicas, aparelhos, resultados ou imagens. Pode ser desligada em `mostrarEsteticaIntima`.
  O botão dessa área usa a mensagem geral do WhatsApp, sem citar o tema.
- **Santa Casa**: cargos e vínculos institucionais ficam fora até a médica decidir (`mostrarSantaCasa`).
- As mensagens pré-escritas do WhatsApp não citam gestação, sintomas nem dados de saúde.

## Antes da publicação definitiva

1. **CRM** visível (obrigatório pelo CFM, Resolução 2.336/2023). Sem ele o site não pode ir ao ar como definitivo.
2. **Confirmar que o RQE 50585 é de Ginecologia e Obstetrícia.**
3. **Nome completo** da médica (o Instagram exibe "Valeria Reis Nascimento"; confirmar antes de usar).
4. **Horários**: o Google informa 08h00 às 17h30; o atendimento automático do WhatsApp diz 8h às 17h. Confirmar.
5. **Fotos** da médica e do consultório, com autorização (os prints do Instagram não foram usados).
6. Decidir sobre `mostrarSantaCasa` e `mostrarEsteticaIntima`.
7. Desligar o rascunho: `rascunho: false` em `src/config.ts`, **e** remover o `X-Robots-Tag` de `vercel.json`
   e de `public/_headers`, e trocar `public/robots.txt` por `Allow: /`.
8. Atualizar `siteUrl` com o domínio final e fazer novo build.

## Deploy

- **Vercel:** `vercel deploy --prod --yes` dentro desta pasta (o `vercel.json` já define Vite, `dist/` e o noindex).
- **Netlify / Cloudflare Pages / qualquer host estático:** publique o conteúdo de `dist/` (o `_headers` já vai junto).
