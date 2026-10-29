# CIOM Odontologia · site (rascunho)

Site de página única da CIOM Odontologia, Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (com HTML pré-renderizado)
npm run preview   # serve o dist/
```

## Onde editar

Tudo fica em `src/config.ts`. Regra geral: **campo vazio (`''` ou `[]`) = o bloco não aparece**, e o layout se reorganiza.

| O que | Campo |
|---|---|
| Ligar/desligar seções | `secoes` (`clinica`, `espaco`, `atendimentos`, `comparativo`, `quandoProcurar`, `comoFunciona`, `acolhimento`, `duvidas`, `localizacao`, `agendar`, `ctaFinal`) |
| Faixa de rascunho | `rascunho: true/false` (também liga/desliga as metas `noindex`) |
| WhatsApp | `whatsapp` e `telefoneExibicao` |
| Endereço | `endereco` (o `numero` está vazio de propósito) |
| Horários | `horarios` (`abre`, `fecha`, e opcionalmente `almocoInicio`/`almocoFim`; o formulário usa isso para bloquear dias e gerar os horários) |
| Atendimentos | `atendimentos` |
| Profissionais | `profissionais: [{ nome, formacao, cro, foto }]` (hoje vazio, a seção não aparece) |
| Responsável técnico | `responsavelTecnico: { nome, cro }` (aparece no rodapé e no JSON-LD só com os dois preenchidos) |
| Fotos | `fotos.equipe`, `fotos.espaco`, `fotos.fachada`. Arquivos em `public/fotos/` |
| Logo | `logo.src` (vazio = assinatura tipográfica "CIOM Odontologia") |
| URL pública | `siteUrl` (usada em canonical, og:url, og:image e JSON-LD; nunca localhost) |

Os originais recebidos (logo e fotos do Google Maps) estão em `referencias/`.

## Para sair do rascunho e publicar

Falta, antes da publicação definitiva:

1. **Responsável técnico com CRO** (exigência do CFO). Preencher `responsavelTecnico`.
2. **Número do endereço**: hoje aparece só "R. Olegário Maciel - Centro". Preencher `endereco.numero`.
3. **Conferir o WhatsApp**: recebido como "+55 35 8856-8104"; foi acrescentado o 9 → `5535988568104`.
4. **Fotos em boa resolução**: as atuais vêm do Google Maps (~200 px de largura) e ficam suaves quando ampliadas. Substituir em `public/fotos/` mantendo os nomes.
5. **Logo em alta resolução** (de preferência SVG ou PNG transparente). O atual tem 96 px.
6. Desligar o rascunho:
   - `rascunho: false` em `src/config.ts`;
   - remover a linha `X-Robots-Tag` de `public/_headers` e de `vercel.json`;
   - trocar `public/robots.txt` por `User-agent: *` / `Allow: /`;
   - remover as metas `robots` de `public/privacidade.html` e `public/404.html`.
7. Atualizar `siteUrl` com o domínio final e gerar de novo.

## Deploy

- Vercel: projeto `ciom-odontologia-rascunho`, raiz `ciom-odontologia/` (o `vercel.json` já define build e `dist`).
- Qualquer hospedagem estática: enviar o conteúdo de `dist/` (o `_headers` funciona na Netlify/Cloudflare Pages).

## Notas técnicas

- O build pré-renderiza o HTML (`scripts/prerender.mjs`); o JavaScript hidrata quando o navegador fica livre ou na primeira interação.
- Animações respeitam `prefers-reduced-motion` (CSS força o estado final).
- O formulário de agendamento só monta a mensagem e abre `wa.me`. Nada é enviado nem guardado.
- O mapa do Google só carrega quando a pessoa pede.
