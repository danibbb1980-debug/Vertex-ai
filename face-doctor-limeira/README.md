# Face Doctor Limeira — site (rascunho)

Estética facial e corporal · Limeira/SP. Página única, estática, sem backend.
Vite + React + TypeScript + Tailwind 4 + motion (+ Lenis no desktop), pré-renderizada:
o HTML já sai pronto do build e o site funciona sem JavaScript para ler, chamar no
WhatsApp e abrir o mapa.

> ## ⚠️ ANTES DE PUBLICAR DE VERDADE
>
> 1. **Quem é o profissional responsável e qual o registro dele (conselho + número).**
>    O perfil do Instagram cita lasers, microagulhamento, carboxiterapia, ultrassom
>    microfocado e harmonização: procedimentos que exigem profissional de saúde
>    habilitado e que mudam as regras de publicidade. Um dos stories mostra um cartão
>    de "Responsabilidade técnica" com nome e CRBM; **não foi usado** porque não veio
>    nos dados confirmados. Confirme com a cliente e preencha `CONFIG.responsavel`.
> 2. **Quais atendimentos podem ser anunciados e como descrevê-los.** Hoje só
>    "Estética facial" e "Estética corporal" estão ligados. Todos os procedimentos
>    estão desligados (`ativo: false`).
> 3. **Bairro do endereço.** O Google Maps diz *Vila Cristovam* (usado no site); uma arte
>    do Instagram diz *Vila Claudia*. Confirme qual é o correto.
> 4. **Logo em alta resolução** (vetor ou PNG grande, de preferência com fundo
>    transparente). O atual é um recorte de 533 px do perfil do Instagram.
> 5. **Fotos autorizadas** do espaço (nunca de clientes, nunca antes e depois).
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
| Profissional responsável | `responsavel` (aparece no rodapé só com nome **e** registro) |
| Fotos | `fotos` |
| Abertura (cortina) | `intro` (padrão `false`) |
| Faixa de rascunho | `rascunho` |

### Ligar um atendimento
Mude `ativo: false` para `true` **e** escreva `descricao` (geral, sem promessa, sem
aparelho, sem marca, sem preço, sem prazo). Atendimento sem descrição não aparece.
Ligado, ele entra no índice, no formulário, nas dúvidas e no JSON-LD automaticamente.

### Fotos autorizadas
Coloque os arquivos em `public/fotos/` (guarde os originais em `referencias/fotos/`) e
liste em `fotos`: `{ src: '/fotos/recepcao.jpg', alt: 'Recepção da clínica', largura: 1200, altura: 1500 }`.
Elas aparecem em recortes 4:5 na seção "A avaliação".

### Trocar o logo
Salve o arquivo novo em `public/` e atualize `logo` em `src/config.ts`. Gere também
`public/logo-112.png` (cabeçalho, 2× de 56 px) e `public/logo-208.png` (rodapé, 2× de
104 px), e os ícones `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png` (hoje recortados do monograma do logo).

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
