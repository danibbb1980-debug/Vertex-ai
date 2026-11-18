# BIOS Instituto de Odontologia e Estética — site (rascunho)

Vite + React + TypeScript + Tailwind 4 + motion. Site estático, sem backend, sem cookies, sem analytics.
O HTML é pré-renderizado no build (conteúdo já vem no `index.html`).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (index.html, privacidade.html, 404.html, _headers, robots.txt)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Onde editar

Tudo fica em **`src/config.ts`**. Regra: campo vazio (`""` ou `[]`) não aparece no site. Não há placeholders.

| O quê | Campo |
|---|---|
| Ligar/desligar seções inteiras | `secoes` |
| Responsável técnico e CRO (aparece no rodapé e em "O instituto") | `responsavelTecnico: { nome, cro }` |
| Inscrição da entidade no CRO | `registroCRO` |
| Equipe (nome, CRO e especialidade **só com registro**) | `equipe` |
| Horários (mostra os horários no contato e troca o campo livre do formulário por data + blocos de 1 hora) | `horarios` — ex.: `{ dia: 1, abre: "08:00", fecha: "18:00", pausas: [{ inicio: "12:00", fim: "13:00" }] }` (0 = domingo) |
| Ampliar atendimentos (o índice, o formulário e as dúvidas crescem sozinhos) | `atendimentos` |
| Procedimentos vindos do diretório de terceiros (clareamento, facetas, alinhadores, aparelho, consulta) | `mostrarAtendimentosDiretorio` (deixe `false` até o cliente confirmar) |
| Fotos autorizadas (fachada, recepção, ambientes, equipamentos — **nunca pacientes**) | coloque em `public/fotos/` e liste em `fotos: [{ src: "/fotos/fachada.jpg", alt: "Fachada do instituto" }]`. A primeira vira `og:image`. |
| Trocar o logo redesenhado pelo arquivo oficial | coloque o arquivo em `public/` e informe `logo: "/logo-bios.svg"` |
| WhatsApp, telefone, Instagram, endereço, links do Maps | campos de mesmo nome |
| URL pública (canonical, og:url, JSON-LD) | `siteUrl` |
| Desligar o modo rascunho | `rascunho: false` **e** apague `public/_headers`, troque `public/robots.txt` por `Allow: /` e remova o cabeçalho `X-Robots-Tag` do `vercel.json` |

O logotipo foi redesenhado em SVG a partir de uma foto pequena do perfil (`scripts/redesenhar-logo.py` gera
`src/components/logo-paths.ts`). O arquivo vetorial original deve substituí-lo.

## Antes de publicar de forma definitiva

1. **Confirmar com o cliente o responsável técnico, os CROs, a inscrição da entidade (EPAO) e o segundo telefone.** Foram lidos numa foto pequena da placa da fachada, de cerca de 2 anos atrás. São exigência da publicidade odontológica de pessoa jurídica (Res. CFO 196/2019).
2. Horários de atendimento.
3. Lista real de procedimentos confirmada pelo cliente (decidir sobre `mostrarAtendimentosDiretorio`).
4. Fotos autorizadas, sem pacientes.
5. Logo vetorial oficial (SVG, PDF ou PNG em alta resolução).
6. **Confirmar o número do WhatsApp (informado com 8 dígitos) e testar o link wa.me.**
7. Desligar o rascunho (ver tabela acima).

## Deploy

Vercel: o `vercel.json` já define framework Vite, `dist/` e os cabeçalhos (`X-Robots-Tag: noindex, nofollow` enquanto for rascunho).
Em outra hospedagem estática, publique o conteúdo de `dist/` (o `_headers` funciona em Netlify e Cloudflare Pages).
