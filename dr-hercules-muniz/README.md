# Site Dr. Hércules Muniz (rascunho)

Página única do Dr. Hércules Muniz, cirurgião-dentista em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind. É estático: sem backend, sem banco, sem analytics e sem cookies.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (com HTML pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
```

## Onde editar

**Tudo fica em `src/config.ts`.** Regra: campo vazio = o bloco não aparece. O layout se reorganiza sozinho.

| O que | Campo |
|---|---|
| Ligar/desligar seções inteiras | `secoes` (ex.: `faq: false`) |
| WhatsApp, Instagram, Maps, endereço | `whatsapp`, `instagram`, `mapsUrl`, `endereco` |
| Horários (o formulário usa os mesmos) | `horarios` (`dia`: 0 = domingo … 6 = sábado). Almoço: `intervalo: { inicio: '12:00', fim: '13:30' }` |
| Atendimentos (cartões e opções do formulário) | `atendimentos` |
| Perguntas frequentes | `faq` |
| Formação e currículo | `formacao: ['...']` |
| Outros profissionais | `equipe: [{ nome, titulo, cro }]` |
| Logo | coloque o arquivo em `public/` e preencha `logo: '/logo.png'` |
| URL publicada (canonical, og:url e og:image) | `siteUrl` |

### Fotos
- **Dentista:** já está em `public/fotos/` (recorte da foto enviada, em WebP 480/600/720 + JPG). Para trocar, substitua os arquivos e ajuste `fotos.dentista`. `null` = composição tipográfica com o anel dourado.
- **Consultório:** 5 fotos em `fotos.consultorio`, recortadas de capturas de tela do Google (originais em `referencias/fotos/consultorio/`). Fotos retrato ocupam duas linhas na grade e a primeira foto horizontal fica em destaque. Fotos originais em alta resolução melhorariam a nitidez.
- Originais em `referencias/fotos/`.

### Especialidades (regra do CFO)
Só se anuncia especialidade com título registrado e número visível. Hoje `mostrarEspecialidades: false`, e o site não usa a palavra "especialista" em lugar nenhum. Quando o dentista confirmar:

```ts
mostrarEspecialidades: true,
especialidades: [{ nome: 'Implantodontia', registro: 'NÚMERO DO REGISTRO' }],
```

Sem o número preenchido, a especialidade continua escondida, também no JSON-LD.

### Desligar o rascunho (publicação definitiva)
1. `rascunho: false` em `src/config.ts`. Isso remove a faixa e troca o meta robots para `index, follow`.
2. Apague `public/_headers` e o bloco `X-Robots-Tag` do `vercel.json`.
3. Troque `public/robots.txt` por `User-agent: *` + `Allow: /`.
4. Remova a faixa e o `noindex` de `public/privacidade.html` e `public/404.html` (HTML estático).

## O que falta para publicar de forma definitiva
- Número do **registro de especialidade** (para poder citar implantes/ortodontia como especialidade).
- **Logo** em PNG ou SVG com fundo transparente. O arquivo não veio no material, então o site usa uma assinatura tipográfica.
- Definição sobre o **"& Associados"** do logo: há outros profissionais para listar (`equipe`)?
- **Fotos do consultório** originais em alta resolução (as atuais vêm de capturas de tela, com cerca de 1000 px).
- Confirmar a foto do dentista. O recorte escolhido deixa de fora o bordado do jaleco ("Implantod…"), que poderia ser lido como anúncio de especialidade.
- Confirmar horários, formas de pagamento e acessibilidade (dados vindos do Google).

## Notas técnicas
- `scripts/prerender.mjs` gera o HTML da página no build, coloca o CSS inline e pré-carrega as fontes principais. O conteúdo aparece antes do JavaScript.
- As animações usam CSS mais um IntersectionObserver (`src/efeitos.ts`). Mexem só em `transform`/`opacity`, pausam fora da tela e respeitam `prefers-reduced-motion`.
- O `<head>` (title, description, Open Graph, canonical, robots e JSON-LD `Dentist`) é montado a partir do config em `vite.config.ts`.
- O formulário "Solicitar agendamento" só monta a mensagem e abre `wa.me`. Nada é enviado a um servidor nem salvo no navegador.
