# Elane Vasconcelos · site (rascunho)

Estética e furo de orelha infantil em São João da Boa Vista - SP.
Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado)
npm run preview  # serve dist/ em http://localhost:4173
```

## Onde editar

Tudo fica em `src/config.ts`. **Campo vazio = o bloco não aparece** (o layout se reorganiza).

| O que | Onde |
|---|---|
| Ligar/desligar seções | `CONFIG.secoes` (`true`/`false`) |
| Título profissional e registro | `CONFIG.profissional.titulo`, `.registro` e `.formacao`. Enquanto `registro` estiver vazio, o site não usa "Dra." nem nenhum título. Preenchido, o título e o registro aparecem no hero, no bloco "Sobre" e no rodapé. |
| Procedimentos de estética | `CONFIG.procedimentos` (lista de textos). Vazio hoje, de propósito. |
| Fotos | `CONFIG.fotos.hero`, `.sobre` e `.espaco`. Coloque os arquivos em `public/img/` com sufixos de largura (`nome-480.avif/.webp` e `nome-880.avif/.webp`). Use `null` para remover uma foto. |
| WhatsApp, Instagram, endereço, horários | campos de mesmo nome. Os horários alimentam o site, o formulário e o JSON-LD. |
| Mensagens do WhatsApp | `CONFIG.mensagens` |

## Logo provisório

A marca (monograma "EV" numa argola dourada + wordmark) foi criada para este rascunho.
Arquivos: `public/brand/logo-fundo-claro.svg`, `logo-fundo-escuro.svg`, `monograma.svg` e `public/favicon.svg`.
Para trocar pelo logo oficial: substitua esses arquivos e o componente `src/components/Marca.tsx`.

## Desligar o rascunho (publicação definitiva)

1. `CONFIG.rascunho = false` (remove a faixa e troca as metas para `index, follow`).
2. Apague `public/robots.txt` (ou troque para `Allow: /`) e remova o `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
3. Remova a faixa de rascunho de `public/privacidade.html` e `public/404.html`.
4. Atualize `CONFIG.siteUrl` com o domínio final.

## O que falta para publicar de forma definitiva

- Profissão e número de registro no conselho (e formação, se quiser exibir).
- Logo oficial (há um logo de borboleta nos impressos da clínica; enviar em vetor).
- Confirmar a grafia do nome: os impressos da clínica mostram "Elaine", o briefing usa "Elane".
- Confirmar as fotos: a do bloco "Sobre" (`elane-jaleco`) parece gerada ou retocada por IA. Use uma foto real.
- Lista de procedimentos de estética.
- Autorização de uso das fotos do espaço (vieram do perfil do Google).

## Privacidade e formulário

O formulário "Solicitar agendamento" só monta a mensagem e abre `wa.me`. Não envia nada para servidor, não usa localStorage nem cookies. O mapa do Google só carrega quando a pessoa toca em "Mostrar mapa".
