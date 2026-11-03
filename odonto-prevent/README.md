# Odonto Prevent · site (rascunho)

Site de página única da Odonto Prevent, em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.

> **Está em modo rascunho:** faixa "Rascunho para avaliação" no topo e `noindex` ligado.
> Antes de publicar de verdade, veja [O que falta para publicar](#o-que-falta-para-publicar).

## Rodando

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (com HTML pré-renderizado)
npm run preview   # serve o dist/
```

## Onde editar

**Todos os dados ficam em `src/config.ts`.** Regra: campo vazio (`''`, `[]`) = o bloco não aparece, e o layout se reorganiza sozinho.

| O que | Campo |
|---|---|
| WhatsApp, telefone, Instagram, endereço, mapa | `whatsapp`, `telefone`, `instagram`, `endereco`, `mapsUrl` |
| Horários (só os dias informados) | `horarios` (com `almoco` opcional, que também some do formulário) |
| Formas de pagamento | `pagamentos` |
| Atendimentos confirmados | `atendimentos: [{ nome, descricao }]` → aparecem como cartões em "Prevenção" e como opções no formulário |
| Dentistas | `profissionais: [{ nome, cro, formacao }]` → aparece a seção "Equipe" |
| Responsável técnico | `responsavelTecnico: { nome, cro }` → aparece no rodapé e no JSON-LD |
| Urgência | `urgencia: true` → mostra o aviso "Está com dor ou urgência?" acima do formulário |
| Ligar/desligar seções | `secoes` |
| Faixa de rascunho | `rascunho` |
| URL do site (canonical, og:url, og:image) | `siteUrl` |

**Fotos:** coloque arquivos `.jpg`, `.png` ou `.webp` em `referencias/fotos/` e rode o build. A seção "O espaço" aparece sozinha. O nome do arquivo vira o texto alternativo (ex.: `recepcao-da-clinica.jpg`). Use só fotos do espaço, sem pacientes, bocas ou procedimentos.

## Desligar o rascunho

O `noindex` está em quatro lugares. Ao publicar a versão definitiva:

1. `src/config.ts` → `rascunho: false` (remove a faixa e as metas `robots`/`googlebot`).
2. `public/robots.txt` → trocar `Disallow: /` por `Allow: /`.
3. `public/_headers` → apagar as duas linhas do `X-Robots-Tag`.
4. `vercel.json` → apagar o bloco de `headers` com `X-Robots-Tag`.
5. `public/privacidade.html` e `public/404.html` → apagar a `div.faixa` e as metas `robots`.

## O que falta para publicar

- [ ] **Responsável técnico com CRO** (exigência do CFO para publicidade odontológica). Preencher `responsavelTecnico`.
- [ ] **Conferir o WhatsApp.** A bio do Instagram traz "(35) 8877-2603" (8 dígitos). O site usa `5535988772603`, com o 9 inicial acrescentado por padrão de celular. Confirmar com a clínica.
- [ ] **Horário de domingo**, se houver. Hoje o domingo não aparece e fica bloqueado no formulário.
- [ ] **Dentistas, CRO e atendimentos** confirmados, se a clínica quiser exibi-los.
- [ ] **Fotos** do espaço (opcional).
- [ ] **Logo completo em alta qualidade.** A versão atual (`referencias/logo-prevent-v2.png`, 195×139 px) está nítida, mas vem cortada nas bordas (parte do dente, o "t" de Prevent e o último "A"). Um PNG transparente ou SVG do logo inteiro resolve.
- [ ] Atualizar `siteUrl` para o domínio definitivo.

## Regras de conteúdo (CFO)

- O logo contém "ODONTOLOGIA ESPECIALIZADA", mas o texto do site **não** usa "especializado/especialista": sem registro de especialidade comprovado, o CFO proíbe. Se a clínica tiver especialidade registrada, ela só pode aparecer com o registro visível.
- Sem superlativos, promessas de resultado, preços, descontos, depoimentos, antes e depois ou tempo de atuação.
- Não citar procedimentos sem confirmação da clínica (por isso `atendimentos` está vazio).

## Formulário de agendamento

O formulário não envia nada a servidor nenhum e não salva dados no navegador. Ele só monta a mensagem e abre `wa.me` com o texto pronto. Datas passadas e dias sem atendimento ficam bloqueados; os horários são gerados em blocos de 1 hora a partir de `horarios` (sem o almoço e sem passar do fechamento).

## Deploy

Projeto separado na Vercel com **Root Directory = `odonto-prevent`** (framework Vite, saída `dist`). O `vercel.json` já define build, saída e cabeçalhos. Em outros serviços estáticos (Netlify, Cloudflare Pages), publique a pasta `dist/`; o `_headers` já está lá.
