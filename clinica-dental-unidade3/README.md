# Clínica Dental · Unidade 3 (Santo Antônio) · rascunho

Site de página única da Clínica Dental, Unidade 3, em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (com o HTML pré-renderizado)
npm run preview   # serve o dist/
```

O build pré-renderiza a página (`scripts/prerender.mjs`): o texto aparece antes do JavaScript carregar.

## Onde editar

**Todos os dados ficam em `src/config.ts`.** Regra: campo vazio (`""` ou `[]`) = o bloco não aparece, e o layout se reorganiza sozinho. Não há placeholders no site.

| O que | Onde, em `src/config.ts` |
|---|---|
| Ligar/desligar seções | `secoes` (`true`/`false`) |
| Atendimentos (cartões, select do formulário, FAQ) | `atendimentos` |
| Endereço, WhatsApp, Instagram, Maps, horários | `unidades[0]` |
| Horários (bloqueiam dias e geram os horários do formulário) | `unidades[0].horarios` (`almoco` opcional) |
| Profissionais (a seção "Equipe" aparece sozinha) | `unidades[0].profissionais` |
| Fotos aprovadas (a seção "O espaço" aparece sozinha) | coloque em `public/img/fotos/` e liste em `unidades[0].fotos` |
| Foto da fachada (em "Localização e contato") | `unidades[0].fachada` (`null` = não aparece) |
| Responsável técnico e CRO (rodapé e JSON-LD) | `unidades[0].responsavelTecnico` |
| Faixa de inauguração no hero | `unidades[0].inauguracao` (texto; vazio = não aparece) |
| Aviso de urgência acima do formulário | `unidades[0].prontoSocorro` |
| Exigir atendimento no formulário | `agendamento.exigirAtendimento` |
| Imagem de compartilhamento (og:image, 1200×630) | `seo.ogImagem` |

**Outras unidades:** adicione um objeto em `unidades` com `ativa: true`. Com mais de uma unidade ativa, aparece um seletor no header, e o primeiro campo do formulário passa a ser "Unidade" (a mensagem vai para o WhatsApp da unidade escolhida).

**Título, descrição, canonical, Open Graph e JSON-LD** são gerados do config pelo `vite.config.ts`.

## Desligar o rascunho (publicação definitiva)

1. `src/config.ts`: `rascunho: false` (remove a faixa e as metas `noindex`) e `siteUrl` com o domínio final.
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. `public/_headers` e `vercel.json`: remova a linha `X-Robots-Tag`.
4. `public/privacidade.html` e `public/404.html`: remova a faixa de rascunho, a meta `robots` e ajuste o canonical.

## Falta para publicar de forma definitiva

- [ ] **Responsável técnico com CRO** (exigência do CFO para publicidade odontológica). Hoje não aparece por falta de dado.
- [ ] **Bairro e número do endereço.** O Google mostra a praça sem número e no bairro "Saúde"; a arte da clínica mostra o nº 80 e o bairro "Santo Antônio". Por isso o site exibe "Praça Vereador José Custódio Ferreira, 80, Pouso Alegre - MG", sem bairro. "Santo Antônio" aparece só como parte da marca (como no logo). Confirmar.
- [ ] **Inauguração.** A arte da fachada diz "Inauguração em breve", mas o Google já mostra horários. Se a unidade ainda não abriu, defina o texto e a data em `inauguracao` antes de publicar.
- [ ] **Logo em alta qualidade.** O arquivo atual tem 150×150 px, com fundo. Um PNG/SVG com fundo transparente melhora a nitidez (header, hero, rodapé).
- [ ] **Foto da fachada em resolução maior.** A atual (do Google) tem 408×306 px e também é usada como imagem de compartilhamento (og:image); o ideal seria 1200×630.
- [ ] **Fotos aprovadas** do interior e da equipe (sem pacientes; pessoas só identificadas).

Imagens do material recebido que ficaram de fora de propósito: a arte "Vem aí... algo especial" (pessoa não identificada e texto de inauguração) e os posts de prótese protocolo e limpeza (antes e depois, imagens de pacientes e frases como "saúde garantida", vetados pelo CFO e pelo briefing).
- [ ] **Profissionais** (nome, função, CRO).
- [ ] **Acessibilidade do local**, se existir (o Google não informa; o site não afirma nada).
- [ ] **URL final** em `siteUrl` (o valor atual, `clinica-dental-unidade3-rascunho.vercel.app`, é o endereço esperado do projeto na Vercel e precisa ser confirmado após o deploy).

## Deploy

- **Vercel:** importe a pasta `clinica-dental-unidade3/` como projeto (Root Directory) ou rode `vercel deploy --prod` dentro dela. O `vercel.json` já define build, saída e cabeçalhos.
- **Hospedagem estática / Netlify:** envie o conteúdo de `dist/` (o `_headers` já vai junto).

## Créditos de componentes

Adaptados do 21st.dev: "Vertical Cut Reveal" (@cnippet-dev) → `TextoRevelado`; "Accordion" (@ddoemonn) → `Acordeao`.
Inspirados no 21st.dev e implementados do zero: luz que segue o ponteiro (`CartaoLuz`), marquee (`Marquee`), linha do tempo com progresso (`ComoFunciona`), ondas (`Ondas`).
