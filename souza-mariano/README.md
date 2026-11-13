# Souza & Mariano Advogados Associados: site (rascunho)

Página única estática para o escritório Souza & Mariano, em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind + motion. Sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (HTML pré-renderizado, CSS embutido)
npm run preview   # serve o dist/
```

## Antes de publicar de forma definitiva

1. **Conferir os números de OAB com as advogadas.** O site usa os valores informados pelo cliente
   (Ilsara: OAB/MG 202.983; Jéssica: OAB/MG 196.832). Na foto da placa, o número da Dra. Ilsara
   parece ser **202.963** (e não 202.983). A foto tem baixa resolução: confirmar antes de publicar.
2. **Logo em alta resolução.** O monograma "SM" foi redesenhado em SVG a partir da foto da placa
   (`src/components/Monograma.tsx`). Um arquivo original em SVG ou PNG substitui o redesenho:
   coloque em `public/` e preencha `CONFIG.logo` (ex.: `"/logo.svg"`).
3. **WhatsApp:** confirmar se o número (35) 99142-0078 recebe WhatsApp. Se sim, ligar `usarWhatsapp`.
4. **Instagram, e-mail e fotos:** só aparecem quando preenchidos (ver abaixo).
5. **Horários:** confirmar com o escritório.
6. **Rascunho:** desligar a faixa e o noindex (ver abaixo).

## Editar o conteúdo: `src/config.ts`

Todos os dados ficam em `src/config.ts`. Campo vazio (`""` ou `[]`) = o bloco não aparece, e o layout
se reorganiza. Nada de placeholder na tela.

- **Seções:** `CONFIG.secoes` liga/desliga cada seção (`escritorio`, `advogadas`, `areas`, `valores`,
  `comoFunciona`, `duvidas`, `contato`, `agendar`, `ctaFinal`).
- **Áreas de atuação:** `CONFIG.familias`. Cada família tem `nome`, `resumo` e `areas` (nome + uma
  linha de descrição). A contagem ("16 áreas") e o número de cada família são automáticos.
- **Advogadas:** `CONFIG.advogadas` (nome, OAB e, opcionalmente, `foto`).
- **Fotos:** ficam em `public/fotos/` (`.jpg` + `.webp` com o mesmo nome).
  - Retrato: campo `foto` de cada advogada (hoje só a Dra. Ilsara tem). Com só uma parte das
    advogadas com foto, a seção mostra o retrato ao lado dos nomes; quando todas tiverem, cada uma
    ganha o retrato na própria coluna. Use retrato vertical 4:5.
  - Escritório: `CONFIG.fotosEscritorio` (src, alt, legenda, largura, altura). Hoje: a sala 315 e um
    detalhe do escritório, recortados das capturas recebidas (sem a interface do celular).
- **Instagram / e-mail:** preencha `CONFIG.instagram` (URL completa) e `CONFIG.email`.
- **Horários:** `CONFIG.horarios` (por dia; sem `abre`/`fecha` = fechado; `pausa` opcional para almoço).
- **Dúvidas frequentes:** `CONFIG.faq`.

## WhatsApp

```ts
whatsapp: "5535991420078", // só dígitos, com 55 + DDD
usarWhatsapp: true,
```

Com `usarWhatsapp: true`: os botões passam a abrir o WhatsApp (com "Ligar" ao lado), o botão
flutuante e a barra do celular viram WhatsApp, e aparece a seção **Solicitar agendamento** (`#agendar`),
um formulário que só monta a mensagem e abre o WhatsApp. Nada é enviado a servidor nem salvo no
navegador. Com `false` (padrão): não existe nenhum link `wa.me` no site e tudo vira `tel:`.

## Modo rascunho

`CONFIG.rascunho: true` mostra a faixa "Rascunho para avaliação" e coloca `noindex, nofollow` nas metas.
Para publicar de verdade, além de `rascunho: false`, remova o bloqueio também em:

- `public/robots.txt` (trocar `Disallow: /` por `Allow: /`);
- `public/_headers` (apagar a linha `X-Robots-Tag`);
- `vercel.json` (apagar o bloco `headers`);
- `public/privacidade.html` e `public/404.html` (faixa e meta robots, escritas à mão).

Atualize `CONFIG.siteUrl` com o domínio final (usado no canonical, og:url e JSON-LD).

## Referências

`referencias/` guarda o material original recebido: foto da placa (fonte do logo e das OAB), três
capturas do escritório e o retrato da Dra. Ilsara. Foram publicados o retrato e duas capturas
(recortadas). A captura da parede vermelha não foi usada porque mostra o quadro com a balança.
As capturas têm baixa resolução: fotos originais em resolução maior melhoram bastante o resultado.

## Fontes

Newsreader (títulos; instância peso 400 com eixo de tamanho óptico, subconjunto latino em
`src/fonts/`, gerada de `@fontsource-variable/newsreader`) e Familjen Grotesk (texto, via
`@fontsource`). Licença OFL. Tudo auto-hospedado.
