# Site Matheus Quinteiro · Nutricionista (rascunho)

Página única estática (Vite + Preact/compat + TypeScript + Tailwind 4), com o HTML pré-renderizado no build: o conteúdo aparece sem JavaScript.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (HTML estático + JS de ~17 KB gzip)
npm run preview  # serve o dist/ em http://localhost:4173
```

## Onde editar

Tudo fica em **`src/config.ts`**. Campo vazio (`''`, `null` ou lista vazia) = o bloco não aparece, e o layout se reorganiza.

| O que | Onde |
| --- | --- |
| Ligar/desligar seções | `CONFIG.secoes` (`true`/`false`). A numeração das seções se ajusta sozinha. |
| Atendimentos | `CONFIG.atendimentos`, campo `ativo`. Só os ativos aparecem na página, no formulário e nas Dúvidas. Desligados hoje: Método MAT, Nutrição esportiva, Atendimento online. |
| Abertura (intro) | `CONFIG.intro` (padrão `false`; nenhuma intro implementada além da assinatura do hero). |
| Fotos | `CONFIG.fotos` (`retrato`, `consultorio`, `maca`). `null` remove a foto. Para trocar: coloque as versões `.webp` em `public/img/` (`nome-480.webp`, `nome-880.webp` etc.) e ajuste `larguras`, `largura`, `altura` e `alt`. Originais recortadas em `referencias/fotos/`. **Nunca foto de paciente.** |
| Logo | Hoje não há logo: o site usa um wordmark provisório em texto e o monograma "MQ" no anel. Para usar o logo do profissional, coloque o arquivo em `public/` e preencha `CONFIG.logo` (ex.: `'/logo.svg'`). Troque também `public/favicon.svg` e `public/apple-touch-icon.png`. |
| WhatsApp | `CONFIG.whatsapp = '5535984370700'`. **Teste o link** `https://wa.me/5535984370700` num celular antes de publicar. `usarWhatsapp: false` remove botões e formulário. |
| Telefone fixo / e-mail | `CONFIG.telefone`, `CONFIG.email` (vazios hoje, por isso não aparecem). |
| URL do site | `CONFIG.siteUrl` (canonical, og:url, og:image e JSON-LD usam este valor). |

## Desligar o rascunho (publicação definitiva)

1. `src/config.ts`: `rascunho: false` (remove a faixa e as metas `noindex`).
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers` e `vercel.json`: remova o cabeçalho `X-Robots-Tag`.
4. Atualize `CONFIG.siteUrl` para o domínio final e faça novo deploy.

## Antes de publicar de forma definitiva: confirmar com o Matheus

- **Método MAT**: pode ser divulgado? Com que nome e descrição? (Hoje está desligado e não aparece em lugar nenhum.)
- **Atendimentos anunciáveis**: quais podem constar e como descrever "Obesidade e emagrecimento" (texto atual é geral e sem promessa).
- **Registro**: a grafia exata é "CRN 29815"? O conselho regional deve constar (ex.: CRN-9)? Hoje o site usa só "CRN 29815".
- **Formação**: nome exato da instituição e do curso de pós-graduação ("Pós-graduação em Obesidade e Emagrecimento, Faculdade Israelita Albert Einstein", conforme o LinkedIn) e da graduação (UNIFEOB).
- **Fotos**: as três fotos usadas vieram de publicações do Instagram do próprio Matheus, enviadas pelo responsável pelo projeto. Confirmar a autorização de uso no site (e, se possível, enviar os arquivos originais em alta). O retrato foi recortado para não mostrar o adipômetro.
- **Logo**: existe um logo oficial?

## Conformidade

Sem promessa de resultado, preço, depoimentos, antes e depois, contagem de seguidores ou métodos não confirmados. O formulário de agendamento não envia nada a servidor algum: monta a mensagem e abre o WhatsApp. Sem cookies, analytics ou armazenamento no navegador. O mapa do Google só carrega quando a pessoa pede.
