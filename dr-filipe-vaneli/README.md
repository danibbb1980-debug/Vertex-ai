# Dr. Filipe Vaneli: site (rascunho)

Vite + React + TypeScript + Tailwind. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Deploy na Vercel

Importe o repositório na Vercel e defina **Root Directory = `dr-filipe-vaneli`**. O `vercel.json` já define framework Vite, `dist/` e o cabeçalho `X-Robots-Tag: noindex, nofollow`.
Pela CLI: `cd dr-filipe-vaneli && vercel deploy --prod` (projeto sugerido: `dr-filipe-vaneli-rascunho`).
Depois do deploy, troque `CONFIG.siteUrl` em `src/config.ts` e as URLs absolutas de `index.html` (canonical, og:url, og:image, JSON-LD) se o domínio for outro.

## Editar conteúdo: `src/config.ts`

- **Seções**: `CONFIG.secoes` liga/desliga cada bloco. A régua e o menu se renumeram sozinhos.
- **Atendimentos**: acrescente itens em `CONFIG.atendimentos` (o índice, o formulário e as dúvidas se atualizam).
- **Antes e depois**: `CONFIG.casos` (imagens em `public/img/`). Lista vazia = a seção some.
- **Fotos do consultório**: `CONFIG.consultorio`.
- **Logo**: o logotipo é um SVG criado a partir do nome (`src/components/Logo.tsx`). Para usar um arquivo definitivo, preencha `CONFIG.logo`.
- **RQE / especialidade / responsável técnico**: preencha `profissionais[0].rqe`, `profissionais[0].especialidade` e `responsavelTecnico`. Vazios não aparecem.
- **Rascunho**: `CONFIG.rascunho = false` remove a faixa. Para indexar, remova também os `noindex` de `index.html`, `public/robots.txt`, `public/_headers` e `vercel.json`.

## Pendências antes de publicar de forma definitiva

1. **Autorização dos pacientes** para as imagens de antes e depois (foram tiradas das publicações do próprio médico). Confirmar também que o uso está de acordo com a Resolução CFM nº 2.336/2023.
2. **"Botox masculino"**: nome usado como aparece no material do médico, mas "Botox" é marca registrada; a publicidade médica deve evitar marcas. Sugestão: "Toxina botulínica masculina" (trocar em `atendimentos` e `casos`).
3. **Cidade do consultório**: Santana da Vargem no Google Maps, Três Pontas no Instagram.
4. RQE, se houver; logo definitivo; lista oficial de procedimentos.
