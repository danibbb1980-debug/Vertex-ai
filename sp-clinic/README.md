# SP Clinic · site (rascunho)

Site de página única da SP Clinic, Estética Avançada, em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem analytics, sem cookies.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (index.html, privacidade.html, 404.html, _headers, robots.txt)
npm run preview    # serve o dist/ em http://localhost:4173
```

## Onde editar

Tudo está em **`src/config.ts`**. Regra do projeto: campo vazio (`''` ou `[]`) = o bloco não aparece no site.
Não existe placeholder na tela.

| O que | Campo |
|---|---|
| Ligar/desligar seções | `CONFIG.secoes` (uma seção ligada só aparece se tiver conteúdo) |
| Tratamentos (índice e formulário crescem sozinhos) | `CONFIG.tratamentos` (`nome` + `descricao`) |
| Linha final do índice | `CONFIG.tratamentosComplemento` |
| Horários (página, FAQ, JSON-LD e formulário) | `CONFIG.horarios` (`abre`/`fecha` em `"HH:MM"`, `null` = fechado) |
| WhatsApp, telefone, e-mail, Instagram | `CONFIG.whatsapp`, `CONFIG.telefone`, `CONFIG.email`, `CONFIG.instagram` |
| Fotos do espaço (exibidas dentro dos arcos) | coloque o arquivo em `public/fotos/` e adicione `{ src, alt, legenda }` em `CONFIG.fotos` |
| Logo original | coloque o SVG/PNG em `public/` e preencha `CONFIG.logo` (ex.: `'/logo.svg'`). Vazio = redesenho vetorial |
| Equipe | `CONFIG.profissionais`: `nome` (obrigatório), `cargo`, `profissao`, `conselho` + `registro`, `foto`. Campo vazio não aparece. O registro só é exibido com o número preenchido, no formato `CRF-MG nº 12345` (ex.: `conselho: 'CRF-MG', registro: '12345'`). Nunca usar "Dr." ou "Dra." no nome. Título de especialista só com `especialidade: { titulo, registro }` (RQE ou equivalente) |
| Fotos da equipe | substitua o arquivo em `public/equipe/` (mesmo nome) ou aponte `foto` para o novo arquivo. Use foto enviada e autorizada pela pessoa |
| Responsável técnico (rodapé) | `CONFIG.responsavelTecnico` (`nome` e `registro`) |
| URL pública | `CONFIG.siteUrl` (canonical, og:url, og:image e JSON-LD) |

## Desligar o rascunho (publicação definitiva)

1. `CONFIG.rascunho = false` (remove a faixa e troca as metas para `index, follow`).
2. `public/robots.txt` → `User-agent: *` / `Allow: /`.
3. `public/_headers` → remova a linha `X-Robots-Tag`.
4. `vercel.json` → remova o bloco `headers` com `X-Robots-Tag`.
5. `npm run build` e novo deploy.

## O que falta para publicar de forma definitiva

> **Atenção, antes de qualquer publicação definitiva:**
>
> 1. **Fotos da equipe**: as fotos de Polliana Damasceno e Stefani Paiva Cavecchia (`public/equipe/`) são as fotos de perfil do Instagram, usadas **apenas para este rascunho**. Substituir por fotos enviadas e autorizadas.
> 2. **Registro e cargos**: não publicar sem o **número do CRF-MG da Polliana** (preencher `registro`) e sem a **confirmação do cargo da Stefani**: o perfil dela informa "Empreendedor(a)" e não diz "fundadora", então o site mostra só "Empreendedora". A Polliana aparece como "Fundadora · Farmacêutica esteta e docente", conforme o perfil.
> 3. **Horário**: Google Maps 08h00 às 20h00 x perfil do WhatsApp 09h00 às 16h00, ainda pendente de confirmação.

- **Responsável técnico**: preencher `CONFIG.responsavelTecnico` (nome e registro) para aparecer no rodapé.
- **Horário real**: o Google Maps informa segunda a sexta, 08h00 às 20h00; o perfil do WhatsApp Business informa 09h00 às 16h00. O config usa o do Google. **Confirmar com a clínica antes de publicar** (o formulário gera os horários a partir daqui).
- **Lista completa de tratamentos** (hoje: os destaques do Instagram).
- **Fotos com autorização e em alta resolução**: as quatro fotos do espaço vieram de capturas de tela das publicações da própria clínica (`referencias/fotos/`), em baixa resolução. Substituir pelos originais.
- **Logo em alta resolução** (SVG ou PNG): hoje é um redesenho vetorial do monograma (`src/components/Logo.tsx`, `referencias/monograma.svg`).

## Estrutura

- `src/components/Hero.tsx`: momento de assinatura "a porta se abre" (arcos desenhados + porta caramelo que cresce até virar o fundo da seção seguinte). Com `prefers-reduced-motion`, tudo aparece pronto e nada cresce.
- `src/components/Agendar.tsx`: formulário que só monta a mensagem e abre o WhatsApp. Nada é enviado ou guardado.
- `vite.config.ts`: injeta título, description, canonical, Open Graph, robots e JSON-LD (`BeautySalon`) a partir do config.
- `referencias/`: logo do perfil, fotos recortadas e o SVG de referência do monograma.
