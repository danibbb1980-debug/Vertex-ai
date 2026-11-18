# Dr. Maurilio Caselato · site em rascunho

Site de página única do Dr. Maurilio Caselato, cirurgião-dentista em Varginha - MG.
Vite + React + TypeScript + Tailwind 4 + motion. Estático, sem backend, sem cookies, sem analytics.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/
```

## Onde editar

Tudo fica em `src/config.ts`. Campo vazio (`""`) ou lista vazia = o bloco não aparece, e o layout se reorganiza.

| O quê | Campo |
| --- | --- |
| Ligar/desligar seções | `CONFIG.secoes` |
| Faixa de rascunho + noindex nas metas | `CONFIG.rascunho` (ver "Publicar de vez") |
| Atendimentos (o índice cresce sozinho) | `CONFIG.atendimentos` — `{ nome, descricao }` |
| Especialidade (só com registro no CFO) | `CONFIG.especialidade` + `CONFIG.rqe` |
| Responsável técnico no rodapé | `CONFIG.responsavelTecnico` |
| WhatsApp, Instagram, endereço, horários | campos de mesmo nome |
| URL pública (canonical, og:url, og:image) | `CONFIG.siteUrl` |

### Fotos

1. Coloque a foto autorizada em `referencias/fotos-originais/`.
2. Registre-a em `scripts/fotos.py` (nome, recorte opcional, larguras) e rode `npm run fotos` (precisa de Python + Pillow). Isso gera `.webp` e `.jpg` em `public/fotos/`.
3. Adicione a entrada em `CONFIG.fotos.profissional` (hero e "O profissional") ou `CONFIG.fotos.consultorio` (galeria).

Os recortes atuais removem a TV e o banner com marca comercial da sala de atendimento e a pessoa que aparecia na recepção.

### Logo

O logotipo atual é **provisório** (SVG tipográfico em `src/components/Marks.tsx`). Para usar o definitivo, coloque `logo.svg` (versão escura sobre claro) e `logo-claro.svg` (versão clara sobre escuro) em `public/` e preencha `CONFIG.logo` e `CONFIG.logoEscuro`.

## Antes de publicar de vez

- [ ] Confirmar o registro **CRO-MG 22618** (no perfil aparece como `CROMG:22618`).
- [ ] Confirmar se há especialidade registrada (com RQE). Hoje o campo está vazio e nada é exibido.
- [ ] Confirmar que as fotos são do consultório da Rua Alferes Joaquim Antônio, 170 e que há autorização de uso (parte delas veio de uma página que também cita outros profissionais).
- [ ] Lista real de procedimentos (hoje: alinhadores transparentes e lentes de contato dental).
- [ ] Logo definitivo.
- [ ] Confirmar o número do WhatsApp (35) 98848-0014 e testar o link wa.me.
- [ ] Desligar o rascunho: `CONFIG.rascunho = false` **e** remover `Disallow: /` de `public/robots.txt`, o `X-Robots-Tag` de `public/_headers` e o bloco `headers` de `vercel.json`. As metas `noindex` de `privacidade.html` e `404.html` também ficam a cargo de quem publicar.
