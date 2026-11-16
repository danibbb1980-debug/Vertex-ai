# Danielle Souza | Estética Avançada — site (rascunho)

Página única para Danielle Souza, em Varginha - MG. Vite + React + TypeScript +
Tailwind 4 + `motion`. Site estático: sem backend, sem banco de dados, sem
cookies, sem analytics. O HTML é pré-renderizado no build e o React só hidrata.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (tsc + build do cliente + pré-renderização)
npm run preview    # serve o dist/ em http://localhost:4173
```

## Onde editar

Todos os dados ficam em **`src/config.ts`**. Campo vazio (`''`) ou lista vazia
= o bloco correspondente **não aparece** e o layout se reorganiza. Nada de
placeholder.

| O que | Onde |
|---|---|
| Ligar/desligar seções | `CONFIG.secoes` (`true`/`false`) |
| Procedimentos | `CONFIG.procedimentos`: cada item vira uma linha do índice, uma opção do formulário e entra nas Dúvidas e na meta description |
| Profissão e registro da profissional | `CONFIG.profissionais[0].profissao` e `.registro` (ex.: `'Biomédica'`, `'CRBM nº 00000'`). Aparecem abaixo do nome como "Profissão · Registro" |
| Responsável técnico | `CONFIG.responsavelTecnico` (nome **e** registro). Aparece no rodapé |
| Horários | `CONFIG.horarios` (o formulário gera os horários a partir daqui) |
| WhatsApp, e-mail, Instagram, endereço, mapa | campos com o mesmo nome em `CONFIG` |
| Desligar o rascunho | `CONFIG.rascunho = false` **e** veja "Publicação definitiva" abaixo |
| URL pública | `CONFIG.siteUrl` (canonical e `og:url`; o build recusa `localhost`) |

### Fotos da profissional

As fotos enviadas estão em `referencias/fotos-originais/` e são recortadas
(4:5) e otimizadas para `public/fotos/` com:

```bash
python3 -I scripts/fotos.py
```

O site usa `CONFIG.profissionais[0].fotos`: a primeira é o retrato principal,
a segunda entra menor ao lado/sobreposta. Para trocar, ajuste os recortes em
`scripts/fotos.py` ou a lista no config; lista vazia = seção só tipográfica.
Também funciona soltar uma foto em `referencias/fotos/` (entra automaticamente
depois das que estão no config). Nunca use foto de paciente, antes e depois ou
imagem de banco.

`public/og.jpg` (logo + retrato, 1200×630) é a imagem de compartilhamento; o
build inclui a meta `og:image` automaticamente quando o arquivo existe.

### Logo

`public/brand/logo.png` e `logo-branco.png` são recortes com fundo transparente
do arquivo original (`referencias/logo-original.jpg`, 599×426 px, JPEG). O site
usa as versões `.webp`. O recorte é refeito com:

```bash
pip install numpy pillow
python3 -I scripts/extrair-logo.py referencias/logo-original.jpg public/brand
```

Com o **logo em alta resolução** (SVG ou PNG grande), substitua os arquivos em
`public/brand/` e ajuste `CONFIG.logo` (caminhos, largura e altura).

A hélice do site (`src/lib/helice.ts`) é um desenho próprio, vetorial, feito a
partir das proporções do símbolo; a caligrafia do nome vem sempre do arquivo do
logo.

## Rascunho e indexação

Enquanto `CONFIG.rascunho` for `true`, o site mostra a faixa "Rascunho para
avaliação" e bloqueia indexação em três camadas:

1. metas `robots`/`googlebot` = `noindex, nofollow` (geradas do config);
2. `public/robots.txt` com `Disallow: /`;
3. cabeçalho `X-Robots-Tag: noindex, nofollow` em `public/_headers` (Netlify e
   similares) e em `vercel.json`.

### Publicação definitiva

1. `CONFIG.rascunho = false` e `CONFIG.siteUrl` com o domínio final;
2. `public/robots.txt`: troque por `User-agent: *` + `Allow: /`;
3. remova o `X-Robots-Tag` de `public/_headers` e de `vercel.json`;
4. troque o `href` canônico de `public/privacidade.html` e tire o `noindex` dela.

**Falta confirmar antes de publicar:**

- profissão e registro profissional da Danielle Souza;
- responsável técnico (nome e registro), se aplicável;
- grafia exata da rua (o Google Maps mostra "R. Alberto Cabre");
- lista real de procedimentos (hoje: toxina botulínica e preenchimento facial,
  conforme a bio do Instagram);
- confirmar que as duas fotos estão autorizadas para uso no site;
- logo em alta resolução.

## Formulário "Solicitar agendamento"

Só monta uma mensagem e abre `https://wa.me/<CONFIG.whatsapp>?text=...` em nova
aba (sem `opener`). Não envia nada a servidor, não usa `localStorage` nem
cookies. Sábados e domingos são bloqueados; os horários são blocos de 1 h a
partir da abertura, sendo a última opção o fechamento menos 1 h. Se o navegador
bloquear a nova aba, aparece o link "Abrir WhatsApp". Lógica em
`src/lib/agenda.ts`.

## Estrutura

```
src/config.ts              dados do site
src/components/secoes.tsx  hero, atendimento, procedimentos, profissional,
                           como funciona, dúvidas, localização, CTA, rodapé
src/components/agendar.tsx formulário
src/components/helice.tsx  hélice que se desenha (CSS, sem JS)
src/components/movimento.tsx hélice de rolagem e progresso (motion, carregado à parte)
src/lib/helice.ts          geometria da hélice
src/fonts/                 Newsreader 300 (opsz) e Hanken Grotesk 400/500, Latin-1
scripts/                   recorte do logo, subconjunto das fontes, pré-renderização
public/                    privacidade.html, 404.html, robots.txt, _headers, logo
```
