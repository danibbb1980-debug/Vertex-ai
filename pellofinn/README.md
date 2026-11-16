# PelloFinn | Depilação a Laser e Estética (rascunho)

Site estático (Vite + React + TypeScript + Tailwind + motion), sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev     # desenvolvimento
npm run build   # gera dist/
```

## Como editar
Todos os dados ficam em `src/config.ts`. Campo vazio (`""` ou lista vazia) não aparece no site.

- **Seções**: `CONFIG.secoes` liga/desliga cada seção.
- **Atendimentos**: acrescente itens em `CONFIG.atendimentos`; o índice, o formulário e as dúvidas crescem sozinhos.
- **Profissionais**: em `CONFIG.profissionais`, preencha `formacao` e `registro` quando houver documento. Eles aparecem abaixo do nome.
- **Fotos**: fotos autorizadas ficam em `public/fotos/` (`nome-400.webp` e `nome-640.webp`, proporção 4:5) e são indicadas em `foto` sem o sufixo. Os originais recortados estão em `referencias/fotos/`.
- **Logo original**: coloque o arquivo em `public/` e indique o caminho em `CONFIG.logo` (substitui o logotipo recriado).
- **Responsável técnico**: `CONFIG.responsavelTecnico`.
- **Rascunho**: `CONFIG.rascunho = false` remove a faixa. Para publicar de vez, retire também o `noindex` do `index.html`, `public/robots.txt`, `public/_headers` e `vercel.json`, e atualize `CONFIG.siteUrl`, canonical e og:url.

## Falta para publicar de forma definitiva
- Logo em alta resolução (SVG ou PNG); o atual foi recriado em código.
- Confirmação por escrito do uso das fotos de Eliana Pellofinn e Lethicia Labadia (recortadas de vídeos do Instagram, em tom monocromático).
- Formação e registro das profissionais (a bio do Instagram cita especialização em micropigmentação, que não aparece no site sem certificado).
- Cargo ou profissão de Lethicia Labadia (hoje o rótulo é "Depilação a laser").
- Lista real e completa de atendimentos.
- Grafia da rua: o Google Maps mostra "R. Cel. João Urbâno"; o site usa "Rua Coronel João Urbano".
- Horários (vindos do Google Maps).
