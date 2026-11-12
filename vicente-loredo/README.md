# Vicente Loredo, Advogado: site (rascunho)

Página única em Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Editar o conteúdo: `src/config.ts`

Todos os dados ficam em `src/config.ts`. **Campo vazio (`""`) = o bloco não aparece** e o layout se reorganiza.

| O que | Campo |
|---|---|
| Ligar/desligar seções | `secoes.advogado`, `secoes.areas`, `secoes.quando`, `secoes.comoFunciona`, `secoes.duvidas`, `secoes.contato`, `secoes.agendar`, `secoes.ctaFinal` |
| Número da OAB | `oab` e `oabUF`. Aparece no hero, no bloco do advogado, no rodapé e no JSON-LD |
| Nome completo | `nomeCompleto` (o nome exibido continua `nomeExibicao`) |
| Logo oficial | coloque o arquivo em `public/` e preencha `logo: "/logo.svg"` (substitui a identidade tipográfica) |
| Fotos | `public/fotos/` + `fotos.advogado` / `fotos.escritorio` (e os textos alternativos) |
| Telefone fixo / e-mail | `telefone` (faz aparecer o botão "Ligar") e `email` |
| Horários | `horarios` (com `pausa` opcional, que também tira esses horários do formulário) |
| Cargos na OAB | `mostrarCargosOAB` + `cargosOAB`. **Desligado por padrão**: a publicidade na advocacia restringe exibir cargos para sugerir prestígio (Provimento 205/2021 e Código de Ética). Decidir com o cliente depois de conferir a regra |
| Desligar o rascunho | `rascunho: false` (tira a faixa e as metas noindex). Remova também `X-Robots-Tag` de `vercel.json` e `public/_headers`, e troque `public/robots.txt` por `Allow: /` |
| URL do site | `siteUrl` (canonical, og:url, og:image e JSON-LD) |

## A confirmar antes de publicar de forma definitiva

- **OAB/MG 84.176 e o nome "Vicente Lima Lorêdo"** foram lidos nas placas do escritório (fotos do Google Maps). Conferir no Cadastro Nacional dos Advogados (CNA). O site não deve ir ao ar de forma definitiva sem a OAB correta visível (Provimento 205/2021).
- **WhatsApp (35) 99988-3485**: confirmar se este número é o WhatsApp profissional.
- **Horários**: o Google informa seg. a sex., 9h às 18h. A placa da porta mostra 8h às 11h30 e 13h às 18h. Confirmar e, se houver pausa para almoço, preencher `pausa`.
- Pós-graduação em Direito Tributário e palestras na ESA (texto da bio do próprio advogado).
- Logo oficial: a placa mostra um logo "Loredo Advogados", mas não há arquivo; hoje o site usa identidade tipográfica.
- Fotos melhores: as atuais foram recortadas de capturas de tela do Google Maps (739 px de largura).
- O perfil do Google cita "Loredo Advogados Associados" e outros advogados; o site apresenta só Vicente Loredo, conforme o briefing. Confirmar o posicionamento.

## Arquivos de rascunho

`public/robots.txt` (`Disallow: /`), `public/_headers` e `vercel.json` (`X-Robots-Tag: noindex, nofollow`) e as metas robots/googlebot no `index.html` (geradas a partir do config em `vite.config.ts`).
