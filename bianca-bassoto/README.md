# Bianca Bassoto · Nutricionista — site (RASCUNHO)

Página única para Bianca Bassoto, nutricionista em Poços de Caldas - MG.
Vite + React + TypeScript + Tailwind, estático, sem backend. O HTML é pré-renderizado
(o conteúdo existe sem JavaScript).

> **Este site é um rascunho para avaliação.** Tem faixa de rascunho e `noindex` em
> quatro lugares (meta robots/googlebot, `public/robots.txt`, `public/_headers` e
> `vercel.json`). Não publicar de forma definitiva antes de resolver a lista abaixo.

---

## O que falta para publicar de forma definitiva (nesta ordem)

1. **NÚMERO DO CRN — obrigatório.** Falta o número do CRN. A divulgação de
   nutricionista exige nome e CRN legíveis. **Não publicar sem ele.** Preencha
   `CONFIG.crn` em `src/config.ts` (ex.: `"CRN-9 00000"`); ele aparece sozinho no
   hero, na seção Sobre, no rodapé, nas dúvidas, na meta description e no JSON-LD.
2. **WhatsApp:** confirmar com a clínica que **(35) 3722-4901** (número fixo) atende
   por WhatsApp. Testar o link `https://wa.me/553537224901`.
3. **Título "Dra.":** o perfil usa, mas o título de doutora não foi confirmado. O site
   não usa "Dra." em lugar nenhum.
