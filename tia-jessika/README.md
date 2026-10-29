# Site Tia Jessika (rascunho v2)

Site da Dra. Jessika Domingues, a **Tia Jessika**, Odontopediatra em Alfenas - MG (CRO-MG 48389).
Vite + React + TypeScript + Tailwind 4 + Motion. Estático, sem backend, sem analytics, sem cookies.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (com o HTML pré-renderizado)
npm run preview  # serve o dist/
```

## Onde editar

Tudo fica em **`src/config.ts`**. Regra do projeto: campo vazio (`''`, `[]` ou `null`) = a parte correspondente não aparece. Ao preencher, ela aparece sozinha.

| O quê | Campo |
|---|---|
| Ligar/desligar seções | `secoes` (`consultorio`, `atendimento`, `pais`, `primeiraConsulta`, `profissional`, `estrutura`, `duvidas`, `contato`, `agendar`, `ctaFinal`, `marquee`) |
| Contatos | `whatsapp` (só números, com 55), `telefone`, `instagram`, `mapsUrl`, `endereco` |
| Horários (também geram os horários do formulário) | `horarios` (`almocoInicio`/`almocoFim` descontam o almoço, se informado) |
| Especialidades | `mostrarEspecialidades` (desligue se o registro no CRO não for confirmado) |
| Como os pais acompanham a consulta | `paisAcompanham` (vazio = texto genérico) |
| Atendimentos do formulário | `atendimentos` |

### Fotos

- **Doutora:** `fotos.doutora` (hoje: o retrato no espaço kids). Com `null`, aparece o monograma "TJ".
- **Consultório:** coloque os arquivos em `public/img/` e adicione em `fotos.consultorio` (`src`, `alt`, `width`, `height`). Elas aparecem na seção "Estrutura e conforto".
- Nunca use fotos de crianças, fotos com personagens/marcas ou antes e depois.

Originais em `referencias/` (logo extraído da foto da parede e retrato).

### Rascunho

`rascunho: true` mostra a faixa "Rascunho para avaliação" e marca `noindex`. Para publicar de vez:

1. `rascunho: false` em `src/config.ts`;
2. apague `public/robots.txt` (ou troque por `Allow: /`) e remova o `X-Robots-Tag` de `public/_headers` e de `vercel.json`;
3. ajuste `siteUrl` para o domínio final e faça novo deploy.

## O que falta para a versão definitiva

- Aprovação da doutora para o retrato usado e envio de fotos do consultório (sem crianças).
- Logo em alta qualidade (PNG transparente ou SVG). O atual foi recortado de uma foto da parede.
- Confirmação do registro das duas especialidades no CRO (senão, `mostrarEspecialidades: false`).
- Como os pais acompanham o atendimento (`paisAcompanham`) e se há intervalo de almoço.
- Domínio próprio.

## Deploy

- **Vercel:** `vercel deploy --prod --yes` dentro desta pasta (projeto `tia-jessika-rascunho-v2`). O `vercel.json` já define o build e o `X-Robots-Tag`.
- **Netlify Drop:** arraste o zip do `dist/` (o `_headers` já vai junto).
