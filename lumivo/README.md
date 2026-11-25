# Lumivo Web — site oficial

Página única, mobile-first, de lumivoweb.com.br. Vite + React + TypeScript + Tailwind 4 + motion, com pré-render estático. Sem backend, sem cookies: o formulário abre o WhatsApp com as respostas.

```bash
cd lumivo
npm install
npm run dev        # desenvolvimento
npm run build      # typecheck + build + pré-render → dist/
npm run preview    # serve dist/ em http://localhost:4173
node scripts/qa-quiz.cjs /tmp   # QA do menu e do quiz (com o preview rodando)
```

**Conteúdo:** tudo em `src/config.ts`. Campo vazio = bloco não aparece.
- `site.rascunho: true` liga noindex em 3 camadas e a faixa de rascunho.
- `secoes.projetos`: só ligue com cases reais e autorização por escrito.
- `mostrarPreco`: desligado por padrão.

**Deploy (Cloudflare Pages):** build command `npm run build`, output `dist`, root directory `lumivo`. O `_headers` (cache e segurança) é gerado no build.

Documentos: `PLANO.md` (estrutura e animações), `DECISOES.md` (escolhas e hipóteses), `QA.md` (testes e números).
