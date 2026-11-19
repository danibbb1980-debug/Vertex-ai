# Resquioto Advogados — site (rascunho)

Site estático (Vite + React + TypeScript + Tailwind), sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/
```

## Onde editar

Todo o conteúdo variável fica em `src/config.ts`. **Campo vazio ("" ou []) = o bloco não aparece.**

| Campo | O que faz |
|---|---|
| `rascunho` | `true` mostra a faixa "Rascunho para avaliação" e marca `noindex` nas metas. Para publicar de vez: `false` **e** remova `public/robots.txt` (Disallow), a linha de `public/_headers` e o bloco `headers` de `vercel.json`. |
| `siteUrl` | URL pública (canonical, og:url, og:image, JSON-LD). |
| `cidade`, `uf`, `endereco`, `bairro`, `cep` | Endereço. Usados no hero, SEO, JSON-LD, contato e rodapé. |
| `advogados` | `{ nome, oab, uf }`. Só aparece com os três preenchidos (Provimento 205/2021). Preenchido, gera a seção "Os advogados" e a identificação no rodapé. |
| `areas` | `{ nome, descricao }`. Preenchido, gera a seção "Atuação", o link no menu, o botão de WhatsApp por área, a opção no formulário, a pergunta no FAQ e o SEO. |
| `horarios` | `{ dia (0=dom…6=sáb), abre, fecha, pausa? }`. Gera a tabela de horários e o seletor de data/hora do formulário. Vazio: o formulário usa um campo livre. |
| `fotos` | Arquivos em `public/fotos/{id}-1200.webp` e `{id}-720.webp`. Originais recortados em `referencias/fotos/`. |
| `logo` | Caminho de um logo oficial (SVG/PNG). Vazio = usa o logotipo recriado em `src/components/Logo.tsx`. |
| `secoes` | Liga/desliga cada seção. |
| `whatsapp`, `usarWhatsapp`, `instagram` | Contato. |

## Antes de publicar de forma definitiva

1. **Advogado responsável com nome e número da OAB** (obrigatório pelo Provimento 205/2021).
2. Áreas de atuação.
3. Confirmar os horários — **quarta-feira não veio na lista enviada** e foi assumida como 09:00–18:00.
4. Confirmar que (19) 99767-4192 é o WhatsApp público do escritório e testar o link `wa.me`.
5. Logo vetorial oficial (o atual é um redesenho a partir de uma captura de tela).
6. Fotos em resolução original (as atuais vieram de capturas do celular, com o selo sobreposto removido).
7. Desligar o modo rascunho (ver tabela acima).
