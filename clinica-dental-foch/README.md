# Clínica Dental · Unidade 1 (Foch) · rascunho

Site de página única da Clínica Dental, Unidade Foch, em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4. É estático, sem backend e sem coleta de dados.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (HTML pré-renderizado, CSS embutido)
npm run preview   # serve o dist/
```

> No bundle, o React é trocado pelo **Preact** (mesma API) para ter um JS cerca de 3x menor
> (27 KB gzip). O código continua sendo React. Para voltar ao React puro, apague o bloco
> `resolve.alias` em `vite.config.ts`.

## Onde editar: `src/config.ts`

Todo o conteúdo variável está neste arquivo. **Campo vazio (`''` ou `[]`) = a parte não aparece.**
Ao preencher, ela aparece sozinha, sem mexer em componentes.

| Quero… | Campo | Efeito |
|---|---|---|
| Listar atendimentos | `atendimentos: [{ titulo, descricao }]` | A seção "Como cuidamos" vira cartões de atendimento, com "depende de avaliação individual" e botão de WhatsApp. O select do formulário passa a listar os itens. |
| Mostrar profissionais | `profissionais: [{ nome, cro, formacao?, foto? }]` | Aparece a seção "Equipe". |
| Responsável técnico | `responsavelTecnico` e `cro` | Aparecem no rodapé e no JSON-LD. |
| Fotos da clínica | `fotos: [{ src, srcset?, alt, legenda?, largura, altura }]` (arquivos em `public/fotos/`) | Galeria "Ambiente" em mosaico. Hoje: consultório, recepção e equipe. |
| Foto da fachada | `unidades[n].fachada` | Miniatura no cartão de endereço. |
| Nova unidade | adicione um objeto em `unidades` | Aparecem o seletor de unidade (faixa no topo), a seção "Unidades" e o campo "Unidade" no formulário. WhatsApp, mapa e horários seguem a unidade escolhida. |
| Mudar horários | `unidades[n].horarios` (`null` = fechado; `almoco: ['12:00','13:00']` opcional) | Atualiza contato, FAQ, JSON-LD, os dias bloqueados e os horários do formulário. |
| Ligar/desligar seções | `secoes` | `false` remove a seção e o link do menu. |
| Atendimento de urgência | `urgencia: true` | Mostra o aviso "Está com dor ou urgência?" acima do formulário. |
| Exigir atendimento no formulário | `agendamento.exigirAtendimento: true` | O campo passa a ser obrigatório. |

## Tirar do modo rascunho

São 4 lugares, de propósito (proteção em camadas):

1. `src/config.ts`: `rascunho: false` (remove a faixa e as metas `noindex`) e `siteUrl` com o domínio final.
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers`: apague a linha `X-Robots-Tag: noindex, nofollow`.
4. `vercel.json`: apague o cabeçalho `X-Robots-Tag`.

Também tire a faixa e o `noindex` de `public/privacidade.html`.

## O que falta para publicar de forma definitiva

- [ ] **Responsável técnico e CRO** (exigência do CFO; sem eles o site não deve ir ao ar como definitivo).
- [ ] **Conferir o WhatsApp.** O dado recebido foi "55 35 9929-8789" (faltava um dígito). O site usa **(35) 99929-8789**,
      número que também aparece na fachada da clínica (foto do Google Maps). Confirme com a clínica.
- [ ] Lista de atendimentos confirmados pela clínica (só procedimentos que ela realmente oferece).
- [ ] Profissionais (nome, CRO, formação). A foto da equipe já está na galeria, sem nomes.
- [ ] Fotos em resolução original: as atuais vieram do Instagram e do Google Maps, foram recortadas para tirar
      os textos aplicados e quem estava na sala de espera. A da fachada tem só 203 × 434 px.
- [ ] Logo em alta qualidade (SVG ou PNG transparente). O arquivo atual tem 150 × 150 px.
- [ ] Domínio final em `siteUrl` e saída do modo rascunho (acima).

## Regras de conteúdo (CFO)

Sem promessa de resultado, superlativos ("o melhor", "referência", "excelência"…), preço, promoção, parcelamento,
desconto, antes e depois, depoimentos, número de pacientes ou tempo de atuação. Especialidades só se registradas.

## Privacidade

Sem analytics, pixels ou cookies próprios. O formulário só monta uma mensagem e abre o WhatsApp: nada é enviado a
servidor nem salvo no navegador. O mapa do Google é carregado só quando a seção de contato se aproxima da tela.