4. **Formação:** confirmar o nome exato da instituição e o ano ("Graduação em
   Nutrição, Universidade de Alfenas, concluída em 2007", como consta em post dela).
5. **Atendimentos e exames que podem ser anunciados** e como descrevê-los:
   fitoterapia, nutrição esportiva, avaliação antropométrica, bioimpedância, exames
   genéticos, atendimento online, e a própria descrição de "Emagrecimento". Hoje estão
   ligados só "Atendimento nutricional" e "Emagrecimento". A etapa "Exames" de "Como
   funciona" diz apenas "quando a profissional considerar necessário"; confirmar se
   ela quer manter essa etapa (`CONFIG.frentes`, `ativo`).
6. **Método próprio e marcas** ("EVA", "Emagreça Você Agora", "Nutrição Viva",
   mentoria, coach, "Ultra Personalização", "exames de precisão"): nada disso aparece
   no site até ela confirmar se e como podem ser divulgados.
7. **CEP:** o Google Maps traz **37701-710** (usado no site); o site atual dela traz
   **37701-023**. Confirmar.
8. **Arquivo original do logo** (vetorial ou PNG grande). O logo atual foi **recriado
   em SVG a partir de um recorte de baixa resolução** de um post.
9. **Fotos:** as duas fotos da Bianca (blusa verde desfocada no fundo do hero e
   nítida na seção Sobre; jaleco rosa em "A
   consulta") foram **recortadas de prints de posts do Instagram dela**, enviados pelo
   vendedor. Antes de publicar: confirmar com ela a **autorização de uso** e pedir os
   **arquivos originais em alta resolução** (e o crédito do fotógrafo, se houver).
   Os prints ficam em `referencias/fotos/`; os recortes são gerados por
   `node scripts/build-fotos.mjs`.

---

## Rodar e publicar

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # tsc + build + pré-renderização (dist/)
npm run preview   # serve o dist em http://localhost:4173
```

O `dist/` é estático: pode ir para Vercel (`vercel.json` já configurado), Netlify ou
Cloudflare Pages (`public/_headers`). Zip pronto para upload:

```bash
cd dist && zip -r ../site-bianca-bassoto.zip . -x "*.DS_Store"
```

Depois de publicar, ajuste `CONFIG.siteUrl` para a URL real (canonical, og:url e
JSON-LD usam esse valor) e gere o build de novo.

## Editar o conteúdo — `src/config.ts`

Tudo o que o site mostra vem de `src/config.ts`. Regra: **campo vazio ou
`ativo: false` = não aparece** (sem "em breve", sem placeholder).

| O quê | Onde |
|---|---|
| CRN | `crn` |
| Desligar a faixa de rascunho e o noindex das metas | `rascunho: false` (e troque `public/robots.txt` para `Allow: /`, e remova `X-Robots-Tag` de `public/_headers` e `vercel.json`) |
| Abertura (cortina) | `intro` — fica `false`; o site não usa abertura |
| Ligar/desligar seções | `secoes.{atendimentos, consulta, sobre, comoFunciona, horarios, duvidas, contato, agendar, ctaFinal}` |
| Atendimentos | `atendimentos[]` — cada item tem `ativo`. Um item só aparece com `ativo: true` **e** `descricao` preenchida. Ele entra no índice, no formulário, nas dúvidas e na meta description |
| As quatro frentes (marcadores) | `frentes[]` |
| Formação | `formacao[]` (`ativo`) |
| Horários | `horarios[]` — o formulário gera os blocos de 1 h a partir daqui |
| Telefone / WhatsApp | `whatsapp`, `telefone`, `telefoneExibicao`, `usarWhatsapp` |
| Endereço e links do mapa | `endereco` |
| Mensagens do WhatsApp | `mensagens` |

### Fotos

`CONFIG.fotoFundo` (fundo do hero em tela cheia, já desfocado no arquivo,
`-480/-960/-1600.webp`; vazio = fundo creme), `CONFIG.fotoHero` (recorte com fundo
transparente na frente, `-400/-640/-900.webp`; hoje vazio, a pedido),
`CONFIG.foto` (seção Sobre e `og:image`) e
`CONFIG.fotoConsulta` (seção A consulta)
recebem a base do nome em `public/fotos/` — ex.: `'/fotos/bianca-verde'`. O site usa
`-480.webp`, `-800.webp`, `-1120.webp` (proporção 4:5) e `.jpg` (og:image). Para trocar
pelos originais, ajuste `scripts/build-fotos.mjs` (arquivo de origem e recorte) e rode
`node scripts/build-fotos.mjs`. O recorte do hero vem de
`referencias/fotos/bianca-verde-recorte.png`, gerado com
`rembg i -m birefnet-portrait <foto> referencias/fotos/bianca-verde-recorte.png`.
Campo vazio = a foto some e o layout se reorganiza.
**Nunca use foto de paciente nem antes e depois.**

### Trocar o logo recriado pelo original

O logo está em `src/assets/` (`logo.svg`, `logo-claro.svg`, `logo-escuro.svg`,
`simbolo.svg`) e em `src/assets/logo-data.json` (usado pelo site). Ele é gerado por
`npm run logo` (`scripts/build-logo.mjs`): a pera e as folhas são vetorizadas do
recorte em `referencias/`, e o lettering é a Comfortaa Light convertida em curvas.
Com o arquivo original em mãos, substitua `logo-data.json` (caminhos do símbolo e do
lettering) e os SVGs, e gere de novo os ícones (`public/favicon.svg`,
`apple-touch-icon.png`, `favicon-32.png`, `icon-512.png`). Depois rode
`node scripts/static-pages.mjs` para atualizar `privacidade.html` e `404.html`.

## O formulário "Solicitar agendamento"

Não há backend: o formulário só monta uma mensagem e abre
`https://wa.me/553537224901?text=...` em nova aba. Nada é enviado a servidor, nada vai
para `localStorage` ou cookies. Datas passadas e domingos são bloqueados; horários em
blocos de 1 hora (seg.–sex. 08:00–19:00; sáb. 08:00–11:00). Se o navegador bloquear a
nova aba, aparece o link "Abrir WhatsApp".

## Estrutura

```
src/config.ts         dados (única fonte)
src/tokens.css        cores, escala tipográfica, espaços, movimento (só tokens)
src/index.css         estilos
src/motion.ts         3 mecanismos de movimento + linha do tempo + Lenis (desktop)
src/sections/*        seções da página
scripts/prerender.mjs gera o HTML estático, head/SEO/JSON-LD e CSS inline
scripts/build-logo.mjs   recria o logo em SVG
scripts/static-pages.mjs gera privacidade.html e 404.html
referencias/          recorte do logo (referência; não vai para o site)
```
