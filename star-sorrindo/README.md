# Star Sorrindo Poços de Caldas — site (rascunho)

Site estático em HTML, CSS e JavaScript puros. Sem build, sem frameworks.
Para publicar: arraste a pasta (ou o ZIP) no [Netlify Drop](https://app.netlify.com/drop),
ou importe a pasta como projeto na Vercel (sem framework).

```
index.html        página única
privacidade.html  política de privacidade
404.html          página de erro
styles.css        estilos
main.js           CONFIG (dados da clínica) + menu e links
_headers          noindex (Netlify) — rascunho
vercel.json       noindex (Vercel) — rascunho
robots.txt        bloqueio de buscadores — rascunho
sitemap.xml       pronto para a publicação
assets/fotos/     fotos reais da clínica
assets/logo/      logo oficial
```

## Editar os dados da clínica

Tudo fica no bloco `CONFIG`, no topo do `main.js`: WhatsApp, telefone, endereço,
horários, nota do Google, links, responsável técnico, mensagens do WhatsApp e logo.

O HTML repete esses dados como texto inicial (para buscadores). O JavaScript
sobrescreve com o `CONFIG` ao abrir a página. Se mudar endereço ou horários,
atualize também o bloco `application/ld+json` no `<head>` do `index.html`.

## Trocar fotos

1. Coloque a foto em `assets/fotos/` (JPG ou WebP, de preferência com 1200 px ou mais no lado maior).
2. No `index.html`, procure a seção `EXPERIÊNCIA`. Cada espaço reservado é um
   `<div class="photo photo-placeholder" ...>`. Troque por:

   ```html
   <div class="photo">
     <img src="assets/fotos/recepcao.jpg" width="1200" height="900" loading="lazy" decoding="async" alt="Recepção da Star Sorrindo">
   </div>
   ```

   Use a largura e a altura reais da imagem e um `alt` que descreva a foto.

As fotos atuais (`fachada.jpg` e `consultorio.jpg`) vieram do Instagram e têm
baixa resolução (cerca de 300–400 px de largura). Vale pedir os originais à clínica.

## Trocar o logo

Coloque o arquivo em `assets/logo/` (SVG ou PNG com fundo transparente) e
preencha `CONFIG.logo`, ex.: `logo: 'assets/logo/logo.svg'`. Vazio, o site usa o
logo tipográfico temporário. O arquivo `logo-referencia-instagram.jpg` é só
referência (150 px, fundo branco), não serve para uso no site.

## Desligar o rascunho (publicação)

1. `main.js`: `rascunho: false` e `siteUrl` com o domínio definitivo.
2. `index.html`, `privacidade.html` e `404.html`: apague as metas `robots` e `googlebot`.
3. `index.html` e `privacidade.html`: se o domínio mudou, troque a URL no `canonical`,
   `og:url`, `og:image` e no JSON-LD. Faça o mesmo no `sitemap.xml`.
4. `_headers`: apague as linhas `/*` e `X-Robots-Tag`. Na Vercel, apague o bloco `headers` do `vercel.json`.
5. `robots.txt`: troque pelo conteúdo indicado no comentário do próprio arquivo (libera e referencia o sitemap).
6. Com o telefone confirmado, acrescente `"telephone": "+55 35 ..."` ao JSON-LD.

## A confirmar com a clínica

- [ ] **WhatsApp**: (35) 99888-3596 ou (35) 9888-3596? Valor provisório: `5535998883596`.
- [ ] **Horários**: seg a sex 9h–19h, sáb 8h–15h, dom fechado.
- [ ] **Serviços**: além de implantes, próteses e clínica geral, há outros?
- [ ] **Responsável técnico e CRO** (obrigatório na publicidade odontológica).
- [ ] **Compromissos de atendimento** (seção "Cuidado que vai além do procedimento").
- [ ] **Fotos** originais em boa resolução: fachada, recepção, consultórios, equipe, detalhes.
- [ ] **Logo** oficial em vetor (SVG) ou PNG transparente.
- [ ] **Domínio** definitivo.
- [ ] Nota e número de avaliações do Google atualizados.
