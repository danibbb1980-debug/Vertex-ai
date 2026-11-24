# Face Doctor Limeira — site (rascunho)

Estética facial e corporal · Limeira/SP. Página única, estática, sem backend.
Vite + React + TypeScript + Tailwind 4 + motion (+ Lenis no desktop), pré-renderizada:
o HTML já sai pronto do build e o site funciona sem JavaScript para ler, chamar no
WhatsApp e abrir o mapa.

> ## ⚠️ ANTES DE PUBLICAR DE VERDADE
>
> 1. **Responsabilidade técnica:** preenchida em `CONFIG.responsavel` com os dados do
>    cartão publicado no Instagram da clínica (Hellena Serradas Marques, CRBM 36440,
>    registro de RT 2024-10985). Confirme com a cliente que os dados estão atualizados.
>    Os procedimentos citados no perfil continuam desligados até a cliente dizer quais
>    podem ser anunciados e como.
> 2. **Quais atendimentos podem ser anunciados e como descrevê-los.** Hoje só
>    "Estética facial" e "Estética corporal" estão ligados. Todos os procedimentos
>    estão desligados (`ativo: false`).
> 3. **Bairro do endereço.** O Google Maps diz *Vila Cristovam* (usado no site); uma arte
>    do Instagram diz *Vila Claudia*. Confirme qual é o correto.
> 4. **Aprovação do logo redesenhado.** O logo foi refeito em vetor (ver "Logo" abaixo),
>    fiel ao original. Se a cliente tiver o arquivo vetorial oficial, prefira-o.
> 5. **Fotos.** Entraram a fachada (recorte do post de endereço, ~690 px), a recepção
>    e a sala de atendimento (fotos publicadas pela clínica, ~1100 px, sem a marca
>    d'água do fotógrafo). A foto da recepção mostra pessoas: confirme com a cliente
>    que pode usá-la e se o fotógrafo autoriza o uso sem crédito. Uma foto original da fachada e do interior melhora muito.
>    Fotos de clientes e de antes e depois NÃO foram usadas: exigem autorização por
>    escrito de cada pessoa e esbarram nas regras de publicidade em saúde.
> 6. **Testar o link do WhatsApp**: abra `https://wa.me/5519991992594` e confirme que
>    cai na conta da clínica.

## Rodar

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (index.html pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
npm run zip       # gera site-face-doctor-limeira.zip com index.html na raiz
```

## Editar o conteúdo — `src/config.ts`

Tudo o que aparece no site sai de `src/config.ts`. **Campo vazio = bloco não aparece.**
Não existem placeholders.

| O quê | Onde |
| --- | --- |
| Endereço, links do Maps e da rota | `endereco` |
| WhatsApp (só números, com 55) e exibição | `whatsapp`, `whatsappExibicao`, `usarWhatsapp` |
| Instagram | `instagram` |
| Horários (fuso `America/Sao_Paulo`) | `horarios`, `avisoHorarios` |
| Atendimentos | `atendimentos` (cada um com `ativo`) |
| Seções inteiras | `secoes` (true/false) |
| Mensagens pré-escritas do WhatsApp | `mensagens` |
| Responsabilidade técnica | `responsavel` (bloco no rodapé; some com `nome` vazio) |
| Fotos | `fotos` |
| Abertura (cortina) | `intro` (padrão `false`) |
| Faixa de rascunho | `rascunho` |

### Ligar um atendimento
Mude `ativo: false` para `true` **e** escreva `descricao` (geral, sem promessa, sem
aparelho, sem marca, sem preço, sem prazo). Atendimento sem descrição não aparece.
Ligado, ele entra no índice, no formulário, nas dúvidas e no JSON-LD automaticamente.

### Fotos do espaço
Ficam em `public/fotos/` e são listadas em `CONFIG.fotos`
(`src`, `pequena` para celular, `largura`, `altura`, `alt`, `legenda`).
Aparecem na seção "A avaliação", em composição assimétrica no desktop.

### Logo
O logo foi redesenhado em vetor a partir do original: monograma "FD" (com o ponto e o
laço), "FACE DOCTOR" e "LIMEIRA", desenhados com Bodoni Moda (licença OFL) e
convertidos em curvas, sem depender de fonte.

- `public/marca/monograma*.svg` — só o "FD" (`-tinta` = ameixa, `-perola` = claro;
  sem sufixo = `currentColor`). `monograma-pequeno` é a versão encorpada para tamanhos
  pequenos (favicon).
- `public/marca/logo-completo*.svg` — monograma + nome, para materiais.
- `src/components/Logo.tsx` — os mesmos desenhos em React (cabeçalho e rodapé).
- `scripts/marca/` — geradores (Python + fontTools). `scripts/gerar-marca.cjs` gera
  favicons, ícones e a imagem de compartilhamento (`public/marca/og-face-doctor-limeira.png`)
  a partir dos SVGs (precisa de Playwright).

### Foto da fachada
Em `CONFIG.endereco.fachada`. Para trocar por uma foto nova, salve em `public/fotos/`
(versão grande e uma de ~460 px) e atualize os caminhos e o `alt`.

## Tirar do modo rascunho
1. `rascunho: false` em `src/config.ts` (some a faixa e as metas viram `index, follow`).
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers` e `vercel.json`: apague a linha/objeto `X-Robots-Tag`.
4. Ajuste `siteUrl` para o domínio definitivo e publique de novo.

## Estrutura
- `src/tokens.css` — cores, escala tipográfica, espaços e movimento (única fonte de valores).
- `src/styles.css` — componentes e seções.
- `src/components/` — cabeçalho, hero (título + reflexo), seções, formulário, rodapé.
- `src/enhance.ts` — camada de movimento, carregada depois da hidratação.
- `scripts/prerender.mjs` — injeta HTML, metas, JSON-LD e CSS inline no `dist/index.html`.
- `public/privacidade.html`, `public/404.html` — páginas avulsas.
- `referencias/` — material de referência (não vai para o site).

## Privacidade
Sem cookies próprios, sem analytics, sem pixels, sem localStorage. O formulário só
monta uma mensagem e abre o WhatsApp; nada é enviado a servidor. O mapa do Google é
carregado com `loading="lazy"`.
