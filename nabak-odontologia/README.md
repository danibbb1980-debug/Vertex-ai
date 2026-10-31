# Nabak Odontologia · site (rascunho)

Página única para a Nabak Odontologia, em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (inclui privacidade.html e 404.html)
npm run preview   # serve o dist/
```

## Onde editar

Todo o conteúdo variável fica em **`src/config.ts`**. Campo vazio (`''`, `[]`) = o bloco não aparece, e o layout se reorganiza.

| Quero… | Faça em `src/config.ts` |
| --- | --- |
| Ligar/desligar uma seção | `secoes.<nome>: true/false` |
| Trocar WhatsApp | `whatsapp` (só dígitos, com 55 + DDD) e `telefoneExibicao` |
| Mudar horários | `horarios` (um item por dia aberto; `almoco: { inicio, fim }` opcional). O formulário bloqueia os dias ausentes e gera os horários em blocos de 1 h, sem almoço e sem o horário de fechamento. |
| Adicionar profissionais | `profissionais: [{ nome, formacao, cro, foto }]` → a seção “Equipe” aparece sozinha |
| Responsável técnico | `responsavelTecnico: { nome, cro }` → aparece no rodapé e no JSON-LD |
| Fotos | Coloque o original em `referencias/fotos/`, gere `public/fotos/<nome>-480.webp`, `-800.webp` e `-1100.webp`, e adicione em `fotos`. A 1ª foto vai no oval do hero; a 2ª e a 3ª, na seção “A clínica”. Sem fotos, o hero mostra a ilustração em traço. |
| Sair do rascunho | `rascunho: false` (tira a faixa e as metas noindex) **e** apague a linha `X-Robots-Tag` de `public/_headers` e de `vercel.json`, e troque `public/robots.txt` por `Allow: /`. |
| URL pública | `siteUrl` (canonical, og:url, og:image e JSON-LD usam esse valor) |

As metas, o JSON-LD (`Dentist`) e as páginas `privacidade.html` e `404.html` são geradas no build a partir do config (`src/seo.ts`).

## Antes de publicar de forma definitiva

- [ ] **Responsável técnico com CRO** (exigência do CFO para publicidade odontológica). Hoje está vazio e não aparece.
- [ ] **Conferir o WhatsApp.** O número recebido foi `+55 35 9118-2910` (8 dígitos). No config está `5535991182910`, com o 9 de celular acrescentado. Confirme com a clínica.
- [ ] **Logo em alta qualidade.** O arquivo recebido tem 203 × 203 px, com fundo. Um SVG ou PNG grande com fundo transparente deixa o logo nítido em telas retina.
- [ ] Autorização para uso das fotos da equipe (vieram do Instagram e do Google). Nomes e formação, se quiserem a seção “Equipe”.
- [ ] Desligar o modo rascunho (ver tabela acima).

## O que ficou de fora por falta de dados

Nomes, formação e CRO dos profissionais; responsável técnico; avaliações; convênios; preços; tempo de atuação.
Fotos de pacientes, bocas e “antes e depois” do material recebido **não** foram usadas (CFO).
