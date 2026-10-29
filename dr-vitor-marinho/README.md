# Site Dr. Vitor Alexandre Marinho (rascunho)

Site de página única do consultório do Dr. Vitor Alexandre Marinho, Cirurgião-Dentista em Alfenas - MG.
Vite + React + TypeScript + Tailwind CSS 4, estático, sem backend, sem analytics e sem cookies.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (HTML já pré-renderizado)
npm run preview   # serve o dist/
```

## Onde editar

**Todos os dados ficam em `src/config.ts`.** Regra do projeto: campo vazio = a parte correspondente não aparece.
Ao preencher, ela aparece sozinha, sem mexer em componentes.

| O que | Campo | Onde aparece quando preenchido |
|---|---|---|
| CRO | `cro: 'CRO-MG 00000'` | Hero, cartão do profissional, rodapé e JSON-LD |
| Título de especialista | `mostrarEspecialista: true` (exige `cro`) | "Especialista em Dentística" junto do CRO |
| Instagram | `instagram: 'https://instagram.com/...'` | Rodapé |
| Foto do doutor | coloque o arquivo em `public/img/` e use `fotos.doutor: '/img/dr-vitor.webp'` | Cartão do profissional (no lugar da composição de quadrados) |
| Fotos do consultório | `fotos.consultorio: [{ src: '/img/sala.webp', alt: 'Sala de atendimento' }]` | Galeria na seção "Estrutura e conforto" |
| Horários | `horarios` (dia 0 = domingo; `almoco` opcional) | Hero, estrutura, contato, rodapé, FAQ, JSON-LD e horários do formulário |
| Atendimentos | `atendimentos` | Cartões, faixa animada, "Para quem" e opções do formulário |
| Seções | `secoes.{nome}: false` | Desliga a seção inteira (e o link do menu, quando houver) |

Título, descrição e imagem de compartilhamento: `seo`. A URL pública fica em `siteUrl` (usada no canonical, og:url e JSON-LD).

## Modo rascunho

`rascunho: true` mostra a faixa "Rascunho para avaliação..." e gera `noindex, nofollow` nas metas.
Há mais duas camadas de bloqueio, que **precisam ser removidas à mão** na publicação definitiva:

1. `public/robots.txt` → trocar `Disallow: /` por `Allow: /`
2. `public/_headers` (Netlify) e `vercel.json` (Vercel) → remover o cabeçalho `X-Robots-Tag`

## O que falta para publicar de forma definitiva

- [ ] **Número do CRO** (exigência do CFO: o site não deve ir ao ar em definitivo sem ele).
- [ ] Confirmar o registro de especialidade em Dentística no CRO antes de ativar `mostrarEspecialista`.
- [ ] Fotos reais do doutor e do consultório (opcional, mas recomendado).
- [ ] Logo em alta resolução (SVG ou PNG com fundo transparente). O atual tem 203 px e fica levemente suave em telas retina.
- [ ] Instagram, se houver.
- [ ] Atualizar `siteUrl` com o domínio final e desligar o modo rascunho (ver acima).

## Notas técnicas

- O build pré-renderiza a página (`scripts/prerender.mjs`): o HTML chega completo, com o CSS embutido. O JavaScript
  (menu, formulário, animações ao rolar) carrega quando o navegador fica livre.
- Animações só com `transform`/`opacity`, pausadas fora da tela, e versão estática com `prefers-reduced-motion`.
- O mapa do Google só carrega quando o visitante clica em "Carregar mapa interativo" (sem cookies de terceiros antes disso).
- O formulário "Solicitar agendamento" não envia nada a servidor: monta a mensagem e abre o WhatsApp.
- `public/og-image.png` é a imagem de compartilhamento (1200×630). `referencias/` guarda o logo e a foto da fachada originais.
- O título do hero usa uma adaptação do componente "Vertical Cut Reveal" (21st.dev), refeita em CSS.
