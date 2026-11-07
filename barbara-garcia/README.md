# Barbara Garcia Estética (rascunho)

Site de página única para a Barbara Garcia Estética, na Vila Fleming, em São João da Boa Vista - SP.
Está em **modo rascunho**: faixa de aviso no topo e `noindex` em todas as camadas.

Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend e sem serviço pago.
O HTML é pré-renderizado no build (bom para SEO e velocidade) e o React assume depois.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/ (checa tipos, compila e pré-renderiza)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Onde editar

Quase tudo fica em **`src/config.ts`**. Regra geral: campo vazio (`''`, `null` ou `[]`) faz o bloco sumir,
e o layout se reorganiza sozinho. Não há placeholder em lugar nenhum.

| O que | Campo |
|---|---|
| WhatsApp (só dígitos, com 55 + DDD) e como ele aparece | `whatsapp`, `whatsappExibicao` |
| Horários por dia (`null` = fechado) | `horarios` |
| Destaques da faixa de horários | `destaquesHorario` |
| Atendimentos (nome, descrição, texto da mensagem) | `atendimentos` |
| Ligar/desligar seções | `secoes` |
| Mensagens de WhatsApp | `mensagens` |
| Opções do formulário | `agendamento` |
| Endereço, Maps e Instagram | `endereco`, `maps`, `instagram` |
| URL pública (canonical, og:url, JSON-LD) | `siteUrl` |

Os horários do formulário são gerados a partir de `horarios`, em blocos de 1 hora, terminando 1 hora antes
do fechamento (segunda 15:00 a 19:00; terça 07:00 a 18:00; quarta 06:00 a 18:00; quinta 08:00 a 20:00;
sexta 08:00 a 19:00; sábado 08:00 a 17:00; domingo bloqueado).

Textos de seções (Sobre, Antes de agendar, Como funciona, Dúvidas) ficam nos componentes em `src/components/`.

## Fotos

A foto da seção "Sobre" vem de `referencias/fotos/barbara-jaleco.jpg`, recortada para tirar o aparelho que
aparecia na mão (ele sugeria um serviço que não está na lista). Para trocar:

1. Gere `public/img/<nome>-320` e `-440` em `.webp` e `.avif` (proporção 4:5).
2. Ajuste `foto.base`, `largura`, `altura` e `alt` em `src/config.ts`.
3. `foto: null` volta para a composição com monograma e favo.

Nunca use fotos de clientes, de corpos, de pele, de procedimentos nem antes e depois.

A pasta `referencias/` também guarda uma segunda foto (não usada, escura demais) e um logo de outra marca,
"Studio D'elas", que veio junto nas referências e **não** foi usado por não ser desta marca.

## Marca provisória

Não havia logo oficial em arquivo, então a marca foi criada do zero e é **provisória**: wordmark em Literata,
descritor "ESTÉTICA" em Figtree e o monograma "BG" num favo com uma gota de mel.

- Arquivos: `public/brand/` (logo e monograma para fundo claro e escuro), `public/favicon.svg`, ícones PNG.
- Para regerar: `pip install fonttools brotli` e `python3 scripts/gerar-marca.py`.
- Para trocar pelo oficial: substitua os SVG em `public/brand/` e o `favicon.svg`, e ajuste os componentes
  `Logo` e `Monograma` em `src/components/Marca.tsx`.

Observação: o jaleco da foto mostra um logo bordado com uma flor de lótus e o nome escrito "Bárbara", com acento.
Vale confirmar com a cliente se esse é o logo oficial e qual grafia usar.

## Dados que faltam (hoje não aparecem)

Título profissional, formação, registro, tempo de atuação, tipos de massagem, técnicas, produtos, duração,
fotos do espaço, preços, convênios e avaliações. Quando forem informados:

- `profissional.titulo`, `.formacao`, `.registro` em `src/config.ts` aparecem sob o título do "Sobre".
- Descrições mais detalhadas dos atendimentos vão em `atendimentos[].descricao` (sem promessa de resultado).

Regras de conteúdo deste site: sem promessa de resultado ou bem-estar, sem superlativos, sem antes e depois,
sem depoimentos, sem preço nem promoção, sem "terapeuta", "especialista", "indolor" ou "definitiva".

## Antes de publicar de verdade

1. Confirmar com a cliente: WhatsApp (19) 97169-2684, horários do Google, grafia do nome e o logo.
2. Em `src/config.ts`: `rascunho: false` e `siteUrl` com o domínio final.
3. Remover o `noindex` das outras camadas:
   - `public/robots.txt` → `User-agent: *` e `Allow: /` (ou apagar o arquivo);
   - `public/_headers` → apagar a linha `X-Robots-Tag`;
   - `vercel.json` → apagar o cabeçalho `X-Robots-Tag`;
   - `public/privacidade.html` e `public/404.html` → apagar a faixa e as metas `robots`/`googlebot`, e
     atualizar o `canonical` da privacidade.
4. `npm run build` e novo deploy.

## Deploy

- **Vercel**: projeto `barbara-garcia-rascunho`. O `vercel.json` já traz o build, o `dist/` e os cabeçalhos.
  Como a pasta fica dentro de outro repositório, use `barbara-garcia` como *Root Directory*.
- **Outra hospedagem estática** (Netlify, Cloudflare Pages): basta enviar o conteúdo de `dist/`.
  O `_headers` aplica o `noindex` nessas hospedagens.

## Privacidade

O site não guarda nada: sem cookies, sem analytics, sem `localStorage`. O formulário só monta a mensagem e
abre o WhatsApp. O mapa do Google só carrega quando a pessoa toca em "Mostrar mapa".
