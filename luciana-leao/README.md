# Site da Dra. Luciana Leão (rascunho)

Dermatologista em Poços de Caldas - MG. Página única estática: Vite + React + TypeScript + Tailwind CSS 4,
pré-renderizada no build (o HTML já sai pronto), sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (com HTML pré-renderizado)
npm run preview    # serve o dist/ em http://localhost:4173
```

## Pendências antes de publicar de verdade

| Item | Situação | O que fazer |
|---|---|---|
| **WhatsApp** | **NÚMERO NÃO VERIFICADO.** O número informado foi "+55 35 8853-5585" (8 dígitos). O site usa `5535988535585`, com o 9 acrescentado, exibido como (35) 98853-5585. | Testar o link `https://wa.me/5535988535585` antes de enviar o site. Corrigir em `whatsapp` e `whatsappExibicao`. |
| **UF do CRM** | Não informada. O site mostra "CRM 90524 \| RQE 32476". | Preencher `profissional.uf` (ex.: `'MG'`); o site passa a mostrar "CRM-MG 90524". |
| **Número 46111** | O Instagram mostra "CRM 90524 \| 46111 RQE 32476". O 46111 não aparece no site. | Confirmar com a médica o que é (pode ser um segundo CRM) e, se for o caso, incluir. |
| **Sala 33 x Conj. 204** | O Google mostra "Sala 33"; a arte da médica mostra "Conj. 204". O site usa "Conj. 204". | Confirmar o complemento correto em `endereco.complemento`. |
| **Domingo e almoço** | Sem informação. Domingo não aparece na tabela e fica bloqueado no formulário; não há pausa de almoço. | Se houver, incluir em `horarios` (dia `0`) e em `agendamento.pausa`. |
| **Logo** | O site usa uma **reprodução em SVG** do logo existente (orquídea, "Centro de Dermatologia", nome em caligrafia e traço), feita a partir da arte de referência. | Substituir pelos arquivos originais (ver abaixo). |
| **Fotos** | Nenhuma foto limpa foi enviada. O post do Instagram em `referencias/` tem texto sobre a imagem e não foi usado. | Ver "Adicionar foto". |
| **Formação, procedimentos, aparelhos, convênios** | Não informados, por isso não aparecem. | Incluir quando forem informados (com cuidado com as regras do CFM). |
| **URL do site** | `siteUrl` aponta para `https://luciana-leao-rascunho.vercel.app` (nome esperado do projeto na Vercel). | Ajustar para a URL real depois do deploy e gerar o build de novo. A página `public/privacidade.html` também tem essa URL no `canonical`. |

## Onde editar

Todo o conteúdo variável fica em **`src/config.ts`**. Regra: campo vazio (`''` ou `[]`) faz o bloco sumir do
site; nunca escreva textos provisórios como "a confirmar".

- **Ligar/desligar seções:** `CONFIG.secoes` (`true`/`false` para cada seção).
- **Rascunho:** `CONFIG.rascunho = false` remove a faixa "Rascunho para avaliação" e troca as metas para
  `index, follow`. Para publicar de vez, também:
  - apagar a linha `X-Robots-Tag` de `public/_headers` e de `vercel.json`;
  - trocar `public/robots.txt` por `User-agent: *` + `Allow: /` + `Sitemap: ...`;
  - trocar `noindex, nofollow` em `public/privacidade.html` e `public/404.html`.
- **Atendimentos:** `CONFIG.atendimentos` (título, descrição e texto da mensagem do WhatsApp). As opções do
  formulário vêm daí.
- **Horários:** `CONFIG.horarios` (dia `0` = domingo ... `6` = sábado). O formulário usa blocos de 1 hora até
  `agendamento.ultimoHorario` (17:00) e bloqueia os dias ausentes ou fechados.

## Adicionar foto

1. Coloque a foto (real, limpa, só da médica ou do consultório) em `public/fotos/`, de preferência em WebP,
   com cerca de 800 x 1000 px.
2. Em `src/config.ts`, preencha `foto: '/fotos/nome-do-arquivo.webp'`.
3. A foto aparece no bloco "Sobre", no lugar da composição com o logo. Nunca use fotos de pacientes, de pele,
   de procedimentos ou de banco de imagens.

## Trocar a reprodução do logo pelo original

Arquivos em `public/marca/`: `logo-vinho.svg`, `logo-claro.svg` (empilhados) e `logo-horizontal-vinho.svg`
(cabeçalho). Basta substituí-los pelos originais, com os mesmos nomes (fundo transparente). A orquídea
pequena (`src/brand/orquideaMarca.ts`) e o favicon (`public/favicon.svg`) também vêm da reprodução. Depois rode
`npm run gerar:imagens` para refazer `og.png` e `apple-touch-icon.png`. O script `scripts/gerar-logo.py`
recria a reprodução, se for preciso.

## Formulário de agendamento

Não guarda nada: monta uma mensagem e abre `https://wa.me/<número>?text=...`. Não pede telefone, e-mail,
CPF nem dados de saúde. Se `CONFIG.whatsapp` estiver vazio, o formulário e todos os botões de WhatsApp somem.

## Deploy

- **Vercel:** `vercel deploy --prod --yes` dentro desta pasta (o `vercel.json` já envia
  `X-Robots-Tag: noindex, nofollow`).
- **Netlify ou qualquer hospedagem estática:** envie o conteúdo de `dist/` (o `_headers` já está incluído).
