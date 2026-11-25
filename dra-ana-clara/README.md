# Dra. Ana Clara Grimberg · Harmonização facial · Limeira/SP (RASCUNHO)

Site de página única, estático, Vite + React + TypeScript + Tailwind 4 + motion.
Sem backend, sem banco, sem cookies, sem analytics. `noindex` em metas, `robots.txt`,
`public/_headers` e `vercel.json`.

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # tsc + build + pré-renderização do HTML (conteúdo legível sem JS)
npm run preview   # serve o dist em http://localhost:4173
```

Deploy na Vercel: projeto com **Root Directory = `dra-ana-clara`** (o `vercel.json` já define
framework, build e saída).

## Editar conteúdo: `src/config.ts`

Tudo vem dali. Campo vazio = o bloco some e o layout se reorganiza.

- **Seções**: `CONFIG.secoes.<nome> = false` desliga a seção.
- **Atendimentos**: cada item tem `ativo`. Ligar um desligado exige também uma `descricao`
  geral, sem técnica, marca, prazo, preço ou promessa.
- **Casos (antes/depois)**: `CONFIG.casos`, cada um com `ativo`.
- **Intro**: `CONFIG.intro` (padrão `false`; não implementada como cortina, o hero já tem o momento de assinatura).
- **Rascunho**: `CONFIG.rascunho = false` tira a faixa. Para publicar de verdade, remova também o
  `noindex` de `index.html`, `public/robots.txt`, `public/_headers` e `vercel.json`.
- **URL**: `CONFIG.siteUrl` e a variável `SITE_URL` do build (canonical, og:url, og:image, JSON-LD).
- **Fotos**: coloque o arquivo em `src/assets/fotos/`, importe em `config.ts` e preencha `w`, `h` e `alt`.

## Logo

Logo **recriado em vetor a partir de imagem de baixa resolução** (prints do Instagram): monograma "AG"
desenhado como traço de pena caligráfica e nome em Bellefair convertido em curvas.
Arquivos em `public/logo/` (vertical e horizontal, vinho e marfim) e `src/logoMono.json`.
**Substituir pelo vetor original da profissional quando houver.**

## Testar antes de publicar

- Abrir um botão de agendamento e confirmar que `https://wa.me/5519994728181` abre a conversa certa.
- Enviar o formulário e conferir acentos e quebras de linha da mensagem no WhatsApp.

## O que depende da Dra. Ana Clara

1. **Autorização das imagens de pacientes.** A seção "Casos" usa imagens de antes e depois do perfil
   dela, a pedido do vendedor. Antes de publicar, ela precisa confirmar que tem autorização por escrito
   de cada pessoa para uso no site, e que a divulgação segue as regras de publicidade do CFO.
   Sem isso, desligue `CONFIG.secoes.casos`.
2. Como ela quer descrever a harmonização facial e **quais procedimentos específicos podem ser anunciados**
   (todos estão desligados ou descritos de forma geral).
3. Se o **"Método GRIM"** pode ser divulgado e como.
4. Se quer expressões do perfil ("naturalidade", "resultados naturais", "autoestima"), sabendo que são
   promessas de aparência.
5. **Logo vetorial original.**
6. Fotos: retratos e consultório foram recortados de prints do Instagram dela; o ideal são os arquivos originais
   em alta resolução.
