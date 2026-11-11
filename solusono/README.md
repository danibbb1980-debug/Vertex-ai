# SoluSono · site (rascunho)

Redesign do site da SoluSono, fisioterapia e reabilitação do sono em Poços de Caldas - MG.
Página única estática: Vite + React + TypeScript + Tailwind 4 + motion. Sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (HTML pré-renderizado, CSS embutido)
npm run preview   # serve o dist/
```

## Onde editar

Tudo fica em **`src/config.ts`**. Campo vazio (`""` ou `[]`) = o bloco não aparece. O site nunca mostra placeholder.

| O quê | Campo |
|---|---|
| WhatsApp (só números, com 55 e DDD) e como ele aparece | `whatsapp`, `whatsappExibicao` |
| E-mail (aparece só no contato e no rodapé) | `email` |
| Endereço e link do Maps | `endereco` |
| Horários (dia 0 = domingo; `abre: ""` = fechado; `pausa` opcional) | `horarios` |
| Serviços (blocos editoriais) | `servicos` |
| Opções do formulário de agendamento | `atendimentos`, `agendamento` |
| Fotos do espaço | `fotos` |
| Ligar/desligar seções | `secoes` |

Os horários do formulário (blocos de 1 hora, sem almoço, terminando no fechamento) e os dias bloqueados
saem automaticamente de `horarios`.

### Desligar o rascunho (publicação definitiva)

1. `rascunho: false` em `src/config.ts` (tira a faixa e troca as metas para `index, follow`).
2. `siteUrl` com o domínio final.
3. Apague `public/robots.txt` (ou troque por `Allow: /`).
4. Remova a linha `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
5. Remova a faixa e o `noindex` de `public/privacidade.html` e `public/404.html`.

### Equipe

A seção existe, mas está desligada (`mostrarEquipe: false`, `equipe: []`). Para ligar, cada pessoa precisa de:
nome completo, profissão, **número de registro no conselho** (ex.: CREFITO) e autorização por escrito para
aparecer no site. Sem registro preenchido, o profissional não é exibido. Foto é opcional (`/fotos/nome.webp`).

### Fotos

As fotos atuais (fachada, recepção e consultório) foram recortadas das capturas do Google Maps enviadas pelo
cliente. Os originais ficam em `referencias/fotos/`. Para trocar: coloque o arquivo em `public/fotos/`
(de preferência `.webp`, até 1600 px) e ajuste a lista `fotos`, com `alt`, largura e altura reais.
**Confirmar com a SoluSono a autorização de uso dessas fotos** e, se possível, receber os arquivos originais
em alta resolução.

## O que falta confirmar antes de publicar

- **Endereço atual**: o Google e o Instagram mostram R. Nico Duarte, 204 (Jardim do Ginásio); o site antigo
  mostra Av. Champagnat, 863, sala 101.
- **WhatsApp**: (35) 99880-4845 é o número do link do site atual; o rodapé do site antigo mostra outro número.
- **Sábado**: o Google informa fechado; o site antigo informa 08h às 12h.
- **Logo oficial em arquivo vetorial** (SVG/PDF). Hoje o site usa o PNG branco enviado, também em versão
  azul-tinta (mesmo desenho, só a cor trocada) para fundos claros.
- **Registros profissionais** (CREFITO etc.) e autorização, se a equipe for aparecer.
- **Fotos** em alta resolução e autorização de uso.

## Arquivos

- `src/components/` – uma seção por arquivo.
- `src/fontes/` – Newsreader e Schibsted Grotesk recortadas (ver `scripts/fontes.md`).
- `scripts/prerender.mjs` – pré-renderiza o HTML no build.
- `public/_headers` e `vercel.json` – cabeçalho `X-Robots-Tag: noindex, nofollow`.
- `public/privacidade.html` e `public/404.html`.
- `referencias/` – logo e fotos de origem.
