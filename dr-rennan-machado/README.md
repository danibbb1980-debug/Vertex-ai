# Site Dr. Rennan Machado (rascunho)

Site de página única do Dr. Rennan Machado, cirurgião-dentista em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/ (com HTML pré-renderizado)
npm run preview   # serve o dist/
```

## Onde editar

**Tudo fica em `src/config.ts`.** Campo vazio (`''`, `null`, `[]`) = o bloco não aparece, e o layout se reorganiza.

| O que | Campo |
|---|---|
| Ligar/desligar seções | `secoes` (`dentista`, `atendimentos`, `faixa`, `quandoProcurar`, `comoFunciona`, `estrutura`, `duvidas`, `contato`, `agendar`, `ctaFinal`) |
| Foto do dentista (hero) | `foto` (`null` = composição tipográfica). Coloque o arquivo em `public/img/` |
| Segunda foto (bloco "O dentista") | `fotoSecundaria` |
| Fotos do consultório | `fotosConsultorio` (lista; vazia = galeria some) |
| Formação | `formacao: ['Graduação em ...', ...]` |
| Horário de segunda | `horarios[1]` hoje é `null` (desconhecido: não aparece e fica bloqueado no agendamento). Ex.: `1: { abre: '09:00', fecha: '18:00' }` |
| Almoço | `almoco: { abre: '12:00', fecha: '13:00' }` (os horários do formulário passam a pular esse intervalo) |
| Atendimentos | `atendimentos` (também alimentam o select do formulário) |
| Formulário | `agendamento.exigirAtendimento`, `agendamento.urgencia` |

### Especialidades (regra do CFO)

A bio do Instagram cita especialidades, mas o número de registro não foi informado.
Por isso `mostrarEspecialidades: false` e a palavra "especialista" não aparece em lugar nenhum.
Quando o dentista confirmar, preencha e ligue:

```ts
mostrarEspecialidades: true,
especialidades: [
  { nome: 'Ortodontia', registro: 'número do registro no CRO' },
  { nome: 'Endodontia', registro: 'número do registro no CRO' },
],
```

Só aparecem as especialidades com `registro` preenchido (no bloco do dentista e no JSON-LD).

## Modo rascunho e publicação definitiva

Hoje o site tem a faixa "Rascunho para avaliação" e **noindex em três camadas**:
metas `robots`/`googlebot`, `public/robots.txt` (`Disallow: /`), cabeçalho `X-Robots-Tag`
em `public/_headers` e em `vercel.json`.

Para publicar de verdade:

1. `src/config.ts`: `rascunho: false` (remove a faixa e as metas noindex) e `siteUrl` com o domínio final.
2. `public/robots.txt`: troque por `User-agent: *` + `Allow: /`.
3. Apague `public/_headers` e o bloco `X-Robots-Tag` do `vercel.json`.
4. `public/privacidade.html` e `public/404.html`: remova a faixa e a meta noindex.

O que ainda falta confirmar com o dentista:

- Número de registro das especialidades (Ortodontia e Endodontia).
- Horário de segunda-feira (o Google mostrou "fechado" só por causa do feriado).
- Intervalo de almoço, se houver.
- Logo em alta qualidade (PNG/SVG com fundo transparente). O atual tem só 150 × 150 px.
- Fotos originais do consultório em alta resolução (as atuais foram recortadas de capturas de tela do Google Maps).
- Informações de acessibilidade do espaço, se existirem (hoje nada é dito).
- Formação/currículo, se ele quiser exibir.

## Arquivos

- `referencias/`: logo e fotos originais recebidos.
- `public/img/`: versões otimizadas (WebP) usadas no site.
- `scripts/prerender.mjs`: pré-renderiza o HTML, embute o CSS e pré-carrega as fontes.
- `public/privacidade.html`: explica que o site não guarda dados.

## Deploy

Vercel: na pasta `dr-rennan-machado/`, `vercel deploy --prod --yes` (projeto `dr-rennan-machado-rascunho`).
Depois atualize `siteUrl` com a URL real e faça novo deploy.
Qualquer hospedagem estática também serve: envie o conteúdo de `dist/` (o `_headers` funciona no Netlify/Cloudflare Pages).
