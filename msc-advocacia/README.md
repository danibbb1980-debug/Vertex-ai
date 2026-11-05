# MSC Advocacia Previdenciária · rascunho da reformulação

Proposta da Lumivo Web para a advogada avaliar. Página única estática (Vite + React + TypeScript + Tailwind + motion + Lenis), sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (HTML pré-renderizado)
npm run preview   # serve o dist/
```

## Onde editar

Todos os dados e textos ficam em **`src/config.ts`**: contatos, horários, endereço, áreas, etapas, FAQ e conteúdos.
Regra: dado não confirmado não entra no site. Deixe o campo vazio, sem placeholder.

| O que | Como |
|---|---|
| Mostrar a advogada | Preencha `fundadora.oab` **e** ligue `mostrarFundadora: true`. Sem OAB, o bloco não aparece, mesmo com a flag ligada. |
| Mostrar a trajetória | `mostrarTrajetoria: true` (cerca de 20 anos de atuação, passagem pela Procuradoria Federal do INSS). Ligue só depois de a advogada confirmar. |
| Atendimento à distância | `atendeOnline` (liga/desliga a menção e a pergunta do FAQ). |
| Modo rascunho | `rascunho: false` remove a faixa e troca a meta robots para `index, follow`. Para publicar de verdade, apague também `public/robots.txt` (ou troque por `Allow: /`), o `X-Robots-Tag` de `public/_headers` e de `vercel.json`, e o `noindex` de `public/privacidade.html` e `public/404.html`. |
| URL do site | `siteUrl` (canonical, og:url e JSON-LD). Atualize também o canonical de `public/privacidade.html`. |
| Trocar o logo | Substitua `public/logo-msc-branco-*.webp` (fundo escuro) e `public/logo-msc-grafite-*.webp` (fundo claro). O original está em `referencias/logo-msc-branco.webp`; a versão grafite e o favicon (só os picos) foram gerados a partir dele, sem redesenho. |

## O que a advogada deve revisar antes de publicar

- Todos os textos informativos: descrições das áreas, planejamento, etapas, os 3 cartões de "Conteúdo útil" e o FAQ. Foram escritos de forma geral, sem prazos, valores ou regras do INSS, mas precisam de revisão técnica.
- Conformidade com o Provimento 205/2021 da OAB (o texto evita promessa de resultado, "especialista", preços e comparações).
- Foto do escritório (`public/escritorio-*.webp`, original em `referencias/foto-escritorio.jpg`): aparecem pessoas trabalhando. Antes de publicar, o escritório precisa ter a autorização de uso de imagem de cada uma (LGPD).
- Endereço: veio do site atual (R. Pref. Chagas, 305, sala 301, Centro, 37701-734). Confirmar.

## O que falta para publicar

- Número da OAB (para exibir a advogada).
- Confirmação da trajetória e do endereço completo.
- Outras redes sociais, se houver (hoje só o Instagram @mscadvocaciaprev).
- O domínio **mscadvocaciaprev.com.br é da advogada**: não mexer nele a partir deste projeto.

## Notas técnicas

- `scripts/prerender.mjs` pré-renderiza o HTML no build; `src/boot.ts` carrega o app logo após a primeira pintura.
- Fontes (Fraunces e Inter Tight) são locais, recortadas para o português, em `public/fonts/`.
- O formulário de pré-atendimento só monta um link `wa.me`: não envia nada a servidor e não usa localStorage.
