# Site Dra. Roberta Motta (rascunho)

Página única estática em Vite + React + TypeScript + Tailwind 4. Sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/
npm run preview   # serve dist/ em http://localhost:4173
```

## Onde editar

Tudo fica em `src/config.ts`. Campo vazio (`''` ou `[]`) faz o bloco sumir do site, sem deixar espaço vazio.

| O quê | Campo |
| --- | --- |
| Ligar/desligar seções | `CONFIG.secoes` |
| Faixa de rascunho e `noindex` nas metas | `CONFIG.rascunho` (veja "Publicar de vez") |
| URL pública (canonical, og:url, og:image, JSON-LD) | `CONFIG.siteUrl` |
| WhatsApp, Instagram, mensagens prontas | `CONFIG.whatsapp`, `CONFIG.instagram`, `CONFIG.mensagens` |
| Endereço, rota e mapa | `CONFIG.endereco` |
| Horários (o formulário gera os horários a partir daqui) | `CONFIG.horarios`, `CONFIG.avisoHorarios` |
| Atendimentos (o índice e o formulário crescem sozinhos) | `CONFIG.atendimentos` |
| Especialidade (só com registro no conselho) | `CONFIG.profissionais[0].especialidade` e `.registroEspecialidade` |
| Responsável técnico (aparece no rodapé se preenchido) | `CONFIG.responsavelTecnico` |
| Fotos da profissional / do consultório | `CONFIG.profissionais[0].fotos`, `CONFIG.fotosConsultorio` |

### Fotos

As fotos atuais foram recortadas dos prints enviados (`npm run fotos`, script `scripts/fotos.mjs`; os prints originais
ficam fora do repositório, em `referencias/prints/`). Para trocar: coloque a imagem em `referencias/fotos/`, gere as
versões `public/fotos/<nome>-480.webp` e `-960.webp` (o script mostra como) e aponte o `config`. Lista vazia = o layout
volta a ser só tipográfico. A foto com paciente em atendimento não foi usada (publicidade odontológica não permite
imagem de paciente).

### Logo

O logo foi refeito em vetor a partir de `referencias/logo-original.jpg`:

- `scripts/alpha.py` separa o dourado do fundo roxo (canal alfa pela diferença de cor) e amplia 6x;
- `scripts/split.py` divide em dois grupos: monograma RM e perfil com ramo;
- `scripts/trace.mjs` vetoriza com potrace;
- `scripts/build-logo.mjs` recria "DRA. ROBERTA MOTTA" em Bellefair convertida em curvas e gera
  `src/brand/marca.ts`, `public/marca/logo-dourado.svg`, `public/marca/logo-ameixa.svg`, favicons e `public/og.png`.

Para refazer: `npm run logo`. Quando chegar o arquivo original (SVG ou PNG grande), troque os arquivos em
`public/marca/` e `CONFIG.logo` (e, se quiser, rode o pipeline sobre o PNG novo).

## Publicar de vez (checklist)

1. Confirmar profissão e conselho regional do registro "CRO 33126 · Varginha/MG".
2. Confirmar se há registro de especialidade (só então preencher `especialidade`).
3. Lista real de procedimentos para ampliar `CONFIG.atendimentos`.
4. Autorização por escrito de uso das fotos e logo original em alta resolução.
5. Desligar o rascunho: `CONFIG.rascunho = false`, apagar `public/robots.txt` (ou trocar por `Allow: /`),
   remover o `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
6. Atualizar `CONFIG.siteUrl` com o domínio definitivo.

## Deploy

Vercel: projeto `dra-roberta-motta-rascunho`, diretório raiz `dra-roberta-motta`, framework Vite, saída `dist`.
Outra hospedagem estática: envie o conteúdo de `dist/` (inclui `_headers` para Netlify/Cloudflare Pages).
