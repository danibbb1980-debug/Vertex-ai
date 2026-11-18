# Site · Florindo de Almeida Souza · Advogado (RASCUNHO)

Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies, sem analytics.
O HTML é pré-renderizado no build (`scripts-prerender.mjs`).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Onde editar

Tudo fica em **`src/config.ts`**. Campo vazio = o bloco não aparece, e o layout se recompõe.

| O quê | Campo | Efeito |
| --- | --- | --- |
| **OAB (obrigatório antes de publicar)** | `advogado.oab` | Mostra "OAB/MG nº …" na capa, no rodapé e liga a seção "O advogado" |
| Endereço | `endereco` (e opcional `mapsUrl`) | Liga "Localização", o mapa (lazy) e o link do Google Maps |
| Horários | `horarios` (ex.: `{ dia: 1, abre: '08:00', fecha: '18:00', pausa: { inicio: '12:00', fim: '13:00' } }`) | Lista os horários e troca o campo livre do formulário por data + horário em blocos de 1 h |
| Fotos | `fotos` (arquivos em `public/fotos/`) | Lista vazia = site sem foto. Original em `referencias/fotos/` |
| Logo definitivo | `logo` (ex.: `'/logo.svg'`) | Substitui o logotipo tipográfico provisório |
| WhatsApp | `whatsapp`, `usarWhatsapp` | Todos os botões e o formulário |
| Áreas | `areas` | A lista numerada, o select e as dúvidas crescem sozinhos |
| Seções | `secoes` | Liga/desliga cada seção; a numeração "fls." se ajusta |
| Rascunho | `rascunho` | Faixa + metas noindex |

## Pendências antes da publicação definitiva

1. **OAB** — o site **não deve ser publicado de forma definitiva sem a OAB visível** (Provimento 205/2021).
2. **Confirmar se (35) 98439-6024 é o WhatsApp público do advogado e testar o link `wa.me/5535984396024`.**
3. Endereço e horários de atendimento.
4. Logo definitivo (o atual é provisório).
5. Decidir sobre "Padre Paraíso" (aparece no Instagram sem contexto; não exibido). Se confirmado, usar `cidadesAdicionais`.
6. Fotos adicionais, se houver (a atual veio de um vídeo, com microfone de lapela visível).
7. Desligar o rascunho: `rascunho: false` em `src/config.ts`, **e** remover o `X-Robots-Tag` de `public/_headers` e de `vercel.json`, e trocar `public/robots.txt` por `Allow: /`. Atualizar `siteUrl` para o domínio final.

## Deploy

Vercel (projeto `florindo-almeida-rascunho`, diretório raiz `florindo-almeida`). Para outro host estático, use o conteúdo de `dist/` (inclui `_headers`).
