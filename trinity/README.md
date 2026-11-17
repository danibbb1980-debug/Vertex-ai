# Trinity | Rascunho do site

Página única estática (Vite + React + TypeScript + Tailwind), sem backend. Em modo rascunho: faixa de aviso e `noindex` em três camadas (meta, `public/robots.txt`, `X-Robots-Tag` em `public/_headers` e `vercel.json`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ com o HTML pré-renderizado
```

## Editar o conteúdo: `src/config.ts`

Tudo vem desse arquivo. **Campo vazio ou lista vazia = o bloco não aparece** e o layout se reorganiza.

- **Ligar/desligar seções:** `CONFIG.secoes` (`caminhos`, `atendimentos`, `registros`, `cursos`, `espaco`, `profissionais`, `comoFunciona`, `duvidas`, `local`, `agendar`, `ctaFinal`).
- **Atendimentos:** acrescente itens em `CONFIG.atendimentos` (`nome` e `descricao`). O índice numerado, os botões e o formulário crescem sozinhos.
- **Cursos:** `CONFIG.cursos`. Hoje só traz a frase de contato. Lista vazia = seção some.
- **Profissionais:** preencha `CONFIG.profissionais` com `nome`, `profissao`, `registro` e `foto` (opcional). Só aparece quem tiver nome **e** registro.
- **Responsável técnico:** `CONFIG.responsavelTecnico` (nome e registro). Aparece no rodapé quando preenchido.
- **Fotos:** coloque os arquivos em `public/img/` (de preferência `.webp`, com uma versão `-600.webp`) e liste em `CONFIG.fotosEspaco` ou `CONFIG.fotosRegistros` com `alt`, `legenda`, `largura` e `altura`. Os originais recortados estão em `referencias/fotos/`.
- **Logo original:** salve como `public/logo.svg` e defina `CONFIG.logo = '/logo.svg'`. O logotipo atual foi recriado (nó redesenhado + "TRINITY" em Bodoni Moda e descritor em Schibsted Grotesk, convertidos em contornos).
- **Tirar do modo rascunho:** `CONFIG.rascunho = false`, atualize `CONFIG.siteUrl` e apague `public/robots.txt`/`public/_headers` e o bloco `headers` do `vercel.json`.

## Para publicar de forma definitiva, falta

1. Nome, profissão e registro profissional de quem atende e o responsável técnico.
2. Lista real de procedimentos (hoje: só "Estética facial" e "Estética corporal").
3. Informações reais dos cursos.
4. Autorização de uso das fotos (as atuais vêm do Google Maps e do Instagram da Trinity; a da recepção foi publicada por uma cliente). Os comparativos têm marca d'água com o nome de uma profissional.
5. Logo em alta resolução (SVG ou PNG grande).
