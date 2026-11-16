# Euflânia | Centro Estético e Cursos (rascunho)

Site de página única para Varginha - MG. Vite + React + TypeScript + Tailwind, 100% estático,
sem backend, sem cookies próprios e sem analytics. O HTML é pré-renderizado no build.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (com o HTML pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Editar o conteúdo: `src/config.ts`

Todos os dados ficam em `src/config.ts`. **Campo vazio (`""` ou `[]`) = o bloco não aparece.**
Não existe nenhum placeholder no site; o layout se reorganiza sozinho.

| O que | Campo |
| --- | --- |
| Nome da profissional | `nomeProfissional` (aparece ao lado de "Esteticista", na Formação) |
| Registro profissional | `registro` |
| Responsável técnico (rodapé) | `responsavelTecnico` |
| Tempo de atuação | `anosAtuacao` (vazio de propósito, ver pendências) |
| E-mail | `email` (aparece no rodapé) |
| Atendimentos | `atendimentos`: cada item `{ nome, descricao }` vira linha numerada, botão de WhatsApp próprio e opção no formulário |
| Cursos | `cursos`: com itens, aparecem a seção, o link "Cursos" no menu e a opção "Informações sobre cursos" no formulário |
| Formação | `formacao` (lista de frases; `[]` remove a seção e o link do menu) |
| Horários | `horarios` (o formulário gera os horários em blocos de 1 h, até 1 h antes do fechamento) |
| Ligar/desligar seções | `secoes` |

### Fotos autorizadas
Coloque os arquivos em `public/fotos/` e liste em `fotos`, por exemplo
`{ src: "/fotos/espaco-1.jpg", alt: "Sala de atendimento" }`. Elas aparecem em recortes verticais
sóbrios depois da seção de atendimentos, e a primeira vira a `og:image`. Use só fotos com autorização,
nunca de clientes, corpos ou antes e depois.

### Logo original
O logotipo foi recriado em SVG (texto vetorial) porque a imagem recebida tinha baixa resolução.
Quando houver o arquivo original, salve em `public/` e preencha
`logo: { claro: "/logo-grafite.svg", escuro: "/logo-dourado.svg" }`
(`claro` = para fundo claro; `escuro` = versão dourada para fundo escuro).

## Publicar de forma definitiva (desligar o rascunho)
1. `src/config.ts`: `rascunho: false` (some a faixa e a meta passa a `index, follow`).
2. `public/robots.txt`: troque `Disallow: /` por `Allow: /`.
3. Remova o cabeçalho `X-Robots-Tag` de `public/_headers` e de `vercel.json`.
4. Atualize `siteUrl` com o domínio final e rode `npm run build`.

## Pendências antes de publicar
- **Cursos**: não há nenhuma informação (nomes, descrições). A seção está pronta, mas vazia e oculta.
- **Logo em alta resolução** (SVG ou PNG grande).
- **Confirmar a formação** com a profissional: o perfil do Google cita Senac, Unifran e pós-graduação
  em Estética Avançada, mas não informa o curso da graduação.
- **Tempo de atuação**: o Instagram diz "+20 anos" e o Google diz "mais de 18 anos". Por causa do
  conflito, nada foi exibido.
- **Lista real de atendimentos**: hoje só "Estética corporal".
- Nome da profissional, registro e responsável técnico, se for o caso.
- Fotos autorizadas do espaço.

## Notas técnicas
- Fontes: Newsreader (títulos) e Hanken Grotesk (texto), auto-hospedadas em `public/fonts/`,
  recortadas para o alfabeto latino a partir de `@fontsource-variable/*` (licença OFL).
- Noindex em três camadas: metas `robots`/`googlebot`, `public/robots.txt`, `X-Robots-Tag`
  em `public/_headers` (Netlify/Cloudflare) e em `vercel.json`.
- O formulário só monta a mensagem e abre `wa.me`. Nada é enviado nem guardado.
