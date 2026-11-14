# B Clinic · site (rascunho)

Site de página única da B Clinic (Pouso Alegre - MG). Vite + React + TypeScript + Tailwind + motion, estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (HTML pré-renderizado)
npm run preview  # serve o dist/
```

## Onde editar

Todo o conteúdo fica em **`src/config.ts`**. Campo vazio (`''`) = o item não aparece e o layout se reorganiza.

| O que | Campo |
| --- | --- |
| Faixa de rascunho + noindex | `rascunho` (`true`/`false`) |
| URL pública (canonical, og:url, JSON-LD) | `siteUrl` |
| Ligar/desligar seções | `secoes.clinica`, `secoes.tratamentos`, … |
| Endereço, rota e mapa | `endereco` |
| Telefone / WhatsApp | `telefone`, `telefoneLink`, `whatsapp`, `usarWhatsapp` |
| Horários | `horarios` (domingo com `abre`/`fecha` vazios = fechado) |
| Frase da clínica | `frase` (apague o texto para remover) |
| Tratamentos | `tratamentos` (capítulos → itens; o índice e o formulário crescem sozinhos) |
| Fundadora / equipe | `profissionais` (`profissao`, `registro`, `foto`) |
| Responsável técnico (rodapé) | `responsavelTecnico.nome` + `responsavelTecnico.registro` |
| Logo original | `logo` (ex.: `/logo.svg` em `public/`) |

- **WhatsApp:** se o número não for WhatsApp, use `usarWhatsapp: false`. Todos os botões passam a abrir o direct do Instagram, o "Ligar" continua e a seção "Solicitar agendamento" some.
- **Fotos autorizadas:** coloque o arquivo em `public/fotos/` e preencha `foto: '/fotos/nome.jpg'` e `fotoAlt`. A foto entra dentro do círculo da seção Equipe.
- **Logo original:** coloque o SVG/PNG em alta resolução em `public/` e preencha `logo`. Sem isso, o site usa o monograma redesenhado (`src/components/Monograma.tsx`).
- **Publicar de forma definitiva:** `rascunho: false` e retire o `Disallow: /` de `public/robots.txt`, o `X-Robots-Tag` de `public/_headers` e de `vercel.json`.

## Antes de publicar de forma definitiva, confirmar com a clínica

1. **WhatsApp:** confirmar se o número da ficha do Google, (35) 99900-3915, é o WhatsApp da clínica.
2. **Endereço atual:** confirmar com a clínica qual é o endereço atual. O site usa o do Google Maps (Rua Ciomara Amaral de Paula, 217, Santa Elisa). O perfil do WhatsApp Business mostra outro (Avenida Alberto de Barros Cobra, 675, 9º andar), que não aparece no site.
3. **Horários:** confirmar os horários reais com a clínica antes de publicar. Google: seg. a sáb., 08h00 às 19h00. Perfil do WhatsApp Business: 09h00 às 18h00, com o domingo listado.
4. **Profissão e registro da fundadora** (Júlia Beraldo), para exibir abaixo do nome.
5. **Responsável técnico** (nome e registro).
6. **Foto autorizada** da fundadora e/ou do espaço.
7. **Logo em alta resolução** (SVG ou PNG), para substituir o redesenho.

## Deploy

- Vercel: `vercel.json` já envia `X-Robots-Tag: noindex, nofollow`. Projeto Vite, saída `dist/`.
- Outros hosts estáticos (Netlify, Cloudflare Pages): `dist/_headers` faz o mesmo.
