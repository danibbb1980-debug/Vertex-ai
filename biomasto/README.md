# Clínica Biomasto · site (rascunho)

Site de página única da Clínica Biomasto (Poços de Caldas - MG). Vite + React + TypeScript + Tailwind + motion, 100% estático, sem backend, sem cookies e sem analytics.

> ## ⚠️ OBRIGATÓRIO antes de publicar de forma definitiva
> **Preencher o DIRETOR TÉCNICO (nome e CRM)** em `src/config.ts` → `diretorTecnico`. A regra de publicidade médica do CFM exige nome e CRM do responsável técnico no anúncio da clínica. Enquanto estiver vazio, a linha não aparece no rodapé.

## Rodar e publicar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (HTML já pré-renderizado)
npm run preview  # serve o dist/ em http://localhost:4173
```

Na Vercel: projeto com **Root Directory = `biomasto`**, framework Vite, build `npm run build`, saída `dist`.

## Como editar

Todos os dados ficam em **`src/config.ts`**. Campo vazio (`''`) ou lista vazia = o bloco não aparece.

| O quê | Onde |
|---|---|
| Telefone, endereço, Instagram, Maps | `telefone`, `endereco`, `instagram`, `maps` |
| Horários | `horarios` (por dia; `periodos: []` = fechado) |
| Textos dos atendimentos | `atendimentos` |
| Ligar/desligar seções | `secoes` (`true`/`false`) |
| Diretor técnico | `diretorTecnico: { nome, crm }` |
| Equipe | `equipe` (nome, CRM, RQE, área) + `mostrarEquipe: true` |
| Fotos | ver abaixo |
| Rascunho | `rascunho` (ver abaixo) |

### WhatsApp
Hoje **`usarWhatsapp: false`**: todos os botões são “Ligar” (`tel:`) e o formulário de solicitação não aparece.
**Confirmar se o número recebe WhatsApp; se sim, ligar `usarWhatsapp`.** Ajuste `whatsapp` (só números, com 55 + DDD) e mude `usarWhatsapp` para `true`. Os botões passam a abrir o WhatsApp com mensagem pronta e a seção “Solicitar agendamento” (#agendar) aparece. O formulário só monta a mensagem e abre o WhatsApp: nada é guardado nem enviado a servidor.

### Fotos
Coloque as imagens em **`referencias/fotos/`** (jpg, png ou webp; de preferência webp com até ~1600 px). Elas aparecem sozinhas na seção “A clínica”, em ordem alfabética (a primeira é a principal). Dê texto alternativo e legenda em `fotos` no config, pelo nome do arquivo sem extensão. Sem fotos, a seção usa a composição com a tulipa e a onda. Para esconder todas: `mostrarFotos: false`.
A imagem de compartilhamento (WhatsApp, redes) é `public/og-biomasto.jpg` (`seo.ogImage`; vazio = sem og:image).

### Desligar o rascunho (publicação definitiva)
1. `src/config.ts`: `rascunho: false` (some a faixa e as metas noindex) e `siteUrl` com o domínio final.
2. `public/robots.txt`: trocar `Disallow: /` por `Allow: /`.
3. Remover a linha `X-Robots-Tag` de `vercel.json` e de `public/_headers`.
4. Em `public/privacidade.html` e `public/404.html`, remover a faixa e a meta `robots`.

## O que falta para publicar de forma definitiva
- **Diretor técnico (nome e CRM-MG): obrigatório.**
- Equipe com CRM-MG e RQE (só então nomes e títulos de especialista podem aparecer).
- Confirmar se o telefone recebe WhatsApp.
- Logo em alta resolução (PNG grande ou SVG original). A logo atual foi vetorizada a partir de uma imagem de 150 px (`public/logo-biomasto.svg`).
- Fotos em resolução original (as atuais vieram de capturas de tela do Google).
- Confirmar os horários (vêm do Google, inclusive 17h48 e 18h48).
- Domínio final.
