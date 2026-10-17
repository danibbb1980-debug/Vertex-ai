# Star Sorrindo Poços de Caldas — site oficial

Site da clínica odontológica Star Sorrindo (Implantes), no Centro de Poços de
Caldas – MG. Foco: gerar contatos qualificados e agendamentos de avaliação
pelo WhatsApp, com destaque para implantes dentários e próteses.

Next.js 16 (App Router, exportação estática) · React 19 · TypeScript ·
Tailwind CSS 4 · lucide-react. Sem backend, sem cookies, sem analytics.
Animações em CSS, respeitando `prefers-reduced-motion`.

## Rodando

```bash
cd star-sorrindo
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # gera a pasta out/ — o site pronto
```

## Publicando

`npm run build` gera **`out/`**, um site 100% estático. Para o domínio certo
sair no sitemap, canonical e Open Graph, gere assim:

```bash
NEXT_PUBLIC_SITE_URL=https://www.dominiodaclinica.com.br npm run build
```

- **Hostinger / cPanel / qualquer Apache:** envie o *conteúdo* de `out/` para
  `public_html/`. O `.htaccess` incluído configura a página 404, headers de
  segurança e cache.
- **Vercel:** importe o repositório com *Root Directory = `star-sorrindo`* e
  configure `NEXT_PUBLIC_SITE_URL` em Environment Variables.
- **Netlify:** arraste a pasta `out/` no painel (deploy manual).

## Onde mudar cada coisa

| O quê | Onde |
|---|---|
| Endereço, telefone/WhatsApp, Instagram, Maps, nota do Google, horários, tratamentos, avaliações, fotos, mensagens de WhatsApp | `lib/site-data.ts` (fonte única) |
| Casos de antes e depois (ligar/desligar, remover casos) | `lib/site-data.ts` → `clinicalCases` |
| Responsável técnico e CRO (aparece no rodapé) | `lib/site-data.ts` → `technicalResponsible` |
| Perguntas do FAQ | `lib/faq.ts` |
| Dados estruturados (Dentist, FAQ, breadcrumbs) | `lib/structured-data.ts` |
| Cores e tipografia | `app/globals.css` (`@theme`) e `app/layout.tsx` |
| Logotipo | `components/ui/Logo.tsx` |
| Política de privacidade | `app/politica-de-privacidade/page.tsx` |
| Páginas no sitemap | `app/sitemap.ts` |

Fotos: coloque o arquivo em `public/images/` (WebP ou JPG, ~1100 px no lado
maior, sem metadados) e aponte `src` em `lib/site-data.ts`.

## ⚠️ Confirmar com a clínica antes de publicar

1. **WhatsApp.** O site usa (35) 99888-3596 — o número da ficha do Google e o
   mesmo pintado na fachada. Na mensagem original veio outro número: confirme
   qual é o de agendamento.
2. **Horários** (seg–sex 09h–19h, sáb 08h–15h, dom fechado).
3. **Antes e depois.** As 5 imagens vieram do Instagram da clínica. A
   Resolução CFO 196/2019 exige autorização por escrito de cada paciente e a
   identificação do responsável técnico (nome + CRO). Sem isso, mude
   `clinicalCases.enabled` para `false`.
4. **Responsável técnico e CRO** → preencher `technicalResponsible`.
5. **Logotipo oficial em alta.** Só recebemos o logo em 150 px
   (`public/brand/logo-original-150.jpg`), pequeno demais. O site usa uma
   versão tipográfica provisória. Peça o arquivo em SVG/PDF/PNG grande.
6. **Lista de tratamentos.** Estão publicados só os confirmados: implantes,
   próteses e clínica geral. Outros só entram após confirmação.
7. **Nota do Google** (4,9 com 12 avaliações, ref. outubro de 2026) —
   atualizar conforme o perfil.
8. **Política de privacidade** — revisar o texto-base com a clínica.

## Decisões do projeto

- **Sem promessas clínicas.** Nada de "sem dor", "resultado garantido",
  prazos ou elegibilidade universal. Preço, duração e indicação sempre
  dependem da avaliação.
- **Sem dados inventados.** Nenhum nome de dentista, CRO, título,
  equipamento, número de pacientes ou anos de experiência.
- **Avaliações** com a redação original do Google, sem nome/foto do autor.
  O JSON-LD não tem `aggregateRating` (avaliações autodeclaradas violam as
  diretrizes do Google).
- **WhatsApp é a rota principal:** header, hero, seções de tratamento,
  barra fixa no celular, botão flutuante no desktop e mensagens prontas por
  tratamento. O site deixa claro que o clique inicia uma conversa e que o
  horário é confirmado pela equipe.
- **Formulário sem backend:** monta a mensagem e abre o WhatsApp. Pede só
  nome, assunto e período (nenhum dado de saúde), com consentimento LGPD.
- **Mapa sob demanda:** o iframe do Google Maps só carrega quando o
  visitante clica, mantendo o site rápido e sem cookies de terceiros.
- **Canonical e sitemap** só são emitidos com `NEXT_PUBLIC_SITE_URL`
  definido, para não indexar um domínio provisório.
- **Futuro:** a estrutura já aceita novas páginas de tratamento
  (`app/<slug>/page.tsx`), perfis de profissionais, conteúdo educativo e
  analytics — este último só com banner de consentimento e atualização da
  política de privacidade.
