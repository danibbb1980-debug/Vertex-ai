# Med Center Vital Brazil — site (rascunho)

Página única do centro de saúde multiprofissional em Pouso Alegre - MG.
Vite + React + TypeScript + Tailwind + `motion`. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve dist/
```

## Editar o conteúdo: `src/config.ts`

Todo o texto variável está em `src/config.ts`. **Campo vazio = o bloco não aparece.**

| O que | Onde |
|---|---|
| Ligar/desligar seções | `CONFIG.secoes` (`true`/`false`) |
| Faixa de rascunho | `CONFIG.rascunho` |
| URL pública (canonical, og:url, JSON-LD) | `CONFIG.siteUrl` — refaça o build depois de mudar |
| Áreas de atendimento | `CONFIG.areas` |
| Andar de cada área | `andar: "terreo" \| "primeiro" \| "segundo"` na área. Com o andar preenchido, o cartão mostra o andar e o botão usa o WhatsApp daquele andar |
| Profissionais | `CONFIG.profissionais`: `nome`, `area`, `registro` (obrigatório), `rqe` (só médicos, se houver), `formacao` (só se estiver na arte), `foto` (opcional) |
| Fotos | Coloque o arquivo em `public/profissionais/` e use `foto: "/profissionais/nome.jpg"` |
| Opções do formulário | `CONFIG.atendimentos` |
| Horários | `CONFIG.horarios` (formulário) e `CONFIG.horariosTexto` (texto). Para um intervalo de almoço: `almoco: ["12:00", "13:00"]` |
| Procedimentos estéticos e habilitações | `mostrarProcedimentosEsteticos` / `mostrarHabilitacoes` — **só ligue com comprovação** |

A seção Profissionais só aparece para quem tem `registro` preenchido. Se ninguém tiver, a seção e o link do menu somem.

## Modo rascunho (noindex)

- `<meta name="robots">` e `googlebot` com `noindex, nofollow` (`index.html`)
- `public/robots.txt` com `Disallow: /`
- `X-Robots-Tag: noindex, nofollow` em `public/_headers` e em `vercel.json`

Para publicar de verdade: `CONFIG.rascunho = false`, remova as metas `robots`/`googlebot` do `index.html`, troque o `robots.txt` por `Allow: /`, e apague o `X-Robots-Tag` de `public/_headers` e `vercel.json`.

## Registros transcritos (de `referencias/profissionais/`)

| Profissional | Registro | Situação |
|---|---|---|
| Dra. Kenmelly A. Ferreira | CRBM 17220 | no site |
| Dra. Valéria Andrade | CREFITO 313205-F | no site |
| Dra. Renata de Almeida | CRN 9/4401 (exibido como CRN-9 4401) | no site, sem formação (UNIVAS/UFLA/IPGS não aparecem na arte) |
| Dra. Ruth Ferrari | CRN9 32137 | no site |
| Dr. Eduardo Lucas | CRM 51841 · RQE 33067 | no site. A arte não diz a qual especialidade o RQE se refere; confirmar |
| Dra. Ana Carolina Brasil e Bernardes | CRN 96501 | no site, com formação informada (está na arte) |
| Dr. Rodrigo C. F. Cardim | CRM 85366 | no site como "Saúde mental" (sem RQE na arte, não aparece "Psiquiatria") |
| Dra. Samara Chiachio Mendes | CRO 50412 | no site, sem "especialista" e sem "Invisalign" |
| Dra. Marina Barros | CRO MG7226 (exibido como CRO-MG 7226) | no site, sem sedação |
| Dr. Eliandro Rosa Nascimento | "OUT MG 251550" | **fora**: não é um conselho reconhecível |
| Dra. Júlia Figueiredo | — | **fora**: sem arte com registro |
| Dra. Bruna B. de Faria (CRO MG 59168) e Dra. Camila S. Silva (CRO 51935) | — | **fora**: têm arte, mas não estão na lista de áreas recebida. Confirmar se atendem no centro |

## O que falta para a versão definitiva

1. Confirmar se o WhatsApp do térreo (`CONFIG.whatsappPrincipal`) é a recepção geral.
2. Informar qual área atende em qual andar (`andar` em cada área).
3. Registro da Dra. Júlia Figueiredo e um registro válido do Dr. Eliandro.
4. Confirmar o uso dos títulos "Psiquiatria", "Cardiologia" e "Ginecologia e obstetrícia" como áreas, já que só o Dr. Eduardo tem RQE visível.
5. Fotos em boa qualidade (rosto separado, sem arte de rede social), se quiserem fotos nos cartões.
6. Logo em alta qualidade (PNG ou SVG com fundo transparente). O arquivo atual tem só 150 × 150 px.
7. Desligar o modo rascunho (ver acima).

A foto da fachada em `referencias/fachada.jpg` não é usada: o briefing pede que não haja fotos do centro sem aprovação.
