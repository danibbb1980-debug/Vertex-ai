# Josiane Zanateli | Estética Avançada (rascunho)

Site de página única para Josiane Zanateli, em Varginha - MG. Agendamento pelo WhatsApp.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies e sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (com HTML pré-renderizado e CSS inline)
npm run preview  # serve o dist/
```

## Onde editar

Tudo fica em **`src/config.ts`**. Campo vazio (`''`, `null`, lista vazia) = o bloco não aparece, e o layout se reorganiza.

| O quê | Campo |
|---|---|
| Ligar/desligar seções | `CONFIG.secoes` (`espaco`, `profissional`, `atendimentos`, `comoFunciona`, `duvidas`, `contato`, `agendar`, `ctaFinal`) |
| Atendimentos (lista, formulário e dúvidas se ajustam sozinhos) | `CONFIG.atendimentos`: acrescente `{ nome, descricao, mensagem }` |
| "Há 20 anos na estética" | `CONFIG.anosAtuacao`: use `null` para remover |
| Horários (texto, tabela, formulário e JSON-LD) | `CONFIG.horarios` |
| WhatsApp | `CONFIG.whatsapp` (só dígitos, com 55 + DDD), `CONFIG.whatsappExibicao` |
| E-mail do rodapé | `CONFIG.email`: `''` remove |
| Profissão / registro / responsável técnico | `CONFIG.profissional.profissao`, `.registro`, `CONFIG.responsavelTecnico` (hoje vazios, não aparecem) |
| URL pública (canonical, og:url, og:image) | `CONFIG.siteUrl` |

### Foto da profissional e outras fotos autorizadas

1. Coloque o arquivo original em `referencias/fotos/` (PNG ou JPG).
2. Rode `npm run fotos`: gera AVIF e WebP em 480, 800 e 1100 px em `public/fotos/`.
3. Aponte o nome-base em `CONFIG.profissional.foto.arquivo` e ajuste `alt`, `largura` e `altura` (proporção original).

`CONFIG.profissional.foto = null` remove o retrato; a seção vira só texto.

A foto atual foi recortada de um post do Instagram (publicação em parceria de `d.a.salon` e `josizanateli_estetica`),
enviada pelo vendedor. **Antes de publicar, confirme com a profissional a autorização de uso da imagem e o crédito
da foto.**

### Logo

Não há logo. O site usa uma assinatura tipográfica provisória (monograma "JZ" em contorno fino + nome em Besley).
Para usar o logo real, coloque o arquivo em `public/` e preencha `CONFIG.logo` (ex.: `'/logo.svg'`).

## Modo rascunho

`CONFIG.rascunho = true` mostra a faixa "Rascunho para avaliação..." e as metas `noindex, nofollow`.
O noindex também está em três outros lugares, que precisam ser revistos à mão ao publicar de vez:

- `public/robots.txt` (`Disallow: /`)
- `public/_headers` (`X-Robots-Tag: noindex, nofollow`)
- `vercel.json` (`headers`, mesmo cabeçalho)
- `public/privacidade.html` e `public/404.html` (faixa e meta robots)

## O que falta para publicar de forma definitiva

- **Logo** real da profissional.
- **Fotos autorizadas** (do espaço, se houver) e **autorização/crédito da foto do retrato**.
- **Confirmar "20 anos"** de atuação (informação do perfil do Instagram).
- **Confirmar a grafia** do nome e do e-mail: o Instagram usa "Josiane"; o e-mail é `josiannezanateli@hotmail.com` ("Josianne").
- **Profissão e registro profissional**, se houver (hoje nada é afirmado).
- **Lista real de atendimentos** e **horários** (os atuais vêm do Google Maps e do Instagram).
- Domínio próprio: atualizar `CONFIG.siteUrl`, desligar o rascunho e remover o noindex dos arquivos acima.
