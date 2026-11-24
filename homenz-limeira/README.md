# Homenz Limeira, rascunho do site

Página única estática (Vite + React com Preact/compat + TypeScript + Tailwind), pré-renderizada no build: o conteúdo existe no HTML mesmo sem JavaScript. Sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (HTML pré-renderizado + CSS inline)
npm run preview  # serve o dist/
```

## Editar o conteúdo: `src/config.ts`

Tudo o que aparece no site vem daí. Campo vazio = o bloco não aparece.

- **Seções**: `secoes.atendimentos`, `clinica`, `comoFunciona`, `duvidas`, `contato`, `agendar`, `ctaFinal` (`true`/`false`).
- **Atendimentos**: cada item tem `ativo` e `area` (`cabelo`, `rosto`, `corpo`, `depilacao`). Com `ativo: false` a linha some da ficha do hero, do índice, do formulário, das dúvidas, do JSON-LD, e a mensagem do WhatsApp se ajusta. Para incluir um novo, copie um item e ajuste `nome`, `rotulo`, `naFrase` e `descricao`.
- **Horários**: `horarios` (0 = domingo … 6 = sábado). O formulário gera os horários de 1 em 1 hora até 1 hora antes de fechar e bloqueia os dias sem atendimento.
- **Abertura**: `intro` (padrão `false`; não implementada como efeito, reservada).
- **Rascunho**: `rascunho: false` tira a faixa. Para publicar de verdade, remova também o `noindex`: metas `robots`/`googlebot` em `index.html`, `public/robots.txt` (`Disallow: /` → `Allow: /`), `public/_headers` e o cabeçalho `X-Robots-Tag` em `vercel.json`. Atualize `siteUrl` para o domínio final.
- **WhatsApp**: `whatsapp: "5519990188717"`. **Teste o link** `https://wa.me/5519990188717` num celular antes de publicar.

## Fotos e logo

- **Fotos autorizadas** (ambiente, fachada; nunca clientes, nunca antes e depois): coloque em `public/fotos/` e liste em `CONFIG.fotos` (`src`, `alt`, `largura`, `altura`). Hoje a lista está vazia e nenhuma foto aparece.
- **Logo**: `referencias/logo.png` foi recortado da foto de perfil do Instagram (resolução limitada). Para trocar por uma versão em alta, substitua `public/logo-88.png`, `public/logo-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png` e `public/favicon-32.png` pelo novo arquivo nos mesmos tamanhos.
- `referencias/instagram/` guarda as capturas do perfil enviadas como referência de identidade. Elas **não** são usadas no site.

## O que falta para publicar de forma definitiva

1. **Profissional responsável pelos cuidados capilares e o registro dele**: muda as regras de publicidade dos cuidados capilares. Preencher `responsavel` só depois de confirmar.
2. **Marca Homenz**: confirmar com a cliente se a marca exige identidade visual ou site padronizados entre unidades.
3. **Atendimentos anunciáveis**: quais podem aparecer e com que descrição.
4. **Logo em alta resolução** (vetor ou PNG grande).
5. **Fotos autorizadas** do ambiente.
6. **Testar o link wa.me** e desligar o rascunho/noindex.
