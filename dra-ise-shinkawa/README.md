# Site Dra. Ise Shinkawa (rascunho)

Cirurgia e Traumatologia Bucomaxilofacial, Limeira - SP. Vite + React + TypeScript + Tailwind, estático, sem backend.
O HTML é pré-renderizado no build (o conteúdo aparece sem JavaScript).

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (pré-renderizado)
```

## Editar conteúdo
Tudo está em `src/config.ts`. Campo vazio = o bloco não aparece.

- **Seções**: `CONFIG.secoes` (true/false).
- **Atendimentos**: cada item tem `ativo`. Rinomodelação, Rejuvenescimento facial e Laser estão **desligados** e não aparecem em lugar nenhum (página, formulário, JSON-LD). Para ligar, use `ativo: true` e escreva uma `descricao` geral, sem promessa, aparelho, marca ou preço.
- **Intro**: `CONFIG.intro` (padrão false).
- **Fotos**: `CONFIG.fotos` (retratos e consultório) e `CONFIG.casos` (antes e depois). Imagens em `public/img/` (WebP).
- **Logo**: recriado em vetor a partir de imagem de baixa resolução (`scripts/gen_logo.py` gera `public/logo.svg`, `logo-marinho.svg`, `monograma.svg`, `favicon.svg`; `scripts/gen_png.cjs` gera PNGs e `og.png`). **Substituir pelo vetor original do designer da profissional quando houver** (`CONFIG.logo`).
- **WhatsApp**: `CONFIG.whatsapp`. Testar o link wa.me: https://wa.me/5519997128622
- **Desligar o rascunho** (publicação definitiva): `CONFIG.rascunho = false`, remover `noindex` de `index.html`, apagar `public/robots.txt` (ou trocar por `Allow`), remover `X-Robots-Tag` de `public/_headers`, `public/vercel.json` e `vercel.json`, e atualizar `CONFIG.siteUrl`.

## O que falta para publicar de forma definitiva
> **Depende da Dra. Ise:**
> 1. **Autorização das fotos**: retratos, consultório e, principalmente, os **casos de antes e depois** (consentimento escrito de cada paciente e adequação às normas do CFO sobre publicidade). As imagens foram tiradas do perfil dela a pedido do vendedor, só para este rascunho.
> 2. Como pode descrever **Estética facial**, **Rinomodelação**, **Rejuvenescimento** e **Laser** (hoje desligados ou descritos de forma geral).
> 3. Se o registro de especialista no CRO está regularizado para anunciar o título de especialista.
> 4. Se quer o lema do perfil (“naturalidade como assinatura”) no site, sabendo que é promessa de aparência.
> 5. Logo vetorial original.

Mapa: carregado do Google só quando a pessoa toca em “Mostrar mapa aqui” (sem cookies de terceiros antes disso).
